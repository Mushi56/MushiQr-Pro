import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Link,
  Wifi,
  Users,
  Share2,
  Briefcase,
  QrCode,
  Barcode,
  Layers,
  CheckCircle2,
  Scan,
  TrendingUp,
  FileSpreadsheet,
  Palette,
  ShieldCheck
} from 'lucide-react';
import AppIcon from '../AppIcon';

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
    // Swipe left (next)
    if (diff > 50 && currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    // Swipe right (prev)
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
      {/* Background Ambience Gradient */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: currentSlide === 0
            ? 'radial-gradient(circle, rgba(214, 0, 54, 0.22) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 70%)'
            : currentSlide === 1
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(214, 0, 54, 0.12) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(139, 92, 246, 0.14) 50%, transparent 70%)',
          filter: 'blur(50px)',
          transition: 'background 0.6s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Top Header Bar with Skip Button */}
      <header
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'calc(16px + env(safe-area-inset-top, 0px)) 24px 8px',
          boxSizing: 'border-box',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AppIcon size={34} shadow />
          <span
            style={{
              fontSize: '16px',
              fontWeight: 800,
              fontFamily: 'Outfit, var(--font-display, sans-serif)',
              letterSpacing: '-0.3px',
              color: 'var(--text-primary, #FFFFFF)'
            }}
          >
            Mushi QR Pro
          </span>
        </div>

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

      {/* Main Slides Content Container */}
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
        {/* Slide 1: Welcome / Create. Connect. Share. */}
        {currentSlide === 0 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Visual Illustration */}
            <div
              style={{
                position: 'relative',
                width: '260px',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}
            >
              {/* Central QR Card */}
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(214, 0, 54, 0.15) 0%, rgba(255, 77, 157, 0.25) 100%)',
                  border: '2px solid rgba(214, 0, 54, 0.5)',
                  boxShadow: '0 16px 36px rgba(214, 0, 54, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF2A55',
                  backdropFilter: 'blur(12px)',
                  animation: 'floatCenter 4s ease-in-out infinite'
                }}
              >
                <QrCode size={72} strokeWidth={2.2} />
              </div>

              {/* Orbiting Feature Badges */}
              <OrbitBadge icon={Link} label="URLs" top="8px" left="16px" delay="0s" color="#38BDF8" />
              <OrbitBadge icon={Wifi} label="Wi-Fi" top="12px" right="16px" delay="0.5s" color="#A855F7" />
              <OrbitBadge icon={Users} label="vCard" bottom="18px" left="8px" delay="1s" color="#34D399" />
              <OrbitBadge icon={Share2} label="Socials" bottom="12px" right="10px" delay="1.5s" color="#FB7185" />
              <OrbitBadge icon={Briefcase} label="Business" top="48%" right="-8px" delay="2s" color="#FBBF24" />
            </div>

            {/* Typography */}
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: 'var(--text-primary, #FFFFFF)',
                margin: '0 0 10px',
                lineHeight: 1.2,
                letterSpacing: '-0.4px',
                fontFamily: 'Outfit, var(--font-display, sans-serif)'
              }}
            >
              Create. Connect. Share.
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary, #CBD5E1)',
                margin: 0,
                lineHeight: 1.5,
                maxWidth: '360px',
                fontWeight: 500
              }}
            >
              Everything you need to create powerful QR codes and barcodes in one simple app.
            </p>
          </div>
        )}

        {/* Slide 2: QR & Barcodes */}
        {currentSlide === 1 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Visual Illustration: Card Deck of Codes */}
            <div
              style={{
                position: 'relative',
                width: '270px',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}
            >
              {/* Back Card 1: 2D DataMatrix */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '18px',
                  width: '90px',
                  height: '90px',
                  borderRadius: '16px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1.5px solid rgba(59, 130, 246, 0.35)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  transform: 'rotate(-10deg)',
                  animation: 'floatLeft 4.5s ease-in-out infinite'
                }}
              >
                <Layers size={32} color="#3B82F6" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#93C5FD' }}>Data Matrix</span>
              </div>

              {/* Back Card 2: 1D EAN-13 Retail Barcode */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '14px',
                  width: '110px',
                  height: '75px',
                  borderRadius: '16px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1.5px solid rgba(245, 158, 11, 0.35)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  transform: 'rotate(8deg)',
                  animation: 'floatRight 4.5s ease-in-out infinite'
                }}
              >
                <Barcode size={34} color="#F59E0B" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#FCD34D' }}>EAN-13 Retail</span>
              </div>

              {/* Main Center Card: Live Scanner + QR Frame */}
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  border: '2px solid rgba(59, 130, 246, 0.6)',
                  boxShadow: '0 16px 40px rgba(59, 130, 246, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  zIndex: 2,
                  backdropFilter: 'blur(12px)',
                  animation: 'floatCenter 4s ease-in-out infinite'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <QrCode size={56} color="#60A5FA" />
                  <Scan size={36} color="#38BDF8" style={{ position: 'absolute', top: -4, left: -4, opacity: 0.8 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.3px' }}>Scanner + Generator</span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: 'var(--text-primary, #FFFFFF)',
                margin: '0 0 10px',
                lineHeight: 1.2,
                letterSpacing: '-0.4px',
                fontFamily: 'Outfit, var(--font-display, sans-serif)'
              }}
            >
              Create QR Codes &amp; Barcodes
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary, #CBD5E1)',
                margin: '0 0 18px',
                lineHeight: 1.5,
                maxWidth: '360px',
                fontWeight: 500
              }}
            >
              Generate professional QR codes and popular barcode formats in seconds.
            </p>

            {/* Feature Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: '340px' }}>
              {['50+ QR Types', 'Multiple Barcodes', 'Custom Designs', 'Fast Generation'].map((feat, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '100px',
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--text-primary, #FFFFFF)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <CheckCircle2 size={12} color="#34D399" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide 3: Smart & Powerful Tools */}
        {currentSlide === 2 && (
          <div className="onboarding-slide-anim" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {/* Visual Illustration: SaaS Analytics & Bulk Card */}
            <div
              style={{
                position: 'relative',
                width: '270px',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}
            >
              {/* Main Dashboard Card */}
              <div
                style={{
                  width: '230px',
                  borderRadius: '22px',
                  background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 30, 0.95) 100%)',
                  border: '1.5px solid rgba(16, 185, 129, 0.45)',
                  boxShadow: '0 20px 48px rgba(16, 185, 129, 0.25)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  backdropFilter: 'blur(14px)',
                  animation: 'floatCenter 4s ease-in-out infinite'
                }}
              >
                {/* Header Stats */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                      <TrendingUp size={14} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>Scan Analytics</span>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: 6 }}>+148%</span>
                </div>

                {/* Simulated Chart Curve */}
                <div style={{ height: '38px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: 5, padding: '4px 0' }}>
                  {[30, 45, 60, 40, 75, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: '4px',
                        background: i === 6 ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.12)'
                      }}
                    />
                  ))}
                </div>

                {/* Sub Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileSpreadsheet size={13} color="#60A5FA" />
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#E2E8F0' }}>Bulk Batch ZIP</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Palette size={13} color="#F472B6" />
                    <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#E2E8F0' }}>Templates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: 'var(--text-primary, #FFFFFF)',
                margin: '0 0 10px',
                lineHeight: 1.2,
                letterSpacing: '-0.4px',
                fontFamily: 'Outfit, var(--font-display, sans-serif)'
              }}
            >
              Powerful Tools. One App.
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary, #CBD5E1)',
                margin: '0 0 16px',
                lineHeight: 1.5,
                maxWidth: '360px',
                fontWeight: 500
              }}
            >
              Create, customize, manage, and track your QR codes and barcodes from one powerful workspace.
            </p>

            {/* Feature Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', width: '100%', maxWidth: '360px', textAlign: 'left' }}>
              {[
                'QR Analytics',
                'Bulk Generation',
                'Pro Templates',
                'Custom Designs'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #FFFFFF)' }}>{feat}</span>
                </div>
              ))}
            </div>
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
          50% { transform: translateY(-8px); }
        }
        @keyframes floatLeft {
          0%, 100% { transform: rotate(-10deg) translateY(0px); }
          50% { transform: rotate(-8deg) translateY(-6px); }
        }
        @keyframes floatRight {
          0%, 100% { transform: rotate(8deg) translateY(0px); }
          50% { transform: rotate(10deg) translateY(-6px); }
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

// Sub-component: Floating Orbital Badge for Screen 1
function OrbitBadge({ icon: Icon, label, top, bottom, left, right, color, delay }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        bottom,
        left,
        right,
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '100px',
        padding: '5px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        animation: `orbitFloat 3.5s ease-in-out infinite ${delay}`
      }}
    >
      <Icon size={13} color={color} strokeWidth={2.4} />
      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#F1F5F9' }}>{label}</span>
      <style>{`
        @keyframes orbitFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
