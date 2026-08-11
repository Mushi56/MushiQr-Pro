// src/components/PremiumModal.jsx
// ─── Premium Paywall Modal ─────────────────────────────────────────────────
// Beautiful glassmorphism upgrade modal with plan cards.

import { useState } from 'react';
import { X, Check, Crown, Zap, Star, Shield, Sparkles } from 'lucide-react';
import { usePremium } from '../services/premiumContext';

const PERIOD_LABELS = {
  day: '/day',
  week: '/week',
  month: '/mo',
  year: '/year',
  forever: '',
};

export default function PremiumModal() {
  const {
    paywallOpen, hidePaywall, paywallFeature,
    plans, premiumFeatures, subscribe, isPremium, currentPlan,
  } = usePremium();
  const [subscribing, setSubscribing] = useState(null);

  if (!paywallOpen) return null;

  const activePlans = plans
    .filter(p => p.active && p.id !== 'free')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const lockedFeature = paywallFeature
    ? premiumFeatures.find(f => f.id === paywallFeature)
    : null;

  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    try {
      await subscribe(planId);
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
              ? `Unlock "${lockedFeature.label}" and all premium features`
              : 'Unlock all premium features and take your QR codes to the next level'}
          </p>
        </div>

        {/* Plan Cards */}
        <div className="premium-plans-grid">
          {activePlans.map(plan => (
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
                <span className="premium-plan-period">{PERIOD_LABELS[plan.period] || ''}</span>
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
                    {isPremium && currentPlan?.id === plan.id ? 'Current Plan' : 'Subscribe'}
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
            {premiumFeatures.filter(f => f.id !== 'ad_free').map(f => (
              <div key={f.id} className="premium-feature-item">
                <Check size={14} className="premium-feature-check" />
                <span>{f.label}</span>
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

// ─── Premium Gate wrapper ──────────────────────────────────────────────────
export function PremiumGate({ featureId, children, fallback }) {
  const { canAccess, showPaywall } = usePremium();
  
  if (canAccess(featureId)) return children;
  
  return fallback || (
    <div
      className="pro-lock-overlay"
      onClick={() => showPaywall(featureId)}
      title="PRO feature — tap to upgrade"
    >
      {children}
      <div className="pro-lock-badge">
        <Crown size={12} />
        <span>PRO</span>
      </div>
    </div>
  );
}
