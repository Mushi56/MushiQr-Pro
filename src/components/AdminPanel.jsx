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
} from 'lucide-react';

import * as DS from '../services/adminDataService';
import { QR_TEMPLATES } from '../utils/qrTemplates';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
  dashboard:'Dashboard', users:'Users', subscriptions:'Subscriptions',
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
    { id: 'subscriptions', icon: CreditCard,      label: 'Subscriptions' },
    { id: 'analytics',     icon: BarChart3,       label: 'Analytics' },
    { id: 'reports',       icon: FileText,        label: 'Reports' },
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
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

function Sidebar({ active, setActive, isMobile, open, onClose }) {
  return (
    <aside style={{
      width: 240, background: T.sidebar, borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: open ? 0 : -260, top: 0, bottom: 0,
      zIndex: 25, transition: 'left 0.27s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: isMobile && open ? '4px 0 32px rgba(0,0,0,0.7)' : 'none',
    }}>
      {/* Close btn (mobile only) */}
      <button className="ad-sidebar-close" onClick={onClose}>
        <X size={16} />
      </button>

      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.text, lineHeight: 1.2 }}>Mushi QR Pro</div>
          <div style={{ fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: '0.5px' }}>⬡ SUPER ADMIN</div>
        </div>
      </div>

      {/* Nav */}
      <div className="ad-sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.textMut, letterSpacing: '0.8px', textTransform: 'uppercase', padding: '8px 12px 4px' }}>
              {section}
            </div>
            {items.map(({ id, icon: Icon, label }) => {
              const isActive = active === id;
              return (
                <button key={id} onClick={() => setActive(id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 12px', borderRadius: T.r.md, border: 'none', cursor: 'pointer',
                  background: isActive ? T.sidebarAct : 'transparent',
                  color: isActive ? T.accent : T.textSec,
                  fontFamily: 'inherit', fontSize: 13, fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.12s', textAlign: 'left', position: 'relative',
                }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = T.sidebarHov; e.currentTarget.style.color = T.text; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textSec; } }}
                >
                  {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, background: T.accent, borderRadius: '0 3px 3px 0' }} />}
                  <Icon size={15} />
                  <span style={{ flex: 1 }}>{label}</span>
                </button>
              );
            })}
          </div>
        ))}
        <div style={{ height: 20 }} />
      </div>

      {/* User profile */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: T.r.sm, background: T.accentLow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 900, fontSize: 12, flexShrink: 0 }}>
          SA
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Super Admin</div>
          <div style={{ fontSize: 10, color: T.textSec }}>Local Mode</div>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════

