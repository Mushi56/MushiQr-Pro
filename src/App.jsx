import { useState, useEffect, useRef, useCallback, Component } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import {
  QrCode,
  Sun,
  Moon,
  CheckCircle2,
  XCircle,
  Save,
  Download,
  Copy,
  Loader2,
  Share2,
  ChevronDown,
  ChevronUp,
  FileImage,
  FileCode,
  FileText,
  Pencil,
  Palette,
  Pipette,
  Hexagon,
  Image as ImageIcon,
  LayoutGrid,
  ShieldCheck,
  UploadCloud,
  X,
  Menu,
  Info,
  Shield,
  FileText as FileIcon,
  ExternalLink,
  Home,
  Bookmark,
  Settings,
  Type,
  ALargeSmall,
  Paintbrush,
  Plus,
  Maximize,
  Shapes,
  ScanLine,
  History,
  PlusCircle,
  Undo2,
  Redo2,
  Check,
  RotateCw,
  Filter,
  Crop,
  Eraser,
  Layers,
  AlertCircle
} from 'lucide-react';
import ColorPicker from './components/ColorPicker';
import Slider from './components/Slider';
import Toggle from './components/Toggle';
import LogoPresets from './components/LogoPresets';
import QRTypeSelector from './components/QRTypeSelector';
import QRDataInput from './components/QRDataInput';
import { DotStyleSelector, EyeStyleSelector } from './components/StyleSelectors';
import { generateQRMatrix, renderQR, QR_TYPES, DOT_STYLES, EYE_STYLES, FRAME_STYLES, formatQRData, constrainToSafeZone } from './utils/qrEngine';
import { downloadPNG, downloadSVG, downloadPDF, downloadJPG } from './utils/exportUtils';
import { saveToHistory, getSaved, saveToSaved, getPreferences, savePreferences } from './utils/storage';
import QRScanner from './components/QRScanner';
import HistoryPage from './components/HistoryPage';
import HomePage from './components/HomePage';
import SavedPage from './components/SavedPage';
import SettingsPage from './components/SettingsPage';
import BatchPage from './components/BatchPage';
import BarcodePage from './components/BarcodePage';
import ScannerGunPage from './components/ScannerGunPage';
import AdvancedColorPicker from './components/AdvancedColorPicker';
import AppIcon from './components/AppIcon';
import { MdOutlineQrCode2, MdQrCodeScanner } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const QRDotsIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="10.25" y="3" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="17.5" y="3" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    
    <rect x="3" y="10.25" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="10.25" y="10.25" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="17.5" y="10.25" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    
    <rect x="3" y="17.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="10.25" y="17.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="17.5" y="17.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const QREyesIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Top-Left Eye */}
    <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="4.5" y="4.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
    
    {/* Top-Right Eye */}
    <rect x="15" y="2.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="17" y="4.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
    
    {/* Bottom-Left Eye */}
    <rect x="2.5" y="15" width="6.5" height="6.5" rx="1.5" />
    <rect x="4.5" y="17" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const QRStyleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
    {/* Three Main Position Marker Eyes */}
    <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="4.5" y="4.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
    
    <rect x="2.5" y="15" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="4.5" y="17" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
    
    <rect x="15" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="17" y="4.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
    
    {/* Grid pixels */}
    <rect x="11" y="4" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="11" y="7.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="4" y="11" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="7.5" y="11" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="11" y="11" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="14.5" y="11" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="18" y="11" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    
    <rect x="11" y="14.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="11" y="18" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    
    {/* Bottom right corner */}
    <rect x="15.5" y="15.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="18.5" y="15.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="15.5" y="18.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    <rect x="18.5" y="18.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const QRGradientIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="qr-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" fill="url(#qr-icon-grad)" />
  </svg>
);

const TEXT_SHAPES = [
  { id: 'solid', label: 'Solid Box' },
  { id: 'rounded', label: 'Rounded Box' },
  { id: 'pill', label: 'Pill Box' },
  { id: 'outline', label: 'Outline Box' },
  { id: 'underline', label: 'Underline' },
  { id: 'ribbon', label: 'Ribbon' },
  { id: 'glow', label: 'Glow Effect' },
  { id: 'brackets', label: 'Brackets' },
  { id: 'hexagon', label: 'Hexagon' },
  { id: 'dots', label: 'Dotted Box' }
];

const LOGO_BG_SHAPES = [
  { id: 'circle', label: 'Circle Box' },
  { id: 'solid', label: 'Solid Box' },
  { id: 'rounded', label: 'Rounded Box' },
  { id: 'pill', label: 'Pill Box' },
  { id: 'ribbon', label: 'Ribbon' },
  { id: 'glow', label: 'Glow Effect' },
  { id: 'hexagon', label: 'Hexagon' }
];

/* ── Color Presets ── */
/* ── Color Presets (Expanded to 50) ── */
const COLOR_PRESETS = [
  { name: 'Classic', qr: '#000000', bg: '#FFFFFF' },
  { name: 'Midnight', qr: '#FFFFFF', bg: '#030305' },
  { name: 'Vibrant Red', qr: '#FF3B30', bg: '#FFFFFF' },
  { name: 'Electric Blue', qr: '#007AFF', bg: '#FFFFFF' },
  { name: 'Emerald', qr: '#34C759', bg: '#FFFFFF' },
  { name: 'Sunny', qr: '#FFCC00', bg: '#FFFFFF' },
  { name: 'Purple Neon', qr: '#AF52DE', bg: '#0F0F1A' },
  { name: 'Orange Glow', qr: '#FF9500', bg: '#FFFFFF' },
  { name: 'Indigo', qr: '#5856D6', bg: '#FFFFFF' },
  { name: 'Pink Punch', qr: '#FF2D55', bg: '#FFFFFF' },
  { name: 'Cyan Neon', qr: '#00F0FF', bg: '#0A0A0F' },
  { name: 'Rose Gold', qr: '#E91E63', bg: '#FFF1F2' },
  { name: 'Deep Ocean', qr: '#1A237E', bg: '#E8EAF6' },
  { name: 'Forest', qr: '#1B5E20', bg: '#E8F5E9' },
  { name: 'Hot Chili', qr: '#B71C1C', bg: '#FFEBEE' },
  { name: 'Amber', qr: '#FF6F00', bg: '#FFF8E1' },
  { name: 'Teal Mist', qr: '#004D40', bg: '#E0F2F1' },
  { name: 'Slate', qr: '#263238', bg: '#ECEFF1' },
  { name: 'Royal Purple', qr: '#4A148C', bg: '#F3E5F5' },
  { name: 'Lemonade', qr: '#FBC02D', bg: '#FFFDE7' },
  { name: 'Cyberpunk', qr: '#FFFF00', bg: '#FF00FF' },
  { name: 'Matrix', qr: '#00FF00', bg: '#000000' },
  { name: 'Blood Orange', qr: '#FF3D00', bg: '#FBE9E7' },
  { name: 'Space Grey', qr: '#9E9E9E', bg: '#212121' },
  { name: 'Mint Leaf', qr: '#00B894', bg: '#E8FDF9' },
  { name: 'Grape', qr: '#6C5CE7', bg: '#EFEEFE' },
  { name: 'Sky High', qr: '#0984E3', bg: '#EBF5FF' },
  { name: 'Coral', qr: '#D63031', bg: '#FFFAFA' },
  { name: 'Golden Hour', qr: '#F39C12', bg: '#1A1A1A' },
  { name: 'Tropical', qr: '#00D1B2', bg: '#F5FFFA' },
  { name: 'Volcano', qr: '#E74C3C', bg: '#34495E' },
  { name: 'Amethyst', qr: '#9B59B6', bg: '#F4ECF7' },
  { name: 'Cobalt', qr: '#2980B9', bg: '#EBF5FB' },
  { name: 'Pumpkin', qr: '#D35400', bg: '#FBEEE6' },
  { name: 'Asbestos', qr: '#7F8C8D', bg: '#F2F4F4' },
  { name: 'Belize', qr: '#2980B9', bg: '#2C3E50' },
  { name: 'Carrot', qr: '#E67E22', bg: '#1A1A1A' },
  { name: 'Sunflower', qr: '#F1C40F', bg: '#2C3E50' },
  { name: 'Turquoise', qr: '#1ABC9C', bg: '#16A085' },
  { name: 'Wet Asphalt', qr: '#ECF0F1', bg: '#34495E' },
  { name: 'Alizarin', qr: '#E74C3C', bg: '#FFFFFF' },
  { name: 'Wisteria', qr: '#8E44AD', bg: '#FFFFFF' },
  { name: 'Silver', qr: '#2C3E50', bg: '#BDC3C7' },
  { name: 'Concrete', qr: '#FFFFFF', bg: '#95A5A6' },
  { name: 'Green Sea', qr: '#FFFFFF', bg: '#16A085' },
  { name: 'Shadow', qr: '#34495E', bg: '#2C3E50' },
  { name: 'Midnight Blue', qr: '#2C3E50', bg: '#FFFFFF' },
  { name: 'Soft Pink', qr: '#FF80AB', bg: '#FCE4EC' },
  { name: 'Cool Mint', qr: '#1DE9B6', bg: '#E0F2F1' },
  { name: 'Light Blue', qr: '#00B0FF', bg: '#E1F5FE' },
  { name: 'Warm Amber', qr: '#FFAB00', bg: '#FFF8E1' },
  { name: 'Deep Purple', qr: '#6200EA', bg: '#EDE7F6' },
];

/* ── Gradient Presets (Expanded to 50) ── */
const GRADIENT_PRESETS = [
  { name: 'Sunset', c1: '#FF512F', c2: '#DD2476' },
  { name: 'Ocean', c1: '#2193b0', c2: '#6dd5ed' },
  { name: 'Neon Night', c1: '#00F0FF', c2: '#7000FF' },
  { name: 'Lush', c1: '#56ab2f', c2: '#a8e063' },
  { name: 'Midnight', c1: '#232526', c2: '#414345' },
  { name: 'Candy', c1: '#ee9ca7', c2: '#ffdde1' },
  { name: 'Skyline', c1: '#1488CC', c2: '#2B32B2' },
  { name: 'Royal', c1: '#16222A', c2: '#3A6073' },
  { name: 'Sunrise', c1: '#f12711', c2: '#f5af19' },
  { name: 'Purple Love', c1: '#cc2b5e', c2: '#753a88' },
  { name: 'Deep Sea', c1: '#2C3E50', c2: '#4CA1AF' },
  { name: 'Fire', c1: '#f83600', c2: '#f9d423' },
  { name: 'Peach', c1: '#ED4264', c2: '#FFEDBC' },
  { name: 'Violet', c1: '#7F00FF', c2: '#E100FF' },
  { name: 'Emerald', c1: '#00b09b', c2: '#96c93d' },
  { name: 'Bora Bora', c1: '#2BC0E4', c2: '#EAECC6' },
  { name: 'Misty', c1: '#E0EAFC', c2: '#CFDEF3' },
  { name: 'Steel', c1: '#1F1C2C', c2: '#928DAB' },
  { name: 'Juicy', c1: '#FF8008', c2: '#FFC837' },
  { name: 'Pinky', c1: '#DD5E89', c2: '#F7BB97' },
  { name: 'Seaweed', c1: '#4b6cb7', c2: '#182848' },
  { name: 'Cherry', c1: '#EB3349', c2: '#F45C43' },
  { name: 'Mojito', c1: '#48c6ef', c2: '#6f86d6' },
  { name: 'Aqua', c1: '#00c6ff', c2: '#0072ff' },
  { name: 'Blueberry', c1: '#6a11cb', c2: '#2575fc' },
  { name: 'Bloody Mary', c1: '#FF512F', c2: '#DD2476' },
  { name: 'Rose', c1: '#e91e63', c2: '#ff8a80' },
  { name: 'Gold', c1: '#D4AF37', c2: '#F9E29C' },
  { name: 'Mint', c1: '#00b09b', c2: '#96c93d' },
  { name: 'Indigo', c1: '#396afc', c2: '#2948ff' },
  { name: 'Lime', c1: '#a8ff78', c2: '#78ffd6' },
  { name: 'Flamingo', c1: '#ff4b2b', c2: '#ff416c' },
  { name: 'Galaxy', c1: '#240b36', c2: '#c31432' },
  { name: 'Space', c1: '#0f0c29', c2: '#302b63' },
  { name: 'Cloudy', c1: '#fdfbfb', c2: '#ebedee' },
  { name: 'Forest', c1: '#5a3f37', c2: '#2c7744' },
  { name: 'Wine', c1: '#af2d2d', c2: '#631010' },
  { name: 'Magic', c1: '#5f2c82', c2: '#49a09d' },
  { name: 'Plum', c1: '#ada996', c2: '#f2f2f2' },
  { name: 'Steel Blue', c1: '#3a7bd5', c2: '#00d2ff' },
  { name: 'Turquoise', c1: '#136a8a', c2: '#267871' },
  { name: 'Venice', c1: '#085078', c2: '#85D8CE' },
  { name: 'Horizon', c1: '#003973', c2: '#E5E5BE' },
  { name: 'Electric', c1: '#6a11cb', c2: '#2575fc' },
  { name: 'Lava', c1: '#f12711', c2: '#f5af19' },
  { name: 'Toxic', c1: '#11998e', c2: '#38ef7d' },
  { name: 'Citrus', c1: '#FDC830', c2: '#F37335' },
  { name: 'Frost', c1: '#000428', c2: '#004e92' },
  { name: 'Coal', c1: '#000000', c2: '#434343' },
  { name: 'Titanium', c1: '#283048', c2: '#859398' },
];

const TRENDING_GRADIENT_PRESETS = GRADIENT_PRESETS.map(p => {
  let bg = '#FFFFFF';
  const nameLower = p.name.toLowerCase();
  if (nameLower.includes('midnight') || nameLower.includes('coal') || nameLower.includes('galaxy') || nameLower.includes('space') || nameLower.includes('steel') || nameLower.includes('frost')) {
    bg = '#111111';
  }
  return {
    name: p.name,
    qr: `linear-gradient(135deg, ${p.c1}, ${p.c2})`,
    bg: bg
  };
});

const LOGO_BG_GRADIENT_PRESETS = [
  'linear-gradient(135deg, #FF3B30, #FF9500)',
  'linear-gradient(135deg, #007AFF, #00F0FF)',
  'linear-gradient(135deg, #AF52DE, #FF2D55)',
  'linear-gradient(135deg, #34C759, #00F0FF)',
  'linear-gradient(135deg, #7000FF, #FF007F)',
  'linear-gradient(135deg, #FFCC00, #FF9500)',
  'linear-gradient(135deg, #00C5FF, #25D366)',
  'linear-gradient(135deg, #111111, #444444)'
];

const SWATCH_PRESETS = [
  '#000000', '#FFFFFF', '#FF3B30', '#34C759',
  '#007AFF', '#FFCC00', '#AF52DE', '#FF9500',
  '#5856D6', '#FF2D55', '#00F0FF', '#7000FF',
  '#FF007F', '#00D1FF', '#FFD700', '#8E8E93'
];

const SOCIAL_TEXTURES = [
  { slug: 'facebook', name: 'Facebook', url: '/textures/facebook_texture.png' },
  { slug: 'whatsapp', name: 'WhatsApp', url: '/textures/whatsapp_texture.png' },
  { slug: 'instagram', name: 'Instagram', url: '/textures/instagram_texture.png' },
  { slug: 'youtube', name: 'YouTube', url: '/textures/youtube_texture.png' },
  { slug: 'tiktok', name: 'TikTok', url: '/textures/tiktok_texture.png' },
  { slug: 'snapchat', name: 'Snapchat', url: '/textures/snapchat_texture.png' },
  { slug: 'twitter', name: 'Twitter / X', url: '/textures/twitter_texture.png' },
  { slug: 'telegram', name: 'Telegram', url: '/textures/telegram_texture.png' },
  { slug: 'spotify', name: 'Spotify', url: '/textures/spotify_texture.png' }
];

const renderShapeThumbnail = (shapeId, color = 'currentColor') => {
  switch (shapeId) {
    case 'circle':
      return (
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', margin: '0 auto' }}>
          <circle cx="27" cy="27" r="22" fill={color} />
        </svg>
      );
    case 'solid':
      return (
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', margin: '0 auto' }}>
          <rect x="5" y="5" width="44" height="44" fill={color} />
        </svg>
      );
    case 'rounded':
      return (
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', margin: '0 auto' }}>
          <rect x="5" y="5" width="44" height="44" rx="10" fill={color} />
        </svg>
      );
    case 'pill':
      return (
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', margin: '0 auto' }}>
          <rect x="4" y="12" width="46" height="30" rx="15" fill={color} />
        </svg>
      );
    case 'ribbon':
      return (
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', margin: '0 auto' }}>
          <path d="M5,10 L49,10 L43,27 L49,44 L5,44 L11,27 Z" fill={color} />
        </svg>
      );
    case 'glow':
      return (
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <filter id="glow-thumb" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect x="8" y="8" width="38" height="38" rx="8" fill={color} filter="url(#glow-thumb)" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ display: 'block', margin: '0 auto' }}>
          <polygon points="14,6 40,6 50,27 40,48 14,48 4,27" fill={color} />
        </svg>
      );
    default:
      return null;
  }
};

function parseGradientString(gradStr, defaultColor1 = '#FF3B30', defaultColor2 = '#FF9500') {
  if (gradStr && gradStr.startsWith('linear-gradient(')) {
    const match = gradStr.match(/linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/i);
    if (match) {
      return {
        color1: match[2].trim(),
        color2: match[3].trim()
      };
    }
  }
  return {
    color1: gradStr || defaultColor1,
    color2: defaultColor2
  };
}

const renderColorOrGradientPicker = (label, value, onChange, handleOpenAdv) => {
  const isGradient = value && value.startsWith('linear-gradient(');
  const { color1, color2 } = parseGradientString(value);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px' }}>
          <button 
            onClick={() => onChange(color1)}
            style={{ border: 'none', background: !isGradient ? 'var(--accent-primary)' : 'transparent', color: !isGradient ? '#fff' : 'var(--text-primary)', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            Solid
          </button>
          <button 
            onClick={() => onChange(`linear-gradient(135deg, ${color1}, ${color2 || '#a78bfa'})`)}
            style={{ border: 'none', background: isGradient ? 'var(--accent-primary)' : 'transparent', color: isGradient ? '#fff' : 'var(--text-primary)', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            Gradient
          </button>
        </div>
      </div>

      {!isGradient ? (
        <div className="swatch-grid-mini">
          <ColorPicker isSwatch={true} icon={Pipette} value={value} onChange={onChange} onOpenAdvanced={handleOpenAdv} />
          {SWATCH_PRESETS.map(color => (
            <div key={color} className={`swatch-item${value === color ? ' active' : ''}`} style={{ backgroundColor: color }} onClick={() => onChange(color)} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="fade-in">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            background: 'var(--bg-secondary)', 
            padding: '16px', 
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            position: 'relative',
            justifyContent: 'space-between'
          }}>
            {/* Start Color Picker */}
            <ColorPicker isSwatch={true} icon={Pipette} value={color1} onChange={(c) => onChange(`linear-gradient(135deg, ${c}, ${color2})`)} onOpenAdvanced={handleOpenAdv} />

            {/* Photoshop style connecting track & swap button */}
            <div style={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flex: 1,
              margin: '0 8px',
              height: '40px'
            }}>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                borderRadius: '4px', 
                background: `linear-gradient(90deg, ${color1}, ${color2})`,
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
              }} />
              <button 
                onClick={() => onChange(`linear-gradient(135deg, ${color2}, ${color1})`)}
                title="Swap Colors"
                className="swap-btn-premium"
                style={{ 
                  position: 'absolute', 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-elevated)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 3 4 4-4 4" />
                  <path d="M20 7H4" />
                  <path d="m8 21-4-4 4-4" />
                  <path d="M4 17h16" />
                </svg>
              </button>
            </div>

            {/* End Color Picker */}
            <ColorPicker isSwatch={true} icon={Pipette} value={color2} onChange={(c) => onChange(`linear-gradient(135deg, ${color1}, ${c})`)} onOpenAdvanced={handleOpenAdv} />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '-4px' }}>Gradient Presets</div>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0 8px 0', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            {GRADIENT_PRESETS.map(p => {
              const gradStr = `linear-gradient(135deg, ${p.c1}, ${p.c2})`;
              const isActive = value === gradStr;
              return (
                <button 
                  key={p.name}
                  onClick={() => onChange(gradStr)}
                  title={p.name}
                  style={{
                    flex: '0 0 auto',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: gradStr,
                    border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    boxShadow: isActive ? '0 0 8px var(--accent-primary)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    padding: '0'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const MockQR = () => {
  const size = 21;
  // Actual "Hello World" (Level M) pattern bits (Simplified representation for clarity)
  const pattern = [
    "11111110010101111111",
    "10000010110001000001",
    "10111010101011011101",
    "10111010001101011101",
    "10111010111001011101",
    "10000010001111000001",
    "11111110101010111111",
    "00000000110100000000",
    "11011101101111111010",
    "00101001101001011011",
    "11101100011110011010",
    "00000000101100111011",
    "11111110111001101010",
    "10000010111101011111",
    "10111010001010110010",
    "10111010111110111101",
    "10111010101010001111",
    "10000010110111110101",
    "11111110101011011010"
  ];
  return (
    <svg width="24" height="24" viewBox="0 0 21 21" fill="none">
      {pattern.map((row, y) =>
        row.split('').map((bit, x) => bit === '1' ? (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
        ) : null)
      )}
    </svg>
  );
};

const FRAME_OPTIONS = [
  {
    id: FRAME_STYLES.NONE,
    label: 'No Frame',
    icon: <div style={{ transform: 'scale(1.4)' }}><MockQR /></div>
  },
  {
    id: FRAME_STYLES.BOX,
    label: 'Square',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="2" y="2" width="48" height="48" rx="2" stroke="black" strokeWidth="3" />
        <g transform="translate(14, 14)"><MockQR /></g>
      </svg>
    )
  },
  {
    id: FRAME_STYLES.ROUNDED,
    label: 'Rounded',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="2" y="2" width="48" height="48" rx="10" stroke="black" strokeWidth="3" />
        <g transform="translate(14, 14)"><MockQR /></g>
      </svg>
    )
  },
  {
    id: FRAME_STYLES.MODERN,
    label: 'Modern',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="2" y="2" width="48" height="48" rx="6" stroke="black" strokeWidth="1.5" strokeDasharray="4 2" />
        <rect x="6" y="6" width="40" height="40" rx="3" stroke="black" strokeWidth="2.5" />
        <g transform="translate(14, 14)"><MockQR /></g>
      </svg>
    )
  },
  {
    id: FRAME_STYLES.SCAN_ME,
    label: 'Scan Me',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M4 38h44v10c0 1-1 2-2 2H6c-1 0-2-1-2-2v-10z" fill="black" />
        <rect x="18" y="44" width="16" height="2" rx="1" fill="white" fillOpacity="0.8" />
        <g transform="translate(14, 10)"><MockQR /></g>
      </svg>
    )
  },
  {
    id: FRAME_STYLES.TEXT_BOTTOM,
    label: 'Stamp',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="6" y="38" width="40" height="10" rx="2" fill="black" />
        <rect x="18" y="42" width="16" height="2" rx="1" fill="white" fillOpacity="0.5" />
        <g transform="translate(14, 10)"><MockQR /></g>
      </svg>
    )
  },
];

/* ── Error Correction Levels ── */
const EC_LEVELS = [
  { key: 'L', label: 'L', pct: '7%', width: 25, desc: 'Low error correction. Best for simple QR codes with clean printing and close-range scanning.' },
  { key: 'M', label: 'M', pct: '15%', width: 50, desc: 'Medium error correction. Good balance for most use cases — recommended as default.' },
  { key: 'Q', label: 'Q', pct: '25%', width: 75, desc: 'Quartile error correction. Recommended when adding a logo or for medium-range scanning.' },
  { key: 'H', label: 'H', pct: '30%', width: 100, desc: 'High error correction. Best for complex logos, small print sizes, or harsh environments.' },
];

const FONT_OPTIONS = [
  { id: 'Inter', label: 'Inter' },
  { id: 'Outfit', label: 'Outfit' },
  { id: 'Montserrat', label: 'Montserrat' },
  { id: 'Playfair Display', label: 'Playfair Display' },
  { id: 'Oswald', label: 'Oswald' },
  { id: 'Pacifico', label: 'Pacifico' },
  { id: 'Caveat', label: 'Caveat' },
  { id: 'Dancing Script', label: 'Dancing Script' },
  { id: 'Bebas Neue', label: 'Bebas Neue' },
  { id: 'Lobster', label: 'Lobster' },
  { id: 'Roboto', label: 'Roboto' },
  { id: 'Open Sans', label: 'Open Sans' },
  { id: 'Lato', label: 'Lato' },
  { id: 'Poppins', label: 'Poppins' },
  { id: 'Raleway', label: 'Raleway' },
  { id: 'Merriweather', label: 'Merriweather' },
  { id: 'Noto Sans', label: 'Noto Sans' },
  { id: 'Ubuntu', label: 'Ubuntu' },
  { id: 'Anton', label: 'Anton' },
  { id: 'Permanent Marker', label: 'Permanent Marker' },
  { id: 'Righteous', label: 'Righteous' },
  { id: 'Cinzel', label: 'Cinzel' },
  { id: 'Courgette', label: 'Courgette' },
  { id: 'Fredoka One', label: 'Fredoka One' },
  { id: 'Great Vibes', label: 'Great Vibes' },
  { id: 'Kanit', label: 'Kanit' },
  { id: 'Luckiest Guy', label: 'Luckiest Guy' },
  { id: 'Orbitron', label: 'Orbitron' },
  { id: 'Quicksand', label: 'Quicksand' },
  { id: 'Satisfy', label: 'Satisfy' },
];

/* ── Error Boundary ── */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.error('QR Engine error:', err); }
  render() {
    if (this.state.hasError) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: 'var(--text-secondary)', padding: 40 }}>
        <QrCode size={48} strokeWidth={1} color="var(--text-muted)" />
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Something went wrong generating your QR.</p>
        <p style={{ fontSize: 13 }}>Please check your input and try again.</p>
        <button className="btn btn-primary btn-sm" onClick={() => this.setState({ hasError: false })}>Try Again</button>
      </div>
    );
    return this.props.children;
  }
}


