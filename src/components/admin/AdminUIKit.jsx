// src/components/admin/AdminUIKit.jsx
import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const T = {
  bg: '#09090f',
  bgEl: '#10101a',
  bgCard: '#14141e',
  bgHov: '#1c1c2a',
  sidebar: '#0c0c15',
  border: 'rgba(255,255,255,0.06)',
  borderHov: 'rgba(255,255,255,0.12)',
  accent: '#D60036',
  accentLow: 'rgba(214,0,54,0.15)',
  purple: '#8b5cf6',
  green: '#10b981',
  orange: '#f59e0b',
  blue: '#3b82f6',
  red: '#ef4444',
  text: '#f0f0f8',
  textSec: '#8b8fa8',
  textMut: '#44465a',
  r: { xs: 6, sm: 8, md: 12, lg: 16, xl: 20 }
};

export function Badge({ children, color = T.purple }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 100,
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: '0.4px',
      textTransform: 'uppercase',
      background: `${color}20`,
      color,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

export function ProgressBar({ val, max, color = T.accent }) {
  const pct = Math.min(Math.max((val / (max || 1)) * 100, 0), 100);
  return (
    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
    </div>
  );
}
