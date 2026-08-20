// src/components/qr-templates/TemplateCard.jsx
import React, { useRef, useEffect } from 'react';
import PaidCrownBadge from '../PaidCrownBadge';
import { drawTemplateBackground, drawVCardTemplate } from './TemplateRenderer';
import { generateQRMatrix, renderQR } from '../../utils/qrEngine';

const isVCard = (t) => t?.styleFamily === 'vcard';

export const TemplateCard = React.memo(function TemplateCard({
  template,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
  headlineText,
  handleText,
  qrMatrixInfo,
  currentQrOptions
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const activeMatrix = qrMatrixInfo || generateQRMatrix('https://mushiqr.pro');

    if (isVCard(template)) {
      // ── vCard 16:9 thumbnail ─────────────────────────────────────────────
      // We render at 630×360 (exactly 1.75× scale of the 360px display width)
      const W = 630;
      const H = 360;
      canvas.width  = W;
      canvas.height = H;

      const coords = drawVCardTemplate(ctx, W, H, template, {
        name:    'Your Name',
        jobTitle: 'Job Title, Company',
        phone:   '+60 12-345 6789',
        email:   'you@example.com',
        address: '123 Business Street, Your City'
      });

      // Draw QR inside the returned white box
      if (coords && activeMatrix) {
        const qrTempCanvas = document.createElement('canvas');
        qrTempCanvas.width  = 256;
        qrTempCanvas.height = 256;
        renderQR(qrTempCanvas, {
          ...activeMatrix,
          size: 256,
          qrColor: template.preset?.qrColor || '#000000',
          bgColor: '#FFFFFF',
          bgTransparent: false,
          dotStyle: template.preset?.dotStyle || 'rounded',
          eyeStyle: template.preset?.eyeStyle || 'rounded',
          quietZone: 1
        });
        ctx.save();
        const margin = coords.qrBoxSize * 0.06;
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
      const w = 320;
      const h = 320;
      canvas.width  = w;
      canvas.height = h;

      drawTemplateBackground(ctx, w, h, template, {
        templateHeadline:   headlineText || template.headline,
        templateHandleText: handleText   || template.subtitle
      });

      ctx.save();
      const qrSize = w * 0.35;
      const qrX    = w * 0.5 - qrSize / 2;
      const qrY    = h * 0.555 - qrSize / 2;

      if (activeMatrix) {
        const qrTempCanvas = document.createElement('canvas');
        qrTempCanvas.width  = 256;
        qrTempCanvas.height = 256;
        renderQR(qrTempCanvas, {
          ...activeMatrix,
          size: 256,
          qrColor: template.preset?.qrColor || '#000000',
          bgColor: '#FFFFFF',
          bgTransparent: false,
          dotStyle: template.preset?.dotStyle || 'rounded',
          eyeStyle: template.preset?.eyeStyle || 'rounded',
          quietZone: 1
        });
        ctx.drawImage(qrTempCanvas, qrX, qrY, qrSize, qrSize);
      }
      ctx.restore();
    }
  }, [template, headlineText, handleText, qrMatrixInfo]);

  const vcardCard = isVCard(template);

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      style={{
        position:        'relative',
        borderRadius:    '20px',
        overflow:        'hidden',
        cursor:          'pointer',
        border:          isSelected ? '2.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
        boxShadow:       isSelected ? '0 8px 24px rgba(255, 42, 85, 0.35)' : '0 4px 14px rgba(0,0,0,0.15)',
        transform:       isSelected ? 'scale(1.02)' : 'scale(1)',
        transition:      'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'var(--bg-elevated)',
        // vCard = 16:9, everything else = 1:1
        aspectRatio:     vcardCard ? '7 / 4' : '1 / 1',
        display:         'flex',
        flexDirection:   'column'
      }}
    >
      <PaidCrownBadge featureId={`qr_template_${template.id}`} position="corner" size={9} />

      <canvas
        ref={canvasRef}
        style={{
          width:      '100%',
          height:     '100%',
          display:    'block',
          objectFit:  'contain'
        }}
      />

      {/* Template Name Overlay Pill */}
      <div style={{
        position:       'absolute',
        bottom:         '8px',
        left:           '8px',
        right:          '8px',
        padding:        '4px 8px',
        background:     'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        borderRadius:   '10px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        color:          '#FFFFFF',
        fontSize:       '10px',
        fontWeight:     700,
        letterSpacing:  '0.3px',
        pointerEvents:  'none'
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {template.name}
        </span>
        <span style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
          {template.category.split(' ')[0]}
        </span>
      </div>

      {/* Favorite Heart Button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(template.id);
          }}
          style={{
            position:       'absolute',
            top:            '8px',
            right:          '8px',
            width:          '26px',
            height:         '26px',
            borderRadius:   '50%',
            background:     'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(6px)',
            border:         'none',
            color:          isFavorite ? '#FF2A55' : 'rgba(255, 255, 255, 0.75)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            fontSize:       '12px'
          }}
          title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      )}
    </div>
  );
});
