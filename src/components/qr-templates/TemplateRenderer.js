// src/components/qr-templates/TemplateRenderer.js
// Universal Canvas 2D Renderer for all Follow Me, Social & Brand Pro Templates
// Features tailored brand typography matching each platform's distinct identity,
// unified glassy containers, reserved top icon slots, and balanced vertical layout.

const svgImageCache = {};

function getSvgImage(svgString) {
  if (!svgString) return null;
  if (svgImageCache[svgString]) {
    return svgImageCache[svgString];
  }
  const img = new Image();
  const encoded = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  img.src = encoded;
  img.onload = () => {
    window.dispatchEvent(new CustomEvent('qr-template-loaded'));
  };
  svgImageCache[svgString] = img;
  return img;
}

/**
 * Returns tailored brand typography font-family and weights for each template/platform
 */
export function getBrandTypography(templateId, category) {
  const id = (templateId || '').toLowerCase().replace('brand-', '');

  // 1. Tech, Modern & Minimalist (Google, Threads, X, GitHub, Discord, Drive) -> Inter / System Bold
  if (['google', 'threads', 'x', 'twitter', 'github', 'discord', 'drive', 'google-drive', 'reddit'].includes(id)) {
    return {
      headlineFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      headlineWeight: '800',
      handleFont: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      handleWeight: '600'
    };
  }

  // 2. High Impact, Bold & Media (YouTube, TikTok, Twitch, Spotify, Soundcloud, Podcast) -> Montserrat / Oswald
  if (['youtube', 'tiktok', 'twitch', 'spotify', 'soundcloud', 'podcast', 'event', 'ticket'].includes(id)) {
    return {
      headlineFont: "'Montserrat', 'Outfit', sans-serif",
      headlineWeight: '900',
      handleFont: "'Montserrat', sans-serif",
      handleWeight: '700'
    };
  }

  // 3. Social, Lifestyle & Visual (Instagram, Snapchat, Pinterest, Behance, Dribbble) -> Outfit / Montserrat
  if (['instagram', 'snapchat', 'pinterest', 'behance', 'dribbble', 'portfolio'].includes(id)) {
    return {
      headlineFont: "'Outfit', 'Montserrat', sans-serif",
      headlineWeight: '800',
      handleFont: "'Outfit', 'Inter', sans-serif",
      handleWeight: '600'
    };
  }

  // 4. Dining, Hospitality & Luxury (Menu, Restaurant, Food, Wine, Booking) -> Playfair Display / Montserrat
  if (['menu', 'digital-menu', 'restaurant', 'food', 'wine', 'bar', 'booking', 'hotel'].includes(id)) {
    return {
      headlineFont: "'Playfair Display', 'Georgia', serif",
      headlineWeight: '700',
      handleFont: "'Montserrat', 'Inter', sans-serif",
      handleWeight: '600'
    };
  }

  // 5. Casual, Fun, Creative & Retail (Review, Feedback, Discount, Coupon, Sale, Promo, Loyalty, Tip) -> Bebas Neue / Montserrat
  if (['review', 'feedback', 'discount', 'coupon', 'sale', 'promo', 'loyalty', 'tip', 'tip-jar', 'donation'].includes(id)) {
    return {
      headlineFont: "'Bebas Neue', 'Oswald', sans-serif",
      headlineWeight: '700',
      handleFont: "'Montserrat', 'Inter', sans-serif",
      handleWeight: '700'
    };
  }

  // 6. Corporate, Business & Communication (LinkedIn, WhatsApp, Telegram, Skype, Message, Email, Call, SMS, Contact, vCard, Wifi)
  if (['linkedin', 'whatsapp', 'telegram', 'skype', 'message', 'email', 'call', 'sms', 'contact', 'vcard', 'wifi', 'website', 'app-store', 'play-store'].includes(id)) {
    return {
      headlineFont: "'Outfit', 'Inter', sans-serif",
      headlineWeight: '800',
      handleFont: "'Inter', sans-serif",
      handleWeight: '600'
    };
  }

  // Default clean modern font
  return {
    headlineFont: "'Outfit', 'Inter', sans-serif",
    headlineWeight: '800',
    handleFont: "'Inter', sans-serif",
    handleWeight: '600'
  };
}

