// admin/src/services/featureFlagsService.js
// â”€â”€â”€ Centralized Real-time Feature Flags Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Manages Firestore 'featureFlags' collection, synchronizes global_config/featureFlags,
// logs admin audit trails, and provides isFeatureEnabled evaluation.

import { db } from './firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  deleteDoc, onSnapshot, query, orderBy, serverTimestamp, addDoc 
} from 'firebase/firestore';

export const FEATURE_FLAGS_COLLECTION = 'featureFlags';

export const FLAG_CATEGORIES = [
  { id: 'Core Feature',   label: 'Core Feature',   color: '#22C55E', icon: 'CheckCircle' },
  { id: 'Monetization',   label: 'Monetization',   color: '#7B61FF', icon: 'Crown' },
  { id: 'Analytics',      label: 'Analytics',      color: '#3B82F6', icon: 'BarChart2' },
  { id: 'Productivity',   label: 'Productivity',   color: '#EC4899', icon: 'Layers' },
  { id: 'Customization',  label: 'Customization',  color: '#F59E0B', icon: 'Palette' },
  { id: 'Engagement',     label: 'Engagement',     color: '#06B6D4', icon: 'Sparkles' },
  { id: 'Developer',      label: 'Developer',      color: '#64748B', icon: 'Cpu' },
  { id: 'Security',       label: 'Security',       color: '#EF4444', icon: 'Shield' },
  { id: 'Experimental',   label: 'Experimental',   color: '#8B5CF6', icon: 'FlaskConical' },
];

