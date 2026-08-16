// src/components/admin/FeatureFlagsPanel.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Mobile-First Feature Flags & App Capabilities Management System
// Controls all 140+ granular features across the 8 pure core categories & subcategories
// plus production rollout flags in the exact same sleek, modern mobile-first UI/UX.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo } from 'react';
import {
  Flag, Plus, Search, Filter, ChevronRight, ArrowLeft, MoreVertical,
  CheckCircle2, XCircle, AlertCircle, Clock, Copy, Check, Trash2, Edit3,
  Sliders, Globe, Users, Shield, Crown, BarChart2, Layers, Palette,
  Sparkles, Cpu, Download, Cloud, ScanLine, MapPin, FlaskConical,
  TrendingUp, RefreshCw, X, Radio, QrCode, Barcode, LayoutDashboard,
  Bookmark, ClipboardList, Settings, Package, Zap, Save, CheckSquare, Square,
  Pencil, Image as ImageIcon, Type, Camera, Scan, Heart, History, HardDrive,
  FileSpreadsheet, FileCheck
} from 'lucide-react';
import {
  FEATURE_REGISTRY,
  FEATURE_CATEGORIES,
  CATEGORY_SUBCATEGORIES,
  CANONICAL_PLANS,
  DEFAULT_FREE_FEATURES,
  DEFAULT_PAID_FEATURES
} from '../services/FeatureAccessManager';
import {
  subscribeFeatureFlags,
  toggleFeatureFlag,
  createFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag,
  FLAG_CATEGORIES,
  ENVIRONMENTS,
  TARGETING_OPTIONS,
  getTargetingLabel,
  INITIAL_FEATURE_FLAGS
} from '../services/featureFlagsService';
import { setFeatureFlagCloud, setPlanFeaturesCloud } from '../services/adminDataService';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { useAdminTheme } from './AdminUIKit';

// ── 8 Core Category Metadata (Matching Main App Navbar & Brand Palette) ──
const CATEGORY_META = {
  ALL:               { id: 'ALL',               name: 'All Features',       icon: Sliders,          color: '#FF4D9D' },
  QR_GENERATOR:      { id: 'QR_GENERATOR',      name: 'QR Generator',       icon: QrCode,           color: '#D60036' },
  BARCODE_GENERATOR: { id: 'BARCODE_GENERATOR', name: 'Barcode Generator',  icon: Barcode,          color: '#3B82F6' },
  BULK_GENERATOR:    { id: 'BULK_GENERATOR',    name: 'Bulk Generation',    icon: Layers,           color: '#8B5CF6' },
  SCANNER:           { id: 'SCANNER',           name: 'Scanner',            icon: ScanLine,         color: '#10B981' },
  HOME:              { id: 'HOME',              name: 'Home Screen',        icon: LayoutDashboard,  color: '#F59E0B' },
  SAVED:             { id: 'SAVED',             name: 'Saved',              icon: Bookmark,         color: '#EC4899' },
  HISTORY:           { id: 'HISTORY',           name: 'History',            icon: ClipboardList,    color: '#06B6D4' },
  SETTINGS:          { id: 'SETTINGS',          name: 'Settings',           icon: Settings,         color: '#64748B' },
  ROLLOUT:           { id: 'ROLLOUT',           name: 'Rollout Flags',      icon: Flag,             color: '#7B61FF' },
};

// ── Subcategory Metadata (Exact Icons Matching Main App Toolbar & Tabs) ──
const SUBCATEGORY_META = {
  // QR Generator Subcategories
  'Content':            { icon: Pencil,          color: '#D60036', label: 'Content' },
  'Color':              { icon: Palette,         color: '#F59E0B', label: 'Color' },
  'Style':              { icon: Sliders,         color: '#8B5CF6', label: 'Style' },
  'Logo':               { icon: ImageIcon,       color: '#EC4899', label: 'Logo' },
  'Template':           { icon: Sparkles,        color: '#3B82F6', label: 'Template' },
  'Text':               { icon: Type,            color: '#10B981', label: 'Text' },
  'Save & Export':      { icon: Download,        color: '#06B6D4', label: 'Save & Export' },
  'QR Engine':          { icon: Cpu,             color: '#64748B', label: 'QR Engine' },

  // Barcode Generator Subcategories
  '1D Standards':       { icon: Barcode,         color: '#3B82F6', label: '1D Standards' },
  '2D Standards':       { icon: QrCode,          color: '#8B5CF6', label: '2D Standards' },
  'Barcode Appearance': { icon: Palette,         color: '#F59E0B', label: 'Appearance' },
  'Export':             { icon: Download,        color: '#06B6D4', label: 'Export' },

  // Bulk Generator Subcategories
  'Batch Screen':       { icon: Layers,          color: '#8B5CF6', label: 'Batch Screen' },
  'Input & Spreadsheet':{ icon: FileSpreadsheet, color: '#10B981', label: 'Spreadsheet' },
  'Batch Styling':      { icon: Sliders,         color: '#F59E0B', label: 'Batch Styling' },
  'Bulk Export':        { icon: Download,        color: '#06B6D4', label: 'Bulk Export' },

  // Scanner Subcategories
  'Camera Lens':        { icon: Camera,          color: '#10B981', label: 'Camera Lens' },
  'Detection':          { icon: Scan,            color: '#3B82F6', label: 'Detection' },
  'Scan Results':       { icon: FileCheck,       color: '#8B5CF6', label: 'Scan Results' },

  // Home Screen Subcategories
  'Dashboard':          { icon: LayoutDashboard, color: '#F59E0B', label: 'Dashboard' },
  'Quick Actions':      { icon: Zap,             color: '#D60036', label: 'Quick Actions' },

  // Saved Subcategories
  'Collection':         { icon: Bookmark,        color: '#EC4899', label: 'Collection' },
  'Save / Remove':      { icon: Heart,           color: '#D60036', label: 'Save / Remove' },
  'Search & Filter':    { icon: Search,          color: '#3B82F6', label: 'Search & Filter' },

  // History Subcategories
  'History View':       { icon: History,         color: '#06B6D4', label: 'History View' },
  'Automatic History':  { icon: Clock,           color: '#8B5CF6', label: 'Auto History' },
  'History Management': { icon: Trash2,          color: '#EF4444', label: 'Management' },

  // Settings Subcategories
  'General & Theme':    { icon: Palette,         color: '#64748B', label: 'Theme & UI' },
  'Storage':            { icon: HardDrive,       color: '#3B82F6', label: 'Storage' },
  'Cloud & Sync':       { icon: Cloud,           color: '#06B6D4', label: 'Cloud Sync' },
  'Account & Security': { icon: Shield,          color: '#10B981', label: 'Security' },
};

