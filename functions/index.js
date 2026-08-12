// functions/index.js
// ─── Firebase Cloud Functions Backend for Mushi QR Pro ─────────────────────
// Handles trusted role assignment, authoritative subscription management,
// and server-side immutable audit logging.

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

/**
 * Trusted Helper: Writes immutable audit record to global_audit_logs
 */
async function writeAuditLog(actorUid, actorRole, action, targetUid, meta = {}) {
  try {
    await db.collection('global_audit_logs').add({
      action,
      actorUid: actorUid || 'system',
      actorRole: actorRole || 'system',
      targetUid: targetUid || null,
      meta,
      ts: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error('[CloudFunctions Audit Error]:', e);
  }
}

/**
 * Cloud Function A: setUserRole
 * Grants or modifies user custom claims and profile role.
 * Restricted to Super Admin only. Includes Last Super Admin Protection.
 */
exports.setUserRole = onCall(async (request) => {
  // 1. Authenticate caller
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to invoke this function.');
  }

  const callerUid = request.auth.uid;
  const callerClaims = request.auth.token || {};

  // 2. Authorize caller via custom claim (Strict: must be super_admin)
  if (callerClaims.role !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Only Super Admin users can assign or change user roles.');
  }

  const { targetUid, newRole } = request.data || {};
  const allowedRoles = ['super_admin', 'admin', 'editor', 'support', 'user'];

  // 3. Input Validation
  if (!targetUid || typeof targetUid !== 'string') {
    throw new HttpsError('invalid-argument', 'Valid targetUid string must be provided.');
  }
  if (!newRole || !allowedRoles.includes(newRole)) {
    throw new HttpsError('invalid-argument', `Invalid newRole. Allowed values: ${allowedRoles.join(', ')}.`);
  }

  // 4. Fetch target user
  let targetUser;
  try {
    targetUser = await admin.auth().getUser(targetUid);
  } catch (e) {
    throw new HttpsError('not-found', `Target user with UID ${targetUid} was not found.`);
  }

  const currentClaims = targetUser.customClaims || {};
  const currentRole = currentClaims.role || 'user';

  // 5. Last Super Admin Protection
  // Prevent demoting or removing the last remaining Super Admin
  if (currentRole === 'super_admin' && newRole !== 'super_admin') {
    const listResult = await admin.auth().listUsers(1000);
    const superAdminCount = listResult.users.filter(u => u.customClaims && u.customClaims.role === 'super_admin').length;

    if (superAdminCount <= 1) {
      throw new HttpsError(
        'failed-precondition',
        'Operation blocked: Cannot demote or remove the last remaining Super Admin.'
      );
    }
  }

  // 6. Update Custom Claims (Preserve existing claims while updating role)
  const updatedClaims = { ...currentClaims, role: newRole };
  await admin.auth().setCustomUserClaims(targetUid, updatedClaims);

  // 7. Sync role metadata to app_users/{targetUid}
  await db.collection('app_users').doc(targetUid).set({
    role: newRole,
    roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    roleUpdatedBy: callerUid,
  }, { merge: true });

  // 8. Write immutable server-side audit record
  await writeAuditLog(callerUid, 'super_admin', 'USER_ROLE_CHANGED', targetUid, {
    previousRole: currentRole,
    newRole,
  });

  return {
    success: true,
    message: `Successfully assigned role '${newRole}' to UID: ${targetUid}. User ID token refresh required.`,
  };
});

/**
 * Cloud Function B: updateUserSubscription
 * Authoritative subscription updates in user_subscriptions/{targetUid}.
 * Restricted to Super Admin role only.
 */
exports.updateUserSubscription = onCall(async (request) => {
  // 1. Authenticate caller
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to update subscriptions.');
  }

  const callerUid = request.auth.uid;
  const callerRole = request.auth.token?.role || 'user';

  // 2. Authorize caller (Super Admin only)
  if (callerRole !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Only Super Admin users can update user subscriptions.');
  }

  const { targetUid, planId, isPro, durationDays } = request.data || {};

  // 3. Input Validation
  if (!targetUid || typeof targetUid !== 'string') {
    throw new HttpsError('invalid-argument', 'Valid targetUid string must be provided.');
  }

  const validPlanId = planId || (isPro ? 'pro_monthly' : 'free');
  const proActive = Boolean(isPro);
  const now = new Date();
  
  let expiryDate = null;
  if (durationDays && typeof durationDays === 'number' && durationDays > 0) {
    expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  }

  // 4. Update authoritative user_subscriptions/{targetUid}
  const subRef = db.collection('user_subscriptions').doc(targetUid);
  const existingSubSnap = await subRef.get();
  const previousSub = existingSubSnap.exists ? existingSubSnap.data() : null;

  const newSubData = {
    planId: validPlanId,
    isPro: proActive,
    status: proActive ? 'active' : 'inactive',
    expiryDate,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: callerUid,
  };

  await subRef.set(newSubData, { merge: true });

  // 5. Sync non-authoritative profile metadata in app_users/{targetUid}
  await db.collection('app_users').doc(targetUid).set({
    isPro: proActive,
    planId: validPlanId,
    proGrantedAt: proActive ? now.toISOString() : null,
    proGrantedBy: proActive ? callerUid : null,
  }, { merge: true });

  // 6. Write immutable server-side audit log
  await writeAuditLog(callerUid, callerRole, 'USER_SUBSCRIPTION_UPDATED', targetUid, {
    previousPlanId: previousSub?.planId || 'free',
    previousIsPro: previousSub?.isPro || false,
    newPlanId: validPlanId,
    newIsPro: proActive,
    expiryDate,
  });

  return {
    success: true,
    message: `Successfully updated subscription for UID: ${targetUid}.`,
  };
});