function parseRawQRText(text) {
  if (!text) return { type: 'text', data: { text: '' } };

  const t = text.trim();

  // 1. WiFi
  // Example: WIFI:T:WPA;S:MySSID;P:password;H:false;;
  if (/^WIFI:/i.test(t)) {
    const ssidMatch = t.match(/S:(.*?)(?:[;]|$)/i);
    const passwordMatch = t.match(/P:(.*?)(?:[;]|$)/i);
    const encryptionMatch = t.match(/T:(.*?)(?:[;]|$)/i);
    const hiddenMatch = t.match(/H:(.*?)(?:[;]|$)/i);

    return {
      type: 'wifi',
      data: {
        ssid: ssidMatch ? ssidMatch[1] : '',
        password: passwordMatch ? passwordMatch[1] : '',
        encryption: encryptionMatch ? encryptionMatch[1] : 'WPA',
        hidden: hiddenMatch ? hiddenMatch[1] === 'true' : false
      }
    };
  }

  // 2. Email
  // Example: mailto:test@example.com?subject=Hello&body=World
  if (/^mailto:/i.test(t)) {
    const email = t.substring(7).split('?')[0];
    const query = t.includes('?') ? t.split('?')[1] : '';
    let subject = '';
    let body = '';
    if (query) {
      const subjectMatch = query.match(/subject=(.*?)(?:[&]|$)/i);
      const bodyMatch = query.match(/body=(.*?)(?:[&]|$)/i);
      if (subjectMatch) subject = decodeURIComponent(subjectMatch[1]);
      if (bodyMatch) body = decodeURIComponent(bodyMatch[1]);
    }
    return {
      type: 'email',
      data: { email, subject, body }
    };
  }

  // 3. Phone
  // Example: tel:+123456789
  if (/^tel:/i.test(t)) {
    return {
      type: 'phone',
      data: { phone: t.substring(4) }
    };
  }

  // 4. SMS
  // Example: smsto:+123456789:Hello World
  if (/^smsto:/i.test(t)) {
    const parts = t.substring(6).split(':');
    const phone = parts[0] || '';
    const message = parts.slice(1).join(':') || '';
    return {
      type: 'sms',
      data: { phone, message }
    };
  }

  // 5. vCard / Contact Card
  if (/^BEGIN:VCARD/i.test(t)) {
    // Parse standard vCard fields
    const firstNameMatch = t.match(/N:(.*?);(.*?)(?:[\r\n]|$)/i);
    const fnMatch = t.match(/FN:(.*?)(?:[\r\n]|$)/i);
    const phoneMatch = t.match(/TEL.*?:(.*?)(?:[\r\n]|$)/i);
    const emailMatch = t.match(/EMAIL.*?:(.*?)(?:[\r\n]|$)/i);
    const orgMatch = t.match(/ORG:(.*?)(?:[\r\n]|$)/i);
    const titleMatch = t.match(/TITLE:(.*?)(?:[\r\n]|$)/i);
    const urlMatch = t.match(/URL.*?:(.*?)(?:[\r\n]|$)/i);

    let firstName = '';
    let lastName = '';
    if (firstNameMatch) {
      lastName = firstNameMatch[1] || '';
      firstName = firstNameMatch[2] || '';
    } else if (fnMatch) {
      const names = fnMatch[1].split(' ');
      firstName = names[0] || '';
      lastName = names.slice(1).join(' ') || '';
    }

    return {
      type: 'vcard',
      data: {
        firstName,
        lastName,
        org: orgMatch ? orgMatch[1] : '',
        title: titleMatch ? titleMatch[1] : '',
        phone: phoneMatch ? phoneMatch[1] : '',
        email: emailMatch ? emailMatch[1] : '',
        url: urlMatch ? urlMatch[1] : ''
      }
    };
  }

  // 6. Location / Geo coordinates
  // Example: geo:37.7749,-122.4194
  if (/^geo:/i.test(t)) {
    const coords = t.substring(4).split(',');
    return {
      type: 'location',
      data: {
        latitude: coords[0] || '',
        longitude: coords[1] || ''
      }
    };
  }

  // 7. WhatsApp
  // Example: https://wa.me/123456789 or https://api.whatsapp.com/send?phone=123456789
  if (/wa\.me/i.test(t) || /whatsapp\.com/i.test(t)) {
    const phoneMatch = t.match(/(?:phone=|wa\.me\/)([0-9+]+)/i);
    const textMatch = t.match(/text=(.*?)(?:[&]|$)/i);
    return {
      type: 'whatsapp',
      data: {
        phone: phoneMatch ? phoneMatch[1] : '',
        message: textMatch ? decodeURIComponent(textMatch[1]) : ''
      }
    };
  }

  // 8. Instagram
  if (/instagram\.com/i.test(t)) {
    const usernameMatch = t.match(/instagram\.com\/([^/?#\s]+)/i);
    return {
      type: 'instagram',
      data: { username: usernameMatch ? usernameMatch[1] : '' }
    };
  }

  // 9. Facebook
  if (/facebook\.com/i.test(t)) {
    const usernameMatch = t.match(/facebook\.com\/([^/?#\s]+)/i);
    return {
      type: 'facebook',
      data: { username: usernameMatch ? usernameMatch[1] : '' }
    };
  }

  // 10. Twitter/X
  if (/twitter\.com/i.test(t) || /x\.com/i.test(t)) {
    const usernameMatch = t.match(/(?:twitter\.com|x\.com)\/([^/?#\s]+)/i);
    return {
      type: 'x',
      data: { username: usernameMatch ? usernameMatch[1] : '' }
    };
  }

  // 11. LinkedIn
  if (/linkedin\.com/i.test(t)) {
    const usernameMatch = t.match(/linkedin\.com\/(?:in|company)\/([^/?#\s]+)/i);
    return {
      type: 'linkedin',
      data: { username: usernameMatch ? usernameMatch[1] : t }
    };
  }

  // 12. YouTube
  if (/youtube\.com|youtu\.be/i.test(t)) {
    return {
      type: 'youtube',
      data: { url: t }
    };
  }

  // 13. URL (falls back to URL if it looks like one)
  if (/^https?:\/\//i.test(t) || /^www\./i.test(t) || /^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.[a-z]{2,}(\/.*)?$/i.test(t)) {
    return {
      type: 'url',
      data: { url: t.startsWith('http') ? t : 'https://' + t }
    };
  }

  // 14. Fallback to Text
  return {
    type: 'text',
    data: { text: t }
  };
}

export default function App() {
  // ── Tab & Theme ──
  const location = useLocation();
  const navigate = useNavigate();

  const getPageFromPath = (path) => {
    if (path === '/generator') return 'generator';
    if (path === '/settings') return 'settings';
    if (path === '/saved') return 'saved';
    if (path === '/history') return 'history';
    if (path === '/scanner') return 'scanner';
    if (path === '/batch') return 'batch';
    if (path === '/barcode') return 'barcode';
    if (path === '/scanner-gun') return 'scanner-gun';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState('content');
  const [tabHistory, setTabHistory] = useState([]);
  const [activePage, setActivePage] = useState(() => {
    return location.state?.activePage || getPageFromPath(location.pathname);
  });
  const [previousPage, setPreviousPage] = useState('home');
  const [theme, setTheme] = useState('auto');
  const [effectiveTheme, setEffectiveTheme] = useState('dark');
  const [historyFilter, setHistoryFilter] = useState('All');

  useEffect(() => {
    const page = location.state?.activePage || getPageFromPath(location.pathname);
    if (page !== activePage) {
      setActivePage(page);
      
      if (page !== 'generator') {
        setIsDataModalOpen(false);
        setAdvPicker(prev => ({ ...prev, open: false }));
        setFormatDropdownOpen(false);
        setActiveBatchItemIndex(null);
      }
    }
    if (location.state) {
      if (location.state.qrType) setQrType(location.state.qrType);
      if (location.state.qrData) setQrData(location.state.qrData);
      if (location.state.isDataModalOpen !== undefined) setIsDataModalOpen(location.state.isDataModalOpen);
      if (location.state.loadedBarcodeItem) setLoadedBarcodeItem(location.state.loadedBarcodeItem);
    }
  }, [location.pathname, location.state, activePage]);



  const goBack = () => {
    // 1. Close overlays first
    if (advPicker.open) {
      setAdvPicker(prev => ({ ...prev, open: false }));
      return;
    }
    if (formatDropdownOpen) {
      setFormatDropdownOpen(false);
      return;
    }
    if (isNavExpanded) {
      setIsNavExpanded(false);
      return;
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    if (isDataModalOpen) {
      setIsDataModalOpen(false);
      return;
    }

    // 2. Navigation logic
    if (activePage === 'scanner') {
      // From Scan to Home or Exit if launched from widget
      if (launchedDirectlyToScanner) {
        CapApp.exitApp();
      } else {
        navigateTo('home');
      }
    } else if (activePage === 'generator') {
      // ── IMPROVED CREATOR NAVIGATION ──
      // If we have tab history, go back to previous tab
      if (tabHistory.length > 0) {
        const lastTab = tabHistory[tabHistory.length - 1];
        setTabHistory(prev => prev.slice(0, -1));
        setActiveTab(lastTab);
        return;
      }

      // If no tab history, exit to home immediately
      navigateTo(previousPage || 'home');
    } else if (activePage === 'history') {
      // From History/Recent/Menu to previous tab
      navigateTo(previousPage || 'home');
    } else if (activePage !== 'home') {
      navigateTo('home');
    }
  };

  // Resolve Auto Theme
  useEffect(() => {
    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const check = (e) => setEffectiveTheme(e.matches ? 'dark' : 'light');
      setEffectiveTheme(mq.matches ? 'dark' : 'light');
      mq.addEventListener('change', check);
      return () => mq.removeEventListener('change', check);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);



  // ── QR Content ──
  const [qrType, setQrType] = useState(() => location.state?.qrType || QR_TYPES.URL);
  const [qrData, setQrData] = useState(() => location.state?.qrData || { url: 'https://example.com' });
  const [errorLevel, setErrorLevel] = useState('M');
  const [loadedItemId, setLoadedItemId] = useState(null);
  const [loadedBarcodeItem, setLoadedBarcodeItem] = useState(() => location.state?.loadedBarcodeItem || null);
  const [launchedDirectlyToScanner, setLaunchedDirectlyToScanner] = useState(false);
  // Tracks whether the user has meaningfully changed the QR generator since it was last reset/loaded
  const generatorIsDirtyRef = useRef(false);
  const ignoreDirtyRef = useRef(false);

  // ── Batch QR ──
  const [batchItems, setBatchItems] = useState([]);
  const [activeBatchItemIndex, setActiveBatchItemIndex] = useState(null);

  // ── Colors ──
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgTransparent, setBgTransparent] = useState(false);
  const [eyeColor, setEyeColor] = useState('');
  const [eyeOuterColor, setEyeOuterColor] = useState('');
  const [syncEyes, setSyncEyes] = useState(true);
  const [activePreset, setActivePreset] = useState(null);
  const [presetTab, setPresetTab] = useState('solid');
  const [eyeColorTab, setEyeColorTab] = useState('inner');
  const [syncInnerOuterEyes, setSyncInnerOuterEyes] = useState(true);
  const [isPipetteActive, setIsPipetteActive] = useState(false);
  const [pipetteTarget, setPipetteTarget] = useState(null); // { setter }
  const [hoverColor, setHoverColor] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [canvasSelection, setCanvasSelection] = useState(null); // 'logo' | 'text' | null

  // ── Gradient ──
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#6c5ce7');
  const [gradientColor2, setGradientColor2] = useState('#a78bfa');
  const [gradientType, setGradientType] = useState('linear');
  
  // ── QR Texture ──
  const [qrTextureEnabled, setQrTextureEnabled] = useState(false);
  const [qrTexture, setQrTexture] = useState(null); // { src, image, name }
  const [qrTextureSyncEyes, setQrTextureSyncEyes] = useState(true);

  // ── Shapes ──
  const [dotStyle, setDotStyle] = useState(DOT_STYLES.SQUARE);
  const [eyeStyle, setEyeStyle] = useState(EYE_STYLES.SQUARE);
  const [dotPadding, setDotPadding] = useState(0);
  const [eyePadding, setEyePadding] = useState(0);

  // ── Logo ──
  const [logo, setLogo] = useState(null);
  const [logoWidth, setLogoWidth] = useState(0.18);
  const [logoHeight, setLogoHeight] = useState(0.18);
  const [logoPadding, setLogoPadding] = useState(10);
  const [logoBackground, setLogoBackground] = useState(false);
  const [logoBgColor, setLogoBgColor] = useState('#ffffff');
  const [logoBgShape, setLogoBgShape] = useState('circle');
  const [logoOutline, setLogoOutline] = useState(false);
  const [logoOutlineColor, setLogoOutlineColor] = useState('#ffffff');
  const [logoOutlineWidth, setLogoOutlineWidth] = useState(3);
  const [logoOutlineOpacity, setLogoOutlineOpacity] = useState(1);
  const [logoPosX, setLogoPosX] = useState(0.5);
  const [logoPosY, setLogoPosY] = useState(0.5);

  // New Logo Features
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [logoRotation, setLogoRotation] = useState(0);
  const [logoShadowEnabled, setLogoShadowEnabled] = useState(false);
  const [logoShadowColor, setLogoShadowColor] = useState('rgba(0,0,0,0.5)');
  const [logoShadowBlur, setLogoShadowBlur] = useState(10);
  const [logoShadowOffsetX, setLogoShadowOffsetX] = useState(0);
  const [logoShadowOffsetY, setLogoShadowOffsetY] = useState(4);
  const [logoInnerShadowEnabled, setLogoInnerShadowEnabled] = useState(false);
  const [logoEraseColorEnabled, setLogoEraseColorEnabled] = useState(false);
  const [logoEraseColor, setLogoEraseColor] = useState('#ffffff');
  const [logoEraseMode, setLogoEraseMode] = useState('none'); // 'none' | 'white' | 'black' | 'custom'
  const [logoEraseTolerance, setLogoEraseTolerance] = useState(50);
  const [logoEraseSmoothing, setLogoEraseSmoothing] = useState(10);
  const [logoTexture, setLogoTexture] = useState('none');
  const [logoCrop, setLogoCrop] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [logoAspectRatioLocked, setLogoAspectRatioLocked] = useState(true);

  // ── Frame ──
  const [frameStyle, setFrameStyle] = useState('none');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameColor, setFrameColor] = useState('');
  const [frameFont, setFrameFont] = useState('Inter');
  const [frameSize, setFrameSize] = useState(0.12);
  const [frameStrokeEnabled, setFrameStrokeEnabled] = useState(false);
  const [frameStrokeWidth, setFrameStrokeWidth] = useState(5);
  const [frameStrokeColor, setFrameStrokeColor] = useState('#ffffff');
  const [frameShadowEnabled, setFrameShadowEnabled] = useState(false);
  const [frameShadowBlur, setFrameShadowBlur] = useState(10);
  const [frameShadowColor, setFrameShadowColor] = useState('rgba(0,0,0,0.5)');
  const [framePosition, setFramePosition] = useState('bottom'); // 'top' | 'bottom'
  const [frameRotation, setFrameRotation] = useState(0); // 0-360
  const [textCenterEnabled, setTextCenterEnabled] = useState(false);
  const [textPopup, setTextPopup] = useState(null);
  const [logoPopup, setLogoPopup] = useState(null);
  const [textEditMode, setTextEditMode] = useState('center');

  const [textCenterText, setTextCenterText] = useState('');
  const [textCenterSize, setTextCenterSize] = useState(0.08);
  const [textCenterColor, setTextCenterColor] = useState('#000000');
  const [textCenterFont, setTextCenterFont] = useState('Inter');
  const [textCenterStrokeEnabled, setTextCenterStrokeEnabled] = useState(false);
  const [textCenterStrokeWidth, setTextCenterStrokeWidth] = useState(5);
  const [textCenterStrokeColor, setTextCenterStrokeColor] = useState('#ffffff');
  const [textCenterShadowEnabled, setTextCenterShadowEnabled] = useState(false);
  const [textCenterShadowBlur, setTextCenterShadowBlur] = useState(10);
  const [textCenterShadowColor, setTextCenterShadowColor] = useState('rgba(0,0,0,0.5)');
  const [textCenterPosX, setTextCenterPosX] = useState(0.5);
  const [textCenterPosY, setTextCenterPosY] = useState(0.5);
  const [textCenterRotation, setTextCenterRotation] = useState(0);
  const [textCenterWidth, setTextCenterWidth] = useState(null); // null means auto
  const [textCenterHeight, setTextCenterHeight] = useState(null); // null means auto
  const [colorPopup, setColorPopup] = useState(null);
  const [shapePopup, setShapePopup] = useState(null);

  // ── References ──
  const canvasRef = useRef(null);
  const latestThumbnailRef = useRef(null);
  const loupeCanvasRef = useRef(null);
  const renderTimeoutRef = useRef(null);
  const tempCanvas = useRef(document.createElement('canvas'));
  const tempCtx = useRef(tempCanvas.current.getContext('2d'));
  const [qrMatrixInfo, setQrMatrixInfo] = useState(null);
  const [toast, setToast] = useState(null);
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  // ── Advanced Picker State ──
  const [advPicker, setAdvPicker] = useState({ open: false, color: '#000000', setter: null });
  const handleOpenAdv = (color, setter) => setAdvPicker({ open: true, color, setter });
  const [selectedFormat, setSelectedFormat] = useState('PNG');
  const [exportQuality, setExportQuality] = useState('High'); // Default to High (2048px)
  const [isDataModalOpen, setIsDataModalOpen] = useState(() => location.state?.isDataModalOpen || false);
  const [unsavedChangesModal, setUnsavedChangesModal] = useState({ isOpen: false, nextPage: null });
  const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);
  const downloadBtnRef = useRef(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragType = useRef(null); // 'logo' or 'text'
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const [customFonts, setCustomFonts] = useState([]);
  const fontInputRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalUpdate = useRef(false);
  const preEditSnapshot = useRef(null);

  const startEditing = (type, val) => {
    if (!preEditSnapshot.current) {
      preEditSnapshot.current = getSnapshot();
    }
    if (type === 'logo') {
      setLogoPopup(val);
      setCanvasSelection('logo');
    } else if (type === 'text') {
      setTextPopup(val);
      if (canvasSelection !== 'text' && canvasSelection !== 'frame-text') {
        setCanvasSelection('text');
        setTextEditMode('center');
      }
    } else if (type === 'color') {
      setColorPopup(val);
      setCanvasSelection(null);
    } else if (type === 'shapes') {
      setShapePopup(val);
      setCanvasSelection(null);
    }
  };

  const cancelEditing = () => {
    if (preEditSnapshot.current) {
      applySnapshot(preEditSnapshot.current);
    }
    setLogoPopup(null);
    setTextPopup(null);
    setColorPopup(null);
    setShapePopup(null);
    setCanvasSelection(null);
    preEditSnapshot.current = null;
  };

  const applyEditing = () => {
    setLogoPopup(null);
    setTextPopup(null);
    setColorPopup(null);
    setShapePopup(null);
    setCanvasSelection(null);
    preEditSnapshot.current = null;
    saveSnapshot(); // Save the final result to history
  };

  const handleTabChange = (tabId) => {
    if (tabId !== activeTab) {
      if (logoPopup || textPopup || colorPopup || shapePopup) {
        applyEditing();
      }
      setTabHistory(prev => [...prev, activeTab]);
      setActiveTab(tabId);

      // Manage canvas selections for interactive outlines/handles
      if (tabId === 'text') {
        if (canvasSelection !== 'text' && canvasSelection !== 'frame-text') {
          setCanvasSelection('text');
          setTextEditMode('center');
        }
      } else if (tabId === 'logo') {
        setCanvasSelection('logo');
      } else {
        setCanvasSelection(null);
      }
    }
  };

  const [batchPageDefaultType, setBatchPageDefaultType] = useState('QR');

  // Custom navigation wrapper to track history
  const navigateTo = (page, type = 'QR') => {
    if (page === 'batch') {
      setBatchPageDefaultType(type);
    }
    if (page === 'history') {
      setHistoryFilter(type === 'Scanned' ? 'Scanned' : type === 'Created' ? 'Created' : 'All');
    }
    if (page !== activePage) {
      if (activePage === 'generator' && generatorIsDirtyRef.current) {
        setUnsavedChangesModal({ isOpen: true, nextPage: page });
        return;
      }
      performNavigation(page);
    }
  };

  const performNavigation = (page) => {
    if (page !== 'scanner') {
      setLaunchedDirectlyToScanner(false);
    }
    if (logoPopup || textPopup || colorPopup || shapePopup) {
      applyEditing();
    }
    setCanvasSelection(null);
    setPreviousPage(activePage);

    if (page !== 'generator') {
      setIsDataModalOpen(false);
      setAdvPicker(prev => ({ ...prev, open: false }));
      setFormatDropdownOpen(false);
      setActiveBatchItemIndex(null);
    }

    let path = '/';
    if (page === 'generator') path = '/generator';
    else if (page === 'settings') path = '/settings';
    else if (page === 'saved') path = '/saved';
    else if (page === 'history') path = '/history';
    else if (page === 'scanner') path = '/scanner';
    else if (page === 'batch') path = '/batch';
    else if (page === 'barcode') path = '/barcode';
    else if (page === 'scanner-gun') path = '/scanner-gun';

    if (location.pathname !== path) {
      navigate(path);
    }

    setActivePage(page);
    // Clear tab history when starting a new session or returning home
    if (page === 'generator' || page === 'home') {
      setTabHistory([]);
      if (page === 'generator') {
        setActiveTab('content');
        setCanvasSelection(null);
      }
    }
  };

  // ── Native App Actions / Deep Links (from Widget or quick settings tile) ──
  useEffect(() => {
    // 1. Check cold boot action via Android Javascript Interface or stored initial action
    try {
      let action = window.INITIAL_ACTION;
      if (!action && window.NativeAndroidApp && typeof window.NativeAndroidApp.getPendingAction === 'function') {
        action = window.NativeAndroidApp.getPendingAction();
      }
      if (action === 'scan') {
        setLaunchedDirectlyToScanner(true);
        navigateTo('scanner');
      }
    } catch (e) {
      console.warn('Native JS interface check failed:', e);
    }

    // 2. Listen for hot start action event dispatched from MainActivity
    const handleAppAction = (e) => {
      if (e.detail === 'scan') {
        setLaunchedDirectlyToScanner(true);
        navigateTo('scanner');
      }
    };
    window.addEventListener('appAction', handleAppAction);
    return () => window.removeEventListener('appAction', handleAppAction);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSnapshot = useCallback(() => {
    return {
      qrType, qrData, qrColor, bgColor, bgTransparent, eyeColor, eyeOuterColor, syncEyes,
      gradientEnabled, gradientColor1, gradientColor2, gradientType,
      qrTextureEnabled, qrTexture: qrTexture ? { src: qrTexture.src, name: qrTexture.name } : null,
      qrTextureSyncEyes,
      dotStyle, eyeStyle, dotPadding, eyePadding,
      logo: logo ? { src: logo.src, name: logo.name } : null,
      logoWidth, logoHeight, logoPadding, logoBackground, logoBgColor, logoBgShape,
      logoOutline, logoOutlineColor, logoOutlineWidth, logoPosX, logoPosY,
      logoOpacity, logoRotation, logoShadowEnabled, logoShadowColor, logoShadowBlur, logoShadowOffsetX, logoShadowOffsetY,
      logoInnerShadowEnabled, logoEraseColorEnabled, logoEraseColor, logoEraseTolerance, logoEraseSmoothing, logoTexture, logoCrop, logoAspectRatioLocked,
      frameStyle, frameText, frameColor, frameFont, frameSize,
      frameStrokeEnabled, frameStrokeWidth, frameStrokeColor,
      frameShadowEnabled, frameShadowBlur, frameShadowColor,
      framePosition, frameRotation,
      textCenterEnabled, textCenterText, textCenterSize, textCenterColor, textCenterFont,
      textCenterStrokeEnabled, textCenterStrokeWidth, textCenterStrokeColor,
      textCenterShadowEnabled, textCenterShadowBlur, textCenterShadowColor,
      textCenterPosX, textCenterPosY, textCenterRotation,
      textCenterWidth, textCenterHeight,
      errorLevel
    };
  }, [
    qrType, qrData, qrColor, bgColor, bgTransparent, eyeColor, eyeOuterColor, syncEyes,
    gradientEnabled, gradientColor1, gradientColor2, gradientType,
    qrTextureEnabled, qrTexture, qrTextureSyncEyes,
    dotStyle, eyeStyle, dotPadding, eyePadding,
    logo, logoWidth, logoHeight, logoPadding, logoBackground, logoBgColor, logoBgShape,
    logoOutline, logoOutlineColor, logoOutlineWidth, logoPosX, logoPosY,
    logoOpacity, logoRotation, logoShadowEnabled, logoShadowColor, logoShadowBlur, logoShadowOffsetX, logoShadowOffsetY,
    logoInnerShadowEnabled, logoEraseColorEnabled, logoEraseColor, logoEraseTolerance, logoEraseSmoothing, logoTexture, logoCrop, logoAspectRatioLocked,
    frameStyle, frameText, frameColor, frameFont, frameSize,
    frameStrokeEnabled, frameStrokeWidth, frameStrokeColor,
    frameShadowEnabled, frameShadowBlur, frameShadowColor,
    framePosition, frameRotation,
    textCenterEnabled, textCenterText, textCenterSize, textCenterColor, textCenterFont,
    textCenterStrokeEnabled, textCenterStrokeWidth, textCenterStrokeColor,
    textCenterShadowEnabled, textCenterShadowBlur, textCenterShadowColor,
    textCenterPosX, textCenterPosY, textCenterRotation, textCenterWidth, textCenterHeight,
    errorLevel
  ]);

  const saveSnapshot = useCallback(() => {
    if (isInternalUpdate.current) return;
    if (!ignoreDirtyRef.current) {
      generatorIsDirtyRef.current = true;
    }
    const current = getSnapshot();
    
    // Avoid saving if the current state matches the one we're already at in history
    // This prevents Redo from breaking after an Undo action.
    if (historyIndex >= 0 && history[historyIndex]) {
      if (JSON.stringify(current) === JSON.stringify(history[historyIndex])) return;
    }

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(current);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => {
      const newIndex = (historyIndex < 49) ? historyIndex + 1 : 49;
      return newIndex;
    });
  }, [getSnapshot, historyIndex, history]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const prevIndex = historyIndex - 1;
    const snapshot = history[prevIndex];
    applySnapshot(snapshot);
    setHistoryIndex(prevIndex);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const snapshot = history[nextIndex];
    applySnapshot(snapshot);
    setHistoryIndex(nextIndex);
  }, [history, historyIndex]);

  const applySnapshot = (s) => {
    isInternalUpdate.current = true;
    if (s.qrType !== undefined) setQrType(s.qrType);
    if (s.qrData !== undefined) setQrData(s.qrData);
    if (s.qrTextureEnabled !== undefined) setQrTextureEnabled(s.qrTextureEnabled);
    if (s.qrTextureSyncEyes !== undefined) setQrTextureSyncEyes(s.qrTextureSyncEyes);
    if (s.qrTexture) {
      const img = new Image();
      img.onload = () => setQrTexture({ ...s.qrTexture, image: img });
      img.src = s.qrTexture.src;
    } else if (s.qrTexture === null) {
      setQrTexture(null);
    }
    if (s.qrColor !== undefined) setQrColor(s.qrColor);
    if (s.bgColor !== undefined) setBgColor(s.bgColor);
    if (s.bgTransparent !== undefined) setBgTransparent(s.bgTransparent);
    if (s.eyeColor !== undefined) setEyeColor(s.eyeColor);
    if (s.eyeOuterColor !== undefined) setEyeOuterColor(s.eyeOuterColor);
    if (s.syncEyes !== undefined) setSyncEyes(s.syncEyes);
    if (s.gradientEnabled !== undefined) setGradientEnabled(s.gradientEnabled);
    if (s.gradientColor1 !== undefined) setGradientColor1(s.gradientColor1);
    if (s.gradientColor2 !== undefined) setGradientColor2(s.gradientColor2);
    if (s.gradientType !== undefined) setGradientType(s.gradientType);
    if (s.dotStyle !== undefined) setDotStyle(s.dotStyle);
    if (s.eyeStyle !== undefined) setEyeStyle(s.eyeStyle);
    if (s.dotPadding !== undefined) setDotPadding(s.dotPadding);
    if (s.eyePadding !== undefined) setEyePadding(s.eyePadding);
    
    const logoData = s.logo || (s.logoSrc ? { src: s.logoSrc, name: s.logoName } : null);
    if (logoData && logoData.src) {
      if (!logo || logo.src !== logoData.src) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setLogo({ src: logoData.src, name: logoData.name || 'Logo', image: img });
        img.src = logoData.src;
      }
    } else {
      setLogo(null);
    }

    if (s.logoWidth !== undefined) setLogoWidth(s.logoWidth);
    if (s.logoHeight !== undefined) setLogoHeight(s.logoHeight);
    if (s.logoAspectRatioLocked !== undefined) setLogoAspectRatioLocked(s.logoAspectRatioLocked);
    if (s.logoPadding !== undefined) setLogoPadding(s.logoPadding);
    if (s.logoBackground !== undefined) setLogoBackground(s.logoBackground);
    if (s.logoBgColor !== undefined) setLogoBgColor(s.logoBgColor);
    if (s.logoBgShape !== undefined) setLogoBgShape(s.logoBgShape);
    if (s.logoOutline !== undefined) setLogoOutline(s.logoOutline);
    if (s.logoOutlineColor !== undefined) setLogoOutlineColor(s.logoOutlineColor);
    if (s.logoOutlineWidth !== undefined) setLogoOutlineWidth(s.logoOutlineWidth);
    if (s.logoPosX !== undefined) setLogoPosX(s.logoPosX);
    if (s.logoPosY !== undefined) setLogoPosY(s.logoPosY);
    if (s.logoEraseColorEnabled !== undefined) {
      setLogoEraseColorEnabled(s.logoEraseColorEnabled);
      if (!s.logoEraseColorEnabled) {
        setLogoEraseMode('none');
      }
    }
    if (s.logoEraseColor !== undefined) {
      setLogoEraseColor(s.logoEraseColor);
      if (s.logoEraseColorEnabled) {
        const c = s.logoEraseColor.toLowerCase();
        if (c === '#ffffff') setLogoEraseMode('white');
        else if (c === '#000000') setLogoEraseMode('black');
        else setLogoEraseMode('custom');
      }
    }
    if (s.logoEraseTolerance !== undefined) setLogoEraseTolerance(s.logoEraseTolerance);
    if (s.logoEraseSmoothing !== undefined) setLogoEraseSmoothing(s.logoEraseSmoothing);
    if (s.frameStyle !== undefined) setFrameStyle(s.frameStyle);
    if (s.frameText !== undefined) setFrameText(s.frameText);
    if (s.frameColor !== undefined) setFrameColor(s.frameColor);
    if (s.frameFont !== undefined) setFrameFont(s.frameFont);
    if (s.frameSize !== undefined) setFrameSize(s.frameSize);
    if (s.frameStrokeEnabled !== undefined) setFrameStrokeEnabled(s.frameStrokeEnabled);
    if (s.frameStrokeWidth !== undefined) setFrameStrokeWidth(s.frameStrokeWidth);
    if (s.frameStrokeColor !== undefined) setFrameStrokeColor(s.frameStrokeColor);
    if (s.frameShadowEnabled !== undefined) setFrameShadowEnabled(s.frameShadowEnabled);
    if (s.frameShadowBlur !== undefined) setFrameShadowBlur(s.frameShadowBlur);
    if (s.frameShadowColor !== undefined) setFrameShadowColor(s.frameShadowColor);
    if (s.framePosition !== undefined) setFramePosition(s.framePosition);
    if (s.frameRotation !== undefined) setFrameRotation(s.frameRotation);
    if (s.textCenterEnabled !== undefined) setTextCenterEnabled(s.textCenterEnabled);
    if (s.textCenterText !== undefined) setTextCenterText(s.textCenterText);
    if (s.textCenterSize !== undefined) setTextCenterSize(s.textCenterSize);
    if (s.textCenterColor !== undefined) setTextCenterColor(s.textCenterColor);
    if (s.textCenterFont !== undefined) setTextCenterFont(s.textCenterFont);
    if (s.textCenterStrokeEnabled !== undefined) setTextCenterStrokeEnabled(s.textCenterStrokeEnabled);
    if (s.textCenterStrokeWidth !== undefined) setTextCenterStrokeWidth(s.textCenterStrokeWidth);
    if (s.textCenterStrokeColor !== undefined) setTextCenterStrokeColor(s.textCenterStrokeColor);
    if (s.textCenterShadowEnabled !== undefined) setTextCenterShadowEnabled(s.textCenterShadowEnabled);
    if (s.textCenterShadowBlur !== undefined) setTextCenterShadowBlur(s.textCenterShadowBlur);
    if (s.textCenterShadowColor !== undefined) setTextCenterShadowColor(s.textCenterShadowColor);
    if (s.textCenterPosX !== undefined) setTextCenterPosX(s.textCenterPosX);
    if (s.textCenterPosY !== undefined) setTextCenterPosY(s.textCenterPosY);
    if (s.textCenterRotation !== undefined) setTextCenterRotation(s.textCenterRotation);
    if (s.textCenterWidth !== undefined) setTextCenterWidth(s.textCenterWidth);
    if (s.textCenterHeight !== undefined) setTextCenterHeight(s.textCenterHeight);
    if (s.errorLevel !== undefined) setErrorLevel(s.errorLevel);
    
    setTimeout(() => { isInternalUpdate.current = false; }, 50);
  };

  // Initial snapshot
  useEffect(() => {
    if (history.length === 0) {
      const initial = getSnapshot();
      setHistory([initial]);
      setHistoryIndex(0);
    }
  }, []);

  // Debounced auto-save for continuous and discrete changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveSnapshot();
    }, 800); // Slightly faster debounce
    return () => clearTimeout(timer);
  }, [
    qrColor, bgColor, logoWidth, logoHeight, logoPosX, logoPosY, textCenterSize, textCenterPosX, textCenterPosY,
    frameSize, dotPadding, eyePadding, textCenterText, frameText,
    dotStyle, eyeStyle, qrType, logo, syncEyes, gradientEnabled, frameStyle,
    eyeColor, eyeOuterColor, logoBackground, logoOutline, textCenterEnabled,
    framePosition, frameRotation, textCenterRotation
  ]);

  const handleFontUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fontName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const fontData = event.target.result;
        const fontFace = new FontFace(fontName, fontData);
        const loadedFace = await fontFace.load();
        document.fonts.add(loadedFace);
        
        const newFont = { id: fontName, label: file.name.split('.')[0], isCustom: true };
        setCustomFonts(prev => [...prev, newFont]);
        setTextCenterFont(fontName);
        showToast(`Font "${file.name}" installed successfully!`, 'success');
      } catch (err) {
        console.error('Font load error:', err);
        showToast('Failed to load font file. Use TTF, OTF or WOFF.', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
    // Reset input so same file can be uploaded again if needed
    e.target.value = '';
  };

  // ── Menu ──
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ── Bottom Nav Toggle ──
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // ── Mobile App Fixes (Capacitor) ──
  useEffect(() => {
    const updateStatusBar = async () => {
      try {
        await StatusBar.show();
        // Set overlaysWebView to TRUE and add padding in CSS for the 24dp status bar
        await StatusBar.setOverlaysWebView({ overlay: true });
        
        if (effectiveTheme === 'dark') {
          await StatusBar.setStyle({ style: 'DARK' }); // Light text/icons for dark background
          await StatusBar.setBackgroundColor({ color: '#00000000' });
        } else {
          await StatusBar.setStyle({ style: 'LIGHT' }); // Dark text/icons for light background
          await StatusBar.setBackgroundColor({ color: '#00000000' });
        }
      } catch (e) {
        console.warn('StatusBar plugin failed to update:', e);
      }
    };
    updateStatusBar();
  }, [effectiveTheme]);


  // ── Sync Eyes color with dots color when syncEyes is ON ──
  useEffect(() => {
    if (syncEyes) {
      setEyeColor(qrColor);
      setEyeOuterColor(qrColor);
    }
  }, [syncEyes, qrColor]);

  // ── Auto Theme Logic ──
  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.theme) {
      setTheme(prefs.theme);
    } else {
      // Auto-detect system preference if no user preference is saved
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-update if the user hasn't explicitly set a preference
      const currentPrefs = getPreferences();
      if (!currentPrefs.theme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);


  // ── Helper: build a human-readable display name from qrType + qrData ──
  const getQRDisplayName = (type, data) => {
    if (!data) return 'QR Code';
    switch (type) {
      case QR_TYPES.URL:    return data.url || 'QR Code';
      case QR_TYPES.TEXT:   return data.text || 'QR Code';
      case QR_TYPES.EMAIL:  return data.email || data.subject || 'Email QR';
      case QR_TYPES.PHONE:  return data.phone || 'Phone QR';
      case QR_TYPES.SMS:    return data.phone || data.message || 'SMS QR';
      case QR_TYPES.WIFI:   return data.ssid ? `Wi-Fi: ${data.ssid}` : 'Wi-Fi QR';
      case QR_TYPES.VCARD:  return [data.firstName, data.lastName].filter(Boolean).join(' ') || data.organization || 'Contact QR';
      case QR_TYPES.GEO:    return (data.latitude && data.longitude) ? `${data.latitude}, ${data.longitude}` : 'Location QR';
      case QR_TYPES.EVENT:  return data.summary || data.title || 'Event QR';
      case QR_TYPES.CRYPTO: return data.address || 'Crypto QR';
      default:              return formatQRData(type, data)?.substring(0, 50) || 'QR Code';
    }
  };

  // ── Unsaved Changes Modal Actions ──
  const handleSaveAndExit = () => {
    const dataString = formatQRData(qrType, qrData);
    if (dataString) {
      const displayText = getQRDisplayName(qrType, qrData);
      
      if (loadedItemId && loadedItemId.startsWith('saved_')) {
        saveToSaved({
          id: loadedItemId,
          source: 'create',
          qrType, qrData, displayText: displayText.substring(0, 80), errorLevel,
          ...getSnapshot(),
          thumbnail: latestThumbnailRef.current || canvasRef.current?.toDataURL('image/jpeg', 0.8) || null
        });
      } else {
        const savedEntry = saveToHistory({
          id: loadedItemId,
          source: 'create',
          qrType, qrData, displayText: displayText.substring(0, 80), errorLevel,
          ...getSnapshot(),
          thumbnail: latestThumbnailRef.current || canvasRef.current?.toDataURL('image/jpeg', 0.8) || null
        });
        if (savedEntry && savedEntry.id) {
          setLoadedItemId(savedEntry.id);
        }
      }
    }
    generatorIsDirtyRef.current = false;
    const nextPage = unsavedChangesModal.nextPage;
    setUnsavedChangesModal({ isOpen: false, nextPage: null });
    performNavigation(nextPage);
  };

  const handleDiscardAndExit = () => {
    generatorIsDirtyRef.current = false;
    const nextPage = unsavedChangesModal.nextPage;
    setUnsavedChangesModal({ isOpen: false, nextPage: null });
    performNavigation(nextPage);
  };

  const handleCancelExit = () => {
    setUnsavedChangesModal({ isOpen: false, nextPage: null });
  };

  // ── Auto-upgrade error correction when logo is present ──
  useEffect(() => {
    if (logo) {
      setErrorLevel(prev => (prev === 'L' || prev === 'M') ? 'H' : prev);
    } else {
      setErrorLevel(prev => prev === 'H' ? 'M' : prev);
    }
  }, [logo]);

  // ── Back Button Handling (Centralized) ──
  const lastBackPress = useRef(0);
  const backHandlerRef = useRef();

  backHandlerRef.current = () => {
    if (activePage === 'home' && !advPicker.open && !formatDropdownOpen && !isMenuOpen && !isDataModalOpen) {
      const now = Date.now();
      if (now - lastBackPress.current < 2000) {
        CapApp.exitApp();
      } else {
        lastBackPress.current = now;
        showToast('Press back again to exit', 'info');
      }
    } else {
      goBack();
    }
  };

  useEffect(() => {
    const setupListener = async () => {
      const backListener = await CapApp.addListener('backButton', (data) => {
        // data.canGoBack is available but we handle navigation internally
        if (backHandlerRef.current) {
          backHandlerRef.current();
        }
      });
      return backListener;
    };

    const listenerPromise = setupListener();
    
    return () => {
      listenerPromise.then(l => l.remove());
    };
  }, []); // Run once on mount

  // ── Update body theme ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  // ── Close dropdown/menu on outside click ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadBtnRef.current && !downloadBtnRef.current.contains(e.target)) {
        setFormatDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // ── Toast ──
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Copy to Clipboard ──
  const handleCopyToClipboard = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Copied to clipboard!');
      } catch (err) {
        showToast('Copy not supported in this browser', 'error');
      }
    });
  };

  // ── Share ──
  const handleShare = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      try {
        if (Capacitor.isNativePlatform()) {
          try { await Filesystem.requestPermissions(); } catch {}
          const base64Data = canvasRef.current.toDataURL('image/png').split(',')[1];
          const filename = `qrcode_${Date.now()}.png`;
          const savedFile = await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: Directory.Cache
          });
          await Share.share({
            title: 'Mushi Qr Pro',
            url: savedFile.uri,
            dialogTitle: 'Share your QR Code'
          });
          showToast('Shared successfully!');
        } else {
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });
          await navigator.share({ files: [file], title: 'My QR Code' });
          showToast('Shared successfully!');
        }
      } catch (err) {
        if (err.name !== 'AbortError') showToast('Share failed', 'error');
      }
    });
  };

  // ── Download ──
  const FORMAT_MAP = { PNG: downloadPNG, SVG: downloadSVG, PDF: downloadPDF, JPG: downloadJPG };
  const QUALITY_SIZES = {
    'Low': 512,
    'Medium': 1024,
    'High': 2048,
    'Ultra': 4096
  };

  const generateExportCanvas = (exportSize) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = exportSize;
    tempCanvas.height = exportSize;
    
    renderQR(tempCanvas, {
      ...qrMatrixInfo, 
      size: exportSize,
      qrColor, bgColor, bgTransparent, dotStyle, eyeStyle,
      eyeColor,
      eyeOuterColor,
      syncEyes,
      dotPadding, eyePadding,
      gradientEnabled,
      gradientColor1,
      gradientColor2,
      gradientType,
      qrTextureEnabled,
      qrTexture,
      qrTextureSyncEyes,
      logo: logo?.image, logoWidth, logoHeight, logoPadding,
      logoBackground, logoBgColor, logoBgShape,
      logoOutline, logoOutlineColor, logoOutlineWidth, logoOutlineOpacity,
      quietZone: 2, frameStyle, frameText, frameColor, frameFont,
      frameSize,
      frameStrokeEnabled,
      frameStrokeWidth,
      frameStrokeColor,
      frameShadowEnabled,
      frameShadowBlur,
      frameShadowColor,
      framePosition,
      frameRotation,
      textCenterEnabled, 
      textCenter: textCenterEnabled ? textCenterText : null,
      textCenterSize, textCenterColor, textCenterFont,
      textCenterStrokeEnabled, textCenterStrokeWidth, textCenterStrokeColor,
      textCenterShadowEnabled, textCenterShadowBlur, textCenterShadowColor,
      textCenterPosX, textCenterPosY, textCenterRotation,
      textCenterWidth, textCenterHeight,
      logoPosX, logoPosY,
      logoOpacity, logoRotation, logoShadowEnabled, logoShadowColor, logoShadowBlur, logoShadowOffsetX, logoShadowOffsetY,
      logoInnerShadowEnabled, logoEraseColorEnabled, logoEraseColor, logoEraseTolerance, logoEraseSmoothing, logoTexture, logoCrop,
      showHandle: false,
      selectedType: null
    });
    
    return tempCanvas;
  };

  const handleDownload = async (format, downloadFn) => {
    if (!canvasRef.current) return;
    setDownloadingFormat(format);
    try {
      const exportSize = QUALITY_SIZES[exportQuality] || 2048;
      const exportCanvas = generateExportCanvas(exportSize);
      
      const result = await downloadFn(exportCanvas);
      if (result === 'gallery') {
        showToast('Saved to Gallery');
      } else if (result === 'share') {
        showToast('Save Options Opened');
      } else {
        showToast('Saved successfully');
      }
    } catch (err) {
      console.error('Download failed:', err);
      showToast('Save failed', 'error');
    } finally {
      setTimeout(() => setDownloadingFormat(null), 800);
    }
  };

  // ── Save to Saved ──
  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataString = formatQRData(qrType, qrData);
    if (!dataString) { showToast('Please enter QR data first', 'error'); return; }
    
    // We already save to history automatically, but user clicked "Add to Saved"
    const savedEntry = saveToSaved({
      id: loadedItemId,
      source: 'create',
      qrType, qrData, displayText: dataString.substring(0, 50), errorLevel,
      ...getSnapshot(),
      thumbnail: latestThumbnailRef.current || canvasRef.current?.toDataURL('image/jpeg', 0.8) || null
    });
    if (savedEntry && savedEntry.id) {
      setLoadedItemId(savedEntry.id);
    }
    showToast('Added to Saved QRs', 'success');
  };

  const getActiveStyle = () => {
    return getSnapshot();
  };

  // ── Edit Batch Item Style ──
  const handleEditBatchItemStyle = (item, idx) => {
    ignoreDirtyRef.current = true;
    generatorIsDirtyRef.current = false;
    setTimeout(() => {
      ignoreDirtyRef.current = false;
      generatorIsDirtyRef.current = false;
    }, 800);

    applySnapshot(item.style);
    
    const parsed = parseRawQRText(item.data);
    setQrType(parsed.type);
    setQrData(parsed.data);

    navigateTo('generator');
    setActiveTab('color');
    
    // Delay setting activeBatchItemIndex to prevent route sync race condition from resetting it to null
    setTimeout(() => {
      setActiveBatchItemIndex(idx);
    }, 100);
  };

  // ── Load QR ──
  const handleLoadQR = (item) => {
    if (!item) return;
    
    const typeUpper = (item.type || '').toUpperCase();
    const barcodeFormats = [
      'DATA_MATRIX', 'DATA MATRIX', 'PDF417', 'PDF_417', 'AZTEC', 'EAN_13', 'EAN-13', 'EAN_8', 'EAN-8', 
      'UPC_A', 'UPC-A', 'UPC_E', 'UPC-E', 'CODE_128', 'CODE-128', 'CODE_39', 'CODE-39', 'CODE_93', 'CODE-93', 
      'ITF', 'ITF / I2OF5', 'ITF (I25)', 'CODABAR', 'MAXICODE'
    ];
    const isBarcode = item.qrType === 'BARCODE' || barcodeFormats.includes(typeUpper);

    if (isBarcode) {
      const getBcid = (fmt) => {
        if (!fmt) return 'code128';
        const name = fmt.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (name === 'datamatrix') return 'datamatrix';
        if (name === 'pdf417') return 'pdf417';
        if (name === 'aztec') return 'aztec';
        if (name === 'maxicode') return 'maxicode';
        if (name === 'ean13') return 'ean13';
        if (name === 'ean8') return 'ean8';
        if (name === 'upca') return 'upca';
        if (name === 'upce') return 'upce';
        if (name === 'code128') return 'code128';
        if (name === 'code39') return 'code39';
        if (name === 'code93') return 'code93';
        if (name === 'codabar') return 'codabar';
        if (name.includes('itf') || name.includes('i25')) return 'i25';
        return 'code128';
      };

      setLoadedBarcodeItem({
        id: item.id,
        displayText: item.displayText || item.qrData?.text || '',
        qrType: 'BARCODE',
        bcid: item.style?.bcid || getBcid(item.type),
        text: item.displayText || item.qrData?.text || '',
        style: item.style || {}
      });
      navigateTo('barcode');
      return;
    }
    
    ignoreDirtyRef.current = true;
    generatorIsDirtyRef.current = false;
    setTimeout(() => {
      ignoreDirtyRef.current = false;
      generatorIsDirtyRef.current = false;
    }, 1000);
    
    // Core data
    if (item.source === 'scan' || (!item.qrType && item.qrData?.text)) {
      const rawText = item.qrData?.text || item.displayText || '';
      const parsed = parseRawQRText(rawText);
      setQrType(parsed.type);
      setQrData(parsed.data);
      
      // Reset layout options for scanned QRs to clear the designer
      setLogo(null);
      setQrColor('#000000');
      setBgColor('#ffffff');
      setBgTransparent(false);
      setGradientEnabled(false);
      setDotStyle('square');
      setEyeStyle('square');
      setFrameStyle('none');
      setTextCenterEnabled(false);
    } else {
      // Generated QR template: apply all saved snapshot settings
      applySnapshot(item);
    }

    setLoadedItemId(item.id || null);

    // Reset tab history when loading a template
    setTabHistory([]);
    navigateTo('generator');
    showToast('Template loaded');
  };

  const resetGenerator = () => {
    ignoreDirtyRef.current = true;
    setLoadedItemId(null);
    generatorIsDirtyRef.current = false; // reset dirty flag on fresh generator open
    setTimeout(() => {
      ignoreDirtyRef.current = false;
      generatorIsDirtyRef.current = false;
    }, 1000);
    // Content
    setQrType(QR_TYPES.URL);
    setQrData({ url: 'https://example.com' });
    setErrorLevel('M');

    // Appearance
    setQrColor('#000000');
    setBgColor('#ffffff');
    setBgTransparent(false);
    setSyncEyes(true);
    setEyeColor('');
    setEyeOuterColor('');
    setActivePreset(null);

    // Gradient
    setGradientEnabled(false);
    setGradientColor1('#6c5ce7');
    setGradientColor2('#a78bfa');
    setGradientType('linear');

    // Shapes
    setDotStyle(DOT_STYLES.SQUARE);
    setEyeStyle(EYE_STYLES.SQUARE);
    setDotPadding(0);
    setEyePadding(0);

    // Logo
    setLogo(null);
    setLogoWidth(0.18);
    setLogoHeight(0.18);
    setLogoPadding(10);
    setLogoBackground(false);
    setLogoBgColor('#ffffff');
    setLogoBgShape('circle');
    setLogoOutline(false);
    setLogoOutlineColor('#ffffff');
    setLogoOutlineWidth(3);
    setLogoOutlineOpacity(1);
    setLogoPosX(0.5);
    setLogoPosY(0.5);
    setTextCenterPosX(0.5);
    setTextCenterPosY(0.5);
    setTextCenterWidth(null);
    setTextCenterHeight(null);

    // Frame
    setFrameStyle('none');
    setFrameText('SCAN ME');
    setFrameColor('');

    // Tabs
    setActiveTab('content');
    setTabHistory([]);
  };

  // ── Generate QR Matrix ──
  const regenerateMatrix = useCallback(() => {
    const dataString = formatQRData(qrType, qrData);
    if (!dataString) return;
    try {
      const matrixInfo = generateQRMatrix(dataString, errorLevel);
      setQrMatrixInfo(matrixInfo);
    } catch (e) {
      console.error('QR Generate Error:', e);
    }
  }, [qrType, qrData, errorLevel]);

  useEffect(() => { regenerateMatrix(); }, [regenerateMatrix]);

  // ── Device Capability Detection ──
  const isLowEndDevice = typeof navigator !== 'undefined' && 
    ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || 
     (navigator.deviceMemory && navigator.deviceMemory <= 4));
  const RENDER_DELAY = isLowEndDevice ? 60 : 0; // Throttle low-end to ~16fps, High-end uses native requestAnimationFrame (60-120fps)

  // ── Render Canvas ──
  const renderCanvas = useCallback(() => {
    if (!qrMatrixInfo || !canvasRef.current) return;
    
    const executeRender = async () => {
      // Fix: Wait for fonts to be ready so canvas renders correctly
      if (document.fonts) await document.fonts.ready;
      if (!canvasRef.current) return;
      
      renderQR(canvasRef.current, {
        ...qrMatrixInfo, size: 512,
        qrColor, bgColor, bgTransparent, dotStyle, eyeStyle,
        eyeColor,
        eyeOuterColor,
        syncEyes,
        dotPadding, eyePadding,
        gradientEnabled,
        gradientColor1,
        gradientColor2,
        gradientType,
        qrTextureEnabled,
        qrTexture,
        qrTextureSyncEyes,
        logo: logo?.image, logoWidth, logoHeight, logoPadding,
        logoBackground, logoBgColor, logoBgShape,
        logoOutline, logoOutlineColor, logoOutlineWidth, logoOutlineOpacity,
        quietZone: 2, frameStyle, frameText, frameColor, frameFont,
        frameSize,
        frameStrokeEnabled,
        frameStrokeWidth,
        frameStrokeColor,
        frameShadowEnabled,
        frameShadowBlur,
        frameShadowColor,
        framePosition,
        frameRotation,
        textCenterEnabled, 
        textCenter: textCenterEnabled ? textCenterText : null,
        textCenterSize, textCenterColor, textCenterFont,
        textCenterStrokeEnabled, textCenterStrokeWidth, textCenterStrokeColor,
        textCenterShadowEnabled, textCenterShadowBlur, textCenterShadowColor,
        textCenterPosX, textCenterPosY, textCenterRotation,
        textCenterWidth, textCenterHeight,
        logoPosX, logoPosY,
        logoOpacity, logoRotation, logoShadowEnabled, logoShadowColor, logoShadowBlur, logoShadowOffsetX, logoShadowOffsetY,
        logoInnerShadowEnabled, logoEraseColorEnabled, logoEraseColor, logoEraseTolerance, logoEraseSmoothing, logoTexture, logoCrop,
        showHandle: canvasSelection === 'logo' || canvasSelection === 'text' || canvasSelection === 'frame-text',
        selectedType: canvasSelection === 'text' ? 'text' : (canvasSelection === 'frame-text' ? 'frame-text' : canvasSelection)
      });

      // Cache latest thumbnail base64 data url for saving to history later
      try {
        latestThumbnailRef.current = canvasRef.current.toDataURL('image/jpeg', 0.8);
      } catch (e) {
        console.warn('Failed to cache thumbnail:', e);
      }
    };

    if (isLowEndDevice) {
      if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
      renderTimeoutRef.current = setTimeout(executeRender, RENDER_DELAY);
    } else {
      if (renderTimeoutRef.current) cancelAnimationFrame(renderTimeoutRef.current);
      renderTimeoutRef.current = requestAnimationFrame(executeRender);
    }
  }, [
    qrMatrixInfo, qrColor, bgColor, bgTransparent, dotStyle, eyeStyle, eyeColor,
    eyeOuterColor, syncEyes, gradientEnabled, gradientColor1, gradientColor2, gradientType,
    logo, logoWidth, logoHeight, logoPadding, logoBackground, logoBgColor, logoBgShape,
    logoOutline, logoOutlineColor, logoOutlineWidth, logoOutlineOpacity,
    dotPadding, eyePadding, frameStyle, frameText, frameColor, frameFont,
        frameSize,
        frameStrokeEnabled,
        frameStrokeWidth,
        frameStrokeColor,
        frameShadowEnabled,
        frameShadowBlur,
        frameShadowColor,
        framePosition,
        frameRotation,
    textCenterEnabled, textCenterText, textCenterSize, textCenterColor, textCenterFont,

    textCenterStrokeEnabled, textCenterStrokeWidth, textCenterStrokeColor,
    textCenterShadowEnabled, textCenterShadowBlur, textCenterShadowColor,
    textCenterPosX, textCenterPosY, textCenterRotation, textCenterWidth, textCenterHeight, logoPosX, logoPosY,
    logoOpacity, logoRotation, logoShadowEnabled, logoShadowColor, logoShadowBlur, logoShadowOffsetX, logoShadowOffsetY,
    logoInnerShadowEnabled, logoEraseColorEnabled, logoEraseColor, logoEraseTolerance, logoEraseSmoothing, logoTexture, logoCrop, 
    qrTextureEnabled, qrTexture, qrTextureSyncEyes,
    activeTab, canvasSelection
  ]);

  useEffect(() => {
    renderCanvas();
    if (logo?.image && !logo.image.complete) {
      logo.image.onload = renderCanvas;
      logo.image.onerror = () => showToast('Logo failed to load', 'error');
    }
    if (qrTexture?.image && !qrTexture.image.complete) {
      qrTexture.image.onload = renderCanvas;
      qrTexture.image.onerror = () => showToast('Texture failed to load', 'error');
    }
  }, [renderCanvas, logo, qrTexture, activePage]);
  const getQRContentArea = useCallback(() => {
    const size = 512;
    const padding = size * 0.03;
    let contentX = 0;
    let contentY = 0;
    let contentSize = size;

    if (frameStyle !== 'none') {
      const labelHeight = size * 0.14;
      contentSize = size - (padding * 2) - labelHeight - (size * 0.06); 
      contentX = (size - contentSize) / 2;
      contentY = padding + (size - padding * 2 - labelHeight - contentSize) / 2;
    }
    return { contentX, contentY, contentSize };
  }, [frameStyle]);

  // ── Pipette Handling ──
  // ── Pipette Handling ──
  const updateLoupe = useCallback((clientX, clientY) => {
    if (!canvasRef.current || !loupeCanvasRef.current) return;
    const mainCanvas = canvasRef.current;
    const loupeCanvas = loupeCanvasRef.current;
    const canvasRect = mainCanvas.getBoundingClientRect();

    const scale = 512 / canvasRect.width;
    const x = (clientX - canvasRect.left) * scale;
    const y = (clientY - canvasRect.top) * scale;

    const ctx = loupeCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 80, 80);

    // Source size: 11x11 pixels from main canvas (zooms by ~7.3x)
    const srcSize = 11; 
    const sx = Math.floor(x - srcSize / 2);
    const sy = Math.floor(y - srcSize / 2);

    // Draw magnified pixels
    try {
      ctx.drawImage(mainCanvas, sx, sy, srcSize, srcSize, 0, 0, 80, 80);
    } catch (err) {
      console.error("Loupe draw error:", err);
    }

    // Draw central pixel outline (crosshair)
    const pixelSize = 80 / srcSize;
    const cx = Math.floor(srcSize / 2) * pixelSize;
    const cy = Math.floor(srcSize / 2) * pixelSize;

    // Draw a border around the central pixel (the pixel currently being picked)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy, pixelSize, pixelSize);
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(cx - 0.5, cy - 0.5, pixelSize + 1, pixelSize + 1);
  }, []);

  const handlePipettePointerDown = useCallback((e) => {
    if (!canvasRef.current) return;
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (err) {}

    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (
      clientX >= canvasRect.left &&
      clientX <= canvasRect.right &&
      clientY >= canvasRect.top &&
      clientY <= canvasRect.bottom
    ) {
      const scale = 512 / canvasRect.width;
      const x = (clientX - canvasRect.left) * scale;
      const y = (clientY - canvasRect.top) * scale;
      
      const ctx = canvas.getContext('2d');
      try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        
        setHoverColor(hex);
        setHoverPos({ x: clientX, y: clientY });
        
        // Update the loupe canvas immediately on pointer down
        setTimeout(() => updateLoupe(clientX, clientY), 0);
        
        // On desktop click style (pointerType === 'mouse') picks color immediately on click
        if (e.pointerType === 'mouse') {
          if (pipetteTarget?.setter) {
            pipetteTarget.setter(hex);
          }
          setIsPipetteActive(false);
          setHoverColor(null);
          setAdvPicker(prev => ({ ...prev, open: true, color: hex }));
        }
      } catch (err) {
        console.error("Failed to sample color:", err);
      }
    }
    e.preventDefault();
  }, [pipetteTarget, updateLoupe]);

  const handlePipettePointerMove = useCallback((e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    if (
      clientX >= canvasRect.left &&
      clientX <= canvasRect.right &&
      clientY >= canvasRect.top &&
      clientY <= canvasRect.bottom
    ) {
      const scale = 512 / canvasRect.width;
      const x = (clientX - canvasRect.left) * scale;
      const y = (clientY - canvasRect.top) * scale;
      
      const ctx = canvas.getContext('2d');
      try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setHoverColor(hex);
        setHoverPos({ x: clientX, y: clientY });
        
        // Update the loupe canvas immediately on move
        updateLoupe(clientX, clientY);
      } catch (err) {
        setHoverColor(null);
      }
    } else {
      setHoverColor(null);
    }
    e.preventDefault();
  }, [updateLoupe]);

  const handlePipettePointerUp = useCallback((e) => {
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (err) {}

    // On touch screen, lifting finger completes selection
    if (e.pointerType === 'touch' && hoverColor) {
      if (pipetteTarget?.setter) {
        pipetteTarget.setter(hoverColor);
      }
      setIsPipetteActive(false);
      setHoverColor(null);
      setAdvPicker(prev => ({ ...prev, open: true, color: hoverColor }));
    }
    e.preventDefault();
  }, [hoverColor, pipetteTarget]);

  // ── Canvas Interaction (Drag to Position) ──
  const handleCanvasInteraction = useCallback((e) => {
    if (!canvasRef.current || !qrMatrixInfo) return;
    const canvas = canvasRef.current;
    
    // Save snapshot before dragging/resizing starts if not already set
    if (!preEditSnapshot.current) {
      preEditSnapshot.current = getSnapshot();
    }
    
    // Selection will be cleared at the end of this function if no hit is registered

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Convert click to canvas coordinates (0-512)
    const scale = 512 / rect.width;
    const x = (clientX - rect.left) * scale;
    const y = (clientY - rect.top) * scale;

    const { contentX, contentY, contentSize } = getQRContentArea();

    // Helper to check if point is in rect with generous padding
    const inRect = (px, py, rx, ry, rw, rh) => {
      const pad = 25; 
      return px >= rx - pad && px <= rx + rw + pad && py >= ry - pad && py <= ry + rh + pad;
    };

    // 1. Check Logo
    if (logo?.image) {
      const lw = contentSize * logoWidth;
      const lh = contentSize * logoHeight;
      const rawLx = contentX + (contentSize - lw) * logoPosX;
      const rawLy = contentY + (contentSize - lh) * logoPosY;
      const moduleCount = qrMatrixInfo?.width || 21;
      const safePos = constrainToSafeZone(rawLx, rawLy, lw, lh, contentX, contentY, contentSize, moduleCount, 2);
      const lx = safePos.x;
      const ly = safePos.y;
      
      const centerX = lx + lw / 2;
      const centerY = ly + lh / 2;

      const dx_raw = x - centerX;
      const dy_raw = y - centerY;
      const ang = (-logoRotation * Math.PI) / 180;
      const localX = centerX + dx_raw * Math.cos(ang) - dy_raw * Math.sin(ang);
      const localY = centerY + dx_raw * Math.sin(ang) + dy_raw * Math.cos(ang);

      const hSize = 24; 
      const checkH = (hx, hy, type) => {
          if (localX >= hx - hSize && localX <= hx + hSize && localY >= hy - hSize && localY <= hy + hSize) {
              setIsDraggingCanvas(true);
              dragType.current = type;
              dragStartOffset.current = { 
                  x: localX, 
                  y: localY, 
                  startW: logoWidth, 
                  startH: logoHeight, 
                  startPosX: logoPosX, 
                  startPosY: logoPosY, 
                  startRotation: logoRotation,
                  startMouseAngle: Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
              };
              e.preventDefault();
              return true;
          }
          return false;
      };

      // Only allow interacting with handles (resizing, rotating, deleting) if the logo is already selected
      if (canvasSelection === 'logo') {
        // Bottom-Left Rotate Bracket (Offset -20, 20) with a larger hit area check (hSize = 24)
        const checkRotateLogo = (hx, hy) => {
            const rotHSize = 24; // Extra generous touch target size for rotation handle
            if (localX >= hx - rotHSize && localX <= hx + rotHSize && localY >= hy - rotHSize && localY <= hy + rotHSize) {
                setIsDraggingCanvas(true);
                dragType.current = 'rotate-logo';
                dragStartOffset.current = { 
                    x: localX, 
                    y: localY, 
                    startW: logoWidth, 
                    startH: logoHeight, 
                    startPosX: logoPosX, 
                    startPosY: logoPosY, 
                    startRotation: logoRotation,
                    startMouseAngle: Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
                };
                e.preventDefault();
                return true;
            }
            return false;
        };
        if (checkRotateLogo(lx - 20, ly + lh + 20)) return;
        if (checkH(lx + lw, ly + lh, 'resize-logo-br')) return;
        if (checkH(lx + lw, ly + lh/2, 'resize-logo-r')) return;
        if (checkH(lx + lw/2, ly + lh, 'resize-logo-b')) return;
        
        // Delete Button
        if (checkH(lx + lw, ly, 'delete-logo')) {
          setLogo(null);
          setIsDraggingCanvas(false);
          dragType.current = null;
          e.preventDefault();
          return;
        }
      }
      
      // Clicking inside the body region always triggers dragging/selection
      if (inRect(localX, localY, lx, ly, lw, lh)) {
        setCanvasSelection('logo');
        setIsDraggingCanvas(true);
        dragType.current = 'logo';
        dragStartOffset.current = { x: x - lx, y: y - ly };
        e.preventDefault();
        return;
      }
    }

    if (textCenterEnabled && textCenterText) {
      const fontSize = contentSize * textCenterSize;
      tempCtx.current.font = `bold ${fontSize}px '${textCenterFont}', sans-serif`;
      const metrics = tempCtx.current.measureText(textCenterText);
      const tw = textCenterWidth ? (textCenterWidth * contentSize) : (metrics.width + (logoPadding || 10) * 2);
      const th = textCenterHeight ? (textCenterHeight * contentSize) : ((fontSize * 0.8) + (logoPadding || 10) * 2);
      
      const rawTx = contentX + (contentSize - tw) * textCenterPosX;
      const rawTy = contentY + (contentSize - th) * textCenterPosY;
      const moduleCount = qrMatrixInfo?.width || 21;
      const safePos = constrainToSafeZone(rawTx, rawTy, tw, th, contentX, contentY, contentSize, moduleCount, 2);
      const tx = safePos.x;
      const ty = safePos.y;
      
      const centerX = tx + tw / 2;
      const centerY = ty + th / 2;

      const dx_raw = x - centerX;
      const dy_raw = y - centerY;
      const ang = (-textCenterRotation * Math.PI) / 180;
      const localX = centerX + dx_raw * Math.cos(ang) - dy_raw * Math.sin(ang);
      const localY = centerY + dx_raw * Math.sin(ang) + dy_raw * Math.cos(ang);

      const hSize = 24;
      const checkH = (hx, hy, type) => {
          if (localX >= hx - hSize && localX <= hx + hSize && localY >= hy - hSize && localY <= hy + hSize) {
              setIsDraggingCanvas(true);
              dragType.current = type;
              dragStartOffset.current = { 
                  x: localX, 
                  y: localY, 
                  startSize: textCenterSize, 
                  startPosX: textCenterPosX, 
                  startPosY: textCenterPosY, 
                  startRotation: textCenterRotation, 
                  startW: tw / contentSize, 
                  startH: th / contentSize,
                  startMouseAngle: Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
              };
              e.preventDefault();
              return true;
          }
          return false;
      };

      // Only allow interacting with handles if text is already selected
      if (canvasSelection === 'text') {
        // Bottom-Left Rotate Bracket (Offset -20, 20) with a larger hit area check (hSize = 24)
        const checkRotateText = (hx, hy) => {
            const rotHSize = 24; // Extra generous touch target size for rotation handle
            if (localX >= hx - rotHSize && localX <= hx + rotHSize && localY >= hy - rotHSize && localY <= hy + rotHSize) {
                setIsDraggingCanvas(true);
                dragType.current = 'rotate-text';
                dragStartOffset.current = { 
                    x: localX, 
                    y: localY, 
                    startSize: textCenterSize, 
                    startPosX: textCenterPosX, 
                    startPosY: textCenterPosY, 
                    startRotation: textCenterRotation, 
                    startW: tw / contentSize, 
                    startH: th / contentSize,
                    startMouseAngle: Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
                };
                e.preventDefault();
                return true;
            }
            return false;
        };
        if (checkRotateText(tx - 20, ty + th + 20)) return;
        if (checkH(tx + tw, ty + th, 'resize-text-br')) return;
        if (checkH(tx + tw, ty + th/2, 'resize-text-r')) return;
        if (checkH(tx + tw/2, ty + th, 'resize-text-b')) return;
        
        if (checkH(tx + tw, ty, 'delete-text')) {
          setTextCenterEnabled(false);
          setIsDraggingCanvas(false);
          dragType.current = null;
          e.preventDefault();
          return;
        }
      }

      // Clicking inside the body region always triggers dragging/selection
      if (inRect(localX, localY, tx, ty, tw, th)) {
        setCanvasSelection('text');
        setTextEditMode('center');
        setIsDraggingCanvas(true);
        dragType.current = 'text';
        dragStartOffset.current = { x: x - tx, y: y - ty };
        e.preventDefault();
        return;
      }
    }

    // 3. Check Frame Text
    if (frameStyle !== 'none' && frameText) {
      const framePadding = 512 * 0.03;
      const labelHeight = 512 * 0.14;
      const textY = framePosition === 'top' ? (framePadding + labelHeight / 2) : (512 - framePadding - labelHeight / 2);
      
      tempCtx.current.font = `bold ${512 * frameSize}px '${frameFont}', Outfit, sans-serif`;
      const metrics = tempCtx.current.measureText(frameText);
      const tw = metrics.width + 512 * 0.04;
      const th = (512 * frameSize) * 1.2;
      const tx = 256 - tw / 2;
      const ty = textY - th / 2;
      
      const centerX = 256;
      const centerY = textY;

      const dx_raw = x - centerX;
      const dy_raw = y - centerY;
      const ang = (-(frameRotation || 0) * Math.PI) / 180;
      const localX = centerX + dx_raw * Math.cos(ang) - dy_raw * Math.sin(ang);
      const localY = centerY + dx_raw * Math.sin(ang) + dy_raw * Math.cos(ang);

      const hSize = 24;
      const checkH = (hx, hy, type) => {
          if (localX >= hx - hSize && localX <= hx + hSize && localY >= hy - hSize && localY <= hy + hSize) {
              setIsDraggingCanvas(true);
              dragType.current = type;
              dragStartOffset.current = { 
                  startX: x,
                  startY: y,
                  startSize: frameSize,
                  startRotation: frameRotation || 0,
                  startMouseAngle: Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
              };
              e.preventDefault();
              return true;
          }
          return false;
      };

      if (canvasSelection === 'frame-text') {
        const checkRotateFrame = (hx, hy) => {
            if (localX >= hx - hSize && localX <= hx + hSize && localY >= hy - hSize && localY <= hy + hSize) {
                setIsDraggingCanvas(true);
                dragType.current = 'rotate-frame';
                dragStartOffset.current = { 
                    startRotation: frameRotation || 0,
                    startMouseAngle: Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
                };
                e.preventDefault();
                return true;
            }
            return false;
        };
        // Rotate handle at bottom-left
        if (checkRotateFrame(tx - 20, ty + th + 20)) return;
        // Resize handle at bottom-right
        if (checkH(tx + tw, ty + th, 'resize-frame-br')) return;
        // Delete handle at top-right
        if (checkH(tx + tw, ty, 'delete-frame')) {
          setFrameText('');
          setFrameStyle('none');
          setCanvasSelection(null);
          setIsDraggingCanvas(false);
          dragType.current = null;
          e.preventDefault();
          return;
        }
      }

      if (inRect(localX, localY, tx, ty, tw, th)) {
        setCanvasSelection('frame-text');
        setTextEditMode('frame');
        e.preventDefault();
        return;
      }
    }

    // Clear selection if we clicked outside any active elements
    if (!isPipetteActive) {
      setCanvasSelection(null);
    }
  }, [qrMatrixInfo, logo, logoWidth, logoHeight, logoPosX, logoPosY, logoRotation, textCenterEnabled, textCenterText, textCenterSize, textCenterWidth, textCenterHeight, textCenterPosX, textCenterPosY, textCenterRotation, logoPadding, getQRContentArea, canvasSelection, getSnapshot, frameStyle, frameText, frameSize, frameFont, framePosition, frameRotation]);

  const handleCanvasDoubleClick = useCallback((e) => {
    if (!canvasRef.current || !qrMatrixInfo) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    const scale = 512 / rect.width;
    const x = (clientX - rect.left) * scale;
    const y = (clientY - rect.top) * scale;

    const { contentX, contentY, contentSize } = getQRContentArea();
    const inRect = (px, py, rx, ry, rw, rh) => {
      const pad = 25; 
      return px >= rx - pad && px <= rx + rw + pad && py >= ry - pad && py <= ry + rh + pad;
    };

    // 1. Check Center Text
    if (textCenterEnabled && textCenterText) {
      const fontSize = contentSize * textCenterSize;
      tempCtx.current.font = `bold ${fontSize}px '${textCenterFont}', sans-serif`;
      const metrics = tempCtx.current.measureText(textCenterText);
      const tw = textCenterWidth ? (textCenterWidth * contentSize) : (metrics.width + (logoPadding || 10) * 2);
      const th = textCenterHeight ? (textCenterHeight * contentSize) : ((fontSize * 0.8) + (logoPadding || 10) * 2);
      
      const rawTx = contentX + (contentSize - tw) * textCenterPosX;
      const rawTy = contentY + (contentSize - th) * textCenterPosY;
      const moduleCount = qrMatrixInfo?.width || 21;
      const safePos = constrainToSafeZone(rawTx, rawTy, tw, th, contentX, contentY, contentSize, moduleCount, 2);
      const tx = safePos.x;
      const ty = safePos.y;
      
      const centerX = tx + tw / 2;
      const centerY = ty + th / 2;

      const dx_raw = x - centerX;
      const dy_raw = y - centerY;
      const ang = (-textCenterRotation * Math.PI) / 180;
      const localX = centerX + dx_raw * Math.cos(ang) - dy_raw * Math.sin(ang);
      const localY = centerY + dx_raw * Math.sin(ang) + dy_raw * Math.cos(ang);

      if (inRect(localX, localY, tx, ty, tw, th)) {
        handleTabChange('text');
        setTextPopup('input');
        setTextEditMode('center');
        setCanvasSelection('text');
        setTimeout(() => {
          const input = document.getElementById('center-text-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 100);
        e.preventDefault();
        return;
      }
    }

    // 2. Check Frame Text
    if (frameStyle !== 'none' && frameText) {
      const framePadding = 512 * 0.03;
      const labelHeight = 512 * 0.14;
      const textY = framePosition === 'top' ? (framePadding + labelHeight / 2) : (512 - framePadding - labelHeight / 2);
      
      tempCtx.current.font = `bold ${512 * frameSize}px '${frameFont}', Outfit, sans-serif`;
      const metrics = tempCtx.current.measureText(frameText);
      const tw = metrics.width + 512 * 0.04;
      const th = (512 * frameSize) * 1.2;
      const tx = 256 - tw / 2;
      const ty = textY - th / 2;
      
      const centerX = 256;
      const centerY = textY;

      const dx_raw = x - centerX;
      const dy_raw = y - centerY;
      const ang = (-(frameRotation || 0) * Math.PI) / 180;
      const localX = centerX + dx_raw * Math.cos(ang) - dy_raw * Math.sin(ang);
      const localY = centerY + dx_raw * Math.sin(ang) + dy_raw * Math.cos(ang);

      if (inRect(localX, localY, tx, ty, tw, th)) {
        handleTabChange('text');
        setTextPopup('input');
        setTextEditMode('frame');
        setCanvasSelection('frame-text');
        setTimeout(() => {
          const input = document.getElementById('frame-text-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 100);
        e.preventDefault();
        return;
      }
    }
  }, [textCenterEnabled, textCenterText, textCenterSize, textCenterFont, textCenterWidth, textCenterHeight, textCenterPosX, textCenterPosY, textCenterRotation, logoPadding, getQRContentArea, qrMatrixInfo, frameStyle, frameText, frameSize, frameFont, framePosition, frameRotation, handleTabChange]);

  const handleCanvasMove = useCallback((e) => {
    if (!isDraggingCanvas || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const scale = 512 / rect.width;
    const x = (clientX - rect.left) * scale;
    const y = (clientY - rect.top) * scale;

    const { contentX, contentY, contentSize } = getQRContentArea();

    if (dragType.current === 'rotate-logo') {
        const lw = contentSize * logoWidth;
        const lh = contentSize * logoHeight;
        const rawLx = contentX + (contentSize - lw) * logoPosX;
        const rawLy = contentY + (contentSize - lh) * logoPosY;
        const moduleCount = qrMatrixInfo?.width || 21;
        const safePos = constrainToSafeZone(rawLx, rawLy, lw, lh, contentX, contentY, contentSize, moduleCount, 2);
        const lx = safePos.x;
        const ly = safePos.y;
        const centerX = lx + lw / 2;
        const centerY = ly + lh / 2;
        
        const currentMouseAngle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
        const angleDelta = currentMouseAngle - dragStartOffset.current.startMouseAngle;
        let newRotation = dragStartOffset.current.startRotation + angleDelta;
        
        let normalizedRot = (newRotation % 360 + 360) % 360;
        const snapTargets = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        const snapTolerance = 4;
        for (const target of snapTargets) {
            if (Math.abs(normalizedRot - target) <= snapTolerance) {
                normalizedRot = target === 360 ? 0 : target;
                break;
            }
        }
        setLogoRotation(Math.round(normalizedRot));
    } else if (dragType.current === 'rotate-text') {
        const fontSize = contentSize * textCenterSize;
        tempCtx.current.font = `bold ${fontSize}px '${textCenterFont}', sans-serif`;
        const metrics = tempCtx.current.measureText(textCenterText);
        const tw = textCenterWidth ? (textCenterWidth * contentSize) : (metrics.width + (logoPadding || 10) * 2);
        const th = textCenterHeight ? (textCenterHeight * contentSize) : ((fontSize * 0.8) + (logoPadding || 10) * 2);
        
        const rawTx = contentX + (contentSize - tw) * textCenterPosX;
        const rawTy = contentY + (contentSize - th) * textCenterPosY;
        const moduleCount = qrMatrixInfo?.width || 21;
        const safePos = constrainToSafeZone(rawTx, rawTy, tw, th, contentX, contentY, contentSize, moduleCount, 2);
        const tx = safePos.x;
        const ty = safePos.y;
        const centerX = tx + tw / 2;
        const centerY = ty + th / 2;
        
        const currentMouseAngle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
        const angleDelta = currentMouseAngle - dragStartOffset.current.startMouseAngle;
        let newRotation = dragStartOffset.current.startRotation + angleDelta;
        
        let normalizedRot = (newRotation % 360 + 360) % 360;
        const snapTargets = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        const snapTolerance = 4;
        for (const target of snapTargets) {
            if (Math.abs(normalizedRot - target) <= snapTolerance) {
                normalizedRot = target === 360 ? 0 : target;
                break;
            }
        }
        setTextCenterRotation(Math.round(normalizedRot));
    } else if (dragType.current === 'rotate-frame') {
        const framePadding = 512 * 0.03;
        const labelHeight = 512 * 0.14;
        const textY = framePosition === 'top' ? (framePadding + labelHeight / 2) : (512 - framePadding - labelHeight / 2);
        const centerX = 256;
        const centerY = textY;
        
        const currentMouseAngle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
        const angleDelta = currentMouseAngle - dragStartOffset.current.startMouseAngle;
        let newRotation = dragStartOffset.current.startRotation + angleDelta;
        
        let normalizedRot = (newRotation % 360 + 360) % 360;
        const snapTargets = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        const snapTolerance = 4;
        for (const target of snapTargets) {
            if (Math.abs(normalizedRot - target) <= snapTolerance) {
                normalizedRot = target === 360 ? 0 : target;
                break;
            }
        }
        setFrameRotation(Math.round(normalizedRot));
    } else if (dragType.current === 'resize-frame-br') {
        const framePadding = 512 * 0.03;
        const labelHeight = 512 * 0.14;
        const textY = framePosition === 'top' ? (framePadding + labelHeight / 2) : (512 - framePadding - labelHeight / 2);
        const centerX = 256;
        const centerY = textY;
        
        const currentDist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const startDist = Math.sqrt((dragStartOffset.current.startX - centerX) ** 2 + (dragStartOffset.current.startY - centerY) ** 2);
        
        const scale = startDist > 0 ? (currentDist / startDist) : 1;
        const newSize = Math.max(0.04, Math.min(0.24, dragStartOffset.current.startSize * scale));
        setFrameSize(Math.round(newSize * 100) / 100);
    } else if (dragType.current && dragType.current.startsWith('resize-logo')) {
        const lw = contentSize * logoWidth;
        const lh = contentSize * logoHeight;
        const rawLx = contentX + (contentSize - lw) * logoPosX;
        const rawLy = contentY + (contentSize - lh) * logoPosY;
        const moduleCount = qrMatrixInfo?.width || 21;
        const safePos = constrainToSafeZone(rawLx, rawLy, lw, lh, contentX, contentY, contentSize, moduleCount, 2);
        const lx = safePos.x;
        const ly = safePos.y;
        const centerX = lx + lw / 2;
        const centerY = ly + lh / 2;
        const dx_raw = x - centerX;
        const dy_raw = y - centerY;
        const ang = (-logoRotation * Math.PI) / 180;
        const localX = centerX + dx_raw * Math.cos(ang) - dy_raw * Math.sin(ang);
        const localY = centerY + dx_raw * Math.sin(ang) + dy_raw * Math.cos(ang);
        const diffX = (localX - dragStartOffset.current.x) / contentSize;
        const diffY = (localY - dragStartOffset.current.y) / contentSize;
        
        const startW_px = contentSize * dragStartOffset.current.startW;
        const startH_px = contentSize * dragStartOffset.current.startH;
        const lx_start = contentX + (contentSize - startW_px) * dragStartOffset.current.startPosX;
        const ly_start = contentY + (contentSize - startH_px) * dragStartOffset.current.startPosY;

        let newW = dragStartOffset.current.startW;
        let newH = dragStartOffset.current.startH;
        if (dragType.current === 'resize-logo-br') {
            const scale = Math.max(0.1, (dragStartOffset.current.startW + diffX) / dragStartOffset.current.startW);
            newW = Math.max(0.05, Math.min(0.6, dragStartOffset.current.startW * scale));
            newH = Math.max(0.05, Math.min(0.6, dragStartOffset.current.startH * scale));
            
            // Adjust dragStartOffset.current.x to align with the clamp boundaries
            const maxScale = 0.6 / dragStartOffset.current.startW;
            const minScale = 0.05 / dragStartOffset.current.startW;
            const currentScale = (dragStartOffset.current.startW + diffX) / dragStartOffset.current.startW;
            if (currentScale > maxScale) {
                const maxDiffX = (maxScale - 1) * dragStartOffset.current.startW;
                dragStartOffset.current.x = localX - maxDiffX * contentSize;
            } else if (currentScale < minScale) {
                const minDiffX = (minScale - 1) * dragStartOffset.current.startW;
                dragStartOffset.current.x = localX - minDiffX * contentSize;
            }
        } else if (dragType.current === 'resize-logo-r') {
            newW = Math.max(0.05, Math.min(0.6, dragStartOffset.current.startW + diffX));
            
            // Adjust dragStartOffset.current.x to align with the clamp boundaries
            const maxDiffX = 0.6 - dragStartOffset.current.startW;
            const minDiffX = 0.05 - dragStartOffset.current.startW;
            if (diffX > maxDiffX) {
                dragStartOffset.current.x = localX - maxDiffX * contentSize;
            } else if (diffX < minDiffX) {
                dragStartOffset.current.x = localX - minDiffX * contentSize;
            }
        } else if (dragType.current === 'resize-logo-b') {
            newH = Math.max(0.05, Math.min(0.6, dragStartOffset.current.startH + diffY));
            
            // Adjust dragStartOffset.current.y to align with the clamp boundaries
            const maxDiffY = 0.6 - dragStartOffset.current.startH;
            const minDiffY = 0.05 - dragStartOffset.current.startH;
            if (diffY > maxDiffY) {
                dragStartOffset.current.y = localY - maxDiffY * contentSize;
            } else if (diffY < minDiffY) {
                dragStartOffset.current.y = localY - minDiffY * contentSize;
            }
        }
        
        const newW_px = contentSize * newW;
        const newH_px = contentSize * newH;
        let newPosX = dragStartOffset.current.startPosX;
        let newPosY = dragStartOffset.current.startPosY;
        
        if (dragStartOffset.current.startPosX === 0.5) {
            newPosX = 0.5;
        } else if (contentSize - newW_px > 0) {
            newPosX = Math.max(0, Math.min(1, (lx_start - contentX) / (contentSize - newW_px)));
        }
        
        if (dragStartOffset.current.startPosY === 0.5) {
            newPosY = 0.5;
        } else if (contentSize - newH_px > 0) {
            newPosY = Math.max(0, Math.min(1, (ly_start - contentY) / (contentSize - newH_px)));
        }

        setLogoWidth(Math.round(newW * 100) / 100);
        setLogoHeight(Math.round(newH * 100) / 100);
        setLogoPosX(Math.round(newPosX * 1000) / 1000);
        setLogoPosY(Math.round(newPosY * 1000) / 1000);
    } else if (dragType.current && dragType.current.startsWith('resize-text')) {
        const fontSize = contentSize * textCenterSize;
        tempCtx.current.font = `bold ${fontSize}px '${textCenterFont}', sans-serif`;
        const metrics = tempCtx.current.measureText(textCenterText);
        const tw = textCenterWidth ? (textCenterWidth * contentSize) : (metrics.width + (logoPadding || 10) * 2);
        const th = textCenterHeight ? (textCenterHeight * contentSize) : ((fontSize * 0.8) + (logoPadding || 10) * 2);
        
        const rawTx = contentX + (contentSize - tw) * textCenterPosX;
        const rawTy = contentY + (contentSize - th) * textCenterPosY;
        const moduleCount = qrMatrixInfo?.width || 21;
        const safePos = constrainToSafeZone(rawTx, rawTy, tw, th, contentX, contentY, contentSize, moduleCount, 2);
        const tx = safePos.x;
        const ty = safePos.y;
        
        const centerX = tx + tw / 2;
        const centerY = ty + th / 2;
        const dx_raw = x - centerX;
        const dy_raw = y - centerY;
        const ang = (-textCenterRotation * Math.PI) / 180;
        const localX = centerX + dx_raw * Math.cos(ang) - dy_raw * Math.sin(ang);
        const localY = centerY + dx_raw * Math.sin(ang) + dy_raw * Math.cos(ang);
        const diffX = (localX - dragStartOffset.current.x) / contentSize;
        const diffY = (localY - dragStartOffset.current.y) / contentSize;
        
        const startW_px = contentSize * dragStartOffset.current.startW;
        const startH_px = contentSize * dragStartOffset.current.startH;
        const tx_start = contentX + (contentSize - startW_px) * dragStartOffset.current.startPosX;
        const ty_start = contentY + (contentSize - startH_px) * dragStartOffset.current.startPosY;
        
        let newW = dragStartOffset.current.startW;
        let newH = dragStartOffset.current.startH;
        let newSize = dragStartOffset.current.startSize;
        
        if (dragType.current === 'resize-text-br') {
            const scale = Math.max(0.1, (dragStartOffset.current.startW + diffX) / dragStartOffset.current.startW);
            newW = Math.max(0.05, Math.min(0.35, dragStartOffset.current.startW * scale));
            newH = Math.max(0.05, Math.min(0.35, dragStartOffset.current.startH * scale));
            newSize = Math.max(0.02, Math.min(0.35, dragStartOffset.current.startSize * scale));
            
            // Adjust dragStartOffset.current.x for boundary constraints
            const maxScale = 0.35 / dragStartOffset.current.startW;
            const minScale = 0.05 / dragStartOffset.current.startW;
            const currentScale = (dragStartOffset.current.startW + diffX) / dragStartOffset.current.startW;
            if (currentScale > maxScale) {
                const maxDiffX = (maxScale - 1) * dragStartOffset.current.startW;
                dragStartOffset.current.x = localX - maxDiffX * contentSize;
            } else if (currentScale < minScale) {
                const minDiffX = (minScale - 1) * dragStartOffset.current.startW;
                dragStartOffset.current.x = localX - minDiffX * contentSize;
            }
        } else if (dragType.current === 'resize-text-r') {
            newW = Math.max(0.05, Math.min(0.35, dragStartOffset.current.startW + diffX));
            
            const maxDiffX = 0.35 - dragStartOffset.current.startW;
            const minDiffX = 0.05 - dragStartOffset.current.startW;
            if (diffX > maxDiffX) {
                dragStartOffset.current.x = localX - maxDiffX * contentSize;
            } else if (diffX < minDiffX) {
                dragStartOffset.current.x = localX - minDiffX * contentSize;
            }
        } else if (dragType.current === 'resize-text-b') {
            newH = Math.max(0.05, Math.min(0.35, dragStartOffset.current.startH + diffY));
            
            const maxDiffY = 0.35 - dragStartOffset.current.startH;
            const minDiffY = 0.05 - dragStartOffset.current.startH;
            if (diffY > maxDiffY) {
                dragStartOffset.current.y = localY - maxDiffY * contentSize;
            } else if (diffY < minDiffY) {
                dragStartOffset.current.y = localY - minDiffY * contentSize;
            }
        }
        
        const newW_px = contentSize * newW;
        const newH_px = contentSize * newH;
        let newPosX = dragStartOffset.current.startPosX;
        let newPosY = dragStartOffset.current.startPosY;
        
        if (dragStartOffset.current.startPosX === 0.5) {
            newPosX = 0.5;
        } else if (contentSize - newW_px > 0) {
            newPosX = Math.max(0, Math.min(1, (tx_start - contentX) / (contentSize - newW_px)));
        }
        
        if (dragStartOffset.current.startPosY === 0.5) {
            newPosY = 0.5;
        } else if (contentSize - newH_px > 0) {
            newPosY = Math.max(0, Math.min(1, (ty_start - contentY) / (contentSize - newH_px)));
        }
        
        setTextCenterSize(Math.round(newSize * 100) / 100);
        setTextCenterWidth(Math.round(newW * 100) / 100);
        setTextCenterHeight(Math.round(newH * 100) / 100);
        setTextCenterPosX(Math.round(newPosX * 1000) / 1000);
        setTextCenterPosY(Math.round(newPosY * 1000) / 1000);
    } else if (dragType.current === 'logo' && logo?.image) {
        const lw = contentSize * logoWidth;
        const lh = contentSize * logoHeight;
        const newLx = x - dragStartOffset.current.x;
        const newLy = y - dragStartOffset.current.y;
        let valX = Math.max(0, Math.min(1, (newLx - contentX) / (contentSize - lw)));
        let valY = Math.max(0, Math.min(1, (newLy - contentY) / (contentSize - lh)));
        
        // Snapping tolerance of 0.02 around 0.5 center
        const snapTolerance = 0.02;
        if (Math.abs(valX - 0.5) <= snapTolerance) {
            valX = 0.5;
        }
        if (Math.abs(valY - 0.5) <= snapTolerance) {
            valY = 0.5;
        }
        
        setLogoPosX(Math.round(valX * 1000) / 1000);
        setLogoPosY(Math.round(valY * 1000) / 1000);
    } else if (dragType.current === 'text') {
      const fontSize = contentSize * textCenterSize;
      tempCtx.current.font = `bold ${fontSize}px '${textCenterFont}', sans-serif`;
      const metrics = tempCtx.current.measureText(textCenterText);
      const tw = textCenterWidth ? (textCenterWidth * contentSize) : (metrics.width + (logoPadding || 10) * 2);
      const th = textCenterHeight ? (textCenterHeight * contentSize) : ((fontSize * 0.8) + (logoPadding || 10) * 2);
      
      const newTx = x - dragStartOffset.current.x;
      const newTy = y - dragStartOffset.current.y;
      let valX = Math.max(0, Math.min(1, (newTx - contentX) / (contentSize - tw)));
      let valY = Math.max(0, Math.min(1, (newTy - contentY) / (contentSize - th)));
      
      // Snapping tolerance of 0.02 around 0.5 center
      const snapTolerance = 0.02;
      if (Math.abs(valX - 0.5) <= snapTolerance) {
          valX = 0.5;
      }
      if (Math.abs(valY - 0.5) <= snapTolerance) {
          valY = 0.5;
      }
      
      setTextCenterPosX(Math.round(valX * 1000) / 1000);
      setTextCenterPosY(Math.round(valY * 1000) / 1000);
    }
  }, [isDraggingCanvas, qrMatrixInfo, logo, logoWidth, logoHeight, logoRotation, textCenterEnabled, textCenterText, textCenterSize, textCenterWidth, textCenterHeight, textCenterPosX, textCenterPosY, textCenterRotation, textCenterFont, logoPadding, getQRContentArea, framePosition, frameRotation, frameSize, setFrameRotation, setFrameSize]);

  const stopCanvasDrag = useCallback(() => {
    setIsDraggingCanvas(false);
    dragType.current = null;
  }, []);

  useEffect(() => {
    if (isDraggingCanvas) {
      window.addEventListener('mousemove', handleCanvasMove);
      window.addEventListener('mouseup', stopCanvasDrag);
      window.addEventListener('touchmove', handleCanvasMove, { passive: false });
      window.addEventListener('touchend', stopCanvasDrag);
    }
    return () => {
      window.removeEventListener('mousemove', handleCanvasMove);
      window.removeEventListener('mouseup', stopCanvasDrag);
      window.removeEventListener('touchmove', handleCanvasMove);
      window.removeEventListener('touchend', stopCanvasDrag);
    };
  }, [isDraggingCanvas, handleCanvasMove, stopCanvasDrag]);

  // ── Tab definitions ──
  const TABS = [
    { id: 'content', label: 'Content', icon: Pencil },
    { id: 'color', label: 'Color', icon: Palette },
    { id: 'shapes', label: 'Style', icon: QRStyleIcon },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    // { id: 'frame',   label: 'Frame',   icon: LayoutGrid },
    { id: 'text', label: 'Text', icon: Type },
  ];

  // ── Get the frame CSS class for the preview wrapper ──
  const getFrameClass = () => {
    switch (frameStyle) {
      case FRAME_STYLES.BOX: return 'frame-simple-border';
      case FRAME_STYLES.ROUNDED: return 'frame-rounded-border';
      case FRAME_STYLES.MODERN: return 'frame-shadow-box';
      case FRAME_STYLES.SCAN_ME: return 'frame-neon-glow';
      case FRAME_STYLES.TEXT_BOTTOM: return 'frame-vintage-stamp';
      default: return '';
    }
  };
  const qrParams = {
    qrMatrixInfo,
    qrColor,
    bgColor,
    bgTransparent,
    dotStyle,
    eyeStyle,
    eyeColor,
    eyeOuterColor,
    syncEyes,
    dotPadding,
    eyePadding,
    gradientEnabled,
    gradientColor1,
    gradientColor2,
    gradientType,
    qrTextureEnabled,
    qrTexture,
    qrTextureSyncEyes,
    logo: logo?.image,
    logoWidth,
    logoHeight,
    logoPadding,
    logoBackground,
    logoBgColor,
    logoBgShape,
    logoOutline,
    logoOutlineColor,
    logoOutlineWidth,
    logoOutlineOpacity,
    quietZone: 2,
    frameStyle,
    frameText,
    frameColor,
    frameFont,
    frameSize,
    frameStrokeEnabled,
    frameStrokeWidth,
    frameStrokeColor,
    frameShadowEnabled,
    frameShadowBlur,
    frameShadowColor,
    framePosition,
    frameRotation,
    textCenterEnabled,
    textCenter: textCenterEnabled ? textCenterText : null,
    textCenterSize,
    textCenterColor,
    textCenterFont,
    textCenterStrokeEnabled,
    textCenterStrokeWidth,
    textCenterStrokeColor,
    textCenterShadowEnabled,
    textCenterShadowBlur,
    textCenterShadowColor,
    textCenterPosX,
    textCenterPosY,
    textCenterRotation,
    textCenterWidth,
    textCenterHeight,
    logoPosX,
    logoPosY,
    logoOpacity,
    logoRotation,
    logoShadowEnabled,
    logoShadowColor,
    logoShadowBlur,
    logoShadowOffsetX,
    logoShadowOffsetY,
    logoInnerShadowEnabled,
    logoEraseColorEnabled,
    logoEraseColor,
    logoEraseTolerance,
    logoEraseSmoothing,
    logoTexture,
    logoCrop
  };

  return (
    <div className="app redesigned">
      {/* ── Header ── */}
      <header 
        className={`app-header ${['home', 'saved', 'history', 'settings'].includes(activePage) ? 'header-home' : ''}`}
        style={{ display: activePage === 'barcode' ? 'none' : 'flex' }}
      >
        <div className="app-logo">
          {activePage === 'scanner' && (
            <button 
              onClick={goBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: '8px',
                marginRight: '8px',
                marginLeft: '-8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          )}
          <AppIcon size={44} shadow />
          {activePage === 'generator' ? (
            <div className="header-undo-redo" style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
              <button 
                onClick={undo} 
                disabled={historyIndex <= 0}
                style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', 
                  background: 'var(--bg-hover)', 
                  border: '1px solid var(--border-color)', 
                  color: historyIndex <= 0 ? 'var(--text-tertiary)' : 'var(--accent-primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: historyIndex <= 0 ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: historyIndex <= 0 ? 0.5 : 1
                }}
                title="Undo"
              >
                <Undo2 size={18} strokeWidth={2.5} />
              </button>
              <button 
                onClick={redo} 
                disabled={historyIndex >= history.length - 1}
                style={{ 
                  width: '36px', height: '36px', borderRadius: '10px', 
                  background: 'var(--bg-hover)', 
                  border: '1px solid var(--border-color)', 
                  color: historyIndex >= history.length - 1 ? 'var(--text-tertiary)' : 'var(--accent-primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: historyIndex >= history.length - 1 ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: historyIndex >= history.length - 1 ? 0.5 : 1
                }}
                title="Redo"
              >
                <Redo2 size={18} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="app-logo-text" style={{ whiteSpace: 'nowrap' }}>Mushi QR <span>Pro</span></div>
          )}
        </div>

        <div className="app-header-actions">
          {activePage === 'generator' && (
            <>
              {activeBatchItemIndex !== null ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      const currentStyle = getSnapshot();
                      const updated = batchItems.map(item => ({
                        ...item,
                        style: currentStyle
                      }));
                      setBatchItems(updated);
                      generatorIsDirtyRef.current = false;
                      setActiveBatchItemIndex(null);
                      navigateTo('batch');
                    }}
                    style={{
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Apply to All
                  </button>
                  <button 
                    onClick={() => {
                      const updated = [...batchItems];
                      updated[activeBatchItemIndex] = {
                        ...updated[activeBatchItemIndex],
                        style: getSnapshot()
                      };
                      setBatchItems(updated);
                      generatorIsDirtyRef.current = false;
                      setActiveBatchItemIndex(null);
                      navigateTo('batch');
                    }}
                    style={{
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    This Only
                  </button>
                </div>
              ) : (
                <div className="header-save-container" ref={downloadBtnRef} style={{ position: 'relative' }}>
                  <button
                    className={`btn-header-action btn-header-save ${!qrMatrixInfo ? 'disabled' : ''} ${formatDropdownOpen ? 'active' : ''}`}
                    onClick={() => setFormatDropdownOpen(!formatDropdownOpen)}
                    disabled={!qrMatrixInfo}
                    title="Save As..."
                  >
                    <Save size={20} />
                    <ChevronDown size={14} style={{ marginLeft: 2, opacity: 0.8 }} />
                  </button>

                {formatDropdownOpen && (
                  <div className="app-dropdown-menu save-as-dropdown fade-in" style={{ top: 'calc(100% + 12px)', right: 0, width: '280px' }}>
                    
                    <div className="dropdown-section" style={{ padding: '12px' }}>
                      <div className="dropdown-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Export Format</div>
                      <div className="format-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {[
                          { label: 'PNG', Icon: FileImage },
                          { label: 'SVG', Icon: FileCode },
                          { label: 'PDF', Icon: FileText },
                          { label: 'JPG', Icon: FileImage },
                        ].map(({ label, Icon }) => (
                          <button
                            key={label}
                            className={`format-option ${selectedFormat === label ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFormat(label);
                              setFormatDropdownOpen(false);
                              handleDownload(label, FORMAT_MAP[label]);
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              aspectRatio: '1 / 1',
                              padding: '0',
                              background: selectedFormat === label ? 'var(--accent-soft)' : 'var(--bg-hover)',
                              border: '1px solid',
                              borderColor: selectedFormat === label ? 'var(--accent-primary)' : 'transparent',
                              borderRadius: '12px',
                              color: selectedFormat === label ? 'var(--accent-primary)' : 'var(--text-primary)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Icon size={18} />
                            <span style={{ fontSize: '10px', fontWeight: 700 }}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="dropdown-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '0' }} />

                    <div className="dropdown-section" style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div className="dropdown-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Export Quality</div>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 800, 
                          color: 'var(--accent-primary)',
                          background: 'var(--accent-soft)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(214, 0, 54, 0.15)',
                          letterSpacing: '0.5px'
                        }}>
                          {exportQuality === 'Low' && '512px'}
                          {exportQuality === 'Medium' && '1024px'}
                          {exportQuality === 'High' && '2048px'}
                          {exportQuality === 'Ultra' && '4096px'}
                        </span>
                      </div>
                      <div style={{ padding: '0 8px', marginTop: '12px', marginBottom: '8px' }}>
                        <input
                          type="range"
                          min="0"
                          max="3"
                          step="1"
                          value={['Low', 'Medium', 'High', 'Ultra'].indexOf(exportQuality)}
                          onChange={(e) => {
                            const steps = ['Low', 'Medium', 'High', 'Ultra'];
                            const selected = steps[parseInt(e.target.value)] || 'High';
                            setExportQuality(selected);
                          }}
                          className="export-quality-slider"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          <span>Low</span>
                          <span>Normal</span>
                          <span>HD</span>
                          <span>4K</span>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '0' }} />

                    <div className="dropdown-section" style={{ padding: '12px' }}>
                      <div className="dropdown-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Scan Reliability</div>
                      <div className="ec-buttons-row" style={{ marginBottom: '10px', gap: '8px' }}>
                        {EC_LEVELS.map(lv => (
                          <button
                            key={lv.key}
                            className={`ec-btn${errorLevel === lv.key ? ' active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setErrorLevel(lv.key); }}
                          >
                            <span className="ec-btn-letter">{lv.label}</span>
                            <span className="ec-btn-pct">{lv.pct}</span>
                          </button>
                        ))}
                      </div>
                      <div className="reliability-bar-track" style={{ height: '4px', background: 'rgba(214, 0, 54, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div
                          className="reliability-bar-fill"
                          style={{ 
                            width: `${EC_LEVELS.find(l => l.key === errorLevel)?.width || 50}%`,
                            height: '100%',
                            background: 'var(--accent-primary)',
                            borderRadius: '2px',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                    </div>

                    <div className="dropdown-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '0' }} />

                    <div className="dropdown-section" style={{ padding: '12px' }}>
                      <div className="dropdown-label" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Quick Actions</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="menu-link-btn"
                          onClick={(e) => { e.stopPropagation(); handleCopyToClipboard(); setFormatDropdownOpen(false); }}
                          style={{ flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', padding: 0 }}
                          title="Copy Image"
                        >
                          <Copy size={20} />
                        </button>
                        <button
                          className="menu-link-btn"
                          onClick={(e) => { e.stopPropagation(); handleSave(); setFormatDropdownOpen(false); }}
                          style={{ flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', padding: 0 }}
                          title="Add to Saved"
                        >
                          <Bookmark size={20} />
                        </button>
                        {((typeof navigator !== 'undefined' && navigator.canShare) || Capacitor.isNativePlatform()) && (
                          <button
                            className="menu-link-btn"
                            onClick={(e) => { e.stopPropagation(); handleShare(); setFormatDropdownOpen(false); }}
                            style={{ flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', padding: 0 }}
                            title="Share QR Code"
                          >
                            <Share2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )}

              <div className="menu-container" ref={menuRef} style={{ position: 'relative' }}>
                {activeBatchItemIndex !== null ? (
                  <button
                    className="btn-menu-toggle"
                    onClick={() => {
                      generatorIsDirtyRef.current = false;
                      setActiveBatchItemIndex(null);
                      navigateTo('batch');
                    }}
                    aria-label="Cancel editing"
                    title="Cancel"
                  >
                    <X size={20} />
                  </button>
                ) : (
                  <button
                    className={`btn-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                  >
                    <Menu size={20} />
                  </button>
                )}

                {isMenuOpen && (
                  <div className="app-dropdown-menu fade-in" style={{ top: 'calc(100% + 12px)', right: 0 }}>
                    <div className="menu-links">
                      <button className={`menu-link-btn ${activePage === 'home' ? 'active' : ''}`} onClick={() => { setIsMenuOpen(false); navigateTo('home'); }}>
                        <Home size={16} /> Home
                      </button>
                      <button className={`menu-link-btn ${activePage === 'history' ? 'active' : ''}`} onClick={() => { setIsMenuOpen(false); navigateTo('history'); }}>
                        <History size={16} /> History
                      </button>
                      <button
                        className="menu-link-btn"
                        onClick={() => {
                          let next;
                          if (theme === 'dark') next = 'light';
                          else if (theme === 'light') next = 'auto';
                          else next = 'dark';

                          setTheme(next);
                          savePreferences({ ...getPreferences(), theme: next });
                        }}
                      >
                        {theme === 'dark' ? (
                          <Moon size={16} />
                        ) : theme === 'light' ? (
                          <Sun size={16} />
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20" />
                            <path d="M12 2a10 10 0 0 0 0 20V2z" fill="currentColor" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                        Theme <span style={{
                          textTransform: 'capitalize',
                          marginLeft: 4,
                          color: theme === 'dark' ? '#00F0FF' : theme === 'light' ? '#FF007F' : (effectiveTheme === 'dark' ? '#00F0FF' : '#FF007F'),
                          fontWeight: 'bold'
                        }}>{theme}</span>
                      </button>
                      <div className="menu-divider" style={{ height: '1px', background: 'var(--border-color)', margin: '4px 8px' }} />
                      <button className="menu-link-btn" onClick={() => window.location.hash = '#/about'}>
                        <Info size={16} /> About
                      </button>
                      <button className="menu-link-btn" onClick={() => window.location.hash = '#/privacy-policy'}>
                        <Shield size={16} /> Privacy Policy
                      </button>
                      <button className="menu-link-btn" onClick={() => window.location.hash = '#/terms'}>
                        <FileIcon size={16} /> Terms of Service
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="app-main-redesigned">
        {activePage === 'generator' ? (
          <>
            {/* ── QR Preview Card (always visible) ── */}
            <ErrorBoundary>
              <section className="qr-preview-card">
                <div className={`qr-preview-wrapper ${getFrameClass()}`}>
                  {!qrMatrixInfo ? (
                    <div className="preview-placeholder">
                      <span className="preview-placeholder-icon">
                        <QrCode size={80} color="var(--accent-primary)" strokeWidth={1} />
                      </span>
                      <span className="preview-placeholder-text">Your QR code will appear here</span>
                    </div>
                  ) : (
                    <canvas 
                      ref={canvasRef} 
                      className="preview-canvas" 
                      onMouseDown={handleCanvasInteraction}
                      onTouchStart={handleCanvasInteraction}
                      onDoubleClick={handleCanvasDoubleClick}
                      style={{ 
                        willChange: 'transform',
                        cursor: isDraggingCanvas ? 'grabbing' : (logo?.image || textCenterEnabled ? 'move' : 'default'),
                        touchAction: 'none'
                      }} 
                    />
                  )}
                </div>





              </section>
            </ErrorBoundary>

            {/* ── Tab Panel Content ── */}
            <section className="tab-panel-area">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="tab-panel fade-in" id="panel-content">
                  <div className="panel-scroll-area" style={{ flex: '1', overflowY: 'auto', padding: '16px 20px 100px 20px', display: 'flex', flexDirection: 'column' }}>
                    <QRTypeSelector
                      activeType={qrType}
                      onTypeChange={(type) => {
                        setQrType(type);
                        generatorIsDirtyRef.current = true;
                        setIsDataModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              )}



              {/* Logo Tab */}
              {activeTab === 'logo' && (
                <div className="tab-panel fade-in" id="panel-logo">
                  <div className="panel-scroll-area" style={{ flex: '1', overflowY: 'auto', padding: '16px 20px 100px 20px' }}>
                    {/* 1. Presets Section */}
                    <LogoPresets 
                      logo={logo} 
                      onLogoChange={(l) => { 
                        setLogo(l); 
                        setLogoWidth(0.18); 
                        setLogoHeight(0.18); 
                        setLogoRotation(0);
                        setLogoPosX(0.5);
                        setLogoPosY(0.5);
                        startEditing('logo', 'size'); 
                      }} 
                      onLogoRemove={() => { 
                        setLogo(null); 
                        setLogoWidth(0.18);
                        setLogoHeight(0.18);
                        setLogoRotation(0);
                        if (logoPopup) cancelEditing(); 
                      }} 
                    />
                  </div>

                </div>
              )}




            </section>

            {/* ─── Shared Unified Expandable Toolbar (Centralized Bottom Layer) ─── */}
            {((activeTab === 'logo' && logo) || activeTab === 'text' || activeTab === 'color' || activeTab === 'shapes') && (
              <div className="logo-toolbar-container">
                <div className="unified-toolbar-card">

                  {(logoPopup || textPopup || colorPopup || shapePopup) ? (
                    <div className="toolbar-editing-view fade-in">
                      <div className="toolbar-editing-header">
                        <button className="toolbar-cancel-btn" onClick={cancelEditing}>
                          <X size={20} />
                        </button>
                        <button className="toolbar-apply-btn" onClick={applyEditing}>
                          <Check size={20} />
                        </button>
                      </div>

                      <div className="toolbar-properties-panel-full">
                      {logoPopup === 'size' && (
                        <div className="fade-in">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <Slider 
                                label="Logo Width" 
                                value={logoWidth} 
                                min={0.05} 
                                max={0.6} 
                                step={0.01} 
                                onChange={(val) => {
                                  if (logoAspectRatioLocked) {
                                    const ratio = logoWidth > 0 ? (logoHeight / logoWidth) : 1;
                                    setLogoWidth(val);
                                    setLogoHeight(Math.max(0.05, Math.min(0.6, val * ratio)));
                                  } else {
                                    setLogoWidth(val);
                                  }
                                }} 
                              />
                              <Slider 
                                label="Logo Height" 
                                value={logoHeight} 
                                min={0.05} 
                                max={0.6} 
                                step={0.01} 
                                onChange={(val) => {
                                  if (logoAspectRatioLocked) {
                                    const ratio = logoHeight > 0 ? (logoWidth / logoHeight) : 1;
                                    setLogoHeight(val);
                                    setLogoWidth(Math.max(0.05, Math.min(0.6, val * ratio)));
                                  } else {
                                    setLogoHeight(val);
                                  }
                                }} 
                              />
                            </div>
                            
                            <Toggle 
                              label="Resize Combined" 
                              checked={logoAspectRatioLocked} 
                              onChange={setLogoAspectRatioLocked} 
                            />
                            
                            <Slider label="Logo Padding" value={logoPadding} min={0} max={20} step={1} onChange={setLogoPadding} />
                          </div>
                        </div>
                      )}
                      {logoPopup === 'stroke' && (
                        <div className="fade-in">
                          <Toggle label="Enable Stroke" checked={logoOutline} onChange={setLogoOutline} />
                          {logoOutline && (
                            <div className="fade-in" style={{ marginTop: '14px' }}>
                               {renderColorOrGradientPicker("Stroke Color", logoOutlineColor, setLogoOutlineColor, handleOpenAdv)}
                              <Slider label="Stroke Width" value={logoOutlineWidth} min={1} max={10} step={1} onChange={setLogoOutlineWidth} />
                            </div>
                          )}
                        </div>
                      )}
                      {logoPopup === 'bg' && (
                        <div className="fade-in">
                          <Toggle label="Enable Background" checked={logoBackground} onChange={setLogoBackground} />
                          {logoBackground && (
                            <div className="fade-in" style={{ marginTop: '14px' }}>
                              <div className="font-scroll-container" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0 8px 0', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', marginBottom: '14px' }}>
                                {LOGO_BG_SHAPES.map(shape => {
                                  const isActive = logoBgShape === shape.id;
                                  return (
                                                                    <button 
                                      key={shape.id} 
                                      onClick={() => setLogoBgShape(shape.id)}
                                      className={`font-scroll-btn ${isActive ? 'active' : ''}`} 
                                      style={{ 
                                        flex: '0 0 auto', 
                                        padding: '4px', 
                                        borderRadius: '14px', 
                                        background: isActive ? 'var(--accent-primary)' : 'var(--bg-elevated)', 
                                        color: isActive ? '#fff' : 'var(--text-primary)', 
                                        border: '2px solid', 
                                        borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)', 
                                        cursor: 'pointer', 
                                        transition: 'all 0.2s ease', 
                                        boxShadow: isActive ? '0 4px 12px rgba(255,59,48,0.3)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '64px',
                                        height: '64px'
                                      }}
                                      title={shape.label}
                                    >
                                      {renderShapeThumbnail(shape.id, isActive ? '#ffffff' : 'var(--text-primary)')}
                                    </button>
                                  );
                                })}
                              </div>
                               {renderColorOrGradientPicker("Background Color", logoBgColor, setLogoBgColor, handleOpenAdv)}
                            </div>
                          )}
                        </div>
                      )}
                      {logoPopup === 'pos' && (
                        <div className="fade-in">
                          <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <div className="pos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px', background: 'var(--bg-elevated)', borderRadius: '16px' }}>
                                {[0, 0.5, 1].map(y => [0, 0.5, 1].map(x => (
                                  <button key={`${x}-${y}`} onClick={() => { setLogoPosX(x); setLogoPosY(y); }} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', background: logoPosX === x && logoPosY === y ? 'var(--accent-primary)' : 'var(--bg-primary)', cursor: 'pointer', transition: 'all 0.2s ease' }} />
                                )))}
                              </div>
                            </div>
                            <Slider label="Horizontal" value={logoPosX} min={0} max={1} step={0.01} onChange={setLogoPosX} />
                            <Slider label="Vertical" value={logoPosY} min={0} max={1} step={0.01} onChange={setLogoPosY} />
                          </div>
                        </div>
                      )}
                      {logoPopup === 'rotate' && (
                        <div className="fade-in">
                          <Slider label="Rotation" value={logoRotation} min={0} max={360} step={1} onChange={setLogoRotation} />
                        </div>
                      )}
                      {logoPopup === 'opacity' && (
                        <div className="fade-in">
                          <Slider label="Opacity" value={logoOpacity} min={0} max={1} step={0.01} onChange={setLogoOpacity} />
                        </div>
                      )}
                      {logoPopup === 'shadow' && (
                        <div className="fade-in">
                          <Toggle label="Drop Shadow" checked={logoShadowEnabled} onChange={setLogoShadowEnabled} />
                          {logoShadowEnabled && (
                            <div className="fade-in" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                               <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                 <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '8px' }}>Shadow Color</div>
                                 <div className="swatch-grid-mini">
                                   <ColorPicker isSwatch={true} icon={Pipette} value={logoShadowColor} onChange={setLogoShadowColor} onOpenAdvanced={handleOpenAdv} />
                                   {SWATCH_PRESETS.map(color => (
                                     <div key={color} className={`swatch-item${logoShadowColor === color ? ' active' : ''}`} style={{ backgroundColor: color }} onClick={() => setLogoShadowColor(color)} />
                                   ))}
                                 </div>
                               </div>
                               <Slider label="Blur" value={logoShadowBlur} min={0} max={40} step={1} onChange={setLogoShadowBlur} />
                               <div style={{ display: 'flex', gap: '12px' }}>
                                 <div style={{ flex: 1 }}><Slider label="Offset X" value={logoShadowOffsetX} min={-20} max={20} step={1} onChange={setLogoShadowOffsetX} /></div>
                                 <div style={{ flex: 1 }}><Slider label="Offset Y" value={logoShadowOffsetY} min={-20} max={20} step={1} onChange={setLogoShadowOffsetY} /></div>
                               </div>
                            </div>
                          )}
                          <div style={{ marginTop: '16px' }}>
                            <Toggle label="Inner Shadow" checked={logoInnerShadowEnabled} onChange={setLogoInnerShadowEnabled} />
                          </div>
                        </div>
                      )}
                      {logoPopup === 'filter' && (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Method</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button 
                                onClick={() => {
                                  setLogoEraseColorEnabled(false);
                                  setLogoEraseMode('none');
                                }}
                                className={`seg-btn ${logoEraseMode === 'none' || !logoEraseColorEnabled ? 'active' : ''}`}
                                style={{ flex: '1', padding: '10px', fontSize: '12px' }}
                              >
                                Keep BG
                              </button>
                              <button 
                                onClick={() => {
                                  setLogoEraseColorEnabled(true);
                                  setLogoEraseColor('#ffffff');
                                  setLogoEraseMode('white');
                                }}
                                className={`seg-btn ${logoEraseColorEnabled && logoEraseMode === 'white' ? 'active' : ''}`}
                                style={{ flex: '1', padding: '10px', fontSize: '12px' }}
                              >
                                Remove White
                              </button>
                              <button 
                                onClick={() => {
                                  setLogoEraseColorEnabled(true);
                                  setLogoEraseColor('#000000');
                                  setLogoEraseMode('black');
                                }}
                                className={`seg-btn ${logoEraseColorEnabled && logoEraseMode === 'black' ? 'active' : ''}`}
                                style={{ flex: '1', padding: '10px', fontSize: '12px' }}
                              >
                                Remove Black
                              </button>
                              <button 
                                onClick={() => {
                                  setLogoEraseColorEnabled(true);
                                  setLogoEraseMode('custom');
                                  // Default to red if color is white or black to show custom picker
                                  if (logoEraseColor.toLowerCase() === '#ffffff' || logoEraseColor.toLowerCase() === '#000000') {
                                    setLogoEraseColor('#ff0000');
                                  }
                                }}
                                className={`seg-btn ${logoEraseColorEnabled && logoEraseMode === 'custom' ? 'active' : ''}`}
                                style={{ flex: '1', padding: '10px', fontSize: '12px' }}
                              >
                                Custom Color
                              </button>
                            </div>
                          </div>

                          {logoEraseColorEnabled && (
                            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {logoEraseMode === 'custom' && (
                                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: '8px' }}>Select Target Color</div>
                                  <div className="swatch-grid-mini">
                                    <ColorPicker isSwatch={true} icon={Pipette} value={logoEraseColor} onChange={setLogoEraseColor} onOpenAdvanced={handleOpenAdv} />
                                    {SWATCH_PRESETS.map(color => (
                                      <div key={color} className={`swatch-item${logoEraseColor === color ? ' active' : ''}`} style={{ backgroundColor: color }} onClick={() => setLogoEraseColor(color)} />
                                    ))}
                                  </div>
                                </div>
                              )}

                              <Slider 
                                label="Sensitivity (Tolerance)" 
                                value={logoEraseTolerance} 
                                min={5} 
                                max={150} 
                                step={1} 
                                onChange={logoEraseTolerance => setLogoEraseTolerance(logoEraseTolerance)} 
                              />
                              <Slider 
                                label="Edge Smoothing (Feather)" 
                                value={logoEraseSmoothing} 
                                min={0} 
                                max={80} 
                                step={1} 
                                onChange={logoEraseSmoothing => setLogoEraseSmoothing(logoEraseSmoothing)} 
                              />
                              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', margin: 0 }}>
                                Drag sliders to adjust how cleanly the background color is removed.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {logoPopup === 'texture' && (
                        <div className="fade-in">
                           <div className="font-scroll-container" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0 8px 0', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                                {['none', 'glass', 'carbon', 'metal', 'mesh', 'dots'].map(t => {
                                  const isActive = logoTexture === t;
                                  return (
                                    <button 
                                      key={t} 
                                      onClick={() => setLogoTexture(t)}
                                      className={`font-scroll-btn ${isActive ? 'active' : ''}`} 
                                      style={{ flex: '0 0 auto', padding: '10px 18px', borderRadius: '12px', background: isActive ? 'var(--accent-primary)' : 'var(--bg-elevated)', color: isActive ? '#fff' : 'var(--text-primary)', border: '1px solid', borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)', fontSize: '14px', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    >
                                      {t}
                                    </button>
                                  );
                                })}
                           </div>
                        </div>
                      )}
                      {logoPopup === 'crop' && (
                        <div className="fade-in">
                           <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Quick Shape Crop</div>
                           <div className="seg-control" style={{ marginBottom: '16px' }}>
                             <button className={`seg-btn ${logoCrop === 'none' ? 'active' : ''}`} onClick={() => setLogoCrop('none')}>None</button>
                             <button className={`seg-btn ${logoCrop === 'circle' ? 'active' : ''}`} onClick={() => setLogoCrop('circle')}>Circle</button>
                             <button className={`seg-btn ${logoCrop === 'rounded' ? 'active' : ''}`} onClick={() => setLogoCrop('rounded')}>Rounded</button>
                             <button className={`seg-btn ${logoCrop === 'square' ? 'active' : ''}`} onClick={() => setLogoCrop('square')}>Square</button>
                           </div>
                           <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                             Select a shape to instantly mask your logo.
                           </p>
                        </div>
                      )}

                      {/* TEXT PROPERTIES */}
                      {textPopup === 'input' && (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Toggle
                              label={
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: textEditMode === 'center' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--border-color)', display: 'inline-block', flexShrink: 0 }} />
                                  Center Text
                                </span>
                              }
                              checked={textCenterEnabled}
                              onChange={(val) => {
                                setTextCenterEnabled(val);
                                if (val) {
                                  setLogo(null);
                                  setLogoWidth(0.18);
                                  setLogoHeight(0.18);
                                  setLogoRotation(0);
                                  setTextCenterWidth(null);
                                  setTextCenterHeight(null);
                                  setTextEditMode('center');
                                  setCanvasSelection('text');
                                } else {
                                  if (canvasSelection === 'text') setCanvasSelection(null);
                                }
                              }}
                            />
                            {textCenterEnabled && (
                              <input 
                                id="center-text-input"
                                type="text" 
                                maxLength={18} 
                                value={textCenterText} 
                                onChange={(e) => {
                                  setTextCenterText(e.target.value);
                                  setTextCenterWidth(null);
                                  setTextCenterHeight(null);
                                }} 
                                onFocus={() => {
                                  setTextEditMode('center');
                                  setCanvasSelection('text');
                                }}
                                placeholder="Type center text..." 
                                className="text-input-premium" 
                                style={{ width: '100%', borderColor: textEditMode === 'center' ? 'var(--accent-primary)' : 'var(--border-color)' }} 
                              />
                            )}
                          </div>

                          <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Toggle
                              label={
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: textEditMode === 'frame' ? 'var(--accent-primary)' : 'transparent', border: '1px solid var(--border-color)', display: 'inline-block', flexShrink: 0 }} />
                                  Frame Text
                                </span>
                              }
                              checked={frameStyle !== 'none'}
                              onChange={(val) => {
                                setFrameStyle(val ? (frameStyle === 'none' ? 'text' : frameStyle) : 'none');
                                if (val) {
                                  setTextEditMode('frame');
                                  setCanvasSelection('frame-text');
                                } else {
                                  if (canvasSelection === 'frame-text') setCanvasSelection(null);
                                }
                              }}
                            />
                            {frameStyle !== 'none' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input 
                                  id="frame-text-input"
                                  type="text" 
                                  maxLength={50} 
                                  value={frameText} 
                                  onChange={(e) => setFrameText(e.target.value)} 
                                  onFocus={() => {
                                    setTextEditMode('frame');
                                    setCanvasSelection('frame-text');
                                  }}
                                  placeholder="Type frame text..." 
                                  className="text-input-premium" 
                                  style={{ width: '100%', borderColor: textEditMode === 'frame' ? 'var(--accent-primary)' : 'var(--border-color)' }} 
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Position</span>
                                  <div className="seg-control" style={{ width: '150px', height: '32px', display: 'flex' }}>
                                    <button 
                                      type="button"
                                      className={`seg-btn ${framePosition === 'top' ? 'active' : ''}`} 
                                      onClick={() => setFramePosition('top')}
                                      style={{ flex: 1, padding: '2px 8px', fontSize: '11px' }}
                                    >
                                      Top
                                    </button>
                                    <button 
                                      type="button"
                                      className={`seg-btn ${framePosition === 'bottom' ? 'active' : ''}`} 
                                      onClick={() => setFramePosition('bottom')}
                                      style={{ flex: 1, padding: '2px 8px', fontSize: '11px' }}
                                    >
                                      Bottom
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {textPopup === 'fonts' && (
                        <div className="fade-in">
                          <button onClick={() => fontInputRef.current?.click()} className="font-scroll-btn-wide"><Plus size={14} /> Add Font</button>
                          <input type="file" ref={fontInputRef} style={{ display: 'none' }} accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} />
                          <div className="fonts-grid">
                            {customFonts.map(font => (
                              <button key={font.id} onClick={() => { if (textEditMode === 'center') setTextCenterFont(font.id); else { setFrameFont(font.id); if (frameStyle === 'none') setFrameStyle('text'); } }} className={`font-btn ${(textEditMode === 'center' ? textCenterFont : frameFont) === font.id ? 'active' : ''}`} style={{ fontFamily: font.id }}>{font.label} ★</button>
                            ))}
                            {FONT_OPTIONS.map(font => (
                              <button key={font.id} onClick={() => { if (textEditMode === 'center') setTextCenterFont(font.id); else { setFrameFont(font.id); if (frameStyle === 'none') setFrameStyle('text'); } }} className={`font-btn ${(textEditMode === 'center' ? textCenterFont : frameFont) === font.id ? 'active' : ''}`} style={{ fontFamily: font.id }}>{font.label}</button>
                            ))}
                          </div>
                        </div>
                      )}
                      {textPopup === 'size' && (
                        <div className="fade-in">
                          {textEditMode === 'center' ? (
                            <Slider 
                              label="Size" 
                              min={2} 
                              max={100} 
                              step={1} 
                              value={Math.round(((textCenterSize - 0.02) / 0.33) * 98 + 2)} 
                              onChange={(val) => {
                                const newSize = 0.02 + ((val - 2) / 98) * 0.33;
                                setTextCenterSize(Math.round(newSize * 1000) / 1000);
                                setTextCenterWidth(null);
                                setTextCenterHeight(null);
                              }} 
                            />
                          ) : (
                            <Slider 
                              label="Size" 
                              min={0.02} 
                              max={0.18} 
                              step={0.01} 
                              value={frameSize} 
                              onChange={(val) => setFrameSize(val)} 
                            />
                          )}
                        </div>
                      )}
                      {textPopup === 'color' && (
                        <div className="fade-in">
                          {textEditMode === 'center' ? (
                            renderColorOrGradientPicker("Text Color", textCenterColor, setTextCenterColor, handleOpenAdv)
                          ) : (
                            renderColorOrGradientPicker("Frame Color", frameColor, setFrameColor, handleOpenAdv)
                          )}
                        </div>
                      )}
                      {textPopup === 'stroke' && (
                        <div className="fade-in">
                          <Toggle label="Enable Stroke" checked={textEditMode === 'center' ? textCenterStrokeEnabled : frameStrokeEnabled} onChange={textEditMode === 'center' ? setTextCenterStrokeEnabled : setFrameStrokeEnabled} />
                          {(textEditMode === 'center' ? textCenterStrokeEnabled : frameStrokeEnabled) && (
                            <div className="fade-in" style={{ marginTop: '14px' }}>
                              {textEditMode === 'center' ? (
                                renderColorOrGradientPicker("Stroke Color", textCenterStrokeColor, setTextCenterStrokeColor, handleOpenAdv)
                              ) : (
                                renderColorOrGradientPicker("Stroke Color", frameStrokeColor, setFrameStrokeColor, handleOpenAdv)
                              )}
                              <div style={{ marginTop: '14px' }}>
                                <Slider label="Stroke Width" min={1} max={textEditMode === 'center' ? 100 : 20} value={textEditMode === 'center' ? textCenterStrokeWidth : frameStrokeWidth} onChange={textEditMode === 'center' ? setTextCenterStrokeWidth : setFrameStrokeWidth} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {textPopup === 'shadow' && (
                        <div className="fade-in">
                          <Toggle label="Enable Shadow" checked={textEditMode === 'center' ? textCenterShadowEnabled : frameShadowEnabled} onChange={textEditMode === 'center' ? setTextCenterShadowEnabled : setFrameShadowEnabled} />
                          {(textEditMode === 'center' ? textCenterShadowEnabled : frameShadowEnabled) && (
                            <div className="fade-in" style={{ marginTop: '14px' }}>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Shadow Color</div>
                              <div className="swatch-grid-mini" style={{ marginBottom: '12px' }}>
                                <ColorPicker isSwatch={true} icon={Pipette} iconSize={14} value={textEditMode === 'center' ? textCenterShadowColor : frameShadowColor} onChange={textEditMode === 'center' ? setTextCenterShadowColor : setFrameShadowColor} onOpenAdvanced={handleOpenAdv} />
                                {SWATCH_PRESETS.map(color => (
                                  <div key={color} className={`swatch-item${(textEditMode === 'center' ? textCenterShadowColor : frameShadowColor) === color ? ' active' : ''}`} style={{ backgroundColor: color }} onClick={() => textEditMode === 'center' ? setTextCenterShadowColor(color) : setFrameShadowColor(color)} />
                                ))}
                              </div>
                              <Slider label="Shadow Blur" min={0} max={30} value={textEditMode === 'center' ? textCenterShadowBlur : frameShadowBlur} onChange={textEditMode === 'center' ? setTextCenterShadowBlur : setFrameShadowBlur} />
                            </div>
                          )}
                        </div>
                      )}
                      {textPopup === 'bg' && (
                        <div className="fade-in">
                          {textEditMode === 'center' && (
                            <Toggle label="Enable Background" checked={logoBackground} onChange={setLogoBackground} />
                          )}
                          {(textEditMode === 'frame' || logoBackground) && (
                            <div className="fade-in" style={{ marginTop: textEditMode === 'center' ? '14px' : '0' }}>
                              <div className="font-scroll-container" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0 8px 0', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', marginBottom: '14px' }}>
                                {TEXT_SHAPES.map(shape => {
                                  const isActive = textEditMode === 'center' ? logoBgShape === shape.id : frameStyle === shape.id;
                                  return (
                                    <button 
                                      key={shape.id} 
                                      onClick={() => {
                                        if (textEditMode === 'center') setLogoBgShape(shape.id);
                                        else setFrameStyle(shape.id);
                                      }}
                                      className={`font-scroll-btn ${isActive ? 'active' : ''}`} 
                                      style={{ flex: '0 0 auto', padding: '10px 18px', borderRadius: '12px', background: isActive ? 'var(--accent-primary)' : 'var(--bg-elevated)', color: isActive ? '#fff' : 'var(--text-primary)', border: '1px solid', borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)', fontSize: '14px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isActive ? '0 4px 12px rgba(255,59,48,0.3)' : 'none' }}
                                    >
                                      {shape.label}
                                    </button>
                                  );
                                })}
                              </div>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Shape Color</div>
                              <div className="swatch-grid-mini">
                                <ColorPicker isSwatch={true} icon={Pipette} value={textEditMode === 'center' ? logoBgColor : frameColor} onChange={textEditMode === 'center' ? setLogoBgColor : setFrameColor} onOpenAdvanced={handleOpenAdv} />
                                {SWATCH_PRESETS.map(color => (
                                  <div key={color} className={`swatch-item${(textEditMode === 'center' ? logoBgColor : frameColor) === color ? ' active' : ''}`} style={{ backgroundColor: color }} onClick={() => textEditMode === 'center' ? setLogoBgColor(color) : setFrameColor(color)} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {textPopup === 'pos' && (
                        <div className="fade-in">
                          <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <div className="pos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '8px', background: 'var(--bg-elevated)', borderRadius: '16px' }}>
                                {[0, 0.5, 1].map(y => [0, 0.5, 1].map(x => (
                                  <button key={`${x}-${y}`} onClick={() => { setTextCenterPosX(x); setTextCenterPosY(y); }} style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', background: textCenterPosX === x && textCenterPosY === y ? 'var(--accent-primary)' : 'var(--bg-primary)', cursor: 'pointer', transition: 'all 0.2s ease' }} />
                                )))}
                              </div>
                            </div>
                            <Slider label="Horizontal" value={textCenterPosX} min={0} max={1} step={0.01} onChange={setTextCenterPosX} />
                            <Slider label="Vertical" value={textCenterPosY} min={0} max={1} step={0.01} onChange={setTextCenterPosY} />
                          </div>
                        </div>
                      )}
                      {textPopup === 'rotate' && (
                        <div className="fade-in">
                          <Slider 
                            label="Rotation" 
                            value={textEditMode === 'center' ? textCenterRotation : frameRotation} 
                            min={0} 
                            max={360} 
                            step={1} 
                            onChange={(val) => {
                              if (textEditMode === 'center') setTextCenterRotation(val);
                              else setFrameRotation(val);
                            }} 
                          />
                        </div>
                      )}


                      {colorPopup === 'presets' && (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Presets Style</div>
                            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px' }}>
                              <button 
                                onClick={() => setPresetTab('solid')}
                                style={{ border: 'none', background: presetTab === 'solid' ? 'var(--accent-primary)' : 'transparent', color: presetTab === 'solid' ? '#fff' : 'var(--text-primary)', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                              >
                                Solid
                              </button>
                              <button 
                                onClick={() => setPresetTab('gradient')}
                                style={{ border: 'none', background: presetTab === 'gradient' ? 'var(--accent-primary)' : 'transparent', color: presetTab === 'gradient' ? '#fff' : 'var(--text-primary)', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                              >
                                Gradient
                              </button>
                            </div>
                          </div>

                          {presetTab === 'solid' ? (
                            <div className="fade-in">
                              <div className="swatch-grid-mini" style={{ padding: '4px 0 8px 0', gap: '10px' }}>
                                {COLOR_PRESETS.map(p => {
                                  const isSelected = qrColor === p.qr && bgColor === p.bg;
                                  return (
                                    <button 
                                      key={p.name} 
                                      onClick={() => { 
                                        setQrColor(p.qr); 
                                        setBgColor(p.bg); 
                                        if (syncEyes) { setEyeColor(p.qr); setEyeOuterColor(p.qr); } 
                                        setBgTransparent(false);
                                      }} 
                                      style={{ 
                                        flex: '0 0 auto',
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        gap: '6px', 
                                        background: 'none', 
                                        border: 'none',
                                        padding: '0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        width: '60px'
                                      }}
                                    >
                                      <div style={{ 
                                        width: '44px', 
                                        height: '44px', 
                                        borderRadius: '12px', 
                                        background: p.bg, 
                                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        boxShadow: isSelected ? '0 8px 16px rgba(255,59,48,0.25)' : '0 2px 6px rgba(0,0,0,0.06)',
                                        transition: 'all 0.2s ease'
                                      }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: p.qr }} />
                                      </div>
                                      <span style={{ 
                                        fontSize: '10px', 
                                        fontWeight: isSelected ? 700 : 500, 
                                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        width: '100%', 
                                        textAlign: 'center' 
                                      }}>{p.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="fade-in">
                              <div className="swatch-grid-mini" style={{ padding: '4px 0 8px 0', gap: '10px' }}>
                                {TRENDING_GRADIENT_PRESETS.map(p => {
                                  const isSelected = qrColor === p.qr && bgColor === p.bg;
                                  return (
                                    <button 
                                      key={p.name} 
                                      onClick={() => { 
                                        setQrColor(p.qr); 
                                        setBgColor(p.bg); 
                                        if (syncEyes) { setEyeColor(p.qr); setEyeOuterColor(p.qr); } 
                                        setBgTransparent(false);
                                      }} 
                                      style={{ 
                                        flex: '0 0 auto',
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        gap: '6px', 
                                        background: 'none', 
                                        border: 'none',
                                        padding: '0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        width: '60px'
                                      }}
                                    >
                                      <div style={{ 
                                        width: '44px', 
                                        height: '44px', 
                                        borderRadius: '12px', 
                                        background: p.bg, 
                                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        boxShadow: isSelected ? '0 8px 16px rgba(255,59,48,0.25)' : '0 2px 6px rgba(0,0,0,0.06)',
                                        transition: 'all 0.2s ease'
                                      }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: p.qr }} />
                                      </div>
                                      <span style={{ 
                                        fontSize: '10px', 
                                        fontWeight: isSelected ? 700 : 500, 
                                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        width: '100%', 
                                        textAlign: 'center' 
                                      }}>{p.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {colorPopup === 'dots' && (
                        <div className="fade-in">
                          {renderColorOrGradientPicker("Dots Color", qrColor, setQrColor, handleOpenAdv)}
                        </div>
                      )}
                      {colorPopup === 'bg' && (
                        <div className="fade-in">
                          <Toggle label="Transparent Background" checked={bgTransparent} onChange={setBgTransparent} />
                          {!bgTransparent && (
                            <div style={{ marginTop: '16px' }}>
                              {renderColorOrGradientPicker("Background Color", bgColor, (c) => { setBgColor(c); setLogoBgColor(c); setBgTransparent(false); }, handleOpenAdv)}
                            </div>
                          )}
                        </div>
                      )}
                      {colorPopup === 'eyes' && (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <Toggle label="Sync Eyes with Dots" checked={syncEyes} onChange={setSyncEyes} />
                          {!syncEyes && (
                            <>
                              <Toggle label="Sync Inner & Outer Eye Colors" checked={syncInnerOuterEyes} onChange={(val) => {
                                setSyncInnerOuterEyes(val);
                                if (val) {
                                  setEyeOuterColor(eyeColor || qrColor);
                                }
                              }} />
                              
                              {syncInnerOuterEyes ? (
                                <div className="fade-in">
                                  {renderColorOrGradientPicker("Eyes Color", eyeColor || qrColor, (c) => { setEyeColor(c); setEyeOuterColor(c); }, handleOpenAdv)}
                                </div>
                              ) : (
                                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Eyes Section</div>
                                    <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px' }}>
                                      <button 
                                        onClick={() => setEyeColorTab('inner')}
                                        style={{ border: 'none', background: eyeColorTab === 'inner' ? 'var(--accent-primary)' : 'transparent', color: eyeColorTab === 'inner' ? '#fff' : 'var(--text-primary)', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                      >
                                        Inner
                                      </button>
                                      <button 
                                        onClick={() => setEyeColorTab('outer')}
                                        style={{ border: 'none', background: eyeColorTab === 'outer' ? 'var(--accent-primary)' : 'transparent', color: eyeColorTab === 'outer' ? '#fff' : 'var(--text-primary)', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                      >
                                        Outer
                                      </button>
                                    </div>
                                  </div>

                                  {eyeColorTab === 'inner' ? (
                                    <div className="fade-in">
                                      {renderColorOrGradientPicker("Inner Eyes Color", eyeColor || qrColor, setEyeColor, handleOpenAdv)}
                                    </div>
                                  ) : (
                                    <div className="fade-in">
                                      {renderColorOrGradientPicker("Outer Eyes Color", eyeOuterColor || qrColor, setEyeOuterColor, handleOpenAdv)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {colorPopup === 'texture' && (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                              <Toggle label="Enable QR Texture" checked={qrTextureEnabled} onChange={setQrTextureEnabled} />
                            </div>
                            {qrTextureEnabled && (
                              <div style={{ flex: 1, minWidth: '150px' }}>
                                <Toggle label="Sync Eyes with Dots" checked={qrTextureSyncEyes} onChange={setQrTextureSyncEyes} />
                              </div>
                            )}
                          </div>
                          
                          {qrTextureEnabled && (
                            <div className="fade-in">
                              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                <div className="logo-presets-grid">
                                  {/* Upload Button */}
                                  <button
                                    className={`logo-preset-btn upload-tile ${qrTexture && !SOCIAL_TEXTURES.some(p => p.url === qrTexture.src) ? 'active' : ''}`}
                                    onClick={() => {
                                      if (qrTexture && !SOCIAL_TEXTURES.some(p => p.url === qrTexture.src)) {
                                        setQrTexture(null);
                                      } else {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (re) => {
                                              const img = new Image();
                                              img.onload = () => setQrTexture({ src: re.target.result, image: img, name: file.name });
                                              img.src = re.target.result;
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        };
                                        input.click();
                                      }
                                    }}
                                    title="Upload Custom Texture"
                                    style={{ background: 'var(--bg-elevated)', border: '2px dashed var(--border-light)' }}
                                  >
                                    {qrTexture && !SOCIAL_TEXTURES.some(p => p.url === qrTexture.src) ? (
                                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <img src={qrTexture.src} alt="Custom" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                                        <X size={16} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--error)' }} />
                                      </div>
                                    ) : (
                                      <UploadCloud size={24} color="var(--accent-primary)" />
                                    )}
                                  </button>

                                  {/* Social App Texture Presets */}
                                  {SOCIAL_TEXTURES.map((p) => {
                                    const isActive = qrTexture?.src === p.url;
                                    return (
                                      <button
                                        key={p.slug}
                                        className={`logo-preset-btn ${isActive ? 'active' : ''}`}
                                        onClick={() => {
                                          if (isActive) {
                                            setQrTexture(null);
                                          } else {
                                            const img = new Image();
                                            img.onload = () => setQrTexture({ src: p.url, image: img, name: p.name });
                                            img.src = p.url;
                                          }
                                        }}
                                        title={p.name}
                                      >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                          <img 
                                            src={p.url} 
                                            alt={p.name} 
                                            loading="lazy" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isActive ? 0.3 : 1, transition: 'opacity 0.2s' }} 
                                          />
                                          {isActive && (
                                            <X size={18} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--accent-primary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                {qrTexture && (
                                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '4px' }}>
                                    Active: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{qrTexture.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                       {shapePopup === 'dots' && (
                        <div className="fade-in">
                          <DotStyleSelector value={dotStyle} onChange={setDotStyle} qrParams={qrParams} />
                        </div>
                      )}
                      {shapePopup === 'eyes' && (
                        <div className="fade-in">
                          <EyeStyleSelector value={eyeStyle} onChange={setEyeStyle} qrParams={qrParams} />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                    <div className="toolbar-tabs-row fade-in">
                      {activeTab === 'color' && (
                        <>
                          <button className="text-toolbar-btn" onClick={() => startEditing('color', 'presets')}><Bookmark size={18} /><span>Presets</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('color', 'dots')}><QRDotsIcon /><span>Dots</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('color', 'eyes')}><QREyesIcon /><span>Eyes</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('color', 'bg')}><ImageIcon size={18} /><span>BG</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('color', 'texture')}><Layers size={18} /><span>Texture</span></button>
                        </>
                      )}
                      {activeTab === 'shapes' && (
                        <>
                          <button className="text-toolbar-btn" onClick={() => startEditing('shapes', 'dots')}><QRDotsIcon /><span>Dots</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('shapes', 'eyes')}><QREyesIcon /><span>Eyes</span></button>
                        </>
                      )}
                      {activeTab === 'logo' && (
                        <>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'size')}><ChevronUp size={18} /><span>Size</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'pos')}><Maximize size={18} /><span>Position</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'stroke')}><Paintbrush size={18} /><span>Stroke</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'bg')}><Hexagon size={18} /><span>Background</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'rotate')}><RotateCw size={18} /><span>Rotate</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'opacity')}><Sun size={18} /><span>Opacity</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'shadow')}><Moon size={18} /><span>Shadow</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'filter')}><Eraser size={18} /><span>Remove BG</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'texture')}><Layers size={18} /><span>Texture</span></button>
                          <button className="text-toolbar-btn" onClick={() => startEditing('logo', 'crop')}><Crop size={18} /><span>Crop</span></button>
                        </>
                      )}
                      {activeTab === 'text' && (
                        <>
                          <button className="text-toolbar-btn" onClick={() => startEditing('text', 'input')}><Type size={18} /><span>Add Text</span></button>
                          {(() => {
                            const isTextEnabled = textCenterEnabled || frameStyle !== 'none';
                            const handleTextToolClick = (tool) => {
                              if (!isTextEnabled) {
                                showToast('Please enable Center Text or Frame Text first', 'info');
                                return;
                              }
                              startEditing('text', tool);
                            };
                            return (
                              <>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('pos')}><Maximize size={18} /><span>Position</span></button>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('fonts')}><ALargeSmall size={18} /><span>Fonts</span></button>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('size')}><ChevronUp size={18} /><span>Size</span></button>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('color')}><Palette size={18} /><span>Color</span></button>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('stroke')}><Paintbrush size={18} /><span>Stroke</span></button>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('shadow')}><Moon size={18} /><span>Shadow</span></button>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('rotate')}><RotateCw size={18} /><span>Rotate</span></button>
                                <button className="text-toolbar-btn" style={!isTextEnabled ? { opacity: 0.4 } : {}} onClick={() => handleTextToolClick('bg')}><Hexagon size={18} /><span>Shape</span></button>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

          </>
        ) : activePage === 'scanner' ? (
          <QRScanner
            onBack={() => {
              if (launchedDirectlyToScanner) {
                CapApp.exitApp();
              } else {
                setActivePage('home');
              }
            }}
            navigateTo={navigateTo}
            onLoadQR={handleLoadQR}
          />
        ) : activePage === 'home' ? (
          <HomePage 
            onNavigate={(page) => {
              if (page === 'generator') resetGenerator();
              navigateTo(page);
            }}
            onQuickCreate={(type) => {
              resetGenerator();
              navigate('/generator', {
                state: {
                  qrType: type,
                  qrData: {},
                  isDataModalOpen: true,
                  activePage: 'generator'
                }
              });
              setActivePage('generator');
            }}
            onQuickCreateBarcode={(id) => {
              const defaults = {
                ean13: '4006381333931',
                upca: '012345678905',
                code128: 'MushiPro-128',
                code39: 'MUSHI 39',
                datamatrix: 'DataMatrix-Standard',
                itf14: '10012345678902',
                ean8: '40123455',
                gs1databar: '01234567890128',
                pdf417: 'PDF417-ID-FORMAT',
                code93: 'COMPACT-93',
                upce: '01234565',
                codabar: 'A123456B',
                code11: '123-456-789',
                msi: '1234567',
                i25: '12345678',
                postnet: '12345',
                planet: '12345678901',
                royalmail: 'SN34RD1A',
                gs1128: '(01)00012345678905(10)ABC-123',
                telepen: 'TELEPEN-ASCII',
                pharmacode: '11309',
                aztec: 'AZTEC-TICKET-DATA',
                maxicode: 'UPS-MAXICODE-DATA',
                qrcode: 'QR-INTEGRATION',
                microqrcode: 'MICRO-QR',
                hanxin: 'HANXIN-2D-CODE',
                codablockf: 'CODABLOCK-F-DATA',
                code16k: 'CODE-16K-DATA',
                code49: 'CODE-49-DATA',
                channelcode: '123456'
              };
              const defaultValue = defaults[id] || '12345678';
              const item = {
                qrType: 'BARCODE',
                displayText: defaultValue,
                style: {
                  bcid: id,
                  barColor: '#000000',
                  bgColor: '#ffffff',
                  barWidth: 2,
                  height: 90,
                  margin: 16,
                  displayValue: true
                }
              };
              navigate('/barcode', {
                state: {
                  loadedBarcodeItem: item,
                  activePage: 'barcode'
                }
              });
              setActivePage('barcode');
            }}
            onLoadQR={handleLoadQR}
            theme={theme}
            setTheme={(next) => {
              setTheme(next);
              savePreferences({ ...getPreferences(), theme: next });
            }}
            activePage={activePage}
            onMenuClick={() => navigateTo('settings')}
          />
        ) : activePage === 'saved' ? (
          <SavedPage onLoadQR={handleLoadQR} onNavigate={navigateTo} />
        ) : activePage === 'batch' ? (
          <BatchPage
            onNavigate={navigateTo}
            activeGeneratorStyle={getActiveStyle()}
            setBatchItems={setBatchItems}
            batchItems={batchItems}
            onEditBatchItemStyle={handleEditBatchItemStyle}
            initialBatchType={batchPageDefaultType}
          />
        ) : activePage === 'barcode' ? (
          <BarcodePage 
            onNavigate={navigateTo} 
            showToast={showToast} 
            loadedBarcodeItem={loadedBarcodeItem}
            setLoadedBarcodeItem={setLoadedBarcodeItem}
            theme={theme}
            setTheme={setTheme}
            effectiveTheme={effectiveTheme}
          />
        ) : activePage === 'scanner-gun' ? (
          <ScannerGunPage onNavigate={navigateTo} />
        ) : activePage === 'settings' ? (
          <SettingsPage theme={theme} setTheme={setTheme} effectiveTheme={effectiveTheme} />
        ) : (
          <HistoryPage onLoadQR={handleLoadQR} onNavigate={navigateTo} initialFilter={historyFilter} />
        )}
      </main>

      {/* ── Bottom Navigation Bar (Only for Generator) ── */}
      {activePage === 'generator' && (
        <nav className="bottom-nav">
          {TABS.filter(tab => activeBatchItemIndex === null || tab.id !== 'content').map(tab => (
            <button
              key={tab.id}
              className={`bottom-nav-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <div className="bottom-nav-highlight" />
              <span className="bottom-nav-icon">
                <tab.icon size={24} strokeWidth={2} />
              </span>
              <span className="bottom-nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* ── Main App Navigation ── */}
      {(['home', 'saved', 'history', 'settings'].includes(activePage)) && (
        <nav className="bottom-nav">
          <button 
            className={`bottom-nav-tab${activePage === 'home' ? ' active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            <span className="bottom-nav-icon"><Home size={24} /></span>
            <span className="bottom-nav-label">Home</span>
          </button>
          
          <button 
            className={`bottom-nav-tab${activePage === 'saved' ? ' active' : ''}`}
            onClick={() => navigateTo('saved')}
          >
            <span className="bottom-nav-icon"><Bookmark size={24} /></span>
            <span className="bottom-nav-label">Saved</span>
          </button>
          
          {/* Integrated Scan Button */}
          <div 
            onClick={() => navigateTo('scanner')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: '-30px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            <button 
              className="floating-scan-btn glow-scan-btn"
              style={{ 
                width: '64px',
                height: '64px',
                borderRadius: '32px',
                background: 'var(--accent-primary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(214, 0, 54, 0.4)',
                color: 'white',
                zIndex: 101,
                transition: 'transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ScanLine size={28} />
            </button>
          </div>

          <button 
            className={`bottom-nav-tab${activePage === 'history' ? ' active' : ''}`}
            onClick={() => navigateTo('history')}
          >
            <span className="bottom-nav-icon"><History size={24} /></span>
            <span className="bottom-nav-label">History</span>
          </button>
          
          <button 
            className={`bottom-nav-tab${activePage === 'settings' ? ' active' : ''}`}
            onClick={() => navigateTo('settings')}
          >
            <span className="bottom-nav-icon"><Settings size={24} /></span>
            <span className="bottom-nav-label">Settings</span>
          </button>
        </nav>
      )}

      {/* ── QR Data Modal ── */}
      {isDataModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDataModalOpen(false)}>
          <div className="modal-container glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <h3>{qrType.split('_').join(' ')}</h3>
                <p>Enter the details below</p>
              </div>
              <button className="modal-close" onClick={() => setIsDataModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <QRDataInput type={qrType} data={qrData} onChange={(newData) => { generatorIsDirtyRef.current = true; setQrData(newData); }} />
            </div>
            <button className="modal-done-btn" onClick={() => setIsDataModalOpen(false)}>
              Update QR Code
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 color="#10B981" size={12} strokeWidth={3} />
          ) : (
            <XCircle color="#EF4444" size={12} strokeWidth={3} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
      {/* Advanced Color Picker Modal */}
      <AdvancedColorPicker
        isOpen={advPicker.open}
        initialColor={advPicker.color}
        onChange={(newColor) => {
          if (advPicker.setter) advPicker.setter(newColor);
        }}
        onConfirm={(newColor) => {
          if (advPicker.setter) advPicker.setter(newColor);
          setAdvPicker({ ...advPicker, open: false });
        }}
        onCancel={() => {
          // Restore original color if canceled
          if (advPicker.setter) advPicker.setter(advPicker.color);
          setAdvPicker({ ...advPicker, open: false });
        }}
        onEnterPipetteMode={() => {
          setPipetteTarget({ setter: advPicker.setter });
          setAdvPicker(prev => ({ ...prev, open: false }));
          setIsPipetteActive(true);
        }}
      />

      {isPipetteActive && (
        <div 
          className="pipette-overlay fade-in"
          onPointerDown={handlePipettePointerDown}
          onPointerMove={handlePipettePointerMove}
          onPointerUp={handlePipettePointerUp}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            pointerEvents: 'all',
            touchAction: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: '40px',
            background: 'rgba(0,0,0,0.08)',
            cursor: 'crosshair'
          }}
        >
          <div 
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            style={{ 
              background: 'var(--bg-primary)', 
              padding: '6px 12px', 
              borderRadius: '30px', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--accent-primary)',
              pointerEvents: 'all',
              cursor: 'default'
            }}
          >
            <Pipette size={14} className="text-accent" />
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', userSelect: 'none' }}>Pick Color</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--border-color)', margin: '0 2px' }} />
            <button 
              onClick={() => { setIsPipetteActive(false); setHoverColor(null); setAdvPicker(prev => ({ ...prev, open: true })); }}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {isPipetteActive && (
        <div 
          style={{
            position: 'fixed',
            left: `${hoverPos.x}px`,
            top: `${hoverPos.y - 70}px`,
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '110px',
            pointerEvents: 'none',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            visibility: hoverColor ? 'visible' : 'hidden',
            opacity: hoverColor ? 1 : 0,
            transition: 'opacity 0.15s ease, visibility 0.15s ease'
          }}
        >
          {/* Circular bubble */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '4px solid white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: hoverColor || 'transparent'
          }}>
            <canvas 
              ref={loupeCanvasRef} 
              width={80} 
              height={80} 
              style={{ 
                width: '80px', 
                height: '80px',
                display: 'block'
              }} 
            />
            {/* Inner ring for visual contrast */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.2)',
              pointerEvents: 'none'
            }} />
          </div>

          {/* Color Code Label under the bubble */}
          <div style={{
            marginTop: '8px',
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap'
          }}>
            {hoverColor ? hoverColor.toUpperCase() : ''}
          </div>
        </div>
      )}

      {/* ── Unsaved Changes Modal ── */}
      {unsavedChangesModal.isOpen && (
        <div className="modal-overlay" onClick={handleCancelExit}>
          <div className="modal-container glass-panel" style={{ maxWidth: '360px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(214, 0, 54, 0.1)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Unsaved Changes</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                You have modified this QR code. Do you want to update your changes before leaving?
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={handleSaveAndExit}
                style={{
                  background: 'var(--accent-gradient)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(214, 0, 54, 0.2)'
                }}
              >
                Update Changes
              </button>
              
              <button 
                onClick={handleDiscardAndExit}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: '#D60036',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(214, 0, 54, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                Discard Changes
              </button>
              
              <button 
                onClick={handleCancelExit}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