function Header({ section, onMenuToggle, isMobile }) {
  return (
    <div style={{
      height: 58, background: T.bgEl, borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
      position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
    }}>
      <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', color: T.textSec, cursor: 'pointer', padding: 6, borderRadius: T.r.sm, display: 'flex', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = T.text}
        onMouseLeave={e => e.currentTarget.style.color = T.textSec}>
        <Menu size={20} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 800, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{LABELS[section] || 'Admin Panel'}</div>
        <div className="ad-header-subtitle" style={{ fontSize: 11, color: T.textSec }}>Mushi QR Pro · Super Admin</div>
      </div>

      <div className="ad-header-search">
        <Search size={13} color={T.textMut} />
        <input placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', color: T.text, fontSize: 12, fontFamily: 'inherit', width: 160 }} />
        <span style={{ fontSize: 10, color: T.textMut }}>⌘K</span>
      </div>

      <button style={{ background: 'none', border: 'none', color: T.textSec, cursor: 'pointer', padding: 6, borderRadius: T.r.sm, position: 'relative', display: 'flex', flexShrink: 0 }}>
        <Bell size={18} />
        <div style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: T.accent, border: `2px solid ${T.bgEl}` }} />
      </button>

      <a href="/#/" style={{
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        background: T.accentLow, border: `1px solid rgba(214,0,54,0.25)`,
        color: T.accent, borderRadius: T.r.md, padding: '6px 12px',
        fontSize: 12, fontWeight: 700, textDecoration: 'none',
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

function DashboardPanel({ stats, chartData, history, onNavigate }) {
  const si = DS.getStorageInfo();
  const qr = stats?.qrCount || 0;
  const bc = stats?.barcodeCount || 0;

  const sysChecks = [
    { label: 'localStorage',   ok: typeof localStorage !== 'undefined',            detail: si.used + ' used' },
    { label: 'Service Worker', ok: 'serviceWorker' in navigator,                   detail: 'serviceWorker' in navigator ? 'Enabled' : 'Disabled' },
    { label: 'PWA Mode',       ok: window.matchMedia('(display-mode: standalone)').matches, detail: window.matchMedia('(display-mode: standalone)').matches ? 'Installed' : 'Browser' },
    { label: 'Secure Context', ok: window.isSecureContext,                          detail: window.isSecureContext ? 'HTTPS' : 'HTTP' },
    { label: 'Canvas API',     ok: !!document.createElement('canvas').getContext,   detail: 'QR rendering' },
    { label: 'Clipboard API',  ok: !!navigator.clipboard,                           detail: 'Copy feature' },
  ];

  const allOk = sysChecks.every(c => c.ok);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat Cards */}
      <div className="ad-stat-grid">
        <StatCard icon={QrCode}    label="QR Codes Created" value={qr + bc}                 color={T.purple} trendLabel="all time" />
        <StatCard icon={Star}      label="Saved Items"       value={stats?.savedCount || 0} color={T.blue}   trendLabel="all time" />
        <StatCard icon={Layers}    label="Templates Total"   value={(QR_TEMPLATES?.length || 0) + (stats?.cloudTemplates || 0)} color={T.orange} trendLabel="built-in + cloud" />
        <StatCard icon={HardDrive} label="Storage Used"      value={si.used}                color={T.green}  trendLabel="localStorage" />
      </div>

      {/* Charts Row */}
      <div className="ad-chart-row">
        <AdminCard title="Activity Overview" subtitle="Daily QR & barcode creations (last 7 days)"
          right={
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: T.textSec }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 3, background: T.purple, borderRadius: 2, display: 'inline-block' }} />QR
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 3, background: T.green, borderRadius: 2, display: 'inline-block' }} />Barcode
              </span>
            </div>
          }
        >
          <LineChartSVG data={chartData} series={[{ key: 'qr', color: T.purple }, { key: 'barcode', color: T.green }]} height={190} />
        </AdminCard>

        <AdminCard title="Type Distribution">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <DonutSVG segments={[{ label: 'QR', value: qr, color: T.purple }, { label: 'Barcode', value: bc, color: T.green }]} size={155} />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[{ l: 'QR Codes', v: qr, c: T.purple }, { l: 'Barcodes', v: bc, c: T.green }].map(s => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.c }} />
                    <span style={{ fontSize: 12, color: T.textSec }}>{s.l}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Recent Activity + System Status */}
      <div className="ad-activity-row">
        <AdminCard title="Recent Activity" subtitle="Last 10 items"
          right={<Btn variant="ghost" size="sm" onClick={() => onNavigate('activity-logs')}>View All</Btn>}
          noPadding
        >
          {!(history || []).length ? (
            <EmptyState icon={Activity} title="No activity yet" desc="QR codes and barcodes you create will appear here." />
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
                  {(history || []).slice(0, 10).map((item, i) => (
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

        <AdminCard title="System Status" right={<Badge color={allOk ? T.green : T.orange}>{allOk ? 'All OK' : 'Issues'}</Badge>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sysChecks.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.ok ? T.green : T.red, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: 10, color: T.textSec }}>{c.detail}</div>
                </div>
                <span style={{ fontSize: 10, color: c.ok ? T.green : T.red, fontWeight: 800 }}>{c.ok ? 'OK' : 'N/A'}</span>
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

const DOT_STYLES   = ['square','rounded','dots','extra-rounded','classy','classy-rounded'];
const EYE_STYLES   = ['square','rounded','circle','leaf','extra-rounded'];
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
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(6px)', display:'flex', alignItems:'stretch' }}>
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
            <img src="/logo.png" alt="Logo" style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'contain', background: T.bgEl, padding: 6, border: `1px solid ${T.border}` }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>App Logo</div>
              <div style={{ fontSize: 12, color: T.textSec, marginBottom: 8 }}>Served from /logo.png</div>
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ad-auto-grid-sm">
        <StatCard icon={QrCode}    label="QR Codes"   value={stats?.qrCount || 0}      color={T.purple} />
        <StatCard icon={BarChart2} label="Barcodes"   value={stats?.barcodeCount || 0} color={T.green}  />
        <StatCard icon={Package}   label="Batch Jobs" value={stats?.batchCount || 0}   color={T.orange} />
        <StatCard icon={Star}      label="Saved"      value={stats?.savedCount || 0}   color={T.blue}   />
      </div>

      <AdminCard title="7-Day Activity" subtitle="Creations per day"
        right={
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: T.textSec }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 3, background: T.purple, borderRadius: 2, display: 'inline-block' }} />QR</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 12, height: 3, background: T.green, borderRadius: 2, display: 'inline-block' }} />Barcode</span>
          </div>
        }
      >
        <LineChartSVG data={chartData} series={[{ key: 'qr', color: T.purple }, { key: 'barcode', color: T.green }]} height={220} />
      </AdminCard>

      <div className="ad-two-col">
        <AdminCard title="Type Distribution">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <DonutSVG segments={[{ value: stats?.qrCount || 0, color: T.purple }, { value: stats?.barcodeCount || 0, color: T.green }]} size={130} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ l: 'QR Codes', v: stats?.qrCount || 0, c: T.purple }, { l: 'Barcodes', v: stats?.barcodeCount || 0, c: T.green }].map(s => {
                const tot = (stats?.qrCount || 0) + (stats?.barcodeCount || 0);
                return (
                  <div key={s.l}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: T.textSec }}>{s.l}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{s.v}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <div style={{ height: '100%', background: s.c, borderRadius: 2, width: `${tot ? (s.v / tot) * 100 : 0}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Storage Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(si.breakdown).filter(([k]) => k.startsWith('qrgen_')).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([key, bytes]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, color: T.textSec, fontFamily: 'monospace' }}>{key.replace('qrgen_', '')}</span>
                  <span style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>{fmtBytes(bytes)}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
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
// ADMIN USERS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function AdminUsersPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Admin Users" subtitle="Users with administrative access" noPadding>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ width: 38, height: 38, borderRadius: T.r.sm, background: T.accentLow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 900, fontSize: 13, flexShrink: 0 }}>SA</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Super Admin</div>
              <div style={{ fontSize: 11, color: T.textSec }}>Local Mode — No email required</div>
            </div>
            <Badge color={T.accent}>Super Admin</Badge>
            <Badge color={T.green}>Active</Badge>
          </div>
        </div>
        <EmptyState icon={UserCog} title="Connect Firebase to manage admin users" desc="Multi-admin support with role-based access, email invites, and permission scopes will be available after Firebase integration." />
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLES & PERMISSIONS PANEL
// ═══════════════════════════════════════════════════════════════════════════

function RolesPanel() {
  const roles = [
    { name: 'Super Admin', color: T.accent, perms: ['Full system access', 'User management', 'Billing & plans', 'System config', 'Developer API', 'Backups'] },
    { name: 'Admin', color: T.purple, perms: ['App settings', 'Templates', 'Feature flags', 'Announcements', 'View logs'] },
    { name: 'Moderator', color: T.blue, perms: ['View templates', 'View logs', 'View reports'] },
    { name: 'Viewer', color: T.textSec, perms: ['Read-only dashboard'] },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: `${T.blue}0c`, border: `1px solid ${T.blue}2a`, borderRadius: T.r.md, padding: '11px 15px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Info size={14} color={T.blue} />
        <span style={{ fontSize: 12, color: T.textSec }}>Roles are pre-defined for local mode. Dynamic role assignment and custom permissions require Firebase integration.</span>
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

function SecurityPanel() {
  const checks = [
    { label: 'HTTPS Connection',    value: window.isSecureContext ? 'Secure' : 'Insecure',         ok: window.isSecureContext,  warn: false },
    { label: 'Authentication',      value: 'No auth (local mode)',                                  ok: false,                  warn: true },
    { label: 'Data Encryption',     value: 'localStorage (plaintext)',                              ok: false,                  warn: true },
    { label: 'Service Worker',      value: 'serviceWorker' in navigator ? 'Enabled' : 'Disabled',  ok: 'serviceWorker' in navigator, warn: false },
    { label: 'Manifest / PWA',      value: document.querySelector('link[rel="manifest"]') ? 'Linked' : 'Missing', ok: !!document.querySelector('link[rel="manifest"]'), warn: false },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Security Overview">
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
      <AdminCard>
        <EmptyState icon={Shield} title="Upgrade security with Firebase" desc="Enable Firebase Authentication, Firestore rules, and App Check to protect your admin panel with enterprise-grade security." />
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
      <AdminCard title="Firebase" subtitle="Connected Firebase project" right={<Badge color={T.orange}>Partial</Badge>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Project ID', value: 'mushi-qr-pro', ok: true, warn: false },
            { label: 'Authentication', value: 'Configured (inactive)', ok: false, warn: true },
            { label: 'Firestore', value: 'Not enabled', ok: false, warn: true },
            { label: 'Cloud Storage', value: 'Not configured', ok: false, warn: true },
            { label: 'Analytics', value: 'Not configured', ok: false, warn: true },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: T.text }}>{item.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: T.textSec }}>{item.value}</span>
                <Badge color={item.ok ? T.green : item.warn ? T.orange : T.textMut}>{item.ok ? 'Ready' : item.warn ? 'Pending' : 'Off'}</Badge>
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
          { name: 'Firestore', icon: Database, desc: 'Cloud data storage', color: T.orange, status: 'Pending' },
          { name: 'Firebase Auth', icon: Lock, desc: 'User authentication', color: T.blue, status: 'Configured' },
          { name: 'Firebase Storage', icon: HardDrive, desc: 'File & image storage', color: T.purple, status: 'Pending' },
          { name: 'Analytics', icon: BarChart3, desc: 'Usage insights', color: T.green, status: 'Pending' },
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
              <Badge color={int.status === 'Configured' ? T.green : T.orange}>{int.status}</Badge>
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

function DeveloperPanel() {
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
          { label: 'App Version',  value: '1.1.0' },
          { label: 'Build Mode',   value: (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.MODE === 'string') ? import.meta.env.MODE : 'production' },
          { label: 'Storage Keys', value: keys.length.toString() },
          { label: 'Base URL',     value: String(location.origin) },
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
// SIMPLE EMPTY-STATE PANELS
// ═══════════════════════════════════════════════════════════════════════════

function UsersPanel() {
  return (
    <AdminCard>
      <EmptyState icon={Users} title="User Management" desc="Connect Firebase Authentication to view registered users, manage accounts, send email invites, and assign roles. All user data syncs from Firestore in real-time."
        action={
          <a href="https://console.firebase.google.com/project/mushi-qr-pro/authentication" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Btn variant="ghost" icon={<ExternalLink size={13} />}>Open Firebase Auth Console</Btn>
          </a>
        }
      />
    </AdminCard>
  );
}

function SubscriptionsPanel() {
  const plans = [
    { name: 'Free',    price: '$0',   color: T.textSec, features: ['5 QR codes / day', 'Basic templates', 'PNG export'] },
    { name: 'Pro',     price: '$4.99', color: T.purple,  features: ['Unlimited QR codes', 'All templates', 'SVG & PDF export', 'Batch generation'] },
    { name: 'Business',price: '$12.99',color: T.accent,  features: ['Everything in Pro', 'Team collaboration', 'Analytics', 'Priority support', 'API access'] },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: `${T.orange}0c`, border: `1px solid ${T.orange}2a`, borderRadius: T.r.md, padding: '11px 15px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Info size={14} color={T.orange} />
        <span style={{ fontSize: 12, color: T.textSec }}>Subscription management is a plan scaffold. Live billing requires Stripe + Firebase integration.</span>
      </div>
      <div className="ad-auto-grid">
        {plans.map(plan => (
          <AdminCard key={plan.name} style={{ border: `1px solid ${plan.color}33` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Badge color={plan.color}>{plan.name}</Badge>
                <div style={{ fontSize: 26, fontWeight: 900, color: plan.color, marginTop: 8 }}>{plan.price}<span style={{ fontSize: 12, color: T.textSec, fontWeight: 500 }}>/mo</span></div>
              </div>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Check size={12} color={plan.color} />
                  <span style={{ fontSize: 12, color: T.textSec }}>{f}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}

function CategoriesPanel() {
  const cats = [...new Set((QR_TEMPLATES || []).map(t => t.category))];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Built-in Categories" subtitle="Derived from QR_TEMPLATES array">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: T.bgEl, borderRadius: T.r.md, border: `1px solid ${T.border}` }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.purple }} />
              <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{c}</span>
              <Badge color={T.textSec}>{(QR_TEMPLATES || []).filter(t => t.category === c).length}</Badge>
            </div>
          ))}
        </div>
      </AdminCard>
      <AdminCard>
        <EmptyState icon={Grid} title="Custom Category Manager" desc="Create and reorder categories with icons and color labels. Drag-and-drop ordering and Firestore persistence coming with backend integration." />
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
    <AdminCard>
      <EmptyState icon={HelpCircle} title="Support & Tickets" desc="A built-in ticketing system for user support, bug reports, and feature requests. Requires backend integration with your preferred help desk provider."
        action={
          <a href="mailto:support@mushiqr.pro" style={{ textDecoration: 'none' }}>
            <Btn variant="ghost" icon={<Mail size={13} />}>Email Support</Btn>
          </a>
        }
      />
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
        const [s, c, h, as_, ff, ct, ann, rc, al] = await Promise.all([
          DS.getAppStats(), DS.getActivityChartData(7), DS.getHistory(100),
          DS.getAppSettings(), DS.getFeatureFlags(), DS.getCloudTemplates(),
          DS.getAnnouncement(), DS.getRemoteConfig(), DS.getAuditLog(100),
        ]);
        setStats(s); setChartData(c); setHistory(h);
        setAppSettings(as_); setFeatureFlags(ff); setCloudTemplates(ct);
        setAnnouncement(ann); setRemoteConfig(rc); setAuditLog(al);
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

  if (!currentUser || currentUser.email !== 'mabuneri143@gmail.com') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg, color: T.text, padding: 24, textAlign: 'center', fontFamily: "sans-serif" }}>
        <Shield size={64} color={T.accent} style={{ marginBottom: 24 }} />
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Access Denied</h1>
        <p style={{ color: T.textSec, maxWidth: 360, marginBottom: 24 }}>You must be logged in as the superadmin to access this panel.</p>
        <button onClick={() => window.location.hash = '#/'} style={{ background: T.accent, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: T.r.md, cursor: 'pointer', fontWeight: 700 }}>
          Go to Home
        </button>
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
    dashboard:       <DashboardPanel stats={stats} chartData={chartData} history={history} onNavigate={setSection} />,
    users:           <UsersPanel />,
    subscriptions:   <SubscriptionsPanel />,
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
          margin-left: 240px;
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
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
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
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(255,255,255,0.05);
          border: none;
          border-radius: 8px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 6px;
          line-height: 0;
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
      }}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 15, backdropFilter: 'blur(4px)' }} />
        )}

        <Sidebar active={section} setActive={s => { setSection(s); if (isMobile) setSidebar(false); }} isMobile={isMobile} open={isMobile ? sidebarOpen : true} onClose={() => setSidebar(false)} />

        <div className={`ad-main-content${isMobile ? ' mobile' : ''}`}>
          <Header section={section} onMenuToggle={() => setSidebar(o => !o)} isMobile={isMobile} />

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
              { id: 'templates',    icon: Layers,           label: 'Templates' },
              { id: 'feature-flags',icon: Flag,             label: 'Flags' },
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
