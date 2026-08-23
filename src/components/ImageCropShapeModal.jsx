// src/components/ImageCropShapeModal.jsx
// Interactive 1:1 Photo Crop & Multi-Shape Selection Modal (Square, Rounded, Circle, Hexagon, Octagon, Triangle, etc.)
// Features live illuminated SVG cutout mask, dimmed exterior shroud, guidelines, and React portal rendering directly into document.body

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, Check, RotateCcw, ZoomIn, ZoomOut, Move,
  Square, Circle, Triangle, Hexagon, Octagon, Heart, Star, Diamond, Shield
} from 'lucide-react';

export const SHAPE_OPTIONS = [
  { id: 'square', label: 'Square', icon: Square },
  { id: 'rounded', label: 'Rounded', icon: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="6" />
    </svg>
  )},
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'hexagon', label: 'Hexagon', icon: Hexagon },
  { id: 'octagon', label: 'Octagon', icon: Octagon },
  { id: 'triangle', label: 'Triangle', icon: Triangle },
  { id: 'diamond', label: 'Diamond', icon: Diamond },
  { id: 'heart', label: 'Heart', icon: Heart },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'shield', label: 'Shield', icon: Shield }
];

export const getSvgPathData = (shape, size = 260) => {
  const half = size / 2;
  const p = 4; // padding

  switch (shape) {
    case 'circle': {
      const r = half - p;
      return `M ${half},${p} A ${r} ${r} 0 1 0 ${half},${size - p} A ${r} ${r} 0 1 0 ${half},${p} Z`;
    }

    case 'rounded': {
      const radius = size * 0.22;
      const s = size - p * 2;
      return `M ${p + radius},${p} h ${s - 2 * radius} a ${radius},${radius} 0 0 1 ${radius},${radius} v ${s - 2 * radius} a ${radius},${radius} 0 0 1 -${radius},${radius} h -${s - 2 * radius} a ${radius},${radius} 0 0 1 -${radius},-${radius} v -${s - 2 * radius} a ${radius},${radius} 0 0 1 ${radius},-${radius} Z`;
    }

    case 'hexagon': {
      const r = half - p;
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = (half + r * Math.cos(angle)).toFixed(1);
        const y = (half + r * Math.sin(angle)).toFixed(1);
        pts.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
      }
      return `${pts.join(' ')} Z`;
    }

    case 'octagon': {
      const r = half - p;
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 8;
        const x = (half + r * Math.cos(angle)).toFixed(1);
        const y = (half + r * Math.sin(angle)).toFixed(1);
        pts.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
      }
      return `${pts.join(' ')} Z`;
    }

    case 'triangle': {
      return `M ${half},${p + 4} L ${size - p - 4},${size - p} L ${p + 4},${size - p} Z`;
    }

    case 'diamond': {
      return `M ${half},${p} L ${size - p},${half} L ${half},${size - p} L ${p},${half} Z`;
    }

    case 'heart': {
      const s = size;
      return `M ${half},${s * 0.25} C ${half},${s * 0.05} ${p},${s * 0.05} ${p},${s * 0.3} C ${p},${s * 0.55} ${half * 0.6},${s * 0.75} ${half},${s * 0.95} C ${s - half * 0.6},${s * 0.75} ${s - p},${s * 0.55} ${s - p},${s * 0.3} C ${s - p},${s * 0.05} ${half},${s * 0.05} ${half},${s * 0.25} Z`;
    }

    case 'star': {
      const outerR = half - p;
      const innerR = outerR * 0.42;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const x = (half + r * Math.cos(angle)).toFixed(1);
        const y = (half + r * Math.sin(angle)).toFixed(1);
        pts.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
      }
      return `${pts.join(' ')} Z`;
    }

    case 'shield': {
      const s = size - p * 2;
      return `M ${p},${p} L ${p + s},${p} L ${p + s},${p + s * 0.55} C ${p + s},${p + s * 0.82} ${half},${p + s * 0.95} ${half},${p + s} C ${half},${p + s * 0.95} ${p},${p + s * 0.82} ${p},${p + s * 0.55} Z`;
    }

    case 'square':
    default:
      return `M ${p},${p} L ${size - p},${p} L ${size - p},${size - p} L ${p},${size - p} Z`;
  }
};

