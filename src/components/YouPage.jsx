import React, { useState, useEffect } from 'react';
import {
  Moon, Sun, Info, Shield, FileText, Folder,
  ChevronRight, Bookmark, History, Settings as SettingsIcon
} from 'lucide-react';
import { getHistory, getSaved, getPreferences, savePreferences } from '../utils/storage';

export default function YouPage({ onNavigate, theme, setTheme, effectiveTheme, currentUser, showToast }) {
  const [saveLocation, setSaveLocation] = useState(() => getPreferences().saveLocation || 'Mushi QR Pro');
  const [stats, setStats] = useState({ saved: 0, history: 0 });

  useEffect(() => {
    setStats({ saved: getSaved().length, history: getHistory().length });
  }, [currentUser]);

  useEffect(() => {
    const handler = () => setSaveLocation(getPreferences().saveLocation || 'Mushi QR Pro');
    window.addEventListener('preferences-sync', handler);
    return () => window.removeEventListener('preferences-sync', handler);
  }, []);

  const handleThemeChange = () => {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark';
    setTheme(next);
    savePreferences({ ...getPreferences(), theme: next });
  };

  const handleChooseFolder = async () => {
    try {
      if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        if (handle?.name) {
          setSaveLocation(handle.name);
          savePreferences({ ...getPreferences(), saveLocation: handle.name });
          if (showToast) showToast(`Save location: ${handle.name}`);
          return;
        }
      }
    } catch (e) { /* user cancelled or unsupported */ }
    const custom = window.prompt('Enter custom save folder / path:', saveLocation);
    if (custom !== null && custom.trim() !== '') {
      const clean = custom.trim();
      setSaveLocation(clean);
      savePreferences({ ...getPreferences(), saveLocation: clean });
      if (showToast) showToast(`Save location: ${clean}`);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px var(--main-padding-x) 100px' }}>

        {/* Stats (only when logged in) */}
        {currentUser && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div
              onClick={() => onNavigate('saved')}
              className="settings-group-container"
              style={{ padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '16px' }}
            >
              <Bookmark size={24} color="var(--accent-primary)" />
              <span style={{ fontSize: '22px', fontWeight: 800 }}>{stats.saved}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Saved QRs</span>
            </div>
            <div
              onClick={() => onNavigate('history')}
              className="settings-group-container"
              style={{ padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '16px' }}
            >
              <History size={24} color="#00F0FF" />
              <span style={{ fontSize: '22px', fontWeight: 800 }}>{stats.history}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Scan History</span>
            </div>
          </div>
        )}

        {/* Settings List */}
        <div className="settings-group-container" style={{ borderRadius: '16px', overflow: 'hidden' }}>

          {/* Theme */}
          <div className="settings-row-item" onClick={handleThemeChange} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{
              background: theme === 'dark'
                ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                : 'linear-gradient(135deg, #eab308, #ca8a04)'
            }}>
              {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" /><path d="M12 2a10 10 0 0 0 0 20V2z" fill="currentColor" /><circle cx="12" cy="12" r="10" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Theme</div>
            <div style={{ marginRight: '12px', fontSize: '13px', textTransform: 'capitalize', color: 'var(--accent-primary)', fontWeight: 700 }}>{theme}</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* Save Location */}
          <div className="settings-row-item" onClick={handleChooseFolder} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
              <Folder size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Save Location</div>
            <div style={{ marginRight: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {saveLocation}
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* About */}
          <div className="settings-row-item" onClick={() => window.location.hash = '#/about'} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
              <Info size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>About Mushi QR Pro</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* Privacy Policy */}
          <div className="settings-row-item" onClick={() => window.location.hash = '#/privacy-policy'} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #0d9488, #10b981)' }}>
              <Shield size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Privacy Policy</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />

          {/* Terms */}
          <div className="settings-row-item" onClick={() => window.location.hash = '#/terms'} style={{ padding: '16px' }}>
            <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}>
              <FileText size={18} />
            </div>
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>Terms of Service</div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>

          {/* Super Admin Panel link */}
          {currentUser?.email === 'mabuneri143@gmail.com' && (
            <>
              <div style={{ height: '1px', background: 'var(--border-color)', marginLeft: '64px' }} />
              <div
                className="settings-row-item"
                onClick={() => window.location.hash = '#/admin'}
                style={{ padding: '16px', color: '#FF007F' }}
              >
                <div className="icon-container-gradient" style={{ background: 'linear-gradient(135deg, #db2777, #c026d3)' }}>
                  <SettingsIcon size={18} />
                </div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 700 }}>Super Admin Panel</div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
