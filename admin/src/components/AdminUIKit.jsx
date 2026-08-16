// src/components/admin/AdminUIKit.jsx
// â”€â”€â”€ Shared UI Kit & Theme System for QR Pro Super Admin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import React, { createContext, useContext } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  CheckCircle2, AlertCircle, XCircle, Clock
} from 'lucide-react';

// â”€â”€ Theme Context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const AdminThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  T: {},
});

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

// â”€â”€ Color Tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const getTokens = (isDark = false) => ({
  isDark,
  // Brand accents matching reference
  primaryPink:   '#FF4D9D',
  primaryPurple: '#7B61FF',
  successGreen:  '#22C55E',
  warningOrange: '#F59E0B',
  infoBlue:      '#3B82F6',
  dangerRed:     '#EF4444',
  accent:        '#FF4D9D',
  accentLow:     'rgba(255, 77, 157, 0.15)',
  purple:        '#7B61FF',
  green:         '#22C55E',
  orange:        '#F59E0B',
  blue:          '#3B82F6',
  red:           '#EF4444',

  // Gradient accents
  pinkPurpleGrad: 'linear-gradient(135deg, #FF4D9D 0%, #7B61FF 100%)',
  pinkSoftGrad:   'linear-gradient(135deg, rgba(255, 77, 157, 0.12) 0%, rgba(123, 97, 255, 0.12) 100%)',

  // Sidebar (Always deep dark navy)
  sidebarBg:      '#0F1221',
  sidebarBorder:  'rgba(255, 255, 255, 0.07)',
  sidebarText:    '#8E95A9',
  sidebarTextAct: '#FFFFFF',
  sidebarItemHov: 'rgba(255, 255, 255, 0.05)',
  sidebarActiveBg:'linear-gradient(135deg, rgba(255, 77, 157, 0.15) 0%, rgba(123, 97, 255, 0.15) 100%)',
  sidebarActiveBorder: '#FF4D9D',

  // Content Area (Light vs Dark)
  bg:             isDark ? '#0B0E17' : '#F7F8FC',
  bgCard:         isDark ? '#151928' : '#FFFFFF',
  bgCardHover:    isDark ? '#1C2136' : '#FAFAFD',
  bgInput:        isDark ? '#0F1322' : '#F1F3F9',
  bgEl:           isDark ? '#0F1322' : '#F1F3F9',
  border:         isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
  borderHov:      isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.16)',
  
  // Shadows
  cardShadow:     isDark ? '0 4px 24px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(15, 23, 42, 0.04)',
  elevatedShadow: isDark ? '0 12px 36px rgba(0, 0, 0, 0.6)' : '0 12px 32px rgba(15, 23, 42, 0.08)',

  // Text
  text:           isDark ? '#F8FAFC' : '#0F172A',
  textSec:        isDark ? '#94A3B8' : '#64748B',
  textMut:        isDark ? '#64748B' : '#94A3B8',

  // Border radius
  r: { xs: 6, sm: 8, md: 12, lg: 16, xl: 20, pill: 9999 }
});

// Default static tokens
export const T = getTokens(false);

// â”€â”€ Badge Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function Badge({ children, variant = 'neutral', color, bg, style }) {
  let finalColor = color;
  let finalBg = bg;

  if (!finalColor) {
    switch (variant) {
      case 'success':
      case 'active':
      case 'completed':
        finalColor = '#22C55E';
        finalBg = 'rgba(34, 197, 94, 0.12)';
        break;
      case 'warning':
      case 'pending':
      case 'trial':
        finalColor = '#F59E0B';
        finalBg = 'rgba(245, 158, 11, 0.12)';
        break;
      case 'danger':
      case 'failed':
      case 'expired':
      case 'blocked':
        finalColor = '#EF4444';
        finalBg = 'rgba(239, 68, 68, 0.12)';
        break;
      case 'info':
        finalColor = '#3B82F6';
        finalBg = 'rgba(59, 130, 246, 0.12)';
        break;
      case 'pink':
        finalColor = '#FF4D9D';
        finalBg = 'rgba(255, 77, 157, 0.12)';
        break;
      case 'purple':
        finalColor = '#7B61FF';
        finalBg = 'rgba(123, 97, 255, 0.12)';
        break;
      default:
        finalColor = '#64748B';
        finalBg = 'rgba(100, 116, 139, 0.12)';
    }
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 9px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 700,
      background: finalBg || `${finalColor}18`,
      color: finalColor,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...style
    }}>
      {children}
    </span>
  );
}

// â”€â”€ Trend Pill â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function TrendPill({ value = '+12.5%', isUp = true, period = 'from last month', isDark = false }) {
  const color = isUp ? '#22C55E' : '#EF4444';
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 7px',
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 800,
        background: isUp ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
        color
      }}>
        <Icon size={12} />
        {value}
      </span>
      {period && (
        <span style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>
          {period}
        </span>
      )}
    </div>
  );
}

// â”€â”€ Top Stat Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function StatCard({
  title,
  value,
  trend = '+12.5%',
  isUp = true,
  period = 'from last month',
  icon: Icon,
  iconBg = 'rgba(59, 130, 246, 0.12)',
  iconColor = '#3B82F6',
  isDark = false
}) {
  const tokens = getTokens(isDark);
  return (
    <div style={{
      background: tokens.bgCard,
      border: `1px solid ${tokens.border}`,
      borderRadius: 16,
      padding: '20px 22px',
      boxShadow: tokens.cardShadow,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 14,
      transition: 'transform 0.15s, box-shadow 0.15s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: tokens.textSec }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            flexShrink: 0
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color: tokens.text, letterSpacing: '-0.5px' }}>
          {value}
        </div>
        <div style={{ marginTop: 8 }}>
          <TrendPill value={trend} isUp={isUp} period={period} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Progress Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function ProgressBar({ val, max, color = '#FF4D9D', isDark = false }) {
  const pct = Math.min(Math.max((val / (max || 1)) * 100, 0), 100);
  return (
    <div style={{
      width: '100%',
      height: 6,
      background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.06)',
      borderRadius: 3,
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: color,
        borderRadius: 3,
        transition: 'width 0.4s ease'
      }} />
    </div>
  );
}
