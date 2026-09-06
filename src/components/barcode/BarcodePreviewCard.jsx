import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { validateBarcodeChecksum, calculateContrastRatio } from '../../utils/barcodeStandardsExtended';

export default function BarcodePreviewCard({
  canvasRef,
  bcid,
  text,
  barColor,
  bgColor,
  isDataValid,
  currentStandard,
  spec,
  borderWidth = 0,
  hasBorder = false
}) {
  const is2D = currentStandard?.category === '2d-matrix';

  // Checksum calculation and status
  const checksumResult = useMemo(() => {
    return validateBarcodeChecksum(bcid, text);
  }, [bcid, text]);

  // Contrast ratio calculation
  const contrastResult = useMemo(() => {
    return calculateContrastRatio(barColor, bgColor);
  }, [barColor, bgColor]);

  // Overall Quality Determination
  const quality = useMemo(() => {
    if (!isDataValid) {
      return { status: 'poor', label: '🔴 NEEDS ATTENTION', title: 'Invalid Barcode Data', color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.08)' };
    }
    if (checksumResult.isComplete && !checksumResult.isValid) {
      return { status: 'poor', label: '🔴 NEEDS ATTENTION', title: 'Invalid Checksum', color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.08)' };
    }
    if (contrastResult.status === 'poor') {
      return { status: 'poor', label: '🔴 NEEDS ATTENTION', title: 'Low Contrast Ratio', color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.08)' };
    }
    if (contrastResult.status === 'warning') {
      return { status: 'good', label: '🟡 GOOD', title: 'Acceptable Scan Reliability', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.08)' };
    }
    return { status: 'excellent', label: '🟢 EXCELLENT', title: 'Scan Ready', color: '#34C759', bg: 'rgba(52, 199, 89, 0.08)' };
  }, [isDataValid, checksumResult, contrastResult]);

  // EAN-13 specific check indicator
  const isEan13 = bcid === 'ean13';
  const isUpcA = bcid === 'upca';
  const cleanDigits = String(text || '').replace(/\D/g, '');

  return (
    <section style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '14px 16px 12px 16px',
      background: 'var(--bg-secondary, #F6F7FB)',
      borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.06))',
      boxSizing: 'border-box'
    }}>
      {/* ── Main Canvas Hero Card ── */}
      <div style={{
        width: '100%',
        maxWidth: 360,
        height: is2D ? 210 : 165,
        background: bgColor === 'transparent' ? '#FFFFFF' : (bgColor || '#FFFFFF'),
        borderRadius: 22,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
        border: hasBorder && borderWidth > 0
          ? `${borderWidth}px solid ${barColor || '#000000'}`
          : '1px solid var(--border-color, rgba(0,0,0,0.06))',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}>
        {/* Background checkerboard pattern if transparent */}
        {bgColor === 'transparent' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            backgroundImage: 'repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), repeating-linear-gradient(45deg, #ccc 25%, #fff 25%, #fff 75%, #ccc 75%, #ccc)',
            backgroundPosition: '0 0, 9px 9px',
            backgroundSize: '18px 18px',
            pointerEvents: 'none'
          }} />
        )}

        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            imageRendering: '-webkit-optimize-contrast',
            zIndex: 2
          }}
        />
      </div>

      {/* ── Validity / Quality Pill ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
        padding: '6px 14px',
        borderRadius: 20,
        background: quality.bg,
        border: `1px solid ${quality.color}33`,
        maxWidth: 360,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {quality.status === 'excellent' ? (
          <CheckCircle size={15} color={quality.color} strokeWidth={2.5} />
        ) : quality.status === 'good' ? (
          <AlertTriangle size={15} color={quality.color} strokeWidth={2.5} />
        ) : (
          <XCircle size={15} color={quality.color} strokeWidth={2.5} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: quality.color, letterSpacing: '0.2px' }}>
            {isEan13 && isDataValid && checksumResult.isValid && checksumResult.isComplete
              ? '✓ Valid EAN-13'
              : isUpcA && isDataValid && checksumResult.isValid && checksumResult.isComplete
              ? '✓ Valid UPC-A'
              : isDataValid
              ? `✓ Valid ${currentStandard?.name || 'Barcode'}`
              : 'Invalid Barcode Data'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary, #636366)', fontWeight: 500, marginTop: 1 }}>
            {isEan13 && isDataValid && checksumResult.isComplete && checksumResult.isValid
              ? '13 digits • Checksum OK • Scan Ready'
              : isUpcA && isDataValid && checksumResult.isComplete && checksumResult.isValid
              ? '12 digits • Checksum OK • Scan Ready'
              : isDataValid
              ? `${quality.title} • Contrast ${contrastResult.ratio}:1`
              : (currentStandard?.errorMsg || 'Please verify data format')}
          </span>
        </div>
      </div>
    </section>
  );
}
