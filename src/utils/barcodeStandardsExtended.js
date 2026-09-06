/**
 * Barcode Standards Extended
 * Professional barcode specifications, checksum calculation, physical dimension conversion,
 * and WCAG contrast check utilities.
 */

// ─── Format Categorization ──────────────────────────────────────────────────
export const BARCODE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'retail', label: 'Retail' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'gs1', label: 'GS1' },
  { id: '2d', label: '2D' }
];

export const FORMAT_CATEGORY_MAP = {
  // Retail
  'ean13': 'retail',
  'ean8': 'retail',
  'upca': 'retail',
  'upce': 'retail',
  'msi': 'retail',

  // Industrial
  'code128': 'industrial',
  'code39': 'industrial',
  'code93': 'industrial',
  'itf14': 'industrial',
  'i25': 'industrial',
  'codabar': 'industrial',
  'code11': 'industrial',
  'telepen': 'industrial',
  'pharmacode': 'industrial',
  'channelcode': 'industrial',
  'postnet': 'industrial',
  'planet': 'industrial',
  'royalmail': 'industrial',

  // GS1
  'gs1128': 'gs1',
  'gs1databar': 'gs1',

  // 2D & Stacked
  'qrcode': '2d',
  'microqrcode': '2d',
  'datamatrix': '2d',
  'pdf417': '2d',
  'aztec': '2d',
  'maxicode': '2d',
  'hanxin': '2d',
  'codablockf': '2d',
  'code16k': '2d',
  'code49': '2d'
};

