import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Share2, Save, Barcode, Palette, Sliders, Type } from 'lucide-react';
import { renderBarcode } from '../utils/barcodeEngine';
import { saveToHistory } from '../utils/storage';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import AdvancedColorPicker from './AdvancedColorPicker';

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
  { name: 'Rose Gold', qr: '#E91E63', bg: '#FFF1F2' }
];

export default function BarcodePage({ onNavigate, showToast, loadedBarcodeItem, setLoadedBarcodeItem }) {
  const [text, setText] = useState('CODE128-BARCODE');
  const [barColor, setBarColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [barWidth, setBarWidth] = useState(2);
  const [height, setHeight] = useState(90);
  const [margin, setMargin] = useState(16);
  const [displayValue, setDisplayValue] = useState(true);
  
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'color' | 'size'
  const [advPicker, setAdvPicker] = useState({ open: false, color: '#000000', type: 'bar' });
  const canvasRef = useRef(null);

  const openAdvancedPicker = (type, currentColor) => {
    setAdvPicker({ open: true, color: currentColor, type });
  };

  const handleAdvColorChange = (newColor) => {
    if (advPicker.type === 'bar') {
      setBarColor(newColor);
    } else {
      setBgColor(newColor);
    }
  };

  // Restore saved barcode from history or bookmark
  useEffect(() => {
    if (loadedBarcodeItem) {
      const val = loadedBarcodeItem.displayText || loadedBarcodeItem.qrData?.text || '';
      if (val) setText(val);
      
      const s = loadedBarcodeItem.style || {};
      if (s.barColor) setBarColor(s.barColor);
      if (s.bgColor) setBgColor(s.bgColor);
      if (s.barWidth !== undefined) setBarWidth(s.barWidth);
      if (s.height !== undefined) setHeight(s.height);
      if (s.margin !== undefined) setMargin(s.margin);
      if (s.displayValue !== undefined) setDisplayValue(s.displayValue);
      
      setLoadedBarcodeItem(null);
    }
  }, [loadedBarcodeItem, setLoadedBarcodeItem]);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderBarcode(canvasRef.current, text, {
      barColor,
      bgColor,
      barWidth,
      height,
      margin,
      displayValue,
      font: 'Inter, sans-serif'
    });
  }, [text, barColor, bgColor, barWidth, height, margin, displayValue]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode_${text.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Barcode PNG downloaded successfully!', 'success');
  };

  const handleSave = () => {
    if (!text.trim()) {
      showToast('Please enter text value to save', 'error');
      return;
    }

    try {
      const entry = {
        qrType: 'BARCODE',
        qrData: { text },
        displayText: text,
        thumbnail: canvasRef.current.toDataURL('image/jpeg', 0.8),
        style: {
          barColor,
          bgColor,
          barWidth,
          height,
          margin,
          displayValue
        }
      };

      saveToHistory(entry);
      showToast('Barcode saved to history!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save barcode', 'error');
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];
      const fileName = `barcode_${Date.now()}.png`;
      
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      await Share.share({
        title: 'Mushi Qr Pro - Barcode',
        url: savedFile.uri,
        dialogTitle: 'Save or Share your Barcode'
      });
    } catch (e) {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'barcode.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Barcode',
            text: text
          });
        } else {
          handleDownload();
        }
      } catch (err) {
        handleDownload();
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-primary)',
      position: 'relative'
    }}>
      {/* ── Top Header Navigation ── */}
      <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', zIndex: 10 }}>
        <div className="modal-header-title">
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Barcode Generator</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>Create standard high-contrast 1D barcodes</p>
        </div>
        <button className="modal-close" onClick={() => onNavigate('home')}>
          <X size={20} />
        </button>
      </div>

      {/* ── Main Canvas Viewport Area ── */}
      <div style={{ 
        flex: 1, 
        padding: '24px var(--main-padding-x) 180px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflowY: 'auto'
      }}>
        {/* Canvas preview card mimicking the main QR page */}
        <div className="canvas-card" style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          width: '100%',
          maxWidth: '350px',
          boxSizing: 'border-box'
        }}>
          {/* Barcode Frame container */}
          <div style={{
            background: '#ffffff',
            padding: '20px',
            borderRadius: '16px',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            overflowX: 'auto',
            boxSizing: 'border-box'
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
          </div>

          {/* Quick Actions (Save, Share, Download) */}
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button onClick={handleSave} className="action-btn" style={{ flex: 1, gap: '6px', fontSize: '13px' }}>
              <Save size={16} /> Save
            </button>
            <button onClick={handleShare} className="action-btn" style={{ flex: 1, gap: '6px', fontSize: '13px' }}>
              <Share2 size={16} /> Share
            </button>
            <button onClick={handleDownload} className="action-btn-primary" style={{ flex: 1, gap: '6px', fontSize: '13px', background: 'var(--accent-gradient)' }}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* ── Sliding Panel (Renders selected Tab Settings above Bottom Nav) ── */}
      <div 
        className="bottom-nav-overlay-panel active"
        style={{
          position: 'absolute',
          bottom: '70px',
          left: 0,
          right: 0,
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border-color)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '20px var(--main-padding-x) 24px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.1)',
          zIndex: 90,
          boxSizing: 'border-box'
        }}
      >
        {activeTab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Barcode Data</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="Enter text to encode"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-primary)',
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              marginTop: '4px'
            }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Display Value Label</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Show text value underneath the barcode</span>
              </div>
              <button
                onClick={() => setDisplayValue(!displayValue)}
                style={{
                  background: displayValue ? 'var(--accent-primary)' : 'var(--bg-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  color: displayValue ? 'white' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {displayValue ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'color' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Bar Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div
                    onClick={() => openAdvancedPicker('bar', barColor)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: barColor,
                      border: '2px solid var(--border-color)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      flexShrink: 0
                    }}
                  />
                  <input
                    type="text"
                    value={barColor}
                    onChange={(e) => setBarColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      outline: 'none',
                      minWidth: 0
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Background</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div
                    onClick={() => openAdvancedPicker('bg', bgColor)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: bgColor,
                      border: '2px solid var(--border-color)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      flexShrink: 0
                    }}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      outline: 'none',
                      minWidth: 0
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Color Presets</label>
              <div className="swatch-grid-mini" style={{ 
                display: 'flex', 
                gap: '10px', 
                overflowX: 'auto', 
                padding: '4px 0 10px 0',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}>
                {COLOR_PRESETS.map(p => {
                  const isSelected = barColor.toUpperCase() === p.qr.toUpperCase() && bgColor.toUpperCase() === p.bg.toUpperCase();
                  return (
                    <button
                      key={p.name}
                      onClick={() => {
                        setBarColor(p.qr);
                        setBgColor(p.bg);
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
                        width: '54px'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: p.bg,
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? '0 4px 10px rgba(255,59,48,0.2)' : '0 2px 4px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '3px', background: p.qr }} />
                      </div>
                      <span style={{ 
                        fontSize: '9px', 
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
          </div>
        )}

        {activeTab === 'size' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Bar Thickness ({barWidth}px)</label>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={barWidth}
                onChange={(e) => setBarWidth(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Barcode Height ({height}px)</label>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                step="10"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Quiet Zone Margin ({margin}px)</label>
              </div>
              <input
                type="range"
                min="8"
                max="40"
                step="4"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Navigation Toolbar (Matches Main Designer Nav) ── */}
      <nav className="bottom-nav" style={{ zIndex: 100 }}>
        {[
          { id: 'content', label: 'Data', Icon: Barcode },
          { id: 'color', label: 'Colors', Icon: Palette },
          { id: 'size', label: 'Dimensions', Icon: Sliders }
        ].map(tab => (
          <button
            key={tab.id}
            className={`bottom-nav-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1 }}
          >
            <div className="bottom-nav-highlight" />
            <span className="bottom-nav-icon">
              <tab.Icon size={20} strokeWidth={2} />
            </span>
            <span className="bottom-nav-label" style={{ fontSize: '11px', fontWeight: 700 }}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <AdvancedColorPicker
        isOpen={advPicker.open}
        initialColor={advPicker.color}
        onChange={handleAdvColorChange}
        onConfirm={(newColor) => {
          handleAdvColorChange(newColor);
          setAdvPicker(prev => ({ ...prev, open: false }));
        }}
        onCancel={() => {
          handleAdvColorChange(advPicker.color);
          setAdvPicker(prev => ({ ...prev, open: false }));
        }}
      />
    </div>
  );
}
