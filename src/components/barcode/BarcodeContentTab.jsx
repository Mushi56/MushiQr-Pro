import React, { useMemo } from 'react';
import { Pencil, Check, AlertCircle, Sparkles, RefreshCw, Hash } from 'lucide-react';
import {
  calculateEAN13CheckDigit,
  calculateUPCACheckDigit,
  calculateEAN8CheckDigit,
  calculateITF14CheckDigit,
  validateBarcodeChecksum
} from '../../utils/barcodeStandardsExtended';

export default function BarcodeContentTab({
  bcid,
  text,
  onChangeText,
  currentStandard,
  spec,
  autoCheckDigit,
  onToggleAutoCheckDigit,
  onOpenDataModal
}) {
  const digits = String(text || '').replace(/\D/g, '');

  // Determine check digit calculations
  const checkDigitInfo = useMemo(() => {
    return validateBarcodeChecksum(bcid, text);
  }, [bcid, text]);

  // Handle manual input with auto-check digit handling
  const handleInputChange = (e) => {
    let val = e.target.value;

    if (bcid === 'ean13') {
      const clean = val.replace(/\D/g, '').slice(0, 13);
      if (autoCheckDigit) {
        if (clean.length === 12) {
          const cd = calculateEAN13CheckDigit(clean);
          onChangeText(`${clean}${cd}`);
          return;
        } else if (clean.length === 13) {
          const cd = calculateEAN13CheckDigit(clean.slice(0, 12));
          onChangeText(`${clean.slice(0, 12)}${cd}`);
          return;
        }
      }
      onChangeText(clean);
      return;
    }

    if (bcid === 'upca') {
      const clean = val.replace(/\D/g, '').slice(0, 12);
      if (autoCheckDigit) {
        if (clean.length === 11) {
          const cd = calculateUPCACheckDigit(clean);
          onChangeText(`${clean}${cd}`);
          return;
        } else if (clean.length === 12) {
          const cd = calculateUPCACheckDigit(clean.slice(0, 11));
          onChangeText(`${clean.slice(0, 11)}${cd}`);
          return;
        }
      }
      onChangeText(clean);
      return;
    }

    if (bcid === 'ean8') {
      const clean = val.replace(/\D/g, '').slice(0, 8);
      if (autoCheckDigit) {
        if (clean.length === 7) {
          const cd = calculateEAN8CheckDigit(clean);
          onChangeText(`${clean}${cd}`);
          return;
        } else if (clean.length === 8) {
          const cd = calculateEAN8CheckDigit(clean.slice(0, 7));
          onChangeText(`${clean.slice(0, 7)}${cd}`);
          return;
        }
      }
      onChangeText(clean);
      return;
    }

    if (bcid === 'itf14') {
      const clean = val.replace(/\D/g, '').slice(0, 14);
      if (autoCheckDigit) {
        if (clean.length === 13) {
          const cd = calculateITF14CheckDigit(clean);
          onChangeText(`${clean}${cd}`);
          return;
        } else if (clean.length === 14) {
          const cd = calculateITF14CheckDigit(clean.slice(0, 13));
          onChangeText(`${clean.slice(0, 13)}${cd}`);
          return;
        }
      }
      onChangeText(clean);
      return;
    }

    onChangeText(val);
  };

  const isEan13 = bcid === 'ean13';
  const isUpcA = bcid === 'upca';
  const isEan8 = bcid === 'ean8';
  const isItf14 = bcid === 'itf14';
  const supportsAutoChecksum = isEan13 || isUpcA || isEan8 || isItf14;

  const isNumericOnly = currentStandard?.validate && currentStandard.errorMsg?.toLowerCase().includes('digit');

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Format Subtitle Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2px'
      }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary, #1C1C1E)', letterSpacing: '-0.3px' }}>
            {spec?.title || currentStandard?.name}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary, #636366)', margin: '2px 0 0 0' }}>
            {spec?.subtitle || currentStandard?.desc}
          </p>
        </div>

        {/* Structured Field Assistant button */}
        <button
          onClick={onOpenDataModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(214, 0, 61, 0.08)',
            border: '1px solid rgba(214, 0, 61, 0.2)',
            color: 'var(--accent-primary, #D6003D)',
            padding: '8px 14px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Pencil size={13} strokeWidth={2.5} />
          <span>Fields</span>
        </button>
      </div>

      {/* ── Barcode Content Input ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary, #636366)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            CONTENT / DATA
          </label>
          <span style={{ fontSize: 11, color: 'var(--text-muted, #8E8E93)', fontWeight: 600 }}>
            {text.length} chars
          </span>
        </div>

        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input, #FFFFFF)',
          borderRadius: 16,
          border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
          padding: '0 14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          height: 48
        }}>
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            inputMode={isNumericOnly ? 'numeric' : 'text'}
            placeholder={currentStandard?.placeholder || 'Enter barcode data'}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.5px',
              color: 'var(--text-primary, #1C1C1E)'
            }}
          />
          {text && (
            <button
              onClick={() => onChangeText('')}
              style={{
                background: 'var(--bg-hover, rgba(0,0,0,0.05))',
                border: 'none',
                borderRadius: '50%',
                width: 22,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted, #8E8E93)',
                fontSize: 12,
                fontWeight: 700
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Validation hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          {currentStandard.validate(text) ? (
            <span style={{ fontSize: 11, color: '#34C759', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={12} strokeWidth={3} /> {currentStandard.hint || 'Format valid'}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: '#FF3B30', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={12} strokeWidth={2.5} /> {currentStandard.errorMsg}
            </span>
          )}
        </div>
      </div>

      {/* ── Auto Check Digit Toggle (EAN-13, UPC-A, EAN-8, ITF-14) ── */}
      {supportsAutoChecksum && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-card, #FFFFFF)',
          padding: '14px 16px',
          borderRadius: 18,
          border: '1px solid var(--border-color, rgba(0,0,0,0.08))',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary, #1C1C1E)' }}>
                Auto Check Digit
              </span>
              <span style={{
                fontSize: 9,
                fontWeight: 800,
                color: 'var(--accent-primary, #D6003D)',
                background: 'rgba(214, 0, 61, 0.08)',
                padding: '2px 6px',
                borderRadius: 6
              }}>
                GS1
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-secondary, #636366)', marginTop: 2, display: 'block' }}>
              {autoCheckDigit
                ? 'Automatically computes modulo-10 check digit'
                : 'Allow manual complete input (all digits)'}
            </span>
          </div>

          <button
            onClick={onToggleAutoCheckDigit}
            style={{
              width: 52,
              height: 30,
              borderRadius: 20,
              background: autoCheckDigit ? 'var(--accent-primary, #D6003D)' : 'var(--bg-hover, #E5E5EA)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.25s ease',
              padding: 2
            }}
          >
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#FFFFFF',
              transform: autoCheckDigit ? 'translateX(22px)' : 'translateX(0px)',
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>
      )}

      {/* ── Checksum Status Breakdown Card ── */}
      {supportsAutoChecksum && (
        <div style={{
          background: checkDigitInfo.isValid ? 'rgba(52, 199, 89, 0.06)' : 'rgba(255, 59, 48, 0.06)',
          border: `1px solid ${checkDigitInfo.isValid ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 59, 48, 0.2)'}`,
          borderRadius: 16,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: checkDigitInfo.isValid ? '#34C759' : '#FF3B30' }}>
              Modulo-10 Checksum Analysis
            </span>
            <span style={{ fontSize: 11, fontWeight: 800, color: checkDigitInfo.isValid ? '#34C759' : '#FF3B30' }}>
              {checkDigitInfo.isValid ? '✓ Valid Checksum' : '✕ Invalid Checksum'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary, #636366)' }}>
            <span>Calculated Check Digit:</span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>
              {checkDigitInfo.checkDigit !== null ? checkDigitInfo.checkDigit : '—'}
            </span>
          </div>

          {checkDigitInfo.actualDigit !== undefined && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary, #636366)' }}>
              <span>Entered Check Digit:</span>
              <span style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700,
                color: checkDigitInfo.actualDigit === checkDigitInfo.checkDigit ? '#34C759' : '#FF3B30'
              }}>
                {checkDigitInfo.actualDigit}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
