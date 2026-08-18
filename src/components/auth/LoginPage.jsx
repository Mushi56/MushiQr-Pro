import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Cloud
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
        backgroundColor: '#0B0F19',
        color: '#FFFFFF',
        padding: 'calc(14px + env(safe-area-inset-top, 0px)) 20px calc(24px + env(safe-area-inset-bottom, 0px))',
        boxSizing: 'border-box',
        position: 'relative',
        overflowY: 'auto'
      }}
    >
      {/* Dynamic Ambient Background Radiant Mesh (Ruby-Crimson Nebula) */}
      <div
        style={{
          position: 'fixed',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 30, 86, 0.22) 0%, rgba(139, 92, 246, 0.1) 45%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Cosmic Sparkle Stars */}
      <span className="sparkle-star" style={{ top: '8%', left: '10%', color: '#FF2A6D', fontSize: '13px', zIndex: 1 }}>✦</span>
      <span className="sparkle-star" style={{ top: '14%', right: '12%', color: '#FFB74D', fontSize: '10px', animationDelay: '1s', zIndex: 1 }}>✦</span>
      <span className="sparkle-star" style={{ top: '24%', left: '8%', color: '#38BDF8', fontSize: '9px', animationDelay: '1.8s', zIndex: 1 }}>✦</span>

      {/* Top Header Row with Skip Button (Only visible during first launch with onboarding) */}
      {isFirstLaunch && (
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '10px',
            zIndex: 10
          }}
        >
          <button
            type="button"
            onClick={handleSkip}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#CBD5E1',
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
          >
            <span>Skip</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Main Content Container */}
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
        {/* ═══════════════ 3D INTERACTIVE HERO STAGE ═══════════════ */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}
        >
          {/* Glowing Ruby Light Ring Arc */}
          <div
            style={{
              position: 'absolute',
              width: '190px',
              height: '130px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 30, 86, 0.35)',
              boxShadow: '0 0 16px rgba(255, 30, 86, 0.25)',
              transform: 'rotate(-20deg)',
              pointerEvents: 'none'
            }}
          />

          {/* Central 3D Tilted Glowing App Card */}
          <div
            className="floating-login-card"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              background: '#0E1422',
              border: '2.5px solid #FF1E56',
              boxShadow: `
                0 0 35px rgba(255, 30, 86, 0.7),
                0 0 14px #FF2A6D,
                inset 0 0 16px rgba(255, 30, 86, 0.35),
                0 18px 40px rgba(0, 0, 0, 0.9)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 0,
              boxSizing: 'border-box',
              transform: 'perspective(600px) rotateX(14deg) rotateY(-16deg) rotateZ(4deg)',
              zIndex: 5
            }}
          >
            <img
              src="/logo.webp"
              alt="Mushi QR Pro Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          {/* 3D Extruded Tile 1: Cloud Sync (Top Left) */}
          <div
            className="anim-tile-blue"
            style={{
              position: 'absolute',
              top: '12px',
              left: '24px',
              width: '38px',
              height: '38px',
              borderRadius: '13px',
              background: 'linear-gradient(145deg, #3B82F6 0%, #1D4ED8 55%, #172554 100%)',
              border: 'none',
              boxShadow: `
                0 8px 18px rgba(29, 78, 216, 0.6),
                inset 0 2px 2px rgba(255, 255, 255, 0.7),
                inset 0 -2px 3px rgba(0, 0, 0, 0.5)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              zIndex: 6
            }}
          >
            <Cloud size={18} strokeWidth={2.4} />
          </div>

          {/* 3D Extruded Tile 2: 100% Secure (Top Right) */}
          <div
            className="anim-tile-purple"
            style={{
              position: 'absolute',
              top: '14px',
              right: '26px',
              width: '38px',
              height: '38px',
              borderRadius: '13px',
              background: 'linear-gradient(145deg, #8B5CF6 0%, #6D28D9 55%, #4C1D95 100%)',
              border: 'none',
              boxShadow: `
                0 8px 18px rgba(109, 40, 217, 0.6),
                inset 0 2px 2px rgba(255, 255, 255, 0.7),
                inset 0 -2px 3px rgba(0, 0, 0, 0.5)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              zIndex: 6
            }}
          >
            <ShieldCheck size={18} strokeWidth={2.4} />
          </div>

          {/* 3D Extruded Tile 3: Pro Speed (Bottom Right) */}
          <div
            className="anim-tile-amber"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '38px',
              width: '34px',
              height: '34px',
              borderRadius: '12px',
              background: 'linear-gradient(145deg, #F59E0B 0%, #D97706 55%, #78350F 100%)',
              border: 'none',
              boxShadow: `
                0 8px 16px rgba(217, 119, 6, 0.6),
                inset 0 2px 2px rgba(255, 255, 255, 0.7),
                inset 0 -2px 3px rgba(0, 0, 0, 0.5)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              zIndex: 6
            }}
          >
            <Zap size={16} strokeWidth={2.4} />
          </div>
        </div>

        {/* Typography Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 6px',
              letterSpacing: '-0.5px',
              fontFamily: 'Outfit, var(--font-display, sans-serif)'
            }}
          >
            Welcome Back to{' '}
            <span style={{ color: '#FF1E56' }}>Mushi QR</span>
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: '#94A3B8',
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.4
            }}
          >
            Sign in to access your saved codes, styles and batch sync.
          </p>
        </div>

        {/* 1. Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.1s ease',
            backdropFilter: 'blur(8px)'
          }}
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
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}
          >
            OR WITH EMAIL
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Error Alert Message */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '14px',
              padding: '10px 14px',
              color: '#EF4444',
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>⚠️</span>
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Email Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
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
                  color: '#64748B'
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
                  height: '48px',
                  padding: '0 14px 0 44px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#FF1E56';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 30, 86, 0.25)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
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
                  color: '#64748B'
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
                  height: '48px',
                  padding: '0 44px 0 44px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#FF1E56';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 30, 86, 0.25)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
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
                  color: '#64748B',
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

            {/* Forgot Password Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => onNavigate?.('forgot-password')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF1E56',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Primary Sign In Button (Vibrant Ruby Red Gradient) */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              height: '50px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FF1E56 0%, #D8042B 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 25px rgba(255, 30, 86, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: '4px',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
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
            marginTop: '22px',
            fontSize: '13px',
            color: '#94A3B8'
          }}
        >
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate?.('signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF1E56',
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
          animation: contentSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes contentSlideUp {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .floating-login-card {
          animation: floatLoginCard 4.8s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        @keyframes floatLoginCard {
          0%, 100% {
            transform: perspective(600px) rotateX(14deg) rotateY(-16deg) rotateZ(4deg) translateY(0px);
          }
          50% {
            transform: perspective(600px) rotateX(16deg) rotateY(-14deg) rotateZ(5deg) translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
