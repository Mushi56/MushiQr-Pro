import { useEffect, useRef } from 'react';
import { Info, Clipboard } from 'lucide-react';
import { Clipboard as CapacitorClipboard } from '@capacitor/clipboard';
import { QR_TYPES } from '../utils/qrEngine';

export default function QRDataInput({ type, data, onChange }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Focus first input after modal opens
    const timer = setTimeout(() => {
      const firstInput = containerRef.current?.querySelector('input, textarea, select');
      if (firstInput) {
        firstInput.focus();
        // Move cursor to end if it's text
        if (typeof firstInput.setSelectionRange === 'function' && firstInput.value) {
          const len = firstInput.value.length;
          firstInput.setSelectionRange(len, len);
        }
      }
    }, 350); // Delay slightly more than modal animation
    return () => clearTimeout(timer);
  }, [type]);

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handlePaste = (field, e) => {
    const text = e.clipboardData?.getData('text/plain') || e.clipboardData?.getData('text');
    if (text) {
      const target = e.target;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      const val = target.value || '';
      const newVal = val.slice(0, start) + text + val.slice(end);
      updateField(field, newVal);
      // DO NOT call e.preventDefault() so Android Gboard commitText & native paste finish smoothly!
    }
  };

  const pasteFromClipboard = async (field) => {
    try {
      const res = await CapacitorClipboard.read();
      if (res && res.value) {
        updateField(field, res.value);
        return;
      }
    } catch (e) {
      console.warn('Capacitor Clipboard.read failed, falling back:', e);
    }

    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        const text = await navigator.clipboard.readText();
        if (text) {
          updateField(field, text);
        }
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  return (
    <div ref={containerRef}>
      {(() => {
        switch (type) {
    case QR_TYPES.URL:
      return (
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>URL</label>
            <button
              type="button"
              onClick={() => pasteFromClipboard('url')}
              style={{ background: 'rgba(255, 77, 109, 0.1)', border: 'none', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '4px' }}
            >
              <Clipboard size={12} /> Paste
            </button>
          </div>
          <input
            className="form-input"
            type="url"
            placeholder="https://example.com"
            value={data.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
            onInput={(e) => updateField('url', e.target.value)}
            onPaste={(e) => handlePaste('url', e)}
            onFocus={(e) => {
              if (data.url === 'https://example.com') {
                updateField('url', '');
              }
            }}
          />
        </div>
      );

    case QR_TYPES.TEXT:
      const charCount = (data.text || '').length;
      return (
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Text</label>
            <button
              type="button"
              onClick={() => pasteFromClipboard('text')}
              style={{ background: 'rgba(255, 77, 109, 0.1)', border: 'none', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '4px' }}
            >
              <Clipboard size={12} /> Paste
            </button>
          </div>
          <div className="input-wrapper-with-counter">
            <textarea
              className="form-textarea"
              placeholder="Enter your text..."
              value={data.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              onInput={(e) => updateField('text', e.target.value)}
              onPaste={(e) => handlePaste('text', e)}
              style={{ paddingBottom: '30px' }}
            />
            <span className={`input-inner-counter ${charCount > 300 ? 'limit-reached' : ''}`}>
              {charCount} / 300
            </span>
          </div>
          <div className="input-recommendation">
            <Info size={12} style={{ marginRight: '4px' }} />
            Keeping it brief ensures a smooth scanning experience! ✨
          </div>
        </div>
      );

    case QR_TYPES.WIFI:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Network Name (SSID)</label>
            <input
              className="form-input"
              placeholder="WiFi network name"
              value={data.ssid || ''}
              onChange={(e) => updateField('ssid', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="WiFi password"
              value={data.password || ''}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Encryption</label>
            <select
              className="form-select"
              value={data.encryption || 'WPA'}
              onChange={(e) => updateField('encryption', e.target.value)}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
        </>
      );

    case QR_TYPES.EMAIL:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="name@example.com"
              value={data.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              className="form-input"
              placeholder="Email subject"
              value={data.subject || ''}
              onChange={(e) => updateField('subject', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Body</label>
            <div className="input-wrapper-with-counter">
              <textarea
                className="form-textarea"
                placeholder="Email body..."
                value={data.body || ''}
                onChange={(e) => updateField('body', e.target.value)}
                style={{ paddingBottom: '30px' }}
              />
              <span className={`input-inner-counter ${(data.body || '').length > 300 ? 'limit-reached' : ''}`}>
                {(data.body || '').length} / 300
              </span>
            </div>
            <div className="input-recommendation">
              <Info size={12} style={{ marginRight: '4px' }} />
              Keeping it brief ensures a smooth scanning experience! ✨
            </div>
          </div>
        </>
      );

    case QR_TYPES.PHONE:
      return (
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            className="form-input"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
          />
        </div>
      );

    case QR_TYPES.SMS:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-input"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={data.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <div className="input-wrapper-with-counter">
              <textarea
                className="form-textarea"
                placeholder="Your message..."
                value={data.message || ''}
                onChange={(e) => updateField('message', e.target.value)}
                style={{ paddingBottom: '30px' }}
              />
              <span className={`input-inner-counter ${(data.message || '').length > 300 ? 'limit-reached' : ''}`}>
                {(data.message || '').length} / 300
              </span>
            </div>
            <div className="input-recommendation">
              <Info size={12} style={{ marginRight: '4px' }} />
              Keeping it brief ensures a smooth scanning experience! ✨
            </div>
          </div>
        </>
      );

    case QR_TYPES.VCARD:
      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                placeholder="John"
                value={data.firstName || ''}
                onChange={(e) => updateField('firstName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                placeholder="Doe"
                value={data.lastName || ''}
                onChange={(e) => updateField('lastName', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Organization</label>
            <input
              className="form-input"
              placeholder="Company name"
              value={data.org || ''}
              onChange={(e) => updateField('org', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="Job title"
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={data.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="email@example.com"
              value={data.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              className="form-input"
              type="url"
              placeholder="https://example.com"
              value={data.url || ''}
              onChange={(e) => updateField('url', e.target.value)}
            />
          </div>
        </>
      );

    case QR_TYPES.LOCATION:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input
              className="form-input"
              placeholder="e.g. 40.7128"
              value={data.latitude || ''}
              onChange={(e) => updateField('latitude', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input
              className="form-input"
              placeholder="e.g. -74.0060"
              value={data.longitude || ''}
              onChange={(e) => updateField('longitude', e.target.value)}
            />
          </div>
        </>
      );

    case QR_TYPES.PDF:
      return (
        <div className="form-group">
          <label className="form-label">PDF File Link</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://example.com/file.pdf"
            value={data.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
          />
        </div>
      );

    case QR_TYPES.IMAGE:
      return (
        <div className="form-group">
          <label className="form-label">Image Link</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://example.com/image.png"
            value={data.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
          />
        </div>
      );

    case QR_TYPES.AUDIO:
      return (
        <div className="form-group">
          <label className="form-label">Audio Link (Spotify, Soundcloud, etc.)</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://open.spotify.com/..."
            value={data.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
          />
        </div>
      );

    case QR_TYPES.DOCUMENT:
      return (
        <div className="form-group">
          <label className="form-label">Document Link (Google Drive, Dropbox, etc.)</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://docs.google.com/..."
            value={data.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
          />
        </div>
      );

    case QR_TYPES.EVENT:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input className="form-input" placeholder="e.g. Birthday Party" value={data.title || ''} onChange={(e) => updateField('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="e.g. 123 Main St" value={data.location || ''} onChange={(e) => updateField('location', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" value={data.startDate || ''} onChange={(e) => updateField('startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" value={data.endDate || ''} onChange={(e) => updateField('endDate', e.target.value)} />
            </div>
          </div>
        </>
      );

    case QR_TYPES.CRYPTO:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-select" value={data.cryptoType || 'bitcoin'} onChange={(e) => updateField('cryptoType', e.target.value)}>
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="bitcoincash">Bitcoin Cash (BCH)</option>
              <option value="litecoin">Litecoin (LTC)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Wallet Address</label>
            <input className="form-input" placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" value={data.address || ''} onChange={(e) => updateField('address', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (Optional)</label>
            <input type="number" step="any" className="form-input" placeholder="0.05" value={data.amount || ''} onChange={(e) => updateField('amount', e.target.value)} />
          </div>
        </>
      );

    case QR_TYPES.WHATSAPP:
      return (
        <>
          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <input className="form-input" type="tel" placeholder="e.g. 15551234567" value={data.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Pre-filled Message</label>
            <div className="input-wrapper-with-counter">
              <textarea 
                className="form-textarea" 
                placeholder="Hello! I'm interested in..." 
                value={data.message || ''} 
                onChange={(e) => updateField('message', e.target.value)} 
                style={{ paddingBottom: '30px' }}
              />
              <span className={`input-inner-counter ${(data.message || '').length > 300 ? 'limit-reached' : ''}`}>
                {(data.message || '').length} / 300
              </span>
            </div>
            <div className="input-recommendation">
              <Info size={12} style={{ marginRight: '4px' }} />
              Keeping it brief ensures a smooth scanning experience! ✨
            </div>
          </div>
        </>
      );

    case QR_TYPES.YOUTUBE:
      return (
        <div className="form-group">
          <label className="form-label">YouTube Video Link</label>
          <input className="form-input" type="url" placeholder="https://youtube.com/watch?v=..." value={data.url || ''} onChange={(e) => updateField('url', e.target.value)} />
        </div>
      );
    
    case QR_TYPES.INSTAGRAM:
    case QR_TYPES.FACEBOOK:
    case QR_TYPES.X:
    case QR_TYPES.LINKEDIN:
      return (
        <div className="form-group">
          <label className="form-label" style={{ textTransform: 'capitalize' }}>{type} Username</label>
          <input
            className="form-input"
            placeholder={type === 'instagram' ? '@username' : 'username'}
            value={data.username || ''}
            onChange={(e) => updateField('username', e.target.value)}
          />
        </div>
      );

        }
      })()}
    </div>
  );
}
