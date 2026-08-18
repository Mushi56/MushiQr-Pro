import { useState, useEffect, useRef } from 'react';
import { getSaved, deleteFromSaved, clearSaved, clearSavedByRange } from '../utils/storage';
import { Search, SearchX, Trash2, MoreVertical, Star, Link2, Wifi, User, Mail, Phone, MessageSquare, MapPin, FileCode, Image, QrCode, Crown, AlertCircle } from 'lucide-react';
import { QR_TYPES } from '../utils/qrEngine';

import { FeatureAccessManager } from '../services/FeatureAccessManager';
import { usePremium } from '../services/premiumContext';

const TYPE_ICONS = {
  [QR_TYPES.URL]: <Link2 size={16} />,
  [QR_TYPES.WIFI]: <Wifi size={16} />,
  [QR_TYPES.VCARD]: <User size={16} />,
  [QR_TYPES.EMAIL]: <Mail size={16} />,
  [QR_TYPES.PHONE]: <Phone size={16} />,
  [QR_TYPES.SMS]: <MessageSquare size={16} />,
  [QR_TYPES.LOCATION]: <MapPin size={16} />,
  [QR_TYPES.PDF]: <FileCode size={16} />,
  [QR_TYPES.IMAGE]: <Image size={16} />,
  [QR_TYPES.TEXT]: <FileCode size={16} />
};

