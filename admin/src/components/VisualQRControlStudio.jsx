// admin/src/components/VisualQRControlStudio.jsx
// ─── Visual QR Code Generator Feature Access Studio ─────────────────────────
// Visual representation of the main app's QR Generator. Enables Super Admins to
// visually inspect every QR content type, styling tab, frame, logo tool & export option,
// and toggle its active state (Enable / Disable / Hide) and monetization tier (Free vs Paid Pro).

import React, { useState, useEffect, useMemo } from 'react';
import {
  QrCode, Sparkles, Shield, Crown, Power, XCircle, Search, Check,
  Palette, Sliders, Image, Type, Download, Share2, Layers, RefreshCw,
  FileText, Globe, Wifi, Mail, Phone, MessageSquare, User, MapPin,
  FileSpreadsheet, Music, Calendar, DollarSign, MessageCircle, Video,
  Send, AtSign, CheckCircle2, SlidersHorizontal,
  ChevronRight, Eye, Grid, Box, Wand2, ArrowRightLeft, Lock, Unlock
} from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { setFeatureFlagCloud, setFeaturesTierBatchCloud } from '../services/adminDataService';
import { FEATURE_REGISTRY } from '../services/FeatureAccessManager';

// Icon Map for all QR feature items
const ICON_MAP = {
  qr_text: FileText,
  qr_url: Globe,
  qr_wifi: Wifi,
  qr_email: Mail,
  qr_phone: Phone,
  qr_sms: MessageSquare,
  qr_vcard: User,
  qr_location: MapPin,
  qr_pdf: FileText,
  qr_image: Image,
  qr_audio: Music,
  qr_document: FileSpreadsheet,
  qr_event: Calendar,
  qr_crypto: DollarSign,
  qr_whatsapp: MessageCircle,
  qr_youtube: Video,
  qr_instagram: Image,
  qr_facebook: Globe,
  qr_x: AtSign,
  qr_linkedin: User,
  qr_tab_content: FileText,
  qr_tab_color: Palette,
  qr_tab_style: Sliders,
  qr_tab_logo: Image,
  qr_tab_template: LayoutGridIcon,
  qr_tab_text: Type,
  custom_colors_solid: Palette,
  custom_colors_gradient: Wand2,
  qr_color_presets: Grid,
  qr_color_eyes_custom: Eye,
  qr_bg_image_texture: Image,
  custom_dot_styles: Grid,
  custom_eye_styles: Eye,
  qr_background_shapes: Box,
  custom_frames: Sparkles,
  qr_canvas_positioning: SlidersHorizontal,
  custom_logo_presets: Image,
  custom_logo_upload: Wand2,
  qr_logo_transforms: Sliders,
  qr_logo_bg_remover: Sparkles,
  qr_logo_stroke_shadow: Box,
  templates_browse: Grid,
  templates_free_apply: Check,
  templates_premium_apply: Crown,
  templates_save_custom: Sparkles,
  templates_cloud_library: Globe,
  qr_center_text: Type,
  qr_text_fonts: Type,
  qr_text_styling: Palette,
  qr_text_transforms: Sliders,
  export_png: Download,
  export_jpg: Download,
  export_svg: Sparkles,
  export_pdf: FileText,
  export_quality_low: Download,
  export_quality_medium: Download,
  export_quality_hd: Sparkles,
  export_quality_ultra: Crown,
  export_native_share: Share2,
  qr_matrix_engine: QrCode,
  qr_error_correction: Sliders,
  qr_quiet_zone: Box,
  qr_size_custom: SlidersHorizontal
};

function LayoutGridIcon(props) {
  return <Grid {...props} />;
}

