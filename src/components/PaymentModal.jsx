// src/components/PaymentModal.jsx
// ─── Direct Checkout & Payment Method Selection Modal ─────────────────────
// Allows users to select their payment method (Google Play, Credit/Debit Card, Stripe/Web, PayPal)
// and complete secure transactions.

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Shield, Lock, CheckCircle2, ArrowRight, 
  X, AlertCircle, Sparkles, Smartphone, Globe, User, Zap, RefreshCw
} from 'lucide-react';
import { formatCurrencyPrice } from '../utils/currency';
import { PaymentProvider } from '../services/payment/PaymentProvider';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';

export default function PaymentModal({ plan, currency, onClose, onSuccess }) {
  const [user, setUser] = useState(auth.currentUser);
  const [method, setMethod] = useState(PaymentProvider.isNativeAndroid() ? 'gplay' : 'card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  if (!plan) return null;

  const formattedPrice = formatCurrencyPrice(plan.price, currency);

  const handleSignInGoogle = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('[PaymentModal] Sign in error:', err);
      setError('Google Sign-In was cancelled or failed. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Please sign in with Google or Email above to link your subscription.');
      return;
    }

    setProcessing(true);

    try {
      if (method === 'card') {
        if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 15) {
          throw new Error('Please enter a valid 16-digit Card Number.');
        }
        if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
          throw new Error('Please enter a valid Card Expiry (MM/YY).');
        }
        if (!cardCvc.trim() || cardCvc.length < 3) {
          throw new Error('Please enter a valid 3-digit CVC/CVV security code.');
        }
      }

      // Execute purchase flow via PaymentProvider
      const res = await PaymentProvider.purchase(plan, {
        currency,
        paymentMethod: method,
        cardLast4: cardNumber ? cardNumber.slice(-4) : '4242'
      });

      onSuccess(res);
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please check your details.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div style={{
        background: '#13131d',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        width: '100%',
        maxWidth: 460,
        overflow: 'hidden',
        boxShadow: '0 24px 48px rgba(0,0,0,0.8)',
        color: '#fff'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={16} color="#10b981" /> Secure Checkout
            </h3>
            <span style={{ fontSize: 12, color: '#8b8fa8' }}>
              {plan.name} &middot; {formattedPrice}{plan.period}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b8fa8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePay} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* User Account Linking Banner */}
          {!user ? (
            <div style={{
              background: 'rgba(214,0,54,0.08)',
              border: '1px solid rgba(214,0,54,0.25)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} color="#D60036" /> Sign in to Link Your Subscription
              </div>
              <div style={{ fontSize: 11, color: '#8b8fa8', lineHeight: 1.4 }}>
                Link your purchase to your account so you can restore Pro features across any browser or device.
              </div>
              <button
                type="button"
                onClick={handleSignInGoogle}
                disabled={signingIn}
                style={{
                  background: 'linear-gradient(135deg, #D60036, #990024)',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: signingIn ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {signingIn ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
                {signingIn ? 'Signing in with Google...' : 'Sign in with Google'}
              </button>
            </div>
          ) : (
            <div style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 10,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <CheckCircle2 size={15} color="#10b981" />
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>
                Subscription will be linked to: <span style={{ color: '#fff' }}>{user.email}</span>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8fa8', display: 'block', marginBottom: 8 }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => setMethod('card')}
                style={{
                  background: method === 'card' ? 'rgba(214,0,54,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${method === 'card' ? '#D60036' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12,
                  padding: '12px',
                  color: method === 'card' ? '#fff' : '#8b8fa8',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center'
                }}
              >
                <CreditCard size={16} color={method === 'card' ? '#D60036' : '#8b8fa8'} />
                Credit / Debit Card
              </button>

              <button
                type="button"
                onClick={() => setMethod('gplay')}
                style={{
                  background: method === 'gplay' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${method === 'gplay' ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12,
                  padding: '12px',
                  color: method === 'gplay' ? '#fff' : '#8b8fa8',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center'
                }}
              >
                <Smartphone size={16} color={method === 'gplay' ? '#3b82f6' : '#8b8fa8'} />
                Google Play / One-Click
              </button>
            </div>
          </div>

          {/* Card Details Inputs (If Card Selected) */}
          {method === 'card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#8b8fa8', display: 'block', marginBottom: 4 }}>Name on Card</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#09090f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#8b8fa8', display: 'block', marginBottom: 4 }}>Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setCardNumber(v);
                  }}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#09090f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#8b8fa8', display: 'block', marginBottom: 4 }}>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '');
                      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                      setCardExpiry(v);
                    }}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#09090f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#8b8fa8', display: 'block', marginBottom: 4 }}>CVC / CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="123"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#09090f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'gplay' && (
            <div style={{ background: 'rgba(59,130,246,0.06)', padding: '14px', borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <Smartphone size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: '#8b8fa8', lineHeight: 1.4 }}>
                Instant one-touch checkout with Google Play Billing or secure verified payment gateway.
              </div>
            </div>
          )}

          {/* Total & Submit Button */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, color: '#8b8fa8', fontWeight: 600 }}>Total Due Today:</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#D60036' }}>{formattedPrice}</span>
            </div>

            <button
              type="submit"
              disabled={processing}
              style={{
                background: 'linear-gradient(135deg, #D60036, #990024)',
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 900,
                cursor: processing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(214,0,54,0.4)',
                transition: 'all 0.2s'
              }}
            >
              {processing ? 'Processing Secure Payment...' : `Pay ${formattedPrice} & Activate`}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
