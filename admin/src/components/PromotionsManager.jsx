// src/components/admin/PromotionsManager.jsx
// ─── Promotions & Discount Campaigns Architecture ─────────────────────────
// Dedicated management workspace for promotional discounts, trial codes, and temporary perks.

import React from 'react';
import { Tag, Sparkles, Plus, Clock, Gift, Percent } from 'lucide-react';
import { T } from './AdminUIKit';

export default function PromotionsManager() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.bgCard, padding: '18px 22px', borderRadius: T.r.lg, border: `1px solid ${T.border}`, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={20} color={T.accent} /> Promotions &amp; Discount Campaigns
          </h2>
          <p style={{ fontSize: 12, color: T.textSec, margin: '4px 0 0' }}>
            Configure promotional pricing codes, trial duration extensions, and seasonal marketing campaigns.
          </p>
        </div>

        <button
          onClick={() => alert('Promotional campaign engine is currently in ready-state for Google Play offer codes.')}
          style={{
            background: T.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Plus size={14} /> Create Campaign
        </button>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <div style={{ background: T.bgCard, padding: '20px', borderRadius: T.r.lg, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: 14, fontWeight: 800 }}>Google Play Promo Codes</span>
          </div>
          <p style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5, margin: 0 }}>
            Redeemable promo codes created directly in Google Play Console are automatically verified via <code>verifyGooglePlayPurchase</code>.
          </p>
        </div>

        <div style={{ background: T.bgCard, padding: '20px', borderRadius: T.r.lg, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6' }}>
            <Clock size={18} />
            <span style={{ fontSize: 14, fontWeight: 800 }}>Extended Free Trials</span>
          </div>
          <p style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5, margin: 0 }}>
            Configure default trial days per plan in the <strong>Plans</strong> sub-tab to grant immediate access on sign-up.
          </p>
        </div>

        <div style={{ background: T.bgCard, padding: '20px', borderRadius: T.r.lg, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981' }}>
            <Gift size={18} />
            <span style={{ fontSize: 14, fontWeight: 800 }}>Manual VIP Grants</span>
          </div>
          <p style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5, margin: 0 }}>
            Super Admins can grant custom-duration complimentary passes directly from the <strong>Subscribers</strong> sub-tab.
          </p>
        </div>
      </div>

      {/* Status Placeholder Box */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px dashed ${T.border}`, borderRadius: 16, padding: '36px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <Tag size={32} color={T.textSec} />
        <div style={{ fontSize: 15, fontWeight: 800 }}>No Active Custom Coupon Campaigns</div>
        <p style={{ fontSize: 12, color: T.textSec, maxWidth: 460, margin: 0 }}>
          Promotion management architecture is active. Custom in-app coupon code validation hooks into the cloud entitlement state.
        </p>
      </div>
    </div>
  );
}
