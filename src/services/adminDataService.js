// src/services/adminDataService.js
// ─── Firebase-Ready Data Abstraction Layer ─────────────────────────────────
// All methods read and write globally in Firestore so that any config changes
// apply to all users in real-time.

import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, addDoc, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';

// Helper to audit actions in Firestore
async function _audit(action, meta = {}) {
  try {
    const logsRef = collection(db, 'global_audit_logs');
    await addDoc(logsRef, {
      action,
      meta,
      actor: 'super_admin',
      ts: new Date().toISOString()
    });
  } catch (e) {
    console.error('[adminDataService] audit log failed:', e);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// APP STATS
// ═══════════════════════════════════════════════════════════════════════════
export async function getAppStats() {
  const _read = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const history = _read('qrgen_history') || [];
  const saved   = _read('qrgen_saved')   || [];
  const cloud   = await getCloudTemplates();

  return {
    historyCount:   history.length,
    savedCount:     saved.length,
    cloudTemplates: cloud.length,
    qrCount:        history.filter(h => !h.barcodeType && !h.isBatch).length,
    barcodeCount:   history.filter(h =>  h.barcodeType).length,
    batchCount:     history.filter(h =>  h.isBatch).length,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVITY CHART (last N days)
// ═══════════════════════════════════════════════════════════════════════════
export async function getActivityChartData(days = 7) {
  const _read = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const history = _read('qrgen_history') || [];
  const result  = [];
  for (let i = days - 1; i >= 0; i--) {
    const d  = new Date();
    d.setDate(d.getDate() - i);
    const ds    = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    const qr      = history.filter(h => h.timestamp?.startsWith(ds) && !h.barcodeType).length;
    const barcode = history.filter(h => h.timestamp?.startsWith(ds) &&  h.barcodeType).length;
    result.push({ label, ds, qr, barcode, total: qr + barcode });
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════════════════════════
export async function getHistory(limitVal = 100) {
  const _read = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  return (_read('qrgen_history') || []).slice(0, limitVal);
}

// ═══════════════════════════════════════════════════════════════════════════
// APP SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
export async function getAppSettings() {
  try {
    const docRef = doc(db, 'global_config', 'appSettings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    console.error('getAppSettings error:', e);
  }
  return {
    appName:            'Mushi QR Pro',
    brandColor:         '#D60036',
    welcomeText:        'Create and scan QR codes instantly!',
    maintenanceMode:    false,
    maintenanceMessage: 'We are performing scheduled maintenance. Please check back soon.',
    showWelcomeBanner:  true,
  };
}
export async function saveAppSettings(s) {
  const docRef = doc(db, 'global_config', 'appSettings');
  await setDoc(docRef, s);
  _audit('APP_SETTINGS_UPDATED');
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE FLAGS
// ═══════════════════════════════════════════════════════════════════════════
export async function getFeatureFlags() {
  try {
    const docRef = doc(db, 'global_config', 'featureFlags');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    console.error('getFeatureFlags error:', e);
  }
  return {
    qr_generator:      true,
    barcode_generator: true,
    scanner:           true,
    bulk_generation:   true,
    templates:         true,
    history:           true,
    saved:             true,
    export_png:        true,
    export_svg:        true,
    export_pdf:        true,
    dark_mode:         true,
    pwa_install:       true,
  };
}
export async function saveFeatureFlags(f) {
  const docRef = doc(db, 'global_config', 'featureFlags');
  await setDoc(docRef, f);
  _audit('FEATURE_FLAGS_UPDATED');
  return f;
}

// ═══════════════════════════════════════════════════════════════════════════
// CLOUD TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════
export async function getCloudTemplates() {
  try {
    const colRef = collection(db, 'global_templates');
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    return list;
  } catch (e) {
    console.error('getCloudTemplates error:', e);
    return [];
  }
}
export async function saveCloudTemplate(t) {
  const docRef = doc(db, 'global_templates', t.id);
  await setDoc(docRef, t);
  _audit('TEMPLATE_SAVED', { id: t.id, name: t.name });
  return t;
}
export async function deleteCloudTemplate(id) {
  const docRef = doc(db, 'global_templates', id);
  await deleteDoc(docRef);
  _audit('TEMPLATE_DELETED', { id });
}

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENT
// ═══════════════════════════════════════════════════════════════════════════
export async function getAnnouncement() {
  try {
    const docRef = doc(db, 'global_config', 'announcement');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    console.error('getAnnouncement error:', e);
  }
  return { title: '', message: '', active: false, type: 'info' };
}
export async function saveAnnouncement(a) {
  const docRef = doc(db, 'global_config', 'announcement');
  await setDoc(docRef, { ...a, updatedAt: new Date().toISOString() });
  _audit('ANNOUNCEMENT_UPDATED');
  return a;
}

// ═══════════════════════════════════════════════════════════════════════════
// REMOTE CONFIG
// ═══════════════════════════════════════════════════════════════════════════
export async function getRemoteConfig() {
  try {
    const docRef = doc(db, 'global_config', 'remoteConfig');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    console.error('getRemoteConfig error:', e);
  }
  return {
    max_qr_size:       '2048',
    error_correction:  'H',
    support_email:     'support@mushiqr.pro',
    privacy_url:       'https://mushiqr.pro/privacy',
    terms_url:         'https://mushiqr.pro/terms',
  };
}
export async function saveRemoteConfig(c) {
  const docRef = doc(db, 'global_config', 'remoteConfig');
  await setDoc(docRef, c);
  _audit('REMOTE_CONFIG_UPDATED');
  return c;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════════════════════════════════════
export async function getAuditLog(limitVal = 100) {
  try {
    const colRef = collection(db, 'global_audit_logs');
    const q = query(colRef, orderBy('ts', 'desc'), firestoreLimit(limitVal));
    const snap = await getDocs(q);
    const list = [];
    snap.forEach(d => list.push({ ...d.data(), id: d.id }));
    return list;
  } catch (e) {
    console.error('getAuditLog error:', e);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKUP & RESTORE
// ═══════════════════════════════════════════════════════════════════════════
export async function exportBackup() {
  const appSettings = await getAppSettings();
  const featureFlags = await getFeatureFlags();
  const announcement = await getAnnouncement();
  const remoteConfig = await getRemoteConfig();
  const cloudTemplates = await getCloudTemplates();
  const auditLog = await getAuditLog();
  
  return {
    version: '1.0',
    app: 'mushi-qr-pro',
    exportedAt: new Date().toISOString(),
    data: { appSettings, featureFlags, announcement, remoteConfig, cloudTemplates, auditLog }
  };
}

export async function importBackup(backup) {
  if (!backup?.data) throw new Error('Invalid backup format');
  const d = backup.data;
  if (d.appSettings) await saveAppSettings(d.appSettings);
  if (d.featureFlags) await saveFeatureFlags(d.featureFlags);
  if (d.announcement) await saveAnnouncement(d.announcement);
  if (d.remoteConfig) await saveRemoteConfig(d.remoteConfig);
  if (d.cloudTemplates && Array.isArray(d.cloudTemplates)) {
    for (const t of d.cloudTemplates) {
      await saveCloudTemplate(t);
    }
  }
  _audit('BACKUP_RESTORED', { exportedAt: backup.exportedAt });
}

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE INFO
// ═══════════════════════════════════════════════════════════════════════════
export function getStorageInfo() {
  let total = 0;
  const breakdown = {};
  for (const k of Object.keys(localStorage)) {
    const size = ((localStorage.getItem(k) || '').length + k.length) * 2;
    total += size;
    breakdown[k] = size;
  }
  const kb = total / 1024;
  return {
    totalBytes: total,
    breakdown,
    used: kb < 1024 ? kb.toFixed(1) + ' KB' : (kb / 1024).toFixed(2) + ' MB',
  };
}
