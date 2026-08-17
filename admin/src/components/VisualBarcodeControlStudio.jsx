// admin/src/components/VisualBarcodeControlStudio.jsx
// ─── Visual Barcode Generator Feature Access Studio ─────────────────────────
// Visual representation of the main app's Barcode Generator. Enables Super Admins to
// visually inspect every 1D and 2D barcode format, standard and styling engine, and toggle
// active state (Enable / Disable / Hide) and monetization tier (Free vs Paid Pro).

import React, { useState, useEffect, useMemo } from 'react';
import {
  Barcode, QrCode, Sparkles, Shield, Crown, Power, XCircle, Search, Check,
  Palette, Sliders, RefreshCw, Box, SlidersHorizontal, Layers, CheckCircle2, Download, FileUp
} from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { setFeatureFlagCloud, setFeaturesTierBatchCloud } from '../services/adminDataService';
import { FEATURE_REGISTRY } from '../services/FeatureAccessManager';

export default function VisualBarcodeControlStudio({ currentUser, isDark = false }) {

  const [liveFlagsMap, setLiveFlagsMap] = useState({});
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingKey, setUpdatingKey] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // 1. Real-time subscriptions
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

  // 2. Barcode features
  const barcodeFeatures = useMemo(() => {
    const raw = FEATURE_REGISTRY.filter(f => f.category === 'BARCODE_GENERATOR');
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
      };
    });
  }, [liveFlagsMap, livePlans]);

  // 3. Filtered by search
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return barcodeFeatures;
    const q = searchQuery.toLowerCase();
    return barcodeFeatures.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.key.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.subcategory.toLowerCase().includes(q)
    );
  }, [barcodeFeatures, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = barcodeFeatures.length;
    const enabled = barcodeFeatures.filter(f => f.enabled).length;
    const freeCount = barcodeFeatures.filter(f => !f.isPaid).length;
    const paidCount = barcodeFeatures.filter(f => f.isPaid).length;
    return { total, enabled, disabled: total - enabled, freeCount, paidCount };
  }, [barcodeFeatures]);

  // 4. Toggle Enable / Disable
  const handleToggleEnable = async (feature) => {
    setUpdatingKey(feature.key);
    const nextState = !feature.enabled;
    try {
      await setFeatureFlagCloud(feature.key, nextState, {
        name: feature.name,
        category: 'BARCODE_GENERATOR',
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

  // 6. Batch Actions
  const handleBatchTier = async (targetTier) => {
    setBulkProcessing(true);
    const allKeys = barcodeFeatures.map(f => f.key);
    try {
      await setFeaturesTierBatchCloud(allKeys, targetTier);
      showToast(`✨ All ${allKeys.length} Barcode features set to ${targetTier === 'free' ? '100% FREE' : 'PAID PRO'}`);
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
      for (const f of barcodeFeatures) {
        updates[f.key] = enable;
        await setFeatureFlagCloud(f.key, enable, { name: f.name, category: 'BARCODE_GENERATOR' });
      }
      setLiveFlagsMap(prev => ({ ...prev, ...updates }));
      showToast(`✨ All Barcode features are now ${enable ? 'ENABLED' : 'DISABLED'}`);
    } catch (e) {
      showToast('❌ Batch enable update failed');
    } finally {
      setBulkProcessing(false);
    }
  };

  const oneDStandards = filteredFeatures.filter(f => f.subcategory === '1D Standards');
  const twoDStandards = filteredFeatures.filter(f => f.subcategory === '2D Standards');
  const appearanceTools = filteredFeatures.filter(f => f.subcategory === 'Barcode Appearance');
  const exportTools = filteredFeatures.filter(f => f.subcategory === 'Export');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Toast */}
      {feedbackToast && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 18, 33, 0.96)',
          border: '1.5px solid #3B82F6',
          borderRadius: 100,
          padding: '8px 18px',
          color: '#fff',
          fontSize: 12,
          fontWeight: 800,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          whiteSpace: 'nowrap'
        }}>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Studio Header & Master Controls (Mobile-First UX) ─────────────────── */}
      <div style={{
        background: 'var(--ad-card)',
        border: '1px solid var(--ad-border)',
        borderRadius: 16,
        padding: '14px 12px',
        boxShadow: 'var(--ad-card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>

        {/* Live Studio Mini Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, paddingTop: 4 }}>
          {/* Total Formats */}
          <div style={{
            background: 'var(--ad-input)',
            borderRadius: 12,
            padding: '10px 12px',
            border: '1px solid var(--ad-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Barcode size={16} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: 'var(--ad-text-sec)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Total Formats
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ad-text)', lineHeight: 1.1, marginTop: 2 }}>
                {stats.total}
              </div>
            </div>
          </div>

          {/* Active / Enabled */}
          <div style={{
            background: 'var(--ad-input)',
            borderRadius: 12,
            padding: '10px 12px',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(34, 197, 94, 0.12)', color: '#22C55E',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <CheckCircle2 size={16} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#22C55E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Active Visible
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#22C55E', lineHeight: 1.1, marginTop: 2 }}>
                {stats.enabled}
              </div>
            </div>
          </div>

          {/* Free Tier */}
          <div style={{
            background: 'var(--ad-input)',
            borderRadius: 12,
            padding: '10px 12px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.12)', color: '#10B981',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Shield size={16} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Free Tier
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#10B981', lineHeight: 1.1, marginTop: 2 }}>
                {stats.freeCount}
              </div>
            </div>
          </div>

          {/* Pro Tier */}
          <div style={{
            background: 'var(--ad-input)',
            borderRadius: 12,
            padding: '10px 12px',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Crown size={16} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Paid Pro
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#F59E0B', lineHeight: 1.1, marginTop: 2 }}>
                {stats.paidCount}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, color: 'var(--ad-text-sec)' }} />
          <input
            type="text"
            placeholder="Search barcode formats (e.g. EAN-13, Code 128, Data Matrix, PDF417, UPC...)"
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

      {/* ── Section 1: 1D Linear Retail Standards Grid ─────────────────────── */}
      <BarcodeSectionCard
        title="1. 1D Linear Barcode Standards"
        subtitle="EAN, UPC, Code 128, Code 39, ITF-14, ISBN and postal tracking barcodes."
        icon={Barcode}
        badgeCount={oneDStandards.length}
        onMakeFree={() => setFeaturesTierBatchCloud(oneDStandards.map(f => f.key), 'free').then(() => showToast('✨ 1D Barcodes set to FREE'))}
        onMakePro={() => setFeaturesTierBatchCloud(oneDStandards.map(f => f.key), 'paid').then(() => showToast('✨ 1D Barcodes set to PRO'))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10 }}>
          {oneDStandards.map(feature => (
            <BarcodeFeatureTile
              key={feature.key}
              feature={feature}
              is2D={false}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </BarcodeSectionCard>

      {/* ── Section 2: 2D Matrix Formats Grid ───────────────────────────────── */}
      <BarcodeSectionCard
        title="2. 2D Matrix & High-Capacity Formats"
        subtitle="Two-dimensional matrix barcodes for industrial tracking, boarding passes & parcels."
        icon={Box}
        badgeCount={twoDStandards.length}
        onMakeFree={() => setFeaturesTierBatchCloud(twoDStandards.map(f => f.key), 'free').then(() => showToast('✨ 2D Barcodes set to FREE'))}
        onMakePro={() => setFeaturesTierBatchCloud(twoDStandards.map(f => f.key), 'paid').then(() => showToast('✨ 2D Barcodes set to PRO'))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10 }}>
          {twoDStandards.map(feature => (
            <BarcodeFeatureTile
              key={feature.key}
              feature={feature}
              is2D={true}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </BarcodeSectionCard>

      {/* ── Section 3: Barcode Styling & Appearance Tools ───────────────────── */}
      <BarcodeSectionCard
        title="3. Customization & Rendering Engine"
        subtitle="Bar color pickers, background styling, dimensional scaling, and text toggling."
        icon={Palette}
        badgeCount={appearanceTools.length}
        onMakeFree={() => setFeaturesTierBatchCloud(appearanceTools.map(f => f.key), 'free').then(() => showToast('✨ Customization tools set to FREE'))}
        onMakePro={() => setFeaturesTierBatchCloud(appearanceTools.map(f => f.key), 'paid').then(() => showToast('✨ Customization tools set to PRO'))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10 }}>
          {appearanceTools.map(feature => (
            <BarcodeFeatureTile
              key={feature.key}
              feature={feature}
              is2D={false}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </BarcodeSectionCard>

      {/* ── Section 4: Save & Export Formats ─────────────────────────────────── */}
      <BarcodeSectionCard
        title="4. Save & Export Formats"
        subtitle="Control PNG, SVG vector, PDF print document, direct thermal print and HD scalers."
        icon={FileUp}
        badgeCount={exportTools.length}
        onMakeFree={() => setFeaturesTierBatchCloud(exportTools.map(f => f.key), 'free').then(() => showToast('✨ Barcode Export tools set to FREE'))}
        onMakePro={() => setFeaturesTierBatchCloud(exportTools.map(f => f.key), 'paid').then(() => showToast('✨ Barcode Export tools set to PRO'))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10 }}>
          {exportTools.map(feature => (
            <BarcodeFeatureTile
              key={feature.key}
              feature={feature}
              is2D={false}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </BarcodeSectionCard>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MICRO SUB-COMPONENTS (Mobile-First UX)
// ═════════════════════════════════════════════════════════════════════════

function BarcodeSectionCard({ title, subtitle, icon: Icon, badgeCount, onMakeFree, onMakePro, children }) {
  return (
    <div style={{
      background: 'var(--ad-card)',
      border: '1px solid var(--ad-border)',
      borderRadius: 16,
      padding: '14px 12px',
      boxShadow: 'var(--ad-card-shadow)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Icon size={16} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--ad-text)', margin: 0, lineHeight: 1.25 }}>
                {title}
              </h2>
              <p style={{ fontSize: 10.5, color: 'var(--ad-text-sec)', margin: '2px 0 0', fontWeight: 500, lineHeight: 1.3 }}>
                {subtitle}
              </p>
            </div>
          </div>
          {badgeCount !== undefined && (
            <span style={{
              fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 100,
              background: 'var(--ad-input)', color: 'var(--ad-text-sec)', border: '1px solid var(--ad-border)', flexShrink: 0
            }}>
              {badgeCount} Items
            </span>
          )}
        </div>

        {(onMakeFree || onMakePro) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, width: '100%', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
            {onMakeFree && (
              <button
                type="button"
                onClick={onMakeFree}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '5px 8px',
                  borderRadius: 7, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#10B981', fontSize: 10.5, fontWeight: 800, cursor: 'pointer'
                }}
              >
                <Shield size={11} strokeWidth={2.5} />
                <span>Free Section</span>
              </button>
            )}
            {onMakePro && (
              <button
                type="button"
                onClick={onMakePro}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '5px 8px',
                  borderRadius: 7, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#F59E0B', fontSize: 10.5, fontWeight: 800, cursor: 'pointer'
                }}
              >
                <Crown size={11} strokeWidth={2.5} />
                <span>Pro Section</span>
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function BarcodeFeatureTile({ feature, is2D, updating, onToggleEnable, onToggleTier }) {
  const isOff = !feature.enabled;

  return (
    <div style={{
      background: isOff ? 'rgba(15, 18, 33, 0.4)' : 'var(--ad-input)',
      border: `1.5px solid ${isOff ? 'rgba(239, 68, 68, 0.3)' : (feature.isPaid ? 'rgba(245, 158, 11, 0.35)' : 'rgba(59, 130, 246, 0.35)')}`,
      borderRadius: 12,
      padding: '10px 8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 8,
      opacity: isOff ? 0.65 : 1,
      transition: 'all 0.18s ease',
      boxShadow: feature.isPaid ? '0 2px 8px rgba(245, 158, 11, 0.08)' : '0 2px 8px rgba(59, 130, 246, 0.08)'
    }}>
      {/* Top: Sample Barcode Lines Mockup */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 8,
        padding: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 46,
        border: '1px solid var(--ad-border)'
      }}>
        {is2D ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 5px)', gap: 2 }}>
            {[1,0,1,1,0, 0,1,0,1,1, 1,1,1,0,0, 0,1,0,1,0, 1,0,1,1,1].map((dot, idx) => (
              <div key={idx} style={{ width: 5, height: 5, background: dot ? '#000' : 'transparent', borderRadius: 1 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 26, width: '100%', justifyContent: 'center' }}>
            <div style={{ width: 2, height: '100%', background: '#000' }} />
            <div style={{ width: 4, height: '100%', background: '#000' }} />
            <div style={{ width: 1, height: '100%', background: '#000' }} />
            <div style={{ width: 3, height: '100%', background: '#000' }} />
            <div style={{ width: 2, height: '100%', background: '#000' }} />
            <div style={{ width: 4, height: '100%', background: '#000' }} />
            <div style={{ width: 1, height: '100%', background: '#000' }} />
            <div style={{ width: 3, height: '100%', background: '#000' }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 11.5, fontWeight: 800, color: 'var(--ad-text)', lineHeight: 1.3,
          wordBreak: 'break-word', whiteSpace: 'normal'
        }}>
          {feature.name}
        </div>
        <div style={{
          fontSize: 10, color: 'var(--ad-text-sec)', marginTop: 3, lineHeight: 1.3,
          wordBreak: 'break-word', whiteSpace: 'normal'
        }}>
          {feature.description}
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 6,
        borderTop: '1px solid var(--ad-border)',
        gap: 4
      }}>
        <button
          type="button"
          disabled={updating}
          onClick={onToggleEnable}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '3px 6px',
            borderRadius: 6,
            border: `1px solid ${feature.enabled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            background: feature.enabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: feature.enabled ? '#22C55E' : '#EF4444',
            fontSize: 9,
            fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer',
            flexShrink: 0
          }}
        >
          <Power size={9} strokeWidth={2.5} />
          <span>{feature.enabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          disabled={updating}
          onClick={onToggleTier}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '3px 7px',
            borderRadius: 100,
            border: `1.5px solid ${feature.isPaid ? '#F59E0B' : '#3B82F6'}`,
            background: feature.isPaid ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#FFFFFF',
            fontSize: 9,
            fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            boxShadow: feature.isPaid ? '0 2px 6px rgba(245, 158, 11, 0.35)' : '0 2px 6px rgba(59, 130, 246, 0.35)'
          }}
          title={feature.isPaid ? "Plan: PRO (Click to make 100% Free)" : "Plan: FREE (Click to lock behind Pro)"}
        >
          {updating ? (
            <RefreshCw size={9} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
          ) : feature.isPaid ? (
            <Crown size={9} fill="#fff" color="#fff" strokeWidth={2.2} />
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
