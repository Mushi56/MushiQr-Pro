import bwipjs from 'bwip-js';

export const BARCODE_STANDARDS = {
  'ean13': {
    name: 'EAN-13',
    desc: '13-digit standard retail format',
    placeholder: 'e.g. 4006381333931',
    defaultValue: '4006381333931',
    hint: '12 digits (13th check digit is auto-calculated)',
    validate: (val) => /^\d{12,13}$/.test(val),
    errorMsg: 'Must be exactly 12 or 13 digits'
  },
  'upca': {
    name: 'UPC-A',
    desc: '12-digit standard retail format (US)',
    placeholder: 'e.g. 012345678905',
    defaultValue: '012345678905',
    hint: '11 digits (12th check digit is auto-calculated)',
    validate: (val) => /^\d{11,12}$/.test(val),
    errorMsg: 'Must be exactly 11 or 12 digits'
  },
  'code128': {
    name: 'Code 128',
    desc: 'High-density alphanumeric logistics',
    placeholder: 'e.g. MushiPro-128',
    defaultValue: 'MushiPro-128',
    hint: 'Supports all standard ASCII characters',
    validate: (val) => /^[\x00-\x7F]+$/.test(val),
    errorMsg: 'Must contain ASCII characters only'
  },
  'code39': {
    name: 'Code 39',
    desc: 'Alphanumeric industrial legacy',
    placeholder: 'e.g. MUSHI 39',
    defaultValue: 'MUSHI 39',
    hint: 'Supports A-Z, 0-9, space, -, ., $, /, +, %',
    validate: (val) => /^[A-Z0-9\-\.\ \$\/\+\%]+$/.test(val.toUpperCase()),
    errorMsg: 'A-Z, 0-9, spaces, and - . $ / + % characters only'
  },
  'datamatrix': {
    name: 'Data Matrix',
    desc: '2D matrix tiny industrial footprint',
    placeholder: 'e.g. DataMatrix-Standard',
    defaultValue: 'DataMatrix-Standard',
    hint: 'Supports full alphanumeric/binary data',
    validate: (val) => val.length > 0 && val.length <= 1000,
    errorMsg: 'Cannot be empty or exceed 1000 characters'
  },
  'itf14': {
    name: 'ITF-14',
    desc: '14-digit bulk shipping carton standard',
    placeholder: 'e.g. 10012345678902',
    defaultValue: '10012345678902',
    hint: '13 digits (14th check digit is auto-calculated)',
    validate: (val) => /^\d{13,14}$/.test(val),
    errorMsg: 'Must be exactly 13 or 14 digits'
  },
  'ean8': {
    name: 'EAN-8',
    desc: '8-digit condensed retail format',
    placeholder: 'e.g. 40123455',
    defaultValue: '40123455',
    hint: '7 digits (8th check digit is auto-calculated)',
    validate: (val) => /^\d{7,8}$/.test(val),
    errorMsg: 'Must be exactly 7 or 8 digits'
  },
  'gs1databar': {
    name: 'GS1 DataBar',
    desc: 'Omnidirectional expanded retail',
    placeholder: 'e.g. 0100123456789012',
    defaultValue: '0100123456789012',
    hint: 'Exactly 13 or 14 digits (GTIN)',
    validate: (val) => /^\d{13,14}$/.test(val),
    errorMsg: 'Must be exactly 13 or 14 digits'
  },
  'pdf417': {
    name: 'PDF417',
    desc: '2D stacked high-capacity layout',
    placeholder: 'e.g. PDF417-ID-FORMAT-DATA-12345',
    defaultValue: 'PDF417-ID-FORMAT',
    hint: '2D stacked layout (holds hundreds of characters)',
    validate: (val) => val.length > 0 && val.length <= 1500,
    errorMsg: 'Cannot be empty or exceed 1500 characters'
  },
  'code93': {
    name: 'Code 93',
    desc: 'Compact legacy alphanumeric',
    placeholder: 'e.g. COMPACT-93',
    defaultValue: 'COMPACT-93',
    hint: 'Supports A-Z, 0-9, space, -, ., $, /, +, %',
    validate: (val) => /^[A-Z0-9\-\.\ \$\/\+\%]+$/.test(val.toUpperCase()),
    errorMsg: 'A-Z, 0-9, spaces, and - . $ / + % characters only'
  },
  'upce': {
    name: 'UPC-E',
    desc: 'Condensed 8-digit retail format',
    placeholder: 'e.g. 01234565',
    defaultValue: '01234565',
    hint: '6, 7, or 8 numeric digits only',
    validate: (val) => /^\d{6,8}$/.test(val),
    errorMsg: 'Must be 6, 7 or 8 digits'
  },
  'codabar': {
    name: 'Codabar',
    desc: 'Libraries and blood bank tracking',
    placeholder: 'e.g. A1234567B',
    defaultValue: 'A1234567B',
    hint: 'Starts/ends with letters A-D, numeric body',
    validate: (val) => /^[A-D][0-9\-\$\:\/\.\+]+[A-D]$/i.test(val),
    errorMsg: 'Must start and end with A-D and contain only numeric/special chars'
  },
  'code11': {
    name: 'Code 11',
    desc: 'Telecommunications standard',
    placeholder: 'e.g. 123-456-789',
    defaultValue: '123-456-789',
    hint: 'Numeric digits and hyphens only',
    validate: (val) => /^[0-9\-]+$/.test(val),
    errorMsg: 'Digits and hyphens only'
  },
  'msi': {
    name: 'MSI Plessey',
    desc: 'Retail shelf marking standard',
    placeholder: 'e.g. 1234567',
    defaultValue: '1234567',
    hint: 'Numeric digits only',
    validate: (val) => /^\d+$/.test(val),
    errorMsg: 'Digits only'
  },
  'i25': {
    name: 'Interleaved 2 of 5',
    desc: 'Industrial numeric format',
    placeholder: 'e.g. 12345678',
    defaultValue: '12345678',
    hint: 'Even number of digits only (e.g. 12, 3456)',
    validate: (val) => /^\d+$/.test(val) && val.length % 2 === 0,
    errorMsg: 'Digits only (must be even length)'
  },
  'postnet': {
    name: 'Postnet',
    desc: 'US Postal Service zip code tracking',
    placeholder: 'e.g. 12345',
    defaultValue: '12345',
    hint: 'Exactly 5, 9 or 11 digits for US zip routing',
    validate: (val) => /^\d{5}$|^\d{9}$|^\d{11}$/.test(val),
    errorMsg: 'Must be 5, 9 or 11 digits'
  },
  'planet': {
    name: 'Planet',
    desc: 'US Postal Service mail tracking',
    placeholder: 'e.g. 12345678901',
    defaultValue: '12345678901',
    hint: 'Exactly 11, 12, 13 or 14 digits',
    validate: (val) => /^\d{11,12}$|^\d{13,14}$/.test(val),
    errorMsg: 'Must be 11, 12, 13 or 14 digits'
  },
  'royalmail': {
    name: 'Royal Mail Customer Code',
    desc: 'UK Postal routing standard',
    placeholder: 'e.g. SN34RD1A',
    defaultValue: 'SN34RD1A',
    hint: 'Alphanumeric postal routing characters (RM4SCC)',
    validate: (val) => /^[A-Z0-9]+$/i.test(val),
    errorMsg: 'Alphanumeric characters only'
  },
  'gs1128': {
    name: 'GS1-128',
    desc: 'GS1 logistics carrier identifier',
    placeholder: 'e.g. (01)00012345678905(10)ABC-123',
    defaultValue: '(01)00012345678905(10)ABC-123',
    hint: 'ASCII with GS1 AI codes in parentheses e.g. (01)1234',
    validate: (val) => /^[\x00-\x7F]+$/.test(val),
    errorMsg: 'Must contain ASCII characters only'
  },
  'telepen': {
    name: 'Telepen',
    desc: 'Full-ASCII industrial format',
    placeholder: 'e.g. TELEPEN-ASCII',
    defaultValue: 'TELEPEN-ASCII',
    hint: 'Supports all 128 ASCII characters',
    validate: (val) => /^[\x00-\x7F]+$/.test(val),
    errorMsg: 'Must contain ASCII characters only'
  },
  'pharmacode': {
    name: 'Pharmacode',
    desc: 'Pharmaceutical packaging controls',
    placeholder: 'e.g. 11309',
    defaultValue: '11309',
    hint: 'Integer value between 3 and 131070 only',
    validate: (val) => /^\d+$/.test(val) && parseInt(val) >= 3 && parseInt(val) <= 131070,
    errorMsg: 'Numeric value between 3 and 131070 only'
  },
  'aztec': {
    name: 'Aztec Code',
    desc: '2D transit and ticketing matrix',
    placeholder: 'e.g. AZTEC-TICKET-DATA',
    defaultValue: 'AZTEC-TICKET-DATA',
    hint: 'High-density 2D transit matrix',
    validate: (val) => val.length > 0 && val.length <= 1500,
    errorMsg: 'Cannot be empty or exceed 1500 characters'
  },
  'maxicode': {
    name: 'MaxiCode',
    desc: '2D shipping matrix used by UPS',
    placeholder: 'e.g. UPS-MAXICODE-DATA',
    defaultValue: 'UPS-MAXICODE-DATA',
    hint: 'Hexagonal matrix layout (holds up to 138 chars)',
    validate: (val) => val.length > 0 && val.length <= 138,
    errorMsg: 'Cannot exceed 138 characters'
  },
  'qrcode': {
    name: 'QR Code (2D)',
    desc: 'Quick Response matrix format',
    placeholder: 'e.g. QR-INTEGRATION',
    defaultValue: 'QR-INTEGRATION',
    hint: 'Standard 2D Quick Response format',
    validate: (val) => val.length > 0,
    errorMsg: 'Cannot be empty'
  },
  'microqrcode': {
    name: 'Micro QR',
    desc: 'Compact QR code standard',
    placeholder: 'e.g. MICRO-QR',
    defaultValue: 'MICRO-QR',
    hint: 'Miniaturized QR layout for tiny footprints',
    validate: (val) => val.length > 0 && val.length <= 35,
    errorMsg: 'Cannot exceed 35 characters'
  },
  'hanxin': {
    name: 'Han Xin Code',
    desc: 'Chinese national standard 2D matrix',
    placeholder: 'e.g. HANXIN-2D-CODE',
    defaultValue: 'HANXIN-2D-CODE',
    hint: '2D matrix optimized for Chinese character sets',
    validate: (val) => val.length > 0 && val.length <= 1000,
    errorMsg: 'Cannot be empty or exceed 1000 characters'
  },
  'codablockf': {
    name: 'Codablock F',
    desc: 'Stacked alphanumeric barcode standard',
    placeholder: 'e.g. CODABLOCK-F-DATA',
    defaultValue: 'CODABLOCK-F-DATA',
    hint: 'Stacked alphanumeric layout',
    validate: (val) => /^[\x00-\x7F]+$/.test(val),
    errorMsg: 'Must contain ASCII characters only'
  },
  'code16k': {
    name: 'Code 16K',
    desc: 'Stacked multi-row layout',
    placeholder: 'e.g. CODE-16K-DATA',
    defaultValue: 'CODE-16K-DATA',
    hint: 'Stacked layout supporting ASCII',
    validate: (val) => /^[\x00-\x7F]+$/.test(val),
    errorMsg: 'Must contain ASCII characters only'
  },
  'code49': {
    name: 'Code 49',
    desc: 'Stacked legacy alphanumeric standard',
    placeholder: 'e.g. CODE-49-DATA',
    defaultValue: 'CODE-49-DATA',
    hint: 'Compact stacked layout up to 81 characters',
    validate: (val) => /^[\x00-\x7F]+$/.test(val) && val.length <= 81,
    errorMsg: 'Must contain ASCII and not exceed 81 characters'
  },
  'channelcode': {
    name: 'Channel Code',
    desc: 'Condensed numeric layout (2-7 channels)',
    placeholder: 'e.g. 123456',
    defaultValue: '123456',
    hint: 'Positive integer up to 7 digits',
    validate: (val) => /^\d+$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 9999999,
    errorMsg: 'Positive integers up to 7 digits only'
  }
};

