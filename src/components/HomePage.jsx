import React, { useState, useEffect, useRef } from 'react';
import { Menu, Crown, Plus, Link2, Type, Wifi, User, Mail, MapPin, History, Moon, Sun, Info, Shield, FileText, Home, Bookmark, Settings, QrCode, ChevronRight, ScanLine, Phone, MessageSquare, FileCode, Image, Trash2, Star } from 'lucide-react';
import { QR_TYPES, renderQR, generateQRMatrix } from '../utils/qrEngine';
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

export default function HomePage({ onNavigate, onQuickCreate, onLoadQR, theme, setTheme, effectiveTheme, activePage, onMenuClick }) {
  const [recentItems, setRecentItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());

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
    { id: QR_TYPES.URL, label: 'Website', icon: <Link2 size={20} /> },
    { id: QR_TYPES.TEXT, label: 'Text', icon: <Type size={20} /> },
    { id: QR_TYPES.WIFI, label: 'WiFi', icon: <Wifi size={20} /> },
    { id: QR_TYPES.EMAIL, label: 'Email', icon: <Mail size={20} /> },
    { id: QR_TYPES.PHONE, label: 'Phone', icon: <Phone size={20} /> },
    { id: QR_TYPES.SMS, label: 'SMS', icon: <MessageSquare size={20} /> },
    { id: QR_TYPES.VCARD, label: 'Contact', icon: <User size={20} /> },
    { id: QR_TYPES.LOCATION, label: 'Location', icon: <MapPin size={20} /> },
    { id: QR_TYPES.PDF, label: 'PDF', icon: <FileCode size={20} /> },
    { id: QR_TYPES.IMAGE, label: 'Image', icon: <Image size={20} /> },
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
      position: 'relative',
      paddingTop: 'env(safe-area-inset-top)'
    }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }} className="fade-in-up">
        {/* Hero Card */}
        <div style={{ padding: '0 var(--main-padding-x)', marginTop: '24px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #8B0020 0%, #D60036 45%, #FF2D5E 100%)',
            borderRadius: '12px',
            padding: '20px 18px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 32px rgba(214, 0, 54, 0.35)',
            gap: '12px'
          }}>
            {/* Decorative circles for depth */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: 'fit-content', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                  <h2 style={{ 
                    fontSize: '21px', fontWeight: 800, 
                    margin: 0, color: '#fff',
                    lineHeight: 1.1, whiteSpace: 'nowrap',
                    textAlign: 'left'
                  }}>Create QR Code</h2>
                  <p style={{ 
                    fontSize: '13px', margin: 0, 
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 500, whiteSpace: 'nowrap',
                    textAlign: 'left'
                  }}>Fast, Simple & Beautiful</p>
                </div>

                <button 
                  onClick={() => onNavigate('generator')}
                  style={{
                    backgroundColor: '#fff',
                    color: '#D60036',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Plus size={16} /> Create New
                </button>
              </div>
            </div>

            <div style={{ 
               background: 'rgba(255,255,255,0.15)',
               backdropFilter: 'blur(8px)',
               width: '100px',
               height: '100px',
               borderRadius: '6px',
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

        {/* Quick Create Grid */}
        <div style={{ padding: '24px var(--main-padding-x)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Quick Create</h3>
          <div className="quick-options-grid">
            {quickOptions.map(option => (
              <button
                key={option.id}
                onClick={() => onQuickCreate(option.id)}
                className="quick-option-card"
                style={{ width: '100%' }}
              >
                <div className="quick-option-icon-wrapper">
                  {React.cloneElement(option.icon, { size: 20, strokeWidth: 1.8 })}
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