// Canonical Feature Registry IDs for server-side validation
const CANONICAL_FEATURE_IDS = [
  'qr_generator',
  'barcode_generator',
  'scanner',
  'history',
  'saved',
  'cloud_sync',
  'export_png',
  'export_jpg',
  'export_svg',
  'export_pdf',
  'custom_logo',
  'custom_colors',
  'custom_shapes',
  'premium_templates',
  'bulk_generation',
  'save_location',
];

/**
 * Cloud Function C: updateFeatureFlag
 * Global feature enable/disable toggle.
 * Restricted to Super Admin role only.
 */
exports.updateFeatureFlag = onCall(async (request) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const callerUid = request.auth.uid;
  const callerRole = request.auth.token?.role || 'user';

  if (callerRole !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Only Super Admin users can modify feature flags.');
  }

  const { featureId, enabled } = request.data || {};

  if (!featureId || !CANONICAL_FEATURE_IDS.includes(featureId)) {
    throw new HttpsError('invalid-argument', `Invalid featureId '${featureId}'. Must be one of canonical Feature Registry.`);
  }

  if (typeof enabled !== 'boolean') {
    throw new HttpsError('invalid-argument', 'Enabled parameter must be a boolean value.');
  }

  const flagsRef = db.collection('global_config').doc('featureFlags');
  const snap = await flagsRef.get();
  const currentFlags = snap.exists ? snap.data() : {};
  const previousValue = currentFlags[featureId] !== undefined ? currentFlags[featureId] : true;

  await flagsRef.set({
    [featureId]: enabled,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: callerUid,
  }, { merge: true });

  await writeAuditLog(callerUid, callerRole, 'FEATURE_FLAG_UPDATED', null, {
    featureId,
    previousValue,
    newValue: enabled,
  });

  return {
    success: true,
    message: `Successfully updated feature flag '${featureId}' to ${enabled}.`,
  };
});

/**
 * Cloud Function D: updatePlanFeatures
 * Updates feature list associated with a subscription plan (free, weekly, monthly, yearly).
 * Restricted to Super Admin role only.
 */
exports.updatePlanFeatures = onCall(async (request) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const callerUid = request.auth.uid;
  const callerRole = request.auth.token?.role || 'user';

  if (callerRole !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Only Super Admin users can modify plan feature assignments.');
  }

  const { planId, features } = request.data || {};
  const allowedPlans = ['free', 'weekly', 'monthly', 'yearly'];

  if (!planId || !allowedPlans.includes(planId)) {
    throw new HttpsError('invalid-argument', `Invalid planId '${planId}'. Allowed plans: ${allowedPlans.join(', ')}.`);
  }

  if (!Array.isArray(features)) {
    throw new HttpsError('invalid-argument', 'Features parameter must be an array of canonical feature IDs.');
  }

  // Validate every feature ID and check for duplicates
  const validatedFeatures = [];
  for (const fId of features) {
    if (!CANONICAL_FEATURE_IDS.includes(fId)) {
      throw new HttpsError('invalid-argument', `Unknown feature ID '${fId}' cannot be assigned to plan.`);
    }
    if (!validatedFeatures.includes(fId)) {
      validatedFeatures.push(fId);
    }
  }

  const planRef = db.collection('subscription_plans').doc(planId);
  const snap = await planRef.get();
  const previousData = snap.exists ? snap.data() : {};

  const updatedData = {
    planId,
    name: planId.charAt(0).toUpperCase() + planId.slice(1),
    enabled: true,
    features: validatedFeatures,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: callerUid,
  };

  await planRef.set(updatedData, { merge: true });

  await writeAuditLog(callerUid, callerRole, 'PLAN_FEATURES_UPDATED', null, {
    planId,
    previousFeatures: previousData.features || [],
    newFeatures: validatedFeatures,
  });

  return {
    success: true,
    message: `Successfully updated features for plan '${planId}'.`,
    featureCount: validatedFeatures.length,
  };
});

/**
 * Cloud Function E: bootstrapSuperAdminOnce
 * ONE-TIME Super Admin Bootstrap.
 * Restricted strictly to target UID: dReErTCPtnO7AidJcakCASrjmEI2 ONLY.
 * Preserves existing claims and sets role = "super_admin".
 */
exports.bootstrapSuperAdminOnce = onCall(async (request) => {
  const targetUid = 'dReErTCPtnO7AidJcakCASrjmEI2';

  if (!request.auth || request.auth.uid !== targetUid) {
    throw new HttpsError('permission-denied', 'Unauthorized. Bootstrap is strictly restricted to designated target UID.');
  }

  let targetUser;
  try {
    targetUser = await admin.auth().getUser(targetUid);
  } catch (e) {
    throw new HttpsError('not-found', `Target user with UID ${targetUid} was not found.`);
  }

  const currentClaims = targetUser.customClaims || {};
  const updatedClaims = { ...currentClaims, role: 'super_admin' };

  await admin.auth().setCustomUserClaims(targetUid, updatedClaims);

  // Update app_users profile doc in Firestore
  await db.collection('app_users').doc(targetUid).set({
    role: 'super_admin',
    roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    roleUpdatedBy: 'bootstrapSuperAdminOnce',
  }, { merge: true });

  // Write immutable audit log
  await writeAuditLog(targetUid, 'super_admin', 'SUPER_ADMIN_BOOTSTRAP_EXECUTED', targetUid, {
    targetUid,
    previousClaims: currentClaims,
    newClaims: updatedClaims,
  });

  return {
    success: true,
    message: `Successfully bootstrapped Super Admin role for UID: ${targetUid}.`,
    claims: updatedClaims,
  };
});


