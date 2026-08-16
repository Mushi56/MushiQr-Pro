// admin/src/App.jsx
// â”€â”€â”€ Super Admin Standalone Application Root â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import React, { useState } from 'react';
import { useSuperAuthState, logoutAdmin, SUPER_ADMIN_EMAIL } from './services/authService';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { Shield, Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const { currentUser, isSuperAdmin, role, loading, authError, refreshClaims } = useSuperAuthState();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F1221',
        color: '#FFFFFF',
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
        gap: 16
      }}>
        <div style={{
          position: 'relative',
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'rgba(255, 77, 157, 0.1)',
          border: '1.5px solid rgba(255, 77, 157, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(255, 77, 157, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            inset: -4,
            border: '2px solid transparent',
            borderTopColor: '#FF4D9D',
            borderRadius: 20,
            animation: 'spin 0.8s linear infinite'
          }} />
          <Shield size={26} color="#FF4D9D" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.2px' }}>
            Verifying Super Admin Session
          </div>
          <div style={{ fontSize: 12, color: '#8E95A9', marginTop: 4 }}>
            Connecting to secure Firebase auth...
          </div>
        </div>
      </div>
    );
  }

  // Not logged in -> Show dedicated Super Admin login screen
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={() => refreshClaims()} />;
  }

  // Logged in with unauthorized account -> Show Access Denied with Logout
  if (!isSuperAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F1221',
        color: '#FFFFFF',
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
        padding: 24,
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: 440,
          background: '#151928',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 20,
          padding: '32px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={28} color="#EF4444" />
          </div>

          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 800 }}>Access Denied</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#8E95A9', lineHeight: 1.5 }}>
              Account <strong style={{ color: '#F8FAFC' }}>{currentUser.email}</strong> is authenticated but does not possess Super Admin permissions.
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#64748B' }}>
              Authorized Owner: <span style={{ color: '#F59E0B' }}>{SUPER_ADMIN_EMAIL}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
            <button
              onClick={() => refreshClaims()}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Re-check Claim
            </button>
            <button
              onClick={() => logoutAdmin()}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: 10,
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Super Admin -> Render Full Admin Panel
  return <AdminPanel />;
}
