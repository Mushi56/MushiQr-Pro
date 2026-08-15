// src/services/FeatureAccessManager.js
// ─── Phase 2 Centralized Feature Registry & Feature Access Manager ──────────
// Authoritative single-client access decision layer. Evaluates canonical
// Feature Registry, global feature flags, subscription plan assignments,
// and real-time Firebase Firestore updates.

import { auth, db } from './firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { doc, onSnapshot, collection } from 'firebase/firestore';

// ═══════════════════════════════════════════════════════════════════════════
// 1. CANONICAL FEATURE REGISTRY (78 Granular User-Facing Capabilities)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// 1. CANONICAL FEATURE REGISTRY (8 Pure Core Categories)
// ═══════════════════════════════════════════════════════════════════════════

export const FEATURE_CATEGORIES = {
  QR_GENERATOR:      { id: 'QR_GENERATOR',      name: 'QR Code Generator',   icon: 'QrCode',    color: '#D60036', desc: 'QR formats, engine, styling, logos & templates' },
  BARCODE_GENERATOR: { id: 'BARCODE_GENERATOR', name: 'Barcode Generator',   icon: 'Barcode',   color: '#3B82F6', desc: '1D & 2D barcode standards, engine & styling' },
  BULK_GENERATOR:    { id: 'BULK_GENERATOR',    name: 'Bulk Generation',     icon: 'Layers',    color: '#8B5CF6', desc: 'Batch generator, spreadsheet grid & ZIP export' },
  SCANNER:           { id: 'SCANNER',           name: 'Scanner',             icon: 'Scan',      color: '#10B981', desc: 'Live camera lens, image scan & auto-detection' },
  HOME:              { id: 'HOME',              name: 'Home Screen',         icon: 'Home',      color: '#F59E0B', desc: 'Dashboard views, recent grid & launch shortcuts' },
  SAVED:             { id: 'SAVED',             name: 'Saved',               icon: 'Bookmark',  color: '#EC4899', desc: 'Bookmarked collection, tags & saved filters' },
  HISTORY:           { id: 'HISTORY',           name: 'History',             icon: 'History',   color: '#06B6D4', desc: 'Generation history, scan logs & log management' },
  SETTINGS:          { id: 'SETTINGS',          name: 'Settings',            icon: 'Settings',  color: '#64748B', desc: 'App preferences, themes, storage & account' },
};

// ─── SUBCATEGORY DEFINITIONS ─────────────────────────────────────────────
export const CATEGORY_SUBCATEGORIES = {
  QR_GENERATOR:      ['Content', 'Color', 'Style', 'Logo', 'Template', 'Text', 'Save & Export', 'QR Engine'],
  BARCODE_GENERATOR: ['1D Standards', '2D Standards', 'Barcode Appearance', 'Export'],
  BULK_GENERATOR:    ['Batch Screen', 'Input & Spreadsheet', 'Batch Styling', 'Bulk Export'],
  SCANNER:           ['Camera Lens', 'Detection', 'Scan Results'],
  HOME:              ['Dashboard', 'Quick Actions'],
  SAVED:             ['Collection', 'Save / Remove', 'Search & Filter'],
  HISTORY:           ['History View', 'Automatic History', 'History Management'],
  SETTINGS:          ['General & Theme', 'Storage', 'Cloud & Sync', 'Account & Security'],
};

