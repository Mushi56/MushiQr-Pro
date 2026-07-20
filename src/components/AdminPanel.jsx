// src/components/AdminPanel.jsx
// Mushi QR Pro — Super Admin Panel (SaaS-grade)
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
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

function Sidebar({ active, setActive, isMobile, open }) {
  return (
    <aside style={{
      width: 240, background: T.sidebar, borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: isMobile ? (open ? 0 : -260) : 0, top: 0, bottom: 0,
      zIndex: 20, transition: 'left 0.25s ease',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.text, lineHeight: 1.2 }}>Mushi QR Pro</div>
          <div style={{ fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: '0.5px' }}>⬡ SUPER ADMIN</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', scrollbarWidth: 'none' }}>
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

function Header({ section, onMenuToggle }) {
  return (
    <div style={{
      height: 58, background: T.bgEl, borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
      position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
    }}>
      <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', color: T.textSec, cursor: 'pointer', padding: 5, borderRadius: T.r.sm, display: 'flex' }}
        onMouseEnter={e => e.currentTarget.style.color = T.text}
        onMouseLeave={e => e.currentTarget.style.color = T.textSec}>
        <Menu size={20} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{LABELS[section] || 'Admin Panel'}</div>
        <div style={{ fontSize: 11, color: T.textSec }}>Mushi QR Pro · Super Admin</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r.md, padding: '6px 12px' }}>
        <Search size={13} color={T.textMut} />
        <input placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', color: T.text, fontSize: 12, fontFamily: 'inherit', width: 160 }} />
        <span style={{ fontSize: 10, color: T.textMut }}>⌘K</span>
      </div>

      <button style={{ background: 'none', border: 'none', color: T.textSec, cursor: 'pointer', padding: 5, borderRadius: T.r.sm, position: 'relative', display: 'flex' }}>
        <Bell size={18} />
        <div style={{ position: 'absolute', top: 3, right: 3, width: 7, height: 7, borderRadius: '50%', background: T.accent, border: `2px solid ${T.bgEl}` }} />
      </button>

      <a href="/#/" style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: T.accentLow, border: `1px solid rgba(214,0,54,0.25)`,
        color: T.accent, borderRadius: T.r.md, padding: '6px 12px',
        fontSize: 12, fontWeight: 700, textDecoration: 'none',
      }}>
        <ArrowLeft size={13} /> App
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
        <StatCard icon={QrCode}    label="QR Codes Created" value={qr + bc}                 color={T.purple} trendLabel="all time" />
        <StatCard icon={Star}      label="Saved Items"       value={stats?.savedCount || 0} color={T.blue}   trendLabel="all time" />
        <StatCard icon={Layers}    label="Templates Total"   value={(QR_TEMPLATES?.length || 0) + (stats?.cloudTemplates || 0)} color={T.orange} trendLabel="built-in + cloud" />
        <StatCard icon={HardDrive} label="Storage Used"      value={si.used}                color={T.green}  trendLabel="localStorage" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
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

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { icon: Layers,   label: 'Manage Templates',  desc: 'Create and edit QR templates',  color: T.blue,   id: 'templates' },
          { icon: Settings, label: 'App Configuration', desc: 'App name, colors, messages',     color: T.orange, id: 'app-settings' },
          { icon: Flag,     label: 'Feature Flags',     desc: 'Toggle features on / off',       color: T.purple, id: 'feature-flags' },
          { icon: BarChart2,label: 'View Analytics',    desc: 'Usage charts and breakdowns',    color: T.green,  id: 'analytics' },
        ].map(qa => (
          <button key={qa.id} onClick={() => onNavigate(qa.id)} style={{
            background: `${qa.color}0c`, border: `1px solid ${qa.color}2a`, borderRadius: T.r.lg,
            padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 12, textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit',
          }}
            onMouseEnter={e => e.currentTarget.style.background = `${qa.color}1a`}
            onMouseLeave={e => e.currentTarget.style.background = `${qa.color}0c`}
          >
            <div style={{ width: 42, height: 42, borderRadius: T.r.md, background: `${qa.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <qa.icon size={19} color={qa.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{qa.label}</div>
              <div style={{ fontSize: 11, color: T.textSec }}>{qa.desc}</div>
            </div>
            <ArrowUpRight size={15} color={qa.color} style={{ flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATES PANEL
// ═══════════════════════════════════════════════════════════════════════════

function TemplatesPanel({ cloudTemplates, onRefresh }) {
  const [tab, setTab] = useState('builtin');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Social', qrSize: 0.5, qrX: 0.5, qrY: 0.5 });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setForm({ name: '', category: 'Social', qrSize: 0.5, qrX: 0.5, qrY: 0.5 }); setEditId(null); setShowForm(true); };
  const openEdit = (t) => { setForm({ name: t.name, category: t.category, qrSize: t.qrSize, qrX: t.qrX, qrY: t.qrY }); setEditId(t.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await DS.saveCloudTemplate({ ...form, id: editId || ('cloud_' + Date.now().toString(36)), updatedAt: new Date().toISOString() });
      closeForm(); onRefresh();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    await DS.deleteCloudTemplate(id);
    onRefresh();
  };

  const cats = ['Social', 'Business', 'Hot', 'Creative', 'Minimal', 'Event', 'Retail'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 0, background: T.bgCard, borderRadius: T.r.md, padding: 4, border: `1px solid ${T.border}`, width: 'fit-content' }}>
        {[{ id: 'builtin', label: `Built-in (${QR_TEMPLATES.length})` }, { id: 'cloud', label: `Cloud (${cloudTemplates.length})` }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '7px 18px', borderRadius: T.r.sm, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: tab === t.id ? T.accent : 'transparent',
            color: tab === t.id ? '#fff' : T.textSec, fontWeight: 700, fontSize: 12, transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'builtin' && (
        <AdminCard title="Built-in Templates" subtitle="Pre-installed AI-designed templates (read-only)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {QR_TEMPLATES.map(tpl => (
              <div key={tpl.id} style={{ background: T.bgEl, borderRadius: T.r.md, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                <div style={{ aspectRatio: '1', background: `linear-gradient(135deg, ${T.purple}18, ${T.blue}18)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={36} color={`${T.purple}88`} />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tpl.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge color={T.orange}>{tpl.category}</Badge>
                    <span style={{ fontSize: 9, color: T.textMut }}>Read-only</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {tab === 'cloud' && (
        <AdminCard title="Cloud Templates" subtitle="Custom templates stored locally"
          right={<Btn icon={<Plus size={13} />} onClick={openAdd}>Add Template</Btn>}
        >
          {showForm && (
            <div style={{ background: T.bgEl, borderRadius: T.r.md, padding: 18, border: `1px solid ${T.accent}44`, marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{editId ? 'Edit Template' : 'New Template'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <FormInput label="Template Name" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Facebook Dark" />
                <FormSelect label="Category" value={form.category} onChange={v => set('category', v)} options={cats.map(c => ({ value: c, label: c }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <FormInput label="QR Size (0–1)" type="number" value={form.qrSize} onChange={v => set('qrSize', parseFloat(v) || 0.5)} />
                <FormInput label="Center X (0–1)" type="number" value={form.qrX}   onChange={v => set('qrX',   parseFloat(v) || 0.5)} />
                <FormInput label="Center Y (0–1)" type="number" value={form.qrY}   onChange={v => set('qrY',   parseFloat(v) || 0.5)} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Btn variant="ghost" onClick={closeForm}>Cancel</Btn>
                <Btn onClick={handleSave} disabled={saving || !form.name.trim()} icon={<Check size={13} />}>{saving ? 'Saving...' : 'Save'}</Btn>
              </div>
            </div>
          )}
          {cloudTemplates.length === 0 && !showForm ? (
            <EmptyState icon={Layers} title="No cloud templates yet" desc="Create custom templates that users can apply to their QR codes."
              action={<Btn icon={<Plus size={13} />} onClick={openAdd}>Create First Template</Btn>}
            />
          ) : (
            <div>
              {cloudTemplates.map(tpl => (
                <div key={tpl.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ width: 38, height: 38, borderRadius: T.r.sm, background: `${T.purple}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Layers size={16} color={T.purple} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{tpl.name}</div>
                    <div style={{ fontSize: 11, color: T.textSec }}>Size {tpl.qrSize} · X {tpl.qrX} · Y {tpl.qrY}</div>
                  </div>
                  <Badge color={T.orange}>{tpl.category}</Badge>
                  <Btn variant="ghost" size="sm" icon={<Edit size={11} />} onClick={() => openEdit(tpl)}>Edit</Btn>
                  <Btn variant="danger" size="sm" icon={<Trash2 size={11} />} onClick={() => handleDelete(tpl.id)}>Delete</Btn>
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
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

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
            <Btn onClick={handleSave} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saved ? 'Saved!' : 'Save Settings'}
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
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

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
            <Btn onClick={handleSave} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saved ? 'Saved!' : 'Save Branding'}
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
  useEffect(() => { if (flags) setF(flags); }, [flags]);

  const toggle = k => setF(p => ({ ...p, [k]: !p[k] }));
  const handleSave = async () => { await onSave(f); setSaved(true); setTimeout(() => setSaved(false), 2500); };

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
        <Btn onClick={handleSave} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
          {saved ? 'Saved!' : 'Save Flags'}
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
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

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
            <Btn onClick={handleSave} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saved ? 'Saved!' : 'Save Settings'}
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
  useEffect(() => { if (announcement) setForm(announcement); }, [announcement]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleSave = async () => { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };

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
            <Btn onClick={handleSave} icon={saved ? <Check size={13} /> : <Save size={13} />} variant={saved ? 'success' : 'primary'}>
              {saved ? 'Published!' : 'Publish Announcement'}
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
  useEffect(() => { if (config) setPairs(Object.entries(config).map(([k, v]) => ({ k, v }))); }, [config]);

  const update = (i, field, val) => setPairs(p => p.map((x, j) => j === i ? { ...x, [field]: val } : x));
  const remove  = i => setPairs(p => p.filter((_, j) => j !== i));

  const handleSave = async () => {
    const cfg = Object.fromEntries(pairs.filter(p => p.k.trim()).map(p => [p.k.trim(), p.v]));
    await onSave(cfg); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AdminCard title="Remote Configuration" subtitle="Key-value pairs pushed to the app at runtime"
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" size="sm" icon={<Plus size={12} />} onClick={() => setPairs(p => [...p, { k: '', v: '' }])}>Add Key</Btn>
            <Btn size="sm" onClick={handleSave} icon={saved ? <Check size={12} /> : <Save size={12} />} variant={saved ? 'success' : 'primary'}>{saved ? 'Saved!' : 'Save'}</Btn>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        <StatCard icon={QrCode}    label="QR Codes"   value={stats?.qrCount || 0}      color={T.purple} />
        <StatCard icon={BarChart2} label="Barcodes"   value={stats?.barcodeCount || 0} color={T.green}  />
        <StatCard icon={Package}   label="Batch Jobs" value={stats?.batchCount || 0}   color={T.orange} />
        <StatCard icon={Star}      label="Saved"      value={stats?.savedCount || 0}   color={T.blue}   />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
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

export default function AdminPanel() {
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
  }, []);

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
    'app-settings':  <AppSettingsPanel settings={appSettings} onSave={async s => { await DS.saveAppSettings(s); setAppSettings(s); await refreshAudit(); }} />,
    branding:        <BrandingPanel settings={appSettings} onSave={async s => { await DS.saveAppSettings(s); setAppSettings(s); await refreshAudit(); }} />,
    'remote-config': <RemoteConfigPanel config={remoteConfig} onSave={async c => { await DS.saveRemoteConfig(c); setRemoteConfig(c); await refreshAudit(); }} />,
    'feature-flags': <FeatureFlagsPanel flags={featureFlags} onSave={async f => { await DS.saveFeatureFlags(f); setFeatureFlags(f); await refreshAudit(); }} />,
    maintenance:     <MaintenancePanel settings={appSettings} onSave={async s => { await DS.saveAppSettings(s); setAppSettings(s); await refreshAudit(); }} />,
    announcements:   <AnnouncementsPanel announcement={announcement} onSave={async a => { await DS.saveAnnouncement(a); setAnnouncement(a); await refreshAudit(); }} />,
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
        @keyframes adSpin { to { transform: rotate(360deg); } }
        .ad-scroll::-webkit-scrollbar { width: 4px; }
        .ad-scroll::-webkit-scrollbar-track { background: transparent; }
        .ad-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .ad-sidebar::-webkit-scrollbar { display: none; }
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

        <Sidebar active={section} setActive={s => { setSection(s); if (isMobile) setSidebar(false); }} isMobile={isMobile} open={isMobile ? sidebarOpen : true} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: isMobile ? 0 : 240 }}>
          <Header section={section} onMenuToggle={() => setSidebar(o => !o)} />

          <main className="ad-scroll" style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '14px 12px' : '24px 28px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 14 }}>
                <div style={{ width: 36, height: 36, border: `3px solid ${T.bgCard}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'adSpin 0.7s linear infinite' }} />
                <span style={{ fontSize: 14, color: T.textSec }}>Loading admin data...</span>
              </div>
            ) : (
              PANELS[section] || PANELS.dashboard
            )}
          </main>
        </div>
      </div>
    </>
  );
}
