// src/data/qrTemplates/templateStylingConfig.js
// Custom tailored eye styles, dot styles, and brand platform colors for all QR templates

import { DOT_STYLES, EYE_STYLES } from '../../utils/qrEngine';

/**
 * Platform Color and Style Mapping
 * Allowed Eyes: ROUNDED, CIRCLE, FLOWER, TRIANGLE (Pillow)
 * Disallowed Eyes Removed: modern, hexagon, notch, teardrop, star, leaf, shield, diamond, geometric, octagon, spotlight
 * Disallowed Dots Removed: plus
 * Allowed Dots: dots, fluid, hexagon, rounded, octagon, star, denso, sparkle, capsule, etc.
 */
export const TEMPLATE_STYLING_MAP = {
  // ── Social Media Templates ──
  'facebook': {
    qrColor: '#1877F2',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#1877F2',
    eyeOuterColor: '#0d47a1'
  },
  'threads': {
    qrColor: '#2b2b2b',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#2b2b2b',
    eyeOuterColor: '#4a4a4a'
  },
  'x': {
    qrColor: '#24292e',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#24292e',
    eyeOuterColor: '#333333'
  },
  'youtube': {
    qrColor: '#FF0000',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#FF0000',
    eyeOuterColor: '#b31217'
  },
  'tiktok': {
    qrColor: '#25F4EE',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#FE2C55',
    eyeOuterColor: '#25F4EE'
  },
  'linkedin': {
    qrColor: '#0A66C2',
    dotStyle: DOT_STYLES.OCTAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#0A66C2',
    eyeOuterColor: '#004182'
  },
  'reddit': {
    qrColor: '#FF4500',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#FF4500',
    eyeOuterColor: '#ad3b00'
  },
  'discord': {
    qrColor: '#5865F2',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#5865F2',
    eyeOuterColor: '#404EED'
  },
  'spotify': {
    qrColor: '#1DB954',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#1DB954',
    eyeOuterColor: '#145c33'
  },
  'snapchat': {
    qrColor: '#E6DC00',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#1a1a1a',
    eyeOuterColor: '#E6DC00'
  },
  'pinterest': {
    qrColor: '#E60023',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#E60023',
    eyeOuterColor: '#ad081b'
  },
  'github': {
    qrColor: '#24292e',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#24292e',
    eyeOuterColor: '#0d1117'
  },
  'telegram': {
    qrColor: '#229ED9',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#229ED9',
    eyeOuterColor: '#1c5f8a'
  },
  'twitch': {
    qrColor: '#9146FF',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#9146FF',
    eyeOuterColor: '#6441A5'
  },
  'vimeo': {
    qrColor: '#1AB7EA',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#1AB7EA',
    eyeOuterColor: '#007799'
  },
  'medium': {
    qrColor: '#02B875',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#02B875',
    eyeOuterColor: '#0f2f24'
  },
  'wechat': {
    qrColor: '#07C160',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#07C160',
    eyeOuterColor: '#0a5c26'
  },
  'skype': {
    qrColor: '#00AFF0',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#00AFF0',
    eyeOuterColor: '#0078D4'
  },
  'zoom': {
    qrColor: '#2D8CFF',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#2D8CFF',
    eyeOuterColor: '#0b5cad'
  },
  'slack': {
    qrColor: '#4A154B',
    dotStyle: DOT_STYLES.OCTAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#ECB22E',
    eyeOuterColor: '#4A154B'
  },

  // ── Business Templates ──
  'google': {
    qrColor: '#4285F4',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#EA4335',
    eyeOuterColor: '#4285F4'
  },
  'website': {
    qrColor: '#0f766e',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#2dd4bf',
    eyeOuterColor: '#0f766e'
  },
  'yelp': {
    qrColor: '#D32323',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#D32323',
    eyeOuterColor: '#FF6F61'
  },
  'tripadvisor': {
    qrColor: '#34E0A1',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#00AF87',
    eyeOuterColor: '#004F32'
  },
  'trustpilot': {
    qrColor: '#00B67A',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#00B67A',
    eyeOuterColor: '#005138'
  },
  'apple-store': {
    qrColor: '#0071e3',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#0071e3',
    eyeOuterColor: '#003e8a'
  },
  'play-store': {
    qrColor: '#01875f',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.TRIANGLE, // pillow
    eyeColor: '#01875f',
    eyeOuterColor: '#004d36'
  },
  'portfolio': {
    qrColor: '#7c3aed',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.FLOWER,
    eyeColor: '#a78bfa',
    eyeOuterColor: '#7c3aed'
  },

  // ── Communication Templates ──
  'whatsapp': {
    qrColor: '#25D366',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#25D366',
    eyeOuterColor: '#075E54'
  },
  'message': {
    qrColor: '#0b93f6',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#4CD964',
    eyeOuterColor: '#0b93f6'
  },
  'contact': {
    qrColor: '#11998e',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.TRIANGLE, // pillow
    eyeColor: '#38ef7d',
    eyeOuterColor: '#11998e'
  },
  'email': {
    qrColor: '#ea4335',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#ea4335',
    eyeOuterColor: '#b31217'
  },
  'call': {
    qrColor: '#10b981',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#10b981',
    eyeOuterColor: '#065f46'
  },

  // ── Marketing Templates ──
  'coupon': {
    qrColor: '#dc2626',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#f97373',
    eyeOuterColor: '#dc2626'
  },
  'feedback': {
    qrColor: '#d97706',
    dotStyle: DOT_STYLES.OCTAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#fbbf24',
    eyeOuterColor: '#b45309'
  },
  'video': {
    qrColor: '#e11d48',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.TRIANGLE, // pillow
    eyeColor: '#fb7185',
    eyeOuterColor: '#9f1239'
  },
  'menu': {
    qrColor: '#c2410c',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#fb923c',
    eyeOuterColor: '#9a3412'
  },
  'sale': {
    qrColor: '#b91c1c',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#ef4444',
    eyeOuterColor: '#7f1d1d'
  },
  'promo': {
    qrColor: '#4f46e5',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#818cf8',
    eyeOuterColor: '#3730a3'
  },
  'tip': {
    qrColor: '#059669',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#34d399',
    eyeOuterColor: '#065f46'
  },
  'loyalty': {
    qrColor: '#d97706',
    dotStyle: DOT_STYLES.OCTAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#fcd34d',
    eyeOuterColor: '#b45309'
  },

  // ── Utility Templates ──
  'google-drive': {
    qrColor: '#1a73e8',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#34A853',
    eyeOuterColor: '#1a73e8'
  },
  'wifi': {
    qrColor: '#1363DF',
    dotStyle: DOT_STYLES.DOTS,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#47B5FF',
    eyeOuterColor: '#06283D'
  },
  'location': {
    qrColor: '#ea4335',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#f87171',
    eyeOuterColor: '#991b1b'
  },
  'event': {
    qrColor: '#8b5cf6',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.CIRCLE,
    eyeColor: '#c4b5fd',
    eyeOuterColor: '#6d28d9'
  },
  'calendar': {
    qrColor: '#2563eb',
    dotStyle: DOT_STYLES.ROUNDED,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#60a5fa',
    eyeOuterColor: '#1e40af'
  },
  'pdf': {
    qrColor: '#dc2626',
    dotStyle: DOT_STYLES.OCTAGON,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#f87171',
    eyeOuterColor: '#b91c1c'
  },
  'app-download': {
    qrColor: '#0284c7',
    dotStyle: DOT_STYLES.FLUID,
    eyeStyle: EYE_STYLES.ROUNDED,
    eyeColor: '#38bdf8',
    eyeOuterColor: '#0369a1'
  },
  'booking': {
    qrColor: '#d4af37',
    dotStyle: DOT_STYLES.HEXAGON,
    eyeStyle: EYE_STYLES.TRIANGLE, // pillow
    eyeColor: '#d4af37',
    eyeOuterColor: '#1e3a5f'
  },
  'ticket': {
    qrColor: '#7c3aed',
    dotStyle: DOT_STYLES.STAR,
    eyeStyle: EYE_STYLES.FLOWER,
    eyeColor: '#fbbf24',
    eyeOuterColor: '#4c1d95'
  }
};