// ─── Format Technical Specs & Descriptions ──────────────────────────────────
export const BARCODE_SPECS = {
  'ean13': {
    title: 'EAN-13',
    subtitle: '13-digit retail barcode',
    type: '1D Linear',
    length: '13 digits',
    checksum: 'Required (Modulo 10)',
    usage: 'Point of sale retail products globally',
    standardDims: {
      moduleWidthMm: 0.33,
      barHeightMm: 22.85,
      quietZoneMm: 3.63,
      moduleWidthPx: 2,
      barHeightPx: 85,
      quietZonePx: 16
    }
  },
  'ean8': {
    title: 'EAN-8',
    subtitle: '8-digit compact retail barcode',
    type: '1D Linear',
    length: '8 digits',
    checksum: 'Required (Modulo 10)',
    usage: 'Small retail packages with limited label space',
    standardDims: {
      moduleWidthMm: 0.33,
      barHeightMm: 18.23,
      quietZoneMm: 2.31,
      moduleWidthPx: 2,
      barHeightPx: 75,
      quietZonePx: 14
    }
  },
  'upca': {
    title: 'UPC-A',
    subtitle: '12-digit standard retail barcode (US/Canada)',
    type: '1D Linear',
    length: '12 digits',
    checksum: 'Required (Modulo 10)',
    usage: 'North American retail point-of-sale',
    standardDims: {
      moduleWidthMm: 0.33,
      barHeightMm: 22.85,
      quietZoneMm: 3.63,
      moduleWidthPx: 2,
      barHeightPx: 85,
      quietZonePx: 16
    }
  },
  'upce': {
    title: 'UPC-E',
    subtitle: 'Zero-suppressed compact retail barcode',
    type: '1D Linear',
    length: '6, 7, or 8 digits',
    checksum: 'Required (Modulo 10)',
    usage: 'Small convenience items & retail packages',
    standardDims: {
      moduleWidthMm: 0.33,
      barHeightMm: 18.23,
      quietZoneMm: 2.31,
      moduleWidthPx: 2,
      barHeightPx: 75,
      quietZonePx: 14
    }
  },
  'code128': {
    title: 'Code 128',
    subtitle: 'High-density alphanumeric logistics barcode',
    type: '1D Linear',
    length: 'Variable',
    checksum: 'Required (Modulo 103, internal)',
    usage: 'Shipping containers, distribution, serial numbers',
    standardDims: {
      moduleWidthMm: 0.375,
      barHeightMm: 25.0,
      quietZoneMm: 3.75,
      moduleWidthPx: 2,
      barHeightPx: 80,
      quietZonePx: 16
    }
  },
  'code39': {
    title: 'Code 39',
    subtitle: 'Alphanumeric industrial legacy standard',
    type: '1D Linear',
    length: 'Variable',
    checksum: 'Optional (Modulo 43)',
    usage: 'Automotive, aerospace, defense (MIL-STD-129)',
    standardDims: {
      moduleWidthMm: 0.38,
      barHeightMm: 25.0,
      quietZoneMm: 3.8,
      moduleWidthPx: 2,
      barHeightPx: 80,
      quietZonePx: 16
    }
  },
  'code93': {
    title: 'Code 93',
    subtitle: 'Compact alphanumeric industrial barcode',
    type: '1D Linear',
    length: 'Variable',
    checksum: 'Two check characters (C and K)',
    usage: 'Canada Post, military packaging & postal tracking',
    standardDims: {
      moduleWidthMm: 0.35,
      barHeightMm: 25.0,
      quietZoneMm: 3.5,
      moduleWidthPx: 2,
      barHeightPx: 80,
      quietZonePx: 16
    }
  },
  'itf14': {
    title: 'ITF-14',
    subtitle: '14-digit master shipping carton standard',
    type: '1D Linear',
    length: '14 digits',
    checksum: 'Required (Modulo 10)',
    usage: 'Outer shipping cartons & corrugated packaging',
    standardDims: {
      moduleWidthMm: 0.50,
      barHeightMm: 32.0,
      quietZoneMm: 5.0,
      moduleWidthPx: 2,
      barHeightPx: 90,
      quietZonePx: 18
    }
  },
  'i25': {
    title: 'Interleaved 2 of 5',
    subtitle: 'High-density numeric industrial barcode',
    type: '1D Linear',
    length: 'Even number of digits',
    checksum: 'Optional',
    usage: 'Warehousing, distribution, industrial inventory',
    standardDims: {
      moduleWidthMm: 0.38,
      barHeightMm: 24.0,
      quietZoneMm: 3.8,
      moduleWidthPx: 2,
      barHeightPx: 75,
      quietZonePx: 16
    }
  },
  'codabar': {
    title: 'Codabar',
    subtitle: 'Library and blood bank tracking barcode',
    type: '1D Linear',
    length: 'Variable (Starts/ends A-D)',
    checksum: 'Optional',
    usage: 'Blood banks, libraries, air waybills, photo labs',
    standardDims: {
      moduleWidthMm: 0.38,
      barHeightMm: 24.0,
      quietZoneMm: 3.8,
      moduleWidthPx: 2,
      barHeightPx: 75,
      quietZonePx: 16
    }
  },
  'gs1128': {
    title: 'GS1-128',
    subtitle: 'GS1 logistics carrier identifier barcode',
    type: '1D Linear',
    length: 'Variable (with Application Identifiers)',
    checksum: 'Required (Modulo 103)',
    usage: 'Supply chain logistics, pallet & carton labels',
    standardDims: {
      moduleWidthMm: 0.495,
      barHeightMm: 32.0,
      quietZoneMm: 4.95,
      moduleWidthPx: 1.5,
      barHeightPx: 80,
      quietZonePx: 16
    }
  },
  'gs1databar': {
    title: 'GS1 DataBar',
    subtitle: 'Omnidirectional expanded retail barcode',
    type: '1D Linear',
    length: '14 digits (GTIN)',
    checksum: 'Required (Modulo 10)',
    usage: 'Fresh produce, loose grocery items, coupons',
    standardDims: {
      moduleWidthMm: 0.254,
      barHeightMm: 13.0,
      quietZoneMm: 2.54,
      moduleWidthPx: 2,
      barHeightPx: 65,
      quietZonePx: 16
    }
  },
  'qrcode': {
    title: 'QR Code',
    subtitle: 'Quick Response 2D matrix symbology',
    type: '2D Matrix',
    length: 'Up to 7,089 numeric / 4,296 alphanumeric',
    checksum: 'Reed-Solomon Error Correction',
    usage: 'Consumer engagement, mobile payments, URLs, product IDs',
    standardDims: {
      moduleWidthMm: 0.50,
      barHeightMm: null,
      quietZoneMm: 2.0,
      moduleWidthPx: 3,
      barHeightPx: null,
      quietZonePx: 12
    }
  },
  'microqrcode': {
    title: 'Micro QR',
    subtitle: 'Miniaturized 2D matrix for tiny spaces',
    type: '2D Matrix',
    length: 'Up to 35 numeric characters',
    checksum: 'Reed-Solomon Error Correction',
    usage: 'Small electronic components, medical vials, printed circuits',
    standardDims: {
      moduleWidthMm: 0.35,
      barHeightMm: null,
      quietZoneMm: 1.5,
      moduleWidthPx: 4,
      barHeightPx: null,
      quietZonePx: 12
    }
  },
  'datamatrix': {
    title: 'Data Matrix',
    subtitle: '2D matrix tiny industrial footprint',
    type: '2D Matrix',
    length: 'Up to 3,116 numeric / 2,335 alphanumeric',
    checksum: 'ECC 200 (Reed-Solomon)',
    usage: 'Direct Part Marking (DPM), healthcare (UDI), electronics',
    standardDims: {
      moduleWidthMm: 0.40,
      barHeightMm: null,
      quietZoneMm: 1.6,
      moduleWidthPx: 3,
      barHeightPx: null,
      quietZonePx: 12
    }
  },
  'pdf417': {
    title: 'PDF417',
    subtitle: 'Stacked high-capacity 2D barcode',
    type: '2D Stacked',
    length: 'Up to 1,800 bytes / 2,710 digits',
    checksum: 'User-selected Reed-Solomon levels',
    usage: 'Boarding passes, driver licenses, customs documentation',
    standardDims: {
      moduleWidthMm: 0.33,
      barHeightMm: 30.0,
      quietZoneMm: 3.3,
      moduleWidthPx: 2,
      barHeightPx: 80,
      quietZonePx: 14
    }
  },
  'aztec': {
    title: 'Aztec Code',
    subtitle: '2D transit and ticketing matrix',
    type: '2D Matrix',
    length: 'Up to 3,832 numeric / 3,067 alphanumeric',
    checksum: 'Reed-Solomon Error Correction',
    usage: 'Airline electronic tickets, train tickets, transit passes',
    standardDims: {
      moduleWidthMm: 0.45,
      barHeightMm: null,
      quietZoneMm: 0.0, // Aztec does not require quiet zones!
      moduleWidthPx: 3,
      barHeightPx: null,
      quietZonePx: 12
    }
  }
};

