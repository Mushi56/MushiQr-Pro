// src/services/FeatureAccessManager.js
// ─── Centralized Feature Entitlement & Feature Flag Manager ─────────────────
// Handles global feature toggle checks, maintenance modes, subscription entitlement verification,
// plan hierarchy evaluation, and in-memory config caching.

import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { getUserSubscription } from './adminDataService';

// ─── FEATURE REGISTRY (Discovered application features) ──────────────────────
export const FEATURE_REGISTRY = [
  { id: 'qr_generator',      name: 'QR Code Generator',      category: 'core',       description: 'Create customizable standard & vCard QR codes', enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },
  { id: 'barcode_generator', name: 'Barcode Generator',     category: 'core',       description: 'Generate standard 1D/2D linear barcodes',       enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },
  { id: 'scanner',           name: 'QR & Barcode Scanner',   category: 'core',       description: 'Scan barcodes and QR codes via camera/file',    enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },
  { id: 'history',           name: 'History Tracking',       category: 'core',       description: 'Keep log of created and scanned QR items',       enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },
  { id: 'saved',             name: 'Saved QR Collection',    category: 'core',       description: 'Bookmark favorite QR codes locally',             enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },
  { id: 'export_png',        name: 'PNG Export',             category: 'export',     description: 'Export QR/Barcodes as high-res PNG images',     enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },
  { id: 'dark_mode',         name: 'Dark Mode UI',           category: 'app',        description: 'Toggle dark interface styling',                  enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },
  { id: 'pwa_install',       name: 'PWA / Offline Install',  category: 'app',        description: 'Install app to home screen for offline use',     enabled: true, requiredPlan: 'free', maintenanceMode: false, visible: true },

  // Premium Gated Features
  { id: 'export_svg',        name: 'SVG Vector Export',      category: 'export',     description: 'Download scalable SVG vector QR codes',          enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'export_pdf',        name: 'PDF Document Export',    category: 'export',     description: 'Download printable PDF QR documents',            enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'bulk_generation',   name: 'Bulk Batch Generation',  category: 'generation', description: 'Batch process QR codes from CSV/Excel',          enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'cloud_sync',        name: 'Cloud Templates & Sync', category: 'cloud',      description: 'Sync QR templates across devices in cloud',       enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'custom_eyes',       name: 'Custom Eye Patterns',    category: 'design',     description: 'Use custom eye and corner shape styles',         enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'background_image',  name: 'Background Image Fill',  category: 'design',     description: 'Embed custom background image into QR codes',    enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'logo_upload',       name: 'Custom Logo Embed',      category: 'design',     description: 'Overlay custom logos in QR center',              enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'text_overlay',      name: 'Text Overlay',           category: 'design',     description: 'Add custom text banners inside QR codes',        enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'texture_effects',   name: 'Texture & Gradient Fill',category: 'design',     description: 'Apply artistic texture fills to QR modules',     enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'gradient_colors',   name: 'Gradient Colors',        category: 'design',     description: 'Apply multi-color gradients to QR matrix',       enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'custom_frames',     name: 'Custom Frames',          category: 'design',     description: 'Wrap QR codes in decorative outer frames',       enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true },
  { id: 'ad_free',           name: 'Ad-Free Experience',     category: 'app',        description: 'Remove all advertisements from app',             enabled: true, requiredPlan: 'pro', maintenanceMode: false, visible: true }
];

// ─── PLAN HIERARCHY MAP ──────────────────────────────────────────────────────
const PLAN_HIERARCHY = {
  free: 0,
  pro: 1,
  daily: 1,
  weekly: 1,
  yearly: 1,
  pro_monthly: 1,
  pro_yearly: 1,
  lifetime: 2,
};

// ─── REASON CODES ────────────────────────────────────────────────────────────
export const REASON = {
  ALLOWED: 'ALLOWED',
  FEATURE_DISABLED: 'FEATURE_DISABLED',
  MAINTENANCE: 'MAINTENANCE',
  PLAN_REQUIRED: 'PLAN_REQUIRED',
  SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
};

// ─── IN-MEMORY CACHE STATE ───────────────────────────────────────────────────
class FeatureAccessManagerService {
  constructor() {
    this.currentUser = null;
    this.userSubscription = null;
    this.featuresConfig = {};      // Map of featureId -> feature object from Firestore
    this.isInitialized = false;

    // Listen to Firebase Auth state
    onAuthStateChanged(auth, async (u) => {
      this.currentUser = u;
      await this.refreshFeatureConfiguration();
    });
  }

