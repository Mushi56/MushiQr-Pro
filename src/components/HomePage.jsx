import React, { useState, useEffect, useRef } from 'react';
import { Menu, Crown, Plus, Link2, Type, Wifi, User, Mail, MapPin, History, Moon, Sun, Info, Shield, FileText, Home, Bookmark, Settings, QrCode, ChevronLeft, ChevronRight, ScanLine, Phone, MessageSquare, FileCode, Image, Trash2, Star, FileSpreadsheet, Barcode, Link, Contact, File, Music, Coins, MessageCircle, Play, Calendar, Layers, Zap, Target } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaXTwitter, FaLinkedinIn } from 'react-icons/fa6';
import { QR_TYPES, renderQR, generateQRMatrix } from '../utils/qrEngine';
import { renderBarcode } from '../utils/barcodeEngine';
import { getHistory, deleteFromHistory, clearHistory, getSaved, saveToSaved } from '../utils/storage';
import AppIcon from './AppIcon';
import GoldenAdminBadge from './GoldenAdminBadge';

function HeroQRCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Generate a clean "Hello User" matrix
    const demoMatrixInfo = generateQRMatrix("Hello User", 'H');
    if (!demoMatrixInfo) return;

    const options = {
      ...demoMatrixInfo,
      bgColor: 'transparent',
      bgTransparent: true,
      qrColor: '#FFFFFF',          // Consistent white color
      eyeColor: '#FFFFFF',
      eyeOuterColor: '#FFFFFF',
      logo: null,
      textCenterEnabled: false,
      textCenter: null,
      frameStyle: 'none',
      quietZone: 0,                // No quiet zone for maximum size
      size: 360,                   // High-res render size
      dotStyle: 'rounded',         // Rounded dot style
      eyeStyle: 'rounded'          // Rounded eye style
    };

    renderQR(canvasRef.current, options);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="360"
      height="360"
      style={{
        width: '80px',
        height: '80px',
        display: 'block'
      }}
    />
  );
}

function HeroQRCanvasBatch() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Generate a clean batch matrix
    const demoMatrixInfo = generateQRMatrix("Batch QR", 'H');
    if (!demoMatrixInfo) return;

    const options = {
      ...demoMatrixInfo,
      bgColor: 'transparent',
      bgTransparent: true,
      qrColor: '#FFFFFF',
      eyeColor: '#FFFFFF',
      eyeOuterColor: '#FFFFFF',
      logo: null,
      textCenterEnabled: false,
      textCenter: null,
      frameStyle: 'none',
      quietZone: 0,
      size: 360,
      dotStyle: 'dots',         // Different dot style for visual distinction
      eyeStyle: 'circle'        // Different eye style for visual distinction
    };

    renderQR(canvasRef.current, options);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="360"
      height="360"
      style={{
        width: '80px',
        height: '80px',
        display: 'block'
      }}
    />
  );
}

function HeroBarcodeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderBarcode(canvasRef.current, "BARCODE-PRO", {
      barColor: '#FFFFFF',
      bgColor: 'transparent',
      barWidth: 2,
      height: 60,
      margin: 10,
      displayValue: false
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '80px',
        height: '60px',
        display: 'block'
      }}
    />
  );
}

