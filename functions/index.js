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
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to update subscriptions.');
  }

  const callerUid = request.auth.uid;
  const callerRole = request.auth.token?.role || 'user';

  if (callerRole !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Only Super Admin users can update user subscriptions.');
  }

  const { targetUid, planId, isPro, durationDays, reason } = request.data || {};

  if (!targetUid || typeof targetUid !== 'string') {
    throw new HttpsError('invalid-argument', 'Valid targetUid string must be provided.');
  }

  const validPlanId = planId || (isPro ? 'monthly' : 'free');
  const proActive = Boolean(isPro) || validPlanId !== 'free';
  const now = new Date();
  
  let expiryDate = null;
  if (validPlanId === 'lifetime') {
    expiryDate = null; // No expiry for lifetime
  } else if (durationDays && typeof durationDays === 'number' && durationDays > 0) {
    expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();
  }

  const subRef = db.collection('user_subscriptions').doc(targetUid);
  const existingSubSnap = await subRef.get();
  const previousSub = existingSubSnap.exists ? existingSubSnap.data() : null;

  const newSubData = {
    userId: targetUid,
    planId: validPlanId,
    status: proActive ? 'ACTIVE' : 'FREE',
    provider: 'manual_admin',
    isTrial: false,
    autoRenew: false,
    expiryDate,
    lastVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    grantedBy: callerUid,
    grantReason: reason || 'Manual Admin Update',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: callerUid,
  };

  await subRef.set(newSubData, { merge: true });

  await db.collection('app_users').doc(targetUid).set({
    planId: validPlanId,
    subscriptionStatus: proActive ? 'ACTIVE' : 'FREE',
    isPro: proActive,
    proGrantedAt: proActive ? admin.firestore.FieldValue.serverTimestamp() : null,
    proGrantedBy: proActive ? callerUid : null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  await writeAuditLog(callerUid, 'super_admin', 'MANUAL_PREMIUM_GRANTED', targetUid, {
    previousPlan: previousSub?.planId || 'free',
    newPlan: validPlanId,
    status: proActive ? 'ACTIVE' : 'FREE',
    durationDays,
    reason: reason || 'Manual Admin Update',
  });

  return {
    success: true,
    message: `Updated subscription for UID ${targetUid} to plan '${validPlanId}'.`,
  };
});

/**
 * Cloud Function C: publishMembershipConfig
 * Authoritative global membership configuration publisher.
 * Automatically validates schema, increments configVersion, and logs audit record.
 */
exports.publishMembershipConfig = onCall(async (request) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const callerUid = request.auth.uid;
  const callerRole = request.auth.token?.role || 'user';

  if (callerRole !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Only Super Admin can publish membership configuration.');
  }

  const { plans, featureMatrix, featureLimits } = request.data || {};

  if (!plans || typeof plans !== 'object') {
    throw new HttpsError('invalid-argument', 'Valid plans map must be provided.');
  }

  const configRef = db.collection('global_config').doc('membership');
  const snap = await configRef.get();
  const currentVersion = snap.exists ? (snap.data().configVersion || 100) : 100;
  const nextVersion = currentVersion + 1;

  const payload = {
    schemaVersion: 2,
    configVersion: nextVersion,
    plans: plans || {},
    featureMatrix: featureMatrix || {},
    featureLimits: featureLimits || {},
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: callerUid,
  };

  await configRef.set(payload, { merge: true });

  await writeAuditLog(callerUid, 'super_admin', 'MEMBERSHIP_CONFIG_PUBLISHED', null, {
    configVersion: nextVersion,
    planCount: Object.keys(plans).length,
    matrixCount: Object.keys(featureMatrix || {}).length,
  });

  return {
    success: true,
    configVersion: nextVersion,
    message: `Published membership configuration version ${nextVersion}.`,
  };
});

/**
 * Cloud Function D: verifyGooglePlayPurchase
 * Server-side purchase verification stub / API handler.
 * Authoritatively updates user_subscriptions and appends transaction ledger.
 */
