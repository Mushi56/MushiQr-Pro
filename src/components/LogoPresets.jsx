import { useState, useEffect, useRef, useCallback } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';
import { FeatureAccessManager } from '../services/FeatureAccessManager';
import PaidCrownBadge from './PaidCrownBadge';
import { usePremium } from '../services/premiumContext';
import { LOGO_PRESETS } from '../data/logoPresets';

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