/**
 * Draw Barcode using bwip-js to HTML5 Canvas
 */
export function renderBarcode(canvas, text, options = {}) {
  if (!canvas) return;

  const {
    bcid = 'code128',
    barColor = '#000000',
    bgColor = '#ffffff',
    barWidth = 2,
    height = 90,
    displayValue = true,
    margin = 16
  } = options;

  const cleanBarColor = barColor && barColor.startsWith('#') ? barColor.replace('#', '') : '000000';
  const cleanBgColor = bgColor && bgColor.startsWith('#') ? bgColor.replace('#', '') : null;

  try {
    // bwip-js internal encoder name mapping (verified against bwipp.js source v4.x)
    const bcidMap = {
      'gs1databar': 'databaromni',
      'gs1128': 'gs1-128',
      'i25': 'interleaved2of5',
      'codabar': 'rationalizedCodabar',
      'aztec': 'azteccode',
      'microqrcode': 'microqrcode',  // already correct key in bwip-js
      'channelcode': 'channelcode',
      'code16k': 'code16k',
      'code49': 'code49',
      'codablockf': 'codablockf',
      'hanxin': 'hanxin',
      'royalmail': 'royalmail',
      'telepen': 'telepen',
      'pharmacode': 'pharmacode',
      'msi': 'msi',
      'maxicode': 'maxicode',
      'qrcode': 'qrcode',
      'upce': 'upce',
      'postnet': 'postnet',
      'planet': 'planet'
    };
    const targetBcid = bcidMap[bcid] || bcid;

    const bwipOptions = {
      bcid: targetBcid,
      text: text || ' ',
      scale: barWidth,
      height: height / 10, // approximate standard conversion
      includetext: displayValue,
      textxalign: 'center',
      barcolor: cleanBarColor,
      paddingwidth: margin,
      paddingheight: margin
    };

    if (cleanBgColor) {
      bwipOptions.backgroundcolor = cleanBgColor;
    }

    bwipjs.toCanvas(canvas, bwipOptions);
  } catch (err) {
    console.error("Barcode drawing error: ", err);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 320;
      canvas.height = 120;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 320, 120);
      ctx.fillStyle = '#D60036';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Invalid Data Format', 160, 50);
      ctx.fillStyle = 'var(--text-secondary, #666)';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Please verify validation rules', 160, 75);
    }
  }
}