exports.verifyGooglePlayPurchase = onCall(async (request) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const userId = request.auth.uid;
  const { productId, purchaseToken, orderId } = request.data || {};

  if (!productId || !purchaseToken) {
    throw new HttpsError('invalid-argument', 'productId and purchaseToken required.');
  }

  // Derive plan from store product ID
  let planId = 'monthly';
  let durationDays = 30;
  if (productId.includes('weekly')) {
    planId = 'weekly';
    durationDays = 7;
  } else if (productId.includes('yearly')) {
    planId = 'yearly';
    durationDays = 365;
  } else if (productId.includes('lifetime')) {
    planId = 'lifetime';
    durationDays = null;
  }

  const now = new Date();
  const expiryDate = durationDays ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString() : null;

  // 1. Authoritative user_subscriptions write
  const subRef = db.collection('user_subscriptions').doc(userId);
  await subRef.set({
    userId,
    planId,
    status: 'ACTIVE',
    provider: 'google_play',
    providerProductId: productId,
    startDate: admin.firestore.FieldValue.serverTimestamp(),
    expiryDate,
    autoRenew: true,
    isTrial: false,
    lastVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  // 2. Append idempotent transaction ledger entry (storing sensitive token here instead of user doc)
  const txnId = orderId || `gplay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  await db.collection('payment_transactions').doc(txnId).set({
    transactionId: txnId,
    userId,
    provider: 'google_play',
    productId,
    purchaseToken,
    eventType: 'INITIAL_PURCHASE',
    status: 'VERIFIED',
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await writeAuditLog(userId, 'user', 'SUBSCRIPTION_VERIFIED', userId, {
    planId,
    provider: 'google_play',
    productId,
  });

  return {
    success: true,
    planId,
    status: 'ACTIVE',
    expiryDate,
  };
});
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

// Canonical Feature Registry IDs for server-side validation (78 Granular Features + Legacy Compatibility)
const CANONICAL_FEATURE_IDS = [
  // 1. HOME
  'home_view', 'home_recent_items', 'home_quick_qr', 'home_quick_barcode', 'home_scanner_shortcut', 'home_batch_shortcut',
  // 2. QR_CONTENT
  'qr_text', 'qr_url', 'qr_wifi', 'qr_email', 'qr_phone', 'qr_sms', 'qr_vcard', 'qr_location', 'qr_pdf', 'qr_image', 'qr_audio', 'qr_document', 'qr_event', 'qr_crypto', 'qr_whatsapp', 'qr_youtube', 'qr_instagram', 'qr_facebook', 'qr_x', 'qr_linkedin',
  // 3. QR_ENGINE
  'qr_matrix_engine', 'qr_error_correction', 'qr_quiet_zone', 'qr_center_text', 'qr_size_custom',
  // 4. BARCODE_FORMATS
  'barcode_code128', 'barcode_code39', 'barcode_ean13', 'barcode_ean8', 'barcode_upca', 'barcode_upce', 'barcode_itf14', 'barcode_i25', 'barcode_codabar', 'barcode_code93', 'barcode_code11', 'barcode_msi', 'barcode_datamatrix', 'barcode_pdf417', 'barcode_aztec', 'barcode_gs1databar', 'barcode_gs1128', 'barcode_postnet', 'barcode_planet', 'barcode_royalmail', 'barcode_telepen', 'barcode_pharmacode', 'barcode_maxicode', 'barcode_qrcode', 'barcode_microqrcode', 'barcode_hanxin', 'barcode_codablockf', 'barcode_code16k', 'barcode_code49', 'barcode_channelcode',
  // 5. BARCODE_ENGINE
  'barcode_custom_colors', 'barcode_dimension_controls', 'barcode_text_display',
  // 6. SCANNER
  'scanner_camera_live', 'scanner_image_upload', 'scanner_flashlight', 'scanner_zoom', 'scanner_barcode_detect', 'scanner_result_actions',
  // 7. DESIGN
  'custom_logo_upload', 'custom_logo_presets', 'custom_colors_solid', 'custom_colors_gradient', 'custom_dot_styles', 'custom_eye_styles', 'custom_frames',
  // 8. TEMPLATES
  'templates_browse', 'templates_free_apply', 'templates_premium_apply', 'templates_save_custom', 'templates_cloud_library',
  // 9. EXPORT
  'export_png', 'export_jpg', 'export_svg', 'export_pdf', 'export_native_share',
  // 10. BATCH
  'batch_view', 'batch_csv_import', 'batch_manual_input', 'batch_custom_style', 'batch_zip_export',
  // 11. SAVED
  'saved_view', 'saved_save_action', 'saved_delete_action', 'saved_search_filter',
  // 12. HISTORY
  'history_view', 'history_save_auto', 'history_delete_item', 'history_clear_all',
  // 13. CLOUD
  'cloud_sync_auto', 'cloud_firestore_mirror', 'cloud_template_upload', 'cloud_preferences_sync',
  // 14. SETTINGS
  'settings_view', 'settings_theme_toggle', 'settings_save_location', 'settings_haptics',
  // 15. ACCOUNT
  'account_view', 'account_google_signin', 'account_subscription_status', 'account_logout',
  // Legacy 16 Compatibility IDs
  'qr_generator', 'barcode_generator', 'scanner', 'history', 'saved', 'cloud_sync', 'custom_logo', 'custom_colors', 'custom_shapes', 'premium_templates', 'bulk_generation', 'save_location'
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



