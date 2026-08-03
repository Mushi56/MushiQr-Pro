import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, LogOut, Settings, Key, AlertCircle, CheckCircle2, 
  ChevronRight, History, Bookmark, Loader2, Edit2, Check,
  Moon, Sun, Info, Shield, FileText, Folder
} from 'lucide-react';
import { 
  auth, googleProvider 
} from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  signOut, 
  sendPasswordResetEmail, 
  updateProfile 
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { getHistory, getSaved, getPreferences, savePreferences } from '../utils/storage';

export default function YouPage({ onNavigate, theme, setTheme, effectiveTheme, currentUser, showToast }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Profile editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  // Save location state
  const [saveLocation, setSaveLocation] = useState(() => getPreferences().saveLocation || 'Mushi QR Pro');

  // Statistics
  const [stats, setStats] = useState({ saved: 0, history: 0 });

  useEffect(() => {
    // Load local stats
    setStats({
      saved: getSaved().length,
      history: getHistory().length
    });
  }, [currentUser]);

  // Sync saveLocation if preferences change locally or from background sync
  useEffect(() => {
    const handlePrefSync = () => {
      setSaveLocation(getPreferences().saveLocation || 'Mushi QR Pro');
    };
    window.addEventListener('preferences-sync', handlePrefSync);
    return () => window.removeEventListener('preferences-sync', handlePrefSync);
  }, []);

  const handleAuthError = (err) => {
    console.error(err);
    switch (err.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup was closed before completion.';
      default:
        return err.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (isSignUp && !displayName) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName });
        setMessage('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Signed in successfully!');
      }
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signOut(auth);
      setMessage('Logged out successfully.');
      setIsEditingName(false);
    } catch (err) {
      setError('Failed to log out.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first to reset password.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: newName.trim() });
      setMessage('Profile name updated!');
      setIsEditingName(false);
    } catch (err) {
      setError('Failed to update display name.');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = () => {
    let next;
    if (theme === 'dark') next = 'light';
    else if (theme === 'light') next = 'auto';
    else next = 'dark';
    
    setTheme(next);
    savePreferences({ ...getPreferences(), theme: next });
  };

  const handleChooseFolder = async () => {
    try {
      if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        if (handle && handle.name) {
          const newLoc = handle.name;
          setSaveLocation(newLoc);
          savePreferences({ ...getPreferences(), saveLocation: newLoc });
          if (showToast) showToast(`Save location updated: ${newLoc}`);
          return;
        }
      }
    } catch (e) {
      console.log('Directory picker cancelled or unsupported', e);
    }
    const custom = window.prompt('Enter custom save folder / path:', saveLocation);
    if (custom !== null && custom.trim() !== '') {
      const clean = custom.trim();
      setSaveLocation(clean);
      savePreferences({ ...getPreferences(), saveLocation: clean });
      if (showToast) showToast(`Save location updated: ${clean}`);
    }
  };

  // Get initials for profile fallback
  const getInitials = () => {
    if (currentUser?.displayName) {
      const parts = currentUser.displayName.split(' ');
      return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }
    if (currentUser?.email) {
      return currentUser.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="you-page fade-in" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)', 
        paddingLeft: 'var(--main-padding-x)', 
        paddingRight: 'var(--main-padding-x)', 
        paddingBottom: '16px', 
        background: 'var(--bg-primary)', 
        zIndex: 10 
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative'
        }}>
          <div className="page-header-icon-box" style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(214, 0, 54, 0.2)',
            flexShrink: 0
          }}>
            <User size={20} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>You</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>
              {currentUser ? 'Manage your account and profile' : 'Sign in to sync your QR codes'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px var(--main-padding-x) 100px' }}>
        
        {/* Errors & Status Messages */}
        {error && (
          <div className="auth-alert error" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#EF4444',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="auth-alert success" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#10B981',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}

        {currentUser ? (
          /* LOGGED IN VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Profile Info Card */}
            <div className="glass-panel" style={{
              padding: '24px',
              borderRadius: '20px',
              background: 'var(--bg-hover)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid var(--border-color)'
            }}>
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '40px',
                    objectFit: 'cover',
                    border: '3px solid var(--accent-primary)',
                    boxShadow: '0 4px 14px rgba(214, 0, 54, 0.2)',
                    marginBottom: '16px'
                  }}
                />
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '40px',
                  background: 'var(--accent-gradient)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(214, 0, 54, 0.2)',
                  marginBottom: '16px'
                }}>
                  {getInitials()}
                </div>
              )}

              {/* Super Admin Badge (Pink) */}
              {currentUser.email === 'mabuneri143@gmail.com' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(255, 0, 127, 0.1)',
                  border: '1px solid rgba(255, 0, 127, 0.2)',
                  color: '#FF007F',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  <Shield size={12} color="#FF007F" />
                  <span>Super Admin</span>
                </div>
              )}

              {isEditingName ? (
                <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '240px', marginBottom: '8px' }}>
                  <input 
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Enter name"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button 
                    onClick={handleUpdateName}
                    disabled={loading}
                    style={{
                      background: 'var(--accent-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                    {currentUser.displayName || 'Mushi User'}
                  </h3>
                  <button 
                    onClick={() => {
                      setNewName(currentUser.displayName || '');
                      setIsEditingName(true);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                {currentUser.email}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: currentUser.emailVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: currentUser.emailVerified ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
                color: currentUser.emailVerified ? '#10B981' : '#F59E0B',
                fontSize: '11px',
                fontWeight: 700
              }}>
                {currentUser.emailVerified ? 'Verified Account' : 'Unverified Account'}
              </div>
            </div>

            {/* Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div 
                onClick={() => onNavigate('saved')}
                className="settings-group-container" 
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  borderRadius: '16px'
                }}
              >
                <Bookmark size={24} color="var(--accent-primary)" />
                <span style={{ fontSize: '20px', fontWeight: 800 }}>{stats.saved}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Saved QRs</span>
              </div>

              <div 
                onClick={() => onNavigate('history')}
                className="settings-group-container" 
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  borderRadius: '16px'
                }}
              >
                <History size={24} color="#00F0FF" />
                <span style={{ fontSize: '20px', fontWeight: 800 }}>{stats.history}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Scan History</span>
              </div>
            </div>

            {/* App Settings displayed openly inside You page */}
            <div className="settings-group-container" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              
              {/* Theme Settings */}
              <div 
                className="settings-row-item" 
                onClick={handleThemeChange}
                style={{ padding: '16px' }}
              >
                <div className="icon-container-gradient" style={{ 
                  background: theme === 'dark' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
                }}>
                  {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20" />
                      <path d="M12 2a10 10 0 0 0 0 20V2z" fill="currentColor" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Theme</div>
                <div style={{ marginRight: '12px', fontSize: '13px', textTransform: 'capitalize', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                  {theme}
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

              {/* Save Location Settings */}
              <div 
                className="settings-row-item" 
                onClick={handleChooseFolder}
                style={{ padding: '16px' }}
              >
                <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
                  <Folder size={18} />
                </div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Save Location</div>
                <div style={{ marginRight: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {saveLocation}
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

              {/* About */}
              <div 
                className="settings-row-item" 
                onClick={() => window.location.hash = '#/about'}
                style={{ padding: '16px' }}
              >
                <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' }}>
                  <Info size={18} />
                </div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>About Mushi QR Pro</div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

              {/* Privacy Policy */}
              <div 
                className="settings-row-item" 
                onClick={() => window.location.hash = '#/privacy-policy'}
                style={{ padding: '16px' }}
              >
                <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' }}>
                  <Shield size={18} />
                </div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Privacy Policy</div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

              {/* Terms of Service */}
              <div 
                className="settings-row-item" 
                onClick={() => window.location.hash = '#/terms'}
                style={{ padding: '16px' }}
              >
                <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)' }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Terms of Service</div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              {/* Super Admin Panel option */}
              {currentUser.email === 'mabuneri143@gmail.com' && (
                <>
                  <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />
                  <div 
                    className="settings-row-item" 
                    onClick={() => window.location.hash = '#/admin'}
                    style={{ padding: '16px', color: '#FF007F' }}
                  >
                    <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #db2777 0%, #c026d3 100%)' }}>
                      <Settings size={18} color="#FF007F" />
                    </div>
                    <div style={{ flex: 1, fontSize: '14px', fontWeight: 700 }}>Super Admin Panel</div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </>
              )}

              <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />
              
              {/* Log Out */}
              <div 
                className="settings-row-item" 
                onClick={handleLogout}
                style={{ padding: '16px', color: '#EF4444' }}
              >
                <div className="icon-container-gradient" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
                  <LogOut size={18} />
                </div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Log Out</div>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} color="var(--text-muted)" />}
              </div>

            </div>

          </div>
        ) : (
          /* LOGGED OUT VIEW / AUTH FORMS */
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-hover)'
          }}>
            
            {/* Title / Description */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0' }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {isSignUp ? 'Sign up to keep your QR codes synced' : 'Log in to access your saved codes'}
              </p>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {isSignUp && (
                <div className="input-group" style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text"
                    placeholder="Full Name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 42px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div className="input-group" style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div className="input-group" style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Reset Password Link (only when logging in) */}
              {!isSignUp && (
                <div style={{ textAlign: 'right' }}>
                  <button 
                    type="button"
                    onClick={handlePasswordReset}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="main-action-btn"
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(214, 0, 54, 0.25)',
                  marginTop: '8px'
                }}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isSignUp ? 'Sign Up' : 'Log In')}
              </button>

            </form>

            {/* Separator */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              margin: '24px 0',
              color: 'var(--text-muted)',
              fontSize: '12px'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span style={{ padding: '0 12px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            {/* Google Sign In Button */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              {/* Custom SVG Google Icon */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.26-2.09 3.59-5.17 3.59-8.46z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.31v3.1A12 12 0 0 0 12 24z"/>
                <path fill="#FBBC05" d="M5.24 14.24a7.19 7.19 0 0 1 0-4.48V6.66H1.31a12 12 0 0 0 0 10.68l3.93-3.1z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.31 6.66l3.93 3.1c.95-2.88 3.61-5.01 6.76-5.01z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch Mode Toggle */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setMessage('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
