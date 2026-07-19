// ─── QR Code Vector Templates ───────────────────────────────────────────────

export const QR_TEMPLATES = [
  {
    id: 'ai_facebook',
    name: 'Facebook AI',
    category: 'Hot',
    qrSize: 0.52,
    qrX: 0.50,
    qrY: 0.57,
    preset: {
      qrColor: '#1877F2',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false
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
    qrSize: 0.42,
    qrX: 0.50,
    qrY: 0.61,
    preset: {
      qrColor: '#E4405F',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      bgTransparent: false
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
    qrSize: 0.50,
    qrX: 0.49,
    qrY: 0.62,
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false
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
    qrSize: 0.38,
    qrX: 0.50,
    qrY: 0.64,
    preset: {
      qrColor: '#0A66C2',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false
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
    qrSize: 0.43,
    qrX: 0.49,
    qrY: 0.62,
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      bgTransparent: false
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
    qrSize: 0.48,
    qrX: 0.49,
    qrY: 0.62,
    preset: {
      qrColor: '#4285F4',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square',
      bgTransparent: false
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
  }
];