/**
 * Resolves styling preset for a template
 */
export function getTemplateStylingPreset(template) {
  if (!template) return null;

  // If vCard, keep clean styling
  if (template.styleFamily === 'vcard') {
    return template.preset || {
      qrColor: template.accent || '#FFA36C',
      bgColor: '#FFFFFF',
      dotStyle: DOT_STYLES.ROUNDED,
      eyeStyle: EYE_STYLES.ROUNDED
    };
  }

  const lookupKey = (template.baseId || template.id || '').replace(/^brand-/, '').toLowerCase();
  const custom = TEMPLATE_STYLING_MAP[lookupKey];

  if (custom) {
    return {
      qrColor: custom.qrColor,
      bgColor: '#FFFFFF',
      dotStyle: custom.dotStyle,
      eyeStyle: custom.eyeStyle,
      eyeColor: custom.eyeColor || custom.qrColor,
      eyeOuterColor: custom.eyeOuterColor || custom.qrColor
    };
  }

  // Fallback palette derived from template background or accent
  const fallbackDot = DOT_STYLES.FLUID;
  const fallbackEye = EYE_STYLES.ROUNDED;
  const fallbackColor = template.accent || '#1e293b';

  return {
    qrColor: fallbackColor,
    bgColor: '#FFFFFF',
    dotStyle: fallbackDot,
    eyeStyle: fallbackEye,
    eyeColor: fallbackColor,
    eyeOuterColor: fallbackColor
  };
}
