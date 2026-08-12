// scripts/setSuperAdmin.js
// ─── Super Admin Custom Claim Assigner ─────────────────────────────────────
// Grants { role: "super_admin" } custom claim to a target Firebase Auth UID.
// Usage:
//   node scripts/setSuperAdmin.js <TARGET_UID>
// Example:
//   node scripts/setSuperAdmin.js dReErTCPtnO7AidJcakCASrjmEI2

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  try {
    admin = require(path.resolve(__dirname, '../functions/node_modules/firebase-admin'));
  } catch (err) {
    console.error('\n❌ ERROR: firebase-admin module not found.\n');
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

// Read CLI credential token from firebase-tools configstore if available
let credentialOption;
try {
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (fs.existsSync(configPath)) {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const accessToken = configData?.tokens?.access_token;
    if (accessToken) {
      credentialOption = {
        getAccessToken: async () => ({
          access_token: accessToken,
          expires_in: 3600,
        })
      };
    }
  }
} catch (e) {
  console.warn('Notice: Could not load CLI credentials.');
}

// Initialize Admin SDK
try {
  admin.initializeApp({
    credential: credentialOption,
    projectId: 'mushi-qr-pro',
  });
} catch (e) {
  console.error('Failed to initialize Firebase Admin SDK:', e.message);
  process.exit(1);
}

async function run() {
  try {
    const user = await admin.auth().getUser(targetUid);
    console.log(`\nFound Firebase Auth User:`);
    console.log(`- UID: ${user.uid}`);
    console.log(`- Email: ${user.email || '(no email)'}`);
    console.log(`- Current Custom Claims:`, user.customClaims || {});

    const currentClaims = user.customClaims || {};
    const updatedClaims = { ...currentClaims, role: 'super_admin' };

    await admin.auth().setCustomUserClaims(targetUid, updatedClaims);
    console.log(`\n✅ SUCCESS: Custom claim { role: "super_admin" } assigned to UID: ${targetUid}`);

    // Verify resulting claims
    const verifiedUser = await admin.auth().getUser(targetUid);
    console.log(`- Verified Custom Claims:`, verifiedUser.customClaims);

    // Update app_users profile doc in Firestore if exists
    try {
      await admin.firestore().collection('app_users').doc(targetUid).set({
        role: 'super_admin',
        roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        roleUpdatedBy: 'bootstrap_script',
      }, { merge: true });
      console.log('✅ Updated app_users profile doc in Firestore.');
    } catch (fsErr) {
      console.warn('Firestore doc update notice:', fsErr.message);
    }

    console.log('\nNOTE: The user must sign out and sign back in (or force getIdTokenResult(true)) for the new claim to take effect in client apps.\n');
  } catch (err) {
    console.error('\n❌ Failed to set super_admin claim:', err.message);
    process.exit(1);
  }
}

run();
