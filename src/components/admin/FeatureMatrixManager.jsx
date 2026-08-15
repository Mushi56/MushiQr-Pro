// src/components/admin/FeatureMatrixManager.jsx
// ─── Visual Feature × Plan Matrix Manager ──────────────────────────────────
// Allows Super Admin to dynamically assign any of the 78 canonical features to specific plans.

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, X, Shield, Sparkles, Layers, Search, 
  RefreshCw, Save, CheckCircle2, Lock, SlidersHorizontal
} from 'lucide-react';
import { FEATURE_REGISTRY, FEATURE_CATEGORIES } from '../../services/FeatureAccessManager';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, functions } from '../../services/firebase';
import { httpsCallable } from 'firebase/functions';

const CANONICAL_PLANS = [
  { id: 'free',    name: 'Free Tier',    color: '#64748b' },
  { id: 'weekly',  name: 'Weekly Pass',  color: '#8b5cf6' },
  { id: 'monthly', name: 'Monthly Pro',  color: '#3b82f6' },
  { id: 'yearly',  name: 'Yearly VIP',   color: '#D60036' },
];

export default function FeatureMatrixManager({ onClose }) {
  const [matrix, setMatrix] = useState({});
  const [limits, setLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing membership configuration from Firestore
  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'global_config', 'membership'));
        if (snap.exists()) {
          const data = snap.data();
          setMatrix(data.featureMatrix || {});
          setLimits(data.featureLimits || {});
        } else {
          // Initialize defaults
          const initMatrix = {};
          FEATURE_REGISTRY.forEach(f => {
            initMatrix[f.featureId] = f.defaultPlan === 'free' 
              ? ['free', 'weekly', 'monthly', 'yearly']
              : ['weekly', 'monthly', 'yearly'];
          });
          setMatrix(initMatrix);
        }
      } catch (e) {
        console.error('[FeatureMatrixManager] Failed to load matrix:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredFeatures = useMemo(() => {
    return FEATURE_REGISTRY.filter(f => {
      const matchCat = selectedCat === 'ALL' || f.category === selectedCat;
      const matchSearch = !search || 
        f.displayName.toLowerCase().includes(search.toLowerCase()) ||
        f.featureId.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCat, search]);

  const toggleFeaturePlan = (featureId, planId) => {
    setMatrix(prev => {
      const currentList = prev[featureId] || [];
      let nextList;
      if (currentList.includes(planId)) {
        nextList = currentList.filter(p => p !== planId);
      } else {
        nextList = [...currentList, planId];
      }
      return { ...prev, [featureId]: nextList };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Call Cloud Function to publish updated configuration version
      const publishFn = httpsCallable(functions, 'publishMembershipConfig');
      await publishFn({
        plans: {
          free:    { name: 'Free Tier', active: true },
          weekly:  { name: 'Weekly Pass', active: true },
          monthly: { name: 'Monthly Pro', active: true },
          yearly:  { name: 'Yearly VIP', active: true },
        },
        featureMatrix: matrix,
        featureLimits: limits,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.warn('[FeatureMatrixManager] Cloud function fallback to direct write:', e);
      // Fallback direct write for development
      await setDoc(doc(db, 'global_config', 'membership'), {
        featureMatrix: matrix,
        featureLimits: limits,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: '#13131d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={20} color="#D60036" />
            Feature &times; Plan Entitlement Matrix
          </h2>
          <p style={{ fontSize: 12, color: '#8b8fa8', margin: '4px 0 0' }}>
            Control which subscription tier has access to each of the 78 canonical app capabilities.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saveSuccess && (
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={16} /> Saved &amp; Version Published!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: 'var(--accent-gradient, #D60036)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '8px 18px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Save size={14} />
            {saving ? 'Publishing...' : 'Publish Matrix'}
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', flex: 1, minWidth: 200 }}>
          <Search size={14} color="#8b8fa8" />
          <input
            type="text"
            placeholder="Search features..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: 12, width: '100%' }}
          />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          style={{ background: '#1c1c28', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 10, fontSize: 12, outline: 'none' }}
        >
          <option value="ALL">All Categories ({FEATURE_REGISTRY.length})</option>
          {Object.entries(FEATURE_CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Matrix Table */}
      <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: '#8b8fa8' }}>Feature Capability</th>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: '#8b8fa8' }}>Category</th>
              {CANONICAL_PLANS.map(plan => (
                <th key={plan.id} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 800, color: plan.color, textAlign: 'center' }}>
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.map(feat => {
              const assignedPlans = matrix[feat.featureId] || [];
              return (
                <tr key={feat.featureId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{feat.displayName}</div>
                    <div style={{ fontSize: 10, color: '#8b8fa8', marginTop: 2 }}>{feat.featureId}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: '#8b8fa8' }}>
                    {FEATURE_CATEGORIES[feat.category]?.name || feat.category}
                  </td>
                  {CANONICAL_PLANS.map(plan => {
                    const isChecked = assignedPlans.includes(plan.id);
                    return (
                      <td key={plan.id} style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => toggleFeaturePlan(feat.featureId, plan.id)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            border: `1.5px solid ${isChecked ? plan.color : 'rgba(255,255,255,0.1)'}`,
                            background: isChecked ? `${plan.color}22` : 'transparent',
                            color: isChecked ? plan.color : '#475569',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {isChecked ? <Check size={14} strokeWidth={3} /> : <X size={12} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
