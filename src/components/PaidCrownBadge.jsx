import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { FeatureAccessManager } from '../services/FeatureAccessManager';

/**
 * Renders a shimmering gold Crown badge on items that belong to a paid subscription plan.
 * Dynamically reacts to super admin feature flag and plan updates in real-time.
 */
export default function PaidCrownBadge({ 
  featureId, 
  fallbackFeatureId = null,
  size = 12, 
  style = {}, 
  showLabel = false,
  position = 'inline' // 'inline', 'corner', 'floating'
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = FeatureAccessManager.subscribe(() => {
      setTick(t => t + 1);
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // If a specific featureId is provided, its individual free/paid status is authoritative;
  // only fall back to fallbackFeatureId if featureId is not provided
  const isPaid = featureId 
    ? FeatureAccessManager.isPaidFeature(featureId)
    : (fallbackFeatureId ? FeatureAccessManager.isPaidFeature(fallbackFeatureId) : false);

  if (!isPaid) {
    return null;
  }

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#000',
    borderRadius: '8px',
    padding: showLabel ? '2px 6px' : '3px',
    boxShadow: '0 2px 8px rgba(255, 170, 0, 0.45)',
    fontWeight: 800,
    fontSize: '9px',
    letterSpacing: '0.3px',
    zIndex: 10,
    pointerEvents: 'none',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    ...(position === 'corner' ? {
      position: 'absolute',
      top: '8px',
      right: '8px',
      zIndex: 20,
    } : {}),
    ...(position === 'floating' ? {
      position: 'absolute',
      top: '8px',
      right: '8px',
      zIndex: 20,
    } : {}),
    ...style
  };

  return (
    <span className="paid-crown-badge" style={badgeStyle} title="Premium Paid Feature">
      <Crown size={size} fill="#000" color="#000" strokeWidth={2.5} />
      {showLabel && <span>PRO</span>}
    </span>
  );
}
