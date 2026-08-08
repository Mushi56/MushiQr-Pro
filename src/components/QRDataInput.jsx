import { useEffect, useRef, useCallback } from 'react';
import { Info, Clipboard } from 'lucide-react';
import { Clipboard as CapacitorClipboard } from '@capacitor/clipboard';
import { QR_TYPES } from '../utils/qrEngine';

/**
 * AndroidInput - Uncontrolled input that syncs to React state on change.
 * On Android WebView, using controlled inputs (value prop) causes React to
 * revert the DOM after Android IME clipboard insertions (Gboard pinned/recent items).
 * Uncontrolled inputs let the DOM manage itself; we only read the value on change.
 */
function AndroidInput({ className, type = 'text', placeholder, defaultValue, onValueChange, onFocusClear, style, inputMode }) {
  const inputRef = useRef(null);

  // Sync external defaultValue changes into DOM only when value actually differs
  // (e.g. when parent resets or pastes via button)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== (defaultValue || '')) {
      inputRef.current.value = defaultValue || '';
    }
  }, [defaultValue]);

  const handleChange = (e) => {
    onValueChange(e.target.value);
  };

  const handleFocus = (e) => {
    if (onFocusClear && inputRef.current?.value === onFocusClear) {
      inputRef.current.value = '';
      onValueChange('');
    }
  };

  return (
    <input
      ref={inputRef}
      className={className}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue || ''}
      onChange={handleChange}
      onInput={handleChange}
      onFocus={handleFocus}
      style={style}
      inputMode={inputMode}
    />
  );
}

/**
 * AndroidTextarea - Same pattern for textarea
 */
function AndroidTextarea({ className, placeholder, defaultValue, onValueChange, style }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== (defaultValue || '')) {
      textareaRef.current.value = defaultValue || '';
    }
  }, [defaultValue]);

  const handleChange = (e) => {
    onValueChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      className={className}
      placeholder={placeholder}
      defaultValue={defaultValue || ''}
      onChange={handleChange}
      onInput={handleChange}
      style={style}
    />
  );
}

