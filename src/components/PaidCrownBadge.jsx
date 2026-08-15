import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { FeatureAccessManager } from '../services/FeatureAccessManager';

/**
 * Renders a shimmering gold Crown badge on items that belong to a paid subscription plan.
 * Dynamically reacts to super admin feature flag and plan updates in real-time.
 */
export default function PaidCrownBadge({ 
  featureId, 
  size = 11, 
  style = {}, 
  showLabel = false,
  position = 'corner' // 'inline', 'corner', 'floating'
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

  if (!featureId || !FeatureAccessManager.isPaidFeature(featureId)) {
    return null;
  }

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    background: 'linear-gradient(135deg, #FFE033 0%, #FF9500 100%)',
    color: '#000',
    borderRadius: '7px',
    padding: showLabel ? '2px 6px' : '4px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.7), 0 0 12px rgba(255, 180, 0, 0.65)',
    fontWeight: 900,
    fontSize: '9px',
    letterSpacing: '0.4px',
    zIndex: 999,
    pointerEvents: 'none',
    border: '1.5px solid #FFFFFF',
    flexShrink: 0,
    ...(position === 'corner' ? {
      position: 'absolute',
      top: '8px',
      right: '8px',
    } : {}),
    ...(position === 'floating' ? {
      position: 'absolute',
      top: '6px',
      right: '6px',
    } : {}),
    ...style
  };

  return (
    <span className="paid-crown-badge" style={badgeStyle} title="PRO Paid Feature">
      <Crown size={size} fill="#000" color="#000" strokeWidth={2.8} />
      {showLabel && <span style={{ color: '#000', lineHeight: 1 }}>PRO</span>}
    </span>
  );
}

