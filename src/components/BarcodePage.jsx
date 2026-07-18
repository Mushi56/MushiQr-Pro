import React, { useState, useEffect, useRef } from 'react';
import {
  Save, Palette, Sliders, Undo2, Redo2, ChevronDown,
  FileImage, FileCode, FileText, Copy, Bookmark, Share2,
  Menu, Home, History, Moon, Sun, Info, Shield,
  FileText as FileIcon, AlertCircle, Layers, Pencil, Barcode, Pipette
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { renderBarcode, BARCODE_STANDARDS } from '../utils/barcodeEngine';
import { saveToSaved } from '../utils/storage';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { downloadPNG, downloadSVG, downloadPDF, downloadJPG } from '../utils/exportUtils';
import AppIcon from './AppIcon';
import AdvancedColorPicker from './AdvancedColorPicker';
import BarcodeDataModal from './BarcodeDataModal';
import ColorPicker from './ColorPicker';

// ─── Color Presets ────────────────────────────────────────────────────────────
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

// ─── Parse text → structured fields for BarcodeDataModal ─────────────────────
function parseValueToFields(val, type) {
  const digits = (val || '').replace(/\D/g, '');
  switch (type) {
    case 'ean13': return { countryPrefix: digits.slice(0, 3), manufacturer: digits.slice(3, 8), productCode: digits.slice(8, 12) };
    case 'upca': return { numberSystem: digits.slice(0, 1) || '0', manufacturer: digits.slice(1, 6), productCode: digits.slice(6, 11) };
    case 'ean8': return { countryPrefix: digits.slice(0, 3), productCode: digits.slice(3, 7) };
    case 'itf14': return { indicator: digits.slice(0, 1) || '1', gs1Prefix: digits.slice(1, 7), itemRef: digits.slice(7, 13) };
    case 'upce': return { numberSystem: digits.slice(0, 1) || '0', body: digits.slice(1, 7) };
    case 'codabar': {
      const hasStart = /^[A-D]/i.test(val || '');
      const hasStop = /[A-D]$/i.test(val || '');
      return {
        start: hasStart ? (val || '').slice(0, 1).toUpperCase() : 'A',
        body: (val || '').slice(hasStart ? 1 : 0, hasStop ? -1 : undefined) || '',
        stop: hasStop ? (val || '').slice(-1).toUpperCase() : 'B'
      };
    }
    case 'postnet': return { format: digits.length <= 5 ? '5' : digits.length <= 9 ? '9' : '11', data: digits };
    case 'planet': return { format: digits.length <= 11 ? '11' : digits.length <= 12 ? '12' : digits.length <= 13 ? '13' : '14', data: digits };
    default: return { data: val || '' };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BarcodePage({ onNavigate, showToast, loadedBarcodeItem, setLoadedBarcodeItem, theme, setTheme, effectiveTheme }) {
  const [text, setText] = useState('7501031311309');
  const [bcid, setBcid] = useState('ean13');
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

  // History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoActionRef = useRef(false);
  const [exportQuality, setExportQuality] = useState('High');

  const canvasRef = useRef(null);

  // Data modal
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [modalInitialFields, setModalInitialFields] = useState({});
  const [pendingBcid, setPendingBcid] = useState(null);

  // Handle click outside menu / dropdowns to close them
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && !e.target.closest('.btn-menu-toggle') && !e.target.closest('.app-dropdown-menu')) {
        setIsMenuOpen(false);
      }
      if (formatDropdownOpen && !e.target.closest('.btn-header-save') && !e.target.closest('.save-as-dropdown')) {
        setFormatDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMenuOpen, formatDropdownOpen]);

  // Init history
  useEffect(() => {
    setHistory([{ text, bcid, barColor, bgColor, barWidth, height, margin, displayValue }]);
    setHistoryIndex(0);
  }, []);

  const updateStateAndHistory = (updates) => {
    const cur = { text, bcid, barColor, bgColor, barWidth, height, margin, displayValue };
    const newState = { ...cur, ...updates };
    if (updates.text !== undefined) setText(updates.text);
    if (updates.bcid !== undefined) setBcid(updates.bcid);
    if (updates.barColor !== undefined) setBarColor(updates.barColor);
    if (updates.bgColor !== undefined) setBgColor(updates.bgColor);
    if (updates.barWidth !== undefined) setBarWidth(updates.barWidth);
    if (updates.height !== undefined) setHeight(updates.height);
    if (updates.margin !== undefined) setMargin(updates.margin);
    if (updates.displayValue !== undefined) setDisplayValue(updates.displayValue);
    if (isUndoRedoActionRef.current) { isUndoRedoActionRef.current = false; return; }
    const cleaned = history.slice(0, historyIndex + 1);
    setHistory([...cleaned, newState]);
    setHistoryIndex(cleaned.length);
  };

  const undo = () => {
    if (historyIndex > 0) {
      isUndoRedoActionRef.current = true;
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      const s = history[idx];
      setText(s.text); setBcid(s.bcid || 'code128'); setBarColor(s.barColor);
      setBgColor(s.bgColor); setBarWidth(s.barWidth); setHeight(s.height);
      setMargin(s.margin); setDisplayValue(s.displayValue);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoActionRef.current = true;
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      const s = history[idx];
      setText(s.text); setBcid(s.bcid || 'code128'); setBarColor(s.barColor);
      setBgColor(s.bgColor); setBarWidth(s.barWidth); setHeight(s.height);
      setMargin(s.margin); setDisplayValue(s.displayValue);
    }
  };

  const currentStandard = BARCODE_STANDARDS[bcid] || BARCODE_STANDARDS.code128;
  const isDataValid = currentStandard.validate(text);

  // Open data modal
  const openDataModal = (targetBcid = bcid) => {
    const fields = parseValueToFields(text, targetBcid);
    setModalInitialFields(fields);
    setPendingBcid(targetBcid);
    setIsDataModalOpen(true);
  };

  // Apply modal result
  const handleModalApply = (compiledValue) => {
    const updates = { text: compiledValue };
    if (pendingBcid && pendingBcid !== bcid) {
      updates.bcid = pendingBcid;
    }
    updateStateAndHistory(updates);
    setIsDataModalOpen(false);
    setPendingBcid(null);
  };

  // Load from home / saved
  useEffect(() => {
    if (loadedBarcodeItem) {
      const val = loadedBarcodeItem.displayText || loadedBarcodeItem.qrData?.text || '';
      const s = loadedBarcodeItem.style || {};
      const targetBcid = s.bcid || 'code128';
      if (val) setText(val);
      if (s.bcid) setBcid(s.bcid);
      if (s.barColor) setBarColor(s.barColor);
      if (s.bgColor) setBgColor(s.bgColor);
      if (s.barWidth !== undefined) setBarWidth(s.barWidth);
      if (s.height !== undefined) setHeight(s.height);
      if (s.margin !== undefined) setMargin(s.margin);
      if (s.displayValue !== undefined) setDisplayValue(s.displayValue);
      // Auto-open modal for editing
      const fields = parseValueToFields(val, targetBcid);
      setModalInitialFields(fields);
      setPendingBcid(targetBcid);
      setIsDataModalOpen(true);
      setLoadedBarcodeItem(null);
    }
  }, [loadedBarcodeItem, setLoadedBarcodeItem]);

  // Render barcode whenever state changes
  useEffect(() => {
    if (!canvasRef.current) return;
    renderBarcode(canvasRef.current, text, { bcid, barColor, bgColor, barWidth, height, margin, displayValue });
  }, [text, bcid, barColor, bgColor, barWidth, height, margin, displayValue]);

  const handleDownload = async (format) => {
    if (!canvasRef.current || !isDataValid) return;
    try {
      const filename = `barcode_${bcid}_${text.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      // Scale based on exportQuality (Low=1x, Medium=2x, High=3x, Ultra=4x)
      const scaleMap = { 'Low': 1, 'Medium': 2, 'High': 3, 'Ultra': 4 };
      const scale = scaleMap[exportQuality] || 3;
      
      const tempCanvas = document.createElement('canvas');
      renderBarcode(tempCanvas, text, {
        bcid,
        barColor,
        bgColor,
        barWidth: barWidth * scale,
        height, // keep base height unscaled as bwip-js scale factor handles overall scaling
        margin: margin * scale,
        displayValue
      });

      let result;
      if (format === 'PNG') result = await downloadPNG(tempCanvas, filename);
      else if (format === 'JPG') result = await downloadJPG(tempCanvas, filename);
      else if (format === 'SVG') result = await downloadSVG(tempCanvas, filename);
      else if (format === 'PDF') result = await downloadPDF(tempCanvas, filename);
      
      if (result === 'gallery') showToast('Saved to Gallery', 'success');
      else if (result === 'share') showToast('Share Sheet Opened', 'success');
      else showToast('Saved successfully', 'success');
    } catch (err) { console.error(err); showToast('Export failed', 'error'); }
  };

  const handleSave = () => {
    if (!isDataValid) { showToast(currentStandard.errorMsg, 'error'); return; }
    try {
      saveToSaved({
        qrType: 'BARCODE',
        qrData: { text },
        displayText: text,
        thumbnail: canvasRef.current.toDataURL('image/jpeg', 0.8),
        style: { bcid, barColor, bgColor, barWidth, height, margin, displayValue }
      });
      showToast('Added to Saved', 'success');
    } catch (err) { console.error(err); showToast('Failed to save', 'error'); }
  };

  const handleCopy = async () => {
    if (!canvasRef.current || !isDataValid) return;
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('Copied to clipboard!', 'success');
      } catch { showToast('Failed to copy.', 'error'); }
    }, 'image/png');
  };

  const handleShare = async () => {
    if (!canvasRef.current || !isDataValid) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];
      const fileName = `barcode_${Date.now()}.png`;
      const saved = await Filesystem.writeFile({ path: fileName, data: base64Data, directory: Directory.Cache });
      await Share.share({ title: `Barcode (${bcid.toUpperCase()})`, url: saved.uri, dialogTitle: 'Share Barcode' });
    } catch {
      try {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'barcode.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: 'My Barcode', text });
        else handleDownload('PNG');
      } catch { handleDownload('PNG'); }
    }
  };

  const openAdvancedPicker = (type, color) => setAdvPicker({ open: true, color, type });
  const handleAdvColorChange = (c) => { if (advPicker.type === 'bar') setBarColor(c); else setBgColor(c); };
  const handleAdvColorConfirm = (c) => {
    if (advPicker.type === 'bar') updateStateAndHistory({ barColor: c });
    else updateStateAndHistory({ bgColor: c });
    setAdvPicker(p => ({ ...p, open: false }));
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
      {/* ── Top Header ── */}
      <header className="app-header">
        <div className="app-logo">
          <AppIcon size={44} shadow />
          <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
            <button onClick={undo} disabled={historyIndex <= 0} title="Undo" style={undoRedoStyle(historyIndex <= 0)}>
              <Undo2 size={18} strokeWidth={2.5} />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo" style={undoRedoStyle(historyIndex >= history.length - 1)}>
              <Redo2 size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="app-header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Export Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className={`btn-header-action btn-header-save ${formatDropdownOpen ? 'active' : ''}`}
              onClick={() => { if (!isDataValid) { showToast(currentStandard.errorMsg, 'error'); return; } setFormatDropdownOpen(!formatDropdownOpen); }}
              style={{ opacity: isDataValid ? 1 : 0.5 }}
              title="Export"
            >
              <Save size={20} />
              <ChevronDown size={14} style={{ marginLeft: 2, opacity: 0.8 }} />
            </button>
            {formatDropdownOpen && isDataValid && (
              <div className="app-dropdown-menu save-as-dropdown fade-in" style={{ top: 'calc(100% + 12px)', right: 0, width: 280 }}>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>Export Format</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {[
                      { label: 'PNG', Icon: FileImage },
                      { label: 'SVG', Icon: FileCode },
                      { label: 'PDF', Icon: FileText },
                      { label: 'JPG', Icon: FileImage }
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

                <div style={{ height: 1, background: 'var(--border-color)', margin: 0 }} />

                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Export Quality</div>
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
                      {exportQuality === 'Low' && '1x Scale'}
                      {exportQuality === 'Medium' && '2x Scale'}
                      {exportQuality === 'High' && '3x Scale'}
                      {exportQuality === 'Ultra' && '4x Scale'}
                    </span>
                  </div>
                  <div style={{ padding: '0 8px', marginTop: 12, marginBottom: 8 }}>
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
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span>Low</span>
                      <span>Normal</span>
                      <span>HD</span>
                      <span>4K</span>
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--border-color)', margin: 0 }} />

                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>Quick Actions</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="menu-link-btn" onClick={(e) => { e.stopPropagation(); handleCopy(); setFormatDropdownOpen(false); }} style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 0 }} title="Copy"><Copy size={20} /></button>
                    <button className="menu-link-btn" onClick={(e) => { e.stopPropagation(); handleSave(); setFormatDropdownOpen(false); }} style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 0 }} title="Save"><Bookmark size={20} /></button>
                    <button className="menu-link-btn" onClick={(e) => { e.stopPropagation(); handleShare(); setFormatDropdownOpen(false); }} style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 0 }} title="Share"><Share2 size={20} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menu */}
          <div style={{ position: 'relative' }}>
            <button className={`btn-menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
              <Menu size={20} />
            </button>
            {isMenuOpen && (
              <div className="app-dropdown-menu fade-in" style={{ top: 'calc(100% + 12px)', right: 0 }}>
                <div className="menu-links">
                  <button className="menu-link-btn" onClick={() => { setIsMenuOpen(false); onNavigate('home'); }}><Home size={16} /> Home</button>
                  <button className="menu-link-btn" onClick={() => { setIsMenuOpen(false); onNavigate('history'); }}><History size={16} /> History</button>
                  <button className="menu-link-btn" onClick={() => {
                    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark';
                    setTheme(next);
                  }}>
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
                    Theme <span style={{ textTransform: 'capitalize', marginLeft: 4, color: 'var(--accent-primary)', fontWeight: 'bold' }}>{theme}</span>
                  </button>
                  <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 8px' }} />
                  <button className="menu-link-btn" onClick={() => setIsMenuOpen(false)}><Info size={16} /> About</button>
                  <button className="menu-link-btn" onClick={() => setIsMenuOpen(false)}><Shield size={16} /> Privacy Policy</button>
                  <button className="menu-link-btn" onClick={() => setIsMenuOpen(false)}><FileIcon size={16} /> Terms</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Canvas Preview (Match QR Creator styling) ── */}
      <section className="qr-preview-card" style={{ position: 'relative', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', width: '100%', boxSizing: 'border-box' }}>
        <div className="qr-preview-wrapper" style={{ aspectRatio: 'auto', width: '100%', maxWidth: '340px', height: '160px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: bgColor || '#fff', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', boxSizing: 'border-box' }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* Spacing wrapper for body content */}
      <div style={{ flex: 1, padding: '16px var(--main-padding-x) 90px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', width: '100%', boxSizing: 'border-box' }}>
        {activeTab === 'content' && (
          <>
            {/* Type badge */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'flex-start' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{currentStandard.name}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentStandard.desc}</span>
            </div>

            {/* Barcode Type Grid (freely swipe/scroll with extra space in the content section) */}
            <div className="barcode-type-tabs">
              {Object.entries(BARCODE_STANDARDS).map(([key, standard]) => (
                <button
                  key={key}
                  className={`type-tab ${bcid === key ? 'active' : ''}`}
                  style={{ minHeight: '90px', padding: '8px 6px 30px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onClick={() => {
                    if (bcid !== key) {
                      setBcid(key);
                      setText(standard.defaultValue);
                    }
                  }}
                >
                  {bcid === key && (
                    <>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          const existingFields = parseValueToFields(text, key);
                          setModalInitialFields(existingFields);
                          setPendingBcid(key);
                          setIsDataModalOpen(true);
                        }}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '24px',
                          background: 'var(--accent-primary)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                          cursor: 'pointer',
                          borderBottomLeftRadius: '8px',
                          borderBottomRightRadius: '8px',
                          gap: '4px',
                          fontWeight: 800,
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px',
                          boxShadow: '0 -2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Pencil size={10} strokeWidth={3} />
                        <span>Edit</span>
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: 2,
                        left: 2,
                        background: standard.validate(text) ? '#34C759' : '#FF3B30',
                        color: 'white',
                        borderRadius: '50%',
                        width: 14,
                        height: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        zIndex: 5
                      }}>
                        {standard.validate(text) ? (
                          <span style={{ fontSize: '8px', fontWeight: 900, lineHeight: 1 }}>✓</span>
                        ) : (
                          <span style={{ fontSize: '8px', fontWeight: 900, lineHeight: 1 }}>✗</span>
                        )}
                      </div>
                    </>
                  )}
                  <span className="type-tab-icon" style={{ width: '100%', height: '36px', background: '#fff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: bcid === key ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)', padding: '2px', boxSizing: 'border-box' }}>
                    <MiniBarcodePreview type={key} data={standard.defaultValue} />
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 700, width: '100%', display: 'block', marginTop: '6px', lineHeight: 1.1, textAlign: 'center' }}>
                    {standard.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* COLOR TAB */}
        {activeTab === 'color' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', padding: '4px 0 20px', boxSizing: 'border-box', marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Bar Color</label>
                <div className="swatch-grid-mini">
                  <ColorPicker isSwatch={true} icon={Pipette} value={barColor} onChange={(c) => updateStateAndHistory({ barColor: c })} onOpenAdvanced={(c) => openAdvancedPicker('bar', c)} />
                  {['#000000', '#FF3B30', '#007AFF', '#34C759', '#FFCC00', '#AF52DE'].map(color => (
                    <div key={color} className={`swatch-item${barColor === color ? ' active' : ''}`} style={{ backgroundColor: color }} onClick={() => updateStateAndHistory({ barColor: color })} />
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Background Color</label>
                <div className="swatch-grid-mini">
                  <ColorPicker isSwatch={true} icon={Pipette} value={bgColor} onChange={(c) => updateStateAndHistory({ bgColor: c })} onOpenAdvanced={(c) => openAdvancedPicker('bg', c)} />
                  {['#FFFFFF', '#F2F2F7', '#E5E5EA', '#EFEFF4', '#000000', '#0A0A0F'].map(color => (
                    <div key={color} className={`swatch-item${bgColor === color ? ' active' : ''}`} style={{ backgroundColor: color }} onClick={() => updateStateAndHistory({ bgColor: color })} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Presets</label>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 0 10px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                {COLOR_PRESETS.map(p => {
                  const sel = barColor.toUpperCase() === p.qr.toUpperCase() && bgColor.toUpperCase() === p.bg.toUpperCase();
                  return (
                    <button key={p.name} onClick={() => updateStateAndHistory({ barColor: p.qr, bgColor: p.bg })}
                      style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: 54 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: p.bg, border: sel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: sel ? '0 8px 16px rgba(255,59,48,0.25)' : '0 2px 6px rgba(0,0,0,0.06)', transition: 'all 0.2s ease' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: p.qr }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: sel ? 700 : 500, color: sel ? 'var(--accent-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DIMENSIONS TAB */}
        {activeTab === 'size' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', padding: '4px 0 20px', boxSizing: 'border-box', marginTop: 'auto' }}>
            {[
              { label: `Bar Thickness (${barWidth}px)`, key: 'barWidth', min: 1, max: 4, step: 1, val: barWidth },
              { label: `Height (${height}px)`, key: 'height', min: 50, max: 180, step: 10, val: height },
              { label: `Quiet Zone (${margin}px)`, key: 'margin', min: 8, max: 40, step: 4, val: margin },
            ].map(({ label, key, min, max, step, val }) => (
              <div key={key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
                <input type="range" min={min} max={max} step={step} value={val}
                  onChange={(e) => updateStateAndHistory({ [key]: parseInt(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }} />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Show Text Label</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Display human-readable text under bars</span>
              </div>
              <button onClick={() => updateStateAndHistory({ displayValue: !displayValue })}
                style={{ background: displayValue ? 'var(--accent-primary)' : 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 14px', color: displayValue ? 'white' : 'var(--text-secondary)', fontWeight: 700, fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}>
                {displayValue ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Nav Tabs ── */}
      <nav className="bottom-nav" style={{ zIndex: 100 }}>
        {[
          { id: 'content', label: 'Barcode', Icon: Barcode },
          { id: 'color', label: 'Colors', Icon: Palette },
          { id: 'size', label: 'Dimensions', Icon: Sliders }
        ].map(tab => (
          <button key={tab.id} className={`bottom-nav-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)} style={{ flex: 1 }}>
            <div className="bottom-nav-highlight" />
            <span className="bottom-nav-icon"><tab.Icon size={20} strokeWidth={2} /></span>
            <span className="bottom-nav-label" style={{ fontSize: 11, fontWeight: 700 }}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Advanced Color Picker ── */}
      <AdvancedColorPicker
        isOpen={advPicker.open}
        initialColor={advPicker.color}
        onChange={handleAdvColorChange}
        onConfirm={handleAdvColorConfirm}
        onCancel={() => { handleAdvColorChange(advPicker.color); setAdvPicker(p => ({ ...p, open: false })); }}
      />

      {/* ── Premium Barcode Data Modal ── */}
      <BarcodeDataModal
        isOpen={isDataModalOpen}
        bcid={pendingBcid || bcid}
        standard={BARCODE_STANDARDS[pendingBcid || bcid] || BARCODE_STANDARDS.code128}
        initialFields={modalInitialFields}
        onApply={handleModalApply}
        onClose={() => { setIsDataModalOpen(false); setPendingBcid(null); }}
      />
    </div>
  );
}

// ─── Mini Preview Canvas ──────────────────────────────────────────────────────
function MiniBarcodePreview({ type, data }) {
  const ref = useRef(null);
  // Some 2D/complex types don't render well in a widescreen thumbnail, use code128 fallback for display only
  const FALLBACK_AS_1D = new Set(['aztec', 'maxicode', 'hanxin', 'microqrcode', 'codablockf', 'code49']);
  const previewType = FALLBACK_AS_1D.has(type) ? 'code128' : type;
  const previewData = FALLBACK_AS_1D.has(type) ? type.toUpperCase().slice(0, 8) : data;

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    ctx.clearRect(0, 0, 80, 32);
    renderBarcode(ref.current, previewData, { bcid: previewType, barColor: '#000', bgColor: '#fff', barWidth: 1.2, height: 28, margin: 2, displayValue: false });
  }, [previewType, previewData]);
  return <canvas ref={ref} width={80} height={32} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
}

// ─── Undo/Redo Button Styles ──────────────────────────────────────────────────
function undoRedoStyle(disabled) {
  return {
    width: 36, height: 36, borderRadius: 10,
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-color)',
    color: disabled ? 'var(--text-tertiary)' : 'var(--accent-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.45 : 1
  };
}