export default function QRDataInput({ type, data, onChange }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = containerRef.current?.querySelector('input, textarea, select');
      if (firstInput) firstInput.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, [type]);

  const updateField = useCallback((field, value) => {
    onChange({ ...data, [field]: value });
  }, [data, onChange]);

  const pasteStyle = {
    background: 'rgba(255, 77, 109, 0.1)',
    border: 'none',
    color: 'var(--accent-primary)',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '4px'
  };

  const pasteFromClipboard = async (field, maxLen) => {
    let text = '';
    try {
      const res = await CapacitorClipboard.read();
      text = res?.value || '';
    } catch (_) {}
    if (!text) {
      try {
        text = await navigator.clipboard?.readText() || '';
      } catch (_) {}
    }
    if (text) {
      const val = maxLen ? text.slice(0, maxLen) : text;
      // Directly set DOM value so Android WebView doesn't fight us
      const el = containerRef.current?.querySelector(`[data-field="${field}"]`);
      if (el) el.value = val;
      updateField(field, val);
    }
  };

  const PasteBtn = ({ field, maxLen }) => (
    <button type="button" onClick={() => pasteFromClipboard(field, maxLen)} style={pasteStyle}>
      <Clipboard size={12} /> Paste
    </button>
  );

  const LabelRow = ({ label, field, maxLen }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
      <label className="form-label" style={{ margin: 0 }}>{label}</label>
      <PasteBtn field={field} maxLen={maxLen} />
    </div>
  );

  return (
    <div ref={containerRef}>
      {(() => {
        switch (type) {

    case QR_TYPES.URL:
      return (
        <div className="form-group">
          <LabelRow label="URL" field="url" />
          <AndroidInput
            className="form-input"
            type="url"
            placeholder="https://example.com"
            defaultValue={data.url}
            onValueChange={(v) => updateField('url', v)}
            onFocusClear="https://example.com"
            data-field="url"
          />
        </div>
      );

    case QR_TYPES.TEXT: {
      const charCount = (data.text || '').length;
      return (
        <div className="form-group">
          <LabelRow label="Text" field="text" />
          <div className="input-wrapper-with-counter">
            <AndroidTextarea
              className="form-textarea"
              placeholder="Enter your text..."
              defaultValue={data.text}
              onValueChange={(v) => updateField('text', v)}
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
    }

    case QR_TYPES.WIFI:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Network Name (SSID)</label>
            <AndroidInput
              className="form-input"
              placeholder="WiFi network name"
              defaultValue={data.ssid}
              onValueChange={(v) => updateField('ssid', v)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <AndroidInput
              className="form-input"
              type="password"
              placeholder="WiFi password"
              defaultValue={data.password}
              onValueChange={(v) => updateField('password', v)}
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
            <AndroidInput className="form-input" type="email" placeholder="name@example.com" defaultValue={data.email} onValueChange={(v) => updateField('email', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <AndroidInput className="form-input" placeholder="Email subject" defaultValue={data.subject} onValueChange={(v) => updateField('subject', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Body</label>
            <div className="input-wrapper-with-counter">
              <AndroidTextarea className="form-textarea" placeholder="Email body..." defaultValue={data.body} onValueChange={(v) => updateField('body', v)} style={{ paddingBottom: '30px' }} />
              <span className={`input-inner-counter ${(data.body || '').length > 300 ? 'limit-reached' : ''}`}>{(data.body || '').length} / 300</span>
            </div>
            <div className="input-recommendation"><Info size={12} style={{ marginRight: '4px' }} />Keeping it brief ensures a smooth scanning experience! ✨</div>
          </div>
        </>
      );

    case QR_TYPES.PHONE:
      return (
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <AndroidInput className="form-input" type="tel" placeholder="+1 (555) 123-4567" defaultValue={data.phone} onValueChange={(v) => updateField('phone', v)} />
        </div>
      );

    case QR_TYPES.SMS:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <AndroidInput className="form-input" type="tel" placeholder="+1 (555) 123-4567" defaultValue={data.phone} onValueChange={(v) => updateField('phone', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <div className="input-wrapper-with-counter">
              <AndroidTextarea className="form-textarea" placeholder="Your message..." defaultValue={data.message} onValueChange={(v) => updateField('message', v)} style={{ paddingBottom: '30px' }} />
              <span className={`input-inner-counter ${(data.message || '').length > 300 ? 'limit-reached' : ''}`}>{(data.message || '').length} / 300</span>
            </div>
            <div className="input-recommendation"><Info size={12} style={{ marginRight: '4px' }} />Keeping it brief ensures a smooth scanning experience! ✨</div>
          </div>
        </>
      );

    case QR_TYPES.VCARD:
      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <AndroidInput className="form-input" placeholder="John" defaultValue={data.firstName} onValueChange={(v) => updateField('firstName', v)} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <AndroidInput className="form-input" placeholder="Doe" defaultValue={data.lastName} onValueChange={(v) => updateField('lastName', v)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Organization</label>
            <AndroidInput className="form-input" placeholder="Company name" defaultValue={data.org} onValueChange={(v) => updateField('org', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <AndroidInput className="form-input" placeholder="Job title" defaultValue={data.title} onValueChange={(v) => updateField('title', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <AndroidInput className="form-input" type="tel" placeholder="+1 (555) 123-4567" defaultValue={data.phone} onValueChange={(v) => updateField('phone', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <AndroidInput className="form-input" type="email" placeholder="email@example.com" defaultValue={data.email} onValueChange={(v) => updateField('email', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <AndroidInput className="form-input" type="url" placeholder="https://example.com" defaultValue={data.url} onValueChange={(v) => updateField('url', v)} />
          </div>
        </>
      );

    case QR_TYPES.LOCATION:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <AndroidInput className="form-input" placeholder="e.g. 40.7128" defaultValue={data.latitude} onValueChange={(v) => updateField('latitude', v)} inputMode="decimal" />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude</label>
            <AndroidInput className="form-input" placeholder="e.g. -74.0060" defaultValue={data.longitude} onValueChange={(v) => updateField('longitude', v)} inputMode="decimal" />
          </div>
        </>
      );

    case QR_TYPES.PDF:
      return (
        <div className="form-group">
          <label className="form-label">PDF File Link</label>
          <AndroidInput className="form-input" type="url" placeholder="https://example.com/file.pdf" defaultValue={data.url} onValueChange={(v) => updateField('url', v)} />
        </div>
      );

    case QR_TYPES.IMAGE:
      return (
        <div className="form-group">
          <label className="form-label">Image Link</label>
          <AndroidInput className="form-input" type="url" placeholder="https://example.com/image.png" defaultValue={data.url} onValueChange={(v) => updateField('url', v)} />
        </div>
      );

    case QR_TYPES.AUDIO:
      return (
        <div className="form-group">
          <label className="form-label">Audio Link (Spotify, Soundcloud, etc.)</label>
          <AndroidInput className="form-input" type="url" placeholder="https://open.spotify.com/..." defaultValue={data.url} onValueChange={(v) => updateField('url', v)} />
        </div>
      );

    case QR_TYPES.DOCUMENT:
      return (
        <div className="form-group">
          <label className="form-label">Document Link (Google Drive, Dropbox, etc.)</label>
          <AndroidInput className="form-input" type="url" placeholder="https://docs.google.com/..." defaultValue={data.url} onValueChange={(v) => updateField('url', v)} />
        </div>
      );

    case QR_TYPES.EVENT:
      return (
        <>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <AndroidInput className="form-input" placeholder="e.g. Birthday Party" defaultValue={data.title} onValueChange={(v) => updateField('title', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <AndroidInput className="form-input" placeholder="e.g. 123 Main St" defaultValue={data.location} onValueChange={(v) => updateField('location', v)} />
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
            <AndroidInput className="form-input" placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" defaultValue={data.address} onValueChange={(v) => updateField('address', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (Optional)</label>
            <AndroidInput className="form-input" type="number" placeholder="0.05" defaultValue={data.amount} onValueChange={(v) => updateField('amount', v)} inputMode="decimal" />
          </div>
        </>
      );

    case QR_TYPES.WHATSAPP:
      return (
        <>
          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <AndroidInput className="form-input" type="tel" placeholder="e.g. 15551234567" defaultValue={data.phone} onValueChange={(v) => updateField('phone', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Pre-filled Message</label>
            <div className="input-wrapper-with-counter">
              <AndroidTextarea className="form-textarea" placeholder="Hello! I'm interested in..." defaultValue={data.message} onValueChange={(v) => updateField('message', v)} style={{ paddingBottom: '30px' }} />
              <span className={`input-inner-counter ${(data.message || '').length > 300 ? 'limit-reached' : ''}`}>{(data.message || '').length} / 300</span>
            </div>
            <div className="input-recommendation"><Info size={12} style={{ marginRight: '4px' }} />Keeping it brief ensures a smooth scanning experience! ✨</div>
          </div>
        </>
      );

    case QR_TYPES.YOUTUBE:
      return (
        <div className="form-group">
          <label className="form-label">YouTube Video Link</label>
          <AndroidInput className="form-input" type="url" placeholder="https://youtube.com/watch?v=..." defaultValue={data.url} onValueChange={(v) => updateField('url', v)} />
        </div>
      );

    case QR_TYPES.INSTAGRAM:
    case QR_TYPES.FACEBOOK:
    case QR_TYPES.X:
    case QR_TYPES.LINKEDIN:
      return (
        <div className="form-group">
          <label className="form-label" style={{ textTransform: 'capitalize' }}>{type} Username</label>
          <AndroidInput
            className="form-input"
            placeholder={type === 'instagram' ? '@username' : 'username'}
            defaultValue={data.username}
            onValueChange={(v) => updateField('username', v)}
          />
        </div>
      );

        }
      })()}
    </div>
  );
}
