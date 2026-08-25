// src/data/qrTemplates/vcardTemplates.js
// 30 Premium vCard Digital Business Card Templates — 1050×600px landscape
// Source: vcard-templates-5.html (faithful reproduction of all 30 templates: gradients, accents, text & border colors)

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

  // 10 ── Rose Quartz (light)
  {
    id: 'vcard-rose-quartz',
    name: 'Rose Quartz vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: false,
    background: 'radial-gradient(circle at 78% 66%, #F6D5F7 0%, transparent 61%), radial-gradient(circle at 42% 9%, #FBE9D7 0%, transparent 60%), radial-gradient(circle at 57% 94%, #F5B9C4 0%, transparent 65%), linear-gradient(135deg, #f7ecec 0%, #f7ecec 100%)',
    accent:      '#B5657B',
    textColor:   '#2a1a1e',
    subColor:    '#6b5158',
    borderColor: 'rgba(181,101,123,0.25)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: { ...VCARD_PRESET, qrColor: '#2a1a1e' }
  },

  // 11 ── Lavender Dusk (dark)
  {
    id: 'vcard-lavender-dusk',
    name: 'Lavender Dusk vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 20% 36%, #B39DDB 0%, transparent 74%), radial-gradient(circle at 30% 14%, #7E57C2 0%, transparent 72%), radial-gradient(circle at 71% 18%, #4A148C 0%, transparent 62%), linear-gradient(135deg, #0d0817 0%, #0d0817 100%)',
    accent:      '#B39DDB',
    textColor:   '#ffffff',
    subColor:    '#d8cdea',
    borderColor: 'rgba(179,157,219,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 12 ── Coral Reef (dark)
  {
    id: 'vcard-coral-reef',
    name: 'Coral Reef vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 53% 94%, #FF9A76 0%, transparent 78%), radial-gradient(circle at 14% 59%, #FF6F91 0%, transparent 77%), radial-gradient(circle at 44% 44%, #845EC2 0%, transparent 63%), linear-gradient(135deg, #1a0c12 0%, #1a0c12 100%)',
    accent:      '#FF6F91',
    textColor:   '#ffffff',
    subColor:    '#f0d4dc',
    borderColor: 'rgba(255,111,145,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 13 ── Golden Hour (dark)
  {
    id: 'vcard-golden-hour',
    name: 'Golden Hour vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 36% 64%, #FFD194 0%, transparent 67%), radial-gradient(circle at 85% 57%, #FF8C42 0%, transparent 76%), radial-gradient(circle at 43% 53%, #D83367 0%, transparent 79%), linear-gradient(135deg, #1a1006 0%, #1a1006 100%)',
    accent:      '#FFD194',
    textColor:   '#ffffff',
    subColor:    '#f0dcc2',
    borderColor: 'rgba(255,209,148,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 14 ── Arctic Frost (light)
  {
    id: 'vcard-arctic-frost',
    name: 'Arctic Frost vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: false,
    background: 'radial-gradient(circle at 74% 36%, #A0E7E5 0%, transparent 58%), radial-gradient(circle at 54% 24%, #B4F8C8 0%, transparent 78%), radial-gradient(circle at 70% 43%, #FBE7C6 0%, transparent 57%), linear-gradient(135deg, #eef7f6 0%, #eef7f6 100%)',
    accent:      '#3E9A96',
    textColor:   '#132b29',
    subColor:    '#4d6663',
    borderColor: 'rgba(62,154,150,0.25)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: { ...VCARD_PRESET, qrColor: '#132b29' }
  },

  // 15 ── Volcanic Ash (dark)
  {
    id: 'vcard-volcanic-ash',
    name: 'Volcanic Ash vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 9% 62%, #FF3D00 0%, transparent 56%), radial-gradient(circle at 87% 74%, #FF6D00 0%, transparent 56%), radial-gradient(circle at 5% 68%, #37474F 0%, transparent 58%), linear-gradient(135deg, #150705 0%, #150705 100%)',
    accent:      '#FF6D00',
    textColor:   '#ffffff',
    subColor:    '#e8c9c0',
    borderColor: 'rgba(255,109,0,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 16 ── Deep Space (dark)
  {
    id: 'vcard-deep-space',
    name: 'Deep Space vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 63% 16%, #1B2735 0%, transparent 80%), radial-gradient(circle at 10% 36%, #090A0F 0%, transparent 60%), radial-gradient(circle at 88% 73%, #7F5AF0 0%, transparent 66%), linear-gradient(135deg, #05050a 0%, #05050a 100%)',
    accent:      '#7F5AF0',
    textColor:   '#ffffff',
    subColor:    '#c5c0e8',
    borderColor: 'rgba(127,90,240,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 17 ── Tropical Punch (dark)
  {
    id: 'vcard-tropical-punch',
    name: 'Tropical Punch vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 44% 78%, #FF61D2 0%, transparent 78%), radial-gradient(circle at 40% 49%, #FE9090 0%, transparent 58%), radial-gradient(circle at 90% 70%, #FFD452 0%, transparent 66%), linear-gradient(135deg, #1a0a10 0%, #1a0a10 100%)',
    accent:      '#FF61D2',
    textColor:   '#ffffff',
    subColor:    '#f0d4e0',
    borderColor: 'rgba(255,97,210,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 18 ── Electric Lime (dark)
  {
    id: 'vcard-electric-lime',
    name: 'Electric Lime vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 19% 45%, #C6FF00 0%, transparent 60%), radial-gradient(circle at 77% 28%, #76FF03 0%, transparent 56%), radial-gradient(circle at 29% 44%, #00E5FF 0%, transparent 75%), linear-gradient(135deg, #060f02 0%, #060f02 100%)',
    accent:      '#C6FF00',
    textColor:   '#ffffff',
    subColor:    '#dcf0c2',
    borderColor: 'rgba(198,255,0,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 19 ── Mocha Mousse (dark)
  {
    id: 'vcard-mocha-mousse',
    name: 'Mocha Mousse vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 80% 46%, #A47551 0%, transparent 72%), radial-gradient(circle at 20% 46%, #6F4E37 0%, transparent 57%), radial-gradient(circle at 38% 82%, #D9B08C 0%, transparent 68%), linear-gradient(135deg, #140d08 0%, #140d08 100%)',
    accent:      '#D9B08C',
    textColor:   '#ffffff',
    subColor:    '#e0d0c0',
    borderColor: 'rgba(217,176,140,0.3)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 20 ── Cherry Blossom (light)
  {
    id: 'vcard-cherry-blossom',
    name: 'Cherry Blossom vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: false,
    background: 'radial-gradient(circle at 19% 21%, #FFC1CC 0%, transparent 73%), radial-gradient(circle at 26% 23%, #FFAFCC 0%, transparent 64%), radial-gradient(circle at 68% 26%, #FFD6E8 0%, transparent 60%), linear-gradient(135deg, #fdf3f6 0%, #fdf3f6 100%)',
    accent:      '#C6607A',
    textColor:   '#2b1a20',
    subColor:    '#6b4f57',
    borderColor: 'rgba(198,96,122,0.25)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: { ...VCARD_PRESET, qrColor: '#2b1a20' }
  },

  // 21 ── Steel Blue Chrome (dark)
  {
    id: 'vcard-steel-blue-chrome',
    name: 'Steel Blue Chrome vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 78% 62%, #4FACFE 0%, transparent 77%), radial-gradient(circle at 15% 85%, #00F2FE 0%, transparent 57%), radial-gradient(circle at 20% 55%, #667EEA 0%, transparent 80%), linear-gradient(135deg, #030a14 0%, #030a14 100%)',
    accent:      '#4FACFE',
    textColor:   '#ffffff',
    subColor:    '#c5daf0',
    borderColor: 'rgba(79,172,254,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 22 ── Amber Glow (dark)
  {
    id: 'vcard-amber-glow',
    name: 'Amber Glow vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 40% 61%, #F7971E 0%, transparent 56%), radial-gradient(circle at 17% 67%, #FFD200 0%, transparent 71%), radial-gradient(circle at 88% 9%, #F44336 0%, transparent 66%), linear-gradient(135deg, #170f02 0%, #170f02 100%)',
    accent:      '#FFD200',
    textColor:   '#ffffff',
    subColor:    '#f0e0b8',
    borderColor: 'rgba(255,210,0,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 23 ── Neo Mint (dark)
  {
    id: 'vcard-neo-mint',
    name: 'Neo Mint vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 48% 40%, #00FFA3 0%, transparent 74%), radial-gradient(circle at 90% 55%, #DC1FFF 0%, transparent 68%), radial-gradient(circle at 45% 49%, #03E1FF 0%, transparent 65%), linear-gradient(135deg, #030c0a 0%, #030c0a 100%)',
    accent:      '#00FFA3',
    textColor:   '#ffffff',
    subColor:    '#c2f0e2',
    borderColor: 'rgba(0,255,163,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 24 ── Wine Rose (dark)
  {
    id: 'vcard-wine-rose',
    name: 'Wine Rose vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 22% 25%, #722F37 0%, transparent 75%), radial-gradient(circle at 9% 68%, #C08497 0%, transparent 60%), radial-gradient(circle at 68% 44%, #F4C2C2 0%, transparent 60%), linear-gradient(135deg, #140508 0%, #140508 100%)',
    accent:      '#F4C2C2',
    textColor:   '#ffffff',
    subColor:    '#e8cdd0',
    borderColor: 'rgba(244,194,194,0.3)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 25 ── Solar Flare (dark)
  {
    id: 'vcard-solar-flare',
    name: 'Solar Flare vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 51% 55%, #F09819 0%, transparent 57%), radial-gradient(circle at 7% 20%, #EDDE5D 0%, transparent 79%), radial-gradient(circle at 34% 80%, #FF512F 0%, transparent 78%), linear-gradient(135deg, #1a1103 0%, #1a1103 100%)',
    accent:      '#F09819',
    textColor:   '#ffffff',
    subColor:    '#f0e0b0',
    borderColor: 'rgba(240,152,25,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 26 ── Blueberry Fizz (dark)
  {
    id: 'vcard-blueberry-fizz',
    name: 'Blueberry Fizz vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 52% 67%, #396AFC 0%, transparent 64%), radial-gradient(circle at 59% 49%, #2948FF 0%, transparent 68%), radial-gradient(circle at 21% 40%, #A044FF 0%, transparent 62%), linear-gradient(135deg, #05061a 0%, #05061a 100%)',
    accent:      '#7A8CFF',
    textColor:   '#ffffff',
    subColor:    '#c9cdf0',
    borderColor: 'rgba(122,140,255,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 27 ── Mint Chocolate (dark)
  {
    id: 'vcard-mint-chocolate',
    name: 'Mint Chocolate vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 11% 46%, #134E5E 0%, transparent 65%), radial-gradient(circle at 65% 79%, #71B280 0%, transparent 68%), radial-gradient(circle at 79% 60%, #2C3E50 0%, transparent 69%), linear-gradient(135deg, #051210 0%, #051210 100%)',
    accent:      '#71B280',
    textColor:   '#ffffff',
    subColor:    '#c8e0d0',
    borderColor: 'rgba(113,178,128,0.3)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 28 ── Fuchsia Dream (dark)
  {
    id: 'vcard-fuchsia-dream',
    name: 'Fuchsia Dream vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 27% 74%, #C33764 0%, transparent 56%), radial-gradient(circle at 61% 27%, #1D2671 0%, transparent 65%), radial-gradient(circle at 36% 26%, #FF00CC 0%, transparent 71%), linear-gradient(135deg, #14031a 0%, #14031a 100%)',
    accent:      '#FF00CC',
    textColor:   '#ffffff',
    subColor:    '#eec2e6',
    borderColor: 'rgba(255,0,204,0.35)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 29 ── Desert Sand (dark)
  {
    id: 'vcard-desert-sand',
    name: 'Desert Sand vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: true,
    background: 'radial-gradient(circle at 63% 25%, #EDC9AF 0%, transparent 63%), radial-gradient(circle at 72% 81%, #C19A6B 0%, transparent 61%), radial-gradient(circle at 41% 25%, #8B5E3C 0%, transparent 63%), linear-gradient(135deg, #1a1208 0%, #1a1208 100%)',
    accent:      '#EDC9AF',
    textColor:   '#ffffff',
    subColor:    '#e5d5be',
    borderColor: 'rgba(237,201,175,0.3)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: VCARD_PRESET
  },

  // 30 ── Frost Pastel (light)
  {
    id: 'vcard-frost-pastel',
    name: 'Frost Pastel vCard',
    category: 'vCard',
    styleFamily: 'vcard',
    canvasWidth: 1050,
    canvasHeight: 600,
    headline: 'CONTACT ME',
    subtitle: 'SCAN TO SAVE VCARD',
    isDark: false,
    background: 'radial-gradient(circle at 69% 95%, #D4FAFA 0%, transparent 56%), radial-gradient(circle at 21% 92%, #FAD4E8 0%, transparent 59%), radial-gradient(circle at 87% 58%, #E8D4FA 0%, transparent 67%), linear-gradient(135deg, #f7f3fb 0%, #f7f3fb 100%)',
    accent:      '#8B6DA8',
    textColor:   '#251d2c',
    subColor:    '#5c5164',
    borderColor: 'rgba(139,109,168,0.22)',
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: VCARD_FIELDS,
    preset: { ...VCARD_PRESET, qrColor: '#251d2c' }
  }
];
