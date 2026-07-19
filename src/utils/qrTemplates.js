// ─── QR Code Vector Templates ───────────────────────────────────────────────

export const QR_TEMPLATES = [
  {
    id: 'ai_facebook',
    name: 'Facebook AI',
    category: 'Hot',
    qrSize: 0.365,
    qrX: 0.505,
    qrY: 0.59,
    preset: {
      qrColor: '#1877F2',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false,
      qrData: 'Hello User'
    },
    imageObj: null,
    drawBackground: function(ctx, size) {
      if (!this.imageObj) {
        this.imageObj = new Image();
        this.imageObj.src = '/presets/fb_template.png';
        this.imageObj.onload = () => {
          window.dispatchEvent(new CustomEvent('qr-template-loaded'));
        };
      }
      if (this.imageObj.complete && this.imageObj.naturalWidth !== 0) {
        ctx.drawImage(this.imageObj, 0, 0, size, size);
      } else {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, '#1877F2');
        grad.addColorStop(1, '#0b3c80');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
    },
    drawForeground: (ctx, size) => {}
  },
  {
    id: 'ai_instagram',
    name: 'Instagram AI',
    category: 'Hot',
    qrSize: 0.365,
    qrX: 0.5,
    qrY: 0.59,
    preset: {
      qrColor: '#E4405F',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      bgTransparent: false,
      qrData: 'Hello User'
    },
    imageObj: null,
    drawBackground: function(ctx, size) {
      if (!this.imageObj) {
        this.imageObj = new Image();
        this.imageObj.src = '/presets/ig_template.png';
        this.imageObj.onload = () => {
          window.dispatchEvent(new CustomEvent('qr-template-loaded'));
        };
      }
      if (this.imageObj.complete && this.imageObj.naturalWidth !== 0) {
        ctx.drawImage(this.imageObj, 0, 0, size, size);
      } else {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, '#C13584');
        grad.addColorStop(1, '#F77737');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
    },
    drawForeground: (ctx, size) => {}
  },
  {
    id: 'ai_x',
    name: 'X AI',
    category: 'Hot',
    qrSize: 0.365,
    qrX: 0.5,
    qrY: 0.59,
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false,
      qrData: 'Hello User'
    },
    imageObj: null,
    drawBackground: function(ctx, size) {
      if (!this.imageObj) {
        this.imageObj = new Image();
        this.imageObj.src = '/presets/x_template.png';
        this.imageObj.onload = () => {
          window.dispatchEvent(new CustomEvent('qr-template-loaded'));
        };
      }
      if (this.imageObj.complete && this.imageObj.naturalWidth !== 0) {
        ctx.drawImage(this.imageObj, 0, 0, size, size);
      } else {
        ctx.fillStyle = '#15202B';
        ctx.fillRect(0, 0, size, size);
      }
    },
    drawForeground: (ctx, size) => {}
  },
  {
    id: 'ai_linkedin',
    name: 'LinkedIn AI',
    category: 'Hot',
    qrSize: 0.365,
    qrX: 0.49,
    qrY: 0.59,
    preset: {
      qrColor: '#0A66C2',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false,
      qrData: 'Hello User'
    },
    imageObj: null,
    drawBackground: function(ctx, size) {
      if (!this.imageObj) {
        this.imageObj = new Image();
        this.imageObj.src = '/presets/linkedin_template.png';
        this.imageObj.onload = () => {
          window.dispatchEvent(new CustomEvent('qr-template-loaded'));
        };
      }
      if (this.imageObj.complete && this.imageObj.naturalWidth !== 0) {
        ctx.drawImage(this.imageObj, 0, 0, size, size);
      } else {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, '#0A66C2');
        grad.addColorStop(1, '#053361');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
    },
    drawForeground: (ctx, size) => {}
  },
  {
    id: 'ai_threads',
    name: 'Threads AI',
    category: 'Hot',
    qrSize: 0.365,
    qrX: 0.49,
    qrY: 0.59,
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      bgTransparent: false,
      qrData: 'Hello User'
    },
    imageObj: null,
    drawBackground: function(ctx, size) {
      if (!this.imageObj) {
        this.imageObj = new Image();
        this.imageObj.src = '/presets/threads_template.png';
        this.imageObj.onload = () => {
          window.dispatchEvent(new CustomEvent('qr-template-loaded'));
        };
      }
      if (this.imageObj.complete && this.imageObj.naturalWidth !== 0) {
        ctx.drawImage(this.imageObj, 0, 0, size, size);
      } else {
        ctx.fillStyle = '#101010';
        ctx.fillRect(0, 0, size, size);
      }
    },
    drawForeground: (ctx, size) => {}
  },
  {
    id: 'ai_google',
    name: 'Google AI',
    category: 'Hot',
    qrSize: 0.365,
    qrX: 0.5,
    qrY: 0.59,
    preset: {
      qrColor: '#4285F4',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false,
      qrData: 'Hello User'
    },
    imageObj: null,
    drawBackground: function(ctx, size) {
      if (!this.imageObj) {
        this.imageObj = new Image();
        this.imageObj.src = '/presets/google_template.png';
        this.imageObj.onload = () => {
          window.dispatchEvent(new CustomEvent('qr-template-loaded'));
        };
      }
      if (this.imageObj.complete && this.imageObj.naturalWidth !== 0) {
        ctx.drawImage(this.imageObj, 0, 0, size, size);
      } else {
        ctx.fillStyle = '#F8F9FA';
        ctx.fillRect(0, 0, size, size);
      }
    },
    drawForeground: (ctx, size) => {}
  },
  {
    id: 'instagram',
    name: 'Instagram Card',
    category: 'Social',
    qrSize: 0.52,
    qrX: 0.5,
    qrY: 0.55,
    preset: {
      qrColor: '#D6001C',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      eyeColor: '#C13584',
      eyeOuterColor: '#E1306C',
      logo: 'instagram',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Warm Instagram mesh gradient
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#F91B7F');
      grad.addColorStop(0.4, '#C13584');
      grad.addColorStop(0.8, '#FFDC80');
      grad.addColorStop(1, '#833AB4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Rounded white card with drop shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = size * 0.04;
      ctx.shadowOffsetY = size * 0.02;
      ctx.fillStyle = '#FFFFFF';
      
      const cardW = size * 0.76;
      const cardH = size * 0.78;
      const cardX = (size - cardW) / 2;
      const cardY = size * 0.12;
      
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, size * 0.06);
      ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size) => {
      // Draw Instagram logo icon inside the card
      const cx = size * 0.5;
      const cy = size * 0.22;
      const r = size * 0.035;

      ctx.strokeStyle = 'url(#igGrad)'; // Fallback to gradient color or solid pink
      const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      grad.addColorStop(0, '#405DE6');
      grad.addColorStop(0.5, '#E1306C');
      grad.addColorStop(1, '#F77737');
      ctx.strokeStyle = grad;
      ctx.lineWidth = size * 0.008;

      // Outer Camera box
      ctx.beginPath();
      ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * 0.55);
      ctx.stroke();

      // Camera lens
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
      ctx.stroke();

      // Flash dot
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx + r * 0.5, cy - r * 0.5, r * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Card Header Text
      ctx.fillStyle = '#1e293b';
      ctx.font = `bold ${Math.round(size * 0.042)}px "Outfit", "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Instagram', size * 0.5, size * 0.32);

      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${Math.round(size * 0.02)}px "Inter", sans-serif`;
      ctx.fillText('SCAN TO FOLLOW ME', size * 0.5, size * 0.36);
    }
  },
  {
    id: 'facebook',
    name: 'Facebook Banner',
    category: 'Social',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.56,
    preset: {
      qrColor: '#1877F2',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      eyeColor: '#1877F2',
      eyeOuterColor: '#1877F2',
      logo: 'facebook',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Branded Facebook Blue
      ctx.fillStyle = '#1877F2';
      ctx.fillRect(0, 0, size, size);

      // Clean card
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = size * 0.03;
      ctx.fillStyle = '#FFFFFF';
      
      const cardW = size * 0.74;
      const cardH = size * 0.76;
      ctx.beginPath();
      ctx.roundRect((size - cardW) / 2, size * 0.14, cardW, cardH, size * 0.05);
      ctx.fill();
      ctx.restore();
    },
    drawForeground: (ctx, size) => {
      // Facebook branded header
      const cx = size * 0.5;
      const cy = size * 0.24;
      const r = size * 0.04;

      // Facebook circle icon
      ctx.fillStyle = '#1877F2';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Facebook "f" letter
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.065)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('f', cx + size * 0.008, cy + size * 0.004);

      // Text
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(size * 0.042)}px "Inter", sans-serif`;
      ctx.fillText('facebook', size * 0.5, size * 0.33);

      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${Math.round(size * 0.02)}px "Inter", sans-serif`;
      ctx.fillText('CONNECT WITH US', size * 0.5, size * 0.37);
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Connect',
    category: 'Social',
    qrSize: 0.52,
    qrX: 0.5,
    qrY: 0.54,
    preset: {
      qrColor: '#0A66C2',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'rounded',
      eyeColor: '#0A66C2',
      eyeOuterColor: '#0A66C2',
      logo: 'linkedin',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, size);
      grad.addColorStop(0, '#004182');
      grad.addColorStop(1, '#0A66C2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // White card
      ctx.fillStyle = '#FFFFFF';
      const cardW = size * 0.78;
      const cardH = size * 0.78;
      ctx.beginPath();
      ctx.roundRect((size - cardW) / 2, size * 0.11, cardW, cardH, size * 0.04);
      ctx.fill();
    },
    drawForeground: (ctx, size) => {
      // LinkedIn branded logo text
      ctx.fillStyle = '#0A66C2';
      ctx.font = `bold ${Math.round(size * 0.042)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Linked', size * 0.44, size * 0.22);

      // In box
      const boxSize = size * 0.055;
      ctx.fillStyle = '#0A66C2';
      ctx.beginPath();
      ctx.roundRect(size * 0.51, size * 0.178, boxSize, boxSize, size * 0.008);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.042)}px "Inter", sans-serif`;
      ctx.fillText('in', size * 0.538, size * 0.22);

      ctx.fillStyle = '#475569';
      ctx.font = `700 ${Math.round(size * 0.02)}px "Inter", sans-serif`;
      ctx.fillText('SCAN TO VIEW PROFILE', size * 0.5, size * 0.27);
    }
  },
  {
    id: 'youtube',
    name: 'YouTube Play',
    category: 'Social',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.56,
    preset: {
      qrColor: '#FF0000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      eyeColor: '#FF0000',
      eyeOuterColor: '#FF0000',
      logo: 'youtube',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#FFFFFF';
      const cardW = size * 0.76;
      const cardH = size * 0.76;
      ctx.beginPath();
      ctx.roundRect((size - cardW) / 2, size * 0.14, cardW, cardH, size * 0.05);
      ctx.fill();
    },
    drawForeground: (ctx, size) => {
      const cx = size * 0.5;
      const cy = size * 0.24;

      // Play button shape
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.roundRect(cx - size * 0.05, cy - size * 0.035, size * 0.1, size * 0.07, size * 0.016);
      ctx.fill();

      // Triangle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.012, cy - size * 0.018);
      ctx.lineTo(cx + size * 0.018, cy);
      ctx.lineTo(cx - size * 0.012, cy + size * 0.018);
      ctx.closePath();
      ctx.fill();

      // Brand Title
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${Math.round(size * 0.045)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('YouTube', size * 0.5, size * 0.34);

      ctx.fillStyle = '#dc2626';
      ctx.font = `800 ${Math.round(size * 0.02)}px "Inter", sans-serif`;
      ctx.fillText('WATCH & SUBSCRIBE', size * 0.5, size * 0.38);
    }
  },
  {
    id: 'wifi_modern',
    name: 'WiFi Connect',
    category: 'Wifi',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.54,
    preset: {
      qrColor: '#059669',
      bgColor: '#FFFFFF',
      dotStyle: 'dots',
      eyeStyle: 'rounded',
      eyeColor: '#059669',
      eyeOuterColor: '#10B981',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Emerald background
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(1, '#059669');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Card
      ctx.fillStyle = '#FFFFFF';
      const cardW = size * 0.80;
      const cardH = size * 0.80;
      ctx.beginPath();
      ctx.roundRect((size - cardW) / 2, size * 0.10, cardW, cardH, size * 0.06);
      ctx.fill();
    },
    drawForeground: (ctx, size) => {
      const cx = size * 0.5;
      const cy = size * 0.20;

      // WiFi waves icon
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = size * 0.008;
      ctx.lineCap = 'round';

      // Dot
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(cx, cy + size * 0.02, size * 0.008, 0, Math.PI * 2);
      ctx.fill();

      // Wave 1
      ctx.beginPath();
      ctx.arc(cx, cy + size * 0.02, size * 0.025, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();

      // Wave 2
      ctx.beginPath();
      ctx.arc(cx, cy + size * 0.02, size * 0.045, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();

      // Texts
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${Math.round(size * 0.045)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('FREE WIFI NETWORK', size * 0.5, size * 0.30);

      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${Math.round(size * 0.022)}px "Inter", sans-serif`;
      ctx.fillText('SCAN TO CONNECT INSTANTLY', size * 0.5, size * 0.84);
    }
  },
  {
    id: 'scanme_classic',
    name: 'Classic Scan Me',
    category: 'Hot',
    qrSize: 0.54,
    qrX: 0.5,
    qrY: 0.42,
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      eyeColor: '#000000',
      eyeOuterColor: '#000000',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Light grey layout
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, size, size);

      // Centered card
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = size * 0.01;
      
      const cardW = size * 0.74;
      const cardH = size * 0.82;
      const cardX = (size - cardW) / 2;
      const cardY = size * 0.09;

      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, size * 0.04);
      ctx.fill();
      ctx.stroke();

      // Bottom black tag
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.roundRect(cardX + size * 0.04, cardY + cardH - size * 0.14, cardW - size * 0.08, size * 0.10, size * 0.016);
      ctx.fill();
    },
    drawForeground: (ctx, size) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(size * 0.045)}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SCAN ME', size * 0.5, size * 0.84);
    }
  },
  {
    id: 'scanme_blue',
    name: 'Modern Blue Frame',
    category: 'Hot',
    qrSize: 0.54,
    qrX: 0.5,
    qrY: 0.50,
    preset: {
      qrColor: '#1E40AF',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      eyeColor: '#1E40AF',
      eyeOuterColor: '#3B82F6',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, size, size);

      // Blue outlined card
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = size * 0.015;

      const cardW = size * 0.72;
      const cardH = size * 0.84;
      ctx.beginPath();
      ctx.roundRect((size - cardW) / 2, size * 0.08, cardW, cardH, size * 0.08);
      ctx.fill();
      ctx.stroke();
    },
    drawForeground: (ctx, size) => {
      // Header tag
      ctx.fillStyle = '#3B82F6';
      ctx.font = `900 ${Math.round(size * 0.045)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('SCAN ME', size * 0.5, size * 0.18);
    }
  },
  {
    id: 'golden_luxury',
    name: 'Golden Luxury',
    category: 'Hot',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.50,
    preset: {
      qrColor: '#D4AF37',
      bgColor: '#111827',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      eyeColor: '#F3E5AB',
      eyeOuterColor: '#D4AF37',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Deep dark blue/charcoal background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, size, size);

      // Outer gold border lines
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = size * 0.005;
      ctx.strokeRect(size * 0.06, size * 0.06, size * 0.88, size * 0.88);

      // Inner card
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(size * 0.12, size * 0.12, size * 0.76, size * 0.76);
      ctx.strokeRect(size * 0.12, size * 0.12, size * 0.76, size * 0.76);
    },
    drawForeground: (ctx, size) => {
      // Elegant gold ornaments or text
      ctx.fillStyle = '#F8FAFC';
      ctx.font = `italic 700 ${Math.round(size * 0.038)}px "Georgia", serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Exclusive Access', size * 0.5, size * 0.20);

      ctx.fillStyle = '#D4AF37';
      ctx.font = `600 ${Math.round(size * 0.018)}px "Inter", sans-serif`;
      ctx.fillText('GOLDEN PASS SCAN', size * 0.5, size * 0.80);
    }
  },
  {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    category: 'Hot',
    qrSize: 0.52,
    qrX: 0.5,
    qrY: 0.50,
    preset: {
      qrColor: '#00F0FF',
      bgColor: '#05050A',
      dotStyle: 'square',
      eyeStyle: 'square',
      eyeColor: '#FF007A',
      eyeOuterColor: '#00F0FF',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Dark space background
      ctx.fillStyle = '#05050C';
      ctx.fillRect(0, 0, size, size);

      // Cyber grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      const step = size / 20;
      for (let i = 0; i < size; i += step) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
      }

      // Neon frame
      ctx.save();
      ctx.shadowColor = '#FF007A';
      ctx.shadowBlur = size * 0.03;
      ctx.strokeStyle = '#FF007A';
      ctx.lineWidth = size * 0.008;
      
      const frameSize = size * 0.78;
      ctx.strokeRect((size - frameSize) / 2, (size - frameSize) / 2, frameSize, frameSize);
      ctx.restore();
    },
    drawForeground: (ctx, size) => {
      ctx.fillStyle = '#00F0FF';
      ctx.font = `bold ${Math.round(size * 0.035)}px "monospace"`;
      ctx.textAlign = 'center';
      ctx.fillText(':: SYSTEM ACCESS ::', size * 0.5, size * 0.20);
    }
  },
  {
    id: 'floral',
    name: 'Floral Bouquet',
    category: 'Event',
    qrSize: 0.52,
    qrX: 0.5,
    qrY: 0.50,
    preset: {
      qrColor: '#701A75',
      bgColor: '#FFFFFF',
      dotStyle: 'dots',
      eyeStyle: 'rounded',
      eyeColor: '#701A75',
      eyeOuterColor: '#D946EF',
      bgTransparent: true
    },
    drawBackground: (ctx, size) => {
      // Soft peach/pink gradient
      const grad = ctx.createLinearGradient(0, 0, 0, size);
      grad.addColorStop(0, '#FFF1F2');
      grad.addColorStop(1, '#FFE4E6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Clean rounded card
      ctx.fillStyle = '#FFFFFF';
      const cardSize = size * 0.76;
      ctx.beginPath();
      ctx.roundRect((size - cardSize) / 2, (size - cardSize) / 2, cardSize, cardSize, size * 0.1);
      ctx.fill();

      // Watercolor style corner flowers
      // Top Left flowers
      ctx.fillStyle = 'rgba(217, 70, 239, 0.18)';
      ctx.beginPath(); ctx.arc(size * 0.1, size * 0.1, size * 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
      ctx.beginPath(); ctx.arc(size * 0.2, size * 0.08, size * 0.1, 0, Math.PI * 2); ctx.fill();

      // Bottom Right flowers
      ctx.fillStyle = 'rgba(217, 70, 239, 0.18)';
      ctx.beginPath(); ctx.arc(size * 0.9, size * 0.9, size * 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
      ctx.beginPath(); ctx.arc(size * 0.8, size * 0.92, size * 0.1, 0, Math.PI * 2); ctx.fill();
    },
    drawForeground: (ctx, size) => {
      ctx.fillStyle = '#4A044E';
      ctx.font = `italic bold ${Math.round(size * 0.038)}px "Georgia", serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Scan & Join Us', size * 0.5, size * 0.20);
    }
  }
];
