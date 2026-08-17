import { useState, useEffect, useRef, useCallback } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';
import { FeatureAccessManager } from '../services/FeatureAccessManager';
import PaidCrownBadge from './PaidCrownBadge';
import { usePremium } from '../services/premiumContext';

const LOGO_PRESETS = [
  { slug: 'custom-icon', name: 'Custom Icon', color: '#D60036', url: '/presets/Icon.avif' },
  { slug: 'facebook', name: 'Facebook', color: '#1877F2', url: '/presets/facebook.avif' },
  { slug: 'whatsapp', name: 'WhatsApp', color: '#25D366', url: '/presets/whatsapp.avif' },
  { slug: 'instagram', name: 'Instagram', color: '#E4405F', url: '/presets/instagram.avif' },
  { slug: 'youtube', name: 'YouTube', color: '#FF0000', url: '/presets/youtube.avif' },
  { slug: 'tiktok', name: 'TikTok', color: '#000000', url: '/presets/tiktok.avif' },
  { slug: 'linkedin', name: 'LinkedIn', color: '#0A66C2', url: '/presets/linkedin.avif' },
  { slug: 'twitter', name: 'Twitter', color: '#1DA1F2', url: '/presets/twitter.avif' },
  { slug: 'gmail', name: 'Gmail', color: '#EA4335', url: '/presets/gmail.avif' },
  { slug: 'github', name: 'GitHub', color: '#24292F', url: '/presets/github.avif' },
  { slug: 'spotify', name: 'Spotify', color: '#1DB954', url: '/presets/spotify.avif' },
  { slug: 'apple', name: 'Apple', color: '#A2AAAD', url: '/presets/apple.avif' },
  { slug: 'picsart', name: 'Picsart', color: '#00C5FF', url: '/presets/Picsart_26-07-18_11-14-07-816.avif' },
  { slug: 'messenger', name: 'Messenger', color: '#0084FF', url: '/presets/messenger.avif' },
  { slug: 'pinterest', name: 'Pinterest', color: '#BD081C', url: '/presets/pinterest.avif' },
  { slug: 'reddit', name: 'Reddit', color: '#FF4500', url: '/presets/reddit.avif' },
  { slug: 'internet', name: 'Internet', color: '#00BCD4', url: '/presets/internet.avif' },
  { slug: 'wifi', name: 'WiFi', color: '#2196F3', url: '/presets/wifi.avif' },
  { slug: 'id-card', name: 'ID Card', color: '#FF9800', url: '/presets/id-card.avif' },
  { slug: 'sms', name: 'SMS', color: '#4CAF50', url: '/presets/sms.avif' },
  { slug: 'pdf', name: 'PDF', color: '#F44336', url: '/presets/pdf.avif' },
  { slug: 'bitcoin', name: 'Bitcoin', color: '#F7931A', url: '/presets/bitcoin.avif' },
  { slug: 'chatting', name: 'Chatting', color: '#4CAF50', url: '/presets/chatting.avif' },
  { slug: 'dribbble', name: 'Dribbble', color: '#EA4C89', url: '/presets/dribbble.avif' },
  { slug: 'behance', name: 'Behance', color: '#1769FF', url: '/presets/behance.avif' },
  { slug: 'whatsapp-1', name: 'WhatsApp Alt', color: '#25D366', url: '/presets/whatsapp (1).avif' },
  { slug: 'gmail-1', name: 'Gmail Alt', color: '#EA4335', url: '/presets/gmail (1).avif' },
  { slug: 'messenger-1', name: 'Messenger Alt', color: '#0084FF', url: '/presets/messenger (1).avif' },
  { slug: 'wifi-1', name: 'WiFi Alt', color: '#2196F3', url: '/presets/wifi (1).avif' },
  { slug: 'youtube-1', name: 'YouTube Alt', color: '#FF0000', url: '/presets/youtube (1).avif' },
  { slug: 'google-calendar', name: 'Calendar', color: '#4285F4', url: '/presets/google-calendar.avif' },
  { slug: 'google-maps', name: 'Maps', color: '#34A853', url: '/presets/google-maps.avif' },
  { slug: 'google-play', name: 'Google Play', color: '#4285F4', url: '/presets/google-play.avif' },
  { slug: 'internet-connection', name: 'Internet Conn', color: '#2196F3', url: '/presets/internet-connection.avif' },
  { slug: 'january', name: 'January', color: '#E91E63', url: '/presets/january.avif' },
  { slug: 'picture', name: 'Picture', color: '#9C27B0', url: '/presets/picture.avif' },
  { slug: 'skype', name: 'Skype', color: '#00AFF0', url: '/presets/skype.avif' },
  { slug: 'social', name: 'Social', color: '#3F51B5', url: '/presets/social.avif' },
  { slug: 'tik-tok', name: 'TikTok Alt', color: '#000000', url: '/presets/tik-tok.avif' },
  { slug: 'viber', name: 'Viber', color: '#7360F2', url: '/presets/viber.avif' },
  { slug: 'vimeo', name: 'Vimeo', color: '#1AB7EA', url: '/presets/vimeo.avif' }
];

