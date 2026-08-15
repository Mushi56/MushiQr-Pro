// src/components/admin/PlanManager.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { CreditCard, Check, Settings, X, Lock, CheckSquare, Square, MinusSquare } from 'lucide-react';
import { FEATURE_REGISTRY, CANONICAL_PLANS, DEFAULT_FREE_FEATURES, DEFAULT_PAID_FEATURES, CATEGORY_SUBCATEGORIES } from '../../services/FeatureAccessManager';
import { setPlanFeaturesCloud } from '../../services/adminDataService';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { T } from './AdminUIKit';

const PLAN_PRICES = { free: '$0', weekly: '$4.99/wk', monthly: '$14.99/mo', yearly: '$99.99/yr' };

export default function PlanManager() {
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeManagePlan, setActiveManagePlan] = useState(null); // 'free'|'weekly'|'monthly'|'yearly' or null
  const [pendingFeatures, setPendingFeatures] = useState([]); // List of featureIds selected for plan currently managing
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, 'subscription_plans'), colSnap => {
      const plans = {};
      colSnap.forEach(d => { plans[d.id] = d.data(); });
      setLivePlans(plans);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const openManage = (planId) => {
    const plan = livePlans[planId];
    const initialFeats = plan?.features || (planId === 'free' ? [...DEFAULT_FREE_FEATURES] : [...DEFAULT_PAID_FEATURES]);
    setPendingFeatures(initialFeats);
    setActiveManagePlan(planId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setPlanFeaturesCloud(activeManagePlan, pendingFeatures);
      setActiveManagePlan(null);
    } catch (e) {
      alert(e?.message || 'Failed to update plan');
    }
    setIsSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: T.text, fontFamily: 'Outfit, sans-serif' }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: 16, fontWeight: 700 }}>Plan & Entitlement Settings</h2>

      {/* Plan Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {CANONICAL_PLANS.map(pId => {
          const plan = livePlans[pId] || {};
          const feats = plan.features || (pId === 'free' ? DEFAULT_FREE_FEATURES : DEFAULT_PAID_FEATURES);
          const totalRegistry = FEATURE_REGISTRY.length;
          const pct = Math.round((feats.length / totalRegistry) * 100) || 0;

          return (
            <div key={pId} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.lg, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{pId}</h3>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.accent, marginTop: 4 }}>{PLAN_PRICES[pId]}</div>
                </div>
                <CreditCard size={24} color={T.textSec} />
              </div>

              <div style={{ fontSize: 13, color: T.textSec }}>
                <strong style={{ color: T.text }}>{feats.length}</strong> / {totalRegistry} features enabled ({pct}%)
              </div>

              <button onClick={() => openManage(pId)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: 'none', background: T.accentLow, color: T.accent, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}>
                <Settings size={14} /> Manage Features
              </button>
            </div>
          );
        })}
      </div>

      {/* Manage Plan Modal Overlay */}
      {activeManagePlan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 720, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Manage {activeManagePlan.toUpperCase()} Plan Entitlements</h3>
                <span style={{ fontSize: 11, color: T.textSec }}>{pendingFeatures.length} / {FEATURE_REGISTRY.length} features selected</span>
              </div>
              <button onClick={() => setActiveManagePlan(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textSec }}><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div className="ad-scroll" style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {FEATURE_REGISTRY.map(feat => {
                const checked = pendingFeatures.includes(feat.featureId);
                const isLocked = !feat.allowSuperAdminOverride;
                return (
                  <div key={feat.featureId} onClick={() => {
                    if (isLocked) return;
                    setPendingFeatures(prev => checked ? prev.filter(x => x !== feat.featureId) : [...prev, feat.featureId]);
                  }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${T.border}`, cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1 }}>
                    <div style={{ color: checked ? T.accent : T.textMut }}>
                      {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{feat.displayName}</span>
                      <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{feat.featureId} · {feat.category}</div>
                    </div>
                    {isLocked && <Lock size={12} color={T.orange} />}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 20px', borderTop: `1px solid ${T.border}` }}>
              <button onClick={() => setActiveManagePlan(null)} style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSec, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={handleSave} disabled={isSaving} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                {isSaving ? 'Saving...' : 'Save Entitlements'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
