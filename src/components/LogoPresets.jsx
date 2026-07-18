import { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';

const LOGO_PRESETS = [
  { slug: 'picsart', name: 'Picsart', color: '#00C5FF', url: '/presets/Picsart_26-07-18_11-14-07-816.png' },
  { slug: 'apple', name: 'Apple', color: '#A2AAAD', url: '/presets/apple.png' },
  { slug: 'behance', name: 'Behance', color: '#1769FF', url: '/presets/behance.png' },
  { slug: 'bitcoin', name: 'Bitcoin', color: '#F7931A', url: '/presets/bitcoin.png' },
  { slug: 'chatting', name: 'Chatting', color: '#4CAF50', url: '/presets/chatting.png' },
  { slug: 'dribbble', name: 'Dribbble', color: '#EA4C89', url: '/presets/dribbble.png' },
  { slug: 'facebook', name: 'Facebook', color: '#1877F2', url: '/presets/facebook.png' },
  { slug: 'github', name: 'GitHub', color: '#24292F', url: '/presets/github.png' },
  { slug: 'gmail-1', name: 'Gmail Alt', color: '#EA4335', url: '/presets/gmail (1).png' },
  { slug: 'gmail', name: 'Gmail', color: '#EA4335', url: '/presets/gmail.png' },
  { slug: 'google-calendar', name: 'Calendar', color: '#4285F4', url: '/presets/google-calendar.png' },
  { slug: 'google-maps', name: 'Maps', color: '#34A853', url: '/presets/google-maps.png' },
  { slug: 'google-play', name: 'Google Play', color: '#4285F4', url: '/presets/google-play.png' },
  { slug: 'id-card', name: 'ID Card', color: '#FF9800', url: '/presets/id-card.png' },
  { slug: 'instagram', name: 'Instagram', color: '#E4405F', url: '/presets/instagram.png' },
  { slug: 'internet-connection', name: 'Internet Conn', color: '#2196F3', url: '/presets/internet-connection.png' },
  { slug: 'internet', name: 'Internet', color: '#00BCD4', url: '/presets/internet.png' },
  { slug: 'january', name: 'January', color: '#E91E63', url: '/presets/january.png' },
  { slug: 'linkedin', name: 'LinkedIn', color: '#0A66C2', url: '/presets/linkedin.png' },
  { slug: 'messenger-1', name: 'Messenger Alt', color: '#0084FF', url: '/presets/messenger (1).png' },
  { slug: 'messenger', name: 'Messenger', color: '#0084FF', url: '/presets/messenger.png' },
  { slug: 'pdf', name: 'PDF', color: '#F44336', url: '/presets/pdf.png' },
  { slug: 'picture', name: 'Picture', color: '#9C27B0', url: '/presets/picture.png' },
  { slug: 'pinterest', name: 'Pinterest', color: '#BD081C', url: '/presets/pinterest.png' },
  { slug: 'reddit', name: 'Reddit', color: '#FF4500', url: '/presets/reddit.png' },
  { slug: 'skype', name: 'Skype', color: '#00AFF0', url: '/presets/skype.png' },
  { slug: 'sms', name: 'SMS', color: '#4CAF50', url: '/presets/sms.png' },
  { slug: 'social', name: 'Social', color: '#3F51B5', url: '/presets/social.png' },
  { slug: 'spotify', name: 'Spotify', color: '#1DB954', url: '/presets/spotify.png' },
  { slug: 'tik-tok', name: 'TikTok Alt', color: '#000000', url: '/presets/tik-tok.png' },
  { slug: 'tiktok', name: 'TikTok', color: '#000000', url: '/presets/tiktok.png' },
  { slug: 'twitter', name: 'Twitter', color: '#1DA1F2', url: '/presets/twitter.png' },
  { slug: 'viber', name: 'Viber', color: '#7360F2', url: '/presets/viber.png' },
  { slug: 'vimeo', name: 'Vimeo', color: '#1AB7EA', url: '/presets/vimeo.png' },
  { slug: 'whatsapp-1', name: 'WhatsApp Alt', color: '#25D366', url: '/presets/whatsapp (1).png' },
  { slug: 'whatsapp', name: 'WhatsApp', color: '#25D366', url: '/presets/whatsapp.png' },
  { slug: 'wifi-1', name: 'WiFi Alt', color: '#2196F3', url: '/presets/wifi (1).png' },
  { slug: 'wifi', name: 'WiFi', color: '#2196F3', url: '/presets/wifi.png' },
  { slug: 'youtube-1', name: 'YouTube Alt', color: '#FF0000', url: '/presets/youtube (1).png' },
  { slug: 'youtube', name: 'YouTube', color: '#FF0000', url: '/presets/youtube.png' }
];

export default function LogoPresets({ logo, onLogoChange, onLogoRemove }) {
  const [loading, setLoading] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onLogoChange({
          image: img,
          name: file.name,
          size: file.size,
          src: e.target.result,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [onLogoChange]);

  const handleSelect = (slug, name, url) => {
    setLoading(slug);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      onLogoChange({
        image: img,
        name: name,
        size: 0,
        src: url,
      });
      setLoading(null);
    };
    img.onerror = () => {
      console.error(`Failed to load logo: ${name}`);
      setLoading(null);
    };
    img.src = url;
  };

  return (
    <div className="logo-presets-container">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        hidden
      />
      <div className="logo-presets-grid">
        {/* Upload Tile */}
        <button
          className={`logo-preset-btn upload-tile ${logo && !LOGO_PRESETS.some(p => p.url === logo.src) ? 'active' : ''}`}
          onClick={() => logo && !LOGO_PRESETS.some(p => p.url === logo.src) ? onLogoRemove() : inputRef.current?.click()}
          title="Upload Custom Logo"
          style={{ background: 'var(--bg-elevated)', border: '2px dashed var(--border-light)' }}
        >
          {logo && !LOGO_PRESETS.some(p => p.url === logo.src) ? (
            <div className="logo-preset-icon" style={{ position: 'relative' }}>
              <img src={logo.src} alt="Custom" style={{ opacity: 0.5 }} />
              <X size={16} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--error)' }} />
            </div>
          ) : (
            <UploadCloud size={24} color="var(--accent-primary)" />
          )}
        </button>

        {LOGO_PRESETS.map((p) => (
          <button
            key={p.slug}
            className={`logo-preset-btn ${loading === p.slug ? 'loading' : ''} ${logo?.src === p.url ? 'active' : ''}`}
            onClick={() => logo?.src === p.url ? onLogoRemove() : handleSelect(p.slug, p.name, p.url)}
            title={p.name}
            style={{ '--brand-color': p.color }}
          >
            <div className="logo-preset-icon" style={{ position: 'relative' }}>
              <img 
                src={p.url} 
                alt={p.name} 
                loading="lazy" 
                crossOrigin="anonymous" 
                style={{ opacity: logo?.src === p.url ? 0.3 : 1, transition: 'opacity 0.2s' }} 
              />
              {logo?.src === p.url && (
                <X size={18} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--accent-primary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
