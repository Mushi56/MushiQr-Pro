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

  // 2. Authorize caller via custom claim
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
