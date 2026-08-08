import React, { useState, useEffect } from 'react';
import { Folder, Check, X, HardDrive, Sparkles } from 'lucide-react';
import { getPreferences, savePreferences } from '../utils/storage';

export default function SaveLocationModal({ isOpen, onClose, onSave, showToast }) {
  const [folderName, setFolderName] = useState(() => {
    const prefs = getPreferences();
    return prefs.saveLocation || 'Mushi QR Pro';
  });

  useEffect(() => {
    if (isOpen) {
      const prefs = getPreferences();
      setFolderName(prefs.saveLocation || 'Mushi QR Pro');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const presets = [
    { label: 'Mushi QR Pro (Root Internal Storage)', value: 'Mushi QR Pro' },
    { label: 'Documents / Mushi QR Pro', value: 'Documents/Mushi QR Pro' },
    { label: 'Downloads / Mushi QR Pro', value: 'Downloads/Mushi QR Pro' },
    { label: 'Pictures / Mushi QR Pro', value: 'Pictures/Mushi QR Pro' },
  ];

  const handleSelectPreset = (val) => {
    setFolderName(val);
  };

  const handleSave = () => {
    const clean = folderName.trim() || 'Mushi QR Pro';
    const prefs = getPreferences();
    savePreferences({ ...prefs, saveLocation: clean });
    if (onSave) onSave(clean);
    if (showToast) showToast(`Save location set: Internal Storage/${clean}`);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(9, 9, 15, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated, #14141e)',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
          borderRadius: '24px',
          padding: '28px 24px',
          maxWidth: '420px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 18px rgba(236, 72, 153, 0.3)'
            }}>
              <Folder size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Set Save Location
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Internal Storage root directory picker
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-hover)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Target Location Box */}
        <div style={{
          background: 'var(--bg-hover, rgba(255, 255, 255, 0.04))',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HardDrive size={13} color="var(--accent-primary)" /> Internal Storage Path
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            /storage/emulated/0/{folderName || 'Mushi QR Pro'}
          </div>
        </div>

        {/* Custom Folder Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            FOLDER NAME IN INTERNAL STORAGE
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g. Mushi QR Pro"
            style={{
              width: '100%',
              background: 'var(--bg-primary, #09090f)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '14px 16px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Folder Presets */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
            QUICK PRESET DIRECTORIES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {presets.map((p) => {
              const isSelected = folderName === p.value;
              return (
                <div
                  key={p.value}
                  onClick={() => handleSelectPreset(p.value)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(214, 0, 54, 0.12)' : 'var(--bg-hover)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Folder size={16} color={isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                    <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {p.label}
                    </span>
                  </div>
                  {isSelected && <Check size={16} color="var(--accent-primary)" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tree Structure Preview */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '24px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: 'var(--text-secondary)',
          lineHeight: '1.6'
        }}>
          <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--accent-primary)" /> Automatic Sub-Folder Tree:
          </div>
          <div>📁 {folderName || 'Mushi QR Pro'}/</div>
          <div style={{ paddingLeft: '12px' }}>├── 📁 QR Codes/ (PNG, JPG, SVG, PDF)</div>
          <div style={{ paddingLeft: '12px' }}>├── 📁 Barcodes/ (PNG, JPG, SVG, PDF)</div>
          <div style={{ paddingLeft: '12px' }}>└── 📁 Bulk Batch Generation/ (ZIP, PNG, JPG...)</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-hover)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: 'var(--accent-gradient, linear-gradient(135deg, #D60036, #FF3B62))',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(214, 0, 54, 0.35)'
            }}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}
