import React, { useState, useEffect, useRef } from 'react';
import { Save, Barcode, Palette, Sliders, Undo2, Redo2, ChevronDown, FileImage, FileCode, FileText, Copy, Bookmark, Share2, Menu, Home, History, Moon, Sun, Info, Shield, FileText as FileIcon } from 'lucide-react';
import { renderBarcode } from '../utils/barcodeEngine';
import { saveToHistory, saveToSaved } from '../utils/storage';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { downloadPNG, downloadSVG, downloadPDF, downloadJPG } from '../utils/exportUtils';
import AppIcon from './AppIcon';
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

export default function BarcodePage({ onNavigate, showToast, loadedBarcodeItem, setLoadedBarcodeItem, theme, setTheme, effectiveTheme }) {
  const [text, setText] = useState('CODE128-BARCODE');
  const [barColor, setBarColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [barWidth, setBarWidth] = useState(2);
  const [height, setHeight] = useState(90);
  const [margin, setMargin] = useState(16);
  const [displayValue, setDisplayValue] = useState(true);
  
  const [activeTab, setActiveTab] = useState('content');
  const [advPicker, setAdvPicker] = useState({ open: false, color: '#000000', type: 'bar' });
  const [formatDropdownOpen, setFormatDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('PNG');
  
  // History Undo/Redo States
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoActionRef = useRef(false);

  const canvasRef = useRef(null);

  // Initialize history
  useEffect(() => {
    const initialState = {
      text,
      barColor,
      bgColor,
      barWidth,
      height,
      margin,
      displayValue
    };
    setHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  // Sync state and push to history
  const updateStateAndHistory = (updates) => {
    const newState = {
      text: updates.text !== undefined ? updates.text : text,
      barColor: updates.barColor !== undefined ? updates.barColor : barColor,
      bgColor: updates.bgColor !== undefined ? updates.bgColor : bgColor,
      barWidth: updates.barWidth !== undefined ? updates.barWidth : barWidth,
      height: updates.height !== undefined ? updates.height : height,
      margin: updates.margin !== undefined ? updates.margin : margin,
      displayValue: updates.displayValue !== undefined ? updates.displayValue : displayValue
    };
    
    if (updates.text !== undefined) setText(updates.text);
    if (updates.barColor !== undefined) setBarColor(updates.barColor);
    if (updates.bgColor !== undefined) setBgColor(updates.bgColor);
    if (updates.barWidth !== undefined) setBarWidth(updates.barWidth);
    if (updates.height !== undefined) setHeight(updates.height);
    if (updates.margin !== undefined) setMargin(updates.margin);
    if (updates.displayValue !== undefined) setDisplayValue(updates.displayValue);

    if (isUndoRedoActionRef.current) {
      isUndoRedoActionRef.current = false;
      return;
    }

    const cleanHistory = history.slice(0, historyIndex + 1);
    setHistory([...cleanHistory, newState]);
    setHistoryIndex(cleanHistory.length);
  };

  const undo = () => {
    if (historyIndex > 0) {
      isUndoRedoActionRef.current = true;
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      const state = history[prevIdx];
      
      setText(state.text);
      setBarColor(state.barColor);
      setBgColor(state.bgColor);
      setBarWidth(state.barWidth);
      setHeight(state.height);
      setMargin(state.margin);
      setDisplayValue(state.displayValue);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoActionRef.current = true;
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const state = history[nextIdx];
      
      setText(state.text);
      setBarColor(state.barColor);
      setBgColor(state.bgColor);
      setBarWidth(state.barWidth);
      setHeight(state.height);
      setMargin(state.margin);
      setDisplayValue(state.displayValue);
    }
  };

  // Restore saved barcode
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

  const handleDownload = async (format) => {
    if (!canvasRef.current) return;
    try {
      const filename = `barcode_${text.replace(/[^a-zA-Z0-9]/g, '_')}`;
      let result;
      if (format === 'PNG') {
        result = await downloadPNG(canvasRef.current, filename);
      } else if (format === 'JPG') {
        result = await downloadJPG(canvasRef.current, filename);
      } else if (format === 'SVG') {
        result = await downloadSVG(canvasRef.current, filename);
      } else if (format === 'PDF') {
        result = await downloadPDF(canvasRef.current, filename);
      }
      
      if (result === 'gallery') {
        showToast('Saved to Gallery', 'success');
      } else if (result === 'share') {
        showToast('Share Sheet Opened', 'success');
      } else {
        showToast('Saved successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Export failed', 'error');
    }
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
      saveToSaved(entry);
      showToast('Added to Saved', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save barcode', 'error');
    }
  };

  const handleCopyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          showToast('Copied to clipboard!', 'success');
        } catch {
          showToast('Failed to copy to clipboard.', 'error');
        }
      }, 'image/png');
    } catch {
      showToast('Platform clipboard not supported.', 'error');
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
          handleDownload('PNG');
        }
      } catch (err) {
        handleDownload('PNG');
      }
    }
  };

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

  const handleAdvColorConfirm = (newColor) => {
    if (advPicker.type === 'bar') {
      updateStateAndHistory({ barColor: newColor });
    } else {
      updateStateAndHistory({ bgColor: newColor });
    }
    setAdvPicker(prev => ({ ...prev, open: false }));
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
      {/* ── Top Header Navigation (Unified with QR header copy) ── */}
      <header className="app-header">
        <div className="app-logo">
          <AppIcon size={36} shadow />
          
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
        </div>

        <div className="app-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="header-save-container" style={{ position: 'relative' }}>
            <button
              className={`btn-header-action btn-header-save ${formatDropdownOpen ? 'active' : ''}`}
              onClick={() => setFormatDropdownOpen(!formatDropdownOpen)}
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
                          handleDownload(label);
                        }}
                      >
                        <span style={{ fontSize: '10px', fontWeight: 700 }}>{label}</span>
                      </button>
                    ))}
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
                        title="Share Barcode"
                      >
                        <Share2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="menu-container" style={{ position: 'relative' }}>
            <button
              className={`btn-menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>

            {isMenuOpen && (
              <div className="app-dropdown-menu fade-in" style={{ top: 'calc(100% + 12px)', right: 0 }}>
                <div className="menu-links">
                  <button className="menu-link-btn" onClick={() => { setIsMenuOpen(false); onNavigate('home'); }}>
                    <Home size={16} /> Home
                  </button>
                  <button className="menu-link-btn" onClick={() => { setIsMenuOpen(false); onNavigate('history'); }}>
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
                  <button className="menu-link-btn" onClick={() => { setIsMenuOpen(false); window.location.hash = '#/about'; }}>
                    <Info size={16} /> About
                  </button>
                  <button className="menu-link-btn" onClick={() => { setIsMenuOpen(false); window.location.hash = '#/privacy-policy'; }}>
                    <Shield size={16} /> Privacy Policy
                  </button>
                  <button className="menu-link-btn" onClick={() => { setIsMenuOpen(false); window.location.hash = '#/terms'; }}>
                    <FileIcon size={16} /> Terms of Service
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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
                onChange={(e) => updateStateAndHistory({ text: e.target.value.toUpperCase() })}
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
                onClick={() => updateStateAndHistory({ displayValue: !displayValue })}
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
                    onChange={(e) => updateStateAndHistory({ barColor: e.target.value })}
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
                    onChange={(e) => updateStateAndHistory({ bgColor: e.target.value })}
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
                        updateStateAndHistory({ barColor: p.qr, bgColor: p.bg });
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
                onChange={(e) => updateStateAndHistory({ barWidth: parseInt(e.target.value) })}
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
                onChange={(e) => updateStateAndHistory({ height: parseInt(e.target.value) })}
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
                onChange={(e) => updateStateAndHistory({ margin: parseInt(e.target.value) })}
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
        onConfirm={handleAdvColorConfirm}
        onCancel={() => {
          handleAdvColorChange(advPicker.color);
          setAdvPicker(prev => ({ ...prev, open: false }));
        }}
      />
    </div>
  );
}
