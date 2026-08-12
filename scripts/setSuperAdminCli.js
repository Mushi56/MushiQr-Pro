// scripts/setSuperAdminCli.js
// Direct Google Cloud Identity Toolkit API Super Admin Custom Claim Assigner
// Uses Firebase CLI credentials from ~/.config/configstore/firebase-tools.json

import fs from 'fs';
import path from 'path';
import os from 'os';
import dns from 'dns';

if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const TARGET_UID = 'dReErTCPtnO7AidJcakCASrjmEI2';
const PROJECT_ID = 'mushi-qr-pro';
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      console.warn(`Attempt ${i + 1} failed (${err.message}). Retrying in 2 seconds...`);
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function bootstrap() {
  console.log(`Starting ONE-TIME Super Admin Bootstrap for UID: ${TARGET_UID}...`);

  // 1. Read Firebase CLI refresh token
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (!fs.existsSync(configPath)) {
    console.error('❌ ERROR: Firebase CLI configuration not found.');
    process.exit(1);
  }

  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const refreshToken = configData?.tokens?.refresh_token;

  if (!refreshToken) {
    console.error('❌ ERROR: Firebase CLI refresh token not found.');
    process.exit(1);
  }

  // 2. Exchange refresh token for fresh OAuth2 access token
  console.log('Fetching Google OAuth2 access token...');
  const tokenRes = await fetchWithRetry('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('❌ ERROR: Failed to refresh OAuth2 token:', tokenData);
    process.exit(1);
  }

  const accessToken = tokenData.access_token;
  console.log('✅ Obtained valid Google OAuth2 Access Token.');

  // 3. Inspect target user existing claims via Identity Toolkit API
  console.log(`Retrieving target user details for UID: ${TARGET_UID}...`);
  const getUserRes = await fetchWithRetry(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      localId: [TARGET_UID],
    }),
  });

  const userData = await getUserRes.json();
  if (!userData.users || !userData.users.length) {
    console.error('❌ ERROR: Target user not found in Firebase Auth:', userData);
    process.exit(1);
  }

  const user = userData.users[0];
  console.log(`Found target user: ${user.email || user.localId} (${user.localId})`);
  
  let existingClaims = {};
  if (user.customAttributes) {
    try {
      existingClaims = JSON.parse(user.customAttributes);
    } catch {}
  }
  console.log('Existing custom claims:', existingClaims);

  // 4. Merge claims and set role = "super_admin" via accounts:update
  const updatedClaims = { ...existingClaims, role: 'super_admin' };
  console.log('Setting updated custom claims:', updatedClaims);

  const setClaimRes = await fetchWithRetry(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      localId: TARGET_UID,
      customAttributes: JSON.stringify(updatedClaims),
    }),
  });

  const setClaimData = await setClaimRes.json();
  if (setClaimData.error) {
    console.error('❌ ERROR: Failed to update custom claims:', setClaimData.error);
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('🎉 SUCCESS! BOOTSTRAP COMPLETED SUCCESSFULLY!');
  console.log(`Target UID: ${TARGET_UID}`);
  console.log('Assigned Claims:', JSON.parse(setClaimData.customAttributes || '{}'));
  console.log('======================================================\n');

  // 5. Verify final claims via lookup
  const verifyRes = await fetchWithRetry(`https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      localId: [TARGET_UID],
    }),
  });

  const verifyData = await verifyRes.json();
  const verifiedUser = verifyData.users?.[0];
  console.log('Verified Custom Attributes from Identity Toolkit API:');
  console.log(verifiedUser?.customAttributes || '(none)');

  // 6. Sync app_users profile document in Firestore
  console.log('Syncing app_users profile document in Firestore...');
  const firestoreRes = await fetchWithRetry(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/app_users/${TARGET_UID}?updateMask.fieldPaths=role`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        role: { stringValue: 'super_admin' },
      },
    }),
  });

  if (firestoreRes.ok) {
    console.log('✅ app_users profile doc in Firestore updated with role = "super_admin".');
  } else {
    console.warn('Firestore sync notice:', await firestoreRes.text());
  }
}

bootstrap().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