const PLAN_COLORS = {
  free:    '#8B8FA8',
  weekly:  '#8B5CF6',
  monthly: '#F59E0B',
  yearly:  '#D60036'
};

const PLAN_LABELS = {
  free:    'Free Tier',
  weekly:  'Weekly Pro',
  monthly: 'Monthly Pro',
  yearly:  'Yearly Pro'
};

export default function FeatureFlagsPanel({ currentUser, isDark: propIsDark }) {
  const theme = useAdminTheme();
  const isDark = propIsDark !== undefined ? propIsDark : (theme?.isDark ?? false);

  // ── States ─────────────────────────────────────────────────────────────
  const [liveFlagsMap, setLiveFlagsMap] = useState({});
  const [customFlags, setCustomFlags] = useState([]);
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('list'); // 'list' | 'details' | 'create' | 'edit'
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'enabled' | 'disabled'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('all'); // 'all' | 'free' | 'paid' | 'weekly' | 'monthly' | 'yearly'
  const [envFilter, setEnvFilter] = useState('all');

  // Create / Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    category: 'QR_GENERATOR',
    subcategory: 'General',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    rolloutPercentage: 100,
    icon: 'Flag',
    iconColor: '#FF4D9D',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [savingPlanId, setSavingPlanId] = useState(null);

  // ── Real-time Firestore Subscriptions ──────────────────────────────────
  useEffect(() => {
    setLoading(true);

    // 1. Listen to global_config/featureFlags map
    const unsubGlobal = onSnapshot(doc(db, 'global_config', 'featureFlags'), snap => {
      if (snap.exists()) {
        setLiveFlagsMap(snap.data() || {});
      }
      setLoading(false);
    }, () => setLoading(false));

    // 2. Listen to standalone featureFlags collection (custom flags & rollouts)
    const unsubCollection = subscribeFeatureFlags(data => {
      setCustomFlags(data || []);
      setLoading(false);
    }, () => setLoading(false));

    // 3. Listen to subscription_plans to observe active plan entitlements
    const unsubPlans = onSnapshot(collection(db, 'subscription_plans'), colSnap => {
      const plans = {};
      colSnap.forEach(d => { plans[d.id] = d.data(); });
      setLivePlans(plans);
    }, () => {});

    return () => {
      unsubGlobal?.();
      unsubCollection?.();
      unsubPlans?.();
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Helper: Check if feature is in any paid plan (Free tier features are never PRO) ──
  const checkIsPaidFeature = (featureKey, defaultPlan) => {
    // 1. If feature is included in the Free tier, it is FREE for all users -> Never show PRO badge
    const freeFeatures = livePlans['free']?.features || DEFAULT_FREE_FEATURES;
    if (freeFeatures.includes(featureKey)) {
      return false;
    }

    // 2. Check if included in any paid tier (weekly, monthly, yearly)
    const paidTiers = ['weekly', 'monthly', 'yearly'];
    const isInLivePaid = paidTiers.some(pId => {
      const feats = livePlans[pId]?.features || DEFAULT_PAID_FEATURES;
      return feats.includes(featureKey);
    });

    if (isInLivePaid) return true;
    return Boolean(defaultPlan && defaultPlan !== 'free');
  };

  // ── Unified 140+ Features List ─────────────────────────────────────────
  const allFeatures = useMemo(() => {
    // 1. Standard canonical registry features (140+ items across 8 categories)
    const registryItems = FEATURE_REGISTRY.map(f => {
      const isEnabled = liveFlagsMap[f.featureId] !== undefined 
        ? Boolean(liveFlagsMap[f.featureId]) 
        : Boolean(f.defaultEnabled);

      const catMeta = CATEGORY_META[f.category] || CATEGORY_META.SETTINGS;
      const subMeta = SUBCATEGORY_META[f.subcategory];
      const isPaid = checkIsPaidFeature(f.featureId, f.defaultPlan);

      // Distinct Subcategory Icon & Color for granular visual recognition
      const featureIcon = subMeta?.icon || catMeta.icon || Flag;
      const featureColor = subMeta?.color || catMeta.color || '#FF4D9D';

      return {
        id: f.featureId,
        key: f.featureId,
        name: f.displayName,
        description: f.description || '',
        category: f.category,
        categoryName: catMeta.name,
        subcategory: f.subcategory || 'General',
        environment: 'Production',
        enabled: isEnabled,
        icon: featureIcon,
        iconColor: featureColor,
        iconBg: `${featureColor}18`,
        categoryIcon: catMeta.icon,
        categoryColor: catMeta.color,
        defaultPlan: f.defaultPlan || 'free',
        isPaid: isPaid,
        isCanonical: true,
        targeting: 'all',
        rolloutPercentage: 100,
        requiresAuthentication: f.requiresAuthentication,
        updatedAt: liveFlagsMap._updatedAt || null,
      };
    });

    // 2. Additional custom & rollout flags from collection
    const rolloutItems = customFlags
      .filter(cf => !FEATURE_REGISTRY.some(r => r.featureId === (cf.key || cf.id)))
      .map(cf => {
        const isEnabled = cf.enabled !== undefined 
          ? Boolean(cf.enabled) 
          : (liveFlagsMap[cf.key] !== undefined ? Boolean(liveFlagsMap[cf.key]) : true);

        return {
          id: cf.id,
          key: cf.key || cf.id,
          name: cf.name || cf.id,
          description: cf.description || '',
          category: 'ROLLOUT',
          categoryName: 'Rollout Flags',
          subcategory: cf.category || 'Production',
          environment: cf.environment || 'Production',
          enabled: isEnabled,
          icon: Flag,
          iconColor: '#7B61FF',
          iconBg: 'rgba(123, 97, 255, 0.14)',
          defaultPlan: 'all',
          isPaid: false,
          isCanonical: false,
          targeting: cf.targeting || 'all',
          rolloutPercentage: cf.rolloutPercentage ?? 100,
          updatedAt: cf.updatedAt || cf.createdAt,
        };
      });

    return [...registryItems, ...rolloutItems];
  }, [liveFlagsMap, customFlags, livePlans]);

  // ── Filtered Features ──────────────────────────────────────────────────
  const filteredFeatures = useMemo(() => {
    return allFeatures.filter(f => {
      // 1. Search filter (name, key, description, category, subcategory)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (f.name || '').toLowerCase().includes(q);
        const matchKey = (f.key || '').toLowerCase().includes(q);
        const matchDesc = (f.description || '').toLowerCase().includes(q);
        const matchCat = (f.categoryName || '').toLowerCase().includes(q);
        const matchSub = (f.subcategory || '').toLowerCase().includes(q);
        if (!matchName && !matchKey && !matchDesc && !matchCat && !matchSub) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'ALL' && f.category !== selectedCategory) return false;

      // 3. Subcategory filter
      if (selectedSubcategory !== 'ALL' && f.subcategory !== selectedSubcategory) return false;

      // 4. Status filter
      if (statusFilter === 'enabled' && !f.enabled) return false;
      if (statusFilter === 'disabled' && f.enabled) return false;

      // 5. Environment filter
      if (envFilter !== 'all' && f.environment !== envFilter) return false;

      // 6. Plan Filter
      if (planFilter === 'paid') {
        if (!f.isPaid) return false;
      } else if (planFilter === 'free') {
        const freeFeats = livePlans.free?.features || DEFAULT_FREE_FEATURES;
        if (!freeFeats.includes(f.key)) return false;
      } else if (planFilter !== 'all') {
        const planFeats = livePlans[planFilter]?.features || (planFilter === 'free' ? DEFAULT_FREE_FEATURES : DEFAULT_PAID_FEATURES);
        if (!planFeats.includes(f.key)) return false;
      }

      return true;
    });
  }, [allFeatures, searchQuery, selectedCategory, selectedSubcategory, statusFilter, envFilter, planFilter, livePlans]);

  // ── Overall Statistics ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = allFeatures.length;
    const enabled = allFeatures.filter(f => f.enabled).length;
    const disabled = total - enabled;
    const paidCount = allFeatures.filter(f => f.isPaid).length;
    const enabledPct = total > 0 ? ((enabled / total) * 100).toFixed(0) : '0';
    const disabledPct = total > 0 ? ((disabled / total) * 100).toFixed(0) : '0';

    return { total, enabled, disabled, paidCount, enabledPct, disabledPct };
  }, [allFeatures]);

  // ── Category Counts ────────────────────────────────────────────────────
  const categoryCounts = useMemo(() => {
    const counts = { ALL: allFeatures.length };
    Object.keys(CATEGORY_META).forEach(k => {
      if (k === 'ALL') return;
      counts[k] = allFeatures.filter(f => f.category === k).length;
    });
    return counts;
  }, [allFeatures]);

  // ── Available Subcategories for Active Category ────────────────────────
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'ALL' || selectedCategory === 'ROLLOUT') return [];
    return CATEGORY_SUBCATEGORIES[selectedCategory] || [];
  }, [selectedCategory]);

  // ── Toggle Switch Handler ──────────────────────────────────────────────
  const handleToggle = async (feature, e) => {
    if (e) e.stopPropagation();
    const nextState = !feature.enabled;

    // 1. Optimistic UI update
    setLiveFlagsMap(prev => ({ ...prev, [feature.key]: nextState }));

    try {
      // 2. Persist to Firestore global config
      await setFeatureFlagCloud(feature.key, nextState);

      // 3. If it is also a standalone collection doc, update it too
      if (!feature.isCanonical) {
        await toggleFeatureFlag(feature.id, nextState, currentUser);
      }

      showToast(`"${feature.name}" is now ${nextState ? 'ENABLED' : 'DISABLED'}`);
    } catch (err) {
      // Revert optimistic update on failure
      setLiveFlagsMap(prev => ({ ...prev, [feature.key]: feature.enabled }));
      showToast(`Failed to update ${feature.name}: ${err?.message}`);
    }
  };

  // ── Toggle Plan Entitlement Handler ────────────────────────────────────
  const handleTogglePlan = async (planId, featureId) => {
    setSavingPlanId(planId);
    try {
      const currentFeatures = livePlans[planId]?.features || (planId === 'free' ? [...DEFAULT_FREE_FEATURES] : [...DEFAULT_PAID_FEATURES]);
      const hasFeature = currentFeatures.includes(featureId);
      const nextFeatures = hasFeature 
        ? currentFeatures.filter(id => id !== featureId)
        : [...new Set([...currentFeatures, featureId])];

      await setPlanFeaturesCloud(planId, nextFeatures);
      showToast(`${hasFeature ? 'Removed from' : 'Added to'} ${PLAN_LABELS[planId] || planId}`);
    } catch (err) {
      showToast(`Error updating plan: ${err?.message}`);
    } finally {
      setSavingPlanId(null);
    }
  };

  // ── Open Details Drawer ────────────────────────────────────────────────
  const openDetails = (feat) => {
    setSelectedFeature(feat);
    setActiveMode('details');
  };

  // ── Open Create / Edit Modal ───────────────────────────────────────────
  const openCreateModal = () => {
    setFormData({
      name: '',
      key: '',
      description: '',
      category: selectedCategory !== 'ALL' ? selectedCategory : 'QR_GENERATOR',
      subcategory: selectedSubcategory !== 'ALL' ? selectedSubcategory : 'General',
      environment: 'Production',
      enabled: true,
      targeting: 'all',
      rolloutPercentage: 100,
      icon: 'Flag',
      iconColor: '#FF4D9D',
    });
    setFormErrors({});
    setActiveMode('create');
  };

  const openEditModal = (feat) => {
    setSelectedFeature(feat);
    setFormData({
      name: feat.name || '',
      key: feat.key || feat.id,
      description: feat.description || '',
      category: feat.category || 'QR_GENERATOR',
      subcategory: feat.subcategory || 'General',
      environment: feat.environment || 'Production',
      enabled: Boolean(feat.enabled),
      targeting: feat.targeting || 'all',
      rolloutPercentage: Number(feat.rolloutPercentage ?? 100),
      icon: 'Flag',
      iconColor: feat.iconColor || '#FF4D9D',
    });
    setFormErrors({});
    setActiveMode('edit');
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    showToast(`Copied "${key}" to clipboard!`);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Flag name is required.';
    if (activeMode === 'create') {
      const cleanKey = formData.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (!cleanKey) errors.key = 'Valid flag key is required.';
      else if (cleanKey.length < 2) errors.key = 'Key must be at least 2 characters.';
      formData.key = cleanKey;
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (activeMode === 'create') {
        await createFeatureFlag(formData, currentUser);
        await setFeatureFlagCloud(formData.key, formData.enabled);
        showToast(`Feature flag "${formData.name}" created successfully!`);
      } else {
        await updateFeatureFlag(selectedFeature.id, formData, currentUser);
        await setFeatureFlagCloud(formData.key, formData.enabled);
        showToast(`Feature flag "${formData.name}" updated!`);
      }
      setActiveMode('list');
    } catch (err) {
      setFormErrors({ submit: err?.message || 'Failed to save feature flag.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeature) return;
    try {
      await deleteFeatureFlag(selectedFeature.id, currentUser);
      await setFeatureFlagCloud(selectedFeature.key, false);
      showToast(`Flag "${selectedFeature.name}" deleted.`);
      setActiveMode('list');
      setDeleteConfirm(false);
    } catch (err) {
      showToast(`Failed to delete: ${err?.message}`);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedCategory('ALL');
    setSelectedSubcategory('ALL');
    setPlanFilter('all');
    setEnvFilter('all');
    setFilterOpen(false);
  };

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (selectedSubcategory !== 'ALL' ? 1 : 0) +
    (planFilter !== 'all' ? 1 : 0) +
    (envFilter !== 'all' ? 1 : 0);

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER: 1. DETAILS DRAWER / VIEW
  // ═════════════════════════════════════════════════════════════════════════
  if (activeMode === 'details' && selectedFeature) {
    const IconComponent = selectedFeature.icon || Flag;
    const subMeta = SUBCATEGORY_META[selectedFeature.subcategory];
    const SubIcon = subMeta?.icon || Sliders;

    return (
      <div style={{ maxWidth: 840, margin: '0 auto', animation: 'adSlideIn 0.2s ease', padding: '0 4px' }}>
        {toastMessage && <Toast message={toastMessage} />}

        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveMode('list')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', color: 'var(--ad-text)',
              fontSize: 15, fontWeight: 800, cursor: 'pointer', padding: 0
            }}
          >
            <ArrowLeft size={18} />
            <span>Feature Details</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => openEditModal(selectedFeature)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', borderRadius: 10,
                background: 'rgba(255, 77, 157, 0.12)', color: '#FF4D9D',
                border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer'
              }}
            >
              <Edit3 size={13} /> Edit
            </button>
            {!selectedFeature.isCanonical && (
              <button
                onClick={() => setDeleteConfirm(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444',
                  border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 14, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10
          }}>
            <div style={{ color: '#EF4444', fontSize: 13, fontWeight: 700 }}>
              Are you sure you want to permanently delete this feature flag?
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm(false)} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--ad-input)', border: 'none', color: 'var(--ad-text)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleDelete} style={{ padding: '6px 12px', borderRadius: 8, background: '#EF4444', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        {/* Main Details Card (Mobile First) */}
        <div style={{
          background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
          borderRadius: 18, padding: '16px', boxShadow: 'var(--ad-card-shadow)',
          display: 'flex', flexDirection: 'column', gap: 16
        }}>
          {/* Header Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: selectedFeature.iconBg, color: selectedFeature.iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <IconComponent size={22} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--ad-text)', margin: 0, wordBreak: 'break-word' }}>
                  {selectedFeature.name}
                </h2>
                {selectedFeature.isPaid ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    padding: '2px 7px', borderRadius: 100,
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(214, 0, 54, 0.15))',
                    color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.35)',
                    fontSize: 10, fontWeight: 800
                  }}>
                    <Crown size={10} color="#F59E0B" strokeWidth={2.5} /> PRO
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    padding: '2px 7px', borderRadius: 100,
                    background: 'rgba(139, 143, 168, 0.15)',
                    color: '#8B8FA8', fontSize: 10, fontWeight: 700
                  }}>
                    FREE
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ad-text-sec)', marginTop: 4, lineHeight: 1.4 }}>
                {selectedFeature.description || 'Controls runtime capability in Mushi QR Pro application.'}
              </div>
            </div>
          </div>

          {/* Global Status Banner / Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', borderRadius: 12, background: 'var(--ad-input)',
            border: '1px solid var(--ad-border)'
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ad-text-sec)' }}>Global Runtime Flag</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: selectedFeature.enabled ? '#22C55E' : '#EF4444', marginTop: 1 }}>
                {selectedFeature.enabled ? 'Enabled Everywhere' : 'Turned OFF'}
              </div>
            </div>
            <button
              onClick={() => handleToggle(selectedFeature)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 100, border: 'none',
                background: selectedFeature.enabled ? 'rgba(34, 197, 94, 0.16)' : 'rgba(239, 68, 68, 0.16)',
                color: selectedFeature.enabled ? '#22C55E' : '#EF4444',
                fontSize: 12, fontWeight: 800, cursor: 'pointer'
              }}
            >
              {selectedFeature.enabled ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
              <span>{selectedFeature.enabled ? 'Active' : 'Disabled'}</span>
            </button>
          </div>

          {/* 2-Column Metadata Grid (Mobile First) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {/* Feature Key */}
            <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 12px', overflow: 'hidden' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 2 }}>Key</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                <code style={{ fontSize: 11, fontWeight: 800, color: 'var(--ad-text)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedFeature.key}
                </code>
                <button onClick={() => handleCopyKey(selectedFeature.key)} style={{ background: 'none', border: 'none', color: copiedKey ? '#22C55E' : 'var(--ad-text-sec)', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                  {copiedKey ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Environment */}
            <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 2 }}>Scope</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#22C55E' }}>Production</div>
            </div>

            {/* Category & Subcategory */}
            <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 12px', gridColumn: 'span 2' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 2 }}>Category &amp; Subcategory</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800, color: selectedFeature.iconColor, flexWrap: 'wrap' }}>
                <SubIcon size={13} />
                <span>{selectedFeature.categoryName}</span>
                <span style={{ color: 'var(--ad-text-sec)', fontWeight: 500 }}>›</span>
                <span>{selectedFeature.subcategory}</span>
              </div>
            </div>
          </div>

          {/* Plan Entitlements Matrix (2 Cards Per Row Grid on Mobile) */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ad-text)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Crown size={15} color="#FF4D9D" />
              <span>Plan Entitlements (Access Tiers)</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {CANONICAL_PLANS.map(pId => {
                const planFeatures = livePlans[pId]?.features || (pId === 'free' ? DEFAULT_FREE_FEATURES : DEFAULT_PAID_FEATURES);
                const hasFeature = planFeatures.includes(selectedFeature.key);
                const color = PLAN_COLORS[pId] || '#FF4D9D';

                return (
                  <button
                    key={pId}
                    onClick={() => handleTogglePlan(pId, selectedFeature.key)}
                    disabled={savingPlanId === pId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 12,
                      background: hasFeature ? `${color}15` : 'var(--ad-input)',
                      border: `1.5px solid ${hasFeature ? color : 'var(--ad-border)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: 68
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', gap: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: hasFeature ? color : 'var(--ad-text)', lineHeight: 1.2 }}>
                        {PLAN_LABELS[pId]}
                      </span>
                      <div style={{ flexShrink: 0 }}>
                        {hasFeature ? <CheckSquare size={16} color={color} /> : <Square size={16} color="var(--ad-text-sec)" />}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: hasFeature ? color : 'var(--ad-text-sec)' }}>
                        {hasFeature ? 'Included' : 'Locked'}
                      </span>
                      {pId !== 'free' && (
                        <Crown size={11} color={hasFeature ? color : 'var(--ad-text-sec)'} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER: 2. CREATE / EDIT MODAL VIEW
  // ═════════════════════════════════════════════════════════════════════════
  if (activeMode === 'create' || activeMode === 'edit') {
    const isEdit = activeMode === 'edit';
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', animation: 'adSlideIn 0.2s ease' }}>
        {toastMessage && <Toast message={toastMessage} />}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={() => setActiveMode(isEdit ? 'details' : 'list')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: 'var(--ad-text)',
              fontSize: 16, fontWeight: 800, cursor: 'pointer', padding: 0
            }}
          >
            <ArrowLeft size={20} />
            <span>{isEdit ? 'Edit Feature Flag' : 'Create Custom Feature Flag'}</span>
          </button>
        </div>

        <form onSubmit={handleFormSubmit} style={{
          background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
          borderRadius: 20, padding: 24, boxShadow: 'var(--ad-card-shadow)',
          display: 'flex', flexDirection: 'column', gap: 18
        }}>
          {formErrors.submit && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontSize: 13, fontWeight: 700 }}>
              {formErrors.submit}
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Feature Name <span style={{ color: '#FF4D9D' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AI QR Enhancer"
              value={formData.name}
              onChange={e => {
                const val = e.target.value;
                setFormData(p => ({
                  ...p,
                  name: val,
                  key: isEdit ? p.key : (p.key === '' || p.key === p.name.toLowerCase().replace(/[^a-z0-9_]/g, '_') ? val.toLowerCase().replace(/[^a-z0-9_]/g, '_') : p.key)
                }));
              }}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: `1px solid ${formErrors.name ? '#EF4444' : 'var(--ad-border)'}`,
                borderRadius: 10, padding: '11px 14px', color: 'var(--ad-text)',
                fontSize: 14, fontWeight: 600, outline: 'none'
              }}
            />
            {formErrors.name && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{formErrors.name}</div>}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Feature Key <span style={{ color: '#FF4D9D' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ai_qr_enhancer"
              value={formData.key}
              disabled={isEdit}
              onChange={e => setFormData(p => ({ ...p, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') }))}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: `1px solid ${formErrors.key ? '#EF4444' : 'var(--ad-border)'}`,
                borderRadius: 10, padding: '11px 14px', color: 'var(--ad-text)',
                fontSize: 14, fontWeight: 600, outline: 'none', fontFamily: 'monospace',
                opacity: isEdit ? 0.6 : 1
              }}
            />
            {formErrors.key && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{formErrors.key}</div>}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Explain what this feature controls in the user application..."
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: '1px solid var(--ad-border)', borderRadius: 10, padding: '11px 14px',
                color: 'var(--ad-text)', fontSize: 13, fontWeight: 500, outline: 'none', resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                style={{
                  width: '100%', background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
                  borderRadius: 10, padding: '11px 12px', color: 'var(--ad-text)', fontSize: 13, fontWeight: 600, outline: 'none'
                }}
              >
                {Object.entries(CATEGORY_META).filter(([k]) => k !== 'ALL').map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
                Initial Status
              </label>
              <div style={{ display: 'flex', alignItems: 'center', height: 42 }}>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, enabled: !p.enabled }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: formData.enabled ? 'rgba(34, 197, 94, 0.14)' : 'rgba(239, 68, 68, 0.14)',
                    color: formData.enabled ? '#22C55E' : '#EF4444', fontWeight: 800, fontSize: 13
                  }}
                >
                  {formData.enabled ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>{formData.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 10, background: 'linear-gradient(135deg, #FF4D9D, #7B61FF)',
              color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
              fontSize: 14, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(255, 77, 157, 0.35)'
            }}
          >
            {submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Feature Flag')}
          </button>
        </form>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER: 3. MAIN UNIFIED OVERVIEW (Matching Exact Mobile-First Reference)
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'adSlideIn 0.2s ease' }}>
      {toastMessage && <Toast message={toastMessage} />}

      {/* Title & Top Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 900,
            color: 'var(--ad-text)',
            margin: 0,
            letterSpacing: '-0.4px'
          }}>
            Feature Flags &amp; App Capabilities
          </h1>
          <p style={{
            fontSize: 12,
            color: 'var(--ad-text-sec)',
            margin: '4px 0 0',
            fontWeight: 500
          }}>
            Control 140+ granular features across 8 categories with live paid plan badges
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            background: 'linear-gradient(135deg, #FF4D9D 0%, #7B61FF 100%)',
            border: 'none',
            borderRadius: 12,
            color: '#FFFFFF',
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 14px rgba(255, 77, 157, 0.35)',
            flexShrink: 0
          }}
        >
          <Plus size={18} strokeWidth={2.6} />
          <span>Create Flag</span>
        </button>
      </div>

      {/* 4 Top Stat Cards (2x2 on Mobile, 4-col on Desktop) */}
      <div className="ad-stat-grid" style={{ marginBottom: 20 }}>
        <StatMiniCard
          icon={Flag}
          iconColor="#FF4D9D"
          iconBg="rgba(255, 77, 157, 0.12)"
          title="Total Features"
          value={stats.total}
          subtitle="All app capabilities"
          subColor="var(--ad-text-sec)"
        />
        <StatMiniCard
          icon={CheckCircle2}
          iconColor="#22C55E"
          iconBg="rgba(34, 197, 94, 0.12)"
          title="Enabled"
          value={stats.enabled}
          subtitle={`${stats.enabledPct}% active`}
          subColor="#22C55E"
        />
        <StatMiniCard
          icon={Crown}
          iconColor="#F59E0B"
          iconBg="rgba(245, 158, 11, 0.12)"
          title="Paid Pro Features"
          value={stats.paidCount}
          subtitle="Monetized capabilities"
          subColor="#F59E0B"
        />
        <StatMiniCard
          icon={Sliders}
          iconColor="#8B5CF6"
          iconBg="rgba(139, 92, 246, 0.12)"
          title="Core Modules"
          value="8 Categories"
          subtitle="Full Mushi QR ecosystem"
          subColor="#8B5CF6"
        />
      </div>

      {/* 8 Categories Filter Carousel Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 6,
        marginBottom: 16,
        scrollbarWidth: 'none'
      }}>
        {Object.entries(CATEGORY_META).map(([key, cat]) => {
          const isActive = selectedCategory === key;
          const IconComp = cat.icon;
          const count = categoryCounts[key] || 0;

          return (
            <button
              key={key}
              onClick={() => {
                setSelectedCategory(key);
                setSelectedSubcategory('ALL');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 12,
                border: `1px solid ${isActive ? cat.color : 'var(--ad-border)'}`,
                background: isActive ? `${cat.color}18` : 'var(--ad-card)',
                color: isActive ? cat.color : 'var(--ad-text-sec)',
                fontSize: 12,
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                boxShadow: isActive ? `0 2px 10px ${cat.color}25` : 'none'
              }}
            >
              <IconComp size={15} strokeWidth={isActive ? 2.5 : 1.9} />
              <span>{cat.name}</span>
              <span style={{
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 10,
                background: isActive ? cat.color : 'var(--ad-input)',
                color: isActive ? '#fff' : 'var(--ad-text-sec)',
                fontWeight: 800
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Filter Pills with Dedicated Main App Toolbar Icons */}
      {availableSubcategories.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 16,
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => setSelectedSubcategory('ALL')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 20,
              border: `1px solid ${selectedSubcategory === 'ALL' ? '#FF4D9D' : 'var(--ad-border)'}`,
              background: selectedSubcategory === 'ALL' ? 'rgba(255, 77, 157, 0.14)' : 'transparent',
              color: selectedSubcategory === 'ALL' ? '#FF4D9D' : 'var(--ad-text-sec)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Sliders size={12} />
            <span>All Subcategories</span>
          </button>
          {availableSubcategories.map(sub => {
            const isSubActive = selectedSubcategory === sub;
            const subMeta = SUBCATEGORY_META[sub];
            const SubIcon = subMeta?.icon || Sliders;
            const subColor = subMeta?.color || '#FF4D9D';

            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  border: `1px solid ${isSubActive ? subColor : 'var(--ad-border)'}`,
                  background: isSubActive ? `${subColor}18` : 'transparent',
                  color: isSubActive ? subColor : 'var(--ad-text-sec)',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <SubIcon size={12} strokeWidth={isSubActive ? 2.4 : 1.9} />
                <span>{sub}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
      }}>
        {/* Search Input */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} style={{ position: 'absolute', left: 14, color: 'var(--ad-text-sec)' }} />
          <input
            type="text"
            placeholder="Search 140+ features by name, key, description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'var(--ad-card)',
              border: '1px solid var(--ad-border)',
              borderRadius: 12,
              padding: '11px 36px 11px 38px',
              color: 'var(--ad-text)',
              fontSize: 13,
              fontWeight: 600,
              outline: 'none',
              boxShadow: 'var(--ad-card-shadow)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 12, background: 'none', border: 'none',
                color: 'var(--ad-text-sec)', cursor: 'pointer', padding: 2
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Button with Active Badge */}
        <button
          onClick={() => setFilterOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: activeFiltersCount > 0 ? 'rgba(255, 77, 157, 0.12)' : 'var(--ad-card)',
            border: `1px solid ${activeFiltersCount > 0 ? '#FF4D9D' : 'var(--ad-border)'}`,
            borderRadius: 12,
            padding: '11px 16px',
            color: activeFiltersCount > 0 ? '#FF4D9D' : 'var(--ad-text)',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: 'var(--ad-card-shadow)',
            flexShrink: 0
          }}
        >
          <Filter size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#FF4D9D', color: '#fff',
              fontSize: 10, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFiltersCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ad-text-sec)' }}>Active:</span>
          {selectedCategory !== 'ALL' && (
            <FilterPill label={CATEGORY_META[selectedCategory]?.name || selectedCategory} onRemove={() => setSelectedCategory('ALL')} />
          )}
          {selectedSubcategory !== 'ALL' && (
            <FilterPill label={selectedSubcategory} onRemove={() => setSelectedSubcategory('ALL')} />
          )}
          {statusFilter !== 'all' && (
            <FilterPill label={statusFilter === 'enabled' ? 'Enabled Only' : 'Disabled Only'} onRemove={() => setStatusFilter('all')} />
          )}
          {planFilter !== 'all' && (
            <FilterPill label={planFilter === 'paid' ? 'Paid Pro Only' : (PLAN_LABELS[planFilter] || planFilter)} onRemove={() => setPlanFilter('all')} />
          )}
          <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: '#FF4D9D', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
            Clear all
          </button>
        </div>
      )}

      {/* ── Feature Flags Card List ──────────────────────────────────────── */}
      {filteredFeatures.length === 0 ? (
        <div style={{
          background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
          borderRadius: 20, padding: '48px 24px', textAlign: 'center',
          boxShadow: 'var(--ad-card-shadow)'
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: 'rgba(255, 77, 157, 0.1)',
            color: '#FF4D9D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px'
          }}>
            <Search size={26} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ad-text)', margin: '0 0 6px' }}>
            No matching features found
          </h3>
          <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '0 0 16px' }}>
            Try adjusting your search query or removing active filters.
          </p>
          <button
            onClick={clearAllFilters}
            style={{
              padding: '8px 16px', borderRadius: 10, background: 'var(--ad-input)',
              border: '1px solid var(--ad-border)', color: 'var(--ad-text)', fontSize: 12, fontWeight: 700, cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredFeatures.map(feature => {
            const IconComp = feature.icon || Flag;
            const subMeta = SUBCATEGORY_META[feature.subcategory];
            const SubIcon = subMeta?.icon || Sliders;

            return (
              <div
                key={feature.key}
                onClick={() => openDetails(feature)}
                style={{
                  background: 'var(--ad-card)',
                  border: '1px solid var(--ad-border)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  boxShadow: 'var(--ad-card-shadow)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255, 77, 157, 0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--ad-border)'}
              >
                {/* Left Colored Icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: feature.iconBg,
                  color: feature.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComp size={22} strokeWidth={2.3} />
                </div>

                {/* Center Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ad-text)' }}>
                      {feature.name}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--ad-text-mut)',
                      background: 'var(--ad-input)',
                      padding: '2px 6px',
                      borderRadius: 6,
                      fontFamily: 'monospace'
                    }}>
                      {feature.key}
                    </span>

                    {/* Paid Crown Badge */}
                    {feature.isPaid ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 100,
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(214, 0, 54, 0.15))',
                        color: '#F59E0B',
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                        boxShadow: '0 1px 4px rgba(245, 158, 11, 0.12)'
                      }}>
                        <Crown size={11} color="#F59E0B" strokeWidth={2.5} />
                        <span>PRO</span>
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 100,
                        background: 'rgba(139, 143, 168, 0.12)',
                        color: '#8B8FA8'
                      }}>
                        <span>FREE</span>
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontSize: 12,
                    color: 'var(--ad-text-sec)',
                    marginTop: 3,
                    lineHeight: 1.35,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {feature.description}
                  </div>

                  {/* Subcategory & Category Tags with Live Icons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 100,
                      background: `${feature.iconColor}18`,
                      color: feature.iconColor
                    }}>
                      <IconComp size={10} />
                      <span>{feature.categoryName}</span>
                    </span>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 100,
                      background: 'var(--ad-input)',
                      color: 'var(--ad-text-sec)'
                    }}>
                      <SubIcon size={10} />
                      <span>{feature.subcategory}</span>
                    </span>
                  </div>
                </div>

                {/* Right iOS Toggle Switch */}
                <div onClick={e => e.stopPropagation()}>
                  <IOSSwitch
                    checked={feature.enabled}
                    onChange={() => handleToggle(feature)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Filter Bottom Sheet Modal ────────────────────────────────────── */}
      {filterOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }} onClick={() => setFilterOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto',
              background: 'var(--ad-card)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: '24px 20px 36px', boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', gap: 18,
              animation: 'adSlideIn 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--ad-text)', margin: 0 }}>
                Filter 140+ Features
              </h3>
              <button onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--ad-text-sec)', cursor: 'pointer', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 8 }}>
                Status
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {['all', 'enabled', 'disabled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '8px 12px', borderRadius: 10,
                      border: `1px solid ${statusFilter === s ? '#FF4D9D' : 'var(--ad-border)'}`,
                      background: statusFilter === s ? 'rgba(255, 77, 157, 0.14)' : 'var(--ad-input)',
                      color: statusFilter === s ? '#FF4D9D' : 'var(--ad-text)',
                      fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {s === 'all' ? 'All' : (s === 'enabled' ? 'Active' : 'Disabled')}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 8 }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('ALL');
                }}
                style={{
                  width: '100%', background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
                  borderRadius: 10, padding: '10px 12px', color: 'var(--ad-text)', fontSize: 13, fontWeight: 600, outline: 'none'
                }}
              >
                {Object.entries(CATEGORY_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.name} ({categoryCounts[k] || 0})</option>
                ))}
              </select>
            </div>

            {/* Plan Tier Filter */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 8 }}>
                Subscription Plan Access
              </label>
              <select
                value={planFilter}
                onChange={e => setPlanFilter(e.target.value)}
                style={{
                  width: '100%', background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
                  borderRadius: 10, padding: '10px 12px', color: 'var(--ad-text)', fontSize: 13, fontWeight: 600, outline: 'none'
                }}
              >
                <option value="all">All Features</option>
                <option value="paid">👑 Paid Pro Plans Only</option>
                <option value="free">Free Tier Included</option>
                <option value="weekly">Weekly Pro Included</option>
                <option value="monthly">Monthly Pro Included</option>
                <option value="yearly">Yearly Pro Included</option>
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                onClick={clearAllFilters}
                style={{
                  flex: 1, padding: 12, borderRadius: 10, background: 'var(--ad-input)',
                  border: '1px solid var(--ad-border)', color: 'var(--ad-text)', fontSize: 13, fontWeight: 700, cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                style={{
                  flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg, #FF4D9D, #7B61FF)',
                  border: 'none', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer'
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MICRO SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════

function StatMiniCard({ icon: Icon, iconColor, iconBg, title, value, subtitle, subColor }) {
  return (
    <div style={{
      background: 'var(--ad-card)',
      border: '1px solid var(--ad-border)',
      borderRadius: 16,
      padding: '14px',
      boxShadow: 'var(--ad-card-shadow)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} strokeWidth={2.4} />
        </div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--ad-text)', letterSpacing: '-0.3px', marginTop: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text)' }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 11, fontWeight: 600, color: subColor || 'var(--ad-text-sec)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function IOSSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      style={{
        width: 44,
        height: 26,
        borderRadius: 100,
        border: 'none',
        background: checked ? 'linear-gradient(135deg, #FF4D9D, #7B61FF)' : 'rgba(148, 163, 184, 0.3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        padding: 0,
        outline: 'none'
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        position: 'absolute',
        top: 3,
        left: checked ? 21 : 3,
        transition: 'left 0.2s ease'
      }} />
    </button>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 100,
      background: 'rgba(255, 77, 157, 0.12)', color: '#FF4D9D', fontSize: 11, fontWeight: 700
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: '#FF4D9D', cursor: 'pointer', padding: 0 }}>
        <X size={11} />
      </button>
    </span>
  );
}

function Toast({ message }) {
  return (
    <div style={{
      position: 'fixed',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999,
      maxWidth: 'calc(100vw - 32px)',
      width: 'max-content',
      background: '#0F1221',
      color: '#FFFFFF',
      border: '1.5px solid rgba(255, 77, 157, 0.6)',
      borderRadius: 100,
      padding: '10px 18px',
      fontSize: 13,
      fontWeight: 700,
      boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(255, 77, 157, 0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      animation: 'adSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'none',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      textAlign: 'center'
    }}>
      <Sparkles size={16} color="#FF4D9D" style={{ flexShrink: 0 }} />
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{message}</span>
    </div>
  );
}