const getBarcodeIcon = (id) => {
  switch (id) {
    // 1D Retail Barcodes (EAN-13, EAN-8, UPC-A, UPC-E)
    case 'ean13':
    case 'ean8':
    case 'upca':
    case 'upce':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="5" x2="3" y2="19" />
          <line x1="6" y1="5" x2="6" y2="19" strokeWidth="2.5" />
          <line x1="10" y1="5" x2="10" y2="19" />
          <line x1="13" y1="5" x2="13" y2="19" strokeWidth="3" />
          <line x1="17" y1="5" x2="17" y2="19" />
          <line x1="21" y1="5" x2="21" y2="19" strokeWidth="1.5" />
          <rect x="2" y="15" width="8" height="6" rx="1" fill="currentColor" stroke="none" opacity="0.15" />
          <path d="M4 18h4" strokeWidth="1" />
        </svg>
      );

    // 1D General / Industrial Barcodes (Code 128, Code 39, Code 93, Code 11, Codabar, GS1-128)
    case 'code128':
    case 'code39':
    case 'code93':
    case 'code11':
    case 'codabar':
    case 'gs1128':
    case 'i25':
    case 'telepen':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3" />
          <line x1="5" y1="7" x2="5" y2="17" strokeWidth="2" />
          <line x1="9" y1="7" x2="9" y2="17" strokeWidth="1" />
          <line x1="12" y1="7" x2="12" y2="17" strokeWidth="3" />
          <line x1="15" y1="7" x2="15" y2="17" strokeWidth="1" />
          <line x1="19" y1="7" x2="19" y2="17" strokeWidth="2" />
        </svg>
      );

    // 2D Square Matrix Barcodes (Data Matrix)
    case 'datamatrix':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 3v18h18" strokeWidth="2.5" />
          <line x1="7" y1="3" x2="7" y2="5" strokeWidth="1.5" />
          <line x1="11" y1="3" x2="11" y2="5" strokeWidth="1.5" />
          <line x1="15" y1="3" x2="15" y2="5" strokeWidth="1.5" />
          <line x1="19" y1="3" x2="19" y2="5" strokeWidth="1.5" />
          <line x1="21" y1="7" x2="19" y2="7" strokeWidth="1.5" />
          <line x1="21" y1="11" x2="19" y2="11" strokeWidth="1.5" />
          <line x1="21" y1="15" x2="19" y2="15" strokeWidth="1.5" />
          <rect x="7" y="7" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="13" y="7" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="7" y="13" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="13" y="13" width="2" height="2" fill="currentColor" stroke="none" />
        </svg>
      );

    // ITF-14 (Heavy border box standard)
    case 'itf14':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <rect x="2" y="5" width="20" height="14" strokeWidth="2.5" />
          <line x1="6" y1="8" x2="6" y2="16" strokeWidth="1.5" />
          <line x1="9" y1="8" x2="9" y2="16" strokeWidth="2.5" />
          <line x1="12" y1="8" x2="12" y2="16" strokeWidth="1.5" />
          <line x1="15" y1="8" x2="15" y2="16" strokeWidth="3" />
          <line x1="18" y1="8" x2="18" y2="16" strokeWidth="1.5" />
        </svg>
      );

    // GS1 DataBar (Multiple grouped elements, omnidirectional)
    case 'gs1databar':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="4" x2="3" y2="14" strokeWidth="2.5" />
          <line x1="6" y1="4" x2="6" y2="14" />
          <line x1="10" y1="4" x2="10" y2="14" strokeWidth="2.5" />
          <line x1="14" y1="4" x2="14" y2="14" />
          <line x1="17" y1="4" x2="17" y2="14" strokeWidth="2" />
          <line x1="21" y1="4" x2="21" y2="14" />
          <path d="M3 17h18" strokeWidth="2" />
          <line x1="6" y1="20" x2="18" y2="20" />
        </svg>
      );

    // PDF 417 / Stacked Linear Codes (Codablock F, Code 16K, Code 49)
    case 'pdf417':
    case 'codablockf':
    case 'code16k':
    case 'code49':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="5" rx="1" />
          <rect x="2" y="10" width="20" height="5" rx="1" />
          <rect x="2" y="16" width="20" height="5" rx="1" />

          <line x1="5" y1="6" x2="5" y2="8" strokeWidth="1.5" />
          <line x1="12" y1="6" x2="12" y2="8" strokeWidth="2" />
          <line x1="18" y1="6" x2="18" y2="8" />

          <line x1="7" y1="12" x2="7" y2="14" strokeWidth="2" />
          <line x1="14" y1="12" x2="14" y2="14" />

          <line x1="9" y1="18" x2="9" y2="20" />
          <line x1="16" y1="18" x2="16" y2="20" strokeWidth="2" />
        </svg>
      );

    // Postal Barcodes (Postnet, Planet, Royal Mail)
    case 'postnet':
    case 'planet':
    case 'royalmail':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="5" x2="3" y2="19" strokeWidth="2" />
          <line x1="6" y1="12" x2="6" y2="19" strokeWidth="2" />
          <line x1="9" y1="5" x2="9" y2="19" strokeWidth="2" />
          <line x1="12" y1="12" x2="12" y2="19" strokeWidth="2" />
          <line x1="15" y1="5" x2="15" y2="19" strokeWidth="2" />
          <line x1="18" y1="12" x2="18" y2="19" strokeWidth="2" />
          <line x1="21" y1="5" x2="21" y2="19" strokeWidth="2" />
        </svg>
      );

    // MSI Plessey / Pharmacode (Varying thick bars with color logic)
    case 'msi':
    case 'pharmacode':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="5" x2="3" y2="19" strokeWidth="3" />
          <line x1="8" y1="5" x2="8" y2="19" strokeWidth="1.5" />
          <line x1="13" y1="5" x2="13" y2="19" strokeWidth="4" />
          <line x1="18" y1="5" x2="18" y2="19" strokeWidth="2.5" />
        </svg>
      );

    // Aztec Code (2D Concentric Square Finder)
    case 'aztec':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <rect x="9" y="9" width="6" height="6" strokeWidth="2" />
          <rect x="11" y="11" width="2" height="2" fill="currentColor" stroke="none" />
          <line x1="6" y1="6" x2="6" y2="8" />
          <line x1="18" y1="16" x2="18" y2="18" />
          <line x1="6" y1="16" x2="8" y2="16" />
          <line x1="16" y1="6" x2="16" y2="8" />
        </svg>
      );

    // MaxiCode (2D Honeycomb with circular bullseye)
    case 'maxicode':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" strokeDasharray="3 3" opacity="0.4" />
          <circle cx="12" cy="12" r="3" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="6" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      );

    // 2D QR Code / Micro QR / Han Xin
    case 'qrcode':
    case 'microqrcode':
    case 'hanxin':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="6" height="6" rx="1" strokeWidth="2" />
          <rect x="3" y="15" width="6" height="6" rx="1" strokeWidth="2" />
          <rect x="15" y="3" width="6" height="6" rx="1" strokeWidth="2" />

          <rect x="5" y="5" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="5" y="17" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="17" y="5" width="2" height="2" fill="currentColor" stroke="none" />

          <rect x="14" y="14" width="3" height="3" rx="0.5" />
          <line x1="11" y1="3" x2="11" y2="21" strokeDasharray="2 2" opacity="0.5" />
          <line x1="3" y1="11" x2="21" y2="11" strokeDasharray="2 2" opacity="0.5" />
        </svg>
      );

    // Channel Code (Industrial sequential bars)
    case 'channelcode':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="5" x2="4" y2="19" strokeWidth="1.5" />
          <line x1="8" y1="5" x2="8" y2="19" strokeWidth="1.5" />
          <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5" />
          <line x1="16" y1="5" x2="16" y2="19" strokeWidth="1.5" />
          <line x1="20" y1="5" x2="20" y2="19" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="5" x2="3" y2="19" />
          <line x1="8" y1="5" x2="8" y2="19" strokeWidth="2.5" />
          <line x1="13" y1="5" x2="13" y2="19" strokeWidth="1" />
          <line x1="17" y1="5" x2="17" y2="19" strokeWidth="3" />
          <line x1="21" y1="5" x2="21" y2="19" />
        </svg>
      );
  }
};

