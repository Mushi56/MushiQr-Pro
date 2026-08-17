// admin/src/components/VisualBulkControlStudio.jsx
// ─── Visual Bulk Creation Feature Access Studio ─────────────────────────────
// Visual representation of the main app's Bulk / Batch Creation Screen. Enables Super Admins
// to visually inspect spreadsheet imports, grid editors, batch styling engines & ZIP exports,
// and toggle active state (Enable / Disable / Hide) and monetization tier (Free vs Paid Pro).

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers, FileSpreadsheet, Download, Sparkles, Shield, Crown, Power,
  XCircle, Search, Check, FileText, RefreshCw, UploadCloud, Table,
  Archive, CheckCircle2, Sliders, ArrowRight
} from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { setFeatureFlagCloud, setFeatureFlagsBatchCloud, setFeaturesTierBatchCloud } from '../services/adminDataService';
import { FEATURE_REGISTRY } from '../services/FeatureAccessManager';

export default function VisualBulkControlStudio({ currentUser, isDark = false }) {

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

  // 2. Bulk features from canonical registry
  const bulkFeatures = useMemo(() => {
    const raw = FEATURE_REGISTRY.filter(f => f.category === 'BULK_GENERATOR' || f.featureId === 'home_batch_shortcut');
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

  // 3. Filtered features by search query
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return bulkFeatures;
    const q = searchQuery.toLowerCase();
    return bulkFeatures.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.key.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.subcategory.toLowerCase().includes(q)
    );
  }, [bulkFeatures, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = bulkFeatures.length;
    const enabled = bulkFeatures.filter(f => f.enabled).length;
    const freeCount = bulkFeatures.filter(f => !f.isPaid).length;
    const paidCount = bulkFeatures.filter(f => f.isPaid).length;
    return { total, enabled, disabled: total - enabled, freeCount, paidCount };
  }, [bulkFeatures]);

  // 4. Toggle Feature Enable / Disable
  const handleToggleEnable = async (feature) => {
    setUpdatingKey(feature.key);
    const nextState = !feature.enabled;
    try {
      await setFeatureFlagCloud(feature.key, nextState, {
        name: feature.name,
        category: 'BULK_GENERATOR',
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
    const allKeys = bulkFeatures.map(f => f.key);
    try {
      await setFeaturesTierBatchCloud(allKeys, targetTier);
      showToast(`✨ All Bulk features set to ${targetTier === 'free' ? '100% FREE' : 'PAID PRO'}`);
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
      for (const f of bulkFeatures) {
        updates[f.key] = Boolean(enable);
      }
      await setFeatureFlagsBatchCloud(updates, { category: 'BULK_GENERATOR' });
      setLiveFlagsMap(prev => ({ ...prev, ...updates }));
      showToast(`✨ All Bulk features are now ${enable ? 'ENABLED' : 'DISABLED'}`);
    } catch (e) {
      showToast('❌ Batch enable update failed');
    } finally {
      setBulkProcessing(false);
    }
  };

  const inputTools = filteredFeatures.filter(f => f.subcategory === 'Input & Spreadsheet' || f.subcategory === 'Batch Screen');
  const styleTools = filteredFeatures.filter(f => f.subcategory === 'Batch Styling');
  const exportTools = filteredFeatures.filter(f => f.subcategory === 'Bulk Export');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Feedback Toast */}
      {feedbackToast && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 18, 33, 0.96)',
          border: '1.5px solid #8B5CF6',
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

      {/* ── Studio Header (Mobile-First UX) ── */}
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
              background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Layers size={16} strokeWidth={2.4} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, color: 'var(--ad-text-sec)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Total Tools
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
            placeholder="Search bulk creation features (e.g. CSV, Quick Sheet, ZIP Export, Style...)"
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

      {/* ── Section 1: Input & Spreadsheet Tools ── */}
      <BulkSectionCard
        title="1. Input & Spreadsheet Tools"
        subtitle="CSV/Excel import, interactive in-app Quick Sheet grid editor, and shortcuts."
        icon={FileSpreadsheet}
        badgeCount={inputTools.length}
        onMakeFree={() => setFeaturesTierBatchCloud(inputTools.map(f => f.key), 'free').then(() => showToast('✨ Input tools set to FREE'))}
        onMakePro={() => setFeaturesTierBatchCloud(inputTools.map(f => f.key), 'paid').then(() => showToast('✨ Input tools set to PRO'))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 10 }}>
          {inputTools.map(feature => (
            <BulkFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </BulkSectionCard>

      {/* ── Section 2: Batch Styling Engine ── */}
      <BulkSectionCard
        title="2. Batch Styling & Design Engine"
        subtitle="Apply active QR colors, dot patterns, eye finders and logos across thousands of codes."
        icon={Sparkles}
        badgeCount={styleTools.length}
        onMakeFree={() => setFeaturesTierBatchCloud(styleTools.map(f => f.key), 'free').then(() => showToast('✨ Batch Styling set to FREE'))}
        onMakePro={() => setFeaturesTierBatchCloud(styleTools.map(f => f.key), 'paid').then(() => showToast('✨ Batch Styling set to PRO'))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 10 }}>
          {styleTools.map(feature => (
            <BulkFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </BulkSectionCard>

      {/* ── Section 3: Save & Bulk Export Engine ── */}
      <BulkSectionCard
        title="3. Save & Bulk Export Engine"
        subtitle="Compressed ZIP bundle packaging, bulk PNG images, SVG vectors and PDF document sheets."
        icon={Download}
        badgeCount={exportTools.length}
        onMakeFree={() => setFeaturesTierBatchCloud(exportTools.map(f => f.key), 'free').then(() => showToast('✨ Bulk Export engine set to FREE'))}
        onMakePro={() => setFeaturesTierBatchCloud(exportTools.map(f => f.key), 'paid').then(() => showToast('✨ Bulk Export engine set to PRO'))}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 10 }}>
          {exportTools.map(feature => (
            <BulkFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </BulkSectionCard>
    </div>
  );
}

function BulkSectionCard({ title, subtitle, icon: Icon, badgeCount, onMakeFree, onMakePro, children }) {
  return (
    <div style={{
      background: 'var(--ad-card)',
      border: '1px solid var(--ad-border)',
      borderRadius: 18,
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
              background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6',
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
              {badgeCount} Tools
            </span>
          )}
        </div>

        {(onMakeFree || onMakePro) && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            width: '100%',
            padding: '5px',
            background: 'var(--ad-input)',
            borderRadius: 10,
            border: '1px solid var(--ad-border)',
            boxSizing: 'border-box'
          }}>
            {onMakeFree && (
              <button
                type="button"
                onClick={onMakeFree}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 8px',
                  borderRadius: 7,
                  background: isDark ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5',
                  border: `1.5px solid ${isDark ? 'rgba(16, 185, 129, 0.45)' : '#A7F3D0'}`,
                  color: isDark ? '#34D399' : '#047857',
                  fontSize: 10.5, fontWeight: 800, cursor: 'pointer',
                  boxShadow: isDark ? 'none' : '0 1px 2px rgba(4,120,87,0.06)'
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
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 8px',
                  borderRadius: 7,
                  background: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FFFBEB',
                  border: `1.5px solid ${isDark ? 'rgba(245, 158, 11, 0.45)' : '#FDE68A'}`,
                  color: isDark ? '#FBBF24' : '#B45309',
                  fontSize: 10.5, fontWeight: 800, cursor: 'pointer',
                  boxShadow: isDark ? 'none' : '0 1px 2px rgba(180,83,9,0.06)'
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

function BulkFeatureTile({ feature, updating, onToggleEnable, onToggleTier }) {
  const isOff = !feature.enabled;

  return (
    <div style={{
      background: isOff ? 'rgba(15, 18, 33, 0.4)' : 'var(--ad-input)',
      border: `1.5px solid ${isOff ? 'rgba(239, 68, 68, 0.3)' : (feature.isPaid ? 'rgba(245, 158, 11, 0.35)' : 'rgba(139, 92, 246, 0.35)')}`,
      borderRadius: 12,
      padding: '10px 8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 8,
      opacity: isOff ? 0.65 : 1,
      transition: 'all 0.18s ease',
      boxShadow: feature.isPaid ? '0 2px 8px rgba(245, 158, 11, 0.08)' : '0 2px 8px rgba(139, 92, 246, 0.08)'
    }}>
      {/* Top: Icon + Name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: isOff ? 'rgba(148, 163, 184, 0.15)' : (feature.isPaid ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(139, 92, 246, 0.15))' : 'rgba(139, 92, 246, 0.15)'),
          color: isOff ? 'var(--ad-text-sec)' : (feature.isPaid ? '#F59E0B' : '#8B5CF6'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Layers size={16} strokeWidth={2.4} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
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
            border: `1.5px solid ${feature.isPaid ? '#F59E0B' : '#8B5CF6'}`,
            background: feature.isPaid ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            fontSize: 9,
            fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            boxShadow: feature.isPaid ? '0 2px 6px rgba(245, 158, 11, 0.35)' : '0 2px 6px rgba(139, 92, 246, 0.35)'
          }}
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
