// src/components/PremiumModal.jsx
// ─── Premium Paywall Modal ─────────────────────────────────────────────────
// Glassmorphism upgrade modal showing Weekly, Monthly, and Yearly subscription plans.

import { useState } from 'react';
import { X, Check, Crown, Zap, Star, Shield, Sparkles } from 'lucide-react';
import { usePremium } from '../services/premiumContext';

const CANONICAL_PAID_PLANS = [
  { id: 'weekly', name: 'Weekly Pass', price: 2.99, period: '/wk', color: '#a855f7', desc: '7-day full pro access' },
  { id: 'monthly', name: 'Monthly Pro', price: 7.99, period: '/mo', color: '#3b82f6', popular: true, desc: 'Full monthly access' },
  { id: 'yearly', name: 'Yearly Pass', price: 49.99, period: '/yr', color: '#22c55e', desc: 'Best value for 1 full year' },
];

export default function PremiumModal() {
  const {
    paywallOpen, hidePaywall, paywallFeature,
    premiumFeatures, isPremium, currentPlan,
  } = usePremium();
  const [subscribing, setSubscribing] = useState(null);

  if (!paywallOpen) return null;

  const lockedFeature = paywallFeature
    ? premiumFeatures.find(f => f.featureId === paywallFeature)
    : null;

  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    try {
      // Direct user to subscription handler or contact admin
      alert(`Selected ${planId} plan. In production, this initiates Google Play Billing / Stripe Checkout.`);
    } catch (e) {
      console.error('Subscribe error:', e);
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="premium-modal-overlay" onClick={hidePaywall}>
      <div className="premium-modal" onClick={e => e.stopPropagation()}>
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
              ? `Unlock "${lockedFeature.displayName}" and all premium features`
              : 'Unlock all premium features and take your QR codes to the next level'}
          </p>
        </div>

        {/* Plan Cards */}
        <div className="premium-plans-grid">
          {CANONICAL_PAID_PLANS.map(plan => (
            <div
              key={plan.id}
              className={`premium-plan-card ${plan.popular ? 'popular' : ''}`}
              style={{ '--plan-color': plan.color }}
            >
              {plan.popular && (
                <div className="premium-plan-popular-badge">
                  <Star size={10} /> Most Popular
                </div>
              )}
              <div className="premium-plan-name">{plan.name}</div>
              <div className="premium-plan-price">
                <span className="premium-plan-currency">$</span>
                <span className="premium-plan-amount">{plan.price.toFixed(2)}</span>
                <span className="premium-plan-period">{plan.period}</span>
              </div>
              <button
                className="premium-plan-subscribe-btn"
                disabled={subscribing === plan.id}
                onClick={() => handleSubscribe(plan.id)}
                style={{ background: plan.color }}
              >
                {subscribing === plan.id ? (
                  <span className="premium-spinner" />
                ) : (
                  <>
                    <Zap size={14} />
                    {isPremium && currentPlan === plan.id ? 'Current Plan' : 'Subscribe'}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="premium-features-list">
          <div className="premium-features-title">
            <Sparkles size={14} /> Everything included:
          </div>
          <div className="premium-features-grid">
            {premiumFeatures.map(f => (
              <div key={f.featureId} className="premium-feature-item">
                <Check size={14} className="premium-feature-check" />
                <span>{f.displayName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="premium-modal-footer">
          <Shield size={12} />
          <span>Cancel anytime · Secure payment · Instant access</span>
        </div>
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
