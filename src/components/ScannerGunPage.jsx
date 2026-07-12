import React from 'react';

export default function ScannerGunPage({ onNavigate }) {
  return (
    <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Scanner Gun</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '320px' }}>This section is currently under development.</p>
      <button 
        onClick={() => onNavigate('home')} 
        style={{ 
          padding: '12px 24px', 
          borderRadius: '12px', 
          background: 'var(--accent-gradient)', 
          color: '#ffffff', 
          border: 'none', 
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 12px var(--accent-glow)'
        }}
      >
        Go Back Home
      </button>
    </div>
  );
}
