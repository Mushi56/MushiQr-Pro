// src/components/PremiumModal.jsx
// ─── Premium Paywall & Billing Modal ───────────────────────────────────────
// Glassmorphism upgrade modal showing dynamic live subscription plans from Firestore,
// automatic regional currency detection, multi-currency conversion rates, and billing options.

import { useState, useEffect, useMemo } from 'react';
import { X, Check, Crown, Zap, Star, Shield, Sparkles, Globe, CreditCard, Lock } from 'lucide-react';
import { usePremium } from '../services/premiumContext';
import { SUPPORTED_CURRENCIES, detectUserCurrency, formatCurrencyPrice } from '../utils/currency';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import { PaymentProvider } from '../services/payment/PaymentProvider';

const FALLBACK_PLANS = [
  { id: 'weekly',  name: 'Weekly Pass', price: 0.21,  period: '/wk', color: '#8b5cf6', desc: '7-day full pro access pass' },
  { id: 'monthly', name: 'Monthly Pro', price: 1.06,  period: '/mo', color: '#3b82f6', popular: true, desc: 'Full monthly access for creators' },
  { id: 'yearly',  name: 'Yearly VIP',  price: 12.75, period: '/yr', color: '#D60036', desc: 'Best value for 1 full year' },
];

export default function PremiumModal() {
  const {
    paywallOpen, hidePaywall, paywallFeature,
    premiumFeatures, isPremium, currentPlan,
  } = usePremium();

  const [livePlans, setLivePlans] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState(() => detectUserCurrency());
  const [subscribing, setSubscribing] = useState(null);
  const [billingSuccess, setBillingSuccess] = useState(null);
  const [restoring, setRestoring] = useState(false);

  // Subscribe to live subscription_plans in Firestore
  useEffect(() => {
    return onSnapshot(collection(db, 'subscription_plans'), colSnap => {
      const plans = {};
      colSnap.forEach(d => { plans[d.id] = d.data(); });
      setLivePlans(plans);
    }, () => {});
  }, []);

  const [selectedPlanId, setSelectedPlanId] = useState('monthly');

  // Format plans list (excluding free plan from purchase modal)
  const displayPlans = useMemo(() => {
    const list = [];
    const baseMap = {
      weekly:  { ...FALLBACK_PLANS[0], ...(livePlans.weekly || {}) },
      monthly: { ...FALLBACK_PLANS[1], ...(livePlans.monthly || {}) },
      yearly:  { ...FALLBACK_PLANS[2], ...(livePlans.yearly || {}) },
    };

    // Add canonical paid plans
    ['weekly', 'monthly', 'yearly'].forEach(pId => {
      if (baseMap[pId] && baseMap[pId].active !== false) {
        list.push(baseMap[pId]);
      }
    });

    // Add any custom extra plans created by Admin
    Object.keys(livePlans).forEach(k => {
      if (!['free', 'weekly', 'monthly', 'yearly'].includes(k)) {
        const customPlan = livePlans[k];
        if (customPlan && customPlan.active !== false) {
          list.push({
            id: k,
            name: customPlan.name || k,
            price: customPlan.price || 9.99,
            period: customPlan.period || '/mo',
            color: customPlan.color || '#a855f7',
            desc: customPlan.desc || 'Custom subscription pass',
            popular: !!customPlan.popular
          });
        }
      }
    });

    return list;
  }, [livePlans]);

  if (!paywallOpen) return null;

  const lockedFeature = paywallFeature
    ? premiumFeatures.find(f => f.featureId === paywallFeature)
    : null;

  const handleCurrencyChange = (newCode) => {
    setSelectedCurrency(newCode);
    try {
      localStorage.setItem('mushiqr_selected_currency', newCode);
    } catch {}
  };

  const handleSubscribe = async (plan) => {
    setSubscribing(plan.id);
    try {
      const result = await PaymentProvider.purchase(plan, { currency: selectedCurrency });
      const priceText = formatCurrencyPrice(plan.price, selectedCurrency);
      setBillingSuccess(`Thank you for choosing ${plan.name} (${priceText}${plan.period})! Your subscription is active.`);
      setSubscribing(null);
    } catch (e) {
      console.error('Subscribe error:', e);
      alert('Subscription flow interrupted: ' + (e.message || 'Payment cancelled'));
      setSubscribing(null);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await PaymentProvider.restorePurchases();
      alert('Purchases checked. If an active subscription exists, your access has been refreshed.');
    } catch (e) {
      alert('Failed to restore purchases: ' + e.message);
    } finally {
      setRestoring(false);
    }
  };

  const activeSelectedPlan = displayPlans.find(p => p.id === selectedPlanId) || displayPlans[0];

  return (
    <div className="premium-modal-overlay" onClick={hidePaywall}>
      <div className="premium-modal" onClick={e => e.stopPropagation()}>
        {/* Mobile Drag Indicator */}
        <div className="premium-modal-handle" />

        {/* Close button */}
        <button className="premium-modal-close" onClick={hidePaywall} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="premium-modal-header">
          <div className="premium-modal-icon">
            <Crown size={28} />
          </div>
          <h2 className="premium-modal-title">Upgrade to Pro</h2>
          <p className="premium-modal-subtitle">
            {lockedFeature
              ? `Unlock "${lockedFeature.displayName}" and all premium tools`
              : 'Unlock unlimited high-res exports, custom shapes, templates & cloud sync'}
          </p>

          {/* Regional Currency Selector Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '5px 12px',
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <Globe size={13} color="#D60036" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>Region:</span>
            <select
              value={selectedCurrency}
              onChange={e => handleCurrencyChange(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {SUPPORTED_CURRENCIES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#13131d', color: '#fff' }}>
                  {c.flag} {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {billingSuccess ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Check size={26} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>Subscription Activated</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 360, margin: 0, lineHeight: 1.5 }}>
              {billingSuccess}
            </p>
            <button
              onClick={() => { setBillingSuccess(null); hidePaywall(); }}
              style={{ background: 'var(--accent-gradient)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', marginTop: 10, width: '100%', maxWidth: 280 }}
            >
              Continue to App
            </button>
          </div>
        ) : (
          <>
            {/* Mobile-Friendly Plan Cards */}
            <div className="premium-plans-grid">
              {displayPlans.map(plan => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrent = isPremium && currentPlan === plan.id;
                const formattedPrice = formatCurrencyPrice(plan.price, selectedCurrency);

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`premium-plan-card ${plan.popular ? 'popular' : ''} ${isSelected ? 'selected' : ''}`}
                    style={{ '--plan-color': plan.color || '#D60036' }}
                  >
                    {plan.popular && (
                      <div className="premium-plan-popular-badge">
                        <Star size={9} /> Best Value
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="premium-plan-name">
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: plan.color || '#D60036', display: 'inline-block' }} />
                        {plan.name}
                      </div>

                      <div className="premium-plan-price">
                        <span className="premium-plan-amount">{formattedPrice}</span>
                        <span className="premium-plan-period">{plan.period}</span>
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {plan.desc}
                      </div>
                    </div>

                    <button
                      className="premium-plan-subscribe-btn"
                      disabled={subscribing === plan.id || isCurrent}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubscribe(plan);
                      }}
                      style={{ background: plan.color || '#D60036' }}
                    >
                      {subscribing === plan.id ? (
                        <span className="premium-spinner" />
                      ) : (
                        <>
                          <Zap size={13} />
                          {isCurrent ? 'Active' : 'Get Plan'}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Everything Included Feature Checklist */}
            <div className="premium-features-list">
              <div className="premium-features-title">
                <Sparkles size={13} /> Everything included with Pro:
              </div>
              <div className="premium-features-grid">
                {[
                  'Ultra-HD & 4K Resolution Downloads',
                  'Vector SVG & High-Res PDF Exports',
                  'Fluid Finder Eyes & Custom Dot Patterns',
                  'Brand Logo Presets & Custom Eraser Tool',
                  'Auto Cloud History Sync & Backup',
                  'Bulk Spreadsheet Generator & ZIP Bundles',
                  'Industrial 1D & 2D Barcode Standards',
                  'Offline License Gating & Priority Processing'
                ].map((text, i) => (
                  <div key={i} className="premium-feature-item">
                    <Check size={13} className="premium-feature-check" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Guarantees & Restore Footer */}
            <div className="premium-modal-footer" style={{ flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Shield size={12} />
                <span>Cancel anytime &middot; Secure checkout &middot; Instant access</span>
              </div>
              <button
                onClick={handleRestore}
                disabled={restoring}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  marginTop: 2,
                }}
              >
                {restoring ? 'Restoring purchases...' : 'Restore Purchases'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Small PRO Badge for locked features ───────────────────────────────────
export function ProBadge({ featureId, onClick, children, style }) {
  const { canAccess, showPaywall } = usePremium();
  
  if (canAccess(featureId)) return children || null;

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onClick) onClick(e);
    else showPaywall(featureId);
  };

  return (
    <div className="pro-badge-wrapper" style={style}>
      {children}
      <button className="pro-badge" onClick={handleClick} title="PRO feature — tap to upgrade">
        <Crown size={8} />
        <span>PRO</span>
      </button>
    </div>
  );
}

