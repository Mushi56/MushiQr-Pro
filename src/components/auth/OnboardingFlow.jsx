import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Palette,
  Image as ImageIcon,
  Grid,
  ShieldCheck,
  ChevronRight,
  Scan,
  FileSpreadsheet,
  Zap,
  Layers,
  Archive,
  Download,
  Barcode as BarcodeIcon,
  Check,
  CheckCircle2
} from 'lucide-react';
import onboardingQrSvg from '../../assets/onboarding-qr-code.svg';

export default function OnboardingFlow({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalSlides = 3;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    localStorage.setItem('mushi_onboarding_completed', 'true');
    onComplete?.();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50 && currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (diff < -50 && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft' && currentSlide > 0) setCurrentSlide(prev => prev - 1);
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100vw',
        height: '100vh',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#06070B',
        color: '#FFFFFF',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      {/* Dynamic Background Ambience Glow */}
      <div
        style={{
          position: 'absolute',
          top: currentSlide === 0 ? '25%' : '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background:
            currentSlide === 0
              ? 'radial-gradient(circle, rgba(255, 30, 86, 0.28) 0%, rgba(184, 0, 38, 0.12) 50%, transparent 70%)'
              : currentSlide === 1
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(214, 0, 54, 0.12) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(59, 130, 246, 0.14) 50%, transparent 70%)',
          filter: 'blur(60px)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Top Header Bar with Skip Action */}
      <header
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 'calc(16px + env(safe-area-inset-top, 0px)) 24px 4px',
          boxSizing: 'border-box',
          zIndex: 20
        }}
      >
        {currentSlide < totalSlides - 1 ? (
          <button
            onClick={handleSkip}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              padding: '6px 18px',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            Skip
          </button>
        ) : (
          <div style={{ height: '32px' }} />
        )}
      </header>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 8px',
          boxSizing: 'border-box',
          zIndex: 10,
          position: 'relative',
          maxWidth: '440px',
          margin: '0 auto',
          width: '100%',
          overflowY: 'auto'
        }}
      >
        {/* ═════════════════════════════════════════════════════════════════════
            SLIDE 1: EXACT 3D NEON STAGE WITH GLOWING QR CODE & FLOATING BADGES
            ═════════════════════════════════════════════════════════════════════ */}
        {currentSlide === 0 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            
            {/* Top Typography Header (Left Aligned matching reference image) */}
            <div style={{ textAlign: 'left', width: '100%', padding: '0 4px', boxSizing: 'border-box' }}>
              <h1
                style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 8px 0',
                  lineHeight: 1.15,
                  letterSpacing: '-0.5px',
                  fontFamily: 'Outfit, var(--font-display, sans-serif)'
                }}
              >
                Create Stunning
                <br />
                <span style={{ color: '#FF1E56' }}>QR</span> Codes
              </h1>
              <p
                style={{
                  fontSize: '13px',
                  color: '#94A3B8',
                  margin: 0,
                  lineHeight: 1.45,
                  maxWidth: '280px',
                  fontWeight: 400
                }}
              >
                Design beautiful QR codes with custom logos, colors, frames and unique styles.
              </p>
            </div>

            {/* Central 3D Interactive Stage Scene */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '4px 0 10px 0'
              }}
            >
              {/* Cosmic Sparkle Stars around the 3D space */}
              <span className="sparkle-star" style={{ top: '10%', left: '8%', color: '#FF4D80', fontSize: '13px' }}>✦</span>
              <span className="sparkle-star" style={{ top: '8%', right: '36%', color: '#FF4D80', fontSize: '9px', animationDelay: '1s' }}>✦</span>
              <span className="sparkle-star" style={{ top: '42%', left: '22%', color: '#FF2A6D', fontSize: '8px', animationDelay: '1.5s' }}>✦</span>
              <span className="sparkle-star" style={{ bottom: '28%', left: '16%', color: '#FF4D80', fontSize: '11px', animationDelay: '0.7s' }}>✦</span>
              <span className="sparkle-star" style={{ top: '34%', right: '6%', color: '#FFA07A', fontSize: '10px', animationDelay: '2s' }}>✦</span>
              <span className="sparkle-star" style={{ bottom: '38%', right: '22%', color: '#FF2A6D', fontSize: '8px', animationDelay: '1.2s' }}>✦</span>

              {/* Orbiting Ambient Light Ring Arcs */}
              <div
                style={{
                  position: 'absolute',
                  width: '270px',
                  height: '190px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255, 30, 86, 0.28)',
                  boxShadow: '0 0 18px rgba(255, 30, 86, 0.2)',
                  transform: 'rotate(-25deg) translateY(-8px)',
                  pointerEvents: 'none'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '280px',
                  height: '200px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255, 30, 86, 0.22)',
                  transform: 'rotate(15deg) translateY(12px)',
                  pointerEvents: 'none'
                }}
              />

              {/* 3D Tiered Glowing Stage / Stool Platform beneath the QR Code */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '240px',
                  height: '75px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2
                }}
              >
                {/* Upper Tier of 3D Stool Platform */}
                <div
                  style={{
                    width: '200px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(180deg, #D8042B 0%, #500010 100%)',
                    borderTop: '2.5px solid #FF3B69',
                    boxShadow: '0 0 35px rgba(255, 30, 86, 0.9), inset 0 2px 14px rgba(255, 255, 255, 0.5)',
                    position: 'relative',
                    zIndex: 3
                  }}
                />
                {/* Lower Tier of 3D Stool Platform */}
                <div
                  style={{
                    width: '235px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'linear-gradient(180deg, #7A0018 0%, #200006 100%)',
                    borderTop: '2px solid #FF1E56',
                    boxShadow: '0 14px 38px rgba(0, 0, 0, 0.95), 0 0 45px rgba(216, 4, 43, 0.6)',
                    marginTop: '-26px',
                    zIndex: 2
                  }}
                />
                {/* Base Floor Glow Aura */}
                <div
                  style={{
                    width: '270px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(255, 30, 86, 0.5) 0%, transparent 70%)',
                    filter: 'blur(16px)',
                    marginTop: '-22px',
                    zIndex: 1
                  }}
                />
              </div>

              {/* 3D Floating Glowing QR Code Box with exact 3D Rotation */}
              <div
                className="floating-qr-3d"
                style={{
                  position: 'relative',
                  width: '195px',
                  height: '195px',
                  borderRadius: '32px',
                  background: 'linear-gradient(145deg, rgba(32, 6, 14, 0.96) 0%, rgba(10, 2, 5, 0.98) 100%)',
                  border: '3px solid #FF2A6D',
                  boxShadow: `
                    0 0 40px rgba(255, 30, 86, 0.7),
                    0 0 16px #FF1E56,
                    inset 0 0 22px rgba(255, 30, 86, 0.4),
                    0 30px 60px rgba(0, 0, 0, 0.9)
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  boxSizing: 'border-box',
                  zIndex: 10,
                  transform: 'perspective(900px) rotateX(15deg) rotateY(-18deg) rotateZ(5deg)',
                  marginBottom: '20px'
                }}
              >
                {/* Render the exact QR SVG */}
                <img
                  src={onboardingQrSvg}
                  alt="Mushi QR Code"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '22px'
                  }}
                />
              </div>

              {/* ═════════ 4 3D-ROTATED BORDERLESS FEATURE ICON TILES ═════════ */}

              {/* Badge 1: Top Right - Add Logo & Frame (3D Purple Tile + Text to the Right) */}
              <div
                className="anim-tile-purple"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 15
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #8B5CF6 0%, #6D28D9 55%, #4C1D95 100%)',
                    border: 'none',
                    boxShadow: `
                      0 12px 24px rgba(109, 40, 217, 0.6),
                      0 4px 10px rgba(0, 0, 0, 0.45),
                      inset 0 2px 2px rgba(255, 255, 255, 0.7),
                      inset 0 -3px 4px rgba(0, 0, 0, 0.5),
                      0 0 18px rgba(139, 92, 246, 0.4)
                    `,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <ImageIcon size={22} strokeWidth={2.4} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>Add Logo</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>&amp; Frame</span>
                </div>
              </div>

              {/* Badge 2: Top Left - Custom Designs (3D Magenta Tile + Centered Text Below) */}
              <div
                className="anim-tile-magenta"
                style={{
                  position: 'absolute',
                  top: '32px',
                  left: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 15
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #FF2A6D 0%, #D8042B 55%, #880018 100%)',
                    border: 'none',
                    boxShadow: `
                      0 12px 24px rgba(216, 4, 43, 0.6),
                      0 4px 10px rgba(0, 0, 0, 0.45),
                      inset 0 2px 2px rgba(255, 255, 255, 0.7),
                      inset 0 -3px 4px rgba(0, 0, 0, 0.5),
                      0 0 18px rgba(255, 42, 109, 0.4)
                    `,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  <Palette size={22} strokeWidth={2.4} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                </div>
                <div style={{ textAlign: 'center', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>Custom</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>Designs</span>
                </div>
              </div>

              {/* Badge 3: Bottom Left - Templates & Styles (Placed closer to the lower-left QR corner) */}
              <div
                className="anim-tile-blue"
                style={{
                  position: 'absolute',
                  bottom: '36px',
                  left: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 15
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #3B82F6 0%, #1D4ED8 55%, #172554 100%)',
                    border: 'none',
                    boxShadow: `
                      0 12px 24px rgba(29, 78, 216, 0.6),
                      0 4px 10px rgba(0, 0, 0, 0.45),
                      inset 0 2px 2px rgba(255, 255, 255, 0.7),
                      inset 0 -3px 4px rgba(0, 0, 0, 0.5),
                      0 0 18px rgba(59, 130, 246, 0.4)
                    `,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  <Grid size={22} strokeWidth={2.4} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                </div>
                <div style={{ textAlign: 'center', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>Templates</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>&amp; Styles</span>
                </div>
              </div>

              {/* Badge 4: Bottom Right - Colors & Gradients (3D Golden Amber Tile + Centered Text Below) */}
              <div
                className="anim-tile-amber"
                style={{
                  position: 'absolute',
                  bottom: '48px',
                  right: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 15
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #F59E0B 0%, #D97706 55%, #78350F 100%)',
                    border: 'none',
                    boxShadow: `
                      0 12px 24px rgba(217, 119, 6, 0.6),
                      0 4px 10px rgba(0, 0, 0, 0.45),
                      inset 0 2px 2px rgba(255, 255, 255, 0.7),
                      inset 0 -3px 4px rgba(0, 0, 0, 0.5),
                      0 0 18px rgba(245, 158, 11, 0.4)
                    `,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '20px',
                    fontFamily: 'serif'
                  }}
                >
                  <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>Tt</span>
                </div>
                <div style={{ textAlign: 'center', lineHeight: 1.15 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>Colors &amp;</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF', display: 'block', letterSpacing: '-0.2px' }}>Gradients</span>
                </div>
              </div>

            </div>

            {/* Bottom Security & Privacy Card (Matching reference card) */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '16px',
                padding: '10px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(10px)',
                marginTop: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    background: 'rgba(255, 30, 86, 0.12)',
                    border: '1px solid rgba(255, 30, 86, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF1E56',
                    flexShrink: 0
                  }}
                >
                  <ShieldCheck size={20} strokeWidth={2.3} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                    100% Secure &amp; Private
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400, marginTop: '2px', lineHeight: 1.2 }}>
                    Your data is safe with us.
                  </span>
                </div>
              </div>
              <ChevronRight size={18} color="#64748B" />
            </div>

          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            SLIDE 2: 1D & 2D BARCODES & SCANNER
            ═════════════════════════════════════════════════════════════════════ */}
        {currentSlide === 1 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            {/* Top Typography Header */}
            <div style={{ textAlign: 'left', width: '100%', padding: '0 4px', boxSizing: 'border-box' }}>
              <h1
                style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 8px 0',
                  lineHeight: 1.15,
                  letterSpacing: '-0.5px',
                  fontFamily: 'Outfit, var(--font-display, sans-serif)'
                }}
              >
                Professional
                <br />
                <span style={{ color: '#F59E0B' }}>Barcodes</span> Studio
              </h1>
              <p
                style={{
                  fontSize: '13px',
                  color: '#94A3B8',
                  margin: 0,
                  lineHeight: 1.45,
                  maxWidth: '290px',
                  fontWeight: 400
                }}
              >
                Generate and scan 1D &amp; 2D barcodes for retail, inventory, and industrial manufacturing standards.
              </p>
            </div>

            {/* Central 3D Barcode Visual */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '8px 0'
              }}
            >
              {/* Back Card 1: 2D Data Matrix */}
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '12px',
                  width: '95px',
                  height: '95px',
                  borderRadius: '20px',
                  background: 'linear-gradient(145deg, #101726 0%, #0a0f1c 100%)',
                  border: '1.5px solid rgba(59, 130, 246, 0.5)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  boxSizing: 'border-box',
                  transform: 'rotate(-10deg)',
                  animation: 'floatLeft 4.5s ease-in-out infinite'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 10px)', gap: 2 }}>
                  {[
                    1, 1, 1, 1, 1,
                    1, 0, 1, 0, 1,
                    1, 1, 0, 1, 0,
                    1, 0, 1, 1, 1,
                    1, 0, 1, 0, 1
                  ].map((cell, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        background: cell ? '#38BDF8' : 'rgba(56, 189, 248, 0.1)'
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#93C5FD', marginTop: 4 }}>
                  Data Matrix
                </span>
              </div>

              {/* Back Card 2: PDF417 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  right: '12px',
                  width: '115px',
                  height: '75px',
                  borderRadius: '18px',
                  background: 'linear-gradient(145deg, #1f170c 0%, #120e06 100%)',
                  border: '1.5px solid rgba(245, 158, 11, 0.5)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  transform: 'rotate(8deg)',
                  animation: 'floatRight 4.5s ease-in-out infinite'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '80%' }}>
                  <div style={{ height: 3, background: '#F59E0B', borderRadius: 1 }} />
                  <div style={{ display: 'flex', gap: 2, height: 16 }}>
                    {[2, 1, 3, 1, 2, 3, 1, 2, 1, 3].map((w, i) => (
                      <div key={i} style={{ width: `${w * 2}px`, height: '100%', background: '#F59E0B' }} />
                    ))}
                  </div>
                  <div style={{ height: 3, background: '#F59E0B', borderRadius: 1 }} />
                </div>
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#FCD34D' }}>PDF417 2D</span>
              </div>

              {/* Main Center Card: Code 128 / Scanner Studio */}
              <div
                style={{
                  width: '175px',
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, #181826 0%, #0d0d16 100%)',
                  border: '2px solid rgba(245, 158, 11, 0.65)',
                  boxShadow: '0 18px 45px rgba(245, 158, 11, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 14px',
                  gap: 10,
                  zIndex: 10,
                  backdropFilter: 'blur(12px)',
                  animation: 'floatCenter 4s ease-in-out infinite'
                }}
              >
                <div style={{ background: '#fff', borderRadius: '12px', padding: '8px 12px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: '36px' }}>
                    {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1].map((w, i) => (
                      <div key={i} style={{ width: `${w * 1.5}px`, height: '100%', background: '#000', borderRadius: '1px' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#000', letterSpacing: '2px', marginTop: '3px' }}>
                    890123456789
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Scan size={16} color="#F59E0B" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>30+ Standards</span>
                </div>
              </div>

              {/* Orbiting Barcode Feature Badges */}
              <OrbitBadge icon={BarcodeIcon} label="EAN & UPC" desc="Retail Standards" top="10px" right="6px" delay="0s" color="#F59E0B" />
              <OrbitBadge icon={Scan} label="Live Scanner" desc="Instant Camera Scan" bottom="16px" left="6px" delay="1s" color="#34D399" />
            </div>

            {/* Bottom Formats Summary Card */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '16px',
                padding: '10px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(10px)',
                marginTop: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F59E0B',
                    flexShrink: 0
                  }}
                >
                  <BarcodeIcon size={20} strokeWidth={2.3} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                    High-Precision Barcode Engine
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400, marginTop: '2px', lineHeight: 1.2 }}>
                    Auto checksum validation &amp; vector SVG output.
                  </span>
                </div>
              </div>
              <ChevronRight size={18} color="#64748B" />
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            SLIDE 3: BULK GENERATION ENGINE (Excel, CSV, 10K+ Codes)
            ═════════════════════════════════════════════════════════════════════ */}
        {currentSlide === 2 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            {/* Top Typography Header */}
            <div style={{ textAlign: 'left', width: '100%', padding: '0 4px', boxSizing: 'border-box' }}>
              <h1
                style={{
                  fontSize: '30px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 8px 0',
                  lineHeight: 1.15,
                  letterSpacing: '-0.5px',
                  fontFamily: 'Outfit, var(--font-display, sans-serif)'
                }}
              >
                Bulk Batch
                <br />
                <span style={{ color: '#10B981' }}>Generation</span> Engine
              </h1>
              <p
                style={{
                  fontSize: '13px',
                  color: '#94A3B8',
                  margin: 0,
                  lineHeight: 1.45,
                  maxWidth: '290px',
                  fontWeight: 400
                }}
              >
                Create thousands of QR codes and barcodes simultaneously from spreadsheets with 1-click ZIP export.
              </p>
            </div>

            {/* Central 3D Bulk Visual */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '8px 0'
              }}
            >
              {/* Main Center Batch Console */}
              <div
                style={{
                  width: '210px',
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, #101f18 0%, #0a1410 100%)',
                  border: '2px solid rgba(16, 185, 129, 0.65)',
                  boxShadow: '0 20px 48px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  gap: 8,
                  zIndex: 10,
                  backdropFilter: 'blur(12px)',
                  animation: 'floatCenter 4s ease-in-out infinite'
                }}
              >
                {/* Header Stats */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                      <FileSpreadsheet size={13} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>CSV / Excel</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 7px', borderRadius: 7 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#34D399', letterSpacing: '0.3px' }}>
                      10K+ CODES
                    </span>
                  </div>
                </div>

                {/* Progress Metric Bar */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: 700, color: '#94A3B8' }}>
                    <span>Batch Queue</span>
                    <span style={{ color: '#10B981' }}>10,000 / 10,000 Ready</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)', borderRadius: '10px' }} />
                  </div>
                </div>

                {/* Queue Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                  {[
                    { name: 'product_batch_01', count: '5.0k', tag: 'QR', color: '#FF1E56' },
                    { name: 'retail_barcode_02', count: '3.5k', tag: 'EAN', color: '#F59E0B' },
                    { name: 'vcard_members_03', count: '1.5k', tag: 'vCard', color: '#10B981' }
                  ].map((row, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '6px',
                        padding: '3.5px 7px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '9px'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#F1F5F9', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: '8px', fontWeight: 800, color: row.color, background: 'rgba(255,255,255,0.07)', padding: '1px 4px', borderRadius: 4 }}>
                          {row.tag}
                        </span>
                        <Check size={11} color="#10B981" strokeWidth={3} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 5 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>ZIP &amp; PDF Export</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#10B981', fontSize: '9px', fontWeight: 800, background: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '5px' }}>
                    <Download size={10} />
                    <span>Download All</span>
                  </div>
                </div>
              </div>

              {/* Orbiting Bulk Badges */}
              <OrbitBadge icon={FileSpreadsheet} label="CSV & Excel" desc="Instant Sheet Import" top="8px" left="6px" delay="0s" color="#10B981" />
              <OrbitBadge icon={Archive} label="ZIP Export" desc="Print Ready PDFs" bottom="14px" right="6px" delay="1s" color="#38BDF8" />
            </div>

            {/* Bottom Engine Card */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '16px',
                padding: '10px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(10px)',
                marginTop: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                    flexShrink: 0
                  }}
                >
                  <Layers size={20} strokeWidth={2.3} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                    High-Throughput Batch Engine
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400, marginTop: '2px', lineHeight: 1.2 }}>
                    Generate 1,000+ codes per second locally in browser.
                  </span>
                </div>
              </div>
              <ChevronRight size={18} color="#64748B" />
            </div>
          </div>
        )}

      </div>

      {/* Bottom Controls Bar (Pagination + Primary CTA Button) */}
      <footer
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          padding: '10px 24px calc(24px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box',
          zIndex: 20,
          maxWidth: '440px',
          margin: '0 auto'
        }}
      >
        {/* Animated Pagination Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[0, 1, 2].map((idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: isActive ? '22px' : '6px',
                  height: '6px',
                  borderRadius: '100px',
                  background: isActive ? '#FF1E56' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            );
          })}
        </div>

        {/* Primary CTA Button (Matching reference vibrant red gradient) */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FF1E56 0%, #D8042B 100%)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '0.2px',
            boxShadow: '0 8px 25px rgba(255, 30, 86, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>{currentSlide === totalSlides - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight size={18} strokeWidth={2.6} />
        </button>
      </footer>

      {/* Global Embedded Animations */}
      <style>{`
        .floating-qr-3d {
          animation: floatQR3D 5s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        @keyframes floatQR3D {
          0%, 100% {
            transform: perspective(900px) rotateX(15deg) rotateY(-18deg) rotateZ(5deg) translateY(0px);
          }
          50% {
            transform: perspective(900px) rotateX(17deg) rotateY(-16deg) rotateZ(6deg) translateY(-8px);
          }
        }
        .anim-tile-purple {
          animation: floatTilePurple 4.5s ease-in-out infinite;
        }
        @keyframes floatTilePurple {
          0%, 100% {
            transform: perspective(600px) rotateX(14deg) rotateY(-18deg) rotateZ(4deg) translateY(0px);
          }
          50% {
            transform: perspective(600px) rotateX(16deg) rotateY(-16deg) rotateZ(5deg) translateY(-5px);
          }
        }
        .anim-tile-magenta {
          animation: floatTileMagenta 4s ease-in-out infinite;
        }
        @keyframes floatTileMagenta {
          0%, 100% {
            transform: perspective(600px) rotateX(12deg) rotateY(16deg) rotateZ(-4deg) translateY(0px);
          }
          50% {
            transform: perspective(600px) rotateX(14deg) rotateY(14deg) rotateZ(-3deg) translateY(-5px);
          }
        }
        .anim-tile-blue {
          animation: floatTileBlue 4.2s ease-in-out infinite;
        }
        @keyframes floatTileBlue {
          0%, 100% {
            transform: perspective(600px) rotateX(12deg) rotateY(14deg) rotateZ(-3deg) translateY(0px);
          }
          50% {
            transform: perspective(600px) rotateX(14deg) rotateY(12deg) rotateZ(-2deg) translateY(-5px);
          }
        }
        .anim-tile-amber {
          animation: floatTileAmber 3.8s ease-in-out infinite;
        }
        @keyframes floatTileAmber {
          0%, 100% {
            transform: perspective(600px) rotateX(14deg) rotateY(-16deg) rotateZ(4deg) translateY(0px);
          }
          50% {
            transform: perspective(600px) rotateX(16deg) rotateY(-14deg) rotateZ(5deg) translateY(-5px);
          }
        }
        @keyframes floatCenter {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes floatLeft {
          0%, 100% { transform: rotate(-10deg) translateY(0px); }
          50% { transform: rotate(-8deg) translateY(-6px); }
        }
        @keyframes floatRight {
          0%, 100% { transform: rotate(8deg) translateY(0px); }
          50% { transform: rotate(10deg) translateY(-6px); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .sparkle-star {
          position: absolute;
          animation: twinkle 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 5;
        }
        .onboarding-slide-anim {
          animation: slideFadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// Sub-component: Floating Orbital Badge for Barcode and Bulk slides
function OrbitBadge({ icon: Icon, label, desc, top, bottom, left, right, color, delay }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        bottom,
        left,
        right,
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '14px',
        padding: '5px 10px 5px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 15,
        animation: `floatBadge 3.5s ease-in-out infinite ${delay}`
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '7px',
          background: `radial-gradient(circle, ${color}25 0%, rgba(255, 255, 255, 0.05) 100%)`,
          border: `1px solid ${color}65`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 10px ${color}35`
        }}
      >
        <Icon size={13} color={color} strokeWidth={2.4} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: 0 }}>
        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
          {label}
        </span>
        {desc && (
          <span style={{ fontSize: '8.5px', fontWeight: 600, color: 'rgba(203, 213, 225, 0.85)', lineHeight: 1.15, whiteSpace: 'nowrap', marginTop: 1 }}>
            {desc}
          </span>
        )}
      </div>
    </div>
  );
}