export const ENVIRONMENTS = [
  { id: 'Production',  label: 'Production',  color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)' },
  { id: 'Staging',     label: 'Staging',     color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' },
  { id: 'Development', label: 'Development', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
  { id: 'Testing',     label: 'Testing',     color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' },
];

export const TARGETING_OPTIONS = [
  { id: 'all',        label: 'All Users (100%)', desc: 'Enabled for all visitors and registered users' },
  { id: 'premium',    label: 'Premium Users',    desc: 'Only users with an active paid subscription' },
  { id: 'free',       label: 'Free Users',       desc: 'Only free tier and unregistered users' },
  { id: 'admins',     label: 'Admins Only',      desc: 'Only Super Admins and authorized staff' },
  { id: 'percentage', label: 'Percentage Rollout',desc: 'Gradual random percentage of all traffic' },
  { id: 'specific',   label: 'Specific Users',   desc: 'Explicit whitelist of user IDs or emails' },
];

// â”€â”€ Initial Seed Data (Matches Reference Mockup & Core App Capabilities) â”€â”€â”€â”€â”€
export const INITIAL_FEATURE_FLAGS = [
  {
    id: 'premium_features',
    name: 'Premium Features',
    key: 'premium_features',
    description: 'Enable premium features for users who have active subscriptions.',
    category: 'Monetization',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    targetingLabel: 'All Users (100%)',
    rolloutPercentage: 100,
    icon: 'Crown',
    iconColor: '#FF4D9D',
    iconBg: 'rgba(255, 77, 157, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-10T10:30:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-14T08:45:00Z'
  },
  {
    id: 'qr_analytics',
    name: 'QR Code Analytics',
    key: 'qr_analytics',
    description: 'Show analytics and scan tracking metrics for generated QR codes.',
    category: 'Analytics',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    targetingLabel: 'All Users (100%)',
    rolloutPercentage: 100,
    icon: 'Grid',
    iconColor: '#3B82F6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-11T09:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-14T05:20:00Z'
  },
  {
    id: 'barcode_generation',
    name: 'Barcode Generation',
    key: 'barcode_generation',
    description: 'Enable advanced 1D and 2D barcode generation formats.',
    category: 'Core Feature',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    targetingLabel: 'All Users (100%)',
    rolloutPercentage: 100,
    icon: 'Barcode',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-09T14:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-13T16:10:00Z'
  },
  {
    id: 'bulk_qr_creation',
    name: 'Bulk QR Creation',
    key: 'bulk_qr_creation',
    description: 'Allow batch spreadsheet and grid bulk creation of QR codes.',
    category: 'Productivity',
    environment: 'Production',
    enabled: false,
    targeting: 'all',
    targetingLabel: 'All Users (100%)',
    rolloutPercentage: 100,
    icon: 'Layers',
    iconColor: '#8B5CF6',
    iconBg: 'rgba(139, 92, 246, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-08T11:20:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-13T10:00:00Z'
  },
  {
    id: 'ai_qr_code',
    name: 'AI QR Code',
    key: 'ai_qr_code',
    description: 'Generate artistic and styled QR codes using generative AI prompts.',
    category: 'Experimental',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    targetingLabel: 'All Users (100%)',
    rolloutPercentage: 100,
    icon: 'Sparkles',
    iconColor: '#EC4899',
    iconBg: 'rgba(236, 72, 153, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-12T15:30:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-14T07:15:00Z'
  },
  {
    id: 'custom_branding',
    name: 'Custom Branding',
    key: 'custom_branding',
    description: 'Allow embedding company logos, removing app watermarks and custom frames.',
    category: 'Customization',
    environment: 'Production',
    enabled: true,
    targeting: 'premium',
    targetingLabel: 'Premium Users',
    rolloutPercentage: 100,
    icon: 'Palette',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-07T12:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-12T11:00:00Z'
  },
  {
    id: 'svg_export',
    name: 'Vector SVG & PDF Export',
    key: 'svg_export',
    description: 'Allow exporting print-ready vector SVG, EPS, and high-DPI PDF formats.',
    category: 'Productivity',
    environment: 'Production',
    enabled: true,
    targeting: 'premium',
    targetingLabel: 'Premium Users',
    rolloutPercentage: 100,
    icon: 'Download',
    iconColor: '#22C55E',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-06T08:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-11T14:20:00Z'
  },
  {
    id: 'cloud_templates',
    name: 'Cloud Templates Library',
    key: 'cloud_templates',
    description: 'Sync, explore and apply community & premium cloud templates.',
    category: 'Engagement',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    targetingLabel: 'All Users (100%)',
    rolloutPercentage: 100,
    icon: 'Cloud',
    iconColor: '#06B6D4',
    iconBg: 'rgba(6, 182, 212, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-05T10:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-10T12:00:00Z'
  },
  {
    id: 'developer_api',
    name: 'Developer REST API',
    key: 'developer_api',
    description: 'Enable developer API keys, webhooks and REST endpoints.',
    category: 'Developer',
    environment: 'Staging',
    enabled: false,
    targeting: 'admins',
    targetingLabel: 'Admins Only',
    rolloutPercentage: 100,
    icon: 'Cpu',
    iconColor: '#64748B',
    iconBg: 'rgba(100, 116, 139, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-04T16:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-09T09:30:00Z'
  },
  {
    id: 'batch_scan',
    name: 'Continuous Batch Scanner',
    key: 'batch_scan',
    description: 'High-speed continuous camera scanning mode for inventory counting.',
    category: 'Core Feature',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    targetingLabel: 'All Users (100%)',
    rolloutPercentage: 100,
    icon: 'ScanLine',
    iconColor: '#22C55E',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-03T11:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-08T15:00:00Z'
  },
  {
    id: 'password_qr',
    name: 'Password Protected Links',
    key: 'password_qr',
    description: 'Lock dynamic QR links behind encrypted pin codes and passwords.',
    category: 'Security',
    environment: 'Production',
    enabled: true,
    targeting: 'premium',
    targetingLabel: 'Premium Users',
    rolloutPercentage: 100,
    icon: 'Shield',
    iconColor: '#EF4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-02T14:30:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-07T11:45:00Z'
  },
  {
    id: 'geo_tracking',
    name: 'Precision Geo Tracking',
    key: 'geo_tracking',
    description: 'Track GPS and city-level geolocation coordinates for scan analytics.',
    category: 'Analytics',
    environment: 'Production',
    enabled: false,
    targeting: 'percentage',
    targetingLabel: '50% Rollout',
    rolloutPercentage: 50,
    icon: 'MapPin',
    iconColor: '#3B82F6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    createdBy: 'Super Admin',
    createdAt: '2025-05-01T09:00:00Z',
    updatedBy: 'Super Admin',
    updatedAt: '2025-05-06T17:00:00Z'
  }
];

let _cachedFlagsMap = {};

async function recordAuditLog(action, details, currentUser) {
  try {
    const colRef = collection(db, 'global_audit_logs');
    await addDoc(colRef, {
      action,
      details,
      actor: currentUser?.email || 'Super Admin',
      actorId: currentUser?.uid || 'super-admin',
      ts: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.warn('[FeatureFlagsService] Audit log write warning:', e?.message);
  }
}

async function syncGlobalConfigDoc(flagsList) {
  try {
    const map = {};
    flagsList.forEach(f => {
      if (f.key) map[f.key] = f.enabled;
    });
    _cachedFlagsMap = map;
    const globalRef = doc(db, 'global_config', 'featureFlags');
    await setDoc(globalRef, { ...map, _updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.warn('[FeatureFlagsService] Global doc sync warning:', e?.message);
  }
}

export function subscribeFeatureFlags(onSuccess, onError) {
  const colRef = collection(db, FEATURE_FLAGS_COLLECTION);
  const q = query(colRef);

  return onSnapshot(q, async (snapshot) => {
    try {
      if (snapshot.empty) {
        console.log('[FeatureFlagsService] Seeding initial feature flags to Firestore...');
        await seedInitialFlags();
        return;
      }

      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

      const map = {};
      list.forEach(f => { map[f.key] = f.enabled; });
      _cachedFlagsMap = map;

      onSuccess(list);
    } catch (err) {
      console.error('[FeatureFlagsService] Snapshot error:', err);
      if (onError) onError(err);
    }
  }, (error) => {
    console.error('[FeatureFlagsService] Listener error:', error);
    onSuccess(INITIAL_FEATURE_FLAGS);
    if (onError) onError(error);
  });
}

export async function seedInitialFlags() {
  try {
    const batchPromises = INITIAL_FEATURE_FLAGS.map(flag => {
      const docRef = doc(db, FEATURE_FLAGS_COLLECTION, flag.id);
      return setDoc(docRef, { ...flag, _syncedAt: new Date().toISOString() });
    });
    await Promise.all(batchPromises);
    await syncGlobalConfigDoc(INITIAL_FEATURE_FLAGS);
    return true;
  } catch (e) {
    console.error('[FeatureFlagsService] Seeding error:', e);
    return false;
  }
}

export async function toggleFeatureFlag(flagId, enabled, currentUser) {
  try {
    const docRef = doc(db, FEATURE_FLAGS_COLLECTION, flagId);
    const now = new Date().toISOString();
    const updater = {
      enabled: Boolean(enabled),
      updatedBy: currentUser?.displayName || currentUser?.email || 'Super Admin',
      updatedAt: now,
    };

    await updateDoc(docRef, updater);
    _cachedFlagsMap[flagId] = Boolean(enabled);

    const globalRef = doc(db, 'global_config', 'featureFlags');
    await setDoc(globalRef, { [flagId]: Boolean(enabled), _updatedAt: now }, { merge: true });

    await recordAuditLog(
      enabled ? 'FEATURE_FLAG_ENABLED' : 'FEATURE_FLAG_DISABLED',
      { flagId, enabled },
      currentUser
    );

    return { success: true };
  } catch (e) {
    console.error('[FeatureFlagsService] toggleFeatureFlag failed:', e);
    throw e;
  }
}

export async function createFeatureFlag(flagData, currentUser) {
  try {
    const key = (flagData.key || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!key) throw new Error('Valid feature key is required (e.g. premium_features)');

    const docId = key;
    const docRef = doc(db, FEATURE_FLAGS_COLLECTION, docId);

    const existing = await getDoc(docRef);
    if (existing.exists()) {
      throw new Error(`A feature flag with key "${key}" already exists.`);
    }

    const now = new Date().toISOString();
    const newFlag = {
      id: docId,
      key,
      name: flagData.name || key,
      description: flagData.description || '',
      category: flagData.category || 'Core Feature',
      environment: flagData.environment || 'Production',
      enabled: Boolean(flagData.enabled),
      targeting: flagData.targeting || 'all',
      targetingLabel: getTargetingLabel(flagData.targeting, flagData.rolloutPercentage),
      rolloutPercentage: Number(flagData.rolloutPercentage ?? 100),
      icon: flagData.icon || 'Flag',
      iconColor: flagData.iconColor || '#FF4D9D',
      iconBg: flagData.iconBg || 'rgba(255, 77, 157, 0.12)',
      createdBy: currentUser?.displayName || currentUser?.email || 'Super Admin',
      createdAt: now,
      updatedBy: currentUser?.displayName || currentUser?.email || 'Super Admin',
      updatedAt: now,
    };

    await setDoc(docRef, newFlag);

    const globalRef = doc(db, 'global_config', 'featureFlags');
    await setDoc(globalRef, { [key]: newFlag.enabled, _updatedAt: now }, { merge: true });

    await recordAuditLog('FEATURE_FLAG_CREATED', { key, name: newFlag.name, enabled: newFlag.enabled }, currentUser);

    return { success: true, flag: newFlag };
  } catch (e) {
    console.error('[FeatureFlagsService] createFeatureFlag failed:', e);
    throw e;
  }
}

export async function updateFeatureFlag(flagId, flagData, currentUser) {
  try {
    const docRef = doc(db, FEATURE_FLAGS_COLLECTION, flagId);
    const now = new Date().toISOString();

    const updates = {
      name: flagData.name,
      description: flagData.description || '',
      category: flagData.category,
      environment: flagData.environment,
      enabled: Boolean(flagData.enabled),
      targeting: flagData.targeting,
      targetingLabel: getTargetingLabel(flagData.targeting, flagData.rolloutPercentage),
      rolloutPercentage: Number(flagData.rolloutPercentage ?? 100),
      updatedBy: currentUser?.displayName || currentUser?.email || 'Super Admin',
      updatedAt: now,
    };

    if (flagData.icon) updates.icon = flagData.icon;
    if (flagData.iconColor) updates.iconColor = flagData.iconColor;

    await updateDoc(docRef, updates);

    const key = flagData.key || flagId;
    const globalRef = doc(db, 'global_config', 'featureFlags');
    await setDoc(globalRef, { [key]: updates.enabled, _updatedAt: now }, { merge: true });

    await recordAuditLog('FEATURE_FLAG_UPDATED', { flagId, updates }, currentUser);

    return { success: true };
  } catch (e) {
    console.error('[FeatureFlagsService] updateFeatureFlag failed:', e);
    throw e;
  }
}

export async function deleteFeatureFlag(flagId, currentUser) {
  try {
    const docRef = doc(db, FEATURE_FLAGS_COLLECTION, flagId);
    await deleteDoc(docRef);

    await recordAuditLog('FEATURE_FLAG_DELETED', { flagId }, currentUser);

    return { success: true };
  } catch (e) {
    console.error('[FeatureFlagsService] deleteFeatureFlag failed:', e);
    throw e;
  }
}

export function isFeatureEnabled(flagKey, userContext = null) {
  if (!flagKey) return true;

  if (_cachedFlagsMap[flagKey] !== undefined) {
    return Boolean(_cachedFlagsMap[flagKey]);
  }

  const found = INITIAL_FEATURE_FLAGS.find(f => f.key === flagKey || f.id === flagKey);
  return found ? Boolean(found.enabled) : true;
}

export function getTargetingLabel(type = 'all', percentage = 100) {
  switch (type) {
    case 'all': return 'All Users (100%)';
    case 'premium': return 'Premium Users';
    case 'free': return 'Free Users';
    case 'admins': return 'Admins Only';
    case 'percentage': return `${percentage || 50}% Rollout`;
    case 'specific': return 'Specific Users';
    default: return 'All Users';
  }
}