function parseLinearGradient(ctx, bgString, w, h) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  const colorStopRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s+([0-9.]+)%/g;
  let match;
  let hasStops = false;
  while ((match = colorStopRegex.exec(bgString)) !== null) {
    hasStops = true;
    const color = match[1];
    const stop = parseFloat(match[2]) / 100;
    try {
      grad.addColorStop(Math.min(1, Math.max(0, stop)), color);
    } catch (e) {}
  }
  if (!hasStops) {
    grad.addColorStop(0, '#111827');
    grad.addColorStop(1, '#000000');
  }
  return grad;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
}

/**
 * Draws background decorative SVG shapes (from brand style 5 templates)
 */
function drawBgShapes(ctx, w, h, bgShapesSvg) {
  if (!bgShapesSvg) return;
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">${bgShapesSvg}</svg>`;
  const img = getSvgImage(fullSvg);
  if (img && img.complete && img.naturalWidth !== 0) {
    ctx.save();
    ctx.filter = `blur(${Math.round(w * 0.008)}px)`;
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
  }
}

/**
 * Universal Canvas 2D Renderer for all templates
 * - Card Inset: 5.33% (16px / 300px)
 * - Top Icon Slot: 11.5% Y center
 * - Headline Center: 24.5% Y center with brand-tailored typography & glassy container
 * - QR Box Center: 55.5% Y center
 * - Bottom Handle Center: 89.5% Y center with brand-tailored typography
 */