export default function SavedPage({ onLoadQR, onNavigate }) {
  const { showPaywall } = usePremium();
  const access = FeatureAccessManager.canUseFeature('saved_view');

  useEffect(() => {
    if (!access.allowed && access.status !== 'disabled_by_admin') {
      showPaywall('saved_view');
    }
  }, [access.allowed, access.status, showPaywall]);

  if (!access.allowed) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#09090f', color: '#f0f0f8', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        {access.status === 'disabled_by_admin' ? (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <AlertCircle size={32} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Saved Collection Unavailable</h2>
            <p style={{ color: '#8b8fa8', maxWidth: 440, margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              Saved Collection has been disabled globally by the Administrator.
            </p>
          </>
        ) : (
          <>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15))', border: '1px solid rgba(255, 215, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', boxShadow: '0 8px 24px rgba(255, 170, 0, 0.25)' }}>
              <Crown size={36} strokeWidth={2.2} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.3px' }}>Unlock Mushi QR Pro</h2>
            <p style={{ color: '#8b8fa8', maxWidth: 420, margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              Saved Collection is a Pro feature. Upgrade your subscription plan to bookmark and manage your favorite QR codes.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={() => showPaywall('saved_view')}
                style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 18px rgba(255, 170, 0, 0.4)' }}
              >
                <Crown size={16} fill="#000" color="#000" strokeWidth={2.5} />
                <span>Buy Pro</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
  const [saved, setSaved] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showRangeMenu, setShowRangeMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowRangeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSaved(getSaved());

    const handleSync = () => {
      setSaved(getSaved());
    };
    window.addEventListener('storage-sync', handleSync);
    return () => window.removeEventListener('storage-sync', handleSync);
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updated = deleteFromSaved(id);
    setSaved(updated);
    setOpenMenuId(null);
  };

  const handleClear = (hours) => {
    let msg = 'Are you sure?';
    if (hours === 1) msg = 'Clear saved items from the last hour?';
    if (hours === 24) msg = 'Clear saved items from the last 24 hours?';
    if (hours === 168) msg = 'Clear saved items from the last 7 days?';
    if (hours === -1) msg = 'Clear ALL saved items?';

    if (window.confirm(msg)) {
      const updated = clearSavedByRange(hours);
      setSaved(updated);
      setShowRangeMenu(false);
    }
  };

  const getQRTitle = (item) => {
    return item.displayText || 'Unnamed QR Code';
  };

  const getTypeLabel = (item) => {
    if (!item) return 'QR Code';
    const type = item.qrType || item.type;
    if (type === 'BARCODE') return 'Barcode';
    
    const barcodeFormats = [
      'DATA_MATRIX', 'DATA MATRIX', 'PDF417', 'PDF_417', 'AZTEC', 'EAN_13', 'EAN-13', 'EAN_8', 'EAN-8', 
      'UPC_A', 'UPC-A', 'UPC_E', 'UPC-E', 'CODE_128', 'CODE-128', 'CODE_39', 'CODE-39', 'CODE_93', 'CODE-93', 
      'ITF', 'ITF / I2OF5', 'ITF (I25)', 'CODABAR', 'MAXICODE'
    ];
    if (type && barcodeFormats.includes(type.toUpperCase())) {
      return 'Barcode';
    }
    return 'QR Code';
  };

  // Group types for filters: All, QR Code, Barcode
  const availableTypes = ['All', 'QR Code', 'Barcode'];

  const filteredItems = saved.filter(item => {
    const matchesSearch = getQRTitle(item).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || getTypeLabel(item) === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="saved-page fade-in" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: '24px var(--main-padding-x) 16px', background: 'var(--bg-primary)', zIndex: 10 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'relative'
        }}>

          {saved.length > 0 && (
             <div style={{ position: 'relative' }} ref={menuRef}>
               <button 
                 onClick={() => setShowRangeMenu(!showRangeMenu)}
                 style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px' }}
               >
                 <Trash2 size={22} />
               </button>
               
               {showRangeMenu && (
                 <div style={{
                   position: 'absolute', top: '100%', right: 0,
                   background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                   borderRadius: '12px', padding: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                   zIndex: 100, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px'
                 }}>
                   <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', padding: '4px 8px', textTransform: 'uppercase' }}>Clear Saved</div>
                   {[
                     { label: 'Last Hour', val: 1 },
                     { label: 'Last 24 Hours', val: 24 },
                     { label: 'Last 7 Days', val: 168 },
                     { label: 'All Time', val: -1, color: '#D60036' }
                   ].map(opt => (
                     <button
                       key={opt.label}
                       onClick={() => handleClear(opt.val)}
                       style={{
                         padding: '10px 12px', borderRadius: '8px', border: 'none',
                         background: 'transparent', color: opt.color || 'var(--text-primary)',
                         fontSize: '14px', fontWeight: 600, textAlign: 'left', cursor: 'pointer',
                         display: 'flex', alignItems: 'center', gap: '8px'
                       }}
                       onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                       onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                     >
                       <Trash2 size={16} /> {opt.label}
                     </button>
                   ))}
                 </div>
               )}
             </div>
          )}
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)',
          borderRadius: '16px', padding: '0 16px', border: '1px solid var(--border-color)',
          marginTop: '20px',
          marginBottom: '16px'
        }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search saved QR codes" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', padding: '16px',
              color: 'var(--text-primary)', fontSize: '15px', outline: 'none'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {availableTypes.map(type => {
            const count = type === 'All' ? saved.length : saved.filter(i => getTypeLabel(i) === type).length;
            const isActive = activeFilter === type;
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`tab-pill-premium ${isActive ? 'active' : ''}`}
              >
                {type} {count > 0 && <span style={{ opacity: 0.8, fontSize: '11px', fontWeight: 700 }}>({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }} className="fade-in-up">
        {saved.length === 0 ? (
          <div style={{
            background: 'var(--bg-elevated)',
            border: 'none',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
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
                No saved items yet
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.3 }}>
                Star QR codes or barcodes to save them here for quick access.
              </p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="premium-empty-state" style={{ padding: '40px 0' }}>
            No matching saved QR codes found.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {filteredItems.map((item) => {
              const typeStr = item.qrType || item.type;
              return (
              <div 
                key={item.id} 
                onClick={() => onLoadQR(item)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  transition: 'all 0.2s',
                  minWidth: 0 // Prevent expansion
                }}
              >
                <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2 }}>
                  <Star size={16} fill="#D60036" strokeWidth={0} />
                </div>
                
                <div style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '8px',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  border: 'none',
                  overflow: 'hidden'
                }}>
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="QR" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  ) : (
                    <QrCode size={40} color="var(--accent-primary)" />
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    background: 'rgba(214, 0, 54, 0.1)', color: '#D60036',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {TYPE_ICONS[typeStr] || <QrCode size={14} />}
                  </div>
                  <h4 style={{ 
                    margin: 0, fontSize: '12px', fontWeight: 700, 
                    color: 'var(--text-primary)', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis', flex: 1
                  }}>
                    {getQRTitle(item)}
                  </h4>
                  
                  <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === item.id && (
                      <div style={{
                        position: 'absolute', bottom: '100%', right: 0,
                        background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                        borderRadius: '12px', padding: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        zIndex: 10, minWidth: '120px'
                      }}>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            width: '100%', padding: '10px 12px', background: 'none', border: 'none',
                            borderRadius: '8px', color: '#D60036', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {getTypeLabel(typeStr)}
                </p>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