  /**
   * Initializes or refreshes cached configuration from Firestore global_config/features/{featureId}
   */
  async refreshFeatureConfiguration() {
    try {
      // Fetch Firestore feature collection overrides
      const snap = await getDocs(collection(db, 'global_config', 'features', 'items')).catch(() => null);
      const remoteFeatures = {};
      if (snap) {
        snap.forEach(doc => {
          remoteFeatures[doc.id] = doc.data();
        });
      }

      this.featuresConfig = remoteFeatures;

      if (this.currentUser?.uid) {
        this.userSubscription = await getUserSubscription(this.currentUser.uid);
      } else {
        this.userSubscription = null;
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('[FeatureAccessManager] Error refreshing config:', e);
      if (!this.isInitialized) {
        this.isInitialized = true;
      }
    }
  }

  /**
   * Evaluates subscription validity and returns current plan ID
   */
  getEffectivePlan() {
    const sub = this.userSubscription;
    if (!sub) return 'free';

    const planId = sub.planId || (sub.isPro ? 'pro' : 'free');

    // Lifetime never expires
    if (planId === 'lifetime') return 'lifetime';

    // Verify expiry date if set
    if (sub.expiryDate) {
      const expiry = new Date(sub.expiryDate).getTime();
      if (Date.now() > expiry) {
        return 'free'; // Expired
      }
    }

    if (sub.cancelled) return 'free';

    return planId;
  }

  /**
   * Primary Entitlement Evaluation API: requireAccess(featureId)
   */
  requireAccess(featureId) {
    const regFeature = FEATURE_REGISTRY.find(f => f.id === featureId);
    const remoteFeature = this.featuresConfig[featureId] || {};

    const mergedFeature = {
      id: featureId,
      enabled: remoteFeature.enabled !== undefined ? remoteFeature.enabled : (regFeature ? regFeature.enabled : true),
      maintenanceMode: remoteFeature.maintenanceMode !== undefined ? remoteFeature.maintenanceMode : (regFeature ? regFeature.maintenanceMode : false),
      requiredPlan: remoteFeature.requiredPlan || regFeature?.requiredPlan || 'free',
      visible: remoteFeature.visible !== undefined ? remoteFeature.visible : (regFeature ? regFeature.visible : true),
    };

    const currentPlan = this.getEffectivePlan();

    // 1. Check Global Feature Switch
    if (!mergedFeature.enabled) {
      return {
        allowed: false,
        reason: REASON.FEATURE_DISABLED,
        featureId,
        requiredPlan: mergedFeature.requiredPlan,
        currentPlan,
      };
    }

    // 2. Check Maintenance Mode
    if (mergedFeature.maintenanceMode) {
      return {
        allowed: false,
        reason: REASON.MAINTENANCE,
        featureId,
        requiredPlan: mergedFeature.requiredPlan,
        currentPlan,
      };
    }

    // 3. Free features accessible to all
    if (mergedFeature.requiredPlan === 'free') {
      return {
        allowed: true,
        reason: REASON.ALLOWED,
        featureId,
        requiredPlan: 'free',
        currentPlan,
      };
    }

    // 4. Check Authentication requirement
    if (!this.currentUser && mergedFeature.requiredPlan !== 'free') {
      return {
        allowed: false,
        reason: REASON.UNAUTHENTICATED,
        featureId,
        requiredPlan: mergedFeature.requiredPlan,
        currentPlan: 'free',
      };
    }

    // 5. Evaluate Plan Hierarchy Level
    const userLevel = PLAN_HIERARCHY[currentPlan] || 0;
    const requiredLevel = PLAN_HIERARCHY[mergedFeature.requiredPlan] || 1;

    if (userLevel < requiredLevel) {
      const isExpired = this.userSubscription && this.userSubscription.expiryDate &&
        new Date(this.userSubscription.expiryDate).getTime() < Date.now();

      return {
        allowed: false,
        reason: isExpired ? REASON.SUBSCRIPTION_EXPIRED : REASON.PLAN_REQUIRED,
        featureId,
        requiredPlan: mergedFeature.requiredPlan,
        currentPlan,
      };
    }

    return {
      allowed: true,
      reason: REASON.ALLOWED,
      featureId,
      requiredPlan: mergedFeature.requiredPlan,
      currentPlan,
    };
  }

  /**
   * Backwards compatible API: canAccess(featureId)
   */
  canAccess(featureId) {
    return this.requireAccess(featureId);
  }

  isFeatureAllowed(featureId) {
    return this.requireAccess(featureId).allowed;
  }

  getRequiredPlan(featureId) {
    const res = this.requireAccess(featureId);
    return res.requiredPlan;
  }

  getAllFeatureStates() {
    const states = {};
    FEATURE_REGISTRY.forEach(f => {
      states[f.id] = this.requireAccess(f.id);
    });
    return states;
  }
}

export const FeatureAccessManager = new FeatureAccessManagerService();
export default FeatureAccessManager;

