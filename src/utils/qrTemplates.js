// ─── QR Code Vector Templates ───────────────────────────────────────────────

export const QR_TEMPLATES = [
  // ─── SOCIAL MEDIA ────────────────────────────────────────────────────────────
  {
    id: 'social_instagram',
    name: 'Instagram',
    category: 'Social',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'FOLLOW ME' },
      { key: 'subtitle', label: 'Platform', default: 'on Instagram' },
      { key: 'handle', label: 'Handle', default: '@username' },
    ],
    preset: { qrColor: '#E4405F', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#E4405F', eyeOuterColor: '#E4405F', bgTransparent: true },
    drawBackground: (ctx, size) => {
      // Instagram Mesh Gradient
      const g = ctx.createLinearGradient(0, 0, size, size);
      g.addColorStop(0, '#833AB4'); g.addColorStop(0.35, '#FD1D1D'); g.addColorStop(0.7, '#FCB045'); g.addColorStop(1, '#E1306C');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      // Card with subtle shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = size * 0.04;
      ctx.shadowOffsetY = size * 0.02;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();

      // Bottom pill badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath(); ctx.roundRect(size * 0.12, size * 0.89, size * 0.76, size * 0.07, size * 0.035); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center';
      const cx = size * 0.5;

      // Crisp Instagram Camera Vector Icon
      const r = size * 0.032; const cy = size * 0.09;
      ctx.save();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.007; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(cx + r * 0.5, cy - r * 0.5, r * 0.12, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Premium Typography
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.04)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'FOLLOW ME').toUpperCase(), cx, size * 0.19);
      ctx.font = `italic 500 ${Math.round(size * 0.035)}px "Georgia", serif`;
      ctx.fillText(texts.subtitle || 'on Instagram', cx, size * 0.25);

      // Handle with User Icon
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `600 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText('👤  ' + (texts.handle || '@username'), cx, size * 0.935);
    }
  },
  {
    id: 'social_facebook',
    name: 'Facebook',
    category: 'Social',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'CONNECT WITH US' },
      { key: 'subtitle', label: 'Platform', default: 'on Facebook' },
      { key: 'handle', label: 'Handle', default: '/facebookname' },
    ],
    preset: { qrColor: '#1877F2', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#1877F2', eyeOuterColor: '#1877F2', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#1877F2'); g.addColorStop(1, '#0B51B3');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath(); ctx.roundRect(size * 0.12, size * 0.89, size * 0.76, size * 0.07, size * 0.035); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      // Facebook "f" vector
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 ${Math.round(size * 0.075)}px "Inter", sans-serif`;
      ctx.fillText('f', cx, size * 0.115);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'CONNECT WITH US').toUpperCase(), cx, size * 0.19);
      ctx.font = `italic 500 ${Math.round(size * 0.035)}px "Georgia", serif`;
      ctx.fillText(texts.subtitle || 'on Facebook', cx, size * 0.25);

      ctx.font = `600 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText('👍  ' + (texts.handle || '/facebookname'), cx, size * 0.935);
    }
  },
  {
    id: 'social_youtube',
    name: 'YouTube',
    category: 'Social',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'SUBSCRIBE US' },
      { key: 'subtitle', label: 'Platform', default: 'on YouTube' },
      { key: 'handle', label: 'Handle', default: '/yourchannel' },
    ],
    preset: { qrColor: '#FF0000', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#FF0000', eyeOuterColor: '#FF0000', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#FF1E1E'); g.addColorStop(1, '#D00000');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath(); ctx.roundRect(size * 0.12, size * 0.89, size * 0.76, size * 0.07, size * 0.035); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      // Play button vector icon
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath();
      ctx.roundRect(cx - size * 0.045, size * 0.06, size * 0.09, size * 0.055, size * 0.015); ctx.fill();
      ctx.fillStyle = '#FF0000'; ctx.beginPath();
      ctx.moveTo(cx - size * 0.01, size * 0.075); ctx.lineTo(cx + size * 0.015, size * 0.0875); ctx.lineTo(cx - size * 0.01, size * 0.1); ctx.closePath(); ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'SUBSCRIBE US').toUpperCase(), cx, size * 0.19);
      ctx.font = `italic 500 ${Math.round(size * 0.035)}px "Georgia", serif`;
      ctx.fillText(texts.subtitle || 'on YouTube', cx, size * 0.25);

      ctx.font = `600 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText('🔔  ' + (texts.handle || '/yourchannel'), cx, size * 0.935);
    }
  },
  {
    id: 'social_tiktok',
    name: 'TikTok',
    category: 'Social',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'FOLLOW ME' },
      { key: 'subtitle', label: 'Platform', default: 'on TikTok' },
      { key: 'handle', label: 'Handle', default: '@username' },
    ],
    preset: { qrColor: '#000000', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#000000', eyeOuterColor: '#000000', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, size, size);

      // Cyan / Magenta Cyber Glow Border
      ctx.save();
      ctx.strokeStyle = '#25F4EE'; ctx.lineWidth = size * 0.006; ctx.shadowColor = '#25F4EE'; ctx.shadowBlur = size * 0.03;
      ctx.beginPath(); ctx.roundRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96, size * 0.05); ctx.stroke();
      ctx.strokeStyle = '#FE2C55'; ctx.shadowColor = '#FE2C55';
      ctx.beginPath(); ctx.roundRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96, size * 0.05); ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath(); ctx.roundRect(size * 0.12, size * 0.89, size * 0.76, size * 0.07, size * 0.035); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      // TikTok Note Vector Icon
      ctx.fillStyle = '#25F4EE'; ctx.font = `bold ${Math.round(size * 0.06)}px "Inter", sans-serif`;
      ctx.fillText('🎵', cx - 2, size * 0.11);
      ctx.fillStyle = '#FE2C55'; ctx.fillText('🎵', cx + 2, size * 0.11);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'FOLLOW ME').toUpperCase(), cx, size * 0.19);
      ctx.font = `italic 500 ${Math.round(size * 0.035)}px "Georgia", serif`;
      ctx.fillText(texts.subtitle || 'on TikTok', cx, size * 0.25);

      ctx.font = `600 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText('👤  ' + (texts.handle || '@username'), cx, size * 0.935);
    }
  },
  {
    id: 'social_whatsapp',
    name: 'WhatsApp',
    category: 'Social',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'CHAT WITH US' },
      { key: 'subtitle', label: 'Platform', default: 'on WhatsApp' },
      { key: 'handle', label: 'Number', default: '+60 123 456 7890' },
    ],
    preset: { qrColor: '#25D366', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#25D366', eyeOuterColor: '#25D366', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#25D366'); g.addColorStop(1, '#128C7E');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath(); ctx.roundRect(size * 0.12, size * 0.89, size * 0.76, size * 0.07, size * 0.035); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.06)}px "Inter", sans-serif`;
      ctx.fillText('💬', cx, size * 0.11);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'CHAT WITH US').toUpperCase(), cx, size * 0.19);
      ctx.font = `italic 500 ${Math.round(size * 0.035)}px "Georgia", serif`;
      ctx.fillText(texts.subtitle || 'on WhatsApp', cx, size * 0.25);

      ctx.font = `600 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText('📞  ' + (texts.handle || '+60 123 456 7890'), cx, size * 0.935);
    }
  },
  {
    id: 'social_linkedin',
    name: 'LinkedIn',
    category: 'Social',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'CONNECT WITH ME' },
      { key: 'subtitle', label: 'Platform', default: 'on LinkedIn' },
      { key: 'handle', label: 'Profile', default: '/yourprofile' },
    ],
    preset: { qrColor: '#0A66C2', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#0A66C2', eyeOuterColor: '#0A66C2', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#0A66C2'); g.addColorStop(1, '#004182');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath(); ctx.roundRect(size * 0.12, size * 0.89, size * 0.76, size * 0.07, size * 0.035); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `900 ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('in', cx, size * 0.11);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'CONNECT WITH ME').toUpperCase(), cx, size * 0.19);
      ctx.font = `italic 500 ${Math.round(size * 0.035)}px "Georgia", serif`;
      ctx.fillText(texts.subtitle || 'on LinkedIn', cx, size * 0.25);

      ctx.font = `600 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText('👤  ' + (texts.handle || '/yourprofile'), cx, size * 0.935);
    }
  },

  // ─── BUSINESS & ESSENTIALS ──────────────────────────────────────────────────
  {
    id: 'biz_business_card',
    name: 'Business Card',
    category: 'Business',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'BUSINESS CARD' },
      { key: 'subtitle', label: 'Subtitle', default: 'Save Contact' },
      { key: 'cta', label: 'CTA', default: 'Scan to save my contact' },
    ],
    preset: { qrColor: '#B8860B', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#B8860B', eyeOuterColor: '#B8860B', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#C5A059'); g.addColorStop(1, '#8B6914');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      // Contact Circle Icon
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.005;
      ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.038)}px "Inter", sans-serif`;
      ctx.fillText('👤', cx, size * 0.138);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'BUSINESS CARD').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Save Contact', cx, size * 0.27);

      ctx.fillStyle = '#8B6914';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('📱 ' + (texts.cta || 'Scan to save my contact'), cx, size * 0.935);
    }
  },
  {
    id: 'biz_website',
    name: 'Website',
    category: 'Business',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'WEBSITE' },
      { key: 'subtitle', label: 'Subtitle', default: 'Visit Our Website' },
      { key: 'url', label: 'URL', default: 'www.yourwebsite.com' },
    ],
    preset: { qrColor: '#0052CC', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#0052CC', eyeOuterColor: '#0052CC', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#2684FF'); g.addColorStop(1, '#0052CC');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.005;
      ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.038)}px "Inter", sans-serif`;
      ctx.fillText('🌐', cx, size * 0.138);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'WEBSITE').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Visit Our Website', cx, size * 0.27);

      ctx.fillStyle = '#0052CC';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('🌐 ' + (texts.url || 'www.yourwebsite.com'), cx, size * 0.935);
    }
  },
  {
    id: 'biz_location',
    name: 'Location',
    category: 'Business',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'LOCATION' },
      { key: 'subtitle', label: 'Subtitle', default: 'Find Us Here' },
      { key: 'cta', label: 'CTA', default: 'Scan for location' },
    ],
    preset: { qrColor: '#2E7D32', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#2E7D32', eyeOuterColor: '#2E7D32', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#4CAF50'); g.addColorStop(1, '#2E7D32');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FF5252'; ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.038)}px "Inter", sans-serif`;
      ctx.fillText('📍', cx, size * 0.138);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'LOCATION').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Find Us Here', cx, size * 0.27);

      ctx.fillStyle = '#2E7D32';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('📍 ' + (texts.cta || 'Scan for location'), cx, size * 0.935);
    }
  },
  {
    id: 'biz_email',
    name: 'Email',
    category: 'Business',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'EMAIL' },
      { key: 'subtitle', label: 'Subtitle', default: 'Send Us an Email' },
      { key: 'email', label: 'Email Address', default: 'info@example.com' },
    ],
    preset: { qrColor: '#6A1B9A', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#6A1B9A', eyeOuterColor: '#6A1B9A', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#9C27B0'); g.addColorStop(1, '#6A1B9A');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.005;
      ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.038)}px "Inter", sans-serif`;
      ctx.fillText('✉️', cx, size * 0.138);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'EMAIL').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Send Us an Email', cx, size * 0.27);

      ctx.fillStyle = '#6A1B9A';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('✉️ ' + (texts.email || 'info@example.com'), cx, size * 0.935);
    }
  },
  {
    id: 'biz_wifi',
    name: 'Wi-Fi',
    category: 'Business',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'WI-FI' },
      { key: 'subtitle', label: 'Subtitle', default: 'Connect to Wi-Fi' },
      { key: 'cta', label: 'CTA', default: 'Scan to connect' },
    ],
    preset: { qrColor: '#0277BD', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#0277BD', eyeOuterColor: '#0277BD', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#03A9F4'); g.addColorStop(1, '#0277BD');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.005;
      ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.038)}px "Inter", sans-serif`;
      ctx.fillText('📶', cx, size * 0.138);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'WI-FI').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Connect to Wi-Fi', cx, size * 0.27);

      ctx.fillStyle = '#0277BD';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('📶 ' + (texts.cta || 'Scan to connect'), cx, size * 0.935);
    }
  },
  {
    id: 'biz_call_us',
    name: 'Call Us',
    category: 'Business',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'CALL US' },
      { key: 'subtitle', label: 'Subtitle', default: 'Tap to Call' },
      { key: 'phone', label: 'Phone Number', default: '+60 123 456 7890' },
    ],
    preset: { qrColor: '#1B5E20', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#1B5E20', eyeOuterColor: '#1B5E20', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#4CAF50'); g.addColorStop(1, '#1B5E20');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.005;
      ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.038)}px "Inter", sans-serif`;
      ctx.fillText('📞', cx, size * 0.138);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'CALL US').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Tap to Call', cx, size * 0.27);

      ctx.fillStyle = '#1B5E20';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('📞 ' + (texts.phone || '+60 123 456 7890'), cx, size * 0.935);
    }
  },

  // ─── PAYMENTS ───────────────────────────────────────────────────────────────
  {
    id: 'pay_paypal',
    name: 'PayPal',
    category: 'Payments',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'PAYPAL' },
      { key: 'subtitle', label: 'Subtitle', default: 'Secure Payment' },
      { key: 'cta', label: 'CTA', default: 'Scan to Pay' },
    ],
    preset: { qrColor: '#003087', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#003087', eyeOuterColor: '#003087', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#0079C1'); g.addColorStop(1, '#003087');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = size * 0.005;
      ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold italic ${Math.round(size * 0.04)}px "Georgia", serif`;
      ctx.fillText('P', cx, size * 0.138);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'PAYPAL').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Secure Payment', cx, size * 0.27);

      ctx.fillStyle = '#003087';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('💳 ' + (texts.cta || 'Scan to Pay'), cx, size * 0.935);
    }
  },
  {
    id: 'pay_duitnow',
    name: 'DuitNow',
    category: 'Payments',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'DUITNOW' },
      { key: 'subtitle', label: 'Subtitle', default: 'Malaysia QR' },
      { key: 'cta', label: 'CTA', default: 'Scan to Pay' },
    ],
    preset: { qrColor: '#ED1C24', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#ED1C24', eyeOuterColor: '#ED1C24', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#FF4D4D'); g.addColorStop(1, '#ED1C24');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(cx, size * 0.125, size * 0.04, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ED1C24'; ctx.font = `bold ${Math.round(size * 0.035)}px "Inter", sans-serif`;
      ctx.fillText('D', cx, size * 0.138);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'DUITNOW').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Malaysia QR', cx, size * 0.27);

      ctx.fillStyle = '#ED1C24';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('💳 ' + (texts.cta || 'Scan to Pay'), cx, size * 0.935);
    }
  },
  {
    id: 'pay_upi',
    name: 'UPI Payment',
    category: 'Payments',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'UPI PAYMENT' },
      { key: 'subtitle', label: 'Subtitle', default: 'Scan & Pay' },
      { key: 'cta', label: 'CTA', default: 'Scan to Pay' },
    ],
    preset: { qrColor: '#000000', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#000000', eyeOuterColor: '#000000', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = size * 0.006; ctx.shadowColor = '#D4AF37'; ctx.shadowBlur = size * 0.02;
      ctx.beginPath(); ctx.roundRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96, size * 0.05); ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#D4AF37'; ctx.font = `bold italic ${Math.round(size * 0.045)}px "Inter", sans-serif`;
      ctx.fillText('UPI ▶', cx, size * 0.13);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'UPI PAYMENT').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Scan & Pay', cx, size * 0.27);

      ctx.fillStyle = '#D4AF37';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('💳 ' + (texts.cta || 'Scan to Pay'), cx, size * 0.935);
    }
  },
  {
    id: 'pay_alipay',
    name: 'Alipay',
    category: 'Payments',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'ALIPAY' },
      { key: 'subtitle', label: 'Subtitle', default: 'Easy Payment' },
      { key: 'cta', label: 'CTA', default: 'Scan to Pay' },
    ],
    preset: { qrColor: '#1677FF', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#1677FF', eyeOuterColor: '#1677FF', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#4096FF'); g.addColorStop(1, '#1677FF');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.06)}px "Inter", sans-serif`;
      ctx.fillText('支', cx, size * 0.125);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'ALIPAY').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Easy Payment', cx, size * 0.27);

      ctx.fillStyle = '#1677FF';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('💳 ' + (texts.cta || 'Scan to Pay'), cx, size * 0.935);
    }
  },
  {
    id: 'pay_wechat',
    name: 'WeChat Pay',
    category: 'Payments',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'WECHAT PAY' },
      { key: 'subtitle', label: 'Subtitle', default: 'Safe & Easy' },
      { key: 'cta', label: 'CTA', default: 'Scan to Pay' },
    ],
    preset: { qrColor: '#07C160', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#07C160', eyeOuterColor: '#07C160', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#38D479'); g.addColorStop(1, '#07C160');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('💬', cx, size * 0.125);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'WECHAT PAY').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Safe & Easy', cx, size * 0.27);

      ctx.fillStyle = '#07C160';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('💳 ' + (texts.cta || 'Scan to Pay'), cx, size * 0.935);
    }
  },
  {
    id: 'pay_cashapp',
    name: 'Cash App',
    category: 'Payments',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'CASH APP' },
      { key: 'subtitle', label: 'Subtitle', default: 'Send Money' },
      { key: 'cta', label: 'CTA', default: 'Scan to Pay' },
    ],
    preset: { qrColor: '#00D632', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#00D632', eyeOuterColor: '#00D632', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#00E636'); g.addColorStop(1, '#00B32A');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `900 ${Math.round(size * 0.06)}px "Inter", sans-serif`;
      ctx.fillText('$', cx, size * 0.125);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'CASH APP').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Send Money', cx, size * 0.27);

      ctx.fillStyle = '#00B32A';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('💳 ' + (texts.cta || 'Scan to Pay'), cx, size * 0.935);
    }
  },

  // ─── FOOD & HOSPITALITY ──────────────────────────────────────────────────────
  {
    id: 'food_restaurant',
    name: 'Restaurant',
    category: 'Food',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'RESTAURANT' },
      { key: 'subtitle', label: 'Subtitle', default: 'View Our Menu' },
      { key: 'cta', label: 'CTA', default: 'Scan for Menu' },
    ],
    preset: { qrColor: '#8D4004', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#8D4004', eyeOuterColor: '#8D4004', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#5A2A02'); g.addColorStop(1, '#2A1200');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = size * 0.006; ctx.shadowColor = '#D4AF37'; ctx.shadowBlur = size * 0.02;
      ctx.beginPath(); ctx.roundRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96, size * 0.05); ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#D4AF37'; ctx.font = `bold ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('🍴', cx, size * 0.13);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'RESTAURANT').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'View Our Menu', cx, size * 0.27);

      ctx.fillStyle = '#5A2A02';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('🍷 ' + (texts.cta || 'Scan for Menu'), cx, size * 0.935);
    }
  },
  {
    id: 'food_cafe',
    name: 'Café Menu',
    category: 'Food',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'CAFÉ MENU' },
      { key: 'subtitle', label: 'Subtitle', default: 'Order & Enjoy' },
      { key: 'cta', label: 'CTA', default: 'Scan for Menu' },
    ],
    preset: { qrColor: '#4A2E19', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#4A2E19', eyeOuterColor: '#4A2E19', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#795548'); g.addColorStop(1, '#3E2723');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('☕', cx, size * 0.13);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'CAFÉ MENU').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Order & Enjoy', cx, size * 0.27);

      ctx.fillStyle = '#3E2723';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('☕ ' + (texts.cta || 'Scan for Menu'), cx, size * 0.935);
    }
  },
  {
    id: 'food_table_qr',
    name: 'Table QR',
    category: 'Food',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'TABLE QR' },
      { key: 'subtitle', label: 'Subtitle', default: 'Order from Table' },
      { key: 'cta', label: 'CTA', default: 'Scan to Order' },
    ],
    preset: { qrColor: '#000000', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#000000', eyeOuterColor: '#000000', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle = '#1A150E'; ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = size * 0.006; ctx.shadowColor = '#D4AF37'; ctx.shadowBlur = size * 0.02;
      ctx.beginPath(); ctx.roundRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96, size * 0.05); ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#D4AF37'; ctx.font = `bold ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('🔔', cx, size * 0.13);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'TABLE QR').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Order from Table', cx, size * 0.27);

      ctx.fillStyle = '#D4AF37';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('🍽️ ' + (texts.cta || 'Scan to Order'), cx, size * 0.935);
    }
  },
  {
    id: 'food_hotel',
    name: 'Hotel',
    category: 'Food',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'HOTEL' },
      { key: 'subtitle', label: 'Subtitle', default: 'Explore & Book' },
      { key: 'cta', label: 'CTA', default: 'Scan to Explore' },
    ],
    preset: { qrColor: '#00695C', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', eyeColor: '#00695C', eyeOuterColor: '#00695C', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#00897B'); g.addColorStop(1, '#004D40');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('🏨', cx, size * 0.13);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'HOTEL').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Explore & Book', cx, size * 0.27);

      ctx.fillStyle = '#004D40';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('🏨 ' + (texts.cta || 'Scan to Explore'), cx, size * 0.935);
    }
  },
  {
    id: 'food_review_us',
    name: 'Review Us',
    category: 'Food',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'REVIEW US' },
      { key: 'subtitle', label: 'Subtitle', default: 'We Value Your Feedback' },
      { key: 'cta', label: 'CTA', default: 'Scan to Review' },
    ],
    preset: { qrColor: '#000000', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#000000', eyeOuterColor: '#000000', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.strokeStyle = '#FFB300'; ctx.lineWidth = size * 0.006; ctx.shadowColor = '#FFB300'; ctx.shadowBlur = size * 0.02;
      ctx.beginPath(); ctx.roundRect(size * 0.02, size * 0.02, size * 0.96, size * 0.96, size * 0.05); ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFB300'; ctx.font = `bold ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('⭐', cx, size * 0.13);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'REVIEW US').toUpperCase(), cx, size * 0.22);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'We Value Your Feedback', cx, size * 0.27);

      ctx.fillStyle = '#FFB300';
      ctx.font = `600 ${Math.round(size * 0.025)}px "Inter", sans-serif`;
      ctx.fillText('⭐ ' + (texts.cta || 'Scan to Review'), cx, size * 0.935);
    }
  },
  {
    id: 'food_wifi_access',
    name: 'Wi-Fi Access',
    category: 'Food',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.58,
    texts: [
      { key: 'title', label: 'Title', default: 'WI-FI ACCESS' },
      { key: 'subtitle', label: 'Subtitle', default: 'Connect Easily' },
      { key: 'cta', label: 'CTA', default: 'Scan to Connect' },
    ],
    preset: { qrColor: '#1565C0', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', eyeColor: '#1565C0', eyeOuterColor: '#1565C0', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, 0, size);
      g.addColorStop(0, '#1E88E5'); g.addColorStop(1, '#0D47A1');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

      ctx.save(); ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size * 0.08, size * 0.34, size * 0.84, size * 0.54, size * 0.06); ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign = 'center'; const cx = size * 0.5;

      ctx.fillStyle = '#FFFFFF'; ctx.font = `bold ${Math.round(size * 0.055)}px "Inter", sans-serif`;
      ctx.fillText('📶', cx, size * 0.13);

      ctx.font = `bold ${Math.round(size * 0.038)}px "Outfit", "Inter", sans-serif`;
      ctx.fillText((texts.title || 'WI-FI ACCESS').toUpperCase(), cx, size * 0.22);
      ctx.font = `500 ${Math.round(size * 0.026)}px "Inter", sans-serif`;
      ctx.fillText(texts.subtitle || 'Connect Easily', cx, size * 0.27);

      ctx.fillStyle = '#0D47A1';
      ctx.font = `600 ${Math.round(size * 0.024)}px "Inter", sans-serif`;
      ctx.fillText('📶 ' + (texts.cta || 'Scan to Connect'), cx, size * 0.935);
    }
  }
];


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

