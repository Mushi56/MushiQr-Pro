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

const FALLBACK_PLANS = [
  { id: 'weekly',  name: 'Weekly Pass', price: 4.99,  period: '/wk', color: '#8b5cf6', desc: '7-day full pro access pass' },
  { id: 'monthly', name: 'Monthly Pro', price: 14.99, period: '/mo', color: '#3b82f6', popular: true, desc: 'Full monthly access for creators' },
  { id: 'yearly',  name: 'Yearly VIP',  price: 99.99, period: '/yr', color: '#D60036', desc: 'Best value for 1 full year' },
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

  // Subscribe to live subscription_plans in Firestore
  useEffect(() => {
    return onSnapshot(collection(db, 'subscription_plans'), colSnap => {
      const plans = {};
      colSnap.forEach(d => { plans[d.id] = d.data(); });
      setLivePlans(plans);
    }, () => {});
  }, []);

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
      // Formatted regional price
      const priceText = formatCurrencyPrice(plan.price, selectedCurrency);
      
      // Simulate Billing checkout or in-app billing trigger
      setTimeout(() => {
        setBillingSuccess(`Thank you for choosing ${plan.name} (${priceText}${plan.period})! Your subscription is being activated.`);
        setSubscribing(null);
      }, 1200);
    } catch (e) {
      console.error('Subscribe error:', e);
      setSubscribing(null);
    }
  };

  return (
    <div className="premium-modal-overlay" onClick={hidePaywall}>
      <div className="premium-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Close button */}
        <button className="premium-modal-close" onClick={hidePaywall}>
          <X size={20} />
        </button>

        {/* Header */}
        <div className="premium-modal-header">
          <div className="premium-modal-icon">
            <Crown size={32} />
          </div>
          <h2 className="premium-modal-title">Upgrade to Pro</h2>
          <p className="premium-modal-subtitle">
            {lockedFeature
              ? `Unlock "${lockedFeature.displayName}" and all premium creator tools`
              : 'Unlock unlimited high-resolution exports, custom shapes, templates & cloud sync'}
          </p>

          {/* Regional Currency Selector Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 14px',
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <Globe size={14} color="#D60036" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>Region / Currency:</span>
            <select
              value={selectedCurrency}
              onChange={e => handleCurrencyChange(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: 12,
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
          <div style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Check size={28} />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>Subscription Initiated</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 400, margin: 0, lineHeight: 1.5 }}>
              {billingSuccess}
            </p>
            <button
              onClick={() => { setBillingSuccess(null); hidePaywall(); }}
              style={{ background: 'var(--accent-gradient)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginTop: 10 }}
            >
              Continue to App
            </button>
          </div>
        ) : (
          <>
            {/* Plan Cards Grid with Real-time Currency Conversion */}
            <div className="premium-plans-grid" style={{ gridTemplateColumns: `repeat(${displayPlans.length > 3 ? 2 : displayPlans.length}, 1fr)` }}>
              {displayPlans.map(plan => {
                const isCurrent = isPremium && currentPlan === plan.id;
                const formattedPrice = formatCurrencyPrice(plan.price, selectedCurrency);

                return (
                  <div
                    key={plan.id}
                    className={`premium-plan-card ${plan.popular ? 'popular' : ''}`}
                    style={{ '--plan-color': plan.color || '#D60036', position: 'relative' }}
                  >
                    {plan.popular && (
                      <div className="premium-plan-popular-badge">
                        <Star size={10} /> Most Popular
                      </div>
                    )}
                    <div className="premium-plan-name">{plan.name}</div>
                    
                    {/* Localized Price */}
                    <div className="premium-plan-price" style={{ margin: '10px 0' }}>
                      <span className="premium-plan-amount" style={{ fontSize: '24px', fontWeight: 900 }}>
                        {formattedPrice}
                      </span>
                      <span className="premium-plan-period" style={{ fontSize: '12px' }}>{plan.period}</span>
                    </div>

                    {selectedCurrency !== 'USD' && plan.price > 0 && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 8 }}>
                        (${plan.price.toFixed(2)} USD standard)
                      </div>
                    )}

                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 14, minHeight: '28px', lineHeight: 1.3 }}>
                      {plan.desc}
                    </div>

                    <button
                      className="premium-plan-subscribe-btn"
                      disabled={subscribing === plan.id || isCurrent}
                      onClick={() => handleSubscribe(plan)}
                      style={{ background: plan.color || '#D60036' }}
                    >
                      {subscribing === plan.id ? (
                        <span className="premium-spinner" />
                      ) : (
                        <>
                          <Zap size={14} />
                          {isCurrent ? 'Current Plan' : 'Subscribe'}
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
                <Sparkles size={14} /> Everything included with Pro:
              </div>
              <div className="premium-features-grid">
                {[
                  'Unlimited 4K & Ultra-HD Resolution Exports',
                  'SVG Vector & PDF Document Downloads',
                  'Custom Dot Styles & Fluid Finder Eye Shapes',
                  'Custom Logo Embedding & Color Presets',
                  'Cloud Backup & History Synchronization',
                  'Bulk Spreadsheet Generator & ZIP Bundles',
                  'All 30+ 1D/2D Industrial Barcode Standards',
                  'Offline License Verification & Priority Processing'
                ].map((text, i) => (
                  <div key={i} className="premium-feature-item">
                    <Check size={14} className="premium-feature-check" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Guarantees Footer */}
            <div className="premium-modal-footer">
              <Shield size={12} />
              <span>Cancel anytime &middot; Multi-currency checkout &middot; Instant access</span>
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

