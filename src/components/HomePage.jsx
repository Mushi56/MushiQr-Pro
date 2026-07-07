import React, { useState, useEffect, useRef } from 'react';
import { Menu, Crown, Plus, Link2, Type, Wifi, User, Mail, MapPin, History, Moon, Sun, Info, Shield, FileText, Home, Bookmark, Settings, QrCode, ChevronLeft, ChevronRight, ScanLine, Phone, MessageSquare, FileCode, Image, Trash2, Star, FileSpreadsheet, Barcode, Link, Contact, File, Music, Coins, MessageCircle, Play, Calendar } from 'lucide-react';
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
  const slideCount = 4;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      setActiveSlide(prev => (prev + 1) % slideCount);
    } else if (diff < -50) {
      setActiveSlide(prev => (prev - 1 + slideCount) % slideCount);
    }
  };

  useEffect(() => {
    if (activePage !== 'home') return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slideCount);
    }, 5500);
    return () => clearInterval(interval);
  }, [activePage]);

  useEffect(() => {
    if (activePage === 'home') {
      const history = getHistory();
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
          style={{ position: 'relative', overflow: 'hidden', marginTop: '5px', width: '100%', padding: '15px 0' }}
        >
          <div style={{
            display: 'flex',
            transform: `translateX(-${activeSlide * 100}%)`,
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '100%'
          }}>
            {/* Slide 1: Single QR */}
            <div style={{ flex: '0 0 100%', width: '100%', padding: '0 var(--main-padding-x)', boxSizing: 'border-box' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #8B0020 0%, #D60036 45%, #FF2D5E 100%)',
                borderRadius: '18px',
                padding: '24px 20px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 32px rgba(214, 0, 54, 0.3)',
                gap: '12px',
                height: '140px'
              }}>
                <div style={{
                  position: 'absolute', top: '-20px', right: '70px',
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)', pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute', bottom: '-24px', right: '10px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
                }} />

                <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1 }}>Single QR Code</h2>
                      <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Create custom QR codes with styles, logos & frames</p>
                    </div>

                    <button 
                      onClick={() => onNavigate('generator')}
                      style={{
                        backgroundColor: '#fff',
                        color: '#D60036',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: 'fit-content'
                      }}
                    >
                      <Plus size={16} /> Create QR
                    </button>
                  </div>
                </div>

                <div style={{ 
                   background: 'rgba(255,255,255,0.15)',
                   backdropFilter: 'blur(8px)',
                   width: '90px',
                   height: '90px',
                   borderRadius: '12px',
                   border: '1px solid rgba(255,255,255,0.2)',
                   flexShrink: 0,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   zIndex: 1
                 }}>
                   <HeroQRCanvas />
                 </div>
              </div>
            </div>

            {/* Slide 2: Bulk QR */}
            <div style={{ flex: '0 0 100%', width: '100%', padding: '0 var(--main-padding-x)', boxSizing: 'border-box' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #6366F1 100%)',
                borderRadius: '18px',
                padding: '24px 20px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 32px rgba(59, 130, 246, 0.3)',
                gap: '12px',
                height: '140px'
              }}>
                <div style={{
                  position: 'absolute', top: '-20px', right: '70px',
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)', pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute', bottom: '-24px', right: '10px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
                }} />

                <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1 }}>Create Bulk QR</h2>
                      <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Upload CSV/Excel file to generate bulk QR codes</p>
                    </div>

                    <button 
                      onClick={() => onNavigate('batch', 'QR')}
                      style={{
                        backgroundColor: '#fff',
                        color: '#3B82F6',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: 'fit-content'
                      }}
                    >
                      <FileSpreadsheet size={16} /> Create Bulk QR
                    </button>
                  </div>
                </div>

                <div style={{ 
                   background: 'rgba(255,255,255,0.15)',
                   backdropFilter: 'blur(8px)',
                   width: '90px',
                   height: '90px',
                   borderRadius: '12px',
                   border: '1px solid rgba(255,255,255,0.2)',
                   flexShrink: 0,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   zIndex: 1
                 }}>
                   <HeroQRCanvasBatch />
                 </div>
              </div>
            </div>

            {/* Slide 3: Barcode Creator */}
            <div style={{ flex: '0 0 100%', width: '100%', padding: '0 var(--main-padding-x)', boxSizing: 'border-box' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 50%, #115E59 100%)',
                borderRadius: '18px',
                padding: '24px 20px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 32px rgba(13, 148, 136, 0.3)',
                gap: '12px',
                height: '140px'
              }}>
                <div style={{
                  position: 'absolute', top: '-20px', right: '70px',
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)', pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute', bottom: '-24px', right: '10px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
                }} />

                <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1 }}>Barcode Generator</h2>
                      <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Create standard Code 128 barcodes instantly</p>
                    </div>

                    <button 
                      onClick={() => onNavigate('barcode')}
                      style={{
                        backgroundColor: '#fff',
                        color: '#0F766E',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: 'fit-content'
                      }}
                    >
                      <Barcode size={16} /> Create Barcode
                    </button>
                  </div>
                </div>

                <div style={{ 
                   background: 'rgba(255,255,255,0.15)',
                   backdropFilter: 'blur(8px)',
                   width: '90px',
                   height: '90px',
                   borderRadius: '12px',
                   border: '1px solid rgba(255,255,255,0.2)',
                   flexShrink: 0,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   zIndex: 1
                 }}>
                   <HeroBarcodeCanvas />
                 </div>
              </div>
            </div>

            {/* Slide 4: Bulk Barcode Generator */}
            <div style={{ flex: '0 0 100%', width: '100%', padding: '0 var(--main-padding-x)', boxSizing: 'border-box' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #2DD4BF 100%)',
                borderRadius: '18px',
                padding: '24px 20px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 32px rgba(20, 184, 166, 0.3)',
                gap: '12px',
                height: '140px'
              }}>
                <div style={{
                  position: 'absolute', top: '-20px', right: '70px',
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)', pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute', bottom: '-24px', right: '10px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
                }} />

                <div style={{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1 }}>Bulk Barcode</h2>
                      <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Create multiple barcodes at once using CSV/Excel</p>
                    </div>

                    <button 
                      onClick={() => onNavigate('batch', 'BARCODE')}
                      style={{
                        backgroundColor: '#fff',
                        color: '#14B8A6',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        width: 'fit-content'
                      }}
                    >
                      <FileSpreadsheet size={16} /> Create Bulk Barcode
                    </button>
                  </div>
                </div>

                <div style={{ 
                   background: 'rgba(255,255,255,0.15)',
                   backdropFilter: 'blur(8px)',
                   width: '90px',
                   height: '90px',
                   borderRadius: '12px',
                   border: '1px solid rgba(255,255,255,0.2)',
                   flexShrink: 0,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   zIndex: 1
                 }}>
                   <HeroBarcodeCanvas />
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
            {[0, 1, 2, 3].map((index) => (
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
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              {showAllQR ? 'See Less' : 'See All'}
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
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              {showAllBarcodes ? 'See Less' : 'See All'}
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
                        setRecentItems(updated.slice(0, 10));
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
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No recent projects found.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

  );
}