export function drawTemplateBackground(ctx, w, h, template, options = {}) {
  ctx.save();

  const isBrandStyle = template.styleFamily === 'brand' || Boolean(template.bgShapes);
  const typography = getBrandTypography(template.id, template.category);

  // 1. Outer Background Gradient
  if (template.background) {
    ctx.fillStyle = parseLinearGradient(ctx, template.background, w, h);
  } else {
    ctx.fillStyle = '#0f172a';
  }
  ctx.fillRect(0, 0, w, h);

  // 2. Ambient background decorative glow or SVG shapes
  if (isBrandStyle && template.bgShapes) {
    drawBgShapes(ctx, w, h, template.bgShapes);
  } else {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.filter = `blur(${Math.round(w * 0.08)}px)`;
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.18, w * 0.20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.beginPath();
    ctx.arc(w * 0.20, h * 0.82, w * 0.17, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Central Card Frame (16px inset on 300px = 0.05333)
  const cardInset = w * 0.05333;
  const cardX = cardInset;
  const cardY = cardInset;
  const cardW = w - cardInset * 2;
  const cardH = h - cardInset * 2;
  const cardRadius = w * 0.06; // 18px on 300px

  const glassyFill = isBrandStyle ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.08)';
  const glassyStroke = isBrandStyle ? 'rgba(255, 255, 255, 0.50)' : 'rgba(255, 255, 255, 0.28)';
  const glassyStrokeWidth = Math.max(1, w * 0.0025);

  // Central Card Frame
  ctx.save();
  ctx.fillStyle = glassyFill;
  ctx.strokeStyle = glassyStroke;
  ctx.lineWidth = glassyStrokeWidth;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 4. Platform Top Icon Slot (Reserved at 11.5% Y center)
  if (template.svg) {
    const iconImg = getSvgImage(template.svg);
    if (iconImg && iconImg.complete && iconImg.naturalWidth !== 0) {
      const iconSize = w * 0.073;
      const iconX = (w - iconSize) / 2;
      const iconY = cardY + cardH * 0.115 - iconSize / 2;
      ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
    }
  }

  // 5. Headline Text & Matching Glassy Container
  const headlineText = (options.templateHeadline || template.headline || '').toUpperCase();
  const headlineY = cardY + cardH * 0.245;

  ctx.save();
  const badgePadX = w * 0.038;
  const badgeHeight = w * 0.068;
  const isBebas = typography.headlineFont.includes('Bebas');
  const headlineFontSize = isBebas ? Math.round(w * 0.042) : Math.round(w * 0.034);
  
  ctx.font = `${typography.headlineWeight} ${headlineFontSize}px ${typography.headlineFont}`;
  const textWidth = ctx.measureText(headlineText).width;
  const badgeWidth = textWidth + badgePadX * 2;
  const badgeX = (w - badgeWidth) / 2;
  const badgeY = headlineY - badgeHeight / 2;

  // Draw Glassy Container with identical fill, stroke and thickness as the bigger box
  ctx.save();
  ctx.fillStyle = glassyFill;
  ctx.strokeStyle = glassyStroke;
  ctx.lineWidth = glassyStrokeWidth;
  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Crisp High-Contrast Headline Text in Brand Typography
  const isDarkHeadline = template.isDarkHeadline || false;
  ctx.fillStyle = isBrandStyle ? '#111111' : (isDarkHeadline ? '#000000' : '#FFFFFF');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = isBebas ? `${Math.round(w * 0.003)}px` : `${Math.round(w * 0.0018)}px`;
  ctx.fillText(headlineText, w * 0.5, headlineY);
  ctx.restore();

  // 6. QR Frame & QR White Box
  const isDarkQrFrame = template.isDarkQrFrame || false;
  const qrFrameSize = w * 0.40;
  const qrFrameX = (w - qrFrameSize) / 2;
  const qrFrameCenterY = cardY + cardH * 0.555;
  const qrFrameY = qrFrameCenterY - qrFrameSize / 2;
  const qrFrameRadius = w * 0.050; // 15px on 300px

  // Translucent outer frame
  ctx.save();
  ctx.fillStyle = isDarkQrFrame ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)';
  ctx.strokeStyle = isDarkQrFrame ? 'rgba(0,0,0,0.20)' : 'rgba(255,255,255,0.35)';
  ctx.lineWidth = glassyStrokeWidth;
  drawRoundedRect(ctx, qrFrameX, qrFrameY, qrFrameSize, qrFrameSize, qrFrameRadius);
  ctx.fill();
  ctx.stroke();

  // Solid White Inner Box (105px on 300px)
  const qrBoxPadding = w * 0.0267; // 8px on 300px
  const qrBoxSize = qrFrameSize - qrBoxPadding * 2;
  const qrBoxX = qrFrameX + qrBoxPadding;
  const qrBoxY = qrFrameY + qrBoxPadding;
  const qrBoxRadius = w * 0.0367; // 11px on 300px

  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = w * 0.040;
  ctx.shadowOffsetY = w * 0.018;
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, qrBoxRadius);
  ctx.fill();
  ctx.restore();

  // 7. Bottom Username / Subtitle Row in Brand Typography
  const isDarkUser = template.isDarkUser || false;
  const subtitleText = options.templateHandleText || options.customText || template.subtitle || '';
  const subtitleY = cardY + cardH * 0.895;

  ctx.save();
  ctx.fillStyle = (isBrandStyle || isDarkUser) ? '#111111' : '#FFFFFF';
  ctx.font = `${typography.handleWeight} ${Math.round(w * 0.0315)}px ${typography.handleFont}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = `${Math.round(w * 0.0012)}px`;
  ctx.fillText(subtitleText, w * 0.5, subtitleY);
  ctx.restore();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// vCard Landscape Renderer — 1050 × 600 px
// Reproduces vcard-templates-2.html layout:
//   Left panel: Name (huge), Job title (accent), divider, 3 contact rows (phone/email/address)
//   Right panel: Glassmorphic QR frame with white inner box
// ─────────────────────────────────────────────────────────────────────────────

function parseRadialGradients(ctx, bgString, W, H) {
  // Fallback: just paint the base linear-gradient colour extracted from the string
  const linearMatch = bgString.match(/linear-gradient\([^,]+,\s*(#[0-9a-fA-F]{6})/);
  const base = linearMatch ? linearMatch[1] : '#111111';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Overlay each radial gradient as a blurred coloured circle
  const radialRe = /radial-gradient\(circle at (\d+)% (\d+)%,\s*(#[0-9a-fA-F]{6})/g;
  let m;
  while ((m = radialRe.exec(bgString)) !== null) {
    const cx = W * parseInt(m[1], 10) / 100;
    const cy = H * parseInt(m[2], 10) / 100;
    const col = m[3];
    const r = W * 0.55; // generous radius like the CSS
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, col + 'CC'); // ~80% opacity
    grad.addColorStop(1, col + '00');
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

// Tiny phone icon path (drawn manually to avoid SVG loading delay)
function drawPhoneIcon(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size;
  // Simplified phone handset
  ctx.beginPath();
  ctx.moveTo(x + s * 0.25, y + s * 0.14);
  ctx.bezierCurveTo(x + s * 0.25, y + s * 0.08, x + s * 0.54, y + s * 0.08, x + s * 0.54, y + s * 0.14);
  ctx.lineTo(x + s * 0.54, y + s * 0.44);
  ctx.bezierCurveTo(x + s * 0.54, y + s * 0.50, x + s * 0.75, y + s * 0.50, x + s * 0.75, y + s * 0.56);
  ctx.lineTo(x + s * 0.75, y + s * 0.78);
  ctx.bezierCurveTo(x + s * 0.75, y + s * 0.90, x + s * 0.45, y + s * 0.92, x + s * 0.40, y + s * 0.78);
  ctx.lineTo(x + s * 0.25, y + s * 0.58);
  ctx.bezierCurveTo(x + s * 0.10, y + s * 0.50, x + s * 0.10, y + s * 0.20, x + s * 0.25, y + s * 0.14);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawEmailIcon(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size;
  // Rectangle envelope
  drawRoundedRect(ctx, x + s * 0.12, y + s * 0.23, s * 0.75, s * 0.54, s * 0.08);
  ctx.stroke();
  // V-flap
  ctx.beginPath();
  ctx.moveTo(x + s * 0.16, y + s * 0.29);
  ctx.lineTo(x + s * 0.5,  y + s * 0.55);
  ctx.lineTo(x + s * 0.84, y + s * 0.29);
  ctx.stroke();
  ctx.restore();
}

function drawLocationIcon(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size;
  // Teardrop pin
  ctx.beginPath();
  ctx.arc(x + s * 0.5, y + s * 0.42, s * 0.27, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + s * 0.5, y + s * 0.69);
  ctx.bezierCurveTo(x + s * 0.5, y + s * 0.69, x + s * 0.22, y + s * 0.54, x + s * 0.22, y + s * 0.42);
  ctx.bezierCurveTo(x + s * 0.22, y + s * 0.26, x + s * 0.34, y + s * 0.14, x + s * 0.5, y + s * 0.14);
  ctx.bezierCurveTo(x + s * 0.66, y + s * 0.14, x + s * 0.78, y + s * 0.26, x + s * 0.78, y + s * 0.42);
  ctx.bezierCurveTo(x + s * 0.78, y + s * 0.54, x + s * 0.5, y + s * 0.69, x + s * 0.5, y + s * 0.69);
  ctx.closePath();
  ctx.stroke();
  // Drop point
  ctx.beginPath();
  ctx.moveTo(x + s * 0.5, y + s * 0.69);
  ctx.lineTo(x + s * 0.5, y + s * 0.875);
  ctx.stroke();
  ctx.restore();
}

function drawWebsiteIcon(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = size;
  const cx = x + s * 0.5, cy = y + s * 0.5, r = s * 0.4;
  // Globe circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // Vertical meridian
  ctx.beginPath();
  ctx.ellipse(cx, cy, r * 0.5, r, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Horizontal equator
  ctx.beginPath();
  ctx.moveTo(cx - r, cy);
  ctx.lineTo(cx + r, cy);
  ctx.stroke();
  // Top/bottom arcs
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.85, cy - r * 0.55);
  ctx.lineTo(cx + r * 0.85, cy - r * 0.55);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.85, cy + r * 0.55);
  ctx.lineTo(cx + r * 0.85, cy + r * 0.55);
  ctx.stroke();
  ctx.restore();
}

/**
 * vCard Landscape (1050×600) Canvas Renderer
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W  — canvas width
 * @param {number} H  — canvas height
 * @param {Object} template
 * @param {Object} options — { name, jobTitle, phone, email, address, url }
 *   All contact fields are optional — empty ones are hidden automatically.
 */
export function drawVCardTemplate(ctx, W, H, template, options = {}) {
  ctx.save();

  const isDark = template.isDark !== false; // default dark
  const accent    = template.accent    || '#FFA36C';
  const textColor = template.textColor || (isDark ? '#ffffff' : '#1a1a1a');
  const subColor  = template.subColor  || (isDark ? '#e0e0e0' : '#555555');
  const borderColor = template.borderColor || 'rgba(255,255,255,0.30)';

  // ── 1. Background ──────────────────────────────────────────────────────────
  parseRadialGradients(ctx, template.background || '', W, H);

  // Dark overlay (matches vcard-templates-2.html .vcard::after)
  ctx.save();
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.35)';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // Grain noise (subtle fractalNoise simulation with tiny dots)
  ctx.save();
  ctx.globalAlpha = 0.04;
  for (let gy = 0; gy < H; gy += 3) {
    for (let gx = 0; gx < W; gx += 3) {
      if (Math.random() > 0.5) {
        ctx.fillStyle = isDark ? '#ffffff' : '#000000';
        ctx.fillRect(gx, gy, 1, 1);
      }
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();


  // ── 3. Layout constants (match HTML: padding 64px 60px, gap 45px, QR right 280px) ─
  const pad   = W * 0.057;      // ~60px on 1050
  const gap   = W * 0.043;      // ~45px gap
  const qrFrameW = W * 0.316;   // right panel width (matches 332px ≈ 24+280+24+4)
  const leftW    = W - pad * 2 - gap - qrFrameW;

  const leftX  = pad;
  const rightX = leftX + leftW + gap;
  const midY   = H / 2;

  // ── 4. Left panel — Name + Title + Divider + Contact rows ─────────────────
  // Font sizes matching vcard-templates-2.html exactly (at H=600):
  //   name: 54px  title: 20px  rows: 22px  icons: 28px
  const nameFontSize  = Math.round(H * 0.090);
  const titleFontSize = Math.round(H * 0.034);
  const rowFontSize   = Math.round(H * 0.037);
  const iconSize      = H * 0.047;   // 28px
  const blockGap      = H * 0.053;   // 32px — gap between name-block / divider / rows
  const rowGap        = H * 0.037;   // 22px — gap between rows
  const rowStride     = iconSize + rowGap;

  const nameFont  = `800 ${nameFontSize}px 'Manrope', 'Outfit', 'Inter', sans-serif`;
  const titleFont = `600 ${titleFontSize}px 'Manrope', 'Outfit', 'Inter', sans-serif`;
  const rowFont   = `500 ${rowFontSize}px 'Inter', 'Outfit', sans-serif`;

  // ── Displayed text — fall back to placeholders only for name/title ─────────
  const nameText  = options.name     || options.fullName    || 'Your Name';
  const titleText = options.jobTitle || options.organization || 'Job Title, Company';

  // ── Build visible rows — skip any field left empty ─────────────────────────
  const visibleRows = [
    { icon: 'phone',    text: (options.phone   || '').trim() },
    { icon: 'email',    text: (options.email   || '').trim() },
    { icon: 'location', text: (options.address || '').trim() },
    { icon: 'website',  text: (options.url     || '').trim() },
  ].filter(r => r.text !== '');

  // ── Measure total block height for vertical centering ─────────────────────
  const nameLineH  = nameFontSize  * 1.15;
  const titleLineH = titleFontSize * 1.40;
  const nameGap    = H * 0.007;
  const nameBlockH = nameLineH + nameGap + titleLineH;
  const rowsH      = visibleRows.length > 0
    ? iconSize + rowStride * (visibleRows.length - 1)
    : 0;
  const totalContentH = nameBlockH + blockGap + 1
    + (visibleRows.length > 0 ? blockGap + rowsH : 0);

  // Vertical padding: 64px on 600 → H * 0.107
  const padV   = H * 0.107;
  const availH = H - padV * 2;
  const startY = padV + Math.max(0, (availH - totalContentH) / 2);

  // ── Clip left panel so text never bleeds into the QR frame ────────────────
  ctx.save();
  ctx.beginPath();
  ctx.rect(leftX - 2, 0, leftW + 4, H);
  ctx.clip();

  // ── Name ──────────────────────────────────────────────────────────────────
  const nameY = startY;
  ctx.save();
  ctx.font = nameFont;
  ctx.fillStyle = textColor;
  ctx.textBaseline = 'top';
  ctx.textAlign    = 'left';
  ctx.fillText(nameText, leftX, nameY, leftW);
  ctx.restore();

  // ── Job Title (accent colour) ─────────────────────────────────────────────
  const titleY = nameY + nameLineH + nameGap;
  ctx.save();
  ctx.font = titleFont;
  ctx.fillStyle = accent;
  ctx.textBaseline = 'top';
  ctx.textAlign    = 'left';
  ctx.fillText(titleText, leftX, titleY, leftW);
  ctx.restore();

  // ── Divider (accent → transparent gradient) ───────────────────────────────
  const dividerY = titleY + titleLineH + blockGap;
  ctx.save();
  const divGrad = ctx.createLinearGradient(leftX, dividerY, leftX + leftW, dividerY);
  divGrad.addColorStop(0,   accent + '66');
  divGrad.addColorStop(0.7, accent + '00');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = Math.max(1, H * 0.0017);
  ctx.beginPath();
  ctx.moveTo(leftX,         dividerY);
  ctx.lineTo(leftX + leftW, dividerY);
  ctx.stroke();
  ctx.restore();

  // ── Contact rows ──────────────────────────────────────────────────────────
  if (visibleRows.length > 0) {
    const firstRowY   = dividerY + 1 + blockGap;
    const textGapX    = iconSize + W * 0.014;
    const rowTextMaxW = leftW - textGapX;

    visibleRows.forEach((row, i) => {
      const rowY  = firstRowY + i * rowStride;
      const iconY = rowY;

      if (row.icon === 'phone')    drawPhoneIcon   (ctx, leftX, iconY, iconSize, accent);
      if (row.icon === 'email')    drawEmailIcon   (ctx, leftX, iconY, iconSize, accent);
      if (row.icon === 'location') drawLocationIcon(ctx, leftX, iconY, iconSize, accent);
      if (row.icon === 'website')  drawWebsiteIcon (ctx, leftX, iconY, iconSize, accent);

      ctx.save();
      ctx.font = rowFont;
      ctx.fillStyle = subColor;
      ctx.textBaseline = 'middle';
      ctx.textAlign    = 'left';
      ctx.fillText(row.text, leftX + textGapX, iconY + iconSize / 2, rowTextMaxW);
      ctx.restore();
    });
  }

  // Restore left-panel clip
  ctx.restore();


  // ── 5. Right panel — QR Frame (matches .qr-frame-vc styling) ──────────────
  const qrFramePad = W * 0.023;   // ~24px on 1050
  const qrBoxSize  = qrFrameW - qrFramePad * 2;   // 280px equivalent
  const qrFrameH   = qrFrameW;    // square frame
  const qrFrameX   = rightX;
  const qrFrameY   = midY - qrFrameH / 2;
  const qrFrameRadius = W * 0.030; // ~32px on 1050

  // Outer glassmorphic frame (matches background: linear-gradient(160deg, rgba(255,255,255,0.16)…))
  ctx.save();
  const frameGrad = ctx.createLinearGradient(qrFrameX, qrFrameY, qrFrameX + qrFrameW, qrFrameY + qrFrameH);
  frameGrad.addColorStop(0, 'rgba(255,255,255,0.16)');
  frameGrad.addColorStop(1, 'rgba(255,255,255,0.04)');
  ctx.fillStyle = frameGrad;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = Math.max(1, W * 0.001);
  ctx.shadowColor = 'rgba(0,0,0,0.30)';
  ctx.shadowBlur  = W * 0.025;
  drawRoundedRect(ctx, qrFrameX, qrFrameY, qrFrameW, qrFrameH, qrFrameRadius);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Inner white QR box (matches .qr-box-vc: border-radius 22px, shadow)
  const qrBoxX = qrFrameX + qrFramePad;
  const qrBoxY = qrFrameY + qrFramePad;
  const qrBoxRadius = W * 0.021; // ~22px on 1050

  ctx.save();
  ctx.shadowColor  = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur   = W * 0.032;
  ctx.shadowOffsetY = W * 0.015;
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, qrBoxRadius);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // Return QR box coordinates so the caller can draw the QR code inside
  return { qrBoxX, qrBoxY, qrBoxSize };
}
