import React, { useState } from 'react';
import {
  X, Mail, Lock, User, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { auth, googleProvider } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

function handleAuthError(err) {
  switch (err.code) {
    case 'auth/invalid-email':          return 'Invalid email address format.';
    case 'auth/user-disabled':          return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':     return 'Invalid email or password.';
    case 'auth/email-already-in-use':   return 'An account already exists with this email.';
    case 'auth/weak-password':          return 'Password must be at least 6 characters.';
    case 'auth/popup-closed-by-user':   return 'Google sign-in was cancelled.';
    default:                            return err.message || 'Something went wrong. Please try again.';
  }
}

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = () => { setError(''); setSuccess(''); };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    reset();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !displayName) { setError('Please enter your name.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });
        setSuccess('Account created! Welcome to Mushi QR Pro.');
        setTimeout(() => onClose(), 1200);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Signed in successfully!');
        setTimeout(() => onClose(), 900);
      }
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    reset();
    setLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      setSuccess('Signed in with Google!');
      setTimeout(() => onClose(), 900);
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    reset();
    if (!email) { setError('Enter your email address to reset your password.'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Reset email sent! Check your inbox.');
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'authOverlayFadeIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '400px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          animation: 'authModalSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Logo mark */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(214,0,54,0.3)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" fill="white" />
                <rect x="18" y="14" width="3" height="3" rx="0.5" fill="white" />
                <rect x="14" y="18" width="3" height="3" rx="0.5" fill="white" />
                <rect x="18" y="18" width="3" height="3" rx="0.5" fill="white" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {mode === 'login'  && 'Welcome back'}
              {mode === 'signup' && 'Create account'}
              {mode === 'forgot' && 'Reset password'}
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {mode === 'login'  && 'Sign in to sync your QR codes & more'}
              {mode === 'signup' && 'Join to keep your QR codes in the cloud'}
              {mode === 'forgot' && "We'll send a reset link to your email"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-hover)', border: '1px solid var(--border-color)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0,
              marginLeft: '12px'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px' }}>

          {/* Alerts */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px', padding: '12px 14px',
              color: '#EF4444', fontSize: '13px', marginBottom: '16px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '12px', padding: '12px 14px',
              color: '#10B981', fontSize: '13px', marginBottom: '16px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* Google Button (not for forgot) */}
          {mode !== 'forgot' && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                style={{
                  width: '100%', height: '48px', borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-primary)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.26-2.09 3.59-5.17 3.59-8.46z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.31v3.1A12 12 0 0 0 12 24z"/>
                  <path fill="#FBBC05" d="M5.24 14.24a7.19 7.19 0 0 1 0-4.48V6.66H1.31a12 12 0 0 0 0 10.68l3.93-3.1z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.31 6.66l3.93 3.1c.95-2.88 3.61-5.01 6.76-5.01z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={mode === 'forgot' ? handleForgot : handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {mode === 'signup' && (
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text" placeholder="Full Name" value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  style={{
                    width: '100%', padding: '13px 14px 13px 42px',
                    borderRadius: '12px', border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="email" placeholder="Email Address" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  borderRadius: '12px', border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)', color: 'var(--text-primary)',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {mode !== 'forgot' && (
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '13px 44px 13px 42px',
                    borderRadius: '12px', border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); reset(); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '48px', borderRadius: '14px',
                background: 'var(--accent-gradient)', border: 'none',
                color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 20px rgba(214,0,54,0.3)',
                opacity: loading ? 0.75 : 1, transition: 'opacity 0.2s',
                marginTop: '4px'
              }}
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : mode === 'login'  ? 'Sign In'
                : mode === 'signup' ? 'Create Account'
                : 'Send Reset Email'}
            </button>
          </form>

          {/* Mode Switch */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {mode === 'login' && (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); reset(); }} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Sign Up</button>
              </>
            )}
            {mode === 'signup' && (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); reset(); }} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Sign In</button>
              </>
            )}
            {mode === 'forgot' && (
              <button onClick={() => { setMode('login'); reset(); }} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>← Back to Sign In</button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes authOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes authModalSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
