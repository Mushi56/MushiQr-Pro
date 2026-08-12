// src/services/FeatureAccessManager.js
// ─── Phase 2 Centralized Feature Registry & Feature Access Manager ──────────
// Authoritative single-client access decision layer. Evaluates canonical
// Feature Registry, global feature flags, subscription plan assignments,
// and real-time Firebase Firestore updates.

import { auth, db } from './firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { doc, onSnapshot, collection } from 'firebase/firestore';

// ═══════════════════════════════════════════════════════════════════════════
// 1. CANONICAL FEATURE REGISTRY (16 Real Application Features)
// ═══════════════════════════════════════════════════════════════════════════
export const FEATURE_REGISTRY = [
  // CORE
  {
    featureId: 'qr_generator',
    displayName: 'QR Code Generator',
    category: 'core',
    description: 'Create customizable standard, vCard & WiFi QR codes',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'barcode_generator',
    displayName: 'Barcode Generator',
    category: 'core',
    description: 'Generate standard 1D and 2D linear barcodes',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'scanner',
    displayName: 'QR & Barcode Scanner',
    category: 'core',
    description: 'Scan barcodes and QR codes via camera or image upload',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'history',
    displayName: 'History Tracking',
    category: 'core',
    description: 'Keep log of created and scanned QR & Barcode items',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'saved',
    displayName: 'Saved QR Collection',
    category: 'core',
    description: 'Bookmark favorite QR codes locally',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },

  // EXPORT
  {
    featureId: 'export_png',
    displayName: 'PNG Image Export',
    category: 'export',
    description: 'Export QR & Barcode codes as PNG images',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'export_jpg',
    displayName: 'JPG Image Export',
    category: 'export',
    description: 'Export QR & Barcode codes as JPG images',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'export_svg',
    displayName: 'SVG Vector Export',
    category: 'export',
    description: 'Download scalable SVG vector QR & Barcode graphics',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'export_pdf',
    displayName: 'PDF Document Export',
    category: 'export',
    description: 'Download printable PDF QR documents',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },

  // DESIGN
  {
    featureId: 'custom_logo',
    displayName: 'Custom Logo Embed',
    category: 'design',
    description: 'Overlay custom brand logos inside QR codes',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'custom_colors',
    displayName: 'Custom Colors & Gradients',
    category: 'design',
    description: 'Apply custom color palettes & gradient fills',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'custom_shapes',
    displayName: 'Custom Eye & Dot Shapes',
    category: 'design',
    description: 'Use custom dots, eye styles & outer frames',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
  {
    featureId: 'premium_templates',
    displayName: 'Premium Templates',
    category: 'design',
    description: 'Access curated premium QR design presets & templates',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },

  // GENERATION
  {
    featureId: 'bulk_generation',
    displayName: 'Bulk Batch Generation',
    category: 'generation',
    description: 'Batch process QR codes from CSV/Excel data',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },

  // CLOUD
  {
    featureId: 'cloud_sync',
    displayName: 'Cloud Templates & Sync',
    category: 'cloud',
    description: 'Sync QR templates & projects across devices in cloud',
    defaultEnabled: true,
    requiresAuthentication: true,
    allowSuperAdminOverride: true,
  },

  // SETTINGS
  {
    featureId: 'save_location',
    displayName: 'Save Location Preference',
    category: 'settings',
    description: 'Customize export storage directory on device',
    defaultEnabled: true,
    requiresAuthentication: false,
    allowSuperAdminOverride: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 2. SUBSCRIPTION PLAN DEFINITIONS (Exactly 4 Plans)
// ═══════════════════════════════════════════════════════════════════════════
export const CANONICAL_PLANS = ['free', 'weekly', 'monthly', 'yearly'];

export const DEFAULT_FREE_FEATURES = [
  'qr_generator',
  'barcode_generator',
  'scanner',
  'history',
  'saved',
  'export_png',
  'export_jpg',
  'save_location',
];

export const DEFAULT_PAID_FEATURES = FEATURE_REGISTRY.map(f => f.featureId);

// ═══════════════════════════════════════════════════════════════════════════
// 3. REASON & STATUS CODES
// ═══════════════════════════════════════════════════════════════════════════
export const REASON = {
  ALLOWED: 'ALLOWED',
  FEATURE_DISABLED: 'FEATURE_DISABLED',
  PLAN_REQUIRED: 'PLAN_REQUIRED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  UNKNOWN_FEATURE: 'UNKNOWN_FEATURE',
};

export const STATUS = {
  ALLOWED: 'allowed',
  DISABLED_BY_ADMIN: 'disabled_by_admin',
  REQUIRES_PLAN: 'requires_plan',
  REQUIRES_AUTHENTICATION: 'requires_authentication',
  UNKNOWN_FEATURE: 'unknown_feature',
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. CENTRALIZED FEATURE ACCESS MANAGER CLASS
// ═══════════════════════════════════════════════════════════════════════════
class FeatureAccessManagerService {
  constructor() {
    this.currentUser = null;
    this.userClaims = {};
    this.userSubscription = null;
    this.globalFlags = {};       // global_config/featureFlags doc
    this.planConfigs = {};       // subscription_plans/{planId} docs
    this.unsubFlags = null;
    this.unsubPlans = null;
    this.unsubSub = null;
    this.listeners = new Set();

    this.init();
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error('[FeatureAccessManager] Listener error:', e); }
    });
  }

  init() {
    // 1. Listen to Auth & Custom Claims
    onIdTokenChanged(auth, async (u) => {
      this.currentUser = u;
      if (u) {
        try {
          const res = await u.getIdTokenResult();
          this.userClaims = res.claims || {};
        } catch {
          this.userClaims = {};
        }
        this.listenUserSubscription(u.uid);
      } else {
        this.userClaims = {};
        this.userSubscription = null;
        if (this.unsubSub) this.unsubSub();
      }
      this.notifyListeners();
    });

    // 2. Real-time listener for global_config/featureFlags
    try {
      this.unsubFlags = onSnapshot(doc(db, 'global_config', 'featureFlags'), (docSnap) => {
        if (docSnap.exists()) {
          this.globalFlags = docSnap.data() || {};
        } else {
          this.globalFlags = {};
        }
        this.notifyListeners();
      }, (err) => console.warn('[FeatureAccessManager] Global flags listener notice:', err.message));
    } catch (e) {
      console.warn('[FeatureAccessManager] Failed to init globalFlags listener:', e);
    }

    // 3. Real-time listener for subscription_plans collection
    try {
      this.unsubPlans = onSnapshot(collection(db, 'subscription_plans'), (colSnap) => {
        const plans = {};
        colSnap.forEach(d => {
          plans[d.id] = d.data();
        });
        this.planConfigs = plans;
        this.notifyListeners();
      }, (err) => console.warn('[FeatureAccessManager] Plans listener notice:', err.message));
    } catch (e) {
      console.warn('[FeatureAccessManager] Failed to init plans listener:', e);
    }
  }

  listenUserSubscription(uid) {
    if (this.unsubSub) this.unsubSub();
    try {
      this.unsubSub = onSnapshot(doc(db, 'user_subscriptions', uid), (docSnap) => {
        if (docSnap.exists()) {
          this.userSubscription = docSnap.data();
        } else {
          this.userSubscription = null;
        }
        this.notifyListeners();
      }, () => {
        this.userSubscription = null;
        this.notifyListeners();
      });
    } catch (e) {
      this.userSubscription = null;
      this.notifyListeners();
    }
  }

  /**
   * Evaluates user's active plan ('free', 'weekly', 'monthly', 'yearly')
   */
  getUserPlan() {
    const sub = this.userSubscription;
    if (!sub) return 'free';

    const rawPlan = (sub.planId || '').toLowerCase();
    
    // Map legacy 'pro' or 'pro_monthly'/'pro_yearly'/'lifetime' to new canonical plans
    let plan = 'free';
    if (CANONICAL_PLANS.includes(rawPlan)) {
      plan = rawPlan;
    } else if (sub.isPro || rawPlan === 'pro' || rawPlan === 'pro_monthly' || rawPlan === 'pro_yearly' || rawPlan === 'lifetime') {
      plan = 'monthly'; // default legacy paid fallback
    }

    // Check expiration if applicable
    if (sub.expiryDate) {
      const expTime = new Date(sub.expiryDate).getTime();
      if (!isNaN(expTime) && Date.now() > expTime) {
        return 'free';
      }
    }

    if (sub.status === 'inactive' || sub.cancelled) {
      return 'free';
    }

    return plan;
  }

  /**
   * Primary Entitlement Access API
   */
  canUseFeature(featureId) {
    const featDef = FEATURE_REGISTRY.find(f => f.featureId === featureId);

    // 1. Validate feature exists in Registry
    if (!featDef) {
      return {
        allowed: false,
        reason: REASON.UNKNOWN_FEATURE,
        status: STATUS.UNKNOWN_FEATURE,
        featureId,
        requiredPlan: null,
      };
    }

    // 2. Check Global Feature Switch (global_config/featureFlags) FIRST
    // Emergency global disable turns feature off application-wide for ALL users
    const flagVal = this.globalFlags[featureId];
    const isGloballyEnabled = flagVal !== undefined ? Boolean(flagVal) : featDef.defaultEnabled;

    if (!isGloballyEnabled) {
      return {
        allowed: false,
        reason: REASON.FEATURE_DISABLED,
        status: STATUS.DISABLED_BY_ADMIN,
        featureId,
        requiredPlan: null,
      };
    }

    // 3. Check Authentication Requirement
    if (featDef.requiresAuthentication && !this.currentUser) {
      return {
        allowed: false,
        reason: REASON.UNAUTHENTICATED,
        status: STATUS.REQUIRES_AUTHENTICATION,
        featureId,
        requiredPlan: null,
      };
    }

    // 4. Super Admin Plan Entitlement Override
    // Super Admins bypass subscription plan paywalls for globally enabled features
    const isSuperAdmin = this.userClaims?.role === 'super_admin';
    if (isSuperAdmin && featDef.allowSuperAdminOverride) {
      return {
        allowed: true,
        reason: REASON.ALLOWED,
        status: STATUS.ALLOWED,
        featureId,
        requiredPlan: 'free',
        isSuperAdminOverride: true,
      };
    }

    // 5. Check User Subscription Plan Feature Assignment
    const userPlan = this.getUserPlan();
    const planConfig = this.planConfigs[userPlan];
    const allowedFeatures = planConfig?.features || (userPlan === 'free' ? DEFAULT_FREE_FEATURES : DEFAULT_PAID_FEATURES);

    if (!allowedFeatures.includes(featureId)) {
      return {
        allowed: false,
        reason: REASON.PLAN_REQUIRED,
        status: STATUS.REQUIRES_PLAN,
        featureId,
        requiredPlan: this.findMinimumPlanForFeature(featureId),
      };
    }

    return {
      allowed: true,
      reason: REASON.ALLOWED,
      status: STATUS.ALLOWED,
      featureId,
      requiredPlan: userPlan,
    };
  }

  requireAccess(featureId) {
    return this.canUseFeature(featureId);
  }

  getFeatureState(featureId) {
    return this.canUseFeature(featureId);
  }

  findMinimumPlanForFeature(featureId) {
    for (const pId of ['weekly', 'monthly', 'yearly']) {
      const feats = this.planConfigs[pId]?.features || DEFAULT_PAID_FEATURES;
      if (feats.includes(featureId)) return pId;
    }
    return 'weekly';
  }

  isFeatureAllowed(featureId) {
    return this.canUseFeature(featureId).allowed;
  }
}

export const FeatureAccessManager = new FeatureAccessManagerService();
export default FeatureAccessManager;
