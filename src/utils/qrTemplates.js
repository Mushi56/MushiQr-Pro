// ─── QR Code Vector Templates ───────────────────────────────────────────────

export const QR_TEMPLATES = [];

// ─── Cloud/Custom Templates Integration ─────────────────────────────────────
// Reads custom templates saved by the Super Admin Panel and converts them
// into proper app-usable template objects (with drawBackground functions).

function _buildDrawBackground(tpl) {
  return function(ctx, size) {
    const cr = Math.min(tpl.cornerRadius || 0, size / 2);
    if (tpl.bgType === 'transparent') return;

    if (tpl.bgType === 'gradient') {
      let g;
      const c1 = tpl.bgColor1 || '#1a1a2e';
      const c2 = tpl.bgColor2 || '#e94560';
      const dir = tpl.gradientDir || 'diagonal';
      if (dir === 'radial') g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
      else if (dir === 'horizontal') g = ctx.createLinearGradient(0,0,size,0);
      else if (dir === 'vertical') g = ctx.createLinearGradient(0,0,0,size);
      else g = ctx.createLinearGradient(0,0,size,size);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = tpl.bgColor1 || '#ffffff';
    }

    if (cr > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, cr);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }
  };
}

/**
 * Returns all custom templates created in the Admin Panel, converted
 * to the same format as QR_TEMPLATES (with drawBackground/drawForeground).
 */
export function getUserTemplates() {
  try {
    const raw = localStorage.getItem('qrgen_cloud_templates');
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.map(tpl => ({
      id: tpl.id,
      name: tpl.name,
      category: tpl.category || 'Custom',
      qrSize: tpl.qrSize || 0.5,
      qrX: tpl.qrX || 0.5,
      qrY: tpl.qrY || 0.5,
      isCustom: true,
      preset: {
        qrColor:      tpl.preset?.qrColor      || '#ffffff',
        bgColor:      tpl.preset?.bgColor       || '#000000',
        bgTransparent:tpl.preset?.bgTransparent || false,
        eyeColor:     tpl.preset?.eyeColor      || tpl.preset?.qrColor || '#ffffff',
        eyeOuterColor:tpl.preset?.eyeOuterColor || tpl.preset?.qrColor || '#ffffff',
        dotStyle:     tpl.preset?.dotStyle      || 'square',
        eyeStyle:     tpl.preset?.eyeStyle      || 'square',
      },
      drawBackground: _buildDrawBackground(tpl),
      drawForeground: () => {},
    }));
  } catch {
    return [];
  }
}

/**
 * Returns all templates: built-in + admin-created custom templates.
 */
export function getAllTemplates() {
  return [...QR_TEMPLATES, ...getUserTemplates()];
}

