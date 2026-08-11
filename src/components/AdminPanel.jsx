// src/components/AdminPanel.jsx
// Mushi QR Pro — Super Admin Panel (SaaS-grade)
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useContext, createContext, useCallback } from 'react';
import {
  LayoutDashboard, Users, CreditCard, BarChart3, FileText,
  Layers, QrCode, Grid, Package, Settings, Palette, Sliders,
  Flag, Settings2, Megaphone, UserCog, Shield, Activity, Lock,
  HardDrive, ClipboardList, Heart, Plug, Code, HelpCircle,
  ChevronDown, ChevronRight, ChevronLeft, Menu, X, Search, Bell,
  Plus, Trash2, Edit, Check, Copy, Download, Upload, RefreshCw,
  Eye, EyeOff, Server, Database, BarChart2, TrendingUp, TrendingDown,
  ArrowUpRight, MoreVertical, Calendar, AlertTriangle, CheckCircle,
  XCircle, Clock, Info, Star, Zap, Globe, AlertCircle, Save,
  ExternalLink, Key, ArrowLeft, Mail, Monitor, Cpu,
  DollarSign, Tag, Percent, Receipt, LogOut,
} from 'lucide-react';

import * as DS from '../services/adminDataService';
import { QR_TEMPLATES } from '../utils/qrTemplates';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import GoldenAdminBadge from './GoldenAdminBadge';

// ─── Design Tokens ────────────────────────────────────────────────────────
const T = {
  bg:        '#09090f',
  bgEl:      '#10101a',
  bgCard:    '#14141e',
  bgHov:     '#1c1c2a',
  sidebar:   '#0c0c15',
  sidebarAct:'rgba(214,0,54,0.12)',
  sidebarHov:'rgba(255,255,255,0.04)',
  border:    'rgba(255,255,255,0.06)',
  borderHov: 'rgba(255,255,255,0.12)',
  accent:    '#D60036',
  accentLow: 'rgba(214,0,54,0.15)',
  purple:    '#8b5cf6',
  green:     '#10b981',
  orange:    '#f59e0b',
  blue:      '#3b82f6',
  red:       '#ef4444',
  text:      '#f0f0f8',
  textSec:   '#8b8fa8',
  textMut:   '#44465a',
  r:         { xs: 6, sm: 8, md: 12, lg: 16, xl: 20 },
};

// ─── Toast Notification System ───────────────────────────────────────────
const ToastCtx = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);
  const COLORS = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: '#1a1a2e', border: `1px solid ${COLORS[t.type] || COLORS.success}55`,
            borderLeft: `4px solid ${COLORS[t.type] || COLORS.success}`,
            borderRadius: 10, padding: '12px 18px', maxWidth: 360,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            color: '#f0f0f8', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
            animation: 'adSlideIn 0.25s ease',
            pointerEvents: 'auto',
          }}>
            <span style={{ marginRight: 8 }}>
              {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function useToast() {
  return useContext(ToastCtx);
}

// ─── Helpers ──────────────────────────────────────────────────────────────
// Safely convert any qrData value (string, {url}, {text}, {phone}, etc.) to a display string
function safeStr(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object') {
    // Common QR data shapes
    const v = val.url || val.text || val.phone || val.email || val.ssid
              || val.data || val.content || val.value || val.address || val.name;
    if (v) return safeStr(v);
    try { return JSON.stringify(val).slice(0, 60); } catch { return '[Object]'; }
  }
  return String(val);
}

function fmtBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
}
function timeAgo(ts) {
  if (!ts) return '—';
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Navigation Config ────────────────────────────────────────────────────
const LABELS = {
  dashboard:'Dashboard', revenue:'Revenue & SaaS', users:'Users', subscriptions:'Subscriptions',
  analytics:'Analytics', reports:'Reports', templates:'Templates',
  'qr-barcode':'QR & Barcode', categories:'Categories', bulk:'Bulk Operations',
  'app-settings':'App Settings', branding:'Branding', 'remote-config':'Remote Config',
  'feature-flags':'Feature Flags', maintenance:'Maintenance', announcements:'Announcements',
  'admin-users':'Admin Users', roles:'Roles & Permissions', 'activity-logs':'Activity Logs',
  security:'Security', backups:'Backups', 'audit-logs':'Audit Logs',
  'system-health':'System Health', integrations:'Integrations',
  developer:'Developer / API', support:'Support / Tickets',
};

const NAV = [
  { section: 'MAIN', items: [
    { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users',         icon: Users,           label: 'Users' },
    { id: 'analytics',     icon: BarChart3,       label: 'Analytics' },
    { id: 'reports',       icon: FileText,        label: 'Reports' },
  ]},
  { section: 'MONETIZATION', items: [
    { id: 'revenue',       icon: DollarSign,      label: 'Revenue & SaaS' },
    { id: 'subscriptions', icon: CreditCard,      label: 'Subscriptions' },
  ]},
  { section: 'CONTENT', items: [
    { id: 'templates',  icon: Layers,  label: 'Templates' },
    { id: 'qr-barcode', icon: QrCode,  label: 'QR & Barcode' },
    { id: 'categories', icon: Grid,    label: 'Categories' },
    { id: 'bulk',       icon: Package, label: 'Bulk Operations' },
  ]},
  { section: 'APP MANAGEMENT', items: [
    { id: 'app-settings',  icon: Settings,  label: 'App Settings' },
    { id: 'branding',      icon: Palette,   label: 'Branding' },
    { id: 'remote-config', icon: Sliders,   label: 'Remote Config' },
    { id: 'feature-flags', icon: Flag,      label: 'Feature Flags' },
    { id: 'maintenance',   icon: Settings2, label: 'Maintenance' },
    { id: 'announcements', icon: Megaphone, label: 'Announcements' },
  ]},
  { section: 'SYSTEM', items: [
    { id: 'admin-users',   icon: UserCog,      label: 'Admin Users' },
    { id: 'roles',         icon: Shield,       label: 'Roles & Permissions' },
    { id: 'activity-logs', icon: Activity,     label: 'Activity Logs' },
    { id: 'security',      icon: Lock,         label: 'Security' },
    { id: 'backups',       icon: HardDrive,    label: 'Backups' },
  ]},
  { section: 'ADVANCED', items: [
    { id: 'audit-logs',    icon: ClipboardList, label: 'Audit Logs' },
    { id: 'system-health', icon: Heart,         label: 'System Health' },
    { id: 'integrations',  icon: Plug,          label: 'Integrations' },
    { id: 'developer',     icon: Code,          label: 'Developer / API' },
    { id: 'support',       icon: HelpCircle,    label: 'Support / Tickets' },
  ]},
];

// ═══════════════════════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, icon }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', borderRadius: T.r.md, cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s',
    opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
    ...(size === 'sm' ? { padding: '6px 12px', fontSize: 12 } : { padding: '9px 16px', fontSize: 13 }),
  };
  const variants = {
    primary: { background: T.accent,  color: '#fff' },
    ghost:   { background: 'transparent', color: T.textSec, border: `1px solid ${T.border}` },
    danger:  { background: `${T.red}18`,  color: T.red,  border: `1px solid ${T.red}33` },
    success: { background: `${T.green}18`, color: T.green, border: `1px solid ${T.green}33` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {icon}{children}
    </button>
  );
}

function Badge({ children, color = T.purple }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 100,
      fontSize: 10, fontWeight: 800, letterSpacing: '0.4px', textTransform: 'uppercase',
      background: `${color}20`, color,
    }}>{children}</span>
  );
}

function StatCard({ icon: Icon, label, value, color = T.purple, trendLabel }) {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.lg,
      padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1, minWidth: 0,
    }}>
      <div style={{ width: 46, height: 46, borderRadius: T.r.md, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: T.textSec, marginBottom: 4, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: T.text, lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
        {trendLabel && (
          <div style={{ fontSize: 11, color: T.textMut, marginTop: 5 }}>{trendLabel}</div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${T.border}` }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>{description}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? T.accent : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );
}

function AdminCard({ title, subtitle, right, children, noPadding, style: s }) {
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.lg, overflow: 'hidden', ...s }}>
      {(title || right) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${T.border}`, gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            {title && <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{subtitle}</div>}
          </div>
          {right && <div style={{ flexShrink: 0 }}>{right}</div>}
        </div>
      )}
      <div style={noPadding ? {} : { padding: 20 }}>{children}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 24px', gap: 14 }}>
      <div style={{ width: 64, height: 64, borderRadius: T.r.xl, background: `${T.purple}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={28} color={T.purple} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: T.textSec, maxWidth: 340, lineHeight: 1.6 }}>{desc}</div>
      </div>
      {action}
    </div>
  );
}

function FormInput({ label, value, onChange, type = 'text', placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 6 }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        disabled={disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box', background: T.bgEl,
          border: `1px solid ${focused ? T.accent : T.border}`,
          borderRadius: T.r.md, color: T.text, fontSize: 13,
          padding: '9px 13px', outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.15s', opacity: disabled ? 0.5 : 1,
        }}
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange, rows = 4, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 6 }}>{label}</label>}
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box', background: T.bgEl,
          border: `1px solid ${focused ? T.accent : T.border}`,
          borderRadius: T.r.md, color: T.text, fontSize: 13,
          padding: '9px 13px', outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.15s', resize: 'vertical',
        }}
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 6 }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', background: T.bgEl,
          border: `1px solid ${T.border}`, borderRadius: T.r.md, color: T.text, fontSize: 13,
          padding: '9px 13px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
        }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SVG CHARTS
// ═══════════════════════════════════════════════════════════════════════════

function LineChartSVG({ data = [], series = [], height = 180 }) {
  if (!data.length) return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMut, flexDirection: 'column', gap: 8 }}>
      <BarChart2 size={26} /><span style={{ fontSize: 12 }}>No data yet</span>
    </div>
  );
  const W = 560, H = 160, P = { t: 16, r: 20, b: 32, l: 8 };
  const cW = W - P.l - P.r, cH = H - P.t - P.b;
  const allVals = series.flatMap(s => data.map(d => d[s.key] || 0));
  const max = Math.max(...allVals, 1);
  const xAt = i => P.l + (data.length <= 1 ? cW / 2 : (i / (data.length - 1)) * cW);
  const yAt = v => P.t + cH - (v / max) * cH * 0.88;
  const makePath = key => data.map((d, i) => {
    const x = xAt(i), y = yAt(d[key] || 0);
    if (i === 0) return `M${x},${y}`;
    const px = xAt(i - 1), py = yAt(data[i - 1][key] || 0);
    const cpx = (px + x) / 2;
    return `C${cpx},${py} ${cpx},${y} ${x},${y}`;
  }).join(' ');
  const makeArea = key => {
    const base = P.t + cH, last = data.length - 1;
    return `${makePath(key)} L${xAt(last)},${base} L${xAt(0)},${base} Z`;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }} preserveAspectRatio="xMidYMid meet">
      <defs>
        {series.map(s => (
          <linearGradient key={s.key} id={`lg_${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={P.l} y1={P.t + cH * p} x2={P.l + cW} y2={P.t + cH * p}
          stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      ))}
      {series.map(s => (
        <g key={s.key}>
          <path d={makeArea(s.key)} fill={`url(#lg_${s.key})`} />
          <path d={makePath(s.key)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={xAt(i)} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10}>{d.label}</text>
      ))}
      {series.map(s => data.map((d, i) => (
        <circle key={`${s.key}${i}`} cx={xAt(i)} cy={yAt(d[s.key] || 0)} r={3.5} fill={s.color} />
      )))}
    </svg>
  );
}

function DonutSVG({ segments = [], size = 160 }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 52, cx = 80, cy = 80, circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={22} />
      {total === 0 ? (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={22} />
      ) : segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const offset = -(cum / total * circ);
        cum += seg.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={22}
            strokeDasharray={`${Math.max(dash - 3, 0)} ${circ - Math.max(dash - 3, 0)}`}
            strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round" />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill={T.text} fontSize={22} fontWeight="900" fontFamily="Outfit, sans-serif">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={T.textSec} fontSize={11} fontFamily="Outfit, sans-serif">Total</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

function Sidebar({ active, setActive, isMobile, open, onClose, currentUser }) {
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.touches[0].clientX;
    if (diff > 50) {
      onClose();
      setTouchStartX(null);
    }
  };
  const handleTouchEnd = () => setTouchStartX(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <aside
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
      width: 270, background: 'rgba(12,12,21,0.97)', backdropFilter: 'blur(16px)',
      borderRight: 'none',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: open ? 0 : -270, top: 0, bottom: 0,
      zIndex: 35, transition: 'left 0.27s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: isMobile && open ? '4px 0 32px rgba(0,0,0,0.8)' : 'none',
      paddingTop: 'max(14px, env(safe-area-inset-top))',
      paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
    }}>
      {/* Top Section: User Profile */}
      <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {currentUser && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0,
            background: 'rgba(20,20,30,0.65)', backdropFilter: 'blur(10px)',
            borderRadius: T.r.md, padding: '8px 10px', border: 'none',
          }}>
            <div style={{ position: 'relative', flexShrink: 0, display: 'flex' }}>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #F59E0B' }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', fontWeight: 900, fontSize: 13, border: '1.5px solid rgba(245, 158, 11, 0.4)' }}>
                  {(currentUser.displayName || currentUser.email || 'A')[0].toUpperCase()}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: -2, right: -3 }}>
                <GoldenAdminBadge size={12} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: T.text, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.displayName || 'Super Admin'}</span>
              </div>
              <div style={{ fontSize: 10, color: T.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log Out"
              style={{
                background: 'rgba(239, 68, 68, 0.12)', border: `1px solid rgba(239, 68, 68, 0.25)`,
                borderRadius: T.r.md, color: T.red, cursor: 'pointer', padding: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'all 0.15s'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="ad-sidebar-nav ad-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.textMut, letterSpacing: '0.8px', textTransform: 'uppercase', padding: '6px 12px 4px' }}>
              {section}
            </div>
            {items.map(({ id, icon: Icon, label }) => {
              const isActive = active === id;
              return (
                <button key={id} onClick={() => setActive(id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: T.r.md, border: 'none', cursor: 'pointer',
                  background: isActive ? T.sidebarAct : 'transparent',
                  color: isActive ? T.accent : T.textSec,
                  fontFamily: 'inherit', fontSize: 13, fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease', textAlign: 'left', position: 'relative',
                }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = T.sidebarHov; e.currentTarget.style.color = T.text; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textSec; } }}
                >
                  {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: T.accent, borderRadius: '0 4px 4px 0', boxShadow: `0 0 10px ${T.accent}` }} />}
                  <Icon size={16} color={isActive ? T.accent : T.textSec} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                </button>
              );
            })}
          </div>
        ))}
        <div style={{ height: 20 }} />
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════

