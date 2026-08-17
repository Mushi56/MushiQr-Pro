import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Palette,
  Image,
  Layers,
  CheckCircle2,
  Scan,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  Sliders,
  Eye,
  Archive,
  Download,
  Barcode as BarcodeIcon,
  Check,
  Type
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
        backgroundColor: 'var(--bg-primary, #030305)',
        color: 'var(--text-primary, #FFFFFF)',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      {/* Dynamic Background Ambience Gradient */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background:
            currentSlide === 0
              ? 'radial-gradient(circle, rgba(214, 0, 54, 0.22) 0%, rgba(139, 92, 246, 0.14) 50%, transparent 70%)'
              : currentSlide === 1
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(214, 0, 54, 0.12) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(59, 130, 246, 0.14) 50%, transparent 70%)',
          filter: 'blur(55px)',
          transition: 'background 0.5s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Top Header Bar with Skip Action Only */}
      <header
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: 'calc(16px + env(safe-area-inset-top, 0px)) 24px 8px',
          boxSizing: 'border-box',
          zIndex: 10
        }}
      >
        {currentSlide < totalSlides - 1 && (
          <button
            onClick={handleSkip}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-color, rgba(255,255,255,0.12))',
              color: 'var(--text-secondary, #CBD5E1)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Skip
          </button>
        )}
      </header>

      {/* Main Slide Presentation Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
          zIndex: 2,
          position: 'relative',
          maxWidth: '560px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* ═════════════════════════════════════════════════════════════════════
            SLIDE 1: Beautiful Real Custom QR Code (Pillow Eyes, Fluid Dots, Vibrant Red & Center Logo)
            ═════════════════════════════════════════════════════════════════════ */}
        {currentSlide === 0 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Visual: Enlarged Custom QR Code with Glassmorphism and Orbiting Features */}
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '255px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}
            >
              {/* Premium Glass QR Frame (Enlarged Size) */}
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '30px',
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(20, 20, 32, 0.95) 100%)',
                  border: '2px solid rgba(214, 0, 54, 0.55)',
                  boxShadow: '0 24px 56px rgba(214, 0, 54, 0.38), 0 0 35px rgba(255, 23, 68, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '12px',
                  boxSizing: 'border-box',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  animation: 'floatCenter 4s ease-in-out infinite'
                }}
              >
                {/* Onboarding QR Code SVG rendered perfectly centered */}
                <img
                  src={onboardingQrSvg}
                  alt="Onboarding QR Code"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              {/* Orbiting Core QR Feature Badges: Color, Style, Logo, Templates, Text */}
              <OrbitBadge icon={Image} label="Logo" desc="PNG, SVG & Brand Icons" top="8px" left="6px" delay="0s" color="#FF2A55" />
              <OrbitBadge icon={Sliders} label="Style" desc="Dots, Eyes & Shapes" top="10px" right="6px" delay="0.5s" color="#A855F7" />
              <OrbitBadge icon={Type} label="Text" desc="Fonts & Typography" bottom="14px" left="4px" delay="1s" color="#38BDF8" />
              <OrbitBadge icon={Palette} label="Color" desc="Gradients & Custom Fills" bottom="12px" right="6px" delay="1.5s" color="#FF1744" />
              <OrbitBadge icon={Layers} label="Templates" desc="Poster Layout Presets" top="48%" right="-14px" delay="2s" color="#FBBF24" />
            </div>

            {/* Typography */}
            <h2
              style={{
                fontSize: '21px',
                fontWeight: 850,
                background: 'linear-gradient(135deg, #FFFFFF 35%, #FF2A55 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 6px',
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
                fontFamily: 'Outfit, var(--font-display, sans-serif)'
              }}
            >
              Custom QR Studio
            </h2>
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--text-secondary, #94A3B8)',
                margin: 0,
                lineHeight: 1.45,
                maxWidth: '320px',
                fontWeight: 450
              }}
            >
              Craft stunning custom QR codes with your company logo, custom dot patterns, unique eye shapes, and rich gradients.
            </p>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            SLIDE 2: Dedicated to 1D & 2D Barcodes & Scanner
            ═════════════════════════════════════════════════════════════════════ */}
        {currentSlide === 1 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Visual Illustration: 1D & 2D Barcodes with Floating Orbit Badges */}
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '255px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}
            >
              {/* Back Card 1: 2D Data Matrix Matrix Code (Non-linear 2D barcode) */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
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
                {/* Embedded 2D Data Matrix Pattern */}
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

              {/* Back Card 2: PDF417 Stacked 2D Barcode */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
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
                  width: '165px',
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
                  zIndex: 2,
                  backdropFilter: 'blur(12px)',
                  animation: 'floatCenter 4s ease-in-out infinite'
                }}
              >
                <div style={{ background: '#fff', borderRadius: '12px', padding: '8px 12px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: '34px' }}>
                    {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1].map((w, i) => (
                      <div key={i} style={{ width: `${w * 1.5}px`, height: '100%', background: '#000', borderRadius: '1px' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#000', letterSpacing: '2px', marginTop: '3px' }}>
                    890123456789
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Scan size={15} color="#F59E0B" />
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#FFFFFF' }}>All Barcode Standards</span>
                </div>
              </div>

              {/* Orbiting Barcode Feature Badges with Icon Containers & Descriptions */}
              <OrbitBadge icon={BarcodeIcon} label="EAN & UPC" desc="Retail Standards" top="8px" left="6px" delay="0s" color="#F59E0B" />
              <OrbitBadge icon={Layers} label="Code 128" desc="Logistics Barcodes" top="10px" right="6px" delay="0.5s" color="#38BDF8" />
              <OrbitBadge icon={Scan} label="Live Scanner" desc="Ultra Fast Detection" bottom="14px" left="4px" delay="1s" color="#34D399" />
              <OrbitBadge icon={Zap} label="Data Matrix" desc="High Density 2D" bottom="12px" right="6px" delay="1.5s" color="#A855F7" />
              <OrbitBadge icon={CheckCircle2} label="Checksums" desc="Auto Check Digit" top="48%" right="-14px" delay="2s" color="#FB7185" />
            </div>

            {/* Typography */}
            <h2
              style={{
                fontSize: '21px',
                fontWeight: 850,
                background: 'linear-gradient(135deg, #FFFFFF 35%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 6px',
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
                fontFamily: 'Outfit, var(--font-display, sans-serif)'
              }}
            >
              Professional Barcodes
            </h2>
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--text-secondary, #94A3B8)',
                margin: 0,
                lineHeight: 1.45,
                maxWidth: '320px',
                fontWeight: 450
              }}
            >
              Generate and scan 1D &amp; 2D barcodes for retail, inventory, shipping, and industrial manufacturing standards.
            </p>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            SLIDE 3: Dedicated to Bulk Batch Generation (QRs, Barcodes, Excel/CSV)
            ═════════════════════════════════════════════════════════════════════ */}
        {currentSlide === 2 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Visual Illustration: Multi-code Deck with CSV/Excel & Orbiting Badges */}
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '255px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}
            >
              {/* Back Card 1: Batch QRs Stack */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '10px',
                  width: '95px',
                  height: '95px',
                  borderRadius: '20px',
                  background: 'linear-gradient(145deg, #181226 0%, #0d0a17 100%)',
                  border: '1.5px solid rgba(168, 85, 247, 0.45)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  transform: 'rotate(-10deg)',
                  animation: 'floatLeft 4.5s ease-in-out infinite'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 14px)', gap: 3 }}>
                  {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((c, i) => (
                    <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c ? '#A855F7' : 'rgba(168, 85, 247, 0.15)' }} />
                  ))}
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#C084FC' }}>QR Batch</span>
              </div>

              {/* Back Card 2: Batch Barcodes Stack */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  width: '115px',
                  height: '75px',
                  borderRadius: '18px',
                  background: 'linear-gradient(145deg, #101c24 0%, #071017 100%)',
                  border: '1.5px solid rgba(56, 189, 248, 0.45)',
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
                <div style={{ display: 'flex', gap: 2, height: 22, alignItems: 'center' }}>
                  {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2].map((w, i) => (
                    <div key={i} style={{ width: `${w * 1.5}px`, height: '100%', background: '#38BDF8', borderRadius: 1 }} />
                  ))}
                </div>
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#7DD3FC' }}>Barcode Batch</span>
              </div>

              {/* Main Center Card: High-Tech CSV / Excel Batch Live Table */}
              <div
                style={{
                  width: '196px',
                  borderRadius: '24px',
                  background: 'linear-gradient(150deg, rgba(16, 35, 28, 0.95) 0%, rgba(8, 18, 14, 0.98) 100%)',
                  border: '2px solid rgba(16, 185, 129, 0.55)',
                  boxShadow: '0 20px 50px rgba(16, 185, 129, 0.28), 0 0 30px rgba(16, 185, 129, 0.15)',
                  padding: '13px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  zIndex: 2,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
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
                      5K+ CODES
                    </span>
                  </div>
                </div>

                {/* Progress Metric Bar */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: 700, color: '#94A3B8' }}>
                    <span>Batch Engine</span>
                    <span style={{ color: '#10B981' }}>5,000 / 5,000 Ready</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)', borderRadius: '10px' }} />
                  </div>
                </div>

                {/* Simulated Batch Queue Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                  {[
                    { name: 'product_batch_01', count: '2.5k', tag: 'QR', color: '#A855F7' },
                    { name: 'retail_barcode_02', count: '1.8k', tag: 'EAN', color: '#F59E0B' },
                    { name: 'vcard_members_03', count: '700', tag: 'vCard', color: '#10B981' }
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
                        <Check size={10.5} color="#10B981" strokeWidth={3} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 5 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8' }}>ZIP & PDF Sheet</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#10B981', fontSize: '9px', fontWeight: 800, background: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '5px' }}>
                    <Download size={10} />
                    <span>Download All</span>
                  </div>
                </div>
              </div>

              {/* Orbiting Bulk Feature Badges with Icon Containers & Descriptions */}
              <OrbitBadge icon={FileSpreadsheet} label="CSV & Excel" desc="Instant Sheets Import" top="8px" left="4px" delay="0s" color="#10B981" />
              <OrbitBadge icon={Layers} label="Multi-Format" desc="QR & Barcode Batches" top="10px" right="4px" delay="0.5s" color="#A855F7" />
              <OrbitBadge icon={Archive} label="ZIP Export" desc="Single & Multi PDFs" bottom="14px" left="4px" delay="1s" color="#38BDF8" />
              <OrbitBadge icon={Zap} label="Fast Engine" desc="1,000+ Codes / Sec" bottom="12px" right="4px" delay="1.5s" color="#F59E0B" />
              <OrbitBadge icon={CheckCircle2} label="Bulk Sync" desc="Sticky Label Sheets" top="48%" right="-14px" delay="2s" color="#34D399" />
            </div>

            {/* Typography */}
            <h2
              style={{
                fontSize: '21px',
                fontWeight: 850,
                background: 'linear-gradient(135deg, #FFFFFF 35%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 6px',
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
                fontFamily: 'Outfit, var(--font-display, sans-serif)'
              }}
            >
              Bulk Generation Engine
            </h2>
            <p
              style={{
                fontSize: '12.5px',
                color: 'var(--text-secondary, #94A3B8)',
                margin: 0,
                lineHeight: 1.45,
                maxWidth: '320px',
                fontWeight: 450
              }}
            >
              Create hundreds of QR codes and barcodes simultaneously from CSV/Excel or sequential numbers with 1-click ZIP export.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar (Pagination + Primary CTA) */}
      <footer
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: '16px 24px calc(24px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box',
          zIndex: 10,
          maxWidth: '560px',
          margin: '0 auto'
        }}
      >
        {/* Animated Pagination Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[0, 1, 2].map((idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: isActive ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: isActive ? '#D60036' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            );
          })}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #D60036 0%, #B5002D 100%)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '0.2px',
            boxShadow: '0 8px 24px rgba(214, 0, 54, 0.35)',
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
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </footer>

      <style>{`
        @keyframes floatCenter {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes floatLeft {
          0%, 100% { transform: rotate(-8deg) translateY(0px); }
          50% { transform: rotate(-6deg) translateY(-5px); }
        }
        @keyframes floatRight {
          0%, 100% { transform: rotate(8deg) translateY(0px); }
          50% { transform: rotate(10deg) translateY(-5px); }
        }
        .onboarding-slide-anim {
          animation: slideFadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// Sub-component: Floating Orbital Badge with Glassmorphism & Dedicated Icon Container
function OrbitBadge({ icon: Icon, label, desc, top, bottom, left, right, color, delay }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        bottom,
        left,
        right,
        background: 'rgba(15, 23, 42, 0.78)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '14px',
        padding: '5px 10px 5px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        zIndex: 6,
        animation: `orbitFloat 3.5s ease-in-out infinite ${delay}`
      }}
    >
      {/* Dedicated Icon Glass Container */}
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

      {/* Title & Description Stack */}
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

      <style>{`
        @keyframes orbitFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
