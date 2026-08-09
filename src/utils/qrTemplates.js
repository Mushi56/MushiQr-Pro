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
        this.imageObj.src = '/presets/fb_template.webp';
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
        this.imageObj.src = '/presets/ig_template.webp';
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
        this.imageObj.src = '/presets/x_template.webp';
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
        this.imageObj.src = '/presets/linkedin_template.webp';
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
        this.imageObj.src = '/presets/threads_template.webp';
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
        this.imageObj.src = '/presets/google_template.webp';
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

  // ─── NEW: Hot Templates ──────────────────────────────────────────────────────
  {
    id: 'neon_pulse',
    name: 'Neon Pulse',
    category: 'Hot',
    qrSize: 0.52,
    qrX: 0.5,
    qrY: 0.54,
    texts: [
      { key: 'title',    label: 'Title',    default: 'SCAN ME NOW' },
      { key: 'subtitle', label: 'Subtitle', default: 'Join the experience' },
    ],
    preset: { qrColor: '#00F0FF', bgColor: '#0A0A1A', dotStyle: 'dots', eyeStyle: 'circle', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle = '#060612'; ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(0,240,255,0.07)'; ctx.lineWidth = 1;
      const step = size / 12;
      for (let i = 0; i <= 12; i++) {
        ctx.beginPath(); ctx.moveTo(i*step,0); ctx.lineTo(i*step,size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i*step); ctx.lineTo(size,i*step); ctx.stroke();
      }
      ctx.save(); ctx.shadowColor='#00F0FF'; ctx.shadowBlur=size*0.06;
      ctx.strokeStyle='rgba(0,240,255,0.6)'; ctx.lineWidth=size*0.006;
      ctx.beginPath(); ctx.roundRect(size*0.08,size*0.08,size*0.84,size*0.84,size*0.04); ctx.stroke(); ctx.restore();
    },
    drawForeground: (ctx, size, texts = {}) => {
      const title = texts.title || 'SCAN ME NOW';
      const sub   = texts.subtitle || 'Join the experience';
      ctx.textAlign='center';
      ctx.save(); ctx.shadowColor='#00F0FF'; ctx.shadowBlur=size*0.04;
      ctx.fillStyle='#00F0FF'; ctx.font=`800 ${Math.round(size*0.046)}px "Inter",sans-serif`;
      ctx.fillText(title, size*0.5, size*0.18); ctx.restore();
      ctx.fillStyle='rgba(0,240,255,0.6)'; ctx.font=`600 ${Math.round(size*0.022)}px "Inter",sans-serif`;
      ctx.fillText(sub.toUpperCase(), size*0.5, size*0.86);
    }
  },
  {
    id: 'glass_card',
    name: 'Glass Card',
    category: 'Hot',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.55,
    texts: [
      { key: 'title',    label: 'Title',   default: 'SCAN TO CONNECT' },
      { key: 'subtitle', label: 'Tagline', default: 'Powered by MushiQR' },
    ],
    preset: { qrColor: '#FFFFFF', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,size,size);
      g.addColorStop(0,'#7c3aed'); g.addColorStop(0.5,'#c026d3'); g.addColorStop(1,'#db2777');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.save(); ctx.globalAlpha=0.2; ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.arc(size*0.2,size*0.2,size*0.25,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(size*0.8,size*0.8,size*0.20,0,Math.PI*2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha=0.18; ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.09,size*0.82,size*0.82,size*0.06); ctx.fill(); ctx.restore();
      ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=size*0.005;
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.09,size*0.82,size*0.82,size*0.06); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`800 ${Math.round(size*0.044)}px "Inter",sans-serif`;
      ctx.fillText(texts.title||'SCAN TO CONNECT', size*0.5, size*0.19);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.subtitle||'Powered by MushiQR', size*0.5, size*0.875);
    }
  },
  {
    id: 'cyber_frame',
    name: 'Cyber Frame',
    category: 'Hot',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.54,
    texts: [
      { key: 'title', label: 'Title', default: 'ACCESS GRANTED' },
      { key: 'code',  label: 'Code',  default: 'QR-7741' },
    ],
    preset: { qrColor: '#39FF14', bgColor: '#0D1117', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#0D1117'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(57,255,20,0.06)';
      for (let r=0;r<10;r++) for (let c=0;c<10;c++) {
        ctx.beginPath(); ctx.arc(c*size/9+(r%2)*size/18,r*size/9,size*0.008,0,Math.PI*2); ctx.fill();
      }
      const m=size*0.07; const l=size*0.09;
      ctx.strokeStyle='#39FF14'; ctx.lineWidth=size*0.007; ctx.lineCap='square';
      [[m,m],[size-m,m],[m,size-m],[size-m,size-m]].forEach(([x,y],i)=>{
        const dx=i%2===0?1:-1; const dy=i<2?1:-1;
        ctx.beginPath(); ctx.moveTo(x,y+dy*l); ctx.lineTo(x,y); ctx.lineTo(x+dx*l,y); ctx.stroke();
      });
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center';
      ctx.save(); ctx.shadowColor='#39FF14'; ctx.shadowBlur=size*0.03;
      ctx.fillStyle='#39FF14'; ctx.font=`800 ${Math.round(size*0.04)}px "Courier New",monospace`;
      ctx.fillText(texts.title||'ACCESS GRANTED', size*0.5, size*0.175); ctx.restore();
      ctx.fillStyle='rgba(57,255,20,0.5)'; ctx.font=`600 ${Math.round(size*0.025)}px "Courier New",monospace`;
      ctx.fillText(`[ ${texts.code||'QR-7741'} ]`, size*0.5, size*0.865);
    }
  },
  {
    id: 'sunset_wave',
    name: 'Sunset Wave',
    category: 'Hot',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.54,
    texts: [
      { key: 'title',    label: 'Title',    default: 'SCAN TO EXPLORE' },
      { key: 'subtitle', label: 'Subtitle', default: 'Discover something amazing' },
    ],
    preset: { qrColor: '#FFFFFF', bgColor: '#FF6B35', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,0,size);
      g.addColorStop(0,'#FF6B35'); g.addColorStop(0.5,'#F7931E'); g.addColorStop(1,'#FFD166');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.moveTo(0,size*0.28);
      ctx.bezierCurveTo(size*0.3,size*0.22,size*0.7,size*0.34,size,size*0.28);
      ctx.lineTo(size,0); ctx.lineTo(0,0); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.28,size*0.8,size*0.62,size*0.04); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`800 ${Math.round(size*0.044)}px "Outfit",sans-serif`;
      ctx.fillText(texts.title||'SCAN TO EXPLORE', size*0.5, size*0.195);
      ctx.fillStyle='#FF6B35'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.subtitle||'Discover something amazing', size*0.5, size*0.89);
    }
  },
  {
    id: 'midnight_aurora',
    name: 'Midnight Aurora',
    category: 'Hot',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.54,
    texts: [
      { key: 'title',    label: 'Title',    default: 'SCAN ME' },
      { key: 'subtitle', label: 'Subtitle', default: 'Unlock the experience' },
    ],
    preset: { qrColor: '#A5F3FC', bgColor: '#0F172A', dotStyle: 'dots', eyeStyle: 'circle', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#0F172A'; ctx.fillRect(0,0,size,size);
      [['#6366f1',0.2],['#8b5cf6',0.45],['#06b6d4',0.68]].forEach(([color,yFrac])=>{
        ctx.fillStyle=color+'38';
        ctx.beginPath(); ctx.ellipse(size*0.5,yFrac*size,size*0.55,size*0.12,0,0,Math.PI*2); ctx.fill();
      });
      ctx.fillStyle='rgba(15,23,42,0.75)';
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.24,size*0.82,size*0.60,size*0.04); ctx.fill();
      ctx.strokeStyle='rgba(165,243,252,0.2)'; ctx.lineWidth=size*0.004;
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.24,size*0.82,size*0.60,size*0.04); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center';
      const g = ctx.createLinearGradient(size*0.2,0,size*0.8,0);
      g.addColorStop(0,'#818cf8'); g.addColorStop(0.5,'#a5f3fc'); g.addColorStop(1,'#818cf8');
      ctx.fillStyle=g; ctx.font=`800 ${Math.round(size*0.048)}px "Inter",sans-serif`;
      ctx.fillText(texts.title||'SCAN ME', size*0.5, size*0.185);
      ctx.fillStyle='rgba(165,243,252,0.6)'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText((texts.subtitle||'Unlock the experience').toUpperCase(), size*0.5, size*0.88);
    }
  },

  // ─── NEW: Social Templates ────────────────────────────────────────────────────
  {
    id: 'whatsapp_chat',
    name: 'WhatsApp Chat',
    category: 'Social',
    qrSize: 0.48,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'title', label: 'Title',    default: 'Chat on WhatsApp' },
      { key: 'cta',   label: 'CTA Text', default: 'SCAN TO MESSAGE US' },
    ],
    preset: { qrColor: '#128C7E', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,0,size);
      g.addColorStop(0,'#25D366'); g.addColorStop(1,'#128C7E');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.28,size*0.82,size*0.62,size*0.04); ctx.fill();
      ctx.fillStyle='#25D366';
      ctx.beginPath(); ctx.roundRect(size*0.37,size*0.10,size*0.26,size*0.16,size*0.05); ctx.fill();
      ctx.beginPath(); ctx.moveTo(size*0.43,size*0.26); ctx.lineTo(size*0.48,size*0.30); ctx.lineTo(size*0.48,size*0.26); ctx.closePath(); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.fillStyle='#FFFFFF'; ctx.font=`600 ${Math.round(size*0.085)}px "Inter",sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('💬', size*0.5, size*0.175);
      ctx.textBaseline='alphabetic'; ctx.fillStyle='#1a1a1a';
      ctx.font=`bold ${Math.round(size*0.042)}px "Outfit",sans-serif`;
      ctx.fillText(texts.title||'Chat on WhatsApp', size*0.5, size*0.35);
      ctx.fillStyle='#25D366'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SCAN TO MESSAGE US', size*0.5, size*0.875);
    }
  },
  {
    id: 'tiktok_stage',
    name: 'TikTok Stage',
    category: 'Social',
    qrSize: 0.48,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'title',    label: 'Username', default: '@yourhandle' },
      { key: 'subtitle', label: 'CTA',      default: 'FOLLOW FOR MORE' },
    ],
    preset: { qrColor: '#FFFFFF', bgColor: '#010101', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#010101'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#69C9D0'; ctx.fillRect(0,0,size*0.5,size*0.14);
      ctx.fillStyle='#EE1D52'; ctx.fillRect(size*0.5,0,size*0.5,size*0.14);
      ctx.fillStyle='#010101';
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.26,size*0.82,size*0.60,size*0.03); ctx.fill();
      ctx.strokeStyle='#EE1D52'; ctx.lineWidth=size*0.004;
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.26,size*0.82,size*0.60,size*0.03); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center';
      ctx.save(); ctx.shadowColor='#69C9D0'; ctx.shadowBlur=size*0.015; ctx.fillStyle='#69C9D0';
      ctx.font=`900 ${Math.round(size*0.048)}px "Outfit",sans-serif`;
      ctx.fillText('TikTok', size*0.502, size*0.20);
      ctx.shadowColor='#EE1D52'; ctx.fillStyle='#EE1D52';
      ctx.fillText('TikTok', size*0.498, size*0.20); ctx.restore();
      ctx.fillStyle='#FFFFFF'; ctx.font=`700 ${Math.round(size*0.036)}px "Inter",sans-serif`;
      ctx.fillText(texts.title||'@yourhandle', size*0.5, size*0.34);
      ctx.fillStyle='#EE1D52'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.subtitle||'FOLLOW FOR MORE', size*0.5, size*0.875);
    }
  },
  {
    id: 'discord_server',
    name: 'Discord Server',
    category: 'Social',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.55,
    texts: [
      { key: 'server', label: 'Server Name', default: 'My Server' },
      { key: 'cta',    label: 'CTA',         default: 'JOIN OUR COMMUNITY' },
    ],
    preset: { qrColor: '#FFFFFF', bgColor: '#5865F2', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,size,size);
      g.addColorStop(0,'#4752C4'); g.addColorStop(1,'#5865F2');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(255,255,255,0.08)';
      ctx.beginPath(); ctx.arc(size*0.15,size*0.15,size*0.22,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#36393F';
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.24,size*0.82,size*0.64,size*0.04); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle='#FFFFFF'; ctx.font=`700 ${Math.round(size*0.07)}px "Outfit",sans-serif`;
      ctx.fillText('🎮', size*0.5, size*0.15);
      ctx.textBaseline='alphabetic'; ctx.fillStyle='#FFFFFF';
      ctx.font=`bold ${Math.round(size*0.044)}px "Outfit",sans-serif`;
      ctx.fillText(texts.server||'My Server', size*0.5, size*0.34);
      ctx.fillStyle='#5865F2'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'JOIN OUR COMMUNITY', size*0.5, size*0.875);
    }
  },
  {
    id: 'snapchat_ghost',
    name: 'Snapchat Snap',
    category: 'Social',
    qrSize: 0.48,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'title', label: 'Username', default: '@yoursnap' },
      { key: 'cta',   label: 'CTA',      default: 'ADD ME ON SNAPCHAT' },
    ],
    preset: { qrColor: '#000000', bgColor: '#FFFC00', dotStyle: 'dots', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#FFFC00'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.28,size*0.82,size*0.62,size*0.04); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle='#000000'; ctx.font=`700 ${Math.round(size*0.085)}px "Inter",sans-serif`;
      ctx.fillText('👻', size*0.5, size*0.175);
      ctx.textBaseline='alphabetic'; ctx.fillStyle='#1a1a1a';
      ctx.font=`bold ${Math.round(size*0.042)}px "Outfit",sans-serif`;
      ctx.fillText(texts.title||'@yoursnap', size*0.5, size*0.36);
      ctx.fillStyle='#b8a900'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'ADD ME ON SNAPCHAT', size*0.5, size*0.875);
    }
  },
  {
    id: 'pinterest_board',
    name: 'Pinterest Board',
    category: 'Social',
    qrSize: 0.48,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'title', label: 'Board Name', default: 'My Inspiration' },
      { key: 'cta',   label: 'CTA',        default: 'SAVE & FOLLOW' },
    ],
    preset: { qrColor: '#E60023', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#E60023'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.26,size*0.82,size*0.64,size*0.04); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.fillStyle='#E60023';
      ctx.beginPath(); ctx.arc(size*0.5,size*0.165,size*0.065,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFFFFF'; ctx.font=`bold ${Math.round(size*0.085)}px "Georgia",serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('P', size*0.5, size*0.165);
      ctx.textBaseline='alphabetic'; ctx.fillStyle='#1a1a1a';
      ctx.font=`bold ${Math.round(size*0.04)}px "Outfit",sans-serif`;
      ctx.fillText(texts.title||'My Inspiration', size*0.5, size*0.36);
      ctx.fillStyle='#E60023'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SAVE & FOLLOW', size*0.5, size*0.875);
    }
  },

  // ─── NEW: Business Templates ──────────────────────────────────────────────────
  {
    id: 'biz_card_pro',
    name: 'Business Card',
    category: 'Business',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'name',    label: 'Your Name', default: 'John Smith' },
      { key: 'title',   label: 'Job Title', default: 'CEO & Founder' },
      { key: 'company', label: 'Company',   default: 'Acme Corp' },
    ],
    preset: { qrColor: '#1e293b', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#1e293b'; ctx.fillRect(0,0,size,size*0.28);
      ctx.fillStyle='#334155';
      ctx.beginPath(); ctx.moveTo(0,size*0.28); ctx.lineTo(size*0.4,size*0.28); ctx.lineTo(size*0.3,0); ctx.lineTo(0,0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=size*0.003;
      ctx.beginPath(); ctx.roundRect(size*0.15,size*0.3,size*0.7,size*0.58,size*0.02); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`800 ${Math.round(size*0.052)}px "Outfit",sans-serif`;
      ctx.fillText(texts.name||'John Smith', size*0.5, size*0.16);
      ctx.fillStyle='#94a3b8'; ctx.font=`500 ${Math.round(size*0.022)}px "Inter",sans-serif`;
      ctx.fillText(texts.title||'CEO & Founder', size*0.5, size*0.21);
      ctx.fillStyle='#64748b'; ctx.font=`600 ${Math.round(size*0.019)}px "Inter",sans-serif`;
      ctx.fillText((texts.company||'Acme Corp').toUpperCase(), size*0.5, size*0.87);
    }
  },
  {
    id: 'corporate_blue',
    name: 'Corporate Blue',
    category: 'Business',
    qrSize: 0.48,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'company', label: 'Company', default: 'YourBrand' },
      { key: 'tagline', label: 'Tagline', default: 'Excellence in every detail' },
      { key: 'cta',     label: 'CTA',     default: 'SCAN FOR MORE INFO' },
    ],
    preset: { qrColor: '#FFFFFF', bgColor: '#003087', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,0,size);
      g.addColorStop(0,'#003087'); g.addColorStop(1,'#005FCC');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=size*0.003;
      ctx.beginPath(); ctx.moveTo(size*0.1,size*0.28); ctx.lineTo(size*0.9,size*0.28); ctx.stroke();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.30,size*0.8,size*0.60,size*0.03); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`800 ${Math.round(size*0.054)}px "Outfit",sans-serif`;
      ctx.fillText(texts.company||'YourBrand', size*0.5, size*0.195);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font=`400 ${Math.round(size*0.019)}px "Inter",sans-serif`;
      ctx.fillText(texts.tagline||'Excellence in every detail', size*0.5, size*0.245);
      ctx.fillStyle='#003087'; ctx.font=`700 ${Math.round(size*0.019)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SCAN FOR MORE INFO', size*0.5, size*0.875);
    }
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    category: 'Business',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'address', label: 'Property',  default: '123 Dream Street' },
      { key: 'agent',   label: 'Agent',     default: 'Call: +1 555 0100' },
      { key: 'cta',     label: 'CTA',       default: 'SCAN TO VIEW PROPERTY' },
    ],
    preset: { qrColor: '#14532d', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#f0fdf4'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#14532d'; ctx.fillRect(0,0,size,size*0.26);
      ctx.fillStyle='#166534';
      ctx.beginPath(); ctx.moveTo(size*0.38,size*0.26); ctx.lineTo(size*0.5,size*0.12); ctx.lineTo(size*0.62,size*0.26); ctx.closePath(); ctx.fill();
      ctx.fillRect(size*0.41,size*0.22,size*0.18,size*0.05);
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.28,size*0.8,size*0.62,size*0.03); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`700 ${Math.round(size*0.035)}px "Outfit",sans-serif`;
      ctx.fillText('FOR SALE', size*0.5, size*0.12);
      ctx.fillStyle='#14532d'; ctx.font=`bold ${Math.round(size*0.038)}px "Outfit",sans-serif`;
      ctx.fillText(texts.address||'123 Dream Street', size*0.5, size*0.375);
      ctx.fillStyle='#64748b'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.agent||'Call: +1 555 0100', size*0.5, size*0.415);
      ctx.fillStyle='#14532d'; ctx.font=`700 ${Math.round(size*0.018)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SCAN TO VIEW PROPERTY', size*0.5, size*0.875);
    }
  },
  {
    id: 'restaurant_menu',
    name: 'Menu QR',
    category: 'Business',
    qrSize: 0.48,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'name',    label: 'Restaurant', default: 'La Maison' },
      { key: 'tagline', label: 'Tagline',    default: 'Fine Dining Experience' },
      { key: 'cta',     label: 'CTA',        default: 'SCAN TO VIEW MENU' },
    ],
    preset: { qrColor: '#7f1d1d', bgColor: '#FFFFFF', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#fef3c7'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#7f1d1d'; ctx.fillRect(0,0,size,size*0.26);
      ctx.strokeStyle='#b91c1c'; ctx.lineWidth=size*0.004;
      ctx.beginPath(); ctx.moveTo(size*0.05,size*0.02); ctx.lineTo(size*0.05,size*0.24); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(size*0.95,size*0.02); ctx.lineTo(size*0.95,size*0.24); ctx.stroke();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.28,size*0.8,size*0.62,size*0.03); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#fef3c7';
      ctx.font=`800 ${Math.round(size*0.056)}px "Georgia",serif`;
      ctx.fillText(texts.name||'La Maison', size*0.5, size*0.17);
      ctx.fillStyle='rgba(254,243,199,0.7)'; ctx.font=`400 italic ${Math.round(size*0.019)}px "Georgia",serif`;
      ctx.fillText(texts.tagline||'Fine Dining Experience', size*0.5, size*0.22);
      ctx.fillStyle='#7f1d1d'; ctx.font=`700 ${Math.round(size*0.018)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SCAN TO VIEW MENU', size*0.5, size*0.875);
    }
  },
  {
    id: 'vcard_pro',
    name: 'vCard Pro',
    category: 'Business',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'name',    label: 'Full Name', default: 'Sarah Johnson' },
      { key: 'title',   label: 'Title',     default: 'Product Designer' },
      { key: 'contact', label: 'Contact',   default: 'sarah@company.com' },
    ],
    preset: { qrColor: '#0f172a', bgColor: '#FFFFFF', dotStyle: 'dots', eyeStyle: 'circle', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,size,size);
      const g = ctx.createLinearGradient(0,0,size,size*0.28);
      g.addColorStop(0,'#0f172a'); g.addColorStop(1,'#1e3a5f');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size*0.30);
      ctx.fillStyle='#334155';
      ctx.beginPath(); ctx.arc(size*0.5,size*0.30,size*0.09,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.arc(size*0.5,size*0.30,size*0.076,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#334155'; ctx.font=`700 ${Math.round(size*0.065)}px "Inter",sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('👤', size*0.5, size*0.305); ctx.textBaseline='alphabetic';
      ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=size*0.003;
      ctx.beginPath(); ctx.moveTo(size*0.2,size*0.69); ctx.lineTo(size*0.8,size*0.69); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`700 ${Math.round(size*0.038)}px "Outfit",sans-serif`;
      ctx.fillText('CONTACT', size*0.5, size*0.165);
      ctx.fillStyle='#0f172a'; ctx.font=`800 ${Math.round(size*0.046)}px "Outfit",sans-serif`;
      ctx.fillText(texts.name||'Sarah Johnson', size*0.5, size*0.51);
      ctx.fillStyle='#64748b'; ctx.font=`500 ${Math.round(size*0.021)}px "Inter",sans-serif`;
      ctx.fillText(texts.title||'Product Designer', size*0.5, size*0.545);
      ctx.fillStyle='#94a3b8'; ctx.font=`400 ${Math.round(size*0.018)}px "Inter",sans-serif`;
      ctx.fillText(texts.contact||'sarah@company.com', size*0.5, size*0.73);
    }
  },

  // ─── NEW: Event Templates ─────────────────────────────────────────────────────
  {
    id: 'event_ticket',
    name: 'Event Ticket',
    category: 'Event',
    qrSize: 0.44,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'event', label: 'Event Name', default: 'SUMMER FEST 2025' },
      { key: 'date',  label: 'Date',       default: 'Aug 15 • 8PM' },
      { key: 'venue', label: 'Venue',      default: 'City Arena, Hall A' },
    ],
    preset: { qrColor: '#1e1b4b', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,size,size);
      g.addColorStop(0,'#4f46e5'); g.addColorStop(1,'#7c3aed');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=size*0.004; ctx.setLineDash([size*0.03,size*0.02]);
      ctx.beginPath(); ctx.moveTo(size*0.1,size*0.28); ctx.lineTo(size*0.9,size*0.28); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#4f46e5';
      ctx.beginPath(); ctx.arc(size*0.08,size*0.28,size*0.025,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(size*0.92,size*0.28,size*0.025,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.30,size*0.8,size*0.60,size*0.02); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`900 ${Math.round(size*0.046)}px "Outfit",sans-serif`;
      ctx.fillText(texts.event||'SUMMER FEST 2025', size*0.5, size*0.17);
      ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.date||'Aug 15 • 8PM', size*0.5, size*0.22);
      ctx.fillStyle='#64748b'; ctx.font=`500 ${Math.round(size*0.019)}px "Inter",sans-serif`;
      ctx.fillText(texts.venue||'City Arena, Hall A', size*0.5, size*0.39);
      ctx.fillStyle='#4f46e5'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText('SCAN TO GET TICKETS', size*0.5, size*0.875);
    }
  },
  {
    id: 'concert_pass',
    name: 'Concert Pass',
    category: 'Event',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'artist', label: 'Artist',    default: 'THE ELECTRIC BAND' },
      { key: 'date',   label: 'Date',      default: 'SAT 22 NOV 2025' },
      { key: 'type',   label: 'Pass Type', default: 'VIP BACKSTAGE PASS' },
    ],
    preset: { qrColor: '#fbbf24', bgColor: '#0c0a09', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#0c0a09'; ctx.fillRect(0,0,size,size);
      ctx.strokeStyle='#fbbf24'; ctx.lineWidth=size*0.006;
      ctx.beginPath(); ctx.moveTo(0,size*0.28); ctx.lineTo(size,size*0.28); ctx.stroke();
      ctx.strokeStyle='rgba(251,191,36,0.3)'; ctx.lineWidth=size*0.003;
      ctx.beginPath(); ctx.moveTo(0,size*0.84); ctx.lineTo(size,size*0.84); ctx.stroke();
      const rg = ctx.createRadialGradient(size*0.5,size*0.56,0,size*0.5,size*0.56,size*0.35);
      rg.addColorStop(0,'rgba(251,191,36,0.08)'); rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg; ctx.fillRect(0,0,size,size);
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center';
      ctx.save(); ctx.shadowColor='#fbbf24'; ctx.shadowBlur=size*0.03;
      ctx.fillStyle='#fbbf24'; ctx.font=`900 ${Math.round(size*0.044)}px "Outfit",sans-serif`;
      ctx.fillText(texts.artist||'THE ELECTRIC BAND', size*0.5, size*0.19); ctx.restore();
      ctx.fillStyle='rgba(251,191,36,0.7)'; ctx.font=`600 ${Math.round(size*0.022)}px "Inter",sans-serif`;
      ctx.fillText(texts.date||'SAT 22 NOV 2025', size*0.5, size*0.235);
      ctx.fillStyle='#fbbf24'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.type||'VIP BACKSTAGE PASS', size*0.5, size*0.875);
    }
  },
  {
    id: 'conference_badge',
    name: 'Conference',
    category: 'Event',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'event',   label: 'Event Name', default: 'TechSummit 2025' },
      { key: 'speaker', label: 'Speaker',    default: 'Keynote Speaker' },
      { key: 'date',    label: 'Date',       default: 'March 10–12, 2025' },
    ],
    preset: { qrColor: '#0369a1', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,size,size);
      const g = ctx.createLinearGradient(0,0,size,0);
      g.addColorStop(0,'#0369a1'); g.addColorStop(1,'#0ea5e9');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size*0.26);
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.roundRect(size*0.41,size*0.018,size*0.18,size*0.04,size*0.02); ctx.fill();
      ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=size*0.003;
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.28,size*0.8,size*0.62,size*0.02); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`800 ${Math.round(size*0.048)}px "Outfit",sans-serif`;
      ctx.fillText(texts.event||'TechSummit 2025', size*0.5, size*0.165);
      ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.date||'March 10–12, 2025', size*0.5, size*0.215);
      ctx.fillStyle='#64748b'; ctx.font=`600 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.speaker||'Keynote Speaker', size*0.5, size*0.385);
      ctx.fillStyle='#0369a1'; ctx.font=`700 ${Math.round(size*0.018)}px "Inter",sans-serif`;
      ctx.fillText('SCAN TO REGISTER', size*0.5, size*0.875);
    }
  },
  {
    id: 'holiday_special',
    name: 'Holiday Special',
    category: 'Event',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'greeting', label: 'Greeting', default: 'Happy Holidays! 🎄' },
      { key: 'from',     label: 'From',     default: 'From: YourBrand' },
      { key: 'cta',      label: 'CTA',      default: 'SCAN FOR A GIFT' },
    ],
    preset: { qrColor: '#FFFFFF', bgColor: '#14532d', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,0,size);
      g.addColorStop(0,'#14532d'); g.addColorStop(1,'#166534');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(255,255,255,0.5)';
      [[0.1,0.05],[0.85,0.12],[0.3,0.08],[0.6,0.04],[0.75,0.09],[0.2,0.15],[0.5,0.03],[0.9,0.18]].forEach(([x,y])=>{
        ctx.beginPath(); ctx.arc(x*size,y*size,size*0.006,0,Math.PI*2); ctx.fill();
      });
      ctx.fillStyle='#b91c1c'; ctx.fillRect(0,size*0.22,size,size*0.06);
      ctx.fillStyle='#FFFFFF';
      for (let i=0;i<20;i++) if (i%2===0) { ctx.fillRect(i*size/20,size*0.22,size/40,size*0.06); }
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.30,size*0.8,size*0.60,size*0.03); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`700 ${Math.round(size*0.04)}px "Outfit",sans-serif`;
      ctx.fillText(texts.greeting||'Happy Holidays! 🎄', size*0.5, size*0.18);
      ctx.fillStyle='#64748b'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.from||'From: YourBrand', size*0.5, size*0.38);
      ctx.fillStyle='#14532d'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SCAN FOR A GIFT', size*0.5, size*0.875);
    }
  },

  // ─── NEW: Retail Templates ────────────────────────────────────────────────────
  {
    id: 'sale_banner',
    name: 'Sale Banner',
    category: 'Retail',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'discount', label: 'Discount',   default: '50% OFF' },
      { key: 'product',  label: 'Product',    default: 'Everything Store-Wide' },
      { key: 'code',     label: 'Promo Code', default: 'Use Code: SCAN50' },
    ],
    preset: { qrColor: '#FFFFFF', bgColor: '#dc2626', dotStyle: 'rounded', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      const g = ctx.createLinearGradient(0,0,size,size);
      g.addColorStop(0,'#dc2626'); g.addColorStop(1,'#b91c1c');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
      ctx.save(); ctx.globalAlpha=0.07; ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=size*0.04;
      for (let i=-2;i<6;i++) { ctx.beginPath(); ctx.moveTo(i*size*0.25-size*0.1,0); ctx.lineTo(i*size*0.25+size*0.6,size); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.30,size*0.8,size*0.60,size*0.03); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`900 ${Math.round(size*0.07)}px "Outfit",sans-serif`;
      ctx.fillText(texts.discount||'50% OFF', size*0.5, size*0.18);
      ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font=`500 ${Math.round(size*0.022)}px "Inter",sans-serif`;
      ctx.fillText(texts.product||'Everything Store-Wide', size*0.5, size*0.23);
      ctx.fillStyle='#dc2626'; ctx.font=`700 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.code||'Use Code: SCAN50', size*0.5, size*0.875);
    }
  },
  {
    id: 'product_scan',
    name: 'Product Scan',
    category: 'Retail',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.57,
    texts: [
      { key: 'brand',   label: 'Brand',        default: 'YourBrand™' },
      { key: 'product', label: 'Product Name',  default: 'Premium Edition' },
      { key: 'cta',     label: 'CTA',           default: 'SCAN FOR DETAILS' },
    ],
    preset: { qrColor: '#18181b', bgColor: '#FFFFFF', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='#18181b'; ctx.fillRect(0,0,size,size*0.24);
      ctx.fillStyle='#d4d4d8'; ctx.fillRect(size*0.1,size*0.83,size*0.8,size*0.004);
      ctx.strokeStyle='#e4e4e7'; ctx.lineWidth=size*0.004;
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.27,size*0.8,size*0.62,size*0.02); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFFFF';
      ctx.font=`800 ${Math.round(size*0.05)}px "Outfit",sans-serif`;
      ctx.fillText(texts.brand||'YourBrand™', size*0.5, size*0.16);
      ctx.fillStyle='#52525b'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.product||'Premium Edition', size*0.5, size*0.375);
      ctx.fillStyle='#71717a'; ctx.font=`600 ${Math.round(size*0.018)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SCAN FOR DETAILS', size*0.5, size*0.875);
    }
  },
  {
    id: 'loyalty_card',
    name: 'Loyalty Card',
    category: 'Retail',
    qrSize: 0.46,
    qrX: 0.5,
    qrY: 0.56,
    texts: [
      { key: 'brand',  label: 'Brand',  default: 'Coffee House' },
      { key: 'reward', label: 'Reward', default: 'Earn Points Every Visit' },
      { key: 'cta',    label: 'CTA',    default: 'SCAN TO COLLECT POINTS' },
    ],
    preset: { qrColor: '#78350f', bgColor: '#FFFBEB', dotStyle: 'dots', eyeStyle: 'rounded', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#fffbeb'; ctx.fillRect(0,0,size,size);
      const g = ctx.createLinearGradient(0,0,0,size*0.28);
      g.addColorStop(0,'#78350f'); g.addColorStop(1,'#92400e');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size*0.28);
      ctx.strokeStyle='rgba(120,53,15,0.2)'; ctx.lineWidth=size*0.005;
      [0.22,0.36,0.5,0.64,0.78].forEach(x=>{
        ctx.beginPath(); ctx.arc(size*x,size*0.845,size*0.045,0,Math.PI*2); ctx.stroke();
      });
      ctx.fillStyle='rgba(120,53,15,0.12)';
      ctx.beginPath(); ctx.arc(size*0.22,size*0.845,size*0.045,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath(); ctx.roundRect(size*0.1,size*0.30,size*0.8,size*0.50,size*0.03); ctx.fill();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.fillStyle='#FFFBEB';
      ctx.font=`800 ${Math.round(size*0.05)}px "Outfit",sans-serif`;
      ctx.fillText(texts.brand||'Coffee House', size*0.5, size*0.18);
      ctx.fillStyle='#78350f'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.reward||'Earn Points Every Visit', size*0.5, size*0.38);
      ctx.fillStyle='#92400e'; ctx.font=`700 ${Math.round(size*0.018)}px "Inter",sans-serif`;
      ctx.fillText(texts.cta||'SCAN TO COLLECT POINTS', size*0.5, size*0.795);
    }
  },
  {
    id: 'crypto_wallet',
    name: 'Crypto Wallet',
    category: 'Hot',
    qrSize: 0.50,
    qrX: 0.5,
    qrY: 0.54,
    texts: [
      { key: 'coin',  label: 'Coin',  default: 'Bitcoin' },
      { key: 'label', label: 'Label', default: 'Send BTC Here' },
    ],
    preset: { qrColor: '#f59e0b', bgColor: '#1c1917', dotStyle: 'square', eyeStyle: 'square', bgTransparent: true },
    drawBackground: (ctx, size) => {
      ctx.fillStyle='#1c1917'; ctx.fillRect(0,0,size,size);
      ctx.strokeStyle='rgba(245,158,11,0.06)'; ctx.lineWidth=1;
      const step=size/10;
      for (let i=0;i<=10;i++) {
        ctx.beginPath(); ctx.moveTo(i*step,0); ctx.lineTo(i*step,size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i*step); ctx.lineTo(size,i*step); ctx.stroke();
      }
      const rg = ctx.createRadialGradient(size*0.5,size*0.18,0,size*0.5,size*0.18,size*0.18);
      rg.addColorStop(0,'rgba(245,158,11,0.25)'); rg.addColorStop(1,'transparent');
      ctx.fillStyle=rg; ctx.fillRect(0,0,size,size);
      ctx.strokeStyle='rgba(245,158,11,0.3)'; ctx.lineWidth=size*0.005;
      ctx.beginPath(); ctx.roundRect(size*0.09,size*0.25,size*0.82,size*0.62,size*0.03); ctx.stroke();
    },
    drawForeground: (ctx, size, texts = {}) => {
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle='#f59e0b'; ctx.font=`700 ${Math.round(size*0.065)}px "Outfit",sans-serif`;
      ctx.fillText('₿', size*0.5, size*0.165);
      ctx.textBaseline='alphabetic'; ctx.fillStyle='#f59e0b';
      ctx.font=`800 ${Math.round(size*0.044)}px "Outfit",sans-serif`;
      ctx.fillText(texts.coin||'Bitcoin', size*0.5, size*0.35);
      ctx.fillStyle='rgba(245,158,11,0.6)'; ctx.font=`500 ${Math.round(size*0.02)}px "Inter",sans-serif`;
      ctx.fillText(texts.label||'Send BTC Here', size*0.5, size*0.87);
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

