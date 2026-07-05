import React, { useState } from 'react';
import { Lock, Unlock, ArrowLeft, Copy, Check, ExternalLink, Wifi } from 'lucide-react';
import { decryptData } from '../utils/crypto';

export default function SecureQRViewer({ encryptedData, onBack }) {
  const [password, setPassword] = useState('');
  const [decryptedContent, setDecryptedContent] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await decryptData(encryptedData, password);
      setDecryptedContent(result);
    } catch (err) {
      setError('Incorrect password or invalid data');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decryptedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseWiFi = (wifiStr) => {
    // Expected format: WIFI:T:WPA;S:MySSID;P:MyPassword;H:false;;
    const match = wifiStr.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);/i);
    if (match) {
      return {
        type: match[1],
        ssid: match[2],
        password: match[3]
      };
    }
    return null;
  };

  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const wifiInfo = decryptedContent.startsWith('WIFI:') ? parseWiFi(decryptedContent) : null;

  return (
    <div style={{
      width: '100%',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '24px var(--main-padding-x)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '32px 24px',
        borderRadius: '32px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }} className="glass-panel fade-in">
        
        {/* Header Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: decryptedContent ? 'rgba(16, 185, 129, 0.1)' : 'rgba(214, 0, 54, 0.1)',
          color: decryptedContent ? '#10B981' : 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: decryptedContent ? '0 0 20px rgba(16, 185, 129, 0.2)' : '0 0 20px var(--accent-glow)'
        }}>
          {decryptedContent ? <Unlock size={32} /> : <Lock size={32} />}
        </div>

        <h3 style={{
          fontSize: '22px',
          fontWeight: 800,
          margin: '0 0 8px 0',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.5px'
        }}>
          {decryptedContent ? 'Content Unlocked' : 'Password Protected'}
        </h3>
        
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          margin: '0 0 28px 0',
          lineHeight: '1.4'
        }}>
          {decryptedContent 
            ? 'The secure content is decrypted successfully.' 
            : 'Enter the password to decrypt and view the hidden content.'}
        </p>

        {!decryptedContent ? (
          <form onSubmit={handleDecrypt} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ textAlign: 'left', width: '100%' }}>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ textAlign: 'center', letterSpacing: password ? '4px' : '0' }}
                required
              />
              {error && (
                <div style={{
                  color: 'var(--accent-primary)',
                  fontSize: '12px',
                  marginTop: '8px',
                  fontWeight: 600,
                  textAlign: 'center'
                }} className="shake">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="modal-done-btn"
              style={{ margin: '8px 0 0 0', width: '100%' }}
            >
              Decrypt Content
            </button>
          </form>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Wi-Fi Details Card */}
            {wifiInfo ? (
              <div style={{
                background: 'var(--bg-hover)',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid var(--border-color)',
                textAlign: 'left',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#10B981' }}>
                  <Wifi size={20} />
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>Wi-Fi Connection Details</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Network SSID</label>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{wifiInfo.ssid}</div>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{wifiInfo.password}</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Plain Text/URL display */
              <div style={{
                background: 'var(--bg-hover)',
                borderRadius: '20px',
                padding: '16px',
                border: '1px solid var(--border-color)',
                width: '100%',
                maxHeight: '180px',
                overflowY: 'auto',
                boxSizing: 'border-box',
                wordBreak: 'break-all',
                fontSize: '14px',
                lineHeight: '1.5',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                textAlign: 'left'
              }}>
                {decryptedContent}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  height: '48px',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              {isUrl(decryptedContent) && (
                <a
                  href={decryptedContent}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    height: '48px',
                    background: 'var(--accent-gradient)',
                    color: 'white',
                    borderRadius: '14px',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px var(--accent-glow)',
                    transition: 'all 0.2s'
                  }}
                >
                  <ExternalLink size={16} /> Open URL
                </a>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '32px',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '12px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={16} /> Back to App
        </button>

      </div>
    </div>
  );
}
