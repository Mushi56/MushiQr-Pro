// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, CreditCard, CheckSquare, Shield, ChevronRight } from 'lucide-react';
import { FEATURE_REGISTRY, CATEGORY_SUBCATEGORIES, CANONICAL_PLANS } from '../../services/FeatureAccessManager';
import { db } from '../../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { T, ProgressBar } from './AdminUIKit';

const CAT_META = {
  HOME: { name: 'Home Screen', color: '#10b981' },
  QR_CONTENT: { name: 'QR Content Types', color: '#D60036' },
  QR_ENGINE: { name: 'QR Engine & Controls', color: '#ef4444' },
  BARCODE_FORMATS: { name: 'Barcode Standards', color: '#8b5cf6' },
  BARCODE_ENGINE: { name: 'Barcode Engine & Styling', color: '#7c3aed' },
  SCANNER: { name: 'QR & Barcode Scanner', color: '#3b82f6' },
  DESIGN: { name: 'Design & Customization', color: '#f59e0b' },
  TEMPLATES: { name: 'Templates Library', color: '#06b6d4' },
  EXPORT: { name: 'Export & Downloads', color: '#10b981' },
  BATCH: { name: 'Batch & Bulk Operations', color: '#f97316' },
  SAVED: { name: 'Saved Collection', color: '#ef4444' },
  HISTORY: { name: 'History Tracking', color: '#6b7280' },
  CLOUD: { name: 'Cloud & Data Sync', color: '#0ea5e9' },
  SETTINGS: { name: 'Settings & Preferences', color: '#8b8fa8' },
  ACCOUNT: { name: 'Account & Profile', color: '#a78bfa' }
};

export default function AdminDashboard({ onNavigate }) {
  const [liveFlags, setLiveFlags] = useState({});
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let u1, u2;
    try {
      u1 = onSnapshot(doc(db, 'global_config', 'featureFlags'), snap => {
        setLiveFlags(snap.exists() ? snap.data() : {});
        setLoading(false);
      }, () => setLoading(false));
    } catch { setLoading(false); }

    try {
      u2 = onSnapshot(collection(db, 'subscription_plans'), colSnap => {
        const plans = {};
        colSnap.forEach(d => { plans[d.id] = d.data(); });
        setLivePlans(plans);
      }, () => {});
    } catch {}

    return () => { u1?.(); u2?.(); };
  }, []);

  const totalFeatures = FEATURE_REGISTRY.length;
  const enabledFeatures = useMemo(() => {
    return FEATURE_REGISTRY.filter(f => {
      const v = liveFlags[f.featureId];
      return v !== undefined ? Boolean(v) : f.defaultEnabled;
    }).length;
  }, [liveFlags]);

  const restrictedFeatures = totalFeatures - enabledFeatures;

  const categoryProgress = useMemo(() => {
    return Object.keys(CAT_META).map(catId => {
      const feats = FEATURE_REGISTRY.filter(f => f.category === catId);
      const total = feats.length;
      const enabled = feats.filter(f => {
        const v = liveFlags[f.featureId];
        return v !== undefined ? Boolean(v) : f.defaultEnabled;
      }).length;
      return { id: catId, name: CAT_META[catId].name, color: CAT_META[catId].color, total, enabled };
    });
  }, [liveFlags]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: T.text, fontFamily: 'Outfit, sans-serif' }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: T.textSec, fontWeight: 600 }}>Total Features</span>
            <CheckSquare size={20} color={T.purple} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{totalFeatures}</div>
          <div style={{ fontSize: 12, color: T.textMut, marginTop: 4 }}>Authoritative Registry</div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: T.textSec, fontWeight: 600 }}>Active Globally</span>
            <CheckSquare size={20} color={T.green} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.green }}>{enabledFeatures}</div>
          <div style={{ fontSize: 12, color: T.textMut, marginTop: 4 }}>Currently enabled online</div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: T.textSec, fontWeight: 600 }}>Restricted</span>
            <CheckSquare size={20} color={T.red} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.red }}>{restrictedFeatures}</div>
          <div style={{ fontSize: 12, color: T.textMut, marginTop: 4 }}>Bypassed or turned off</div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: T.textSec, fontWeight: 600 }}>Customer Plans</span>
            <CreditCard size={20} color={T.orange} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.orange }}>{CANONICAL_PLANS.length}</div>
          <div style={{ fontSize: 12, color: T.textMut, marginTop: 4 }}>Free, Weekly, Monthly, Yearly</div>
        </div>
      </div>

      {/* Main Grid split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {/* Category Performance */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.lg, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 700 }}>Category Feature Matrix</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categoryProgress.map(cat => (
              <div key={cat.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600, color: T.textSec }}>{cat.name}</span>
                  <span style={{ fontWeight: 700 }}>{cat.enabled} / {cat.total}</span>
                </div>
                <ProgressBar val={cat.enabled} max={cat.total} color={cat.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plan Summary */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.lg, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 700 }}>Authoritative Active Plans</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CANONICAL_PLANS.map(pId => {
              const plan = livePlans[pId] || {};
              const feats = plan.features || [];
              const pct = Math.round((feats.length / totalFeatures) * 100) || 0;
              return (
                <div key={pId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>{pId} Plan</span>
                    <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{feats.length} features enabled ({pct}%)</div>
                  </div>
                  <button onClick={() => onNavigate?.('feature-flags')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: T.blue, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Configure <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