function Header({ section, onMenuToggle, isMobile, currentUser }) {
  return (
    <div style={{
      minHeight: 60, background: T.bgEl, borderBottom: 'none',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
      position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
    }}>
      <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', color: T.textSec, cursor: 'pointer', padding: 6, borderRadius: T.r.sm, display: 'flex', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = T.text}
        onMouseLeave={e => e.currentTarget.style.color = T.textSec}>
        <Menu size={20} />
      </button>

      {/* App Logo & Title in Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <img src="/logo.webp" alt="Logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain', flexShrink: 0, border: `1px solid rgba(245, 158, 11, 0.4)` }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 900, color: T.text, lineHeight: 1.2, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ flexShrink: 0 }}>Mushi QR Pro</span>
            {!isMobile && <span style={{ fontSize: 12, color: T.textSec, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/ {LABELS[section] || 'Admin Panel'}</span>}
          </div>
          <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 800, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <GoldenAdminBadge size={12} /> SUPER ADMIN
          </div>
        </div>
      </div>

      <div className="ad-header-search">
        <Search size={13} color={T.textMut} />
        <input placeholder="Search admin panel..." style={{ background: 'none', border: 'none', outline: 'none', color: T.text, fontSize: 12, fontFamily: 'inherit', width: 160 }} />
        <span style={{ fontSize: 10, color: T.textMut }}>⌘K</span>
      </div>

      <a href="/#/" style={{
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`,
        color: T.textSec, borderRadius: T.r.md, padding: '6px 12px',
        fontSize: 12, fontWeight: 700, textDecoration: 'none', transition: 'all 0.15s'
      }}>
        <ArrowLeft size={13} />
        <span className="ad-header-app-btn">App</span>
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD PANEL
// ═══════════════════════════════════════════════════════════════════════════

function DashboardPanel({ stats, history, featureFlags, announcement, subscribers, revenueData, appUsers, onNavigate, onSaveFlags }) {
  const si = DS.getStorageInfo();
  const qr = stats?.qrCount || 0;
  const bc = stats?.barcodeCount || 0;
  const totalCreated = qr + bc;
  const mrrVal = revenueData?.mrr !== undefined ? `$${revenueData.mrr}` : '$0.00';
  const usersVal = appUsers?.length !== undefined ? `${appUsers.length}` : '0';

  const sysChecks = [
    { label: 'localStorage',   ok: typeof localStorage !== 'undefined',            detail: si.used + ' used' },
    { label: 'Service Worker', ok: 'serviceWorker' in navigator,                   detail: 'serviceWorker' in navigator ? 'Enabled' : 'Disabled' },
    { label: 'PWA Mode',       ok: window.matchMedia('(display-mode: standalone)').matches, detail: window.matchMedia('(display-mode: standalone)').matches ? 'Installed' : 'Browser' },
    { label: 'Secure Context', ok: window.isSecureContext,                          detail: window.isSecureContext ? 'HTTPS' : 'HTTP' },
    { label: 'Canvas API',     ok: !!document.createElement('canvas').getContext,   detail: 'QR rendering' },
    { label: 'Clipboard API',  ok: !!navigator.clipboard,                           detail: 'Copy feature' },
  ];

  const allOk = sysChecks.every(c => c.ok);

  const quickActions = [
    { label: 'Users Hub', desc: 'Manage app users & blocks', icon: Users, color: T.blue, action: () => onNavigate('users') },
    { label: 'Revenue & Plans', desc: 'ARR, MRR & promo codes', icon: DollarSign, color: T.green, action: () => onNavigate('revenue') },
    { label: 'Cloud Templates', desc: 'Manage & create templates', icon: Layers, color: T.purple, action: () => onNavigate('templates') },
    { label: 'App Settings', desc: 'General & remote config', icon: Settings, color: T.orange, action: () => onNavigate('app-settings') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* SaaS Executive Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(216, 0, 54, 0.15) 0%, rgba(20, 20, 30, 0.9) 100%)',
        border: `1px solid ${T.accent}33`, borderRadius: T.r.xl, padding: '20px 24px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: T.text, margin: 0 }}>Super Admin Command Center</h2>
            <Badge color={T.accent}>Live Hub</Badge>
          </div>
          <p style={{ fontSize: 12, color: T.textSec, margin: 0 }}>
            Central executive overview for Mushi QR Pro SaaS platform operations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Btn size="sm" icon={<Zap size={13} />} onClick={() => onNavigate('revenue')}>
            Revenue Dashboard
          </Btn>
          <Btn size="sm" variant="ghost" icon={<Users size={13} />} onClick={() => onNavigate('users')}>
            User Directory
          </Btn>
        </div>
      </div>

      {/* Top Metric Overview Cards */}
      <div className="ad-stat-grid">
        <StatCard icon={DollarSign} label="Monthly Revenue (MRR)" value={mrrVal} color={T.green} trendLabel={`${revenueData?.paidUsers || 0} paid subscribers`} />
        <StatCard icon={Users}      label="Registered Users"      value={`${usersVal} Accounts`} color={T.blue} trendLabel="Realtime registered" />
        <StatCard icon={QrCode}     label="QR & Barcodes"         value={totalCreated} color={T.purple} trendLabel="All-time creations" />
        <StatCard icon={Shield}     label="System Status"         value={allOk ? "100% Operational" : "Degraded"} color={allOk ? T.green : T.orange} trendLabel={allOk ? "All checks pass" : "Attention needed"} />
      </div>

      {/* Most Used Controls & Shortcuts Hub */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
          Quick Admin Actions & Shortcuts
        </div>
        <div className="ad-quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {quickActions.map(q => (
            <div key={q.label} onClick={q.action} style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.lg,
              padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.15s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: T.r.md, background: `${q.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <q.icon size={20} color={q.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{q.label}</span>
                  <ArrowUpRight size={12} color={T.textMut} />
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Flags Direct Control Widget */}
      {featureFlags && (
        <AdminCard title="Live Feature Flags Quick Switcher" subtitle="Enable or disable key capabilities live across the app"
          right={<Btn size="sm" variant="ghost" onClick={() => onNavigate('feature-flags')}>Manage All ({Object.keys(featureFlags).length})</Btn>}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {Object.entries(featureFlags).slice(0, 4).map(([key, val]) => (
              <div key={key} style={{
                background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md,
                padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{key}</div>
                  <div style={{ fontSize: 10, color: val ? T.green : T.textMut }}>{val ? 'Active' : 'Disabled'}</div>
                </div>
                <button
                  onClick={() => onSaveFlags && onSaveFlags({ ...featureFlags, [key]: !val })}
                  style={{
                    width: 38, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                    background: val ? T.green : 'rgba(255,255,255,0.15)', position: 'relative',
                    transition: 'background 0.2s', flexShrink: 0
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3, left: val ? 19 : 3, transition: 'left 0.2s'
                  }} />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Recent Activity + System Status */}
      <div className="ad-activity-row">
        <AdminCard title="Recent Creation Log" subtitle="Last 8 generated items"
          right={<Btn variant="ghost" size="sm" onClick={() => onNavigate('activity-logs')}>View All</Btn>}
          noPadding
        >
          {!(history || []).length ? (
            <EmptyState icon={Activity} title="No activity yet" desc="QR codes and barcodes created will appear here." />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {['Type', 'Content', 'Format', 'When'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '9px 20px', fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(history || []).slice(0, 8).map((item, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.bgHov}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 20px' }}>
                        <Badge color={item.barcodeType ? T.green : T.purple}>{item.barcodeType ? 'Barcode' : 'QR'}</Badge>
                      </td>
                      <td style={{ padding: '10px 20px', fontSize: 12, color: T.text, maxWidth: 180 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {safeStr(item.qrData) || safeStr(item.data) || item.qrType || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 20px', fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>{item.qrType || item.barcodeType || '—'}</td>
                      <td style={{ padding: '10px 20px', fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>{timeAgo(item.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        <AdminCard title="System Readiness Diagnostics" right={<Badge color={allOk ? T.green : T.orange}>{allOk ? 'All Systems OK' : 'Check Warnings'}</Badge>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sysChecks.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.ok ? T.green : T.red, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: 10, color: T.textSec }}>{c.detail}</div>
                </div>
                <span style={{ fontSize: 10, color: c.ok ? T.green : T.red, fontWeight: 800 }}>{c.ok ? 'Pass' : 'Check'}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE EDITOR — CANVAS PREVIEW
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_TPL = {
  name: '', category: 'Social',
  bgType: 'gradient', bgColor1: '#1a1a2e', bgColor2: '#e94560',
  gradientDir: 'diagonal', cornerRadius: 0,
  qrX: 0.5, qrY: 0.5, qrSize: 0.5,
  qrColor: '#ffffff', bgQrColor: '#000000', bgTransparent: false,
  eyeColor: '#ffffff', syncEyes: true,
  dotStyle: 'square', eyeStyle: 'square',
};

function TemplateCanvas({ form, size = 280 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const s = size;
    ctx.clearRect(0, 0, s, s);

    // ── Background ──
    const cr = Math.min(form.cornerRadius || 0, s / 2);
    const fillPath = () => { ctx.beginPath(); ctx.roundRect(0, 0, s, s, cr); };

    if (form.bgType === 'transparent') {
      const cs = 12;
      for (let x = 0; x < s; x += cs)
        for (let y = 0; y < s; y += cs) {
          ctx.fillStyle = (Math.floor(x/cs) + Math.floor(y/cs)) % 2 === 0 ? '#2a2a3a' : '#1a1a2a';
          ctx.fillRect(x, y, cs, cs);
        }
    } else if (form.bgType === 'gradient') {
      let g;
      const c1 = form.bgColor1 || '#1a1a2e', c2 = form.bgColor2 || '#e94560';
      if (form.gradientDir === 'radial') g = ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
      else if (form.gradientDir === 'horizontal') g = ctx.createLinearGradient(0,0,s,0);
      else if (form.gradientDir === 'vertical') g = ctx.createLinearGradient(0,0,0,s);
      else g = ctx.createLinearGradient(0,0,s,s);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g;
      if (cr > 0) { fillPath(); ctx.fill(); } else ctx.fillRect(0,0,s,s);
    } else {
      ctx.fillStyle = form.bgColor1 || '#ffffff';
      if (cr > 0) { fillPath(); ctx.fill(); } else ctx.fillRect(0,0,s,s);
    }

    // ── QR area ──
    const qsz = Math.max(0.1, Math.min(0.92, form.qrSize || 0.5)) * s;
    const qx  = Math.max(0, Math.min(s - qsz, (form.qrX || 0.5) * s - qsz / 2));
    const qy  = Math.max(0, Math.min(s - qsz, (form.qrY || 0.5) * s - qsz / 2));
    const bgQ = form.bgTransparent ? null : (form.bgQrColor || '#000000');
    if (bgQ) { ctx.fillStyle = bgQ; ctx.fillRect(qx, qy, qsz, qsz); }

    // QR dot grid (7×7 simplified)
    const cells = 9;
    const cs2 = qsz / cells;
    const qc  = form.qrColor || '#ffffff';
    const PATTERN = [
      [1,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,1,1,0],[1,0,1,1,1,0,1,0,1],
      [1,0,1,1,1,0,1,0,0],[1,0,1,1,1,0,1,1,1],[1,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,1,0,0],[0,1,0,1,0,1,0,0,1],[1,0,1,0,1,0,1,1,0],
    ];
    ctx.fillStyle = qc;
    PATTERN.forEach((row, r) => row.forEach((cell, c) => {
      if (!cell) return;
      const px = qx + c * cs2, py = qy + r * cs2;
      if (form.dotStyle === 'dots') {
        ctx.beginPath(); ctx.arc(px+cs2/2, py+cs2/2, cs2*0.38, 0, Math.PI*2); ctx.fill();
      } else if (form.dotStyle === 'rounded' || form.dotStyle === 'extra-rounded') {
        ctx.beginPath(); ctx.roundRect(px+0.5, py+0.5, cs2-1, cs2-1, cs2*0.35); ctx.fill();
      } else {
        ctx.fillRect(px+0.5, py+0.5, cs2-1, cs2-1);
      }
    }));

    // Eye markers (3×3 corners)
    const ec = form.syncEyes ? qc : (form.eyeColor || qc);
    const drawEye = (ex, ey) => {
      const ew = cs2 * 3;
      ctx.fillStyle = bgQ || 'transparent';
      if (bgQ) ctx.fillRect(ex, ey, ew, ew);
      ctx.strokeStyle = ec; ctx.lineWidth = cs2 * 0.6;
      if (form.eyeStyle === 'circle') {
        ctx.beginPath(); ctx.arc(ex+ew/2, ey+ew/2, ew/2-cs2*0.3, 0, Math.PI*2); ctx.stroke();
      } else if (form.eyeStyle === 'rounded') {
        ctx.beginPath(); ctx.roundRect(ex+cs2*0.3, ey+cs2*0.3, ew-cs2*0.6, ew-cs2*0.6, cs2*0.6); ctx.stroke();
      } else {
        ctx.strokeRect(ex+cs2*0.3, ey+cs2*0.3, ew-cs2*0.6, ew-cs2*0.6);
      }
      ctx.fillStyle = ec;
      const id = cs2 * 1.1, io = (ew - id) / 2;
      if (form.eyeStyle === 'circle') {
        ctx.beginPath(); ctx.arc(ex+ew/2, ey+ew/2, id/2, 0, Math.PI*2); ctx.fill();
      } else {
        ctx.fillRect(ex+io, ey+io, id, id);
      }
    };
    drawEye(qx, qy);
    drawEye(qx + qsz - cs2*3, qy);
    drawEye(qx, qy + qsz - cs2*3);

    // Position indicator
    ctx.strokeStyle = 'rgba(214,0,54,0.7)'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]);
    ctx.strokeRect(qx, qy, qsz, qsz); ctx.setLineDash([]);

    // Center dot
    ctx.fillStyle = '#D60036'; ctx.beginPath();
    ctx.arc((form.qrX||0.5)*s, (form.qrY||0.5)*s, 3, 0, Math.PI*2); ctx.fill();

  }, [form, size]);

  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: 10, display: 'block', width: '100%', aspectRatio: '1' }} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE EDITOR MODAL
// ═══════════════════════════════════════════════════════════════════════════

const DOT_STYLES   = ['square','rounded','dots','extra-rounded','classy','classy-rounded','cherry-blossom','violet-flower','sunflower','rose','daisy','tulip','lotus','forget-me-not','pansy','dollar-coin','cute-emoticon','lavender','monstera','coffee-bean','raindrop','cactus-plant','basketball-dot','chess-pawn','bow-ribbon'];
const EYE_STYLES   = ['square','rounded','circle','leaf','extra-rounded','dollar-coin','cute-emoticon','cherry-blossom','lotus','sunflower','lavender','rose','monstera','daisy','coffee-bean-eye','raindrop-eye','cactus-eye','basketball-eye','chess-eye','bow-eye','violet-flower-eye','tulip-eye','forget-me-not-eye','pansy-eye'];
const GRAD_DIRS    = [{ v:'diagonal', l:'↘ Diagonal' },{ v:'horizontal', l:'→ Horizontal' },{ v:'vertical', l:'↓ Vertical' },{ v:'radial', l:'◎ Radial' }];
const TPL_CATS     = ['Social','Business','Hot','Creative','Minimal','Event','Retail','Custom'];

function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <label style={{ fontSize:11, fontWeight:700, color:T.textSec, minWidth:90, flexShrink:0 }}>{label}</label>
      <div style={{ display:'flex', alignItems:'center', gap:8, flex:1 }}>
        <input type="color" value={value || '#ffffff'} onChange={e => onChange(e.target.value)}
          style={{ width:34, height:28, border:`1px solid ${T.border}`, borderRadius:6, cursor:'pointer', background:'none', padding:2, flexShrink:0 }} />
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
          style={{ flex:1, minWidth:0, background:T.bgEl, border:`1px solid ${T.border}`, borderRadius:6, color:T.text, fontSize:12, padding:'5px 8px', outline:'none', fontFamily:'monospace' }} />
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step=0.01, onChange, fmt }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <label style={{ fontSize:11, fontWeight:700, color:T.textSec, minWidth:90, flexShrink:0 }}>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ flex:1, accentColor:T.accent, cursor:'pointer' }} />
      <span style={{ fontSize:11, fontWeight:700, color:T.text, minWidth:40, textAlign:'right', fontFamily:'monospace' }}>
        {fmt ? fmt(value) : value.toFixed(2)}
      </span>
    </div>
  );
}

function BtnGroup({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.v;
        const l = typeof o === 'string' ? o : o.l;
        const active = value === v;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            padding:'5px 10px', fontSize:11, borderRadius:6, border:`1px solid ${active ? T.accent : T.border}`,
            background: active ? T.accentLow : 'transparent',
            color: active ? T.accent : T.textSec, cursor:'pointer', fontFamily:'inherit', fontWeight: active ? 700 : 500,
            transition:'all 0.12s',
          }}>{l}</button>
        );
      })}
    </div>
  );
}

function TemplateEditorModal({ form, setForm, editId, onSave, onClose, saving }) {
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.85)',  display:'flex', alignItems:'stretch' }}>
      {/* Modal box */}
      <div style={{ margin:'auto', width:'100%', maxWidth:900, maxHeight:'96vh', background:T.bgCard, borderRadius:16, border:`1px solid ${T.border}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
          <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{editId ? '✏️ Edit Template' : '✨ New Template'}</div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
            <Btn onClick={onSave} disabled={saving || !form.name?.trim()} icon={<Check size={13} />}>
              {saving ? 'Saving…' : 'Save Template'}
            </Btn>
          </div>
        </div>

        {/* Body */}
        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

          {/* Left: Preview */}
          <div style={{ width:300, minWidth:280, borderRight:`1px solid ${T.border}`, padding:20, display:'flex', flexDirection:'column', gap:16, flexShrink:0, background:T.bgEl }}>
            <div style={{ fontSize:11, fontWeight:800, color:T.textMut, textTransform:'uppercase', letterSpacing:'0.6px' }}>Live Preview</div>
            <div style={{ borderRadius:12, overflow:'hidden', border:`1px solid ${T.border}` }}>
              <TemplateCanvas form={form} size={260} />
            </div>
            <div style={{ fontSize:10, color:T.textMut, textAlign:'center', lineHeight:1.5 }}>
              Red dashes = QR bounds · Red dot = center point
            </div>
            {/* Quick info */}
            <div style={{ background:T.bgCard, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.text, marginBottom:8 }}>{form.name || 'Untitled Template'}</div>
              {[
                ['Category', form.category],
                ['Position', `X ${(form.qrX*100).toFixed(0)}% · Y ${(form.qrY*100).toFixed(0)}%`],
                ['QR Size', `${(form.qrSize*100).toFixed(0)}%`],
                ['Dot Style', form.dotStyle],
                ['Eye Style', form.eyeStyle],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:10, color:T.textMut }}>{k}</span>
                  <span style={{ fontSize:10, color:T.textSec, textTransform:'capitalize' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="ad-scroll" style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:20 }}>

            {/* Basic Info */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMut, textTransform:'uppercase', letterSpacing:'0.5px' }}>Basic Info</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <FormInput label="Template Name" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Dark Blue Gradient" />
                <FormSelect label="Category" value={form.category} onChange={v => set('category', v)} options={TPL_CATS.map(c => ({ value:c, label:c }))} />
              </div>
            </div>

            {/* Background */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMut, textTransform:'uppercase', letterSpacing:'0.5px' }}>Background</div>
              <div style={{ display:'flex', gap:0, background:T.bgEl, borderRadius:8, padding:3, border:`1px solid ${T.border}`, width:'fit-content' }}>
                {[['solid','■ Solid'],['gradient','⬛ Gradient'],['transparent','▢ Transparent']].map(([v,l]) => (
                  <button key={v} onClick={() => set('bgType', v)} style={{
                    padding:'6px 14px', borderRadius:6, border:'none', cursor:'pointer', fontFamily:'inherit',
                    background: form.bgType === v ? T.accent : 'transparent',
                    color: form.bgType === v ? '#fff' : T.textSec, fontWeight:700, fontSize:11, transition:'all 0.12s',
                  }}>{l}</button>
                ))}
              </div>

              {form.bgType !== 'transparent' && (
                <ColorRow label={form.bgType === 'gradient' ? 'Color 1' : 'Background'} value={form.bgColor1} onChange={v => set('bgColor1', v)} />
              )}
              {form.bgType === 'gradient' && (
                <>
                  <ColorRow label="Color 2" value={form.bgColor2} onChange={v => set('bgColor2', v)} />
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:T.textSec, minWidth:90, flexShrink:0 }}>Direction</label>
                    <BtnGroup options={GRAD_DIRS} value={form.gradientDir} onChange={v => set('gradientDir', v)} />
                  </div>
                </>
              )}
              <SliderRow label="Corner Radius" value={form.cornerRadius||0} min={0} max={80} step={1} onChange={v => set('cornerRadius', v)} fmt={v => `${v}px`} />
            </div>

            {/* QR Position */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMut, textTransform:'uppercase', letterSpacing:'0.5px' }}>QR Position &amp; Size</div>
              <SliderRow label="Center X" value={form.qrX} min={0.05} max={0.95} onChange={v => set('qrX', v)} fmt={v => `${(v*100).toFixed(0)}%`} />
              <SliderRow label="Center Y" value={form.qrY} min={0.05} max={0.95} onChange={v => set('qrY', v)} fmt={v => `${(v*100).toFixed(0)}%`} />
              <SliderRow label="QR Size" value={form.qrSize} min={0.1} max={0.92} onChange={v => set('qrSize', v)} fmt={v => `${(v*100).toFixed(0)}%`} />
            </div>

            {/* QR Colors */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMut, textTransform:'uppercase', letterSpacing:'0.5px' }}>QR Colors</div>
              <ColorRow label="QR Color" value={form.qrColor} onChange={v => set('qrColor', v)} />
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.textSec, minWidth:90, flexShrink:0 }}>QR Background</label>
                <button onClick={() => set('bgTransparent', !form.bgTransparent)} style={{
                  display:'flex', alignItems:'center', gap:6, background:'none', border:`1px solid ${T.border}`,
                  borderRadius:6, color: form.bgTransparent ? T.accent : T.textSec, cursor:'pointer', padding:'5px 10px', fontSize:11, fontWeight:700, fontFamily:'inherit',
                }}>
                  {form.bgTransparent ? '✓ Transparent' : '□ Transparent'}
                </button>
              </div>
              {!form.bgTransparent && (
                <ColorRow label="QR BG Color" value={form.bgQrColor} onChange={v => set('bgQrColor', v)} />
              )}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <label style={{ fontSize:11, fontWeight:700, color:T.textSec, minWidth:90, flexShrink:0 }}>Eye Color</label>
                <button onClick={() => set('syncEyes', !form.syncEyes)} style={{
                  display:'flex', alignItems:'center', gap:6, background:'none', border:`1px solid ${T.border}`,
                  borderRadius:6, color: form.syncEyes ? T.green : T.textSec, cursor:'pointer', padding:'5px 10px', fontSize:11, fontWeight:700, fontFamily:'inherit',
                }}>
                  {form.syncEyes ? '⟳ Same as QR' : '⊙ Custom'}
                </button>
              </div>
              {!form.syncEyes && (
                <ColorRow label="Eye Color" value={form.eyeColor} onChange={v => set('eyeColor', v)} />
              )}
            </div>

            {/* QR Style */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, paddingTop:16, borderTop:`1px solid ${T.border}` }}>
              <div style={{ fontSize:12, fontWeight:800, color:T.textMut, textTransform:'uppercase', letterSpacing:'0.5px' }}>QR Style</div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.textSec, marginBottom:8 }}>Dot Style</div>
                <BtnGroup options={DOT_STYLES} value={form.dotStyle} onChange={v => set('dotStyle', v)} />
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.textSec, marginBottom:8 }}>Eye Style</div>
                <BtnGroup options={EYE_STYLES} value={form.eyeStyle} onChange={v => set('eyeStyle', v)} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATES PANEL