export function ImageCropShapeModal({
  isOpen,
  imageSrc,
  imageName = 'photo.png',
  title = 'Crop & Shape Photo',
  initialShape = 'rounded',
  allowShapeSelect = true,
  onConfirm,
  onCancel
}) {
  const [selectedShape, setSelectedShape] = useState(initialShape || 'rounded');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loadedImage, setLoadedImage] = useState(null);
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const touchDistRef = useRef(null);
  const initialZoomRef = useRef(1);

  // Sync initial shape when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedShape(initialShape || 'rounded');
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen, initialShape]);

  // Load the target image
  useEffect(() => {
    if (isOpen && imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setLoadedImage(img);
        setImgNaturalSize({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
      };
      img.onerror = () => {
        console.error('Failed to load image for cropping:', imageSrc);
      };
      img.src = imageSrc;
    } else {
      setLoadedImage(null);
    }
  }, [isOpen, imageSrc]);

  // ── Touch and Mouse Drag / Zoom Handlers ──
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchDistRef.current = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      initialZoomRef.current = zoom;
    } else if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistRef.current) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scale = dist / touchDistRef.current;
      setZoom(Math.min(Math.max(initialZoomRef.current * scale, 1.0), 4.0));
    } else if (e.touches.length === 1 && isDraggingRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
    isDraggingRef.current = false;
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom(prev => Math.min(Math.max(prev + zoomDelta, 1.0), 4.0));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // ── Helper to draw shape clipping paths on export canvas ──
  const drawShapePath = (ctx, shape, size) => {
    const half = size / 2;
    ctx.beginPath();

    switch (shape) {
      case 'circle':
        ctx.arc(half, half, half - 2, 0, Math.PI * 2);
        break;

      case 'rounded': {
        const r = size * 0.22;
        const p = 2;
        const s = size - p * 2;
        ctx.roundRect ? ctx.roundRect(p, p, s, s, r) : ctx.rect(p, p, s, s);
        break;
      }

      case 'hexagon': {
        const r = half - 3;
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 2;
          const x = half + r * Math.cos(angle);
          const y = half + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
      }

      case 'octagon': {
        const r = half - 3;
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI / 4) * i - Math.PI / 8;
          const x = half + r * Math.cos(angle);
          const y = half + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
      }

      case 'triangle': {
        const p = 4;
        ctx.moveTo(half, p);
        ctx.lineTo(size - p, size - p);
        ctx.lineTo(p, size - p);
        ctx.closePath();
        break;
      }

      case 'diamond': {
        const p = 4;
        ctx.moveTo(half, p);
        ctx.lineTo(size - p, half);
        ctx.lineTo(half, size - p);
        ctx.lineTo(p, half);
        ctx.closePath();
        break;
      }

      case 'heart': {
        const topCurveHeight = size * 0.3;
        ctx.moveTo(half, size * 0.25);
        ctx.bezierCurveTo(half, size * 0.05, 0, size * 0.05, 0, topCurveHeight);
        ctx.bezierCurveTo(0, size * 0.55, half * 0.6, size * 0.75, half, size * 0.95);
        ctx.bezierCurveTo(size - half * 0.6, size * 0.75, size, size * 0.55, size, topCurveHeight);
        ctx.bezierCurveTo(size, size * 0.05, half, size * 0.05, half, size * 0.25);
        ctx.closePath();
        break;
      }

      case 'star': {
        const outerR = half - 4;
        const innerR = outerR * 0.42;
        const points = 5;
        for (let i = 0; i < points * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (Math.PI / points) * i - Math.PI / 2;
          const x = half + r * Math.cos(angle);
          const y = half + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
      }

      case 'shield': {
        const p = 4;
        ctx.moveTo(p, p);
        ctx.lineTo(size - p, p);
        ctx.lineTo(size - p, size * 0.55);
        ctx.bezierCurveTo(size - p, size * 0.82, half, size * 0.95, half, size - p);
        ctx.bezierCurveTo(half, size * 0.95, p, size * 0.82, p, size * 0.55);
        ctx.closePath();
        break;
      }

      case 'square':
      default:
        ctx.rect(0, 0, size, size);
        break;
    }
  };

  // ── Generate Final High-Res Cropped Canvas & Export ──
  const handleConfirm = () => {
    if (!loadedImage) return;

    const exportSize = 512; // High-res 1:1 master size
    const canvas = document.createElement('canvas');
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const previewBoxSize = 260; // preview viewport size in px
    const scaleFactor = exportSize / previewBoxSize;

    const imgAspect = imgNaturalSize.width / imgNaturalSize.height;
    let drawW, drawH;
    if (imgAspect >= 1) {
      drawH = previewBoxSize * zoom;
      drawW = drawH * imgAspect;
    } else {
      drawW = previewBoxSize * zoom;
      drawH = drawW / imgAspect;
    }

    const drawX = (previewBoxSize - drawW) / 2 + pan.x;
    const drawY = (previewBoxSize - drawH) / 2 + pan.y;

    const finalDrawX = drawX * scaleFactor;
    const finalDrawY = drawY * scaleFactor;
    const finalDrawW = drawW * scaleFactor;
    const finalDrawH = drawH * scaleFactor;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = exportSize;
    tempCanvas.height = exportSize;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(loadedImage, finalDrawX, finalDrawY, finalDrawW, finalDrawH);

    if (selectedShape !== 'square') {
      ctx.save();
      drawShapePath(ctx, selectedShape, exportSize);
      ctx.clip();
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();
    } else {
      ctx.drawImage(tempCanvas, 0, 0);
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const outputImg = new Image();
    outputImg.onload = () => {
      onConfirm({
        image: outputImg,
        src: dataUrl,
        name: imageName,
        shape: selectedShape,
        cropData: { zoom, pan, shape: selectedShape }
      });
    };
    outputImg.src = dataUrl;
  };

  if (!isOpen) return null;

  const currentShapePath = getSvgPathData(selectedShape, 260);

  const modalContent = (
    <div 
      className="crop-modal-overlay" 
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        backgroundColor: 'rgba(5, 7, 13, 0.90)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <div 
        className="crop-modal-card" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-elevated, #111625)',
          borderRadius: '24px',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.14))',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text-primary, #FFFFFF)',
          animation: 'modalSlideUp 0.22s cubic-bezier(0.2, 0, 0, 1)',
          position: 'relative',
          zIndex: 10000000
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px 14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))'
        }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.2px' }}>{title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary, #94A3B8)', marginTop: '2px' }}>
              Drag to position &amp; pinch to scale inside shape
            </div>
          </div>
          <button 
            onClick={onCancel}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-hover, rgba(255, 255, 255, 0.08))',
              border: 'none',
              color: 'var(--text-primary, #FFFFFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-hover, rgba(255, 255, 255, 0.08))';
              e.currentTarget.style.color = 'var(--text-primary, #FFFFFF)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Area (260x260 1:1 Canvas) */}
        <div style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary, #0B0F19)',
          position: 'relative'
        }}>
          <div 
            ref={containerRef}
            onContextMenu={e => e.preventDefault()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            style={{
              width: '260px',
              height: '260px',
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              cursor: 'grab',
              touchAction: 'none',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px) 0 0 / 16px 16px, #000000'
            }}
          >
            {/* Underlying Scaled & Panned Image */}
            {loadedImage ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `translate(${pan.x}px, ${pan.y}px)`,
                  pointerEvents: 'none'
                }}
              >
                <img 
                  src={loadedImage.src}
                  alt="Crop preview"
                  draggable={false}
                  style={{
                    width: imgNaturalSize.width >= imgNaturalSize.height ? `${260 * (imgNaturalSize.width / imgNaturalSize.height) * zoom}px` : `${260 * zoom}px`,
                    height: imgNaturalSize.width >= imgNaturalSize.height ? `${260 * zoom}px` : `${260 * (imgNaturalSize.height / imgNaturalSize.width) * zoom}px`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                Loading image...
              </div>
            )}

            {/* LIVE ILLUMINATED CUTOUT SHAPE MASK OVERLAY */}
            <svg 
              width="260" 
              height="260" 
              viewBox="0 0 260 260" 
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                width: '100%',
                height: '100%'
              }}
            >
              <defs>
                <mask id="shape-cutout-mask">
                  {/* Everything white is rendered (the dark backdrop) */}
                  <rect x="0" y="0" width="260" height="260" fill="#FFFFFF" />
                  {/* The shape cutout in black creates the crystal clear window */}
                  <path d={currentShapePath} fill="#000000" />
                </mask>
              </defs>

              {/* Dark Shroud covering exterior of shape */}
              <rect 
                x="0" 
                y="0" 
                width="260" 
                height="260" 
                fill="rgba(5, 8, 16, 0.72)" 
                mask="url(#shape-cutout-mask)" 
              />

              {/* Glowing Shape Outline & Dashed Guide */}
              <path 
                d={currentShapePath} 
                fill="none" 
                stroke="var(--accent-primary, #D60036)" 
                strokeWidth="2.5" 
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(214, 0, 54, 0.5))' }}
              />
              <path 
                d={currentShapePath} 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.85)" 
                strokeWidth="1.2" 
                strokeDasharray="6,4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>

            {/* Floating Move Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              padding: '4px 8px',
              borderRadius: '20px',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Move size={12} color="var(--accent-primary)" />
              <span>Pan &amp; Scale</span>
            </div>
          </div>

          {/* Zoom Slider Bar */}
          <div style={{
            marginTop: '16px',
            width: '100%',
            maxWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button 
              onClick={() => setZoom(z => Math.max(1.0, z - 0.2))}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
            >
              <ZoomOut size={16} />
            </button>
            <input 
              type="range"
              min="1.0"
              max="4.0"
              step="0.05"
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-primary, #D60036)', cursor: 'pointer' }}
            />
            <button 
              onClick={() => setZoom(z => Math.min(4.0, z + 0.2))}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
            >
              <ZoomIn size={16} />
            </button>
            <button 
              onClick={handleReset}
              title="Reset Position"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '4px 8px',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Shape Selection Carousel / Grid */}
        {allowShapeSelect && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #FFFFFF)' }}>
              Choose Photo Shape Mask:
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
              {SHAPE_OPTIONS.map(s => {
                const isSelected = selectedShape === s.id;
                const IconComponent = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShape(s.id)}
                    style={{
                      flex: '0 0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '14px',
                      background: isSelected ? 'var(--accent-primary, #D60036)' : 'var(--bg-primary, #0B0F19)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-primary, #D60036)' : 'var(--border-color, rgba(255, 255, 255, 0.1))',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary, #94A3B8)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <IconComponent size={20} />
                    <span style={{ fontSize: '11px', fontWeight: isSelected ? 700 : 500, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          background: 'var(--bg-elevated, #111625)'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
              color: 'var(--text-secondary, #94A3B8)',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-color, rgba(255, 255, 255, 0.15))';
              e.currentTarget.style.color = 'var(--text-secondary, #94A3B8)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              background: 'var(--accent-primary, #D60036)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(214, 0, 54, 0.4)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(214, 0, 54, 0.55)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(214, 0, 54, 0.4)';
            }}
          >
            <Check size={16} strokeWidth={2.6} />
            <span>Apply Photo Shape</span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? ReactDOM.createPortal(modalContent, document.body) 
    : modalContent;
}
export default ImageCropShapeModal;
