// src/components/admin/PlanManager.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard, Check, Settings, X, Lock, CheckSquare, Square,
  MinusSquare, Plus, Trash2, Edit, DollarSign, Globe, Sparkles,
  Percent, Shield, RefreshCw, AlertTriangle
} from 'lucide-react';
import { FEATURE_REGISTRY, CANONICAL_PLANS, DEFAULT_FREE_FEATURES, DEFAULT_PAID_FEATURES } from '../../services/FeatureAccessManager';
import { setPlanFeaturesCloud, savePlanFullCloud, deletePlanCloud } from '../../services/adminDataService';
import { SUPPORTED_CURRENCIES, formatCurrencyPrice } from '../../utils/currency';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { T } from './AdminUIKit';

const DEFAULT_PLAN_TEMPLATES = {
  free:    { id: 'free',    name: 'Free Starter',   price: 0,     period: '/lifetime', color: '#8b8fa8', desc: 'Basic standard QR & barcode features', popular: false, active: true },
  weekly:  { id: 'weekly',  name: 'Weekly Pass',    price: 0.21,  period: '/wk',       color: '#8b5cf6', desc: '7-day full pro access pass',          popular: false, active: true },
  monthly: { id: 'monthly', name: 'Monthly Pro',    price: 1.06,  period: '/mo',       color: '#3b82f6', desc: 'Full monthly access for creators',    popular: true,  active: true },
  yearly:  { id: 'yearly',  name: 'Yearly VIP',     price: 12.75, period: '/yr',       color: '#D60036', desc: 'Best value for high-volume teams',    popular: false, active: true },
};