// ─── Real Checksum Calculation ──────────────────────────────────────────────
export function calculateEAN13CheckDigit(first12Digits) {
  const digits = String(first12Digits).replace(/\D/g, '').slice(0, 12);
  if (digits.length !== 12) return null;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits[i], 10);
    // Even index (0, 2, 4...) * 1; Odd index (1, 3, 5...) * 3
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

export function calculateUPCACheckDigit(first11Digits) {
  const digits = String(first11Digits).replace(/\D/g, '').slice(0, 11);
  if (digits.length !== 11) return null;
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(digits[i], 10);
    // Odd index in 1-based (0, 2, 4...) * 3; Even index (1, 3, 5...) * 1
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

export function calculateEAN8CheckDigit(first7Digits) {
  const digits = String(first7Digits).replace(/\D/g, '').slice(0, 7);
  if (digits.length !== 7) return null;
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const digit = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

export function calculateITF14CheckDigit(first13Digits) {
  const digits = String(first13Digits).replace(/\D/g, '').slice(0, 13);
  if (digits.length !== 13) return null;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    const digit = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validates check digit for standards that mandate a final checksum digit
 */
export function validateBarcodeChecksum(bcid, val) {
  const digits = String(val || '').replace(/\D/g, '');
  switch (bcid) {
    case 'ean13': {
      if (digits.length === 12) return { isValid: true, isComplete: false, checkDigit: calculateEAN13CheckDigit(digits) };
      if (digits.length === 13) {
        const expected = calculateEAN13CheckDigit(digits.slice(0, 12));
        const actual = parseInt(digits[12], 10);
        return { isValid: expected === actual, isComplete: true, checkDigit: expected, actualDigit: actual };
      }
      return { isValid: false, isComplete: false, checkDigit: null };
    }
    case 'upca': {
      if (digits.length === 11) return { isValid: true, isComplete: false, checkDigit: calculateUPCACheckDigit(digits) };
      if (digits.length === 12) {
        const expected = calculateUPCACheckDigit(digits.slice(0, 11));
        const actual = parseInt(digits[11], 10);
        return { isValid: expected === actual, isComplete: true, checkDigit: expected, actualDigit: actual };
      }
      return { isValid: false, isComplete: false, checkDigit: null };
    }
    case 'ean8': {
      if (digits.length === 7) return { isValid: true, isComplete: false, checkDigit: calculateEAN8CheckDigit(digits) };
      if (digits.length === 8) {
        const expected = calculateEAN8CheckDigit(digits.slice(0, 7));
        const actual = parseInt(digits[7], 10);
        return { isValid: expected === actual, isComplete: true, checkDigit: expected, actualDigit: actual };
      }
      return { isValid: false, isComplete: false, checkDigit: null };
    }
    case 'itf14': {
      if (digits.length === 13) return { isValid: true, isComplete: false, checkDigit: calculateITF14CheckDigit(digits) };
      if (digits.length === 14) {
        const expected = calculateITF14CheckDigit(digits.slice(0, 13));
        const actual = parseInt(digits[13], 10);
        return { isValid: expected === actual, isComplete: true, checkDigit: expected, actualDigit: actual };
      }
      return { isValid: false, isComplete: false, checkDigit: null };
    }
    default:
      return { isValid: true, isComplete: true, checkDigit: null };
  }
}

// ─── Contrast Calculation (WCAG 2.0 Relative Luminance) ─────────────────────
function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getRelativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(fgHex, bgHex) {
  if (!bgHex || bgHex === 'transparent') {
    // If background is transparent, assume black against white for contrast check
    return { ratio: 21, label: '✓ Excellent (Transparent)', status: 'excellent', score: 21, description: 'Transparent background will depend on underlying surface.' };
  }
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  const rounded = Math.round(ratio * 10) / 10;

  if (ratio >= 7.0) {
    return { ratio: rounded, label: '✓ Excellent', status: 'excellent', score: rounded, description: 'High contrast ensures 100% optical camera readability.' };
  } else if (ratio >= 3.5) {
    return { ratio: rounded, label: '⚠ Low Contrast', status: 'warning', score: rounded, description: 'May be difficult to scan in low lighting.' };
  } else {
    return { ratio: rounded, label: '✕ Poor Contrast', status: 'poor', score: rounded, description: 'Scanning devices will likely fail to decode.' };
  }
}

// ─── Units & Dimension Math ─────────────────────────────────────────────────
// Standard 1 mm = 3.78 px at 96 DPI screen preview
const MM_TO_PX = 3.78;
const IN_TO_MM = 25.4;

export function convertDimension(val, fromUnit, toUnit) {
  if (val === null || val === undefined || isNaN(val)) return 0;
  if (fromUnit === toUnit) return val;

  // Convert fromUnit -> mm
  let inMm = val;
  if (fromUnit === 'px') inMm = val / MM_TO_PX;
  else if (fromUnit === 'in') inMm = val * IN_TO_MM;

  // Convert mm -> toUnit
  if (toUnit === 'mm') return Math.round(inMm * 100) / 100;
  if (toUnit === 'px') return Math.round(inMm * MM_TO_PX);
  if (toUnit === 'in') return Math.round((inMm / IN_TO_MM) * 1000) / 1000;
  return val;
}
