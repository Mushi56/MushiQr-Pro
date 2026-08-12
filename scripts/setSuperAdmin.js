// scripts/setSuperAdmin.js
// ─── Super Admin Custom Claim Assigner ─────────────────────────────────────
// Grants { role: "super_admin" } custom claim to a target Firebase Auth UID.
// Usage:
//   node scripts/setSuperAdmin.js <TARGET_UID>
// Example:
//   node scripts/setSuperAdmin.js abc123xyz456

let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  try {
    admin = require('../functions/node_modules/firebase-admin');
  } catch (err) {
    console.error('\n❌ ERROR: firebase-admin module not found. Please run: npm --prefix functions install\n');
    process.exit(1);
  }
}

// Check arguments
const targetUid = process.argv[2];

if (!targetUid) {
  console.error('\n❌ ERROR: Target UID required.');
  console.log('\nUsage:');
  console.log('  node scripts/setSuperAdmin.js <TARGET_UID>\n');
  process.exit(1);
}

// Initialize Admin SDK using default Google Application Credentials or service account
try {
  admin.initializeApp();
} catch (e) {
  console.error('Failed to initialize Firebase Admin SDK. Make sure GOOGLE_APPLICATION_CREDENTIALS is set or firebase CLI is authenticated.');
  process.exit(1);
}

async function run() {
  try {
    const user = await admin.auth().getUser(targetUid);
    console.log(`Found user: ${user.email || user.uid} (${user.uid})`);

    const currentClaims = user.customClaims || {};
    const updatedClaims = { ...currentClaims, role: 'super_admin' };

    await admin.auth().setCustomUserClaims(targetUid, updatedClaims);
    console.log(`\n✅ SUCCESS: Custom claim { role: "super_admin" } assigned to UID: ${targetUid}`);

    // Update app_users profile doc in Firestore if exists
    await admin.firestore().collection('app_users').doc(targetUid).set({
      role: 'super_admin',
      roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      roleUpdatedBy: 'bootstrap_script',
    }, { merge: true });

    console.log('✅ Updated app_users profile doc in Firestore.');
    console.log('\nNOTE: The target user must sign out and sign back in (or refresh their ID token) for the new claim to take effect in client apps.\n');
  } catch (err) {
    console.error('\n❌ Failed to set super_admin claim:', err.message);
    process.exit(1);
  }
}

run();