export const FEATURE_REGISTRY = [
  // ── 1. QR CODE GENERATOR ──
  // ── 1.0 Subcategory Navigation Tabs (Bottom Navbar Modules) ──
  { featureId: 'qr_tab_content',   displayName: 'Content Tab & Editor',     category: 'QR_GENERATOR', subcategory: 'Content', description: 'Enable Content tab in bottom navigation', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_tab_color',     displayName: 'Color Tab & Styling',      category: 'QR_GENERATOR', subcategory: 'Color',   description: 'Enable Color tab in bottom navigation',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_tab_style',     displayName: 'Style / Shapes Tab',       category: 'QR_GENERATOR', subcategory: 'Style',   description: 'Enable Style tab in bottom navigation',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_tab_logo',      displayName: 'Logo Tab & Branding',      category: 'QR_GENERATOR', subcategory: 'Logo',    description: 'Enable Logo tab in bottom navigation',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_tab_template',  displayName: 'Template Tab & Gallery',   category: 'QR_GENERATOR', subcategory: 'Template',description: 'Enable Template tab in bottom navigation',defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_tab_text',      displayName: 'Text Tab & Typography',    category: 'QR_GENERATOR', subcategory: 'Text',    description: 'Enable Text tab in bottom navigation',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 1.1 Content Tab (Content Types & Formats) ──
  { featureId: 'qr_text',      displayName: 'Plain Text QR',            category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate plain text QR code',        defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_url',       displayName: 'Website URL QR',           category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate website URL QR code',       defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_wifi',      displayName: 'Wi-Fi Network QR',         category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate Wi-Fi credentials QR',      defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_email',     displayName: 'Email Message QR',         category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate mailto QR code',            defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_phone',     displayName: 'Phone Call QR',            category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate tel QR code',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_sms',       displayName: 'SMS Text Message QR',      category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate smsto QR code',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_vcard',     displayName: 'vCard Contact QR',         category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate contact card QR',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_location',  displayName: 'Map Location QR',          category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate geo location QR',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_pdf',       displayName: 'PDF Document Link QR',     category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate PDF file QR',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_image',     displayName: 'Image Gallery Link QR',    category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate image link QR',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_audio',     displayName: 'Audio File Link QR',       category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate audio link QR',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_document',  displayName: 'Document Link QR',         category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate document file QR',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_event',     displayName: 'Calendar Event QR',        category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate iCal event QR',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_crypto',    displayName: 'Crypto Wallet QR',         category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate cryptocurrency QR',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_whatsapp',  displayName: 'WhatsApp Direct Chat QR',  category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate WhatsApp QR',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_youtube',   displayName: 'YouTube Video QR',         category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate YouTube link QR',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_instagram', displayName: 'Instagram Profile QR',     category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate Instagram link QR',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_facebook',  displayName: 'Facebook Page QR',         category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate Facebook link QR',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_x',         displayName: 'X (Twitter) Profile QR',   category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate X profile QR',              defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_linkedin',  displayName: 'LinkedIn Profile QR',      category: 'QR_GENERATOR', subcategory: 'Content', description: 'Generate LinkedIn QR',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 1.2 Color Tab (Presets, Dots, Eyes, BG & Gradients) ──
  { featureId: 'custom_colors_solid',   displayName: 'Solid Color Pickers (RGB/HSB)', category: 'QR_GENERATOR', subcategory: 'Color', description: 'Advanced RGB/HSB solid color pickers', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'custom_colors_gradient',displayName: 'Dual Gradient Color Fills',      category: 'QR_GENERATOR', subcategory: 'Color', description: 'Linear & radial gradient QR color fills', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_color_presets',      displayName: 'Color Theme Presets Gallery',   category: 'QR_GENERATOR', subcategory: 'Color', description: 'Pre-designed multi-color theme presets',  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_color_eyes_custom',  displayName: 'Custom Eye Finder Colors',       category: 'QR_GENERATOR', subcategory: 'Color', description: 'Independent color tuning for finder eyes',defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_bg_image_texture',   displayName: 'Background Image & Texture',    category: 'QR_GENERATOR', subcategory: 'Color', description: 'Custom canvas background texture patterns', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },

  // ── 1.3 Style Tab (Dots, Eye Shapes, Background Cards & Sizing) ──
  { featureId: 'custom_dot_styles',     displayName: 'Custom Dot Module Shapes (20+)', category: 'QR_GENERATOR', subcategory: 'Style', description: '20+ dot shapes (dots, leaf, diamond, etc)', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_eye_styles',     displayName: 'Custom Eye Finder Shapes (20+)', category: 'QR_GENERATOR', subcategory: 'Style', description: '20+ corner eye frame & ball styles',       defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_background_shapes',  displayName: 'Background Shape Cards & Shields',category: 'QR_GENERATOR', subcategory: 'Style', description: 'Square, rounded, star & shield card backing',defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_frames',         displayName: 'Outer Frames & Badges',           category: 'QR_GENERATOR', subcategory: 'Style', description: 'Decorative scan-me frames & stamp badges', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_canvas_positioning', displayName: 'Canvas Positioning & Offsets',    category: 'QR_GENERATOR', subcategory: 'Style', description: 'Fine-grain X/Y matrix repositioning',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 1.4 Logo Tab (Presets, Upload, Transforms & Background) ──
  { featureId: 'custom_logo_presets',   displayName: 'Brand Logo Presets Gallery', category: 'QR_GENERATOR', subcategory: 'Logo', description: 'Select pre-installed social & fintech logos',defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'custom_logo_upload',    displayName: 'Custom Brand Logo Upload',   category: 'QR_GENERATOR', subcategory: 'Logo', description: 'Upload personal image/photo inside QR',      defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_logo_transforms',    displayName: 'Logo Rotate, Size & Opacity',category: 'QR_GENERATOR', subcategory: 'Logo', description: 'Rotate, scale, opacity & shadow tools',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_logo_bg_remover',    displayName: 'Logo Background Remover & Crop',category: 'QR_GENERATOR', subcategory: 'Logo', description: 'Remove logo background & crop tools',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_logo_stroke_shadow', displayName: 'Logo Stroke & Drop Shadow',  category: 'QR_GENERATOR', subcategory: 'Logo', description: 'Outline border & drop shadow effects',      defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 1.5 Template Tab (Galleries, Premium & Cloud Library) ──
  { featureId: 'templates_browse',        displayName: 'Browse Templates Gallery',   category: 'QR_GENERATOR', subcategory: 'Template', description: 'Explore pre-designed QR template styles',  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'templates_free_apply',    displayName: 'Apply Standard Templates',   category: 'QR_GENERATOR', subcategory: 'Template', description: 'Use free standard pre-designed templates',defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'templates_premium_apply', displayName: 'Apply Premium Pro Templates',category: 'QR_GENERATOR', subcategory: 'Template', description: 'Use high-conversion premium templates',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'templates_save_custom',   displayName: 'Save Custom User Template', category: 'QR_GENERATOR', subcategory: 'Template', description: 'Save active design as template',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'templates_cloud_library', displayName: 'Cloud Template Library',    category: 'QR_GENERATOR', subcategory: 'Template', description: 'Access community cloud template library', defaultEnabled: true, requiresAuthentication: true,  allowSuperAdminOverride: true, defaultPlan: 'weekly' },

  // ── 1.6 Text Tab (Center Text, Fonts, Styling & Rotation) ──
  { featureId: 'qr_center_text',    displayName: 'Add Text & Center Text Embed',  category: 'QR_GENERATOR', subcategory: 'Text', description: 'Embed text inside QR center or badge',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_text_fonts',     displayName: 'Custom Google Fonts Typography', category: 'QR_GENERATOR', subcategory: 'Text', description: 'Outfit, Inter, Roboto & bespoke font library',defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_text_styling',   displayName: 'Text Stroke, Color & Shadow',   category: 'QR_GENERATOR', subcategory: 'Text', description: 'Text outline, color & shadow styling',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_text_transforms',displayName: 'Text Rotate & Position Controls',category: 'QR_GENERATOR', subcategory: 'Text', description: 'Angle rotation & precise positioning',       defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 1.7 Save & Export (File Downloads, Vectors & Sharing) ──
  { featureId: 'export_png',         displayName: 'PNG Image Export',       category: 'QR_GENERATOR', subcategory: 'Save & Export', description: 'Download high-res PNG image',            defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'export_jpg',         displayName: 'JPG Image Export',       category: 'QR_GENERATOR', subcategory: 'Save & Export', description: 'Download compressed JPG image',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'export_svg',         displayName: 'SVG Vector Export',      category: 'QR_GENERATOR', subcategory: 'Save & Export', description: 'Download scalable SVG vector file',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'export_pdf',         displayName: 'PDF Document Export',    category: 'QR_GENERATOR', subcategory: 'Save & Export', description: 'Download print-ready A4 PDF',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'export_native_share',displayName: 'Native OS Share Sheet',  category: 'QR_GENERATOR', subcategory: 'Save & Export', description: 'Share file directly to social apps',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 1.8 QR Engine (Matrix Generator, Error Levels & Quiet Zone) ──
  { featureId: 'qr_matrix_engine',    displayName: 'Core QR Matrix Generator', category: 'QR_GENERATOR', subcategory: 'QR Engine', description: 'Standard QR matrix generation core',       defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_error_correction', displayName: 'Error Correction Levels',  category: 'QR_GENERATOR', subcategory: 'QR Engine', description: 'Adjust L/M/Q/H error tolerance levels',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_quiet_zone',       displayName: 'Quiet Zone Margin Slider', category: 'QR_GENERATOR', subcategory: 'QR Engine', description: 'Adjust margin padding around QR code',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_size_custom',      displayName: 'Custom Resolution Slider', category: 'QR_GENERATOR', subcategory: 'QR Engine', description: 'Render high-density custom resolutions',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 2. BARCODE GENERATOR ──
  { featureId: 'barcode_code128',    displayName: 'Code 128 Standard',         category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Standard logistics 1D barcode',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_code39',     displayName: 'Code 39 Industrial',         category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Industrial legacy 1D barcode',              defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_ean13',      displayName: 'EAN-13 Retail',              category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Global retail 13-digit standard',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_ean8',       displayName: 'EAN-8 Compact',              category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Condensed retail 8-digit standard',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_upca',       displayName: 'UPC-A Retail (US)',           category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'US retail 12-digit standard',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_upce',       displayName: 'UPC-E Condensed',             category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'US condensed retail format',                defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_itf14',      displayName: 'ITF-14 Shipping Carton',      category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: '14-digit shipping carton barcode',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_i25',        displayName: 'Interleaved 2 of 5',          category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Numeric industrial format',                 defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_codabar',    displayName: 'Codabar Library/Health',      category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Library & blood bank tracking',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_code93',     displayName: 'Code 93 Compact',             category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Compact alphanumeric 1D',                   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_code11',     displayName: 'Code 11 Telecom',             category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Telecommunications standard',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_msi',        displayName: 'MSI Plessey',                 category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Retail shelf marking standard',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_gs1128',     displayName: 'GS1-128 Logistics',           category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'GS1 logistics carrier identifier',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_postnet',    displayName: 'Postnet USPS Zip',            category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'US Postal Service zip code',                defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_planet',     displayName: 'Planet USPS Mail',            category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'US Postal Service mail tracking',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_royalmail',  displayName: 'Royal Mail Code',             category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'UK Postal routing code',                    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_telepen',    displayName: 'Telepen Full-ASCII',           category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Full ASCII industrial format',              defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_pharmacode', displayName: 'Pharmacode Packaging',         category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Pharmaceutical packaging code',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_channelcode',displayName: 'Channel Code',                 category: 'BARCODE_GENERATOR', subcategory: '1D Standards', description: 'Condensed numeric 2-7 channel',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_datamatrix', displayName: 'Data Matrix 2D',              category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'High-density industrial 2D',                defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_pdf417',     displayName: 'PDF417 2D Stacked',            category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'High-capacity 2D stacked format',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_aztec',      displayName: 'Aztec Code 2D',               category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Transit & ticketing 2D code',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_gs1databar', displayName: 'GS1 DataBar Omni',            category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Omnidirectional retail GTIN',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_maxicode',   displayName: 'MaxiCode UPS Parcel',          category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'UPS 2D parcel tracking matrix',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_qrcode',     displayName: 'Barcode Engine QR 2D',         category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Standard 2D QR via barcode engine',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_microqrcode',displayName: 'Micro QR Compact',             category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Compact miniaturized 2D QR',                defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_hanxin',     displayName: 'Han Xin Code 2D',             category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Chinese national standard 2D',              defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_codablockf', displayName: 'Codablock F Stacked',          category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Stacked alphanumeric barcode',              defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_code16k',    displayName: 'Code 16K Stacked',             category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Multi-row stacked layout',                  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_code49',     displayName: 'Code 49 Stacked',              category: 'BARCODE_GENERATOR', subcategory: '2D Standards', description: 'Compact stacked 81-char code',              defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_custom_colors',      displayName: 'Barcode Custom Colors',      category: 'BARCODE_GENERATOR', subcategory: 'Barcode Appearance', description: 'Custom bar and background colors',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_dimension_controls', displayName: 'Barcode Height & Width',     category: 'BARCODE_GENERATOR', subcategory: 'Barcode Appearance', description: 'Adjust bar width multiplier & height',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_text_display',       displayName: 'Toggle Text Under Barcode',  category: 'BARCODE_GENERATOR', subcategory: 'Barcode Appearance', description: 'Show/hide human readable text',             defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 3. BULK GENERATION ──
  { featureId: 'batch_view',         displayName: 'Bulk Generator Screen',  category: 'BULK_GENERATOR', subcategory: 'Batch Screen',         description: 'Access bulk generation tool',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_csv_import',   displayName: 'CSV / Excel Data Import',category: 'BULK_GENERATOR', subcategory: 'Input & Spreadsheet', description: 'Upload CSV or Excel file for bulk codes',defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_manual_input', displayName: 'Quick Sheet Grid Editor',category: 'BULK_GENERATOR', subcategory: 'Input & Spreadsheet', description: 'Interactive spreadsheet data editor',  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_custom_style', displayName: 'Apply Style to Batch',   category: 'BULK_GENERATOR', subcategory: 'Batch Styling',       description: 'Apply active design to all codes',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_zip_export',   displayName: 'Download ZIP Archive',   category: 'BULK_GENERATOR', subcategory: 'Bulk Export',          description: 'Export all codes as compressed ZIP',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },

  // ── 4. SCANNER ──
  { featureId: 'scanner_camera_live',    displayName: 'Live Lens Camera Scanning',   category: 'SCANNER', subcategory: 'Camera Lens',  description: 'Real-time camera lens barcode scan',  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_image_upload',   displayName: 'Gallery Image Scanning',      category: 'SCANNER', subcategory: 'Camera Lens',  description: 'Scan QR/barcode from local photo',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_flashlight',     displayName: 'Flashlight Torch Toggle',     category: 'SCANNER', subcategory: 'Detection',    description: 'Camera flashlight activation',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_zoom',           displayName: 'Camera Pinch-Zoom',           category: 'SCANNER', subcategory: 'Detection',    description: 'Adjust camera optical/digital zoom',  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_barcode_detect', displayName: '1D & 2D Format Auto-Detect',  category: 'SCANNER', subcategory: 'Detection',    description: 'Automatic detection of 14 formats',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_result_actions', displayName: 'Result Actions & Copy',       category: 'SCANNER', subcategory: 'Scan Results', description: 'Copy text, open URL from scan',        defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 5. HOME SCREEN ──
  { featureId: 'home_view',             displayName: 'Home Dashboard View',       category: 'HOME', subcategory: 'Dashboard',     description: 'Access main Home screen',                    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'free' },
  { featureId: 'home_recent_items',     displayName: 'Recent Activity Grid',      category: 'HOME', subcategory: 'Dashboard',     description: 'Display recent items on Home',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'free' },
  { featureId: 'home_quick_qr',         displayName: 'Quick QR Shortcuts',        category: 'HOME', subcategory: 'Quick Actions', description: 'Quick QR creation cards',                    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'free' },
  { featureId: 'home_quick_barcode',    displayName: 'Quick Barcode Shortcuts',   category: 'HOME', subcategory: 'Quick Actions', description: 'Quick barcode creation cards',               defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'free' },
  { featureId: 'home_scanner_shortcut', displayName: 'Quick Scanner Launch Card', category: 'HOME', subcategory: 'Quick Actions', description: 'Scanner launcher card',                     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'free' },
  { featureId: 'home_batch_shortcut',   displayName: 'Batch Generator Launch Card',category:'HOME', subcategory: 'Quick Actions', description: 'Batch generator card',                      defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'weekly' },

  // ── 6. SAVED ──
  { featureId: 'saved_view',          displayName: 'Saved Collection Screen', category: 'SAVED', subcategory: 'Collection',     description: 'Access bookmarked QR collection',    defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved_save_action',   displayName: 'Bookmark / Save Action',  category: 'SAVED', subcategory: 'Save / Remove',  description: 'Bookmark QR code to saved list',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved_delete_action', displayName: 'Remove Bookmarked Item',  category: 'SAVED', subcategory: 'Save / Remove',  description: 'Delete item from saved list',        defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved_search_filter', displayName: 'Search & Filter Saved',   category: 'SAVED', subcategory: 'Search & Filter',description: 'Search query filter in saved list',  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 7. HISTORY ──
  { featureId: 'history_view',       displayName: 'Creation History Screen', category: 'HISTORY', subcategory: 'History View',       description: 'View generation & scan logs',          defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history_save_auto',  displayName: 'Auto-Save Generation Log',category: 'HISTORY', subcategory: 'Automatic History',  description: 'Auto-log created items to history',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history_delete_item',displayName: 'Delete History Log Item', category: 'HISTORY', subcategory: 'History Management', description: 'Delete single entry from history',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history_clear_all',  displayName: 'Clear History Range',     category: 'HISTORY', subcategory: 'History Management', description: 'Clear history log by time window',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 8. SETTINGS ──
  { featureId: 'settings_view',         displayName: 'View Settings Page',       category: 'SETTINGS', subcategory: 'General & Theme',    description: 'Access app preferences screen',        defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'settings_theme_toggle', displayName: 'Dark / Light Theme Toggle',category: 'SETTINGS', subcategory: 'General & Theme',    description: 'Switch app visual theme mode',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'settings_haptics',      displayName: 'Haptic Vibration Feedback',category: 'SETTINGS', subcategory: 'General & Theme',    description: 'Enable/disable haptic vibrations',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'settings_save_location',displayName: 'Custom Save Directory',    category: 'SETTINGS', subcategory: 'Storage',            description: 'Select custom storage folder',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'cloud_sync_auto',       displayName: 'Auto Data Synchronization', category: 'SETTINGS', subcategory: 'Cloud & Sync',      description: 'Auto-sync history & saved in cloud',   defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'cloud_firestore_mirror',displayName: 'Firestore Document Mirror', category: 'SETTINGS', subcategory: 'Cloud & Sync',      description: 'Mirror local records to Firestore',    defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'cloud_template_upload', displayName: 'Upload Cloud Template',     category: 'SETTINGS', subcategory: 'Cloud & Sync',      description: 'Publish custom design to cloud',       defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'cloud_preferences_sync',displayName: 'Sync User Preferences',    category: 'SETTINGS', subcategory: 'Cloud & Sync',      description: 'Sync app settings across devices',     defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'account_view',                displayName: 'Account / Profile Screen',   category: 'SETTINGS', subcategory: 'Account & Security',description: 'View user profile & status',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'free' },
  { featureId: 'account_google_signin',       displayName: 'Google One-Tap Auth',        category: 'SETTINGS', subcategory: 'Account & Security',description: 'Google Sign In security control',      defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: false, defaultPlan: 'free' },
  { featureId: 'account_subscription_status', displayName: 'Subscription Badge Display', category: 'SETTINGS', subcategory: 'Account & Security',description: 'Display active subscription plan',     defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true,  defaultPlan: 'free' },
  { featureId: 'account_logout',              displayName: 'Account Log Out Action',     category: 'SETTINGS', subcategory: 'Account & Security',description: 'Revoke active session token',          defaultEnabled: true, requiresAuthentication: true,  allowSuperAdminOverride: false, defaultPlan: 'free' },

  // ── LEGACY 16 COMPATIBILITY MAPPINGS ──
  { featureId: 'qr_generator',     displayName: 'Legacy QR Generator',      category: 'QR_GENERATOR',     subcategory: 'QR Engine',         description: 'Legacy container ID for QR engine',       defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_generator', displayName: 'Legacy Barcode Generator', category: 'BARCODE_GENERATOR',subcategory: 'Barcode Appearance', description: 'Legacy container ID for Barcode engine',  defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner',          displayName: 'Legacy Scanner',            category: 'SCANNER',       subcategory: 'Camera Lens',       description: 'Legacy container ID for Scanner',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history',          displayName: 'Legacy History',            category: 'HISTORY',       subcategory: 'History View',      description: 'Legacy container ID for History',         defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved',            displayName: 'Legacy Saved',              category: 'SAVED',         subcategory: 'Collection',        description: 'Legacy container ID for Saved',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'cloud_sync',       displayName: 'Legacy Cloud Sync',         category: 'SETTINGS',      subcategory: 'Cloud & Sync',      description: 'Legacy container ID for Cloud Sync',      defaultEnabled: true, requiresAuthentication: true,  allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_logo',      displayName: 'Legacy Custom Logo',        category: 'QR_GENERATOR',  subcategory: 'Design & Styling',  description: 'Legacy container ID for Logo Embed',      defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_colors',    displayName: 'Legacy Custom Colors',      category: 'QR_GENERATOR',  subcategory: 'Design & Styling',  description: 'Legacy container ID for Custom Colors',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'custom_shapes',    displayName: 'Legacy Custom Shapes',      category: 'QR_GENERATOR',  subcategory: 'Design & Styling',  description: 'Legacy container ID for Custom Shapes',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'premium_templates',displayName: 'Legacy Premium Templates',  category: 'QR_GENERATOR',  subcategory: 'Templates',        description: 'Legacy container ID for Templates',       defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'bulk_generation',  displayName: 'Legacy Bulk Generation',    category: 'BULK_GENERATOR',subcategory: 'Batch Screen',      description: 'Legacy container ID for Batch',           defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'save_location',    displayName: 'Legacy Save Location',      category: 'SETTINGS',      subcategory: 'Storage',           description: 'Legacy container ID for Save Location',   defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 2. SUBSCRIPTION PLAN DEFINITIONS (Exactly 4 Plans)
// ═══════════════════════════════════════════════════════════════════════════
export const CANONICAL_PLANS = ['free', 'weekly', 'monthly', 'yearly'];

export const DEFAULT_FREE_FEATURES = FEATURE_REGISTRY.filter(f => f.defaultPlan === 'free').map(f => f.featureId);
export const DEFAULT_PAID_FEATURES = FEATURE_REGISTRY.map(f => f.featureId);

// ═══════════════════════════════════════════════════════════════════════════
// 3. REASON & STATUS CODES
// ═══════════════════════════════════════════════════════════════════════════
export const REASON = {
  ALLOWED: 'ALLOWED',
  FEATURE_DISABLED: 'FEATURE_DISABLED',
  PLAN_REQUIRED: 'PLAN_REQUIRED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  UNKNOWN_FEATURE: 'UNKNOWN_FEATURE',
};

export const STATUS = {
  ALLOWED: 'allowed',
  DISABLED_BY_ADMIN: 'disabled_by_admin',
  REQUIRES_PLAN: 'requires_plan',
  REQUIRES_AUTHENTICATION: 'requires_authentication',
  UNKNOWN_FEATURE: 'unknown_feature',
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. CENTRALIZED FEATURE ACCESS MANAGER CLASS (Online & Offline Resilient)
// ═══════════════════════════════════════════════════════════════════════════
const STORAGE_KEYS = {
  GLOBAL_FLAGS: 'mushiqr_cached_global_flags',
  PLAN_CONFIGS: 'mushiqr_cached_plan_configs',
  USER_SUB:     'mushiqr_cached_user_subscription'
};

class FeatureAccessManagerService {
  constructor() {
    this.currentUser = null;
    this.userClaims = {};
    
    // Load local offline cached states immediately
    let initialFlags = {};
    let initialPlans = {};
    let initialSub = null;
    try {
      initialFlags = JSON.parse(localStorage.getItem(STORAGE_KEYS.GLOBAL_FLAGS) || '{}');
      initialPlans = JSON.parse(STORAGE_KEYS.PLAN_CONFIGS ? localStorage.getItem(STORAGE_KEYS.PLAN_CONFIGS) || '{}' : '{}');
      initialSub = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SUB) || 'null');
    } catch {
      // Fallback if storage read fails
    }

    this.globalFlags = initialFlags;       // global_config/featureFlags doc
    this.planConfigs = initialPlans;       // subscription_plans/{planId} docs
    this.userSubscription = initialSub;
    this.unsubFlags = null;
    this.unsubPlans = null;
    this.unsubSub = null;
    this.listeners = new Set();

    this.init();
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error('[FeatureAccessManager] Listener error:', e); }
    });
  }

  /**
   * Immediately updates local cache and notifies all active components
   */
  setLocalFlagOverride(featureId, enabled) {
    this.globalFlags = { ...this.globalFlags, [featureId]: enabled };
    try {
      localStorage.setItem(STORAGE_KEYS.GLOBAL_FLAGS, JSON.stringify(this.globalFlags));
    } catch (e) {
      console.warn('[FeatureAccessManager] Storage write error:', e);
    }
    this.notifyListeners();
  }

  init() {
    // 1. Listen to Auth & Custom Claims
    onIdTokenChanged(auth, async (u) => {
      this.currentUser = u;
      if (u) {
        try {
          const res = await u.getIdTokenResult();
          this.userClaims = res.claims || {};
        } catch {
          this.userClaims = {};
        }
        this.listenUserSubscription(u.uid);
      } else {
        this.userClaims = {};
        this.userSubscription = null;
        try { localStorage.removeItem(STORAGE_KEYS.USER_SUB); } catch {}
        if (this.unsubSub) this.unsubSub();
      }
      this.notifyListeners();
    });

    // 2. Real-time listener for global_config/featureFlags + Local Offline Mirror
    try {
      this.unsubFlags = onSnapshot(doc(db, 'global_config', 'featureFlags'), (docSnap) => {
        if (docSnap.exists()) {
          this.globalFlags = docSnap.data() || {};
          try {
            localStorage.setItem(STORAGE_KEYS.GLOBAL_FLAGS, JSON.stringify(this.globalFlags));
          } catch {}
        }
        this.notifyListeners();
      }, (err) => console.warn('[FeatureAccessManager] Global flags listener notice:', err.message));
    } catch (e) {
      console.warn('[FeatureAccessManager] Failed to init globalFlags listener:', e);
    }

    // 3. Real-time listener for subscription_plans collection + Local Offline Mirror
    try {
      this.unsubPlans = onSnapshot(collection(db, 'subscription_plans'), (colSnap) => {
        const plans = {};
        colSnap.forEach(d => {
          plans[d.id] = d.data();
        });
        this.planConfigs = plans;
        try {
          localStorage.setItem(STORAGE_KEYS.PLAN_CONFIGS, JSON.stringify(this.planConfigs));
        } catch {}
        this.notifyListeners();
      }, (err) => console.warn('[FeatureAccessManager] Plans listener notice:', err.message));
    } catch (e) {
      console.warn('[FeatureAccessManager] Failed to init plans listener:', e);
    }
  }

  listenUserSubscription(uid) {
    if (this.unsubSub) this.unsubSub();
    try {
      this.unsubSub = onSnapshot(doc(db, 'user_subscriptions', uid), (docSnap) => {
        if (docSnap.exists()) {
          this.userSubscription = docSnap.data();
          try { localStorage.setItem(STORAGE_KEYS.USER_SUB, JSON.stringify(this.userSubscription)); } catch {}
        } else {
          this.userSubscription = null;
          try { localStorage.removeItem(STORAGE_KEYS.USER_SUB); } catch {}
        }
        this.notifyListeners();
      }, () => {
        this.userSubscription = null;
        this.notifyListeners();
      });
    } catch (e) {
      this.userSubscription = null;
      this.notifyListeners();
    }
  }

  /**
   * Evaluates user's active plan ('free', 'weekly', 'monthly', 'yearly')
   */
  getUserPlan() {
    const sub = this.userSubscription;
    if (!sub) return 'free';

    const rawPlan = (sub.planId || '').toLowerCase();
    
    // Map legacy 'pro' or 'pro_monthly'/'pro_yearly'/'lifetime' to new canonical plans
    let plan = 'free';
    if (CANONICAL_PLANS.includes(rawPlan)) {
      plan = rawPlan;
    } else if (sub.isPro || rawPlan === 'pro' || rawPlan === 'pro_monthly' || rawPlan === 'pro_yearly' || rawPlan === 'lifetime') {
      plan = 'monthly'; // default legacy paid fallback
    }

    // Check expiration if applicable
    if (sub.expiryDate) {
      const expTime = new Date(sub.expiryDate).getTime();
      if (!isNaN(expTime) && Date.now() > expTime) {
        return 'free';
      }
    }

    if (sub.status === 'inactive' || sub.cancelled) {
      return 'free';
    }

    return plan;
  }

  /**
   * Primary Entitlement Access API
   */
  canUseFeature(featureId) {
    const featDef = FEATURE_REGISTRY.find(f => f.featureId === featureId);

    // 1. Validate feature exists in Registry
    if (!featDef) {
      return {
        allowed: false,
        reason: REASON.UNKNOWN_FEATURE,
        status: STATUS.UNKNOWN_FEATURE,
        featureId,
        requiredPlan: null,
      };
    }

    // 2. Check Global Feature Switch (global_config/featureFlags) FIRST
    // Emergency global disable turns feature off application-wide for ALL users
    const flagVal = this.globalFlags[featureId];
    const isGloballyEnabled = flagVal !== undefined ? Boolean(flagVal) : featDef.defaultEnabled;

    if (!isGloballyEnabled) {
      return {
        allowed: false,
        reason: REASON.FEATURE_DISABLED,
        status: STATUS.DISABLED_BY_ADMIN,
        featureId,
        requiredPlan: null,
      };
    }

    // 3. Check Authentication Requirement
    if (featDef.requiresAuthentication && !this.currentUser) {
      return {
        allowed: false,
        reason: REASON.UNAUTHENTICATED,
        status: STATUS.REQUIRES_AUTHENTICATION,
        featureId,
        requiredPlan: null,
      };
    }

    // 4. Super Admin Plan Entitlement Override
    // Super Admins bypass subscription plan paywalls for globally enabled features
    const isSuperAdmin = this.userClaims?.role === 'super_admin';
    if (isSuperAdmin && featDef.allowSuperAdminOverride) {
      return {
        allowed: true,
        reason: REASON.ALLOWED,
        status: STATUS.ALLOWED,
        featureId,
        requiredPlan: 'free',
        isSuperAdminOverride: true,
      };
    }

    // 5. Check User Subscription Plan Feature Assignment
    const userPlan = this.getUserPlan();
    const planConfig = this.planConfigs[userPlan];
    const allowedFeatures = planConfig?.features || (userPlan === 'free' ? DEFAULT_FREE_FEATURES : DEFAULT_PAID_FEATURES);

    if (!allowedFeatures.includes(featureId)) {
      return {
        allowed: false,
        reason: REASON.PLAN_REQUIRED,
        status: STATUS.REQUIRES_PLAN,
        featureId,
        requiredPlan: this.findMinimumPlanForFeature(featureId),
      };
    }

    return {
      allowed: true,
      reason: REASON.ALLOWED,
      status: STATUS.ALLOWED,
      featureId,
      requiredPlan: userPlan,
    };
  }

  requireAccess(featureId) {
    return this.canUseFeature(featureId);
  }

  getFeatureState(featureId) {
    return this.canUseFeature(featureId);
  }

  findMinimumPlanForFeature(featureId) {
    for (const pId of ['weekly', 'monthly', 'yearly']) {
      const feats = this.planConfigs[pId]?.features || DEFAULT_PAID_FEATURES;
      if (feats.includes(featureId)) return pId;
    }
    return 'weekly';
  }

  isFeatureAllowed(featureId) {
    return this.canUseFeature(featureId).allowed;
  }

  /**
   * Evaluates if a subcategory is allowed/visible.
   * If the subcategory tab flag itself is disabled OR if all features in that subcategory are turned OFF globally, returns false.
   */
  isSubcategoryAllowed(category, subcategory) {
    const subcatFeatures = FEATURE_REGISTRY.filter(f => f.category === category && f.subcategory === subcategory);
    if (subcatFeatures.length === 0) return true;

    // Check if any feature in this subcategory is enabled globally
    const hasAnyEnabled = subcatFeatures.some(f => {
      const flagVal = this.globalFlags[f.featureId];
      return flagVal !== undefined ? Boolean(flagVal) : f.defaultEnabled;
    });

    return hasAnyEnabled;
  }

  /**
   * Helper specifically for QR Generator lower navbar tabs
   */
  isQRTabVisible(tabId) {
    const tabMap = {
      content:  { tabFlag: 'qr_tab_content',  subcat: 'Content' },
      color:    { tabFlag: 'qr_tab_color',    subcat: 'Color' },
      shapes:   { tabFlag: 'qr_tab_style',    subcat: 'Style' },
      logo:     { tabFlag: 'qr_tab_logo',     subcat: 'Logo' },
      template: { tabFlag: 'qr_tab_template', subcat: 'Template' },
      text:     { tabFlag: 'qr_tab_text',     subcat: 'Text' },
    };

    const target = tabMap[tabId];
    if (!target) return true;

    // 1. If explicit tab flag is turned OFF by admin, hide immediately
    if (this.globalFlags[target.tabFlag] === false) return false;

    // 2. If all subcategory features under this tab are turned OFF globally, hide tab
    return this.isSubcategoryAllowed('QR_GENERATOR', target.subcat);
  }
}

export const FeatureAccessManager = new FeatureAccessManagerService();
export default FeatureAccessManager;