export default function LogoPresets({ logo, onLogoChange, onLogoRemove }) {
  const [loading, setLoading] = useState(null);
  const [, setTick] = useState(0);
  const inputRef = useRef(null);
  const { showPaywall } = usePremium();

  useEffect(() => {
    const unsub = FeatureAccessManager.subscribe(() => setTick(t => t + 1));
    return () => unsub?.();
  }, []);

  const handleUploadClick = () => {
    if (logo && !LOGO_PRESETS.some(p => p.url === logo.src)) {
      onLogoRemove();
      return;
    }
    const access = FeatureAccessManager.canUseFeature('custom_logo_upload');
    if (!access.allowed) {
      showPaywall('custom_logo_upload');
      return;
    }
    inputRef.current?.click();
  };

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const access = FeatureAccessManager.canUseFeature('custom_logo_upload');
    if (!access.allowed) {
      showPaywall('custom_logo_upload');
      return;
    }
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
  }, [onLogoChange, showPaywall]);

  const handleSelect = (slug, name, url) => {
    const featId = `qr_logo_${slug}`;
    const access = FeatureAccessManager.canUseFeature(featId);
    if (!access.allowed) {
      showPaywall(featId);
      return;
    }
    setLoading(slug);
    const img = new Image();
    img.onload = () => {
      onLogoChange({
        image: img,
        name,
        slug,
        src: url,
      });
      setLoading(null);
    };
    img.onerror = () => {
      setLoading(null);
    };
    img.src = url;
  };

  const visibleLogoPresets = LOGO_PRESETS.filter(p => {
    return FeatureAccessManager.isFeatureEnabled(`qr_logo_${p.slug}`);
  });

  return (
    <div className="logo-presets-container">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
          e.target.value = '';
        }}
        hidden
      />
      <div className="logo-presets-grid">
        {/* Upload Tile */}
        {FeatureAccessManager.isFeatureEnabled('custom_logo_upload') && (
          <button
            className={`logo-preset-btn upload-tile ${logo && !LOGO_PRESETS.some(p => p.url === logo.src) ? 'active' : ''}`}
            onClick={handleUploadClick}
            title="Upload Custom Logo"
            style={{ background: 'var(--bg-elevated)', border: '2px dashed var(--border-light)', position: 'relative' }}
          >
            <PaidCrownBadge featureId="custom_logo_upload" position="corner" size={9} />
            {logo && !LOGO_PRESETS.some(p => p.url === logo.src) ? (
              <div className="logo-preset-icon" style={{ position: 'relative' }}>
                <img src={logo.src} alt="Custom" style={{ opacity: 0.5 }} />
                <X size={16} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--error)' }} />
              </div>
            ) : (
              <UploadCloud size={24} color="var(--accent-primary)" />
            )}
          </button>
        )}

        {visibleLogoPresets.map((p) => (
          <button
            key={p.slug}
            className={`logo-preset-btn ${loading === p.slug ? 'loading' : ''} ${logo?.src === p.url ? 'active' : ''}`}
            onClick={() => logo?.src === p.url ? onLogoRemove() : handleSelect(p.slug, p.name, p.url)}
            title={p.name}
            style={{ '--brand-color': p.color, position: 'relative' }}
          >
            <PaidCrownBadge featureId={`qr_logo_${p.slug}`} fallbackFeatureId="custom_logo_presets" position="corner" size={9} />
            <div className="logo-preset-icon" style={{ position: 'relative' }}>
              <img 
                src={p.url} 
                alt={p.name} 
                loading="lazy" 
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
