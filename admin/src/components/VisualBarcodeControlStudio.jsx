// admin/src/components/VisualBarcodeControlStudio.jsx
// ─── Visual Barcode Generator Feature Access Studio ─────────────────────────
// Visual representation of the main app's Barcode Generator. Enables Super Admins to
// visually inspect every 1D and 2D barcode format, standard and styling engine, and toggle
// active state (Enable / Disable / Hide) and monetization tier (Free vs Paid Pro).

import React, { useState, useEffect, useMemo } from 'react';
import {
  Barcode, QrCode, Sparkles, Shield, Crown, Power, XCircle, Search, Check,
  Palette, Sliders, RefreshCw, Box, SlidersHorizontal, Layers, CheckCircle2
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
          border: '1.5px solid #3B82F6',
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
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(99, 102, 241, 0.15) 100%)',
              border: '1.5px solid rgba(59, 130, 246, 0.4)',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
            }}>
              <Barcode size={28} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ad-text)', margin: 0, letterSpacing: '-0.4px' }}>
                  Barcode Generator Visual Studio
                </h1>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100, background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                  Live App Layout
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '4px 0 0', fontWeight: 500 }}>
                Visually manage all 1D &amp; 2D retail, logistics, postal and industrial barcode standards. Click any tile to enable, disable, hide, or make Free vs Paid Pro.
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
              title="Unlock all Barcode features for 100% Free users"
            >
              <Shield size={14} />
              <span>Make All Free</span>
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
              title="Lock all Barcode features behind Paid Pro subscription"
            >
              <Crown size={14} />
              <span>Make All Pro</span>
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
            <div style={{ fontSize: 11, color: 'var(--ad-text-sec)', fontWeight: 700 }}>Total Barcode Formats</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ad-text)', marginTop: 2 }}>{stats.total}</div>
          </div>
          <div style={{ background: 'var(--ad-input)', borderRadius: 12, padding: '10px 14px', border: '1px solid var(--ad-border)' }}>
            <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 700 }}>🟢 Active Formats</div>
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

      {/* ── Section 1: 1D Standard Formats Grid ─────────────────────────────── */}
      <BarcodeSectionCard
        title="1. 1D Retail, Industrial & Logistics Standards"
        subtitle="Linear barcode symbologies used in point-of-sale retail, warehousing, shipping & health."
        icon={Barcode}
        badgeCount={oneDStandards.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
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
        title="2. 2D Matrix & High-Capacity Stacked Formats"
        subtitle="Two-dimensional matrix barcodes for high-density industrial tracking, boarding passes & parcels."
        icon={Box}
        badgeCount={twoDStandards.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
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
        title="3. Barcode Customization & Rendering Engine"
        subtitle="Bar color pickers, background styling, dimensional scaling, and human-readable text toggling."
        icon={Palette}
        badgeCount={appearanceTools.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
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
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MICRO SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════

function BarcodeSectionCard({ title, subtitle, icon: Icon, badgeCount, children }) {
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
            background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6',
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
            {badgeCount} Formats
          </span>
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
      borderRadius: 14,
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 12,
      opacity: isOff ? 0.65 : 1,
      transition: 'all 0.18s ease',
      boxShadow: feature.isPaid ? '0 2px 10px rgba(245, 158, 11, 0.08)' : '0 2px 10px rgba(59, 130, 246, 0.08)'
    }}>
      {/* Top row: Format icon badge + Name + Description */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: isOff ? 'rgba(148, 163, 184, 0.15)' : (feature.isPaid ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(59, 130, 246, 0.15))' : 'rgba(59, 130, 246, 0.15)'),
          color: isOff ? 'var(--ad-text-sec)' : (feature.isPaid ? '#F59E0B' : '#3B82F6'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {is2D ? <Box size={18} strokeWidth={2.4} /> : <Barcode size={18} strokeWidth={2.4} />}
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

      {/* Mini Visual Barcode Line Preview */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        border: '1px dashed var(--ad-border)'
      }}>
        {is2D ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 4px)', gap: 2 }}>
            {[1,0,1,1,0, 0,1,0,1,1, 1,1,1,0,0, 0,1,0,1,0].map((v, i) => (
              <div key={i} style={{ width: 4, height: 4, background: v ? (feature.isPaid ? '#F59E0B' : '#3B82F6') : 'transparent', borderRadius: 1 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 16 }}>
            {[3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1].map((w, i) => (
              <div key={i} style={{ width: w, height: '100%', background: feature.isPaid ? '#F59E0B' : '#3B82F6', borderRadius: 1 }} />
            ))}
          </div>
        )}
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
