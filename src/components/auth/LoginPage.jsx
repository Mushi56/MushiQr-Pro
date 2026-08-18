import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { auth, googleProvider } from '../../services/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import AppIcon from '../AppIcon';

function handleAuthError(err) {
  switch (err.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return err.message || 'Unable to sign in. Please try again.';
  }
}

export default function LoginPage({ onNavigate, onSuccess, isFirstLaunch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address format.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      try {
        localStorage.setItem('mushi_onboarding_completed', 'true');
      } catch {}
      if (onSuccess) {
        onSuccess();
      } else {
        onNavigate('home');
      }
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle({
          useCredentialManager: false,
        });
        if (result.credential?.idToken) {
          const credential = GoogleAuthProvider.credential(result.credential.idToken);
          await signInWithCredential(auth, credential);
          try {
            localStorage.setItem('mushi_onboarding_completed', 'true');
          } catch {}
          if (onSuccess) {
            onSuccess();
          } else {
            onNavigate('home');
          }
        } else {
          throw new Error('No ID token received from Google sign in');
        }
      } else {
        try {
          await signInWithPopup(auth, googleProvider);
          try {
            localStorage.setItem('mushi_onboarding_completed', 'true');
          } catch {}
          if (onSuccess) {
            onSuccess();
          } else {
            onNavigate('home');
          }
        } catch (popupErr) {
          if (
            popupErr.code === 'auth/popup-closed-by-user' ||
            popupErr.code === 'auth/cancelled-popup-request'
          ) {
            throw popupErr;
          }
          await signInWithRedirect(auth, googleProvider);
        }
      }
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSkip = () => {
    try {
      localStorage.setItem('mushi_onboarding_completed', 'true');
    } catch {}
    if (onSuccess) {
      onSuccess();
    } else {
      onNavigate('home');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        minHeight: '100dvh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'var(--bg-primary, #0B0F19)',
        color: 'var(--text-primary, #FFFFFF)',
        padding: 'calc(16px + env(safe-area-inset-top, 0px)) 24px calc(24px + env(safe-area-inset-bottom, 0px))',
        boxSizing: 'border-box',
        position: 'relative',
        overflowY: 'auto'
      }}
    >
      {/* Dynamic Ambient Background Radiant Mesh */}
      <div
        style={{
          position: 'fixed',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(214, 0, 54, 0.16) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Header Row with Skip Button (Only visible during first launch with onboarding) */}
      {isFirstLaunch && (
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '12px',
            zIndex: 10
          }}
        >
          <button
            type="button"
            onClick={handleSkip}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-color, rgba(255,255,255,0.12))',
              color: 'var(--text-secondary, #CBD5E1)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
          >
            <span>Skip</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Main Form Content - Fully Out-of-the-box (Frameless & Clean) */}
      <div
        className="login-content-anim"
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {/* App Icon & Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '14px' }}>
            <AppIcon size={64} shadow />
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: 'var(--text-primary, #FFFFFF)',
              margin: '0 0 6px',
              letterSpacing: '-0.5px',
              fontFamily: 'Outfit, var(--font-display, sans-serif)'
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary, #CBD5E1)',
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            Sign in to continue using Mushi QR Pro.
          </p>
        </div>

        {/* 1. Continue with Google on Top */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '16px',
            background: 'var(--bg-input, #0E0E16)',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.14))',
            color: 'var(--text-primary, #FFFFFF)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.1s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-input, #0E0E16)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.99)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {googleLoading ? (
            <Loader2 size={19} style={{ animation: 'spin 0.8s linear infinite' }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* OR Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '22px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.12))' }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--text-muted, #64748B)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}
          >
            OR WITH EMAIL
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.12))' }} />
        </div>

        {/* Error Alert Message */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '14px',
              padding: '12px 16px',
              color: '#EF4444',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--text-secondary, #CBD5E1)',
                marginBottom: '6px',
                letterSpacing: '0.2px'
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '15px',
                  color: 'var(--text-muted, #64748B)'
                }}
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading || googleLoading}
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '0 14px 0 44px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                  background: 'var(--bg-input, #0E0E16)',
                  color: 'var(--text-primary, #FFFFFF)',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#D60036';
                  e.target.style.boxShadow = '0 0 0 3px rgba(214, 0, 54, 0.2)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border-color, rgba(255, 255, 255, 0.12))';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Input with "Forgot Password?" directly underneath */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--text-secondary, #CBD5E1)',
                marginBottom: '6px',
                letterSpacing: '0.2px'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '15px',
                  color: 'var(--text-muted, #64748B)'
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '0 44px 0 44px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
                  background: 'var(--bg-input, #0E0E16)',
                  color: 'var(--text-primary, #FFFFFF)',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#D60036';
                  e.target.style.boxShadow = '0 0 0 3px rgba(214, 0, 54, 0.2)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border-color, rgba(255, 255, 255, 0.12))';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #64748B)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password Link Directly Under Password Input */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => onNavigate?.('forgot-password')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D60036',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Primary Sign In Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #D60036 0%, #B5002D 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(214, 0, 54, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: '4px',
              transition: 'transform 0.15s ease, opacity 0.2s ease'
            }}
            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={e => { if (!loading) e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} strokeWidth={2.4} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Switcher */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '28px',
            fontSize: '13.5px',
            color: 'var(--text-secondary, #CBD5E1)'
          }}
        >
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate?.('signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#D60036',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      <style>{`
        .login-content-anim {
          animation: contentSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes contentSlideUp {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
