import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { drawTemplateBackground, drawVCardTemplate, drawFrameTemplate } from './TemplateRenderer';
import { generateQRMatrix, renderQR } from '../../utils/qrEngine';
import { getTemplateStylingPreset } from '../../data/qrTemplates/templateStylingConfig';
import { LOGO_PRESETS } from '../../data/logoPresets';

const isVCard = (t) => t?.styleFamily === 'vcard';
const isFrame = (t) => t?.styleFamily === 'frame';

// Reusable shared static demo matrix for ultra-fast thumbnail generation without recomputing
const DEMO_MATRIX = generateQRMatrix('https://mushiqr.pro', 'M');

// Shared single offscreen thumbnail canvas to prevent DOM garbage collection overhead
let _qrThumbCanvas = null;
function getSharedThumbCanvas() {
  if (typeof document === 'undefined') return null;
  if (!_qrThumbCanvas) {
    _qrThumbCanvas = document.createElement('canvas');
    _qrThumbCanvas.width = 160;
    _qrThumbCanvas.height = 160;
  }
  return _qrThumbCanvas;
}

export const TemplateCard = React.memo(function TemplateCard({
  template,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
  headlineText,
  handleText
}) {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    const handleLoaded = () => setRenderTick(t => t + 1);
    window.addEventListener('qr-template-loaded', handleLoaded);
    return () => window.removeEventListener('qr-template-loaded', handleLoaded);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const qrTempCanvas = getSharedThumbCanvas();

    const activeMatrix = DEMO_MATRIX;

    if (isVCard(template)) {
      // ── vCard 16:9 thumbnail ─────────────────────────────────────────────
      const W = 525;
      const H = 300;
      canvas.width  = W;
      canvas.height = H;

      const coords = drawVCardTemplate(ctx, W, H, template, {
        name:     'Your Name',
        jobTitle: 'Job Title, Company',
        phone:    '+60 12-345 6789',
        email:    'you@example.com',
        address:  '123 Business Street, Your City',
        url:      'https://example.com'
      });

      if (coords && activeMatrix && qrTempCanvas) {
        renderQR(qrTempCanvas, {
          ...activeMatrix,
          size: 160,
          qrColor: template.preset?.qrColor || '#000000',
          bgColor: 'transparent',
          bgTransparent: true,
          dotStyle: template.preset?.dotStyle || 'rounded',
          eyeStyle: template.preset?.eyeStyle || 'rounded',
          quietZone: 0
        });
        ctx.save();
        const margin = coords.qrBoxSize * 0.08;
        ctx.drawImage(
          qrTempCanvas,
          coords.qrBoxX + margin,
          coords.qrBoxY + margin,
          coords.qrBoxSize - margin * 2,
          coords.qrBoxSize - margin * 2
        );
        ctx.restore();
      }
    } else if (isFrame(template)) {
      // ── Scan Me Frame thumbnail ───────────────────────────────────────────
      const w = 260;
      const h = 260;
      canvas.width  = w;
      canvas.height = h;

      const coords = drawFrameTemplate(ctx, w, h, template, {
        templateHeadline: headlineText || template.labelText
      });

      if (coords && activeMatrix && qrTempCanvas) {
        renderQR(qrTempCanvas, {
          ...activeMatrix,
          size: 160,
          qrColor: template.preset?.qrColor || template.accent || '#000000',
          bgColor: 'transparent',
          bgTransparent: true,
          dotStyle: template.preset?.dotStyle || 'rounded',
          eyeStyle: template.preset?.eyeStyle || 'rounded',
          quietZone: 0
        });
        ctx.save();
        const margin = coords.qrBoxSize * 0.08;
        ctx.drawImage(
          qrTempCanvas,
          coords.qrBoxX + margin,
          coords.qrBoxY + margin,
          coords.qrBoxSize - margin * 2,
          coords.qrBoxSize - margin * 2
        );
        ctx.restore();
      }
    } else {
      // ── Standard square thumbnail ────────────────────────────────────────
      const w = 260;
      const h = 260;
      canvas.width  = w;
      canvas.height = h;

      const coords = drawTemplateBackground(ctx, w, h, template, {
        templateHeadline:   headlineText || template.headline,
        templateHandleText: handleText   || template.subtitle
      });

      const stylePreset = getTemplateStylingPreset(template) || template.preset;

      if (coords && activeMatrix && qrTempCanvas) {
        let logoImageObj = null;
        if (stylePreset?.logo) {
          const foundLogo = LOGO_PRESETS.find(p => p.slug === stylePreset.logo);
          if (foundLogo) {
            const lImg = new Image();
            lImg.src = foundLogo.url;
            if (lImg.complete && lImg.naturalWidth !== 0) {
              logoImageObj = lImg;
            }
          }
        }

        renderQR(qrTempCanvas, {
          ...activeMatrix,
          size: 160,
          qrColor: stylePreset?.qrColor || '#1877F2',
          bgColor: 'transparent',
          bgTransparent: true,
          dotStyle: stylePreset?.dotStyle || 'fluid',
          eyeStyle: stylePreset?.eyeStyle || 'rounded',
          eyeColor: stylePreset?.eyeColor || stylePreset?.qrColor || '#1877F2',
          eyeOuterColor: stylePreset?.eyeOuterColor || stylePreset?.qrColor || '#1877F2',
          syncEyes: true,
          logoImage: logoImageObj,
          logoWidth: 0.20,
          logoHeight: 0.20,
          logoBackground: Boolean(stylePreset?.logoBgColor),
          logoBgColor: stylePreset?.logoBgColor || '#FFFFFF',
          logoBgShape: stylePreset?.logoBgShape || 'rounded',
          logoPadding: 6,
          quietZone: 0
        });
        ctx.save();
        const margin = coords.qrBoxSize * 0.08;
        ctx.drawImage(
          qrTempCanvas,
          coords.qrBoxX + margin,
          coords.qrBoxY + margin,
          coords.qrBoxSize - margin * 2,
          coords.qrBoxSize - margin * 2
        );
        ctx.restore();
      }
    }
  }, [template, headlineText, handleText, renderTick]);

  const vcardCard = isVCard(template);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (onSelect) onSelect(template);
  }, [onSelect, template]);

  const handleFavClick = useCallback((e) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(template.id);
  }, [onToggleFavorite, template.id]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      style={{
        position:        'relative',
        borderRadius:    '4px',
        overflow:        'hidden',
        cursor:          'pointer',
        border:          isSelected ? '2.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
        boxShadow:       isSelected ? '0 6px 20px rgba(255, 42, 85, 0.35)' : '0 2px 10px rgba(0,0,0,0.1)',
        transform:       isHovered ? 'translateY(-2px)' : (isSelected ? 'scale(1.02)' : 'scale(1)'),
        transition:      'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'var(--bg-elevated)',
        aspectRatio:     vcardCard ? '7 / 4' : '1 / 1',
        display:         'flex',
        flexDirection:   'column'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width:      '100%',
          height:     '100%',
          display:    'block',
          objectFit:  'contain'
        }}
      />

      {/* Template Name Overlay — Appears on Hover */}
      <div style={{
        position:       'absolute',
        bottom:         '6px',
        left:           '6px',
        right:          '6px',
        padding:        '5px 8px',
        background:     'var(--bg-elevated, rgba(255, 255, 255, 0.92))',
        border:         '1px solid var(--border-color, rgba(0, 0, 0, 0.12))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius:   '4px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          'var(--text-primary, #1e293b)',
        fontSize:       '10px',
        fontWeight:     700,
        letterSpacing:  '0.3px',
        boxShadow:      '0 2px 8px rgba(0, 0, 0, 0.12)',
        pointerEvents:  'none',
        opacity:        isHovered || isSelected ? 1 : 0,
        transform:      isHovered || isSelected ? 'translateY(0)' : 'translateY(6px)',
        transition:     'opacity 0.2s ease, transform 0.2s ease'
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
          {template.name}
        </span>
      </div>

      {/* Favorite Heart Button (Top-Left Position) */}
      {onToggleFavorite && (
        <button
          onClick={handleFavClick}
          style={{
            position:       'absolute',
            top:            '8px',
            left:           '8px',
            zIndex:         25,
            width:          '28px',
            height:         '28px',
            borderRadius:   '50%',
            background:     isFavorite ? 'rgba(255, 42, 85, 0.95)' : 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border:         isFavorite ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.18)',
            color:          '#FFFFFF',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            boxShadow:      isFavorite ? '0 2px 12px rgba(255, 42, 85, 0.55)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
            transition:     'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart 
            size={13} 
            color="#FFFFFF" 
            fill={isFavorite ? '#FFFFFF' : 'none'} 
            strokeWidth={2.2} 
          />
        </button>
      )}
    </div>
  );
});
