// src/data/qrTemplates/vcardTemplates.js
// 10 Premium vCard Digital Business Card Templates — 1050×600px landscape
// Source: vcard-templates-2.html (all colors, accents, grain noise, gradients faithfully reproduced)

import { TEMPLATE_ICONS } from './templateIcons';

const VCARD_FIELDS = [
  { id: 'fullName',      label: 'Full Name',      type: 'text',  placeholder: 'Your Name'              },
  { id: 'jobTitle',      label: 'Job Title',       type: 'text',  placeholder: 'Job Title, Company'     },
  { id: 'phone',         label: 'Phone',           type: 'tel',   placeholder: '+60 12-345 6789'        },
  { id: 'email',         label: 'Email',           type: 'email', placeholder: 'you@example.com'        },
  { id: 'address',       label: 'Address',         type: 'text',  placeholder: '123 Business Street, Your City' }
];

const VCARD_PRESET = {
  qrColor: '#000000',
  bgColor: '#FFFFFF',
  dotStyle: 'rounded',
  eyeStyle: 'rounded'
};

export const VCARD_TEMPLATES = [
  // 1 ── Sunset Blaze (dark)
  {
    id: 'vcard-sunset-blaze',
    name: 'Sunset Blaze vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 92% 11%, #FF6B6B 0%, transparent 55%), radial-gradient(circle at 55% 64%, #FFA36C 0%, transparent 77%), radial-gradient(circle at 44% 45%, #6C5CE7 0%, transparent 73%), linear-gradient(135deg, #1a0e1a 0%, #1a0e1a 100%)',
    accent:      '#FFA36C',
    textColor:   '#ffffff',
    subColor:    '#f0d9d0',
    borderColor: 'rgba(255,163,108,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 2 ── Ocean Depth (dark)
  {
    id: 'vcard-ocean-depth',
    name: 'Ocean Depth vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 6% 28%, #00C9A7 0%, transparent 71%), radial-gradient(circle at 88% 36%, #0072FF 0%, transparent 66%), radial-gradient(circle at 94% 70%, #7B2FF7 0%, transparent 74%), linear-gradient(135deg, #04101a 0%, #04101a 100%)',
    accent:      '#39D0C4',
    textColor:   '#ffffff',
    subColor:    '#c7dde6',
    borderColor: 'rgba(0,201,167,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 3 ── Aurora (dark)
  {
    id: 'vcard-aurora',
    name: 'Aurora vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 57% 37%, #43E97B 0%, transparent 72%), radial-gradient(circle at 15% 37%, #38F9D7 0%, transparent 60%), radial-gradient(circle at 89% 61%, #667EEA 0%, transparent 69%), linear-gradient(135deg, #05140f 0%, #05140f 100%)',
    accent:      '#4FF3B0',
    textColor:   '#ffffff',
    subColor:    '#cdece2',
    borderColor: 'rgba(67,233,123,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 4 ── Berry Pop (dark)
  {
    id: 'vcard-berry-pop',
    name: 'Berry Pop vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 83% 69%, #F857A6 0%, transparent 57%), radial-gradient(circle at 46% 44%, #FF5858 0%, transparent 58%), radial-gradient(circle at 18% 89%, #7F00FF 0%, transparent 76%), linear-gradient(135deg, #1a0512 0%, #1a0512 100%)',
    accent:      '#FF7FBE',
    textColor:   '#ffffff',
    subColor:    '#f0d0e1',
    borderColor: 'rgba(248,87,166,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 5 ── Citrus Glow (dark)
  {
    id: 'vcard-citrus-glow',
    name: 'Citrus Glow vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 43% 38%, #FDBB2D 0%, transparent 61%), radial-gradient(circle at 92% 59%, #22C1C3 0%, transparent 58%), radial-gradient(circle at 54% 25%, #F9484A 0%, transparent 72%), linear-gradient(135deg, #1a1005 0%, #1a1005 100%)',
    accent:      '#FDBB2D',
    textColor:   '#ffffff',
    subColor:    '#f0e2c7',
    borderColor: 'rgba(253,187,45,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 6 ── Cosmic Purple (dark)
  {
    id: 'vcard-cosmic-purple',
    name: 'Cosmic Purple vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 35% 90%, #8E2DE2 0%, transparent 65%), radial-gradient(circle at 21% 72%, #4A00E0 0%, transparent 71%), radial-gradient(circle at 18% 88%, #C471ED 0%, transparent 58%), linear-gradient(135deg, #0d0620 0%, #0d0620 100%)',
    accent:      '#C471ED',
    textColor:   '#ffffff',
    subColor:    '#dccbec',
    borderColor: 'rgba(196,113,237,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 7 ── Peach Fuzz (dark)
  {
    id: 'vcard-peach-fuzz',
    name: 'Peach Fuzz vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 33% 20%, #FFB88C 0%, transparent 71%), radial-gradient(circle at 76% 86%, #DE6262 0%, transparent 58%), radial-gradient(circle at 41% 21%, #FF9A9E 0%, transparent 68%), linear-gradient(135deg, #1a0f0a 0%, #1a0f0a 100%)',
    accent:      '#FFB88C',
    textColor:   '#ffffff',
    subColor:    '#f0d9cc',
    borderColor: 'rgba(255,184,140,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 8 ── Emerald Dream (dark)
  {
    id: 'vcard-emerald-dream',
    name: 'Emerald Dream vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 47% 81%, #11998E 0%, transparent 65%), radial-gradient(circle at 64% 71%, #38EF7D 0%, transparent 79%), radial-gradient(circle at 46% 32%, #0F9B8E 0%, transparent 62%), linear-gradient(135deg, #051a14 0%, #051a14 100%)',
    accent:      '#38EF7D',
    textColor:   '#ffffff',
    subColor:    '#c9e8dc',
    borderColor: 'rgba(56,239,125,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 9 ── Midnight Neon (dark)
  {
    id: 'vcard-midnight-neon',
    name: 'Midnight Neon vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 88% 55%, #00F5FF 0%, transparent 78%), radial-gradient(circle at 10% 67%, #FF00E4 0%, transparent 66%), radial-gradient(circle at 16% 23%, #6A00F4 0%, transparent 66%), linear-gradient(135deg, #05020f 0%, #05020f 100%)',
    accent:      '#00F5FF',
    textColor:   '#ffffff',
    subColor:    '#cfd0f0',
    borderColor: 'rgba(0,245,255,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 10 ── Rose Quartz (light) — vcard-light variant from source HTML
  {
    id: 'vcard-rose-quartz',
    name: 'Rose Quartz vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: false,   // light theme
    background: 'radial-gradient(circle at 78% 66%, #F6D5F7 0%, transparent 61%), radial-gradient(circle at 42% 9%, #FBE9D7 0%, transparent 60%), radial-gradient(circle at 57% 94%, #F5B9C4 0%, transparent 65%), linear-gradient(135deg, #f7ecec 0%, #f7ecec 100%)',
    accent:      '#B5657B',
    textColor:   '#2a1a1e',
    subColor:    '#6b5158',
    borderColor: 'rgba(181,101,123,0.25)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: { ...VCARD_PRESET, qrColor: '#2a1a1e' }
  }
];
