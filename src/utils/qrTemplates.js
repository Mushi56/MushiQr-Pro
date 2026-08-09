// ─── QR Code Vector Templates (1080x1350 Social Media Pro Cards) ──────────────

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

// ── Vector Social Media Icon Drawing Helpers ───────────────────
function drawSocialIcon(ctx, platform, x, y, size, color = '#FFFFFF') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.08);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  switch (platform) {
    case 'instagram': {
      // Outer camera square
      const s = size * 0.72;
      const rx = cx - s / 2;
      const ry = cy - s / 2;
      drawRoundedRect(ctx, rx, ry, s, s, s * 0.28);
      ctx.stroke();

      // Lens circle
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.24, 0, Math.PI * 2);
      ctx.stroke();

      // Flash dot
      ctx.beginPath();
      ctx.arc(cx + s * 0.22, cy - s * 0.22, s * 0.05, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'facebook': {
      // Facebook 'f' emblem
      ctx.font = `bold ${Math.round(size * 0.85)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('f', cx + size * 0.05, cy + size * 0.05);
      break;
    }
    case 'whatsapp': {
      // WhatsApp speech bubble + phone handset
      ctx.beginPath();
      ctx.arc(cx, cy - size * 0.04, size * 0.38, Math.PI * 0.25, Math.PI * 1.85);
      ctx.lineTo(cx - size * 0.38, cy + size * 0.38);
      ctx.closePath();
      ctx.stroke();

      // Phone inside
      ctx.beginPath();
      ctx.arc(cx, cy - size * 0.04, size * 0.18, -Math.PI * 0.3, Math.PI * 0.5);
      ctx.stroke();
      break;
    }
    case 'youtube': {
      // YouTube play button badge
      const bw = size * 0.8;
      const bh = size * 0.56;
      drawRoundedRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, bh * 0.28);
      ctx.fill();

      // Inner play triangle
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      const ps = size * 0.18;
      ctx.moveTo(cx - ps * 0.6, cy - ps);
      ctx.lineTo(cx + ps * 0.9, cy);
      ctx.lineTo(cx - ps * 0.6, cy + ps);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'x': {
      // X / Twitter emblem
      const s = size * 0.32;
      ctx.lineWidth = Math.max(2, size * 0.12);
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s);
      ctx.lineTo(cx + s, cy + s);
      ctx.moveTo(cx + s, cy - s);
      ctx.lineTo(cx - s, cy + s);
      ctx.stroke();
      break;
    }
    case 'tiktok': {
      // TikTok musical note emblem
      ctx.lineWidth = Math.max(2, size * 0.1);
      ctx.beginPath();
      ctx.arc(cx - size * 0.1, cy + size * 0.15, size * 0.16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + size * 0.06, cy + size * 0.15);
      ctx.lineTo(cx + size * 0.06, cy - size * 0.3);
      ctx.bezierCurveTo(cx + size * 0.06, cy - size * 0.15, cx + size * 0.2, cy - size * 0.1, cx + size * 0.32, cy - size * 0.1);
      ctx.stroke();
      break;
    }
    case 'linkedin': {
      // LinkedIn 'in'
      ctx.font = `bold ${Math.round(size * 0.6)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('in', cx, cy + size * 0.02);
      break;
    }
    case 'spotify': {
      // Spotify circle & sound arcs
      ctx.lineWidth = Math.max(1.5, size * 0.07);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const r_ = size * (0.16 + i * 0.09);
        ctx.arc(cx - size * 0.08, cy + size * 0.12, r_, -Math.PI * 0.35, Math.PI * 0.1);
        ctx.stroke();
      }
      break;
    }
    case 'telegram': {
      // Paper plane
      const ps = size * 0.35;
      ctx.beginPath();
      ctx.moveTo(cx + ps, cy - ps);
      ctx.lineTo(cx - ps, cy);
      ctx.lineTo(cx - ps * 0.2, cy + ps * 0.3);
      ctx.lineTo(cx + ps, cy - ps);
      ctx.lineTo(cx, cy + ps);
      ctx.lineTo(cx - ps * 0.2, cy + ps * 0.3);
      ctx.stroke();
      break;
    }
    case 'snapchat': {
      // Ghost icon outline
      ctx.beginPath();
      ctx.arc(cx, cy - size * 0.1, size * 0.22, Math.PI, 0);
      ctx.lineTo(cx + size * 0.24, cy + size * 0.2);
      ctx.quadraticCurveTo(cx, cy + size * 0.3, cx - size * 0.24, cy + size * 0.2);
      ctx.closePath();
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

// ── Master Social Template Factory function ──────────────────
function createSocialTemplate({
  id,
  name,
  platform,
  title,
  subtitle,
  handle,
  bgGradStart,
  bgGradEnd,
  glowColor,
  iconGradStart,
  iconGradEnd,
  taglineColor,
  preset
}) {
  return {
    id,
    name,
    category: 'Social Media',
    dimensions: '1080 x 1350 px',
    heightRatio: 1.25, // 1350 / 1080 = 1.25
    qrSize: 0.48,
    qrX: 0.50,
    qrY: 0.53,
    preset,
    drawBackground: (ctx, w, h) => {
      h = h || Math.round(w * 1.25);
      ctx.save();

      // 1. Sleek Card Dark Gradient Background (Home screen 160deg style)
      const bgGrad = ctx.createLinearGradient(0, 0, w * 0.5, h);
      bgGrad.addColorStop(0, bgGradStart);
      bgGrad.addColorStop(1, bgGradEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Ambient Glow (Radial light aura in top-right corner)
      ctx.save();
      const glowGrad = ctx.createRadialGradient(w * 0.85, h * 0.15, 0, w * 0.85, h * 0.15, w * 0.65);
      glowGrad.addColorStop(0, glowColor);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // 3. Top Header: Social Platform Icon Container (Home screen 32x32 rounded badge style)
      const iconSize = w * 0.13;
      const iconX = w * 0.08;
      const iconY = h * 0.07;
      const iconRadius = iconSize * 0.31;

      // Icon Container Drop Shadow
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = w * 0.04;
      ctx.shadowOffsetY = w * 0.015;

      const iconGrad = ctx.createLinearGradient(iconX, iconY, iconX + iconSize, iconY + iconSize);
      iconGrad.addColorStop(0, iconGradStart);
      iconGrad.addColorStop(1, iconGradEnd);
      ctx.fillStyle = iconGrad;
      drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, iconRadius);
      ctx.fill();
      ctx.restore();

      // Draw Vector Social Icon inside container
      drawSocialIcon(ctx, platform, iconX, iconY, iconSize, '#FFFFFF');

      // 4. Header Titles (Platform name & subtitle)
      const textX = iconX + iconSize + w * 0.04;
      
      // Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 ${Math.round(w * 0.052)}px "Outfit", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(title, textX, iconY + iconSize * 0.05);

      // Subtitle
      ctx.fillStyle = taglineColor;
      ctx.font = `600 ${Math.round(w * 0.028)}px "Inter", sans-serif`;
      ctx.fillText(subtitle, textX, iconY + iconSize * 0.58);

      // 5. Username / Handle Text Container (Home screen style pill container)
      const handleY = iconY + iconSize + h * 0.035;
      const handleH = h * 0.055;
      const handleW = w * 0.84;
      const handleX = w * 0.08;
      const handleRadius = handleH * 0.35;

      // Translucent container
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      drawRoundedRect(ctx, handleX, handleY, handleW, handleH, handleRadius);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = Math.max(1, w * 0.002);
      ctx.stroke();

      // Handle text inside pill
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `700 ${Math.round(w * 0.032)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(handle, w * 0.5, handleY + handleH / 2);

      // 6. QR Code Rounded Container Background
      const qrW = w * 0.48;
      const qrH = qrW;
      const qrCenterY = h * 0.53;
      const qrBoxW = qrW + w * 0.09;
      const qrBoxH = qrH + w * 0.09;
      const qrBoxX = (w - qrBoxW) / 2;
      const qrBoxY = qrCenterY - qrBoxH / 2;
      const qrBoxRadius = w * 0.06;

      // Drop shadow for QR Card Container
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = w * 0.06;
      ctx.shadowOffsetY = w * 0.03;

      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, qrBoxRadius);
      ctx.fill();
      ctx.restore();

      // 7. Bottom Action Pill (Matching Home Screen Card Bottom Banner style)
      const botY = h * 0.865;
      const botH = h * 0.065;
      const botW = w * 0.84;
      const botX = w * 0.08;
      const botRadius = botH * 0.35;

      // Banner background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      drawRoundedRect(ctx, botX, botY, botW, botH, botRadius);
      ctx.fill();

      // Banner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = Math.max(1, w * 0.002);
      ctx.stroke();

      // Left Icon Badge inside bottom banner
      const bIconSize = botH * 0.58;
      const bIconX = botX + botH * 0.25;
      const bIconY = botY + (botH - bIconSize) / 2;
      const bIconGrad = ctx.createLinearGradient(bIconX, bIconY, bIconX + bIconSize, bIconY + bIconSize);
      bIconGrad.addColorStop(0, iconGradStart);
      bIconGrad.addColorStop(1, iconGradEnd);
      ctx.fillStyle = bIconGrad;
      drawRoundedRect(ctx, bIconX, bIconY, bIconSize, bIconSize, bIconSize * 0.3);
      ctx.fill();

      drawSocialIcon(ctx, platform, bIconX, bIconY, bIconSize, '#FFFFFF');

      // Banner Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `700 ${Math.round(w * 0.032)}px "Outfit", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Scan to Follow & Connect', bIconX + bIconSize + w * 0.03, botY + botH / 2);

      // Right Chevron Circle
      const chSize = botH * 0.6;
      const chX = botX + botW - chSize - botH * 0.2;
      const chY = botY + (botH - chSize) / 2;

      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = w * 0.02;
      ctx.fillStyle = iconGrad;
      ctx.beginPath();
      ctx.arc(chX + chSize / 2, chY + chSize / 2, chSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Chevron Arrow '>'
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(2, w * 0.006);
      ctx.beginPath();
      const cx_ = chX + chSize / 2;
      const cy_ = chY + chSize / 2;
      const cs_ = chSize * 0.22;
      ctx.moveTo(cx_ - cs_ * 0.5, cy_ - cs_);
      ctx.lineTo(cx_ + cs_ * 0.5, cy_);
      ctx.lineTo(cx_ - cs_ * 0.5, cy_ + cs_);
      ctx.stroke();

      ctx.restore();
    },
    drawForeground: () => {}
  };
}

// ─── Exported 1080x1350 Social Media Templates Array ──────────────────────────
export const QR_TEMPLATES = [
  createSocialTemplate({
    id: 'sm_instagram_pro',
    name: 'Instagram Pro (1080x1350)',
    platform: 'instagram',
    title: 'INSTAGRAM',
    subtitle: 'Design Without Limits • Follow Us',
    handle: '@your.instagram.handle',
    bgGradStart: '#3B0826',
    bgGradEnd: '#15020D',
    glowColor: 'rgba(225, 48, 108, 0.35)',
    iconGradStart: '#833AB4',
    iconGradEnd: '#FD1D1D',
    taglineColor: '#FF4D79',
    preset: {
      qrColor: '#1A0210',
      bgColor: '#FFFFFF',
      eyeColor: '#E1306C',
      eyeOuterColor: '#833AB4',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }),

  createSocialTemplate({
    id: 'sm_facebook_pro',
    name: 'Facebook Pro (1080x1350)',
    platform: 'facebook',
    title: 'FACEBOOK',
    subtitle: 'Connect & Join Community',
    handle: 'facebook.com/yourbrand',
    bgGradStart: '#061B3A',
    bgGradEnd: '#020916',
    glowColor: 'rgba(24, 119, 242, 0.35)',
    iconGradStart: '#1877F2',
    iconGradEnd: '#0056C6',
    taglineColor: '#4D9BFF',
    preset: {
      qrColor: '#030E20',
      bgColor: '#FFFFFF',
      eyeColor: '#1877F2',
      eyeOuterColor: '#0056C6',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  }),

  createSocialTemplate({
    id: 'sm_whatsapp_pro',
    name: 'WhatsApp Pro (1080x1350)',
    platform: 'whatsapp',
    title: 'WHATSAPP',
    subtitle: 'Instant Direct Chat & Support',
    handle: '+1 (555) 019-2834',
    bgGradStart: '#052B1E',
    bgGradEnd: '#01120C',
    glowColor: 'rgba(37, 211, 102, 0.35)',
    iconGradStart: '#25D366',
    iconGradEnd: '#128C7E',
    taglineColor: '#52E08A',
    preset: {
      qrColor: '#021810',
      bgColor: '#FFFFFF',
      eyeColor: '#25D366',
      eyeOuterColor: '#128C7E',
      dotStyle: 'dots',
      eyeStyle: 'rounded'
    }
  }),

  createSocialTemplate({
    id: 'sm_youtube_pro',
    name: 'YouTube Pro (1080x1350)',
    platform: 'youtube',
    title: 'YOUTUBE',
    subtitle: 'Watch, Like & Subscribe',
    handle: 'youtube.com/@yourchannel',
    bgGradStart: '#3A060B',
    bgGradEnd: '#150103',
    glowColor: 'rgba(255, 0, 0, 0.35)',
    iconGradStart: '#FF0000',
    iconGradEnd: '#990000',
    taglineColor: '#FF4D4D',
    preset: {
      qrColor: '#200305',
      bgColor: '#FFFFFF',
      eyeColor: '#FF0000',
      eyeOuterColor: '#990000',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }),

  createSocialTemplate({
    id: 'sm_x_pro',
    name: 'X / Twitter Pro (1080x1350)',
    platform: 'x',
    title: 'X (TWITTER)',
    subtitle: 'Follow for Latest News & Updates',
    handle: '@your_twitter_handle',
    bgGradStart: '#0F172A',
    bgGradEnd: '#020617',
    glowColor: 'rgba(29, 155, 240, 0.35)',
    iconGradStart: '#1DA1F2',
    iconGradEnd: '#0C7ABF',
    taglineColor: '#58B9F5',
    preset: {
      qrColor: '#0B132B',
      bgColor: '#FFFFFF',
      eyeColor: '#1DA1F2',
      eyeOuterColor: '#0C7ABF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  }),

  createSocialTemplate({
    id: 'sm_tiktok_pro',
    name: 'TikTok Pro (1080x1350)',
    platform: 'tiktok',
    title: 'TIKTOK',
    subtitle: 'Watch Trending Short Videos',
    handle: '@tiktok_creator_official',
    bgGradStart: '#1A0B26',
    bgGradEnd: '#08030F',
    glowColor: 'rgba(254, 44, 85, 0.35)',
    iconGradStart: '#25F4EE',
    iconGradEnd: '#FE2C55',
    taglineColor: '#FF5E80',
    preset: {
      qrColor: '#10061A',
      bgColor: '#FFFFFF',
      eyeColor: '#FE2C55',
      eyeOuterColor: '#25F4EE',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }),

  createSocialTemplate({
    id: 'sm_linkedin_pro',
    name: 'LinkedIn Pro (1080x1350)',
    platform: 'linkedin',
    title: 'LINKEDIN',
    subtitle: 'Connect & Network Professionally',
    handle: 'linkedin.com/in/yourprofile',
    bgGradStart: '#0A1E3F',
    bgGradEnd: '#030A17',
    glowColor: 'rgba(10, 102, 194, 0.35)',
    iconGradStart: '#0A66C2',
    iconGradEnd: '#004182',
    taglineColor: '#4A9EFF',
    preset: {
      qrColor: '#051226',
      bgColor: '#FFFFFF',
      eyeColor: '#0A66C2',
      eyeOuterColor: '#004182',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  }),

  createSocialTemplate({
    id: 'sm_spotify_pro',
    name: 'Spotify Pro (1080x1350)',
    platform: 'spotify',
    title: 'SPOTIFY',
    subtitle: 'Stream Music & Listen to Playlist',
    handle: 'spotify:playlist:yourid',
    bgGradStart: '#092612',
    bgGradEnd: '#020F06',
    glowColor: 'rgba(30, 215, 96, 0.35)',
    iconGradStart: '#1DB954',
    iconGradEnd: '#107C35',
    taglineColor: '#4DE07E',
    preset: {
      qrColor: '#041409',
      bgColor: '#FFFFFF',
      eyeColor: '#1DB954',
      eyeOuterColor: '#107C35',
      dotStyle: 'dots',
      eyeStyle: 'rounded'
    }
  }),

  createSocialTemplate({
    id: 'sm_telegram_pro',
    name: 'Telegram Pro (1080x1350)',
    platform: 'telegram',
    title: 'TELEGRAM',
    subtitle: 'Join Channel & Instant Chat',
    handle: 't.me/your_telegram_channel',
    bgGradStart: '#082136',
    bgGradEnd: '#020C17',
    glowColor: 'rgba(34, 158, 217, 0.35)',
    iconGradStart: '#229ED9',
    iconGradEnd: '#0E6B9C',
    taglineColor: '#59C4F7',
    preset: {
      qrColor: '#04121F',
      bgColor: '#FFFFFF',
      eyeColor: '#229ED9',
      eyeOuterColor: '#0E6B9C',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }),

  createSocialTemplate({
    id: 'sm_snapchat_pro',
    name: 'Snapchat Pro (1080x1350)',
    platform: 'snapchat',
    title: 'SNAPCHAT',
    subtitle: 'Add Friend & View Stories',
    handle: 'snapchat.com/add/username',
    bgGradStart: '#2B2602',
    bgGradEnd: '#121000',
    glowColor: 'rgba(255, 252, 0, 0.35)',
    iconGradStart: '#FFFC00',
    iconGradEnd: '#D4CE00',
    taglineColor: '#FFF44F',
    preset: {
      qrColor: '#1A1701',
      bgColor: '#FFFFFF',
      eyeColor: '#D4CE00',
      eyeOuterColor: '#807C00',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  })
];

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
