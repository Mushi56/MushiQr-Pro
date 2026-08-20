// src/utils/qrTemplates.js
// Universal QR Code Templates with all Follow Me, Social, Brand & vCard Templates

import { ALL_50_TEMPLATES, getTemplateById } from '../data/qrTemplates';
import { drawTemplateBackground, drawVCardTemplate } from '../components/qr-templates/TemplateRenderer';

const VCARD_HEIGHT_RATIO = 600 / 1050; // ≈ 0.5714 — landscape 1050×600

// Convert the structured templates into the App engine's template format
export const QR_TEMPLATES = ALL_50_TEMPLATES.map(tpl => {
  const isVCard = tpl.styleFamily === 'vcard';

  if (isVCard) {
    // ── vCard landscape template ─────────────────────────────────────────────
    // drawBackground calls drawVCardTemplate and stores the returned QR box coords
    // on the template object so qrEngine can position the QR dot matrix correctly.
    const vcardTpl = {
      id:             tpl.id,
      name:           tpl.name,
      category:       tpl.category,
      dimensions:     '1050 x 600 px',
      heightRatio:    VCARD_HEIGHT_RATIO,
      styleFamily:    'vcard',
      // These will be overwritten after drawBackground is called
      qrSize:   0.265,   // qrBoxSize / W — approximate until real render
      qrX:      0.82,    // approximate centre-X of right panel
      qrY:      0.50,    // vertically centred
      defaultHeadline: tpl.headline,
      defaultHandle:   tpl.subtitle,
      headline:  tpl.headline,
      subtitle:  tpl.subtitle,
      background: tpl.background,
      accent:     tpl.accent,
      textColor:  tpl.textColor,
      subColor:   tpl.subColor,
      borderColor: tpl.borderColor,
      isDark:     tpl.isDark,
      svg:        tpl.svg,
      qrType:     tpl.qrType,
      fields:     tpl.fields,
      preset: tpl.preset || {
        qrColor:   '#000000',
        bgColor:   '#FFFFFF',
        dotStyle:  'rounded',
        eyeStyle:  'rounded'
      },
      drawBackground(ctx, W, H, options) {
        const coords = drawVCardTemplate(ctx, W, H, tpl, {
          name:     options?.vcardName     || 'Your Name',
          jobTitle: options?.vcardJobTitle || 'Job Title, Company',
          phone:    options?.vcardPhone    || '',
          email:    options?.vcardEmail    || '',
          address:  options?.vcardAddress  || '',
          url:      options?.vcardUrl      || '',
        });
        // Persist the exact pixel coords so qrEngine can position the QR
        if (coords) {
          this._vcardQrBoxX    = coords.qrBoxX;
          this._vcardQrBoxY    = coords.qrBoxY;
          this._vcardQrBoxSize = coords.qrBoxSize;
          // Update ratio-based helpers for qrEngine fallback
          this.qrSize = coords.qrBoxSize / W;
          this.qrX    = (coords.qrBoxX + coords.qrBoxSize / 2) / W;
          this.qrY    = (coords.qrBoxY + coords.qrBoxSize / 2) / H;
        }
      },
      drawForeground: () => {}
    };
    return vcardTpl;
  }

  // ── Standard square template ─────────────────────────────────────────────
  return {
    id:             tpl.id,
    name:           tpl.name,
    category:       tpl.category,
    dimensions:     '1080 x 1080 px',
    heightRatio:    1.0,
    qrSize: 0.35,
    qrX:    0.50,
    qrY:    0.555,
    defaultHeadline: tpl.headline,
    defaultHandle:   tpl.subtitle,
    headline:  tpl.headline,
    subtitle:  tpl.subtitle,
    background: tpl.background,
    svg:        tpl.svg,
    isDarkHeadline: tpl.isDarkHeadline,
    isDarkQrFrame:  tpl.isDarkQrFrame,
    isDarkUser:     tpl.isDarkUser,
    styleFamily: tpl.styleFamily,
    bgShapes:    tpl.bgShapes,
    qrType:      tpl.qrType,
    fields:      tpl.fields,
    preset: tpl.preset || {
      qrColor:   '#000000',
      bgColor:   '#FFFFFF',
      dotStyle:  'rounded',
      eyeStyle:  'rounded'
    },
    drawBackground(ctx, w, h, options = {}) {
      drawTemplateBackground(ctx, w, h, tpl, options);
    },
    drawForeground: () => {}
  };
});


// ─── Cloud/Custom Templates Integration ─────────────────────────────────────
export function getUserTemplates() {
  try {
    const raw = localStorage.getItem('qrgen_cloud_templates');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return list.map(tpl => ({
      id: tpl.id,
      name: tpl.name,
      category: tpl.category || 'Custom',
      qrSize: tpl.qrSize || 0.5,
      qrX: tpl.qrX || 0.5,
      qrY: tpl.qrY || 0.5,
      isCustom: true,
      preset: {
        qrColor:       tpl.preset?.qrColor       || '#ffffff',
        bgColor:       tpl.preset?.bgColor        || '#000000',
        bgTransparent: tpl.preset?.bgTransparent  || false,
        eyeColor:      tpl.preset?.eyeColor       || tpl.preset?.qrColor || '#ffffff',
        eyeOuterColor: tpl.preset?.eyeOuterColor  || tpl.preset?.qrColor || '#ffffff',
        dotStyle:      tpl.preset?.dotStyle       || 'square',
        eyeStyle:      tpl.preset?.eyeStyle       || 'square',
      },
      drawBackground: (ctx, w, h) => {
        h = h || w;
        ctx.fillStyle = tpl.preset?.bgColor || '#1E293B';
        ctx.fillRect(0, 0, w, h);
      },
      drawForeground: () => {},
    }));
  } catch {
    return [];
  }
}

export function getAllTemplates() {
  return [...QR_TEMPLATES, ...getUserTemplates()];
}
