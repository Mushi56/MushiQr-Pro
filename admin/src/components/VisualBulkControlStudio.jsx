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
import { setFeatureFlagCloud, setFeaturesTierBatchCloud } from '../services/adminDataService';
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
        updates[f.key] = enable;
        await setFeatureFlagCloud(f.key, enable, { name: f.name, category: 'BULK_GENERATOR' });
      }
      setLiveFlagsMap(prev => ({ ...prev, ...updates }));
      showToast(`✨ All Bulk features are now ${enable ? 'ENABLED' : 'DISABLED'}`);
    } catch (e) {
      showToast('❌ Batch enable update failed');
    } finally {
      setBulkProcessing(false);
    }
  };

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
          border: '1.5px solid #8B5CF6',
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
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(255, 77, 157, 0.15) 100%)',
              border: '1.5px solid rgba(139, 92, 246, 0.4)',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)'
            }}>
              <Layers size={28} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ad-text)', margin: 0, letterSpacing: '-0.4px' }}>
                  Bulk Batch Creation Visual Studio
                </h1>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100, background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
                  Live App Layout
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '4px 0 0', fontWeight: 500 }}>
                Visually manage CSV/Excel uploads, spreadsheet grid editor, batch styling and ZIP export features. Click any tile to enable, disable, hide, or make Free vs Paid Pro.
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
              title="Unlock all Bulk features for 100% Free users"
            >
              <Shield size={14} />
              <span>Make Bulk Free</span>
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
              title="Lock all Bulk features behind Paid Pro subscription"
            >
              <Crown size={14} />
              <span>Make Bulk Pro</span>
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
            <div style={{ fontSize: 11, color: 'var(--ad-text-sec)', fontWeight: 700 }}>Total Bulk Tools</div>
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
      </div>

      {/* ── Section 1: Bulk Capabilities Grid ───────────────────────────────── */}
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
              background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Layers size={18} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--ad-text)', margin: 0 }}>
                Bulk Batch Creation Tools &amp; Quota Access
              </h2>
              <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '2px 0 0', fontWeight: 500 }}>
                Manage full bulk workflow permissions: CSV upload, in-app spreadsheet editor, batch styling and ZIP bundle downloads.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {filteredFeatures.map(feature => (
            <BulkFeatureTile
              key={feature.key}
              feature={feature}
              updating={updatingKey === feature.key}
              onToggleEnable={() => handleToggleEnable(feature)}
              onToggleTier={() => handleToggleTier(feature)}
            />
          ))}
        </div>
      </div>

      {/* ── Section 2: Interactive In-App Bulk Generator Visual Mockup ───────── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(255, 77, 157, 0.12)', color: '#FF4D9D',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Table size={18} strokeWidth={2.4} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--ad-text)', margin: 0 }}>
              Live App Bulk Screen Interactive Preview
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '2px 0 0', fontWeight: 500 }}>
              This is the live visual structure of the Batch Creation Grid as users see it in the app.
            </p>
          </div>
        </div>

        {/* Mock Spreadsheet Grid */}
        <div style={{
          background: 'var(--ad-input)',
          border: '1px solid var(--ad-border)',
          borderRadius: 14,
          overflow: 'hidden'
        }}>
          {/* Mock Top Toolbar */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--ad-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            background: 'rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)' }}>Batch Job #1042</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                50 Codes Loaded
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 8, background: 'var(--ad-card)', color: 'var(--ad-text-sec)', border: '1px solid var(--ad-border)' }}>
                📁 Upload CSV
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 8, background: 'var(--ad-card)', color: 'var(--ad-text-sec)', border: '1px solid var(--ad-border)' }}>
                🎨 Apply Style
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#8B5CF6', color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Archive size={12} />
                <span>Export ZIP</span>
              </div>
            </div>
          </div>

          {/* Table Rows Preview */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--ad-border)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 14px', color: 'var(--ad-text-sec)', fontWeight: 800 }}>#</th>
                  <th style={{ padding: '8px 14px', color: 'var(--ad-text-sec)', fontWeight: 800 }}>Format</th>
                  <th style={{ padding: '8px 14px', color: 'var(--ad-text-sec)', fontWeight: 800 }}>Data / Payload</th>
                  <th style={{ padding: '8px 14px', color: 'var(--ad-text-sec)', fontWeight: 800 }}>Custom Label</th>
                  <th style={{ padding: '8px 14px', color: 'var(--ad-text-sec)', fontWeight: 800 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, type: 'QR Code', data: 'https://mushiqr.app/menu/table-1', label: 'Table 1 QR', status: 'Ready' },
                  { id: 2, type: 'EAN-13', data: '8901234567890', label: 'Item SKU #A102', status: 'Ready' },
                  { id: 3, type: 'Code 128', data: 'PKG-2026-X99', label: 'Shipping Label', status: 'Ready' },
                  { id: 4, type: 'Data Matrix', data: 'LOT-992-EXP2028', label: 'Pharma Batch', status: 'Ready' },
                ].map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--ad-border)' }}>
                    <td style={{ padding: '9px 14px', color: 'var(--ad-text-sec)', fontWeight: 700 }}>{row.id}</td>
                    <td style={{ padding: '9px 14px', color: '#8B5CF6', fontWeight: 800 }}>{row.type}</td>
                    <td style={{ padding: '9px 14px', color: 'var(--ad-text)', fontFamily: 'monospace' }}>{row.data}</td>
                    <td style={{ padding: '9px 14px', color: 'var(--ad-text)' }}>{row.label}</td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MICRO SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════

function BulkFeatureTile({ feature, updating, onToggleEnable, onToggleTier }) {
  const isOff = !feature.enabled;

  return (
    <div style={{
      background: isOff ? 'rgba(15, 18, 33, 0.4)' : 'var(--ad-input)',
      border: `1.5px solid ${isOff ? 'rgba(239, 68, 68, 0.3)' : (feature.isPaid ? 'rgba(245, 158, 11, 0.35)' : 'rgba(139, 92, 246, 0.35)')}`,
      borderRadius: 14,
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 12,
      opacity: isOff ? 0.65 : 1,
      transition: 'all 0.18s ease',
      boxShadow: feature.isPaid ? '0 2px 10px rgba(245, 158, 11, 0.08)' : '0 2px 10px rgba(139, 92, 246, 0.08)'
    }}>
      {/* Top row: Format icon badge + Name + Description */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: isOff ? 'rgba(148, 163, 184, 0.15)' : (feature.isPaid ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(139, 92, 246, 0.15))' : 'rgba(139, 92, 246, 0.15)'),
          color: isOff ? 'var(--ad-text-sec)' : (feature.isPaid ? '#F59E0B' : '#8B5CF6'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Layers size={18} strokeWidth={2.4} />
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