export default function VisualQRControlStudio({ currentUser, isDark = false }) {

  const [liveFlagsMap, setLiveFlagsMap] = useState({});
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabSection, setActiveTabSection] = useState('ALL'); // 'ALL' | 'content' | 'styling' | 'templates' | 'export'
  const [updatingKey, setUpdatingKey] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // 1. Real-time subscriptions to Firestore
  useEffect(() => {
    setLoading(true);
    const unsubGlobal = onSnapshot(doc(db, 'global_config', 'featureFlags'), snap => {
      if (snap.exists()) setLiveFlagsMap(snap.data() || {});
      setLoading(false);
    }, () => setLoading(false));

    const unsubPlans = onSnapshot(collection(db, 'subscription_plans'), colSnap => {
      const plans = {};
      colSnap.forEach(d => { plans[d.id] = d.data(); });
      setLivePlans(plans);
    }, () => {});

    return () => {
      unsubGlobal?.();
      unsubPlans?.();
    };
  }, []);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // 2. All QR Features from canonical registry
  const qrFeatures = useMemo(() => {
    const raw = FEATURE_REGISTRY.filter(f => f.category === 'QR_GENERATOR');
    const freePlanList = Array.isArray(livePlans.free?.features) ? livePlans.free.features : null;

    return raw.map(f => {
      const enabled = liveFlagsMap[f.featureId] !== undefined
        ? Boolean(liveFlagsMap[f.featureId])
        : f.defaultEnabled;

      let isPaid = false;
      if (freePlanList !== null) {
        isPaid = !freePlanList.includes(f.featureId);
      } else {
        isPaid = f.defaultPlan !== 'free';
      }

      return {
        ...f,
        key: f.featureId,
        name: f.displayName,
        enabled,
        isPaid,
        IconComponent: ICON_MAP[f.featureId] || QrCode
      };
    });
  }, [liveFlagsMap, livePlans]);

  // 3. Filtered features by search query
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return qrFeatures;
    const q = searchQuery.toLowerCase();
    return qrFeatures.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.key.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.subcategory.toLowerCase().includes(q)
    );
  }, [qrFeatures, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = qrFeatures.length;
    const enabled = qrFeatures.filter(f => f.enabled).length;
    const freeCount = qrFeatures.filter(f => !f.isPaid).length;
    const paidCount = qrFeatures.filter(f => f.isPaid).length;
    return { total, enabled, disabled: total - enabled, freeCount, paidCount };
  }, [qrFeatures]);

  // 4. Toggle Feature Enable / Disable
  const handleToggleEnable = async (feature) => {
    setUpdatingKey(feature.key);
    const nextState = !feature.enabled;
    try {
      await setFeatureFlagCloud(feature.key, nextState, {
        name: feature.name,
        category: 'QR_GENERATOR',
        subcategory: feature.subcategory,
      });
      setLiveFlagsMap(prev => ({ ...prev, [feature.key]: nextState }));
      showToast(`${feature.name} is now ${nextState ? '🟢 ENABLED (Visible)' : '🔴 DISABLED (Hidden)'}`);
    } catch (e) {
      console.error(e);
      showToast('❌ Failed to update state');
    } finally {
      setUpdatingKey(null);
    }
  };

  // 5. Toggle Tier (Free vs Pro)
  const handleToggleTier = async (feature) => {
    setUpdatingKey(feature.key);
    const nextTier = feature.isPaid ? 'free' : 'paid';
    try {
      await setFeaturesTierBatchCloud([feature.key], nextTier);
      showToast(`${feature.name} is now ${nextTier === 'free' ? '🛡️ FREE FOR ALL' : '👑 PAID PRO ONLY'}`);
    } catch (e) {
      console.error(e);
      showToast('❌ Failed to update tier');
    } finally {
      setUpdatingKey(null);
    }
  };

  // 6. Master Batch Actions
  const handleBatchTier = async (targetTier) => {
    setBulkProcessing(true);
    const allKeys = qrFeatures.map(f => f.key);
    try {
      await setFeaturesTierBatchCloud(allKeys, targetTier);
      showToast(`✨ All ${allKeys.length} QR features set to ${targetTier === 'free' ? '100% FREE' : 'PAID PRO'}`);
    } catch (e) {
      showToast('❌ Batch tier update failed');
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBatchEnable = async (enable) => {
    setBulkProcessing(true);
    try {
      const updates = {};
      for (const f of qrFeatures) {
        updates[f.key] = enable;
        await setFeatureFlagCloud(f.key, enable, { name: f.name, category: 'QR_GENERATOR' });
      }
      setLiveFlagsMap(prev => ({ ...prev, ...updates }));
      showToast(`✨ All QR features are now ${enable ? 'ENABLED' : 'DISABLED'}`);
    } catch (e) {
      showToast('❌ Batch enable update failed');
    } finally {
      setBulkProcessing(false);
    }
  };

  // Groupings for the Visual Studio
  const contentTypes = filteredFeatures.filter(f => f.subcategory === 'Content');
  const bottomTabs = filteredFeatures.filter(f => f.key.startsWith('qr_tab_'));
  const stylingTools = filteredFeatures.filter(f => ['Color', 'Style'].includes(f.subcategory) && !f.key.startsWith('qr_tab_'));
  const logoTools = filteredFeatures.filter(f => f.subcategory === 'Logo' && !f.key.startsWith('qr_tab_'));
  const templateTools = filteredFeatures.filter(f => f.subcategory === 'Template' && !f.key.startsWith('qr_tab_'));
  const textTools = filteredFeatures.filter(f => f.subcategory === 'Text' && !f.key.startsWith('qr_tab_'));
  const exportTools = filteredFeatures.filter(f => f.subcategory === 'Save & Export');
  const engineTools = filteredFeatures.filter(f => f.subcategory === 'QR Engine');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toast */}
      {feedbackToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 18, 33, 0.96)',
          border: '1.5px solid #FF4D9D',
          borderRadius: 100,
          padding: '10px 20px',
          color: '#fff',
          fontSize: 13,
          fontWeight: 800,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Studio Header & Master Controls ─────────────────────────────────── */}
      <div style={{
        background: 'var(--ad-card)',
        border: '1px solid var(--ad-border)',
        borderRadius: 20,
        padding: '24px',
        boxShadow: 'var(--ad-card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(214, 0, 54, 0.18) 0%, rgba(255, 77, 157, 0.15) 100%)',
              border: '1.5px solid rgba(214, 0, 54, 0.4)',
              color: '#D60036',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(214, 0, 54, 0.2)'
            }}>
              <QrCode size={28} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ad-text)', margin: 0, letterSpacing: '-0.4px' }}>
                  QR Code Generator Visual Studio
                </h1>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100, background: 'rgba(214, 0, 54, 0.15)', color: '#D60036' }}>
                  Live App Layout
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '4px 0 0', fontWeight: 500 }}>
                Visually manage all QR content types, styling engines, logos &amp; templates. Click any tile to enable, disable, hide, or make Free vs Paid Pro.
              </p>
            </div>
          </div>

          {/* Quick Master Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              disabled={bulkProcessing}
              onClick={() => handleBatchTier('free')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10B981', fontSize: 12, fontWeight: 800, cursor: 'pointer'
              }}
              title="Unlock all QR features for 100% Free users"
            >
              <Shield size={14} />
              <span>Make All QR Free</span>
            </button>

            <button
              disabled={bulkProcessing}
              onClick={() => handleBatchTier('paid')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#F59E0B', fontSize: 12, fontWeight: 800, cursor: 'pointer'
              }}
              title="Lock all QR features behind Paid Pro subscription"
            >
              <Crown size={14} />
              <span>Make All QR Pro</span>
            </button>

            <button
              disabled={bulkProcessing}
              onClick={() => handleBatchEnable(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22C55E', fontSize: 12, fontWeight: 800, cursor: 'pointer'
              }}
            >
              <Power size={14} />
              <span>Enable All</span>
            </button>

            <button
              disabled={bulkProcessing}
              onClick={() => handleBatchEnable(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444', fontSize: 12, fontWeight: 800, cursor: 'pointer'
              }}
            >
              <XCircle size={14} />
              <span>Disable All</span>
            </button>
          </div>
        </div>

        {/* Live Mini Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, paddingTop: 6 }}>
          <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--ad-border)' }}>
            <div style={{ fontSize: 11, color: 'var(--ad-text-sec)', fontWeight: 700 }}>Total Capabilities</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ad-text)', marginTop: 2 }}>{stats.total}</div>
          </div>
          <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--ad-border)' }}>
            <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 700 }}>🟢 Active / Visible</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#22C55E', marginTop: 2 }}>{stats.enabled}</div>
          </div>
          <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--ad-border)' }}>
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>🛡️ Free Tier</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#10B981', marginTop: 2 }}>{stats.freeCount}</div>
          </div>
          <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--ad-border)' }}>
            <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>👑 Paid Pro Only</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#F59E0B', marginTop: 2 }}>{stats.paidCount}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, color: 'var(--ad-text-sec)' }} />
          <input
            type="text"
            placeholder="Search QR features, formats, styling tools, export presets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
              borderRadius: 12, padding: '10px 36px 10px 38px',
              color: 'var(--ad-text)', fontSize: 13, fontWeight: 600, outline: 'none'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--ad-text-sec)', cursor: 'pointer' }}>
              <XCircle size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Section 1: Main App QR Content Type Grid ─────────────────────────── */}
      <VisualSectionCard
        title="1. QR Code Content Types (The Main Creation Grid)"
        subtitle="These are the 18 content format tiles shown to users when creating a QR code."
        icon={Grid}
        badgeCount={contentTypes.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {contentTypes.map(feature => (
            <VisualFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </VisualSectionCard>

      {/* ── Section 2: Main App Bottom Navigation Tabs ──────────────────────── */}
      <VisualSectionCard
        title="2. QR Generator Bottom Navigation Tabs"
        subtitle="Control which customizer tabs are visible inside the QR code creation screen."
        icon={Sliders}
        badgeCount={bottomTabs.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {bottomTabs.map(feature => (
            <VisualFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </VisualSectionCard>

      {/* ── Section 3: Colors, Shapes & Styling Engine ───────────────────────── */}
      <VisualSectionCard
        title="3. Color, Gradient, Shapes & Frame Tools"
        subtitle="Custom shapes, dot matrix designs, corner finder eyes, gradient fills, and decorative frames."
        icon={Palette}
        badgeCount={stylingTools.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {stylingTools.map(feature => (
            <VisualFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </VisualSectionCard>

      {/* ── Section 4: Logo & Branding Studio ───────────────────────────────── */}
      <VisualSectionCard
        title="4. Brand Logos & Background Remover"
        subtitle="Social logo presets, custom logo uploads, background remover, and outline stroke."
        icon={Image}
        badgeCount={logoTools.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {logoTools.map(feature => (
            <VisualFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </VisualSectionCard>

      {/* ── Section 5: Template Gallery & Cloud Library ──────────────────────── */}
      <VisualSectionCard
        title="5. Template Gallery & Custom Preset Saving"
        subtitle="Browse templates, free standard designs, VIP premium templates & cloud community library."
        icon={Wand2}
        badgeCount={templateTools.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {templateTools.map(feature => (
            <VisualFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </VisualSectionCard>

      {/* ── Section 6: Text & Typography Tools ──────────────────────────────── */}
      <VisualSectionCard
        title="6. Text & Typography Embed Studio"
        subtitle="Center text overlay, Google Fonts selection, text outline stroke and rotation tools."
        icon={Type}
        badgeCount={textTools.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {textTools.map(feature => (
            <VisualFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </VisualSectionCard>

      {/* ── Section 7: Export Formats, Resolution & Share ────────────────────── */}
      <VisualSectionCard
        title="7. Save & Export Formats & 4K Resolution Controls"
        subtitle="PNG, JPG, SVG Vector, PDF print, 512px to 4K Ultra resolutions, and OS share sheet."
        icon={Download}
        badgeCount={exportTools.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {exportTools.map(feature => (
            <VisualFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </VisualSectionCard>

      {/* ── Section 8: Core QR Engine ────────────────────────────────────────── */}
      {engineTools.length > 0 && (
        <VisualSectionCard
          title="8. Core QR Engine & Matrix Settings"
          subtitle="Matrix generator, Error correction tolerance (L/M/Q/H), quiet zones and density."
          icon={QrCode}
          badgeCount={engineTools.length}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {engineTools.map(feature => (
              <VisualFeatureTile
                key={feature.key}
                feature={feature}
                updating={updatingKey === feature.key}
                onToggleEnable={() => handleToggleEnable(feature)}
                onToggleTier={() => handleToggleTier(feature)}
              />
            ))}
          </div>
        </VisualSectionCard>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MICRO SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════

function VisualSectionCard({ title, subtitle, icon: Icon, badgeCount, children }) {
  return (
    <div style={{
      background: 'var(--ad-card)',
      border: '1px solid var(--ad-border)',
      borderRadius: 18,
      padding: '20px',
      boxShadow: 'var(--ad-card-shadow)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(255, 77, 157, 0.12)', color: '#FF4D9D',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={18} strokeWidth={2.4} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--ad-text)', margin: 0 }}>
              {title}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '2px 0 0', fontWeight: 500 }}>
              {subtitle}
            </p>
          </div>
        </div>
        {badgeCount !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 100,
            background: 'var(--ad-input)', color: 'var(--ad-text-sec)', border: '1px solid var(--ad-border)'
          }}>
            {badgeCount} Features
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function VisualFeatureTile({ feature, updating, onToggleEnable, onToggleTier }) {
  const IconComp = feature.IconComponent || QrCode;
  const isOff = !feature.enabled;

  return (
    <div style={{
      background: isOff ? 'rgba(15, 18, 33, 0.4)' : 'var(--ad-input)',
      border: `1.5px solid ${isOff ? 'rgba(239, 68, 68, 0.3)' : (feature.isPaid ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)')}`,
      borderRadius: 14,
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 12,
      opacity: isOff ? 0.65 : 1,
      transition: 'all 0.18s ease',
      boxShadow: feature.isPaid ? '0 2px 10px rgba(245, 158, 11, 0.08)' : '0 2px 10px rgba(16, 185, 129, 0.08)'
    }}>
      {/* Top row: Icon + Name + Key */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: isOff ? 'rgba(148, 163, 184, 0.15)' : (feature.isPaid ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(214, 0, 54, 0.15))' : 'rgba(16, 185, 129, 0.15)'),
          color: isOff ? 'var(--ad-text-sec)' : (feature.isPaid ? '#F59E0B' : '#10B981'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <IconComp size={18} strokeWidth={2.4} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ad-text)', lineHeight: 1.3 }}>
            {feature.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ad-text-sec)', marginTop: 2, lineHeight: 1.35 }}>
            {feature.description}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar: Enable/Disable Switch + 1-Click Free/Pro Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTop: '1px solid var(--ad-border)'
      }}>
        {/* Left: Enable/Disable Button */}
        <button
          type="button"
          disabled={updating}
          onClick={onToggleEnable}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 9px',
            borderRadius: 8,
            border: `1px solid ${feature.enabled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            background: feature.enabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: feature.enabled ? '#22C55E' : '#EF4444',
            fontSize: 10,
            fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer'
          }}
          title={feature.enabled ? "Click to Disable/Hide from users" : "Click to Enable for users"}
        >
          <Power size={11} strokeWidth={2.5} />
          <span>{feature.enabled ? 'ACTIVE' : 'HIDDEN'}</span>
        </button>

        {/* Right: Tactile Free vs Pro Toggle Button */}
        <button
          type="button"
          disabled={updating}
          onClick={onToggleTier}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 100,
            border: `1.5px solid ${feature.isPaid ? '#F59E0B' : '#10B981'}`,
            background: feature.isPaid
              ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer',
            boxShadow: feature.isPaid ? '0 2px 8px rgba(245, 158, 11, 0.35)' : '0 2px 8px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.15s ease'
          }}
          title={feature.isPaid ? "Plan: PRO (Click to make 100% Free)" : "Plan: FREE (Click to lock behind Pro)"}
        >
          {updating ? (
            <RefreshCw size={10} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
          ) : feature.isPaid ? (
            <Crown size={11} fill="#fff" color="#fff" strokeWidth={2.2} />
          ) : (
            <Shield size={10} strokeWidth={2.5} />
          )}
          <span>{feature.isPaid ? 'PRO' : 'FREE'}</span>
          <span style={{ fontSize: 8, opacity: 0.8, marginLeft: 2 }}>⇄</span>
        </button>
      </div>
    </div>
  );
}
