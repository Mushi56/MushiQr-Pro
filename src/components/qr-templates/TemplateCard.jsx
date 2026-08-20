// src/components/qr-templates/TemplateCard.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { drawTemplateBackground, drawVCardTemplate } from './TemplateRenderer';
import { generateQRMatrix, renderQR } from '../../utils/qrEngine';

const isVCard = (t) => t?.styleFamily === 'vcard';

// Reusable shared static demo matrix for ultra-fast thumbnail generation without recomputing
const DEMO_MATRIX = generateQRMatrix('https://mushiqr.pro', 'M');

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

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const activeMatrix = DEMO_MATRIX;

    if (isVCard(template)) {
      // ── vCard 16:9 thumbnail ─────────────────────────────────────────────
      const W = 525;
      const H = 300;
      canvas.width  = W;
      canvas.height = H;

      const coords = drawVCardTemplate(ctx, W, H, template, {
        name:    'Your Name',
        jobTitle: 'Job Title, Company',
        phone:   '+60 12-345 6789',
        email:   'you@example.com',
        address: '123 Business Street, Your City'
      });

      if (coords && activeMatrix) {
        const qrTempCanvas = document.createElement('canvas');
        qrTempCanvas.width  = 160;
        qrTempCanvas.height = 160;
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

      if (coords && activeMatrix) {
        const qrTempCanvas = document.createElement('canvas');
        qrTempCanvas.width  = 160;
        qrTempCanvas.height = 160;
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
    }
  }, [template, headlineText, handleText]);

  const vcardCard = isVCard(template);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      style={{
        position:        'relative',
        borderRadius:    '18px',
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
        background:     'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius:   '10px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        color:          '#FFFFFF',
        fontSize:       '10px',
        fontWeight:     700,
        letterSpacing:  '0.3px',
        pointerEvents:  'none',
        opacity:        isHovered || isSelected ? 1 : 0,
        transform:      isHovered || isSelected ? 'translateY(0)' : 'translateY(6px)',
        transition:     'opacity 0.2s ease, transform 0.2s ease'
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {template.name}
        </span>
        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
          {template.category.split(' ')[0]}
        </span>
      </div>

      {/* Beautiful Favorite Heart Button (Top-Left Position) */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(template.id);
          }}
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
