import React, { useState, useEffect } from 'react';
import {
  Settings, ChevronRight, Moon, Sun, Info, Shield, FileText, Folder
} from 'lucide-react';
import { getPreferences, savePreferences } from '../utils/storage';

export default function YouPage({ onNavigate, theme, setTheme, effectiveTheme, currentUser, showToast }) {
  const [saveLocation, setSaveLocation] = useState(() => getPreferences().saveLocation || 'Mushi QR Pro');

  useEffect(() => {
    const handlePrefSync = () => {
      setSaveLocation(getPreferences().saveLocation || 'Mushi QR Pro');
    };
    window.addEventListener('preferences-sync', handlePrefSync);
    return () => window.removeEventListener('preferences-sync', handlePrefSync);
  }, []);

  const handleThemeChange = () => {
    let next;
    if (theme === 'dark') next = 'light';
    else if (theme === 'light') next = 'auto';
    else next = 'dark';
    setTheme(next);
    savePreferences({ ...getPreferences(), theme: next });
  };

  const handleChooseFolder = async () => {
    try {
      if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        if (handle && handle.name) {
          const newLoc = handle.name;
          setSaveLocation(newLoc);
          savePreferences({ ...getPreferences(), saveLocation: newLoc });
          if (showToast) showToast(`Save location updated: Internal Storage/${newLoc}`);
          return;
        }
      }
    } catch (e) {
      console.log('Directory picker cancelled or unsupported', e);
    }
    const custom = window.prompt(
      'Set Save Location folder in Internal Storage:\n(Default: Mushi QR Pro)\n\nAutomatic folder structure created inside:\n📁 Mushi QR Pro/\n ├── 📁 QR Codes/ (PNG, JPG, SVG, PDF)\n ├── 📁 Barcodes/ (PNG, JPG, SVG, PDF)\n └── 📁 Bulk Batch Generation/ (ZIP, PNG, JPG, SVG, PDF)',
      saveLocation
    );
    if (custom !== null && custom.trim() !== '') {
      const clean = custom.trim();
      setSaveLocation(clean);
      savePreferences({ ...getPreferences(), saveLocation: clean });
      if (showToast) showToast(`Save location updated: Internal Storage/${clean}`);
    }
  };

  return (
    <div className="you-page fade-in" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px var(--main-padding-x) 100px' }}>

        {/* Settings List */}
        <div className="settings-group-container" style={{ borderRadius: '16px', overflow: 'hidden' }}>

          {/* Theme */}
          <div className="settings-row-item" onClick={handleThemeChange} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{
              background: theme === 'dark'
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                : 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
            }}>
              {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="M12 2a10 10 0 0 0 0 20V2z" fill="currentColor" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Theme</div>
            <div style={{ marginRight: '12px', fontSize: '13px', textTransform: 'capitalize', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
              {theme}
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* Save Location */}
          <div className="settings-row-item" onClick={handleChooseFolder} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
              <Folder size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Save Location</div>
            <div style={{ marginRight: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {saveLocation}
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* About */}
          <div className="settings-row-item" onClick={() => window.location.hash = '#/about'} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' }}>
              <Info size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>About Mushi QR Pro</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* Privacy Policy */}
          <div className="settings-row-item" onClick={() => window.location.hash = '#/privacy-policy'} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' }}>
              <Shield size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Privacy Policy</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* Terms of Service */}
          <div className="settings-row-item" onClick={() => window.location.hash = '#/terms'} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)' }}>
              <FileText size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Terms of Service</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>



        </div>
      </div>
    </div>
  );
}
