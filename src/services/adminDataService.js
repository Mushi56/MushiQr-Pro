// src/services/adminDataService.js
// ─── Firebase-Ready Data Abstraction Layer ─────────────────────────────────
// All methods return Promises so swapping localStorage → Firestore
// requires ZERO UI changes — just replace this file.

// ── Storage Keys ──────────────────────────────────────────────────────────
const KEYS = {
  history:        'qrgen_history',
  saved:          'qrgen_saved',
  drafts:         'qrgen_drafts',
  cloudTemplates: 'qrgen_cloud_templates',
  appSettings:    'qrgen_app_settings',
  featureFlags:   'qrgen_feature_flags',
  announcement:   'qrgen_announcement',
  remoteConfig:   'qrgen_remote_config',
  auditLog:       'qrgen_audit_log',
  preferences:    'qrgen_preferences',
};

// ── Core helpers ──────────────────────────────────────────────────────────
function _read(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
}
function _write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch (e) { console.warn('[adminDataService] write failed:', key, e); }
}

// ── Internal Audit Logger ─────────────────────────────────────────────────
function _audit(action, meta = {}) {
  try {
    const log = _read(KEYS.auditLog) || [];
    log.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      action,
      meta,
      actor: 'super_admin',
      ts: new Date().toISOString(),
    });
    if (log.length > 500) log.pop();
    _write(KEYS.auditLog, log);
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════
// APP STATS
// ═══════════════════════════════════════════════════════════════════════════
export async function getAppStats() {
  const history = _read(KEYS.history) || [];
  const saved   = _read(KEYS.saved)   || [];
  const cloud   = _read(KEYS.cloudTemplates) || [];

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
  const history = _read(KEYS.history) || [];
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
export async function getHistory(limit = 100) {
  return (_read(KEYS.history) || []).slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════════════
// APP SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
export async function getAppSettings() {
  return _read(KEYS.appSettings) || {
    appName:            'Mushi QR Pro',
    brandColor:         '#D60036',
    welcomeText:        'Create and scan QR codes instantly!',
    maintenanceMode:    false,
    maintenanceMessage: 'We are performing scheduled maintenance. Please check back soon.',
    showWelcomeBanner:  true,
  };
}
export async function saveAppSettings(s) {
  _write(KEYS.appSettings, s);
  _audit('APP_SETTINGS_UPDATED');
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE FLAGS
// ═══════════════════════════════════════════════════════════════════════════
export async function getFeatureFlags() {
  return _read(KEYS.featureFlags) || {
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
  _write(KEYS.featureFlags, f);
  _audit('FEATURE_FLAGS_UPDATED');
  return f;
}

// ═══════════════════════════════════════════════════════════════════════════
// CLOUD TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════
export async function getCloudTemplates() {
  return _read(KEYS.cloudTemplates) || [];
}
export async function saveCloudTemplate(t) {
  const all = _read(KEYS.cloudTemplates) || [];
  const idx = all.findIndex(x => x.id === t.id);
  if (idx >= 0) all[idx] = t; else all.push(t);
  _write(KEYS.cloudTemplates, all);
  _audit('TEMPLATE_SAVED', { id: t.id, name: t.name });
  return t;
}
export async function deleteCloudTemplate(id) {
  const all = (_read(KEYS.cloudTemplates) || []).filter(t => t.id !== id);
  _write(KEYS.cloudTemplates, all);
  _audit('TEMPLATE_DELETED', { id });
}

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENT
// ═══════════════════════════════════════════════════════════════════════════
export async function getAnnouncement() {
  return _read(KEYS.announcement) || { title: '', message: '', active: false, type: 'info' };
}
export async function saveAnnouncement(a) {
  _write(KEYS.announcement, { ...a, updatedAt: new Date().toISOString() });
  _audit('ANNOUNCEMENT_UPDATED');
  return a;
}

// ═══════════════════════════════════════════════════════════════════════════
// REMOTE CONFIG
// ═══════════════════════════════════════════════════════════════════════════
export async function getRemoteConfig() {
  return _read(KEYS.remoteConfig) || {
    max_qr_size:       '2048',
    error_correction:  'H',
    support_email:     'support@mushiqr.pro',
    privacy_url:       'https://mushiqr.pro/privacy',
    terms_url:         'https://mushiqr.pro/terms',
  };
}
export async function saveRemoteConfig(c) {
  _write(KEYS.remoteConfig, c);
  _audit('REMOTE_CONFIG_UPDATED');
  return c;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════════════════════════════════════
export async function getAuditLog(limit = 100) {
  return (_read(KEYS.auditLog) || []).slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKUP & RESTORE
// ═══════════════════════════════════════════════════════════════════════════
export async function exportBackup() {
  const data = {};
  for (const [name, key] of Object.entries(KEYS)) {
    data[name] = _read(key);
  }
  return { version: '1.0', app: 'mushi-qr-pro', exportedAt: new Date().toISOString(), data };
}
export async function importBackup(backup) {
  if (!backup?.data) throw new Error('Invalid backup format');
  for (const [name, key] of Object.entries(KEYS)) {
    if (Object.prototype.hasOwnProperty.call(backup.data, name)) {
      _write(key, backup.data[name]);
    }
  }
  _audit('BACKUP_RESTORED', { exportedAt: backup.exportedAt });
}

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE INFO (synchronous utility)
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
