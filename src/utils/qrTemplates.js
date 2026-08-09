// ─── QR Code Vector Templates (1080x1350 Centered Social Media Pro Cards) ──────────

const imgCache = {};
function getPresetImage(src) {
  if (!src) return null;
  if (!imgCache[src]) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      window.dispatchEvent(new CustomEvent('qr-template-loaded'));
    };
    imgCache[src] = img;
  }
  return imgCache[src];
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

// ── Master Centered Social Template Factory ──────────────────
function createSocialTemplate({
  id,
  name,
  logoSrc,
  title,
  actionText,
  defaultHandle,
  bgGradStart,
  bgGradEnd,
  glowColor,
  iconGradStart,
  iconGradEnd,
  actionTextColor,
  preset
}) {
  return {
    id,
    name,
    category: 'Social Media',
    dimensions: '1080 x 1350 px',
    heightRatio: 1.25, // 1350 / 1080 = 1.25
    qrSize: 0.44,
    qrX: 0.50,
    qrY: 0.54,
    defaultHandle,
    preset,
    drawBackground: (ctx, w, h, options = {}) => {
      h = h || Math.round(w * 1.25);
      ctx.save();

      // 1. Sleek Card Dark Gradient Background (Home screen 160deg style)
      const bgGrad = ctx.createLinearGradient(0, 0, w * 0.5, h);
      bgGrad.addColorStop(0, bgGradStart);
      bgGrad.addColorStop(1, bgGradEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Ambient Glow (Radial light aura in top-center)
      ctx.save();
      const glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.16, 0, w * 0.5, h * 0.16, w * 0.65);
      glowGrad.addColorStop(0, glowColor);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // 3. Top Center: Official Logo Icon Container (Home screen rounded badge style)
      const iconSize = w * 0.16;
      const iconX = (w - iconSize) / 2;
      const iconY = h * 0.07;
      const iconRadius = iconSize * 0.32;

      // Icon Container Drop Shadow
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = w * 0.045;
      ctx.shadowOffsetY = w * 0.015;

      const iconGrad = ctx.createLinearGradient(iconX, iconY, iconX + iconSize, iconY + iconSize);
      iconGrad.addColorStop(0, iconGradStart);
      iconGrad.addColorStop(1, iconGradEnd);
      ctx.fillStyle = iconGrad;
      drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, iconRadius);
      ctx.fill();
      ctx.restore();

      // Draw Official Real Logo Image inside container
      const logoImg = getPresetImage(logoSrc);
      if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
        const p = iconSize * 0.18;
        ctx.save();
        // Rounded clip for image
        drawRoundedRect(ctx, iconX + p, iconY + p, iconSize - p * 2, iconSize - p * 2, (iconSize - p * 2) * 0.24);
        ctx.clip();
        ctx.drawImage(logoImg, iconX + p, iconY + p, iconSize - p * 2, iconSize - p * 2);
        ctx.restore();
      }

      // 4. Center Titles (Platform Name & Action Text directly under icon)
      const titleY = iconY + iconSize + h * 0.035;
      
      // Platform Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 ${Math.round(w * 0.055)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(title, w * 0.5, titleY);

      // Action Text (e.g. "Follow Me", "Chat With Us", "Join Us")
      const actionY = titleY + h * 0.05;
      ctx.fillStyle = actionTextColor;
      ctx.font = `700 ${Math.round(w * 0.034)}px "Inter", sans-serif`;
      ctx.fillText(actionText, w * 0.5, actionY);

      // 5. QR Code Rounded Container Background (Centered)
      const qrW = w * 0.44;
      const qrH = qrW;
      const qrCenterY = h * 0.54;
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

      // 6. Bottom Center: Pill Shape Container for Username / Handle Text
      const handleY = h * 0.835;
      const handleH = h * 0.065;
      const handleW = w * 0.80;
      const handleX = (w - handleW) / 2;
      const handleRadius = handleH * 0.4;

      // Translucent container fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      drawRoundedRect(ctx, handleX, handleY, handleW, handleH, handleRadius);
      ctx.fill();

      // Translucent border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = Math.max(1.5, w * 0.003);
      ctx.stroke();

      // Handle Text inside pill (Editable text from options or default)
      const handleVal = options.templateHandleText || options.customText || defaultHandle;
      const textToDisplay = `✏️ ${handleVal}`;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `700 ${Math.round(w * 0.034)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textToDisplay, w * 0.5, handleY + handleH / 2);

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
    logoSrc: '/presets/instagram.avif',
    title: 'INSTAGRAM',
    actionText: 'Follow Me',
    defaultHandle: '@your.instagram',
    bgGradStart: '#3B0826',
    bgGradEnd: '#15020D',
    glowColor: 'rgba(225, 48, 108, 0.4)',
    iconGradStart: '#833AB4',
    iconGradEnd: '#FD1D1D',
    actionTextColor: '#FF4D79',
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
    logoSrc: '/presets/facebook.avif',
    title: 'FACEBOOK',
    actionText: 'Join Our Community',
    defaultHandle: 'facebook.com/yourpage',
    bgGradStart: '#061B3A',
    bgGradEnd: '#020916',
    glowColor: 'rgba(24, 119, 242, 0.4)',
    iconGradStart: '#1877F2',
    iconGradEnd: '#0056C6',
    actionTextColor: '#4D9BFF',
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
    logoSrc: '/presets/whatsapp.avif',
    title: 'WHATSAPP',
    actionText: 'Chat With Us',
    defaultHandle: '+1 (555) 019-2834',
    bgGradStart: '#052B1E',
    bgGradEnd: '#01120C',
    glowColor: 'rgba(37, 211, 102, 0.4)',
    iconGradStart: '#25D366',
    iconGradEnd: '#128C7E',
    actionTextColor: '#52E08A',
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
    logoSrc: '/presets/youtube.avif',
    title: 'YOUTUBE',
    actionText: 'Watch & Subscribe',
    defaultHandle: 'youtube.com/@channel',
    bgGradStart: '#3A060B',
    bgGradEnd: '#150103',
    glowColor: 'rgba(255, 0, 0, 0.4)',
    iconGradStart: '#FF0000',
    iconGradEnd: '#990000',
    actionTextColor: '#FF4D4D',
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
    logoSrc: '/presets/twitter.avif',
    title: 'X (TWITTER)',
    actionText: 'Follow Me',
    defaultHandle: '@your_twitter_handle',
    bgGradStart: '#0F172A',
    bgGradEnd: '#020617',
    glowColor: 'rgba(29, 155, 240, 0.4)',
    iconGradStart: '#1DA1F2',
    iconGradEnd: '#0C7ABF',
    actionTextColor: '#58B9F5',
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
    logoSrc: '/presets/tik-tok.avif',
    title: 'TIKTOK',
    actionText: 'Watch Trending Videos',
    defaultHandle: '@tiktok_creator',
    bgGradStart: '#1A0B26',
    bgGradEnd: '#08030F',
    glowColor: 'rgba(254, 44, 85, 0.4)',
    iconGradStart: '#25F4EE',
    iconGradEnd: '#FE2C55',
    actionTextColor: '#FF5E80',
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
    logoSrc: '/presets/linkedin.avif',
    title: 'LINKEDIN',
    actionText: 'Connect With Me',
    defaultHandle: 'linkedin.com/in/yourname',
    bgGradStart: '#0A1E3F',
    bgGradEnd: '#030A17',
    glowColor: 'rgba(10, 102, 194, 0.4)',
    iconGradStart: '#0A66C2',
    iconGradEnd: '#004182',
    actionTextColor: '#4A9EFF',
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
    logoSrc: '/presets/spotify.avif',
    title: 'SPOTIFY',
    actionText: 'Listen On Spotify',
    defaultHandle: 'spotify:user:playlist',
    bgGradStart: '#092612',
    bgGradEnd: '#020F06',
    glowColor: 'rgba(30, 215, 96, 0.4)',
    iconGradStart: '#1DB954',
    iconGradEnd: '#107C35',
    actionTextColor: '#4DE07E',
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
    id: 'sm_messenger_pro',
    name: 'Messenger Pro (1080x1350)',
    logoSrc: '/presets/messenger.avif',
    title: 'MESSENGER',
    actionText: 'Chat With Us',
    defaultHandle: 'm.me/yourpage',
    bgGradStart: '#1F0836',
    bgGradEnd: '#0B0215',
    glowColor: 'rgba(0, 132, 255, 0.4)',
    iconGradStart: '#0084FF',
    iconGradEnd: '#A200FF',
    actionTextColor: '#33A3FF',
    preset: {
      qrColor: '#0E031A',
      bgColor: '#FFFFFF',
      eyeColor: '#0084FF',
      eyeOuterColor: '#A200FF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }),

  createSocialTemplate({
    id: 'sm_social_pro',
    name: 'Social Hub Pro (1080x1350)',
    logoSrc: '/presets/social.avif',
    title: 'SOCIAL HUB',
    actionText: 'Join Us',
    defaultHandle: 'linktr.ee/yourhub',
    bgGradStart: '#25083B',
    bgGradEnd: '#0D0216',
    glowColor: 'rgba(235, 64, 52, 0.4)',
    iconGradStart: '#FF3B30',
    iconGradEnd: '#AF52DE',
    actionTextColor: '#FF6B60',
    preset: {
      qrColor: '#140320',
      bgColor: '#FFFFFF',
      eyeColor: '#FF3B30',
      eyeOuterColor: '#AF52DE',
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