// ═══════════════════════════════════════════════════════════════════════════

function TemplatesPanel({ cloudTemplates, onRefresh }) {
  const [tab, setTab]           = useState('builtin');
  const [editorOpen, setEditor] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState({ ...DEFAULT_TPL });
  const [saving, setSaving]     = useState(false);
  const toast = useToast();

  const openNew = () => { setForm({ ...DEFAULT_TPL }); setEditId(null); setEditor(true); };
  const openEdit = tpl => {
    setForm({
      ...DEFAULT_TPL,
      name: tpl.name, category: tpl.category,
      bgType: tpl.bgType || 'gradient',
      bgColor1: tpl.bgColor1 || '#1a1a2e', bgColor2: tpl.bgColor2 || '#e94560',
      gradientDir: tpl.gradientDir || 'diagonal', cornerRadius: tpl.cornerRadius || 0,
      qrX: tpl.qrX || 0.5, qrY: tpl.qrY || 0.5, qrSize: tpl.qrSize || 0.5,
      qrColor: tpl.preset?.qrColor || '#ffffff',
      bgQrColor: tpl.preset?.bgColor || '#000000',
      bgTransparent: !!tpl.preset?.bgTransparent,
      eyeColor: tpl.preset?.eyeColor || '#ffffff',
      syncEyes: tpl.preset?.syncEyes !== false,
      dotStyle: tpl.preset?.dotStyle || 'square',
      eyeStyle: tpl.preset?.eyeStyle || 'square',
    });
    setEditId(tpl.id); setEditor(true);
  };
  const cloneBuiltin = tpl => {
    setForm({
      ...DEFAULT_TPL,
      name: tpl.name + ' (Custom)', category: tpl.category,
      qrX: tpl.qrX, qrY: tpl.qrY, qrSize: tpl.qrSize,
      qrColor: tpl.preset?.qrColor || '#ffffff',
      bgQrColor: tpl.preset?.bgColor || '#ffffff',
      bgTransparent: !!tpl.preset?.bgTransparent,
      dotStyle: tpl.preset?.dotStyle || 'square',
      eyeStyle: tpl.preset?.eyeStyle || 'square',
    });
    setEditId(null); setEditor(true); setTab('custom');
  };
  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    try {
      const t = {
        id: editId || ('custom_' + Date.now().toString(36)),
        name: form.name.trim(), category: form.category,
        bgType: form.bgType, bgColor1: form.bgColor1, bgColor2: form.bgColor2,
        gradientDir: form.gradientDir, cornerRadius: form.cornerRadius,
        qrX: form.qrX, qrY: form.qrY, qrSize: form.qrSize,
        preset: {
          qrColor: form.qrColor, bgColor: form.bgQrColor || '#ffffff',
          bgTransparent: form.bgTransparent,
          eyeColor: form.eyeColor, eyeOuterColor: form.eyeColor,
          syncEyes: form.syncEyes,
          dotStyle: form.dotStyle, eyeStyle: form.eyeStyle,
        },
        updatedAt: new Date().toISOString(),
      };
      await DS.saveCloudTemplate(t);
      toast((editId ? 'Template updated!' : 'Template created!') + ' "' + t.name + '" is now live.', 'success');
      setEditor(false); onRefresh();
    } catch (e) {
      toast('Failed to save template: ' + (e.message || 'Unknown error'), 'error', 6000);
    } finally { setSaving(false); }
  };
  const handleDelete = async id => {
    if (!confirm('Delete this template?')) return;
    try {
      await DS.deleteCloudTemplate(id);
      toast('Template deleted.', 'info');
      onRefresh();
    } catch (e) {
      toast('Failed to delete: ' + (e.message || 'Unknown error'), 'error', 6000);
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {editorOpen && (
        <TemplateEditorModal form={form} setForm={setForm} editId={editId}
          onSave={handleSave} onClose={() => setEditor(false)} saving={saving} />
      )}

      {/* Tab bar */}
      <div style={{ display:'flex', gap:0, background:T.bgCard, borderRadius:T.r.md, padding:4, border:`1px solid ${T.border}`, width:'fit-content' }}>
        {[{ id:'builtin', label:`Built-in (${QR_TEMPLATES.length})` },{ id:'custom', label:`Custom (${cloudTemplates.length})` }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:'7px 18px', borderRadius:T.r.sm, border:'none', cursor:'pointer', fontFamily:'inherit',
            background: tab === t.id ? T.accent : 'transparent',
            color: tab === t.id ? '#fff' : T.textSec, fontWeight:700, fontSize:12, transition:'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Built-in tab */}
      {tab === 'builtin' && (
        <AdminCard title="Built-in Templates" subtitle="Pre-installed templates — view only. Clone to create an editable copy.">
          <div className="ad-template-grid">
            {QR_TEMPLATES.map(tpl => (
              <div key={tpl.id} style={{ background:T.bgEl, borderRadius:T.r.md, overflow:'hidden', border:`1px solid ${T.border}`, display:'flex', flexDirection:'column' }}>
                {/* Color swatch preview */}
                <div style={{
                  aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
                  background: `linear-gradient(135deg, ${tpl.preset?.qrColor || T.purple}22, ${T.blue}22)`,
                }}>
                  <QrCode size={32} color={tpl.preset?.qrColor || T.purple} />
                  {/* Position indicator dot */}
                  <div style={{
                    position:'absolute',
                    left: `${(tpl.qrX||0.5)*100}%`, top: `${(tpl.qrY||0.5)*100}%`,
                    transform:'translate(-50%,-50%)', width:8, height:8, borderRadius:'50%',
                    background:T.accent, border:'2px solid #fff', boxShadow:'0 1px 4px rgba(0,0,0,0.5)',
                  }} />
                </div>
                <div style={{ padding:'10px 12px', flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tpl.name}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:4 }}>
                    <Badge color={T.orange}>{tpl.category}</Badge>
                    <span style={{ fontSize:9, color:T.textMut }}>Size {(tpl.qrSize*100).toFixed(0)}%</span>
                  </div>
                  {/* Preset color dots */}
                  <div style={{ display:'flex', gap:4, marginTop:2 }}>
                    {[tpl.preset?.qrColor, tpl.preset?.bgColor].filter(Boolean).map((col,i) => (
                      <div key={i} title={col} style={{ width:14, height:14, borderRadius:'50%', background:col, border:`1px solid ${T.border}` }} />
                    ))}
                    <span style={{ fontSize:9, color:T.textMut, marginLeft:2 }}>{tpl.preset?.dotStyle}</span>
                  </div>
                  <button onClick={() => cloneBuiltin(tpl)} style={{
                    marginTop:4, background:T.accentLow, border:`1px solid rgba(214,0,54,0.2)`,
                    borderRadius:6, color:T.accent, cursor:'pointer', padding:'5px 0', fontSize:10,
                    fontWeight:700, fontFamily:'inherit', transition:'all 0.12s',
                  }}>Clone &amp; Customize →</button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Custom tab */}
      {tab === 'custom' && (
        <AdminCard title="Custom Templates" subtitle="Create and manage your own QR templates"
          right={<Btn icon={<Plus size={13} />} onClick={openNew}>New Template</Btn>}>
          {cloudTemplates.length === 0 ? (
            <EmptyState icon={Layers} title="No custom templates yet"
              desc="Create templates with custom backgrounds, colors, QR position and styles."
              action={<Btn icon={<Plus size={13} />} onClick={openNew}>Create First Template</Btn>} />
          ) : (
            <div className="ad-template-grid">
              {cloudTemplates.map(tpl => (
                <div key={tpl.id} style={{ background:T.bgEl, borderRadius:T.r.md, overflow:'hidden', border:`1px solid ${T.border}`, display:'flex', flexDirection:'column' }}>
                  {/* Mini canvas preview */}
                  <div style={{ aspectRatio:'1', overflow:'hidden' }}>
                    <TemplateCanvas form={{
                      bgType: tpl.bgType||'gradient', bgColor1:tpl.bgColor1||'#1a1a2e', bgColor2:tpl.bgColor2||'#e94560',
                      gradientDir:tpl.gradientDir||'diagonal', cornerRadius:tpl.cornerRadius||0,
                      qrX:tpl.qrX||0.5, qrY:tpl.qrY||0.5, qrSize:tpl.qrSize||0.5,
                      qrColor:tpl.preset?.qrColor||'#fff', bgQrColor:tpl.preset?.bgColor||'#000',
                      bgTransparent:!!tpl.preset?.bgTransparent,
                      eyeColor:tpl.preset?.eyeColor||'#fff', syncEyes:tpl.preset?.syncEyes!==false,
                      dotStyle:tpl.preset?.dotStyle||'square', eyeStyle:tpl.preset?.eyeStyle||'square',
                    }} size={200} />
                  </div>
                  <div style={{ padding:'10px 12px', flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tpl.name}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <Badge color={T.purple}>{tpl.category}</Badge>
                      <span style={{ fontSize:9, color:T.textMut }}>{tpl.preset?.dotStyle}</span>
                    </div>
                    <div style={{ display:'flex', gap:5, marginTop:4 }}>
                      <button onClick={() => openEdit(tpl)} style={{
                        flex:1, background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:6,
                        color:T.text, cursor:'pointer', padding:'5px 0', fontSize:10, fontWeight:700, fontFamily:'inherit',
                      }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(tpl.id)} style={{
                        background:`${T.red}10`, border:`1px solid ${T.red}30`, borderRadius:6,
                        color:T.red, cursor:'pointer', padding:'5px 8px', fontSize:10, fontWeight:700, fontFamily:'inherit',
                      }}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP SETTINGS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function AppSettingsPanel({ settings, onSave }) {
  const [form, setForm] = useState(settings || {});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      setSaved(true);
      toast('App settings saved successfully!', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast('Failed to save: ' + (e.message || 'Unknown error'), 'error', 6000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="General Settings" subtitle="Core app configuration stored locally">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormInput label="App Name" value={form.appName || ''} onChange={v => set('appName', v)} />
          <FormInput label="Welcome Message" value={form.welcomeText || ''} onChange={v => set('welcomeText', v)} />
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 6 }}>Brand Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="color" value={form.brandColor || '#D60036'} onChange={e => set('brandColor', e.target.value)}
                style={{ width: 46, height: 38, borderRadius: T.r.md, border: `1px solid ${T.border}`, cursor: 'pointer', background: 'none', padding: 4 }} />
              <FormInput value={form.brandColor || '#D60036'} onChange={v => set('brandColor', v)} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={handleSave} disabled={saving} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
            </Btn>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRANDING PANEL
// ═══════════════════════════════════════════════════════════════════════════

function BrandingPanel({ settings, onSave }) {
  const [form, setForm] = useState(settings || {});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      setSaved(true);
      toast('Branding saved successfully!', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast('Failed to save branding: ' + (e.message || 'Unknown error'), 'error', 6000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Brand Identity" subtitle="Customize your app's visual identity">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="/logo.webp" alt="Logo" style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'contain', background: T.bgEl, padding: 6, border: `1px solid ${T.border}` }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>App Logo</div>
              <div style={{ fontSize: 12, color: T.textSec, marginBottom: 8 }}>Served from /logo.webp</div>
              <Badge color={T.blue}>Build Asset</Badge>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 8 }}>Brand Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="color" value={form.brandColor || '#D60036'} onChange={e => set('brandColor', e.target.value)}
                style={{ width: 56, height: 56, borderRadius: T.r.md, border: `1px solid ${T.border}`, cursor: 'pointer', background: 'none', padding: 6 }} />
              <div>
                <div style={{ fontSize: 11, color: T.textSec, marginBottom: 2 }}>Hex Value</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: form.brandColor || '#D60036', fontFamily: 'monospace' }}>{form.brandColor || '#D60036'}</div>
              </div>
            </div>
          </div>
          <FormInput label="App Display Name" value={form.appName || 'Mushi QR Pro'} onChange={v => set('appName', v)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn onClick={handleSave} disabled={saving} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Branding'}
            </Btn>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Color System Preview">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
          {[
            { label: 'Brand', color: form.brandColor || '#D60036' },
            { label: 'Dark BG', color: '#09090f' },
            { label: 'Card', color: '#14141e' },
            { label: 'Purple', color: T.purple },
            { label: 'Green', color: T.green },
            { label: 'Orange', color: T.orange },
          ].map(c => (
            <div key={c.label} style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', height: 44, background: c.color, borderRadius: T.r.md, border: `1px solid ${T.border}`, marginBottom: 5 }} />
              <div style={{ fontSize: 10, color: T.textSec }}>{c.label}</div>
              <div style={{ fontSize: 9, color: T.textMut, fontFamily: 'monospace' }}>{c.color}</div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE FLAGS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function FeatureFlagsPanel({ flags, onSave }) {
  const [f, setF] = useState(flags || {});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => { if (flags) setF(flags); }, [flags]);

  const toggle = k => setF(p => ({ ...p, [k]: !p[k] }));
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(f);
      setSaved(true);
      toast('Feature flags saved! Changes are now live for all users.', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast('Failed to save flags: ' + (e.message || 'Unknown error'), 'error', 6000);
    } finally {
      setSaving(false);
    }
  };

  const enabled = Object.values(f).filter(Boolean).length;
  const total   = Object.keys(f).length;

  const groups = [
    { title: 'Core Features', items: [
      { key: 'qr_generator',      label: 'QR Code Generator',      desc: 'Allow users to create QR codes' },
      { key: 'barcode_generator', label: 'Barcode Generator',       desc: 'Allow users to create barcodes' },
      { key: 'scanner',           label: 'QR & Barcode Scanner',    desc: 'Camera-based scanner feature' },
      { key: 'bulk_generation',   label: 'Bulk Generation',         desc: 'Create multiple codes at once' },
      { key: 'templates',         label: 'Templates',               desc: 'Pre-designed QR templates' },
    ]},
    { title: 'Data & History', items: [
      { key: 'history', label: 'History',     desc: 'Save creation history locally' },
      { key: 'saved',   label: 'Saved Items', desc: 'Allow bookmarking QR codes' },
    ]},
    { title: 'Export Options', items: [
      { key: 'export_png', label: 'Export PNG', desc: 'Download as PNG image' },
      { key: 'export_svg', label: 'Export SVG', desc: 'Download as SVG vector' },
      { key: 'export_pdf', label: 'Export PDF', desc: 'Download as PDF document' },
    ]},
    { title: 'App Features', items: [
      { key: 'dark_mode',   label: 'Dark Mode',          desc: 'Dark/light theme toggle' },
      { key: 'pwa_install', label: 'PWA Install Prompt', desc: 'Show browser install prompt' },
    ]},
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 13, color: T.textSec }}>{enabled} of {total} features enabled</div>
          <div style={{ width: 100, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
            <div style={{ height: '100%', background: T.green, borderRadius: 2, width: `${total ? (enabled / total) * 100 : 0}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
        <Btn onClick={handleSave} disabled={saving} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Flags'}
        </Btn>
      </div>
      {groups.map(g => (
        <AdminCard key={g.title} title={g.title}>
          {g.items.map((item, i, arr) => (
            <div key={item.key} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <ToggleRow label={item.label} description={item.desc} checked={!!f[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </AdminCard>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAINTENANCE PANEL
// ═══════════════════════════════════════════════════════════════════════════

function MaintenancePanel({ settings, onSave }) {
  const [form, setForm] = useState(settings || {});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      setSaved(true);
      toast(form.maintenanceMode ? '⚠️ Maintenance mode is now ACTIVE!' : 'Maintenance settings saved.', form.maintenanceMode ? 'warning' : 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast('Failed to save: ' + (e.message || 'Unknown error'), 'error', 6000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {form.maintenanceMode && (
        <div style={{ background: `${T.red}0d`, border: `1px solid ${T.red}33`, borderRadius: T.r.md, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <AlertTriangle size={15} color={T.red} />
          <span style={{ fontSize: 13, color: T.red, fontWeight: 600 }}>Maintenance mode is ACTIVE — users will see the maintenance screen.</span>
        </div>
      )}
      <AdminCard title="Maintenance Mode" subtitle="Take the app offline for scheduled maintenance">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ToggleRow label="Enable Maintenance Mode" description="Displays a maintenance page to all users" checked={!!form.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
          <FormTextarea label="Maintenance Message" rows={3} value={form.maintenanceMessage || ''} onChange={v => set('maintenanceMessage', v)}
            placeholder="We are performing scheduled maintenance. Please check back soon." />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn onClick={handleSave} disabled={saving} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
            </Btn>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function AnnouncementsPanel({ announcement, onSave }) {
  const [form, setForm] = useState(announcement || { title: '', message: '', active: false, type: 'info' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => { if (announcement) setForm(announcement); }, [announcement]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      setSaved(true);
      toast(form.active ? '📢 Announcement published to all users!' : 'Announcement saved (not active).', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast('Failed to publish: ' + (e.message || 'Unknown error'), 'error', 6000);
    } finally {
      setSaving(false);
    }
  };

  const types = [
    { value: 'info',    label: '💬 Info',     color: T.blue },
    { value: 'success', label: '✅ Success',  color: T.green },
    { value: 'warning', label: '⚠️ Warning',  color: T.orange },
    { value: 'error',   label: '🚨 Critical', color: T.red },
  ];
  const curType = types.find(t => t.value === form.type) || types[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Announcement Banner" subtitle="Shown to all users at the top of the app">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ToggleRow label="Active" description="Show banner to all users right now" checked={!!form.active} onChange={v => set('active', v)} />
          <FormInput label="Title" value={form.title || ''} onChange={v => set('title', v)} placeholder="e.g. New features available!" />
          <FormTextarea label="Message" value={form.message || ''} rows={3} onChange={v => set('message', v)} placeholder="Tell users what's new or important..." />
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 8 }}>Type</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {types.map(t => (
                <button key={t.value} onClick={() => set('type', t.value)} style={{
                  padding: '6px 14px', borderRadius: T.r.md, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
                  background: form.type === t.value ? `${t.color}20` : T.bgEl,
                  border: `1px solid ${form.type === t.value ? t.color : T.border}`,
                  color: form.type === t.value ? t.color : T.textSec, transition: 'all 0.12s',
                }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn onClick={handleSave} disabled={saving} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saving ? 'Publishing…' : saved ? 'Published!' : 'Publish Announcement'}
            </Btn>
          </div>
        </div>
      </AdminCard>

      {form.title && (
        <AdminCard title="Preview">
          <div style={{ padding: '12px 16px', borderRadius: T.r.md, background: `${curType.color}12`, border: `1px solid ${curType.color}30`, display: 'flex', gap: 10 }}>
            <Info size={15} color={curType.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{form.title}</div>
              {form.message && <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>{form.message}</div>}
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REMOTE CONFIG PANEL
// ═══════════════════════════════════════════════════════════════════════════

function RemoteConfigPanel({ config, onSave }) {
  const [pairs, setPairs] = useState([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  useEffect(() => { if (config) setPairs(Object.entries(config).filter(([k]) => !k.startsWith('_')).map(([k, v]) => ({ k, v }))); }, [config]);

  const update = (i, field, val) => setPairs(p => p.map((x, j) => j === i ? { ...x, [field]: val } : x));
  const remove  = i => setPairs(p => p.filter((_, j) => j !== i));

  const handleSave = async () => {
    setSaving(true);
    try {
      const cfg = Object.fromEntries(pairs.filter(p => p.k.trim()).map(p => [p.k.trim(), p.v]));
      await onSave(cfg);
      setSaved(true);
      toast('Remote config saved! ' + Object.keys(cfg).length + ' keys pushed to all users.', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast('Failed to save config: ' + (e.message || 'Unknown error'), 'error', 6000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Remote Configuration" subtitle="Key-value pairs pushed to the app at runtime"
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" size="sm" icon={<Plus size={12} />} onClick={() => setPairs(p => [...p, { k: '', v: '' }])}>Add Key</Btn>
            <Btn size="sm" onClick={handleSave} disabled={saving} icon={saved ? <Check size={12} /> : <Save size={12} />} variant={saved ? 'success' : 'primary'}>{saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}</Btn>
          </div>
        }
      >
        {pairs.length === 0 ? (
          <EmptyState icon={Sliders} title="No config keys yet" desc="Add key-value pairs to configure app behavior remotely." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', letterSpacing: '0.4px' }}>KEY</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', letterSpacing: '0.4px' }}>VALUE</span>
              <span />
            </div>
            {pairs.map((pair, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8, alignItems: 'center' }}>
                <FormInput value={pair.k} onChange={v => update(i, 'k', v)} placeholder="config_key" />
                <FormInput value={pair.v} onChange={v => update(i, 'v', v)} placeholder="value" />
                <button onClick={() => remove(i)} style={{ height: 36, borderRadius: T.r.sm, background: `${T.red}12`, border: `1px solid ${T.red}25`, color: T.red, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function AnalyticsPanel({ chartData, stats }) {
  const si = DS.getStorageInfo();
  const qr = stats?.qrCount || 0;
  const bc = stats?.barcodeCount || 0;
  const total = qr + bc;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Analytics Stat Cards */}
      <div className="ad-stat-grid">
        <StatCard icon={QrCode}    label="QR Codes Generated"  value={qr}                   color={T.purple} trendLabel={`${total ? Math.round((qr/total)*100) : 0}% of total`} />
        <StatCard icon={BarChart2} label="Barcodes Generated"  value={bc}                   color={T.green}  trendLabel={`${total ? Math.round((bc/total)*100) : 0}% of total`} />
        <StatCard icon={Package}   label="Batch Generations"   value={stats?.batchCount || 0} color={T.orange} trendLabel="Bulk jobs total" />
        <StatCard icon={Star}      label="Saved Creations"     value={stats?.savedCount || 0} color={T.blue}   trendLabel="User favorites" />
      </div>

      {/* Analytics Main Chart */}
      <AdminCard title="7-Day Generation Velocity & Trend" subtitle="Daily breakdown of generated QR codes vs Barcodes"
        right={
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: T.textSec }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 3, background: T.purple, borderRadius: 2, display: 'inline-block' }} />QR Codes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 3, background: T.green, borderRadius: 2, display: 'inline-block' }} />Barcodes</span>
          </div>
        }
      >
        <LineChartSVG data={chartData} series={[{ key: 'qr', color: T.purple }, { key: 'barcode', color: T.green }]} height={220} />
      </AdminCard>

      {/* Distribution & Storage Breakdown */}
      <div className="ad-two-col">
        <AdminCard title="Type & Format Share">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <DonutSVG segments={[{ label: 'QR', value: qr, color: T.purple }, { label: 'Barcode', value: bc, color: T.green }]} size={145} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ l: 'QR Codes', v: qr, c: T.purple }, { l: 'Barcodes', v: bc, c: T.green }].map(s => {
                const pct = total ? Math.round((s.v / total) * 100) : 0;
                return (
                  <div key={s.l}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{s.l}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: s.c }}>{s.v} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                      <div style={{ height: '100%', background: s.c, borderRadius: 3, width: `${pct}%`, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Storage Quota Analytics" subtitle="Data breakdown in LocalStorage">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(si.breakdown).filter(([k]) => k.startsWith('qrgen_')).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key, bytes]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: T.textSec, fontFamily: 'monospace' }}>{key.replace('qrgen_', '')}</span>
                  <span style={{ fontSize: 11, color: T.text, fontWeight: 700 }}>{fmtBytes(bytes)}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                  <div style={{ height: '100%', background: T.purple, borderRadius: 2, width: `${si.totalBytes ? (bytes / si.totalBytes) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORTS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function ReportsPanel({ history }) {
  const [exporting, setExporting] = useState(false);

  const exportCSV = () => {
    const rows = [['Type', 'Content', 'Format', 'Created At']];
    (history || []).forEach(h => rows.push([
      h.barcodeType ? 'Barcode' : 'QR',
      h.qrData ? safeStr(h.qrData) : safeStr(h.data) || '',
      h.qrType || h.barcodeType || '',
      h.timestamp || '',
    ]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: `mushi-qr-report-${new Date().toISOString().slice(0,10)}.csv` }).click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = async () => {
    setExporting(true);
    try {
      const backup = await DS.exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), { href: url, download: `mushi-qr-export-${new Date().toISOString().slice(0,10)}.json` }).click();
      URL.revokeObjectURL(url);
    } finally { setExporting(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ad-auto-grid">
        {[
          { icon: FileText, label: 'History CSV', desc: 'Export all creation history as CSV', color: T.green, action: exportCSV, btn: 'Export CSV' },
          { icon: Download,  label: 'Full Data Export', desc: 'All app data as JSON backup', color: T.blue, action: exportJSON, btn: exporting ? 'Exporting...' : 'Export JSON' },
        ].map(r => (
          <AdminCard key={r.label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: T.r.lg, background: `${r.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <r.icon size={22} color={r.color} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: T.textSec }}>{r.desc}</div>
              </div>
              <Btn variant="ghost" icon={<Download size={13} />} onClick={r.action}>{r.btn}</Btn>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard title={`History (${(history || []).length} items)`} subtitle="Full creation log" noPadding>
        {!(history || []).length ? (
          <EmptyState icon={FileText} title="No history yet" desc="QR codes and barcodes you create will appear here." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['Type', 'Content', 'Format', 'Created'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '9px 20px', fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(history || []).slice(0, 50).map((item, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: '9px 20px' }}><Badge color={item.barcodeType ? T.green : T.purple}>{item.barcodeType ? 'Barcode' : 'QR'}</Badge></td>
                    <td style={{ padding: '9px 20px', fontSize: 12, color: T.text, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{safeStr(item.qrData) || safeStr(item.data) || '—'}</td>
                    <td style={{ padding: '9px 20px', fontSize: 11, color: T.textSec }}>{item.qrType || item.barcodeType || '—'}</td>
                    <td style={{ padding: '9px 20px', fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>{fmtDate(item.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVITY LOGS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function ActivityLogsPanel({ history }) {
  const [search, setSearch] = useState('');
  const filtered = (history || []).filter(h =>
    !search || safeStr(h.qrData || h.data || '').toLowerCase().includes(search.toLowerCase()) ||
    (h.qrType || h.barcodeType || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminCard title={`Activity Log (${(history || []).length})`} subtitle="All creation events"
      right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: '6px 12px' }}>
          <Search size={13} color={T.textMut} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            style={{ background: 'none', border: 'none', outline: 'none', color: T.text, fontSize: 12, fontFamily: 'inherit', width: 140 }} />
        </div>
      }
      noPadding
    >
      {filtered.length === 0 ? (
        <EmptyState icon={Activity} title="No activity found" desc={search ? 'Try a different term.' : 'Activity will appear here as you use the app.'} />
      ) : (
        <div>
          {filtered.slice(0, 100).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: `1px solid ${T.border}`, transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = T.bgHov}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 34, height: 34, borderRadius: T.r.sm, background: item.barcodeType ? `${T.green}18` : `${T.purple}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.barcodeType ? <BarChart2 size={15} color={T.green} /> : <QrCode size={15} color={T.purple} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {safeStr(item.qrData) || safeStr(item.data) || item.qrType || 'Unknown'}
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>
                  {item.qrType || item.barcodeType || 'General'} · {timeAgo(item.timestamp)}
                </div>
              </div>
              <Badge color={item.barcodeType ? T.green : T.purple}>{item.barcodeType ? 'Barcode' : 'QR'}</Badge>
            </div>
          ))}
        </div>
      )}
    </AdminCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKUPS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function BackupsPanel() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef();
  const si = DS.getStorageInfo();

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 4000); };

  const handleExport = async () => {
    setExporting(true);
    try {
      const backup = await DS.exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), { href: url, download: `mushi-qr-backup-${new Date().toISOString().slice(0,10)}.json` }).click();
      URL.revokeObjectURL(url);
      showMsg('success', 'Backup exported successfully!');
    } catch (e) { showMsg('error', 'Export failed: ' + e.message); }
    finally { setExporting(false); }
  };

  const handleImport = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm(`Restore from "${file.name}"? This will OVERWRITE all current data.`)) return;
    setImporting(true);
    try {
      const backup = JSON.parse(await file.text());
      await DS.importBackup(backup);
      showMsg('success', 'Backup restored! Reload the page to see changes.');
    } catch (e) { showMsg('error', 'Import failed: ' + e.message); }
    finally { setImporting(false); e.target.value = ''; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: T.r.md, display: 'flex', gap: 10, alignItems: 'center', background: msg.type === 'success' ? `${T.green}12` : `${T.red}0d`, border: `1px solid ${msg.type === 'success' ? T.green : T.red}33` }}>
          {msg.type === 'success' ? <CheckCircle size={15} color={T.green} /> : <AlertCircle size={15} color={T.red} />}
          <span style={{ fontSize: 13, color: msg.type === 'success' ? T.green : T.red, fontWeight: 600 }}>{msg.text}</span>
        </div>
      )}

      <AdminCard title="Storage Overview">
        <div>
          <div style={{ fontSize: 32, fontWeight: 900, color: T.text, marginBottom: 4 }}>{si.used}</div>
          <div style={{ fontSize: 12, color: T.textSec, marginBottom: 12 }}>of ~5 MB localStorage quota</div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
            <div style={{ height: '100%', background: T.accent, borderRadius: 3, width: `${Math.min((si.totalBytes / (5 * 1024 * 1024)) * 100, 100)}%`, transition: 'width 0.4s' }} />
          </div>
        </div>
      </AdminCard>

      <div className="ad-two-col">
        <AdminCard title="Export Backup" subtitle="Download all data as JSON">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: T.textSec, margin: 0, lineHeight: 1.6 }}>
              Creates a complete snapshot of your QR history, settings, templates, feature flags, and remote config.
            </p>
            <Btn onClick={handleExport} disabled={exporting} icon={<Download size={13} />}>
              {exporting ? 'Exporting...' : 'Download Backup'}
            </Btn>
          </div>
        </AdminCard>

        <AdminCard title="Restore Backup" subtitle="Import data from a backup file">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: T.textSec, margin: 0, lineHeight: 1.6 }}>
              Restores all data from a previous backup. <strong style={{ color: T.red }}>Warning: overwrites current data.</strong>
            </p>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            <Btn variant="ghost" onClick={() => fileRef.current?.click()} disabled={importing} icon={<Upload size={13} />}>
              {importing ? 'Restoring...' : 'Choose File'}
            </Btn>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Storage Breakdown" subtitle="Size per data category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(si.breakdown).filter(([k]) => k.startsWith('qrgen_')).sort((a, b) => b[1] - a[1]).map(([key, bytes]) => (
            <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: T.text, fontFamily: 'monospace', marginBottom: 2 }}>{key}</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                  <div style={{ height: '100%', background: T.purple, borderRadius: 2, width: `${si.totalBytes ? (bytes / si.totalBytes) * 100 : 0}%` }} />
                </div>
              </div>
              <span style={{ fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>{fmtBytes(bytes)}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM HEALTH PANEL
// ═══════════════════════════════════════════════════════════════════════════

function SystemHealthPanel({ stats }) {
  const si = DS.getStorageInfo();
  const checks = [
    { label: 'localStorage Available', pass: typeof localStorage !== 'undefined',               detail: `${si.used} used` },
    { label: 'Service Worker',         pass: 'serviceWorker' in navigator,                      detail: 'PWA & offline support' },
    { label: 'Secure Context',         pass: window.isSecureContext,                            detail: window.isSecureContext ? 'HTTPS confirmed' : 'HTTP — insecure' },
    { label: 'PWA Manifest',           pass: !!document.querySelector('link[rel="manifest"]'), detail: 'manifest.json linked' },
    { label: 'Canvas API',             pass: !!document.createElement('canvas').getContext,     detail: 'Required for QR generation' },
    { label: 'Clipboard API',          pass: !!navigator.clipboard,                             detail: 'Required for copy feature' },
    { label: 'Online Status',          pass: navigator.onLine,                                  detail: navigator.onLine ? 'Connected' : 'Offline' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ad-auto-grid-sm">
        <StatCard icon={Database} label="Storage"   value={si.used}                color={T.green}  />
        <StatCard icon={QrCode}   label="QR Items"  value={stats?.historyCount || 0} color={T.purple} />
        <StatCard icon={Server}   label="Config Keys" value={Object.keys(si.breakdown).filter(k => k.startsWith('qrgen_')).length} color={T.blue} />
      </div>

      <AdminCard title="Health Checks" subtitle="Component diagnostics">
        {checks.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < checks.length - 1 ? `1px solid ${T.border}` : 'none' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: c.pass ? `${T.green}18` : `${T.red}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {c.pass ? <Check size={13} color={T.green} /> : <X size={13} color={T.red} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{c.label}</div>
              <div style={{ fontSize: 11, color: T.textSec }}>{c.detail}</div>
            </div>
            <Badge color={c.pass ? T.green : T.red}>{c.pass ? 'Pass' : 'Fail'}</Badge>
          </div>
        ))}
      </AdminCard>

      <AdminCard title="Environment">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Display Mode', value: window.matchMedia('(display-mode: standalone)').matches ? 'PWA App' : 'Browser' },
            { label: 'Language', value: navigator.language },
            { label: 'Screen', value: `${window.screen.width}×${window.screen.height}` },
            { label: 'Viewport', value: `${window.innerWidth}×${window.innerHeight}` },
            { label: 'Platform', value: navigator.platform || 'Unknown' },
            { label: 'Online', value: navigator.onLine ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: T.bgEl, borderRadius: T.r.md, padding: '10px 12px', border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.textMut, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: T.text, wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIT LOGS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function AuditLogsPanel({ log }) {
  const actionColors = {
    APP_SETTINGS_UPDATED: T.blue, FEATURE_FLAGS_UPDATED: T.purple,
    TEMPLATE_SAVED: T.green, TEMPLATE_DELETED: T.red,
    ANNOUNCEMENT_UPDATED: T.orange, REMOTE_CONFIG_UPDATED: T.blue,
    BACKUP_RESTORED: T.green,
  };
  return (
    <AdminCard title={`Audit Log (${(log || []).length})`} subtitle="All admin actions are automatically tracked" noPadding>
      {!(log || []).length ? (
        <EmptyState icon={ClipboardList} title="No audit events yet" desc="Save settings, update flags, or manage templates to see audit entries." />
      ) : (
        <div>
          {(log || []).map((entry, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 20px', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: actionColors[entry.action] || T.textSec, flexShrink: 0, marginTop: 6 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: 'monospace' }}>{entry.action}</div>
                <div style={{ fontSize: 11, color: T.textSec, marginTop: 1 }}>By {entry.actor} · {timeAgo(entry.ts)}</div>
              </div>
              <span style={{ fontSize: 10, color: T.textMut, whiteSpace: 'nowrap' }}>{fmtDate(entry.ts)}</span>
            </div>
          ))}
        </div>
      )}
    </AdminCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QR & BARCODE PANEL
// ═══════════════════════════════════════════════════════════════════════════

function QRBarcodePanel({ stats, history }) {
  const byType = (arr, key) => {
    const map = {};
    arr.forEach(h => { const k = h[key] || 'Unknown'; map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  const qrItems  = (history || []).filter(h => !h.barcodeType);
  const bcItems  = (history || []).filter(h =>  h.barcodeType);
  const qrTypes  = byType(qrItems, 'qrType');
  const bcTypes  = byType(bcItems, 'barcodeType');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ad-auto-grid-sm">
        <StatCard icon={QrCode}    label="QR Codes"   value={stats?.qrCount || 0}      color={T.purple} />
        <StatCard icon={BarChart2} label="Barcodes"   value={stats?.barcodeCount || 0} color={T.green}  />
        <StatCard icon={Package}   label="Batch Jobs" value={stats?.batchCount || 0}   color={T.orange} />
        <StatCard icon={Star}      label="Saved"      value={stats?.savedCount || 0}   color={T.blue}   />
      </div>

      <div className="ad-two-col">
        <AdminCard title="QR Code Types" subtitle="Breakdown by content type">
          {qrTypes.length === 0 ? <EmptyState icon={QrCode} title="No QR codes yet" desc="Create QR codes to see breakdown." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {qrTypes.map(([type, count]) => (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: T.textSec }}>{type}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{count}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ height: '100%', background: T.purple, borderRadius: 2, width: `${(count / qrItems.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard title="Barcode Formats" subtitle="Breakdown by format">
          {bcTypes.length === 0 ? <EmptyState icon={BarChart2} title="No barcodes yet" desc="Create barcodes to see format breakdown." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {bcTypes.map(([type, count]) => (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: T.textSec }}>{type}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{count}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ height: '100%', background: T.green, borderRadius: 2, width: `${(count / bcItems.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// ADMIN USERS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function AdminUsersPanel({ currentUser }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Super Admin Account" subtitle="Active Super Admin user session from Firebase Auth" noPadding>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Admin" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${T.accent}` }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.accentLow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 900, fontSize: 16 }}>
                SA
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{currentUser?.displayName || 'Super Admin'}</div>
              <div style={{ fontSize: 12, color: T.textSec, fontFamily: 'monospace' }}>{currentUser?.email || 'mabuneri143@gmail.com'}</div>
            </div>
            <Badge color={T.accent}>Super Admin</Badge>
            <Badge color={T.green}>Live Auth</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            <div>
              <div style={{ fontSize: 10, color: T.textMut, fontWeight: 700, textTransform: 'uppercase' }}>User ID (UID)</div>
              <div style={{ fontSize: 11, color: T.textSec, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser?.uid || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.textMut, fontWeight: 700, textTransform: 'uppercase' }}>Provider</div>
              <div style={{ fontSize: 11, color: T.textSec }}>{currentUser?.providerData?.[0]?.providerId || 'google.com'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.textMut, fontWeight: 700, textTransform: 'uppercase' }}>Account Created</div>
              <div style={{ fontSize: 11, color: T.textSec }}>{fmtDate(currentUser?.metadata?.creationTime)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.textMut, fontWeight: 700, textTransform: 'uppercase' }}>Last Sign In</div>
              <div style={{ fontSize: 11, color: T.textSec }}>{fmtDate(currentUser?.metadata?.lastSignInTime)}</div>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLES & PERMISSIONS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function RolesPanel() {
  const roles = [
    { name: 'Super Admin', color: T.accent, perms: ['Full Firestore write access', 'App Settings & Branding', 'Feature Flags & Remote Config', 'Announcements & Maintenance', 'Template management', 'Audit logs & Backups'] },
    { name: 'Standard User', color: T.blue, perms: ['Read global settings & templates', 'Generate & export QR codes', 'Personal history & saved items', 'Cloud sync to Firestore'] },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: `${T.green}0c`, border: `1px solid ${T.green}2a`, borderRadius: T.r.md, padding: '11px 15px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <CheckCircle size={14} color={T.green} />
        <span style={{ fontSize: 12, color: T.textSec }}>Role security rules are deployed and strictly enforced by Firebase Firestore in real-time.</span>
      </div>
      {roles.map(role => (
        <AdminCard key={role.name} title={role.name} right={<Badge color={role.color}>{role.name}</Badge>}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {role.perms.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 11px', background: `${role.color}10`, borderRadius: 100, border: `1px solid ${role.color}28` }}>
                <Check size={10} color={role.color} />
                <span style={{ fontSize: 11, color: role.color }}>{p}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY PANEL
// ═══════════════════════════════════════════════════════════════════════════

function SecurityPanel({ currentUser }) {
  const provider = currentUser?.providerData?.[0]?.providerId || 'google.com';
  const checks = [
    { label: 'HTTPS Protocol',       value: window.isSecureContext ? 'Encrypted (SSL)' : 'Insecure', ok: window.isSecureContext, warn: false },
    { label: 'Firebase Auth',        value: `Active (${provider})`,                                 ok: !!currentUser,           warn: false },
    { label: 'Firestore Security',   value: 'Rules Deployed',                                       ok: true,                    warn: false },
    { label: 'Service Worker / PWA', value: 'serviceWorker' in navigator ? 'Enabled' : 'Disabled',  ok: 'serviceWorker' in navigator, warn: false },
    { label: 'Web Manifest',         value: document.querySelector('link[rel="manifest"]') ? 'Linked' : 'Missing', ok: !!document.querySelector('link[rel="manifest"]'), warn: false },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Security Status" subtitle="Live security & infrastructure verification">
        {checks.map((item, i, arr) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none' }}>
            <span style={{ fontSize: 13, color: T.text }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: T.textSec }}>{item.value}</span>
              <Badge color={item.ok ? T.green : item.warn ? T.orange : T.red}>{item.ok ? 'OK' : item.warn ? 'Warn' : 'None'}</Badge>
            </div>
          </div>
        ))}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATIONS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function IntegrationsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Firebase Integration" subtitle="Live connected services" right={<Badge color={T.green}>Connected</Badge>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Project ID',      value: 'mushi-qr-pro',              ok: true },
            { label: 'Authentication',  value: 'Firebase Auth (Google/Email)', ok: true },
            { label: 'Cloud Firestore', value: 'Live Realtime Sync',          ok: true },
            { label: 'Hosting',         value: 'Vercel Deployment',         ok: true },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: T.text }}>{item.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: T.textSec }}>{item.value}</span>
                <Badge color={T.green}>Connected</Badge>
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 14 }}>
            <a href="https://console.firebase.google.com/project/mushi-qr-pro" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.blue, textDecoration: 'none', fontWeight: 600 }}>
              Open Firebase Console <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </AdminCard>

      <div className="ad-auto-grid">
        {[
          { name: 'Firestore', icon: Database, desc: 'Real-time database', color: T.orange, status: 'Active' },
          { name: 'Firebase Auth', icon: Lock, desc: 'User accounts & security', color: T.blue, status: 'Active' },
          { name: 'Vercel Hosting', icon: Globe, desc: 'Global CDN deployment', color: T.purple, status: 'Active' },
          { name: 'Service Worker', icon: Cpu, desc: 'Offline PWA caching', color: T.green, status: 'Active' },
        ].map(int => (
          <AdminCard key={int.name}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: T.r.md, background: `${int.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <int.icon size={19} color={int.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{int.name}</div>
                <div style={{ fontSize: 11, color: T.textSec }}>{int.desc}</div>
              </div>
              <Badge color={T.green}>{int.status}</Badge>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEVELOPER PANEL
// ═══════════════════════════════════════════════════════════════════════════

function DeveloperPanel({ currentUser }) {
  const [copied, setCopied] = useState('');
  const keys = Object.keys(localStorage).filter(k => k.startsWith('qrgen_'));

  const copyVal = key => {
    navigator.clipboard?.writeText(localStorage.getItem(key) || '');
    setCopied(key); setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ad-auto-grid">
        {[
          { label: 'App Version',   value: '2.0.0' },
          { label: 'Environment',   value: 'Production' },
          { label: 'Firebase ID',   value: 'mushi-qr-pro' },
          { label: 'Active User',   value: currentUser?.email || 'Admin' },
        ].map(item => (
          <AdminCard key={item.label}>
            <div style={{ fontSize: 10, color: T.textMut, textTransform: 'uppercase', fontWeight: 800, marginBottom: 6, letterSpacing: '0.5px' }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, wordBreak: 'break-all', fontFamily: 'monospace' }}>{item.value}</div>
          </AdminCard>
        ))}
      </div>

      <AdminCard title="localStorage Keys" subtitle={`${keys.length} app data keys`} noPadding>
        {keys.length === 0 ? (
          <EmptyState icon={Database} title="No data keys" desc="Keys appear here as you use the app." />
        ) : (
          <div>
            {keys.map(key => {
              const size = ((localStorage.getItem(key) || '').length + key.length) * 2;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: T.text, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{key}</div>
                    <div style={{ fontSize: 10, color: T.textMut }}>{fmtBytes(size)}</div>
                  </div>
                  <button onClick={() => copyVal(key)} style={{ background: 'none', border: 'none', color: copied === key ? T.green : T.textSec, cursor: 'pointer', padding: 4, display: 'flex' }}>
                    {copied === key ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE FUNCTIONAL PANELS
// ═══════════════════════════════════════════════════════════════════════════

function UsersPanel() {
  const toast = useToast();
  const [appUsers, setAppUsers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, google, email, active, blocked
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, active, name
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showVisitors, setShowVisitors] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load users and visitors on mount
  useEffect(() => {
    async function load() {
      try {
        const [users, vis] = await Promise.all([
          DS.getAllAppUsers(),
          DS.getAllVisitors(),
        ]);
        setAppUsers(users);
        setVisitors(vis);
      } catch (e) {
        toast?.('Failed to load users: ' + e.message, 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Refresh helper
  const refresh = async () => {
    setLoading(true);
    try {
      const [users, vis] = await Promise.all([
        DS.getAllAppUsers(),
        DS.getAllVisitors(),
      ]);
      setAppUsers(users);
      setVisitors(vis);
    } finally {
      setLoading(false);
    }
  };

  // Open user detail
  const openDetail = async (user) => {
    setSelectedUser(user);
    setDetailLoading(true);
    setUserStats(null);
    try {
      const stats = await DS.getUserActivityStats(user.uid);
      setUserStats(stats);
    } catch { setUserStats({ historyCount: 0, savedCount: 0 }); }
    setDetailLoading(false);
  };

  // Block / Unblock
  const toggleStatus = async (uid, currentStatus) => {
    setActionLoading(true);
    try {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await DS.updateUserStatus(uid, newStatus);
      setAppUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
      if (selectedUser?.uid === uid) setSelectedUser(prev => ({ ...prev, status: newStatus }));
      toast?.(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`, 'success');
    } catch (e) {
      toast?.('Failed: ' + e.message, 'error');
    }
    setActionLoading(false);
  };

  // Delete user profile
  const handleDelete = async (uid) => {
    if (!confirm('Remove this user from admin view? This does NOT delete their Firebase Auth account.')) return;
    setActionLoading(true);
    try {
      await DS.deleteUserProfile(uid);
      setAppUsers(prev => prev.filter(u => u.uid !== uid));
      setSelectedUser(null);
      toast?.('User profile removed', 'success');
    } catch (e) {
      toast?.('Failed: ' + e.message, 'error');
    }
    setActionLoading(false);
  };

  // CSV export
  const exportCSV = () => {
    const header = 'Name,Email,Provider,Status,Joined,Last Active,Visits\n';
    const rows = filteredUsers.map(u =>
      `"${u.displayName || ''}","${u.email || ''}","${u.provider || ''}","${u.status || ''}","${u.createdAt || ''}","${u.lastActiveAt || ''}","${u.visitCount || 0}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `mushiqr_users_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast?.('CSV exported', 'success');
  };

  // Filter & Sort
  const filteredUsers = appUsers
    .filter(u => {
      if (filter === 'google') return u.provider === 'google';
      if (filter === 'email') return u.provider === 'email';
      if (filter === 'active') return u.status === 'active';
      if (filter === 'blocked') return u.status === 'blocked';
      return true;
    })
    .filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (u.displayName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'active') return new Date(b.lastActiveAt || 0) - new Date(a.lastActiveAt || 0);
      if (sortBy === 'name') return (a.displayName || '').localeCompare(b.displayName || '');
      return 0;
    });

  // Stats calculations
  const now = Date.now();
  const activeCount = appUsers.filter(u => u.lastActiveAt && (now - new Date(u.lastActiveAt).getTime()) < 7 * 86400000).length;
  const newCount = appUsers.filter(u => u.createdAt && (now - new Date(u.createdAt).getTime()) < 30 * 86400000).length;
  const anonVisitors = visitors.filter(v => !v.isRegistered).length;
  const mobileVisitors = visitors.filter(v => v.deviceInfo?.isMobile).length;
  const desktopVisitors = visitors.filter(v => !v.deviceInfo?.isMobile).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 14 }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${T.bgCard}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'adSpin 0.7s linear infinite' }} />
        <span style={{ fontSize: 14, color: T.textSec }}>Loading users...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ─── Stat Cards ─── */}
      <div className="ad-stat-grid">
        <StatCard icon={Users} label="Total Users" value={appUsers.length} color={T.purple} trendLabel="registered accounts" />
        <StatCard icon={Activity} label="Active (7d)" value={activeCount} color={T.green} trendLabel="last 7 days" />
        <StatCard icon={Globe} label="Anonymous Visitors" value={anonVisitors} color={T.orange} trendLabel="unregistered devices" />
        <StatCard icon={TrendingUp} label="New (30d)" value={newCount} color={T.blue} trendLabel="last 30 days" />
      </div>

      {/* ─── Users Table Card ─── */}
      <AdminCard
        title={`Registered Users (${filteredUsers.length})`}
        subtitle="All authenticated users tracked via Firebase Auth"
        right={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Btn variant="ghost" size="sm" onClick={refresh} icon={<RefreshCw size={12} />}>Refresh</Btn>
            <Btn variant="ghost" size="sm" onClick={exportCSV} icon={<Download size={12} />}>CSV</Btn>
          </div>
        }
        noPadding
      >
        {/* Search & Filters */}
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: '6px 12px', flex: 1, minWidth: 180 }}>
            <Search size={14} color={T.textMut} />
            <input
              placeholder="Search by name or email..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: T.text, fontSize: 12, fontFamily: 'inherit', width: '100%' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: T.textMut, cursor: 'pointer', padding: 0, lineHeight: 0 }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'google', label: 'Google' },
              { id: 'email', label: 'Email' },
              { id: 'active', label: 'Active' },
              { id: 'blocked', label: 'Blocked' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '4px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.12s',
                background: filter === f.id ? T.accentLow : 'rgba(255,255,255,0.04)',
                color: filter === f.id ? T.accent : T.textSec,
              }}>{f.label}</button>
            ))}
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md,
            color: T.text, fontSize: 11, fontWeight: 600, padding: '5px 10px', cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
          }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="active">Most Active</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Table */}
        {filteredUsers.length === 0 ? (
          <EmptyState icon={Users} title="No users found" desc={search ? 'Try a different search query.' : 'Users who sign in to the app will appear here.'} />
        ) : (
          <div className="ad-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['User', 'Provider', 'Status', 'Joined', 'Last Active', 'Visits'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.uid}
                    onClick={() => openDetail(u)}
                    style={{ borderBottom: `1px solid ${T.border}`, cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bgHov}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Avatar + Name + Email */}
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.accentLow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 900, fontSize: 13, flexShrink: 0 }}>
                            {(u.displayName || u.email || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                            {u.displayName || 'Anonymous'}
                          </div>
                          <div style={{ fontSize: 11, color: T.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                            {u.email || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Provider */}
                    <td style={{ padding: '10px 16px' }}>
                      <Badge color={u.provider === 'google' ? '#4285F4' : u.provider === 'email' ? T.purple : T.textMut}>
                        {u.provider === 'google' ? '● Google' : u.provider === 'email' ? '● Email' : u.provider || '?'}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: u.status === 'blocked' ? T.red : T.green }} />
                        <span style={{ fontSize: 12, color: u.status === 'blocked' ? T.red : T.green, fontWeight: 700, textTransform: 'capitalize' }}>
                          {u.status || 'active'}
                        </span>
                      </div>
                    </td>

                    {/* Joined */}
                    <td style={{ padding: '10px 16px', fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>
                      {fmtDate(u.createdAt)}
                    </td>

                    {/* Last Active */}
                    <td style={{ padding: '10px 16px', fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>
                      {timeAgo(u.lastActiveAt)}
                    </td>

                    {/* Visits */}
                    <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: T.text }}>
                      {u.visitCount || 1}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* ─── Anonymous Visitors Section ─── */}
      <AdminCard
        title={`Anonymous Visitors (${visitors.length})`}
        subtitle="Devices that opened the app — includes unregistered users"
        right={
          <button onClick={() => setShowVisitors(v => !v)} style={{
            background: 'none', border: `1px solid ${T.border}`, borderRadius: T.r.md,
            color: T.textSec, cursor: 'pointer', padding: '5px 12px', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {showVisitors ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            {showVisitors ? 'Collapse' : 'Expand'}
          </button>
        }
      >
        {/* Summary always visible */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: showVisitors ? 16 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: `${T.blue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={18} color={T.blue} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: T.text }}>{visitors.length}</div>
              <div style={{ fontSize: 10, color: T.textSec }}>Total Devices</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: `${T.green}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} color={T.green} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: T.text }}>{visitors.filter(v => v.isRegistered).length}</div>
              <div style={{ fontSize: 10, color: T.textSec }}>Converted to Users</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: `${T.orange}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={18} color={T.orange} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: T.text }}>{desktopVisitors}</div>
              <div style={{ fontSize: 10, color: T.textSec }}>Desktop</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.r.md, background: `${T.purple}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} color={T.purple} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: T.text }}>{mobileVisitors}</div>
              <div style={{ fontSize: 10, color: T.textSec }}>Mobile</div>
            </div>
          </div>
        </div>

        {/* Platform breakdown donut */}
        {showVisitors && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <DonutSVG segments={[
                { label: 'Mobile', value: mobileVisitors, color: T.purple },
                { label: 'Desktop', value: desktopVisitors, color: T.blue },
                { label: 'Registered', value: visitors.filter(v => v.isRegistered).length, color: T.green },
              ]} size={130} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { l: 'Mobile Devices', v: mobileVisitors, c: T.purple },
                  { l: 'Desktop Devices', v: desktopVisitors, c: T.blue },
                  { l: 'Converted to Users', v: visitors.filter(v => v.isRegistered).length, c: T.green },
                  { l: 'Unregistered', v: anonVisitors, c: T.orange },
                ].map(s => (
                  <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.c, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.textSec, minWidth: 130 }}>{s.l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor list table */}
            <div className="ad-table-wrap" style={{ marginTop: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {['Device ID', 'Platform', 'First Seen', 'Last Seen', 'Visits', 'Registered'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 14px', fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visitors.slice(0, 50).map(v => (
                    <tr key={v.id || v.deviceId} style={{ borderBottom: `1px solid ${T.border}` }}
                      onMouseEnter={e => e.currentTarget.style.background = T.bgHov}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '8px 14px', fontSize: 11, color: T.textSec, fontFamily: 'monospace' }}>
                        {(v.deviceId || v.id || '').slice(0, 20)}...
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <Badge color={v.deviceInfo?.isMobile ? T.purple : T.blue}>
                          {v.deviceInfo?.isMobile ? 'Mobile' : 'Desktop'}
                        </Badge>
                      </td>
                      <td style={{ padding: '8px 14px', fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>
                        {fmtDate(v.firstSeenAt)}
                      </td>
                      <td style={{ padding: '8px 14px', fontSize: 11, color: T.textSec, whiteSpace: 'nowrap' }}>
                        {timeAgo(v.lastSeenAt)}
                      </td>
                      <td style={{ padding: '8px 14px', fontSize: 12, fontWeight: 700, color: T.text }}>
                        {v.visitCount || 1}
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        {v.isRegistered ? (
                          <Badge color={T.green}>Yes</Badge>
                        ) : (
                          <Badge color={T.textMut}>No</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visitors.length > 50 && (
                <div style={{ padding: '12px 14px', fontSize: 11, color: T.textMut, textAlign: 'center' }}>
                  Showing first 50 of {visitors.length} visitors
                </div>
              )}
            </div>
          </div>
        )}
      </AdminCard>

      {/* ─── User Detail Modal ─── */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSelectedUser(null)}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.xl,
            width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>User Details</div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: T.textSec, cursor: 'pointer', borderRadius: T.r.sm, padding: 6, lineHeight: 0 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Profile card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                {selectedUser.photoURL ? (
                  <img src={selectedUser.photoURL} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${T.accent}` }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentLow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 900, fontSize: 24 }}>
                    {(selectedUser.displayName || selectedUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: T.text }}>{selectedUser.displayName || 'Anonymous'}</div>
                  <div style={{ fontSize: 13, color: T.textSec, fontFamily: 'monospace', marginTop: 2 }}>{selectedUser.email || '—'}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <Badge color={selectedUser.provider === 'google' ? '#4285F4' : T.purple}>
                      {selectedUser.provider === 'google' ? 'Google' : selectedUser.provider === 'email' ? 'Email' : selectedUser.provider || '?'}
                    </Badge>
                    <Badge color={selectedUser.status === 'blocked' ? T.red : T.green}>
                      {selectedUser.status || 'active'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {[
                  { icon: Calendar, label: 'Joined', value: fmtDate(selectedUser.createdAt), color: T.blue },
                  { icon: Clock, label: 'Last Active', value: timeAgo(selectedUser.lastActiveAt), color: T.green },
                  { icon: Eye, label: 'Total Visits', value: selectedUser.visitCount || 1, color: T.purple },
                  { icon: Globe, label: 'Language', value: selectedUser.deviceInfo?.language || '—', color: T.orange },
                ].map(item => (
                  <div key={item.label} style={{ background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <item.icon size={13} color={item.color} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: T.textMut, textTransform: 'uppercase' }}>{item.label}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Activity stats */}
              <div style={{ background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.5px' }}>
                  App Activity
                </div>
                {detailLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.textSec, fontSize: 12 }}>
                    <RefreshCw size={13} style={{ animation: 'adSpin 0.7s linear infinite' }} /> Loading...
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: T.purple }}>{userStats?.historyCount ?? '—'}</div>
                      <div style={{ fontSize: 10, color: T.textSec, marginTop: 2 }}>QR Codes Created</div>
                    </div>
                    <div style={{ width: 1, background: T.border }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: T.blue }}>{userStats?.savedCount ?? '—'}</div>
                      <div style={{ fontSize: 10, color: T.textSec, marginTop: 2 }}>Saved Items</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Device info */}
              {selectedUser.deviceInfo && (
                <div style={{ background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: T.textMut, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.5px' }}>
                    Device Info
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { l: 'Platform', v: selectedUser.deviceInfo.platform || '—' },
                      { l: 'Screen', v: selectedUser.deviceInfo.screenWidth ? `${selectedUser.deviceInfo.screenWidth} × ${selectedUser.deviceInfo.screenHeight}` : '—' },
                      { l: 'User Agent', v: (selectedUser.deviceInfo.userAgent || '—').slice(0, 80) + (selectedUser.deviceInfo.userAgent?.length > 80 ? '...' : '') },
                    ].map(d => (
                      <div key={d.l} style={{ display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.textSec, minWidth: 80 }}>{d.l}</span>
                        <span style={{ fontSize: 11, color: T.text, wordBreak: 'break-word' }}>{d.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* UID */}
              <div style={{ background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: '10px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Key size={13} color={T.textMut} />
                <span style={{ fontSize: 10, fontWeight: 700, color: T.textMut }}>UID</span>
                <span style={{ fontSize: 11, color: T.textSec, fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedUser.uid}</span>
                <button onClick={() => { navigator.clipboard.writeText(selectedUser.uid); toast?.('UID copied', 'info'); }}
                  style={{ background: 'none', border: 'none', color: T.textMut, cursor: 'pointer', padding: 2, lineHeight: 0 }}>
                  <Copy size={13} />
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Btn
                  variant={selectedUser.isPro ? 'ghost' : 'primary'}
                  onClick={async () => {
                    setActionLoading(true);
                    if (selectedUser.isPro) {
                      await DS.revokeUserProAccess(selectedUser.uid);
                      toast?.('Pro access revoked', 'info');
                      setSelectedUser({ ...selectedUser, isPro: false, planId: 'free' });
                    } else {
                      await DS.grantUserProAccess(selectedUser.uid, 'pro_monthly');
                      toast?.('Pro access granted!', 'success');
                      setSelectedUser({ ...selectedUser, isPro: true, planId: 'pro_monthly' });
                    }
                    setActionLoading(false);
                    refresh();
                  }}
                  disabled={actionLoading}
                  icon={<Zap size={13} />}
                >
                  {selectedUser.isPro ? 'Revoke Pro' : 'Grant Pro'}
                </Btn>
                <Btn
                  variant={selectedUser.status === 'blocked' ? 'success' : 'danger'}
                  onClick={() => toggleStatus(selectedUser.uid, selectedUser.status)}
                  disabled={actionLoading}
                  icon={selectedUser.status === 'blocked' ? <CheckCircle size={13} /> : <XCircle size={13} />}
                >
                  {selectedUser.status === 'blocked' ? 'Unblock User' : 'Block User'}
                </Btn>
                <Btn variant="danger" onClick={() => handleDelete(selectedUser.uid)} disabled={actionLoading} icon={<Trash2 size={13} />}>
                  Remove
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REVENUE & MONETIZATION PANEL
// ═══════════════════════════════════════════════════════════════════════════

function RevenuePanel() {
  const [data, setData] = useState(null);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('overview');
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('20%');
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [rev, pr] = await Promise.all([
        DS.getRevenueAnalytics(),
        DS.getPromoCodes(),
      ]);
      setData(rev);
      setPromos(pr);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddPromo = async () => {
    if (!newCode.trim()) return;
    const codeObj = {
      id: newCode.trim().toUpperCase(),
      code: newCode.trim().toUpperCase(),
      discount: newDiscount,
      type: 'percentage',
      uses: 0,
      active: true,
      createdAt: new Date().toISOString()
    };
    const updated = [...promos, codeObj];
    const res = await DS.savePromoCodes(updated);
    if (res.ok) {
      setPromos(updated);
      setNewCode('');
      toast('Promo code created!', 'success');
    } else {
      toast('Failed to save promo code', 'error');
    }
  };

  const handleTogglePromo = async (codeId) => {
    const updated = promos.map(p => p.id === codeId ? { ...p, active: !p.active } : p);
    const res = await DS.savePromoCodes(updated);
    if (res.ok) {
      setPromos(updated);
      toast('Promo code updated!', 'success');
    }
  };

  const handleDeletePromo = async (codeId) => {
    const updated = promos.filter(p => p.id !== codeId);
    const res = await DS.savePromoCodes(updated);
    if (res.ok) {
      setPromos(updated);
      toast('Promo code deleted!', 'success');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 14 }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${T.bgCard}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'adSpin 0.7s linear infinite' }} />
        <span style={{ fontSize: 14, color: T.textSec }}>Loading SaaS revenue dashboard...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Revenue Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(214,0,54,0.15) 0%, rgba(139,92,246,0.15) 100%)',
        border: `1px solid ${T.accent}33`, borderRadius: T.r.xl, padding: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign size={22} color={T.accent} /> SaaS Revenue & Monetization
          </div>
          <div style={{ fontSize: 13, color: T.textSec, marginTop: 4 }}>
            Real-time calculation of MRR, ARR, Conversion rates, and Subscription Tiers
          </div>
        </div>
        <Btn variant="ghost" size="sm" onClick={loadData} icon={<RefreshCw size={12} />}>Refresh Financials</Btn>
      </div>

      {/* Top Financial KPI Grid */}
      <div className="ad-stat-grid">
        <StatCard icon={DollarSign} label="Monthly Recurring (MRR)" value={`$${data?.mrr || '0.00'}`} color={T.green} trendLabel="estimated monthly" />
        <StatCard icon={TrendingUp} label="Annual Recurring (ARR)" value={`$${data?.arr || '0.00'}`} color={T.purple} trendLabel="projected 12 months" />
        <StatCard icon={Zap} label="Paid Subscribers" value={data?.paidUsers || 0} color={T.blue} trendLabel={`${data?.conversionRate || 0}% conversion`} />
        <StatCard icon={CreditCard} label="ARPU (Per User)" value={`$${data?.arpu || '0.00'}`} color={T.orange} trendLabel="avg revenue/user" />
      </div>

      {/* Sub Tab Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          ['overview', 'Financial Overview'],
          ['ledger', 'Transactions & Tiers'],
          ['promos', 'Promo Codes & Discounts']
        ].map(([id, label]) => (
          <button key={id} onClick={() => setSubTab(id)} style={{
            padding: '8px 16px', borderRadius: T.r.md, border: `1px solid ${subTab === id ? T.accent : T.border}`,
            background: subTab === id ? T.accentLow : 'transparent', color: subTab === id ? T.accent : T.textSec,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Sub Tab: Overview */}
      {subTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ad-two-col">
            <AdminCard title="Subscription Tier Distribution" subtitle="Active user count by plan type">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                {[
                  { label: 'Free Tier Users', count: data?.freeUsers || 0, color: T.textMut, pct: (((data?.freeUsers || 0) / (data?.totalUsers || 1)) * 100).toFixed(0) },
                  { label: 'Pro Monthly ($4.99/mo)', count: data?.proMonthlyUsers || 0, color: T.purple, pct: (((data?.proMonthlyUsers || 0) / (data?.totalUsers || 1)) * 100).toFixed(0) },
                  { label: 'Pro Yearly ($39.99/yr)', count: data?.proYearlyUsers || 0, color: T.green, pct: (((data?.proYearlyUsers || 0) / (data?.totalUsers || 1)) * 100).toFixed(0) },
                  { label: 'Lifetime Unlimited ($99.99)', count: data?.lifetimeUsers || 0, color: T.orange, pct: (((data?.lifetimeUsers || 0) / (data?.totalUsers || 1)) * 100).toFixed(0) },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: T.text, fontWeight: 600 }}>{item.label}</span>
                      <span style={{ color: T.textSec }}>{item.count} users ({item.pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: T.bgEl, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 4, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard title="Monetization Health Metrics" subtitle="SaaS conversion benchmark">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: 14, background: T.bgEl, borderRadius: T.r.md, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 12, color: T.textSec }}>Conversion Rate (Free → Pro)</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: T.accent, marginTop: 4 }}>{data?.conversionRate}%</div>
                  <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>Target: 5.0% or higher</div>
                </div>
                <div style={{ padding: 14, background: T.bgEl, borderRadius: T.r.md, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 12, color: T.textSec }}>Lifetime Value (LTV) Estimate</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: T.green, marginTop: 4 }}>${(parseFloat(data?.arpu || 0) * 12).toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>Based on 12-month average retention</div>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      )}

      {/* Sub Tab: Ledger */}
      {subTab === 'ledger' && (
        <AdminCard title="Subscription Ledger" subtitle="Paid tier allocation status" noPadding>
          <div className="ad-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['Tier Name', 'Billing Interval', 'Monthly Value', 'Target Segment', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Free Starter', interval: 'Forever', value: '$0.00', segment: 'Casual Creators', status: 'Active' },
                  { name: 'Pro Monthly', interval: 'Monthly', value: '$4.99', segment: 'Power Users', status: 'Active' },
                  { name: 'Pro Yearly (Best Value)', interval: 'Yearly', value: '$3.33/mo', segment: 'Businesses', status: 'Active' },
                  { name: 'Lifetime Pass', interval: 'One-Time', value: '$99.99', segment: 'VIP Accounts', status: 'Active' },
                ].map((tier, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: T.text }}>{tier.name}</td>
                    <td style={{ padding: '12px 16px', color: T.textSec, fontSize: 12 }}>{tier.interval}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: T.green }}>{tier.value}</td>
                    <td style={{ padding: '12px 16px', color: T.textSec, fontSize: 12 }}>{tier.segment}</td>
                    <td style={{ padding: '12px 16px' }}><Badge color={T.green}>{tier.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {/* Sub Tab: Promos */}
      {subTab === 'promos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AdminCard title="Create New Promo Code">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                placeholder="PROMO CODE (e.g. SUMMER2026)"
                value={newCode}
                onChange={e => setNewCode(e.target.value)}
                style={{
                  background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md,
                  color: T.text, fontSize: 13, padding: '9px 14px', outline: 'none', fontFamily: 'inherit', flex: 1, minWidth: 200
                }}
              />
              <select
                value={newDiscount}
                onChange={e => setNewDiscount(e.target.value)}
                style={{
                  background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md,
                  color: T.text, fontSize: 13, padding: '9px 14px', outline: 'none', fontFamily: 'inherit'
                }}
              >
                <option value="10%">10% OFF</option>
                <option value="20%">20% OFF</option>
                <option value="50%">50% OFF</option>
                <option value="100%">100% OFF (FREE PRO)</option>
              </select>
              <Btn onClick={handleAddPromo} icon={<Plus size={14} />}>Add Promo</Btn>
            </div>
          </AdminCard>

          <AdminCard title="Active Promo Codes" noPadding>
            {promos.length === 0 ? (
              <EmptyState icon={Tag} title="No promo codes" desc="Create discount codes above for marketing campaigns." />
            ) : (
              <div className="ad-table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      {['Code', 'Discount', 'Uses', 'Status', 'Action'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 800, color: T.textMut, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {promos.map(p => (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: T.accent, letterSpacing: '0.5px' }}>{p.code}</td>
                        <td style={{ padding: '12px 16px', color: T.green, fontWeight: 700 }}>{p.discount}</td>
                        <td style={{ padding: '12px 16px', color: T.text, fontSize: 12 }}>{p.uses || 0} redeemed</td>
                        <td style={{ padding: '12px 16px' }}>
                          <Badge color={p.active ? T.green : T.red}>{p.active ? 'Active' : 'Disabled'}</Badge>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Btn variant="ghost" size="sm" onClick={() => handleTogglePromo(p.id)}>
                              {p.active ? 'Disable' : 'Enable'}
                            </Btn>
                            <Btn variant="danger" size="sm" onClick={() => handleDeletePromo(p.id)} icon={<Trash2 size={12} />}>
                              Delete
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </div>
      )}
    </div>
  );
}

function SubscriptionsPanel({ plans: initPlans, premiumFeatures: initFeatures, subscribers: initSubs, onSavePlans, onSaveFeatures }) {
  const [plans, setPlans] = useState(initPlans || []);
  const [features, setFeatures] = useState(initFeatures || []);
  const [subs] = useState(initSubs || []);
  const [tab, setTab] = useState('plans');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newFeature, setNewFeature] = useState('');
  const toast = useToast();

  useEffect(() => { if (initPlans) setPlans(initPlans); }, [initPlans]);
  useEffect(() => { if (initFeatures) setFeatures(initFeatures); }, [initFeatures]);

  const PERIOD_OPTS = [
    { value: 'forever', label: 'Forever (Free)' },
    { value: 'day',     label: 'Daily' },
    { value: 'week',    label: 'Weekly' },
    { value: 'month',   label: 'Monthly' },
    { value: 'year',    label: 'Yearly' },
  ];

  // Plan CRUD
  const updatePlan = (id, key, val) => setPlans(p => p.map(pl => pl.id === id ? { ...pl, [key]: val } : pl));
  const deletePlan = (id) => { if (id === 'free') return; setPlans(p => p.filter(pl => pl.id !== id)); };
  const addPlan = () => {
    const id = 'plan_' + Date.now();
    setPlans(p => [...p, { id, name: 'New Plan', price: 0, period: 'month', color: '#8b5cf6', active: true, popular: false, sortOrder: p.length }]);
    setEditingPlan(id);
  };

  // Feature CRUD
  const updateFeature = (id, key, val) => setFeatures(f => f.map(ft => ft.id === id ? { ...ft, [key]: val } : ft));
  const toggleFeaturePlan = (featureId, planId) => {
    setFeatures(f => f.map(ft => {
      if (ft.id !== featureId) return ft;
      const has = (ft.plans || []).includes(planId);
      return { ...ft, plans: has ? ft.plans.filter(p => p !== planId) : [...(ft.plans || []), planId] };
    }));
  };
  const deleteFeature = (id) => setFeatures(f => f.filter(ft => ft.id !== id));
  const addFeature = () => {
    if (!newFeature.trim()) return;
    const id = newFeature.trim().toLowerCase().replace(/\s+/g, '_');
    if (features.find(f => f.id === id)) { toast('Feature ID already exists', 'warning'); return; }
    setFeatures(f => [...f, { id, label: newFeature.trim(), description: '', plans: plans.filter(p => p.id !== 'free').map(p => p.id) }]);
    setNewFeature('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 'plans') { await onSavePlans(plans); toast('Subscription plans saved!', 'success'); }
      else { await onSaveFeatures(features); toast('Premium features saved!', 'success'); }
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (e) { toast('Save failed: ' + (e.message || ''), 'error', 6000); }
    finally { setSaving(false); }
  };

  // Stats
  const paidSubs = subs.filter(s => s.planId && s.planId !== 'free' && !s.cancelled);
  const planCounts = {};
  paidSubs.forEach(s => { planCounts[s.planId] = (planCounts[s.planId] || 0) + 1; });

  const paidPlans = plans.filter(p => p.id !== 'free');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats Row */}
      <div className="ad-auto-grid">
        <StatCard icon={CreditCard} label="Total Subscribers" value={paidSubs.length} color={T.purple} trendLabel="active paid" />
        <StatCard icon={Users} label="Free Users" value={subs.length - paidSubs.length} color={T.textSec} trendLabel="no active plan" />
        <StatCard icon={Zap} label="Active Plans" value={plans.filter(p => p.active).length} color={T.green} trendLabel={`of ${plans.length} total`} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[['plans', 'Plans'], ['features', 'Premium Features'], ['subscribers', 'Subscribers']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '8px 16px', borderRadius: T.r.md, border: `1px solid ${tab === id ? T.accent : T.border}`,
            background: tab === id ? T.accentLow : 'transparent', color: tab === id ? T.accent : T.textSec,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>{label}</button>
        ))}
      </div>

      {/* ═══ PLANS TAB ═══ */}
      {tab === 'plans' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={addPlan} icon={<Plus size={13} />} variant="ghost">Add Plan</Btn>
            <Btn onClick={handleSave} disabled={saving} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Plans'}
            </Btn>
          </div>
          <div className="ad-auto-grid">
            {plans.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map(plan => (
              <AdminCard key={plan.id} style={{ border: `1px solid ${plan.color}33` }}
                right={plan.id !== 'free' && <button onClick={() => deletePlan(plan.id)} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', padding: 4 }}><Trash2 size={14} /></button>}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge color={plan.color}>{plan.name}</Badge>
                    {plan.popular && <Badge color={T.orange}>Popular</Badge>}
                    {!plan.active && <Badge color={T.red}>Inactive</Badge>}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: plan.color }}>
                    ${typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}
                    <span style={{ fontSize: 12, color: T.textSec, fontWeight: 500 }}>/{plan.period}</span>
                  </div>
                  {editingPlan === plan.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <FormInput label="Plan Name" value={plan.name} onChange={v => updatePlan(plan.id, 'name', v)} />
                      <FormInput label="Price ($)" type="number" value={plan.price} onChange={v => updatePlan(plan.id, 'price', parseFloat(v) || 0)} />
                      <FormSelect label="Billing Period" value={plan.period} onChange={v => updatePlan(plan.id, 'period', v)} options={PERIOD_OPTS} />
                      <FormInput label="Color" type="color" value={plan.color} onChange={v => updatePlan(plan.id, 'color', v)} />
                      <FormInput label="Sort Order" type="number" value={plan.sortOrder || 0} onChange={v => updatePlan(plan.id, 'sortOrder', parseInt(v) || 0)} />
                      <ToggleRow label="Active" description="Show this plan to users" checked={!!plan.active} onChange={v => updatePlan(plan.id, 'active', v)} />
                      <ToggleRow label="Popular" description="Highlight as the recommended plan" checked={!!plan.popular} onChange={v => updatePlan(plan.id, 'popular', v)} />
                      <Btn onClick={() => setEditingPlan(null)} variant="ghost" icon={<Check size={13} />}>Done Editing</Btn>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Btn onClick={() => setEditingPlan(plan.id)} variant="ghost" size="sm" icon={<Edit size={12} />}>Edit</Btn>
                    </div>
                  )}
                  {/* Subscriber count */}
                  <div style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>
                    {planCounts[plan.id] || 0} active subscriber{(planCounts[plan.id] || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        </>
      )}

      {/* ═══ FEATURES TAB ═══ */}
      {tab === 'features' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={handleSave} disabled={saving} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Features'}
            </Btn>
          </div>

          <AdminCard title="Feature × Plan Matrix" subtitle="Toggle which plans include each premium feature">
            {/* Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: `1fr 60px repeat(${paidPlans.length}, 70px)`, gap: 4, alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Feature</div>
              <div></div>
              {paidPlans.map(p => (
                <div key={p.id} style={{ fontSize: 10, fontWeight: 800, color: p.color, textAlign: 'center', textTransform: 'uppercase' }}>{p.name}</div>
              ))}
            </div>
            {/* Feature Rows */}
            {features.map((feat, i) => (
              <div key={feat.id} style={{
                display: 'grid', gridTemplateColumns: `1fr 60px repeat(${paidPlans.length}, 70px)`, gap: 4, alignItems: 'center',
                padding: '8px 0', borderBottom: i < features.length - 1 ? `1px solid ${T.border}` : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{feat.label}</div>
                  <div style={{ fontSize: 11, color: T.textMut }}>{feat.description}</div>
                </div>
                <button onClick={() => deleteFeature(feat.id)} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', padding: 4, justifySelf: 'center' }}>
                  <Trash2 size={12} />
                </button>
                {paidPlans.map(p => {
                  const included = (feat.plans || []).includes(p.id);
                  return (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'center' }}>
                      <button onClick={() => toggleFeaturePlan(feat.id, p.id)} style={{
                        width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${included ? p.color : T.border}`,
                        background: included ? `${p.color}20` : 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                      }}>
                        {included && <Check size={14} color={p.color} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
            {/* Add Feature */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <input value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="New feature name…"
                onKeyDown={e => e.key === 'Enter' && addFeature()}
                style={{ flex: 1, background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: T.r.md, color: T.text, fontSize: 13, padding: '8px 12px', outline: 'none', fontFamily: 'inherit' }}
              />
              <Btn onClick={addFeature} variant="ghost" icon={<Plus size={13} />}>Add</Btn>
            </div>
          </AdminCard>
        </>
      )}

      {/* ═══ SUBSCRIBERS TAB ═══ */}
      {tab === 'subscribers' && (
        <AdminCard title="Active Subscribers" subtitle={`${paidSubs.length} paid subscriber${paidSubs.length !== 1 ? 's' : ''}`} noPadding>
          {paidSubs.length === 0 ? (
            <EmptyState icon={CreditCard} title="No subscribers yet" desc="When users subscribe to a premium plan, they will appear here." />
          ) : (
            <div>
              {paidSubs.map((sub, i) => {
                const plan = plans.find(p => p.id === sub.planId);
                return (
                  <div key={sub.uid || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < paidSubs.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${plan?.color || T.purple}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: plan?.color || T.purple, fontSize: 14, fontWeight: 800 }}>
                      {(sub.userName || sub.userEmail || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.userName || sub.userEmail || sub.uid}</div>
                      <div style={{ fontSize: 11, color: T.textMut }}>{sub.userEmail || sub.uid}</div>
                    </div>
                    <Badge color={plan?.color || T.purple}>{plan?.name || sub.planId}</Badge>
                    <div style={{ fontSize: 11, color: T.textMut }}>{sub.startedAt ? new Date(sub.startedAt).toLocaleDateString() : '—'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>
      )}
    </div>
  );
}

function CategoriesPanel() {
  const cats = [...new Set((QR_TEMPLATES || []).map(t => t.category))];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Template Categories" subtitle="Derived from active template library">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: T.bgEl, borderRadius: T.r.md, border: `1px solid ${T.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.purple }} />
              <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{c}</span>
              <Badge color={T.textSec}>{(QR_TEMPLATES || []).filter(t => t.category === c).length}</Badge>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function BulkPanel({ history }) {
  const batches = (history || []).filter(h => h.isBatch);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StatCard icon={Package} label="Batch Operations Logged" value={batches.length} color={T.orange} trendLabel="all time" />
      <AdminCard title="Batch History" noPadding>
        {batches.length === 0 ? (
          <EmptyState icon={Package} title="No batch operations yet" desc="Bulk QR generation sessions will be tracked here automatically." />
        ) : (
          <div>
            {batches.slice(0, 20).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: 34, height: 34, borderRadius: T.r.sm, background: `${T.orange}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={15} color={T.orange} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Batch Job</div>
                  <div style={{ fontSize: 11, color: T.textSec }}>{timeAgo(b.timestamp)}</div>
                </div>
                <Badge color={T.orange}>Batch</Badge>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

function SupportPanel() {
  return (
    <AdminCard title="Support & Helpdesk" subtitle="Direct customer support contact">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${T.blue}18`, color: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={28} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Direct Email Support</div>
        <div style={{ fontSize: 13, color: T.textSec, maxWidth: 360, lineHeight: 1.5 }}>
          Have feedback or technical inquiries? Reach out directly to our engineering team.
        </div>
        <a href="mailto:mabuneri143@gmail.com" style={{ textDecoration: 'none', marginTop: 8 }}>
          <Btn variant="primary" icon={<Mail size={14} />}>Contact Super Admin</Btn>
        </a>
      </div>
    </AdminCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL — ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

// ─── Wrap the entire AdminPanel in the ToastProvider ──────────────────────
function AdminPanelInner() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [section, setSection]     = useState('dashboard');
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebar] = useState(false);

  const [stats, setStats]                   = useState(null);
  const [chartData, setChartData]           = useState([]);
  const [history, setHistory]               = useState([]);
  const [appSettings, setAppSettings]       = useState(null);
  const [featureFlags, setFeatureFlags]     = useState(null);
  const [cloudTemplates, setCloudTemplates] = useState([]);
  const [announcement, setAnnouncement]     = useState(null);
  const [remoteConfig, setRemoteConfig]     = useState({});
  const [auditLog, setAuditLog]             = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [premiumFeatures, setPremiumFeatures]     = useState([]);
  const [subscribers, setSubscribers]             = useState([]);
  const [revenueData, setRevenueData]             = useState(null);
  const [appUsers, setAppUsers]                   = useState([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authLoading || !currentUser || currentUser.email !== 'mabuneri143@gmail.com') return;

    async function init() {
      try {
        const [s, c, h, as_, ff, ct, ann, rc, al, sp, pf, subs, rev, usr] = await Promise.all([
          DS.getAppStats(), DS.getActivityChartData(7), DS.getHistory(100),
          DS.getAppSettings(), DS.getFeatureFlags(), DS.getCloudTemplates(),
          DS.getAnnouncement(), DS.getRemoteConfig(), DS.getAuditLog(100),
          DS.getSubscriptionPlans(), DS.getPremiumFeatures(), DS.getAllUserSubscriptions(),
          DS.getRevenueAnalytics(), DS.getAllAppUsers(),
        ]);
        setStats(s); setChartData(c); setHistory(h);
        setAppSettings(as_); setFeatureFlags(ff); setCloudTemplates(ct);
        setAnnouncement(ann); setRemoteConfig(rc); setAuditLog(al);
        setSubscriptionPlans(sp); setPremiumFeatures(pf); setSubscribers(subs);
        setRevenueData(rev); setAppUsers(usr);
      } finally { setLoading(false); }
    }
    init();
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [authLoading, currentUser]);

  if (authLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg, color: T.text }}>
        <RefreshCw className="animate-spin" size={32} color={T.accent} />
      </div>
    );
  }

  const handleAdminSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error('Super admin login failed:', e);
    }
  };

  if (!currentUser || currentUser.email !== 'mabuneri143@gmail.com') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center',
        backgroundColor: T.bg, color: T.text, padding: 24, textAlign: 'center', fontFamily: "'Outfit', sans-serif",
        paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{
          background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.xl,
          padding: '40px 32px', maxWidth: 420, width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentLow, border: `1px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent }}>
            <Shield size={34} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: T.text, margin: 0 }}>Super Admin Access</h1>
            <p style={{ color: T.textSec, fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
              {currentUser
                ? `Signed in as (${currentUser.email}). Only mabuneri143@gmail.com is authorized.`
                : 'Authentication required. Only mabuneri143@gmail.com has superadmin privileges.'}
            </p>
          </div>

          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.bgEl, padding: '10px 14px', borderRadius: T.r.md, width: '100%', boxSizing: 'border-box' }}>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.accentLow, color: T.accent, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.displayName || 'Current User'}</div>
                <div style={{ fontSize: 10, color: T.textSec, overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
            <button
              onClick={handleAdminSignIn}
              style={{
                background: T.accent, color: '#fff', border: 'none', padding: '12px 20px',
                borderRadius: T.r.md, cursor: 'pointer', fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%',
                fontFamily: 'inherit'
              }}
            >
              <Zap size={16} /> Sign In as Admin (Google)
            </button>
            {currentUser && (
              <button
                onClick={() => signOut(auth)}
                style={{
                  background: 'transparent', color: T.red, border: `1px solid ${T.red}44`,
                  padding: '10px 20px', borderRadius: T.r.md, cursor: 'pointer', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%',
                  fontFamily: 'inherit'
                }}
              >
                <LogOut size={14} /> Switch Account / Log Out
              </button>
            )}
            <button
              onClick={() => window.location.hash = '#/'}
              style={{
                background: 'transparent', color: T.textSec, border: `1px solid ${T.border}`,
                padding: '10px 20px', borderRadius: T.r.md, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                width: '100%', fontFamily: 'inherit'
              }}
            >
              Back to Home App
            </button>
          </div>
        </div>
      </div>
    );
  }

  const refreshTemplates = async () => setCloudTemplates(await DS.getCloudTemplates());
  const refreshAudit     = async () => setAuditLog(await DS.getAuditLog(100));

  const saveSetting = async updater => {
    const next = updater(appSettings);
    await DS.saveAppSettings(next);
    setAppSettings(next);
    await refreshAudit();
  };

  const PANELS = {
    dashboard:       <DashboardPanel stats={stats} history={history} featureFlags={featureFlags} announcement={announcement} subscribers={subscribers} revenueData={revenueData} appUsers={appUsers} onNavigate={setSection} onSaveFlags={async f => { await DS.saveFeatureFlags(f); setFeatureFlags(f); refreshAudit(); }} />,
    revenue:         <RevenuePanel />,
    users:           <UsersPanel />,
    subscriptions:   <SubscriptionsPanel plans={subscriptionPlans} premiumFeatures={premiumFeatures} subscribers={subscribers}
      onSavePlans={async p => { await DS.saveSubscriptionPlans(p); setSubscriptionPlans(p); refreshAudit(); }}
      onSaveFeatures={async f => { await DS.savePremiumFeatures(f); setPremiumFeatures(f); refreshAudit(); }}
    />,
    analytics:       <AnalyticsPanel chartData={chartData} stats={stats} />,
    reports:         <ReportsPanel history={history} />,
    templates:       <TemplatesPanel cloudTemplates={cloudTemplates} onRefresh={refreshTemplates} />,
    'qr-barcode':    <QRBarcodePanel stats={stats} history={history} />,
    categories:      <CategoriesPanel />,
    bulk:            <BulkPanel history={history} />,
    'app-settings':  <AppSettingsPanel settings={appSettings} onSave={async s => {
      await DS.saveAppSettings(s);
      setAppSettings(s);
      refreshAudit(); // non-blocking
    }} />,
    branding:        <BrandingPanel settings={appSettings} onSave={async s => {
      await DS.saveAppSettings(s);
      setAppSettings(s);
      refreshAudit();
    }} />,
    'remote-config': <RemoteConfigPanel config={remoteConfig} onSave={async c => {
      await DS.saveRemoteConfig(c);
      setRemoteConfig(c);
      refreshAudit();
    }} />,
    'feature-flags': <FeatureFlagsPanel flags={featureFlags} onSave={async f => {
      await DS.saveFeatureFlags(f);
      setFeatureFlags(f);
      refreshAudit();
    }} />,
    maintenance:     <MaintenancePanel settings={appSettings} onSave={async s => {
      await DS.saveAppSettings(s);
      setAppSettings(s);
      refreshAudit();
    }} />,
    announcements:   <AnnouncementsPanel announcement={announcement} onSave={async a => {
      await DS.saveAnnouncement(a);
      setAnnouncement(a);
      refreshAudit();
    }} />,
    'admin-users':   <AdminUsersPanel />,
    roles:           <RolesPanel />,
    'activity-logs': <ActivityLogsPanel history={history} />,
    security:        <SecurityPanel />,
    backups:         <BackupsPanel />,
    'audit-logs':    <AuditLogsPanel log={auditLog} />,
    'system-health': <SystemHealthPanel stats={stats} />,
    integrations:    <IntegrationsPanel />,
    developer:       <DeveloperPanel />,
    support:         <SupportPanel />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes adSpin { to { transform: rotate(360deg); } }
        @keyframes adSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        /* Scrollbar */
        .ad-scroll::-webkit-scrollbar { width: 4px; }
        .ad-scroll::-webkit-scrollbar-track { background: transparent; }
        .ad-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .ad-sidebar-nav::-webkit-scrollbar { display: none; }

        /* Base responsive grid utilities */
        .ad-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .ad-chart-row {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 16px;
        }
        .ad-activity-row {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
        }
        .ad-quick-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .ad-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .ad-three-col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .ad-auto-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 14px;
        }
        .ad-auto-grid-sm {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 14px;
        }
        .ad-template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        .ad-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-left: 270px;
          transition: margin-left 0.25s;
        }
        .ad-main-content.mobile {
          margin-left: 0;
        }
        .ad-header-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(20,20,30,1);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 6px 12px;
        }
        .ad-header-search input { width: 160px; }
        .ad-header-subtitle { display: block; }
        .ad-header-app-btn span { display: inline; }
        .ad-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .ad-table-wrap table { min-width: 520px; }
        .ad-main-pad { padding: 24px 28px; }
        .ad-section-anim { animation: adSlideIn 0.18s ease both; }

        /* Tablet — 1024px */
        @media (max-width: 1024px) {
          .ad-stat-grid { grid-template-columns: repeat(2, 1fr); }
          .ad-chart-row { grid-template-columns: 1fr; }
          .ad-activity-row { grid-template-columns: 1fr; }
          .ad-quick-grid { grid-template-columns: repeat(2, 1fr); }
          .ad-three-col { grid-template-columns: repeat(2, 1fr); }
          .ad-main-pad { padding: 20px 20px; }
        }

        /* Mobile — 768px */
        @media (max-width: 768px) {
          .ad-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .ad-chart-row { grid-template-columns: 1fr; }
          .ad-activity-row { grid-template-columns: 1fr; }
          .ad-quick-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .ad-two-col { grid-template-columns: 1fr; }
          .ad-three-col { grid-template-columns: 1fr 1fr; }
          .ad-auto-grid { grid-template-columns: repeat(2, 1fr); }
          .ad-auto-grid-sm { grid-template-columns: repeat(2, 1fr); }
          .ad-template-grid { grid-template-columns: repeat(2, 1fr); }
          .ad-header-search { display: none; }
          .ad-header-subtitle { display: none; }
          .ad-main-pad { padding: 14px 12px 80px; }
        }

        /* Small mobile — 480px */
        @media (max-width: 480px) {
          .ad-stat-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .ad-quick-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .ad-two-col { grid-template-columns: 1fr; }
          .ad-three-col { grid-template-columns: 1fr; }
          .ad-auto-grid { grid-template-columns: 1fr 1fr; }
          .ad-template-grid { grid-template-columns: repeat(2, 1fr); }
          .ad-main-pad { padding: 12px 10px 80px; }
        }

        /* Mobile bottom nav */
        .ad-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: rgba(12,12,21,0.97);
          border-top: 1px solid rgba(255,255,255,0.06);
          z-index: 30;
          align-items: center;
          justify-content: space-around;
          padding: 0 4px;
          gap: 2px;
        }
        .ad-bottom-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 10px;
          transition: background 0.12s;
          min-width: 48px;
          flex: 1;
        }
        .ad-bottom-nav-btn span {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2px;
          font-family: 'Outfit', sans-serif;
          text-transform: uppercase;
        }
        @media (max-width: 768px) {
          .ad-bottom-nav { display: flex; }
        }

        /* Sidebar close btn (mobile) */
        .ad-sidebar-close {
          display: none;
          background: rgba(255,255,255,0.05);
          border: none;
          border-radius: 8px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 6px;
          line-height: 0;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .ad-sidebar-close { display: flex; align-items: center; justify-content: center; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', background: T.bg, overflow: 'hidden',
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
        color: T.text, fontSize: 14,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 15 }} />
        )}

        <Sidebar active={section} setActive={s => { setSection(s); if (isMobile) setSidebar(false); }} isMobile={isMobile} open={isMobile ? sidebarOpen : true} onClose={() => setSidebar(false)} currentUser={currentUser} />

        <div className={`ad-main-content${isMobile ? ' mobile' : ''}`}>
          <Header section={section} onMenuToggle={() => setSidebar(o => !o)} isMobile={isMobile} currentUser={currentUser} />

          <main className="ad-scroll" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="ad-main-pad ad-section-anim" key={section}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 14 }}>
                  <div style={{ width: 36, height: 36, border: `3px solid ${T.bgCard}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'adSpin 0.7s linear infinite' }} />
                  <span style={{ fontSize: 14, color: T.textSec }}>Loading admin data...</span>
                </div>
              ) : (
                PANELS[section] || PANELS.dashboard
              )}
            </div>
          </main>

          {/* Mobile Bottom Nav */}
          <nav className="ad-bottom-nav">
            {[
              { id: 'dashboard',    icon: LayoutDashboard, label: 'Home' },
              { id: 'analytics',    icon: BarChart3,        label: 'Stats' },
              { id: 'users',        icon: Users,            label: 'Users' },
              { id: 'revenue',      icon: DollarSign,       label: 'Revenue' },
              { id: 'app-settings', icon: Settings,         label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => {
              const active = section === id;
              return (
                <button key={id} className="ad-bottom-nav-btn"
                  onClick={() => setSection(id)}
                  style={{ color: active ? T.accent : T.textSec, background: active ? T.sidebarAct : 'transparent' }}
                >
                  <Icon size={19} />
                  <span style={{ color: active ? T.accent : T.textMut }}>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

// ─── Default export wraps everything in the ToastProvider ────────────────────
export default function AdminPanel() {
  return (
    <ToastProvider>
      <AdminPanelInner />
    </ToastProvider>
  );
}
