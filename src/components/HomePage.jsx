import React, { useState, useEffect, useRef } from 'react';
import { Menu, Crown, Plus, Link2, Type, Wifi, User, Mail, MapPin, History, Moon, Sun, Info, Shield, FileText, Home, Bookmark, Settings, QrCode, ChevronLeft, ChevronRight, ScanLine, Phone, MessageSquare, FileCode, Image, Trash2, Star, FileSpreadsheet, Barcode, Link, Contact, File, Music, Coins, MessageCircle, Play, Calendar, Layers, Zap, Target } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaXTwitter, FaLinkedinIn } from 'react-icons/fa6';
import { QR_TYPES, renderQR, generateQRMatrix } from '../utils/qrEngine';
import { renderBarcode } from '../utils/barcodeEngine';
import { getHistory, deleteFromHistory, clearHistory, getSaved, saveToSaved } from '../utils/storage';
import AppIcon from './AppIcon';

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

export default function HomePage({ onNavigate, onQuickCreate, onQuickCreateBarcode, onLoadQR, theme, setTheme, effectiveTheme, activePage, onMenuClick }) {
  const [recentItems, setRecentItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAllBarcodes, setShowAllBarcodes] = useState(false);
  const [showAllQR, setShowAllQR] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = 3;

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
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }} className="fade-in-up">
        {/* Sliding Hero Cards Section */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ position: 'relative', overflow: 'hidden', marginTop: '5px', width: '100%', padding: '15px 0' }}
        >
          <div style={{
          display: 'flex',
          transform: `translateX(-${activeSlide * 100}%)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          width: '100%'
        }}>
            {/* Slide 1: Custom QR Codes */}
            <div style={{ flex: '0 0 100%', width: '100%', padding: '0 var(--main-padding-x)', boxSizing: 'border-box' }}>
              <div style={{ 
                borderRadius: '18px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(214, 0, 54, 0.28), 0 4px 16px rgba(0,0,0,0.5)',
                height: '210px',
                background: 'linear-gradient(135deg, #3D0A12 0%, #160407 55%, #220609 100%)',
              }}>
                {/* Noise texture overlay */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px',
                  opacity: 1, pointerEvents: 'none', zIndex: 1
                }} />
                {/* QR dot grid texture */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'radial-gradient(circle, rgba(255,77,109,0.12) 1px, transparent 1px)',
                  backgroundSize: '14px 14px',
                  opacity: 1, pointerEvents: 'none', zIndex: 1
                }} />
                {/* Ghost blurred QR in background */}
                <div style={{
                  position: 'absolute', right: '-10px', top: '10px',
                  width: '130px', height: '130px',
                  backgroundImage: `url('/qr-hero.png')`,
                  backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                  opacity: 0.06, filter: 'blur(4px)',
                  pointerEvents: 'none', zIndex: 1
                }} />
                {/* Center radial glow */}
                <div style={{
                  position: 'absolute', top: '50%', left: '55%',
                  transform: 'translate(-50%, -50%)',
                  width: '220px', height: '220px',
                  background: 'radial-gradient(circle, rgba(255,77,109,0.14) 0%, transparent 65%)',
                  pointerEvents: 'none', zIndex: 1
                }} />
                {/* Top-right accent glow */}
                <div style={{
                  position: 'absolute', top: '-40%', right: '-5%',
                  width: '200px', height: '200px',
                  background: 'radial-gradient(circle, rgba(255, 77, 109, 0.28) 0%, transparent 65%)',
                  filter: 'blur(25px)', pointerEvents: 'none', zIndex: 1
                }} />
                {/* Bottom-left accent glow */}
                <div style={{
                  position: 'absolute', bottom: '-20%', left: '-5%',
                  width: '160px', height: '160px',
                  background: 'radial-gradient(circle, rgba(214, 0, 54, 0.22) 0%, transparent 70%)',
                  filter: 'blur(22px)', pointerEvents: 'none', zIndex: 1
                }} />
                {/* Floating particles */}
                <div style={{ position: 'absolute', top: '18%', left: '32%', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,77,109,0.7)', boxShadow: '0 0 6px rgba(255,77,109,0.8)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '55%', left: '22%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,150,150,0.5)', boxShadow: '0 0 4px rgba(255,150,150,0.6)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '30%', left: '45%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(255,77,109,0.4)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '72%', left: '38%', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,200,200,0.35)', pointerEvents: 'none', zIndex: 2 }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  position: 'relative',
                  flex: 1,
                  zIndex: 2
                }}>
                  {/* Left Column (42%) */}
                  <div style={{ zIndex: 2, flex: '0 0 42%', display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <h2 style={{ 
                          fontSize: '14px', 
                          fontWeight: 800, 
                          margin: 0, 
                          backgroundImage: 'linear-gradient(90deg, #FF4D6D 0%, #FFA5A5 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          lineHeight: 1.15,
                          whiteSpace: 'nowrap'
                        }}>
                          Custom QR Codes
                        </h2>
                      </div>
                      <p style={{ fontSize: '11px', margin: '4px 0 0 0', color: 'rgba(255,255,255,0.7)', fontWeight: 500, lineHeight: 1.35, maxWidth: '140px' }}>
                        Design custom QR codes with styles, colors, custom logos, and frames instantly.
                      </p>
                    </div>

                    <button 
                      onClick={() => onNavigate('generator')}
                      style={{
                        backgroundColor: 'rgba(255, 77, 109, 0.15)',
                        color: '#fff',
                        border: '1px solid rgba(255, 77, 109, 0.35)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '0 16px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        width: 'fit-content',
                        height: '32px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                        Create QR Code <ChevronRight size={13} />
                      </span>
                    </button>
                  </div>

                  {/* Right Column (58%) Custom QR Mockup */}
                  <div style={{ flex: '0 0 58%', height: '100%', position: 'relative' }}>
                    {/* Glow aura behind image */}
                    <div style={{
                      position: 'absolute', right: '-5px', bottom: '10px',
                      width: '120px', height: '120px',
                      background: 'radial-gradient(circle, rgba(255,77,109,0.35) 0%, transparent 70%)',
                      filter: 'blur(18px)', zIndex: 1, pointerEvents: 'none'
                    }} />
                    <img 
                      src="/qr-hero.png" 
                      alt="QR Mockup" 
                      style={{
                        position: 'absolute',
                        right: '-15px',
                        bottom: '-10px',
                        height: '160px',
                        width: 'auto',
                        zIndex: 2,
                        pointerEvents: 'none',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 12px 24px rgba(255,77,109,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                      }}
                    />
                  </div>
                </div>

                {/* Features Row inside QR Codes card */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 16px',
                  backgroundColor: 'rgba(255, 77, 109, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderTop: '1px solid rgba(255, 77, 109, 0.15)',
                  gap: '8px',
                  width: '100%',
                  height: '40px',
                  boxSizing: 'border-box',
                  zIndex: 2
                }}>
                  {/* Feature 1: Custom Logos */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', flex: 1, height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#FF4D6D', flexShrink: 0 
                    }}>
                      <Image size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>Custom Logos</span>
                  </div>

                  {/* Feature 2: HD Quality */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', flex: 1, height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#FF4D6D', flexShrink: 0 
                    }}>
                      <Crown size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>HD Quality</span>
                  </div>

                  {/* Feature 3: Secure */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center', height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#FF4D6D', flexShrink: 0 
                    }}>
                      <Shield size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Standerd Barcodes */}
            <div style={{ flex: '0 0 100%', width: '100%', padding: '0 var(--main-padding-x)', boxSizing: 'border-box' }}>
              <div style={{ 
                borderRadius: '18px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(13, 148, 136, 0.28), 0 4px 16px rgba(0,0,0,0.5)',
                height: '210px',
                background: 'linear-gradient(135deg, #062E27 0%, #010E0C 55%, #041C18 100%)',
              }}>
                {/* Noise texture overlay */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px',
                  opacity: 1, pointerEvents: 'none', zIndex: 1
                }} />
                {/* Barcode-stripe texture */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'repeating-linear-gradient(90deg, rgba(45,212,191,0.04) 0px, rgba(45,212,191,0.04) 2px, transparent 2px, transparent 12px)',
                  opacity: 1, pointerEvents: 'none', zIndex: 1
                }} />
                {/* Ghost blurred barcode in background */}
                <div style={{
                  position: 'absolute', right: '-10px', top: '12px',
                  width: '150px', height: '100px',
                  backgroundImage: `url('/barcode-hero.png')`,
                  backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                  opacity: 0.06, filter: 'blur(4px)',
                  pointerEvents: 'none', zIndex: 1
                }} />
                {/* Center radial glow */}
                <div style={{
                  position: 'absolute', top: '50%', left: '55%',
                  transform: 'translate(-50%, -50%)',
                  width: '220px', height: '220px',
                  background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 65%)',
                  pointerEvents: 'none', zIndex: 1
                }} />
                {/* Top-right accent glow */}
                <div style={{
                  position: 'absolute', top: '-40%', right: '-5%',
                  width: '200px', height: '200px',
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.28) 0%, transparent 65%)',
                  filter: 'blur(25px)', pointerEvents: 'none', zIndex: 1
                }} />
                {/* Bottom-left accent glow */}
                <div style={{
                  position: 'absolute', bottom: '-20%', left: '-5%',
                  width: '160px', height: '160px',
                  background: 'radial-gradient(circle, rgba(13, 148, 136, 0.22) 0%, transparent 70%)',
                  filter: 'blur(22px)', pointerEvents: 'none', zIndex: 1
                }} />
                {/* Floating particles */}
                <div style={{ position: 'absolute', top: '20%', left: '33%', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(45,212,191,0.7)', boxShadow: '0 0 6px rgba(45,212,191,0.8)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '58%', left: '24%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(100,240,220,0.5)', boxShadow: '0 0 4px rgba(100,240,220,0.6)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '35%', left: '42%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(45,212,191,0.4)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '68%', left: '36%', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(180,255,240,0.35)', pointerEvents: 'none', zIndex: 2 }} />
                {/* Old glow effects slot kept for compatibility */}
                <div style={{
                  position: 'absolute',
                  top: '-40%',
                  right: '-5%',
                  width: '200px',
                  height: '200px',
                  background: 'transparent',
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
                <div style={{ display: 'none' }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  position: 'relative',
                  flex: 1,
                  zIndex: 2
                }}>
                  {/* Left Column (42%) */}
                  <div style={{ zIndex: 2, flex: '0 0 42%', display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <h2 style={{ 
                          fontSize: '14px', 
                          fontWeight: 800, 
                          margin: 0, 
                          backgroundImage: 'linear-gradient(90deg, #2DD4BF 0%, #85F4FF 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          lineHeight: 1.15,
                          whiteSpace: 'nowrap'
                        }}>
                          Standard Barcodes
                        </h2>
                      </div>
                      <p style={{ fontSize: '11px', margin: '4px 0 0 0', color: 'rgba(255,255,255,0.7)', fontWeight: 500, lineHeight: 1.35, maxWidth: '140px' }}>
                        Generate standard Code 128, EAN, UPC, and other standard barcodes instantly.
                      </p>
                    </div>

                    <button 
                      onClick={() => onNavigate('barcode')}
                      style={{
                        backgroundColor: 'rgba(45, 212, 191, 0.15)',
                        color: '#fff',
                        border: '1px solid rgba(45, 212, 191, 0.35)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '0 16px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        width: 'fit-content',
                        height: '32px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                        Create Barcode <ChevronRight size={13} />
                      </span>
                    </button>
                  </div>

                  {/* Right Column (58%) Custom Barcode Mockup */}
                  <div style={{ flex: '0 0 58%', height: '100%', position: 'relative' }}>
                    {/* Glow aura behind image */}
                    <div style={{
                      position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%)',
                      width: '140px', height: '80px',
                      background: 'radial-gradient(ellipse, rgba(45,212,191,0.35) 0%, transparent 70%)',
                      filter: 'blur(16px)', zIndex: 1, pointerEvents: 'none'
                    }} />
                    <img 
                      src="/barcode-hero.png" 
                      alt="Barcode Mockup" 
                      style={{
                        position: 'absolute',
                        right: '-15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        height: '190px',
                        width: 'auto',
                        zIndex: 2,
                        pointerEvents: 'none',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 12px 24px rgba(45,212,191,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                      }}
                    />
                  </div>
                </div>

                {/* Features Row inside Barcodes card */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 16px',
                  backgroundColor: 'rgba(45, 212, 191, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderTop: '1px solid rgba(45, 212, 191, 0.15)',
                  gap: '8px',
                  width: '100%',
                  height: '40px',
                  boxSizing: 'border-box',
                  zIndex: 2
                }}>
                  {/* Feature 1: Multi-Format */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', flex: 1, height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#2DD4BF', flexShrink: 0 
                    }}>
                      <Barcode size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>Multi-Format</span>
                  </div>

                  {/* Feature 2: Fast Gen */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', flex: 1, height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#2DD4BF', flexShrink: 0 
                    }}>
                      <Zap size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.95)', whiteSpace: 'nowrap' }}>Fast Gen</span>
                  </div>

                  {/* Feature 3: Standardized */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center', height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#2DD4BF', flexShrink: 0 
                    }}>
                      <Shield size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.95)', whiteSpace: 'nowrap' }}>Standardized</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 3: Bulk Generation */}
            <div style={{ flex: '0 0 100%', width: '100%', padding: '0 var(--main-padding-x)', boxSizing: 'border-box' }}>
              <div style={{ 
                borderRadius: '18px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0, 102, 255, 0.28), 0 4px 16px rgba(0,0,0,0.5)',
                height: '210px',
                background: 'linear-gradient(135deg, #0A1C3A 0%, #030814 55%, #051024 100%)',
              }}>
                {/* Noise texture overlay */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px',
                  opacity: 1, pointerEvents: 'none', zIndex: 1
                }} />
                {/* CSV/spreadsheet grid texture */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'linear-gradient(rgba(0,150,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,255,0.07) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  opacity: 1, pointerEvents: 'none', zIndex: 1
                }} />
                {/* Ghost blurred QR in background */}
                <div style={{
                  position: 'absolute', right: '-5px', top: '15px',
                  width: '130px', height: '130px',
                  backgroundImage: `url('/qr-hero.png')`,
                  backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                  opacity: 0.05, filter: 'blur(4px)',
                  pointerEvents: 'none', zIndex: 1
                }} />
                {/* Center radial glow */}
                <div style={{
                  position: 'absolute', top: '50%', left: '55%',
                  transform: 'translate(-50%, -50%)',
                  width: '220px', height: '220px',
                  background: 'radial-gradient(circle, rgba(0,102,255,0.14) 0%, transparent 65%)',
                  pointerEvents: 'none', zIndex: 1
                }} />
                {/* Top-right accent glow */}
                <div style={{
                  position: 'absolute', top: '-40%', right: '-5%',
                  width: '200px', height: '200px',
                  background: 'radial-gradient(circle, rgba(0, 102, 255, 0.28) 0%, transparent 65%)',
                  filter: 'blur(25px)', pointerEvents: 'none', zIndex: 1
                }} />
                {/* Bottom-left accent glow */}
                <div style={{
                  position: 'absolute', bottom: '-20%', left: '-5%',
                  width: '160px', height: '160px',
                  background: 'radial-gradient(circle, rgba(0, 77, 214, 0.22) 0%, transparent 70%)',
                  filter: 'blur(22px)', pointerEvents: 'none', zIndex: 1
                }} />
                {/* Floating particles */}
                <div style={{ position: 'absolute', top: '22%', left: '30%', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(0,150,255,0.7)', boxShadow: '0 0 6px rgba(0,150,255,0.8)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '60%', left: '20%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(150,200,255,0.5)', boxShadow: '0 0 4px rgba(150,200,255,0.6)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '38%', left: '40%', width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(0,150,255,0.4)', pointerEvents: 'none', zIndex: 2 }} />
                <div style={{ position: 'absolute', top: '75%', left: '35%', width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(200,220,255,0.35)', pointerEvents: 'none', zIndex: 2 }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 24px',
                  position: 'relative',
                  flex: 1,
                  zIndex: 2
                }}>
                  {/* Left Column (40%) */}
                  <div style={{ zIndex: 2, flex: '0 0 42%', display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <h2 style={{ 
                          fontSize: '14px', 
                          fontWeight: 800, 
                          margin: 0, 
                          backgroundImage: 'linear-gradient(90deg, #0088FF 0%, #80C0FF 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          lineHeight: 1.15,
                          whiteSpace: 'nowrap'
                        }}>
                          Bulk Generation
                        </h2>
                      </div>
                      <p style={{ fontSize: '11px', margin: '4px 0 0 0', color: 'rgba(255,255,255,0.7)', fontWeight: 500, lineHeight: 1.35, maxWidth: '140px' }}>
                        Generate thousands of QR codes and barcodes from CSV or Excel files.
                      </p>
                    </div>

                    <button 
                      onClick={() => onNavigate('batch', 'QR')}
                      style={{
                        backgroundColor: 'rgba(0, 136, 255, 0.15)',
                        color: '#fff',
                        border: '1px solid rgba(0, 136, 255, 0.35)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '0 16px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        width: 'fit-content',
                        gap: '6px',
                        height: '32px'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                        Upload CSV <ChevronRight size={13} />
                      </span>
                    </button>
                  </div>

                  {/* Right Column (60%) Carton Box */}
                  <div style={{ flex: '0 0 58%', height: '100%', position: 'relative' }}>
                    {/* Glow aura behind image */}
                    <div style={{
                      position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)',
                      width: '120px', height: '120px',
                      background: 'radial-gradient(circle, rgba(0,150,255,0.3) 0%, transparent 70%)',
                      filter: 'blur(18px)', zIndex: 1, pointerEvents: 'none'
                    }} />
                    <img 
                      src="/box-green-bg-removed.png" 
                      alt="Bulk Box" 
                      style={{
                        position: 'absolute',
                        right: '-15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        height: '190px',
                        width: 'auto',
                        zIndex: 2,
                        pointerEvents: 'none',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.6)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                      }}
                    />
                  </div>
                </div>

                {/* Features Row inside Bulk Generation card */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 16px',
                  backgroundColor: 'rgba(0, 136, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderTop: '1px solid rgba(0, 136, 255, 0.15)',
                  gap: '8px',
                  width: '100%',
                  height: '40px',
                  boxSizing: 'border-box',
                  zIndex: 2
                }}>
                  {/* Feature 1: 10K+ Codes */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', flex: 1, height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#00B0FF', flexShrink: 0 
                    }}>
                      <Layers size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>10K+ Codes</span>
                  </div>

                  {/* Feature 2: Fast */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', flex: 1, height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#00B0FF', flexShrink: 0 
                    }}>
                      <Zap size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>Fast</span>
                  </div>

                  {/* Feature 3: Secure */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center', height: '100%' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: '#00B0FF', flexShrink: 0 
                    }}>
                      <Shield size={11} />
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap' }}>Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px'
          }}>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                style={{
                  width: activeSlide === index ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeSlide === index ? 'var(--accent-primary)' : 'var(--border-color)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Create QR Grid */}
        <div style={{ padding: '24px var(--main-padding-x) 12px' }}>
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