export default function HomePage({ currentUser, onScrollChange, onNavigate, onQuickCreate, onQuickCreateBarcode, onLoadQR, theme, setTheme, effectiveTheme, activePage, onMenuClick }) {
  const [recentItems, setRecentItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAllBarcodes, setShowAllBarcodes] = useState(false);
  const [showAllQR, setShowAllQR] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const slideCount = 3;

  const handleScroll = (e) => {
    const scrolled = e.currentTarget.scrollTop > 20;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
      if (onScrollChange) onScrollChange(scrolled);
    }
  };

  useEffect(() => {
    if (activePage === 'home' && onScrollChange) {
      onScrollChange(false);
    }
  }, [activePage]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      setActiveSlide(prev => (prev + 1) % slideCount);
    } else if (diff < -50) {
      setActiveSlide(prev => (prev - 1 + slideCount) % slideCount);
    }
  };

  useEffect(() => {
    if (activePage !== 'home' || isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slideCount);
    }, 5500);
    return () => clearInterval(interval);
  }, [activePage, isPaused, activeSlide]);

  useEffect(() => {
    if (activePage === 'home') {
      const history = getHistory().filter(item => item.source !== 'scan');
      setRecentItems(history.slice(0, 10));
      setSavedIds(new Set(getSaved().map(s => s.id)));
    }
  }, [activePage]);

  const handleSave = (item) => {
    saveToSaved(item);
    setSavedIds(new Set([...savedIds, item.id]));
  };

  const quickOptions = [
    { id: QR_TYPES.URL, label: 'Website', icon: <Link size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.TEXT, label: 'Text', icon: <Type size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.WIFI, label: 'WiFi', icon: <Wifi size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.VCARD, label: 'vCard', icon: <Contact size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.EMAIL, label: 'Email', icon: <Mail size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.PHONE, label: 'Phone', icon: <Phone size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.SMS, label: 'SMS', icon: <MessageSquare size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.LOCATION, label: 'Location', icon: <MapPin size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.PDF, label: 'PDF', icon: <FileCode size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.IMAGE, label: 'Image', icon: <Image size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.INSTAGRAM, label: 'Instagram', icon: <FaInstagram size={20} /> },
    { id: QR_TYPES.FACEBOOK, label: 'Facebook', icon: <FaFacebookF size={20} /> },
    { id: QR_TYPES.X, label: 'X (Twitter)', icon: <FaXTwitter size={20} /> },
    { id: QR_TYPES.LINKEDIN, label: 'LinkedIn', icon: <FaLinkedinIn size={20} /> },
    { id: QR_TYPES.WHATSAPP, label: 'WhatsApp', icon: <MessageCircle size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.YOUTUBE, label: 'YouTube', icon: <Play size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.EVENT, label: 'Event', icon: <Calendar size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.CRYPTO, label: 'Crypto', icon: <Coins size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.AUDIO, label: 'Audio', icon: <Music size={20} strokeWidth={1.8} /> },
    { id: QR_TYPES.DOCUMENT, label: 'Document', icon: <File size={20} strokeWidth={1.8} /> },
  ];

  const barcodeOptions = [
    { id: 'ean13', label: 'EAN-13' },
    { id: 'upca', label: 'UPC-A' },
    { id: 'code128', label: 'Code 128' },
    { id: 'code39', label: 'Code 39' },
    { id: 'datamatrix', label: 'Data Matrix' },
    { id: 'itf14', label: 'ITF-14' },
    { id: 'ean8', label: 'EAN-8' },
    { id: 'gs1databar', label: 'GS1 DataBar' },
    { id: 'pdf417', label: 'PDF 417' },
    { id: 'code93', label: 'Code 93' },
    { id: 'upce', label: 'UPC-E' },
    { id: 'codabar', label: 'Codabar' },
    { id: 'code11', label: 'Code 11' },
    { id: 'msi', label: 'MSI Plessey' },
    { id: 'i25', label: 'Interleaved 2 of 5' },
    { id: 'postnet', label: 'Postnet' },
    { id: 'planet', label: 'Planet' },
    { id: 'royalmail', label: 'Royal Mail' },
    { id: 'gs1128', label: 'GS1-128' },
    { id: 'telepen', label: 'Telepen' },
    { id: 'pharmacode', label: 'Pharmacode' },
    { id: 'aztec', label: 'Aztec Code' },
    { id: 'maxicode', label: 'MaxiCode' },
    { id: 'qrcode', label: 'QR Code (2D)' },
    { id: 'microqrcode', label: 'Micro QR' },
    { id: 'hanxin', label: 'Han Xin Code' },
    { id: 'codablockf', label: 'Codablock F' },
    { id: 'code16k', label: 'Code 16K' },
    { id: 'code49', label: 'Code 49' },
    { id: 'channelcode', label: 'Channel Code' }
  ];

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getQRTitle = (item) => {
    const type = item.qrType || item.type || '';
    if (type === QR_TYPES.URL) return 'Website Link';
    if (type === QR_TYPES.WIFI) return 'WiFi Network';
    if (type === QR_TYPES.VCARD) return 'Contact Card';
    if (type === QR_TYPES.EMAIL) return 'Email';
    if (type === QR_TYPES.PHONE) return 'Phone Call';
    if (type === QR_TYPES.SMS) return 'SMS Message';
    if (type === QR_TYPES.LOCATION) return 'Location';
    if (type === QR_TYPES.TEXT) return 'Plain Text';
    if (type === QR_TYPES.PDF) return 'PDF File';
    if (type === QR_TYPES.IMAGE) return 'Image';
    return type ? type.split('_').join(' ') : 'QR Code';
  };

  const getQRSubtitle = (item) => {
    const data = item.qrData || item.data || {};
    return data.url || data.ssid || data.text || data.email || data.phone || item.displayText || 'QR Code Data';
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }} className="fade-in-up" onScroll={handleScroll}>
        {/* Static Hero Section with Red Rounded Rectangle Container */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(135deg, #7A0C1E 0%, #2D0207 100%)',
          borderRadius: '0 0 28px 28px',
          padding: '14px var(--main-padding-x) 48px var(--main-padding-x)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          color: '#FFFFFF',
          boxShadow: '0 12px 30px rgba(122, 12, 30, 0.35)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background ambient blur circle */}
          <div style={{
            position: 'absolute', top: '-40%', right: '-15%',
            width: '220px', height: '220px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(30px)', pointerEvents: 'none', zIndex: 1
          }} />

          {/* Welcome Message / Admin Dashboard Header Block */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2,
            paddingTop: '2px',
            paddingBottom: '2px'
          }}>
            <div>
              {currentUser ? (
                <>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.78)',
                    marginBottom: '4px'
                  }}>
                    WELCOME BACK
                  </div>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    lineHeight: 1.2
                  }}>
                    <span>{currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}</span>
                    {currentUser.email === 'mabuneri143@gmail.com' && (
                      <GoldenAdminBadge size={20} />
                    )}
                  </div>
                </>
              ) : (
                <div style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  padding: '2px 0'
                }}>
                  Welcome to Mushi QR Pro
                </div>
              )}
            </div>
          </div>

          {/* Top Row: Create QR Code & Create Barcode 50-50 side-by-side in 1 line */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', position: 'relative', zIndex: 2 }}>            <div 
              onClick={() => onNavigate('generator')}
              role="button"
              tabIndex={0}
              style={{
                borderRadius: '18px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                padding: '12px',
                boxSizing: 'border-box',
                minHeight: '135px',
                background: 'linear-gradient(160deg, #3D0610 0%, #170206 100%)',
                border: 'none',
                boxShadow: '0 14px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Card Image */}
              <img 
                src="/Qr Code.png" 
                alt="QR Code" 
                style={{
                  position: 'absolute',
                  right: '-12px',
                  bottom: '14px',
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  zIndex: 1,
                  pointerEvents: 'none',
                  opacity: 0.95
                }} 
              />
              {/* Ambient glow only */}
              <div style={{
                position: 'absolute', top: '-40%', right: '-15%',
                width: '130px', height: '130px',
                background: 'radial-gradient(circle, rgba(255, 42, 85, 0.25) 0%, transparent 70%)',
                filter: 'blur(28px)', pointerEvents: 'none', zIndex: 1
              }} />

              {/* Top Title & Description */}
              <div style={{ display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #FF2A55 0%, #B3002D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(255, 42, 85, 0.35)',
                    flexShrink: 0
                  }}>
                    <QrCode size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: 1.1
                    }}>
                      Custom QR
                    </h2>
                    <div style={{
                      fontSize: '8.5px',
                      fontWeight: 600,
                      color: '#FF4D79',
                      marginTop: '2px',
                      lineHeight: 1
                    }}>
                      Design Without Limits
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '7.5px', margin: '0 0 8px 0', color: 'rgba(255,255,255,0.75)', fontWeight: 500, lineHeight: 1.3, maxWidth: '80px' }}>
                  Design custom QR codes with custom logos, vibrant colors, unique frames &amp; artistic textures.
                </p>
              </div>

              {/* Bottom Action Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: 'calc(100% + 24px)',
                boxSizing: 'border-box',
                margin: 'auto -12px -12px -12px',
                zIndex: 2,
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Image size={10} color="#FF4D79" />
                  <span style={{ fontSize: '8px', fontWeight: 700, color: '#FFFFFF' }}>Make it Yours</span>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF2A55 0%, #B3002D 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(255, 42, 85, 0.4)'
                }}>
                  <ChevronRight size={12} color="#FFFFFF" />
                </div>
              </div>
            </div>

            {/* Card 2: Create Barcode */}
            <div 
              onClick={() => onNavigate('barcode')}
              role="button"
              tabIndex={0}
              style={{
                borderRadius: '18px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                padding: '12px',
                boxSizing: 'border-box',
                minHeight: '135px',
                background: 'linear-gradient(160deg, #3D1805 0%, #140702 100%)',
                border: 'none',
                boxShadow: '0 14px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Card Image */}
              <img 
                src="/Barcode.png" 
                alt="Barcode" 
                style={{
                  position: 'absolute',
                  right: '-12px',
                  bottom: '14px',
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  zIndex: 1,
                  pointerEvents: 'none',
                  opacity: 0.95
                }} 
              />
              {/* Ambient glow only */}
              <div style={{
                position: 'absolute', top: '-40%', right: '-15%',
                width: '130px', height: '130px',
                background: 'radial-gradient(circle, rgba(245, 110, 19, 0.25) 0%, transparent 70%)',
                filter: 'blur(28px)', pointerEvents: 'none', zIndex: 1
              }} />

              {/* Top Title & Description */}
              <div style={{ display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #F56E13 0%, #9E3B00 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(245, 110, 19, 0.35)',
                    flexShrink: 0
                  }}>
                    <Barcode size={16} color="#FFFFFF" />
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: 1.1
                    }}>
                      Barcodes
                    </h2>
                    <div style={{
                      fontSize: '8.5px',
                      fontWeight: 600,
                      color: '#FF944D',
                      marginTop: '2px',
                      lineHeight: 1
                    }}>
                      Professional &amp; Reliable
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '7.5px', margin: '0 0 8px 0', color: 'rgba(255,255,255,0.75)', fontWeight: 500, lineHeight: 1.3, maxWidth: '80px' }}>
                  Generate professional 1D &amp; 2D barcodes supporting 30+ industrial standards &amp; formats.
                </p>
              </div>

              {/* Bottom Action Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: 'calc(100% + 24px)',
                boxSizing: 'border-box',
                margin: 'auto -12px -12px -12px',
                zIndex: 2,
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Barcode size={10} color="#FF944D" />
                  <span style={{ fontSize: '8px', fontWeight: 700, color: '#FFFFFF' }}>30+ Formats</span>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F56E13 0%, #9E3B00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(245, 110, 19, 0.4)'
                }}>
                  <ChevronRight size={12} color="#FFFFFF" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Full-Width Card: Batch Creator */}
        <div style={{ padding: '0 var(--main-padding-x)', marginTop: '-36px', position: 'relative', zIndex: 10, marginBottom: '10px' }}>
          <div
            onClick={() => onNavigate('batch', 'QR')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('batch', 'QR')}
            style={{
              borderRadius: '18px',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              padding: '12px',
              boxSizing: 'border-box',
              background: 'linear-gradient(160deg, #3D0610 0%, #170206 100%)',
              border: 'none',
              boxShadow: '0 14px 35px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Card Image */}
            <img 
              src="/Bulk Ganaration.png" 
              alt="Bulk Generation" 
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                zIndex: 1,
                pointerEvents: 'none',
                opacity: 0.95
              }} 
            />
            {/* Background ambient glow */}
            <div style={{
              position: 'absolute', top: '-50%', right: '20%',
              width: '180px', height: '180px',
              background: 'radial-gradient(circle, rgba(255, 42, 85, 0.25) 0%, transparent 70%)',
              filter: 'blur(24px)', pointerEvents: 'none', zIndex: 1
            }} />

            {/* Top Title & Description */}
            <div style={{ display: 'flex', flexDirection: 'column', zIndex: 2, flex: 1, minWidth: 0, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF2A55 0%, #B3002D 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(255, 42, 85, 0.35)',
                  flexShrink: 0
                }}>
                  <Layers size={16} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: 1.1
                  }}>
                    Bulk Batch Generator
                  </h3>
                  <div style={{
                    fontSize: '8.5px',
                    fontWeight: 600,
                    color: '#FF4D79',
                    marginTop: '2px',
                    lineHeight: 1
                  }}>
                    Powerful • Fast • Efficient
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '7.5px', margin: '6px 140px 8px 0', color: 'rgba(255,255,255,0.75)', fontWeight: 500, lineHeight: 1.3 }}>
                Create 10K+ QR codes &amp; barcodes from CSV / Excel files.
              </p>

              {/* Bottom Action Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                maxWidth: '190px',
                boxSizing: 'border-box',
                zIndex: 2,
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={10} color="#FF4D79" />
                  <span style={{ fontSize: '8px', fontWeight: 700, color: '#FFFFFF' }}>10K+ Codes</span>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF2A55 0%, #B3002D 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(255, 42, 85, 0.4)'
                }}>
                  <ChevronRight size={12} color="#FFFFFF" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create QR Grid */}
        <div style={{ padding: '16px var(--main-padding-x) 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Create QR Code</h3>
            <button
              onClick={() => setShowAllQR(!showAllQR)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--accent-primary)', 
                fontSize: '13px', 
                fontWeight: 600, 
                cursor: 'pointer', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {showAllQR ? 'See Less' : 'Explore'} <ChevronRight size={14} />
            </button>
          </div>
          <div className="quick-options-grid">
            {(showAllQR ? quickOptions : quickOptions.slice(0, 5)).map(option => (
              <button
                key={option.id}
                onClick={() => onQuickCreate(option.id)}
                className="quick-option-card"
                style={{ width: '100%' }}
              >
                <div className="quick-option-icon-wrapper" style={{ background: 'rgba(214, 0, 54, 0.08)', color: '#D60036' }}>
                  {React.cloneElement(option.icon, { size: 20 })}
                </div>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2px',
                  marginTop: '2px',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Create Barcode Grid */}
        <div style={{ padding: '12px var(--main-padding-x) 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Create Barcode</h3>
            <button
              onClick={() => setShowAllBarcodes(!showAllBarcodes)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--accent-primary)', 
                fontSize: '13px', 
                fontWeight: 600, 
                cursor: 'pointer', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {showAllBarcodes ? 'See Less' : 'Explore'} <ChevronRight size={14} />
            </button>
          </div>
          <div className="quick-options-grid">
            {(showAllBarcodes ? barcodeOptions : barcodeOptions.slice(0, 5)).map(option => (
              <button
                key={option.id}
                onClick={() => onQuickCreateBarcode(option.id)}
                className="quick-option-card"
                style={{ width: '100%' }}
              >
                <div className="quick-option-icon-wrapper" style={{ background: 'rgba(214, 0, 54, 0.08)', color: '#D60036' }}>
                  {getBarcodeIcon(option.id)}
                </div>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2px',
                  marginTop: '2px',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 var(--main-padding-x) 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Recent Projects</h3>
            {recentItems.length > 0 && (
              <button
                onClick={() => {
                  clearHistory();
                  setRecentItems([]);
                }}
                style={{
                  background: 'rgba(214, 0, 54, 0.1)', border: 'none',
                  color: '#D60036', fontSize: '13px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  cursor: 'pointer', borderRadius: '8px', padding: '6px 12px'
                }}
              >
                <Trash2 size={14} /> Delete All
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentItems.length > 0 ? recentItems.map(item => (
              <div key={item.id} style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
                onClick={() => onLoadQR(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  border: '1px solid var(--border-color)', overflow: 'hidden'
                }}>
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="QR" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  ) : (
                    <QrCode size={28} color="var(--accent-primary)" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getQRTitle(item)}
                  </h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getQRSubtitle(item)}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                    {formatDate(item.timestamp)}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                  {/* Save/Favorite Star */}
                  <button
                    onClick={() => handleSave(item)}
                    style={{
                      background: 'transparent', border: 'none',
                      color: 'var(--text-tertiary)', cursor: 'pointer',
                      padding: '4px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#F39C12'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <Star
                      size={18}
                      fill={savedIds.has(item.id) ? '#F39C12' : 'none'}
                      style={{
                        transition: 'all 0.3s ease',
                        transform: savedIds.has(item.id) ? 'scale(1.2)' : 'scale(1)',
                        color: savedIds.has(item.id) ? '#F39C12' : 'var(--text-tertiary)'
                      }}
                    />
                  </button>

                  {/* Delete Item */}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this item from history?')) {
                        const updated = deleteFromHistory(item.id);
                        setRecentItems(updated.filter(i => i.source !== 'scan').slice(0, 10));
                      }
                    }}
                    style={{
                      background: 'transparent', border: 'none',
                      color: 'var(--text-tertiary)', cursor: 'pointer',
                      padding: '4px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#D60036'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="68" height="52" viewBox="0 0 68 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Back document sheet */}
                    <rect x="22" y="4" width="28" height="34" rx="3" fill="#FFF2F5" stroke="#FFE0E6" strokeWidth="1.5" />
                    <line x1="28" y1="12" x2="44" y2="12" stroke="#FFCCD5" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="28" y1="18" x2="40" y2="18" stroke="#FFCCD5" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="28" y1="24" x2="36" y2="24" stroke="#FFCCD5" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Front document sheet */}
                    <rect x="14" y="10" width="28" height="34" rx="3" fill="#FFFFFF" stroke="#FFE0E6" strokeWidth="1.5" />
                    <line x1="20" y1="18" x2="36" y2="18" stroke="#FFA3B1" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="20" y1="24" x2="32" y2="24" stroke="#FFA3B1" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="20" y1="30" x2="28" y2="30" stroke="#FFA3B1" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Main Pink Folder Back */}
                    <path d="M4 14C4 11.7909 5.79086 10 8 10H18.5858C19.6467 10 20.6641 10.4214 21.4142 11.1716L24.5858 14.3431C25.3359 15.0933 26.3533 15.5147 27.4142 15.5147H56C58.2091 15.5147 60 17.3239 60 19.533V44C60 46.2091 58.2091 48 56 48H8C5.79086 48 4 46.2091 4 44V14Z" fill="#FFAEC9" />
                    {/* Main Pink Folder Front flap */}
                    <path d="M4 18.533C4 16.3239 5.79086 14.5147 8 14.5147H56C58.2091 14.5147 60 16.3239 60 18.533V44C60 46.2091 58.2091 48 56 48H8C5.79086 48 4 46.2091 4 44V18.533Z" fill="#FFC2D6" />

                    {/* Glow/Heart circle icon at bottom right */}
                    <circle cx="52" cy="40" r="11" fill="#FFFFFF" filter="drop-shadow(0px 2px 4px rgba(255, 77, 109, 0.2))" />
                    <circle cx="52" cy="40" r="9" fill="#FFF0F3" stroke="#FF85A1" strokeWidth="1" />
                    {/* Heart path */}
                    <path d="M52 43C52 43 48.5 41.2 48.5 39.2C48.5 38 49.3 37.2 50.3 37.2C51.1 37.2 51.7 37.7 52 38.3C52.3 37.7 52.9 37.2 53.7 37.2C54.7 37.2 55.5 38 55.5 39.2C55.5 41.2 52 43 52 43Z" fill="#FF4D6D" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    No recent projects found.
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.3 }}>
                    Create your first QR code or barcode to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

  );
}