export default function PlanManager() {
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  // Modals & Drawers
  const [editPlanModal, setEditPlanModal] = useState(null); // plan object to edit/create
  const [manageFeaturesPlan, setManageFeaturesPlan] = useState(null); // plan ID for entitlement check
  const [pendingFeatures, setPendingFeatures] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchFeature, setSearchFeature] = useState('');

  useEffect(() => {
    return onSnapshot(collection(db, 'subscription_plans'), colSnap => {
      const plans = {};
      colSnap.forEach(d => { plans[d.id] = d.data(); });
      setLivePlans(plans);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  // Merge default plans with live firestore plans
  const allPlansList = useMemo(() => {
    const map = { ...DEFAULT_PLAN_TEMPLATES };
    Object.keys(livePlans).forEach(k => {
      map[k] = { ...(map[k] || {}), ...livePlans[k] };
    });
    return Object.values(map);
  }, [livePlans]);

  // Open Edit / Create Plan Modal
  const handleOpenEdit = (plan) => {
    setEditPlanModal({
      id: plan?.id || `plan_${Date.now().toString().slice(-4)}`,
      name: plan?.name || 'New Custom Plan',
      price: plan?.price !== undefined ? plan.price : 9.99,
      period: plan?.period || '/mo',
      color: plan?.color || '#3b82f6',
      desc: plan?.desc || 'Custom subscription tier',
      popular: !!plan?.popular,
      active: plan?.active !== false,
      features: plan?.features || (plan?.id === 'free' ? [...DEFAULT_FREE_FEATURES] : [...DEFAULT_PAID_FEATURES])
    });
  };

  // Save Plan Details (Pricing, Name, Period, etc.)
  const handleSavePlanDetails = async () => {
    if (!editPlanModal || !editPlanModal.name.trim()) return;
    setIsSaving(true);
    try {
      await savePlanFullCloud(editPlanModal);
      setEditPlanModal(null);
    } catch (e) {
      alert('Error saving plan: ' + e.message);
    }
    setIsSaving(false);
  };

  // Delete Custom Plan
  const handleDeletePlan = async (planId) => {
    if (['free', 'weekly', 'monthly', 'yearly'].includes(planId)) {
      alert('Default canonical plans cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete plan "${planId}"?`)) {
      try {
        await deletePlanCloud(planId);
      } catch (e) {
        alert(e.message);
      }
    }
  };

  // Manage Features / Entitlements
  const openManageFeatures = (planId) => {
    const plan = livePlans[planId] || DEFAULT_PLAN_TEMPLATES[planId];
    const initialFeats = plan?.features || (planId === 'free' ? [...DEFAULT_FREE_FEATURES] : [...DEFAULT_PAID_FEATURES]);
    setPendingFeatures(initialFeats);
    setManageFeaturesPlan(planId);
    setSearchFeature('');
  };

  const handleSaveFeatures = async () => {
    setIsSaving(true);
    try {
      await setPlanFeaturesCloud(manageFeaturesPlan, pendingFeatures);
      setManageFeaturesPlan(null);
    } catch (e) {
      alert(e?.message || 'Failed to update plan features');
    }
    setIsSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, color: T.text, fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Top Header & Multi-Currency Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: T.bgCard, padding: '16px 20px', borderRadius: T.r.lg, border: `1px solid ${T.border}` }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={20} color={T.accent} /> Subscription & Billing Management
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: T.textSec }}>
            Configure plan pricing, billing periods, promotional badges, and regional currency conversion rates.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Currency Selector Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 10, border: `1px solid ${T.border}` }}>
            <Globe size={15} color={T.accent} />
            <span style={{ fontSize: 12, fontWeight: 700 }}>Currency Preview:</span>
            <select
              value={selectedCurrency}
              onChange={e => setSelectedCurrency(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: 12, fontWeight: 800, outline: 'none', cursor: 'pointer' }}
            >
              {SUPPORTED_CURRENCIES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#14141e', color: '#fff' }}>
                  {c.flag} {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleOpenEdit(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.accent, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(214,0,54,0.3)' }}
          >
            <Plus size={14} /> Add New Plan
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {allPlansList.map(plan => {
          const pId = plan.id;
          const feats = plan.features || (pId === 'free' ? DEFAULT_FREE_FEATURES : DEFAULT_PAID_FEATURES);
          const totalRegistry = FEATURE_REGISTRY.length;
          const pct = Math.round((feats.length / totalRegistry) * 100) || 0;
          const formattedPrice = formatCurrencyPrice(plan.price, selectedCurrency);

          return (
            <div
              key={pId}
              style={{
                background: T.bgCard,
                border: `1.5px solid ${plan.popular ? plan.color || T.accent : T.border}`,
                borderRadius: T.r.lg,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                boxShadow: plan.popular ? `0 8px 24px ${(plan.color || T.accent)}25` : 'none'
              }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: plan.color || T.accent, color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <Sparkles size={10} /> Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: plan.color || '#3b82f6' }} />
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.text }}>{plan.name || pId}</h3>
                </div>
                <div style={{ fontSize: 12, color: T.textSec, marginTop: 4 }}>{plan.desc}</div>
              </div>

              {/* Price & Converted Currency Tag */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: plan.color || T.accent, letterSpacing: '-0.5px' }}>
                  {formattedPrice}
                </span>
                <span style={{ fontSize: 13, color: T.textSec, fontWeight: 600 }}>{plan.period}</span>
                {selectedCurrency !== 'USD' && plan.price > 0 && (
                  <span style={{ fontSize: 11, color: T.textMut, marginLeft: 4 }}>
                    (${plan.price.toFixed(2)} USD)
                  </span>
                )}
              </div>

              {/* Entitlement Stats */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: T.textSec }}>Feature Access:</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: feats.length === totalRegistry ? '#10b981' : T.text }}>
                  {feats.length} / {totalRegistry} features ({pct}%)
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button
                  onClick={() => openManageFeatures(pId)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.05)', color: T.text, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Settings size={13} /> Entitlements
                </button>
                <button
                  onClick={() => handleOpenEdit(plan)}
                  title="Edit Pricing & Settings"
                  style={{ padding: '9px 12px', borderRadius: 8, border: 'none', background: (plan.color || T.accent) + '22', color: plan.color || T.accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  <Edit size={13} /> Edit
                </button>
                {!['free', 'weekly', 'monthly', 'yearly'].includes(pId) && (
                  <button
                    onClick={() => handleDeletePlan(pId)}
                    title="Delete Custom Plan"
                    style={{ padding: '9px 10px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Plan Modal */}
      {editPlanModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                {allPlansList.find(p => p.id === editPlanModal.id) ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h3>
              <button onClick={() => setEditPlanModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textSec }}><X size={20} /></button>
            </div>

            {/* Modal Form Fields */}
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Plan Name</label>
                <input
                  type="text"
                  value={editPlanModal.name}
                  onChange={e => setEditPlanModal({ ...editPlanModal, name: e.target.value })}
                  placeholder="e.g. Creator Pro"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Price (USD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editPlanModal.price}
                    onChange={e => setEditPlanModal({ ...editPlanModal, price: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Billing Period</label>
                  <select
                    value={editPlanModal.period}
                    onChange={e => setEditPlanModal({ ...editPlanModal, period: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="/wk">Weekly (/wk)</option>
                    <option value="/mo">Monthly (/mo)</option>
                    <option value="/3mo">Quarterly (/3mo)</option>
                    <option value="/yr">Yearly (/yr)</option>
                    <option value="/lifetime">Lifetime (/lifetime)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Description</label>
                <input
                  type="text"
                  value={editPlanModal.desc}
                  onChange={e => setEditPlanModal({ ...editPlanModal, desc: e.target.value })}
                  placeholder="Short marketing description"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Theme Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="color"
                      value={editPlanModal.color}
                      onChange={e => setEditPlanModal({ ...editPlanModal, color: e.target.value })}
                      style={{ width: 42, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }}
                    />
                    <input
                      type="text"
                      value={editPlanModal.color}
                      onChange={e => setEditPlanModal({ ...editPlanModal, color: e.target.value })}
                      style={{ flex: 1, padding: '8px 10px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, paddingTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={editPlanModal.popular}
                      onChange={e => setEditPlanModal({ ...editPlanModal, popular: e.target.checked })}
                    />
                    Highlight as "Most Popular"
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 20px', borderTop: `1px solid ${T.border}` }}>
              <button onClick={() => setEditPlanModal(null)} style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSec, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={handleSavePlanDetails} disabled={isSaving} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 800 }}>
                {isSaving ? 'Saving...' : 'Save Plan Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Plan Entitlements Modal Overlay */}
      {manageFeaturesPlan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 760, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                  Manage {manageFeaturesPlan.toUpperCase()} Plan Entitlements
                </h3>
                <span style={{ fontSize: 12, color: T.textSec }}>
                  {pendingFeatures.length} / {FEATURE_REGISTRY.length} features selected
                </span>
              </div>
              <button onClick={() => setManageFeaturesPlan(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textSec }}><X size={20} /></button>
            </div>

            {/* Quick Filter Search */}
            <div style={{ padding: '10px 20px', borderBottom: `1px solid ${T.border}`, background: T.bgEl }}>
              <input
                type="text"
                placeholder="Search features..."
                value={searchFeature}
                onChange={e => setSearchFeature(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }}
              />
            </div>

            {/* Modal Body: Feature List */}
            <div className="ad-scroll" style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
              {FEATURE_REGISTRY.filter(f => !searchFeature || f.displayName.toLowerCase().includes(searchFeature.toLowerCase()) || f.featureId.toLowerCase().includes(searchFeature.toLowerCase())).map(feat => {
                const checked = pendingFeatures.includes(feat.featureId);
                const isLocked = !feat.allowSuperAdminOverride;
                return (
                  <div
                    key={feat.featureId}
                    onClick={() => {
                      if (isLocked) return;
                      setPendingFeatures(prev => checked ? prev.filter(x => x !== feat.featureId) : [...prev, feat.featureId]);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, marginBottom: 4, background: checked ? 'rgba(214,0,54,0.08)' : 'transparent', border: `1px solid ${checked ? 'rgba(214,0,54,0.2)' : 'transparent'}`, cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1 }}
                  >
                    <div style={{ color: checked ? T.accent : T.textMut }}>
                      {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: checked ? '#fff' : T.text }}>{feat.displayName}</span>
                      <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{feat.featureId} &middot; {feat.category} &middot; {feat.subcategory}</div>
                    </div>
                    {isLocked && <Lock size={12} color="#f59e0b" title="Security Control" />}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 20px', borderTop: `1px solid ${T.border}` }}>
              <button onClick={() => setManageFeaturesPlan(null)} style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSec, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={handleSaveFeatures} disabled={isSaving} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 800 }}>
                {isSaving ? 'Saving...' : 'Save Entitlements'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

