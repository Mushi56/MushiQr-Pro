// admin/src/components/AdminLogin.jsx
// ─── Dedicated Super Admin Login Page ───────────────────────────────────────

import React, { useState } from 'react';
import { 
  Shield, Lock, Mail, ArrowRight, AlertCircle, 
  CheckCircle2, Sparkles, Key, Eye, EyeOff 
} from 'lucide-react';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  SUPER_ADMIN_EMAIL 
} from '../services/authService';
import GoldenAdminBadge from './GoldenAdminBadge';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user, isSuperAdmin } = await loginWithGoogle();
      if (!isSuperAdmin) {
        setError(`Access Denied: Account (${user.email}) is not authorized as Super Admin. Please sign in with ${SUPER_ADMIN_EMAIL}.`);
        setLoading(false);
        return;
      }
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      console.error('[AdminLogin] Google error:', err);
      setError(err?.message || 'Google authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { user, isSuperAdmin } = await loginWithEmail(email.trim(), password);
      if (!isSuperAdmin) {
        setError(`Access Denied: Account (${user.email}) is not authorized as Super Admin.`);
        setLoading(false);
        return;
      }
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      console.error('[AdminLogin] Email error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid admin credentials. Please check your email and password, or use Google Sign-In.');
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #151928 0%, #0F1221 60%, #080A12 100%)',
      padding: '24px 16px',
      color: '#FFFFFF',
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#151928',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: '36px 28px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
          <div style={{
            position: 'relative',
            width: 60,
            height: 60,
            borderRadius: 18,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1.5px solid rgba(245, 158, 11, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
            overflow: 'hidden',
            padding: 4
          }}>
            <img src="/logo.webp" alt="Mushi QR Pro" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <Shield size={28} color="#F59E0B" />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: '-0.4px', color: '#FFFFFF' }}>
              Mushi QR Pro
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              marginTop: 4, fontSize: 12, fontWeight: 800, color: '#F59E0B', letterSpacing: '0.6px'
            }}>
              <GoldenAdminBadge size={13} /> SUPER ADMIN PORTAL
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#FCA5A5',
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.4
          }}>
            <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>{error}</div>
          </div>
        )}

        {/* 1-Click Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px 18px',
            borderRadius: 12,
            background: '#FFFFFF',
            color: '#0F172A',
            border: 'none',
            fontSize: 14,
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 4px 16px rgba(255, 255, 255, 0.15)',
            transition: 'all 0.15s ease',
            opacity: loading ? 0.7 : 1
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Sign In with Super Admin Google</span>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#8E95A9', textTransform: 'uppercase' }}>or password</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8E95A9', display: 'block', marginBottom: 6 }}>
              Admin Email
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#0F1322', border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 12, padding: '11px 14px'
            }}>
              <Mail size={16} color="#8E95A9" />
              <input
                type="email"
                placeholder={SUPER_ADMIN_EMAIL}
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', background: 'none', border: 'none', outline: 'none',
                  color: '#FFFFFF', fontSize: 13, fontWeight: 600
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8E95A9', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#0F1322', border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 12, padding: '11px 14px'
            }}>
              <Lock size={16} color="#8E95A9" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', background: 'none', border: 'none', outline: 'none',
                  color: '#FFFFFF', fontSize: 13, fontWeight: 600
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{ background: 'none', border: 'none', color: '#8E95A9', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 18px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FF4D9D 0%, #7B61FF 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 18px rgba(255, 77, 157, 0.35)',
              marginTop: 4,
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Super Admin'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Security Notice */}
        <div style={{ textAlign: 'center', fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>
          🔒 Restricted portal. All logins, queries, and administrative actions are logged in authoritative server audit records.
        </div>
      </div>
    </div>
  );
}
