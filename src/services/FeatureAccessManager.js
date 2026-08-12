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

export const FEATURE_CATEGORIES = {
  HOME:            { id: 'HOME',            name: 'Home Screen' },
  QR_CONTENT:      { id: 'QR_CONTENT',      name: 'QR Content Types' },
  QR_ENGINE:       { id: 'QR_ENGINE',       name: 'QR Engine & Controls' },
  BARCODE_FORMATS: { id: 'BARCODE_FORMATS', name: 'Barcode Standards' },
  BARCODE_ENGINE:  { id: 'BARCODE_ENGINE',  name: 'Barcode Engine & Styling' },
  SCANNER:         { id: 'SCANNER',         name: 'QR & Barcode Scanner' },
  DESIGN:          { id: 'DESIGN',          name: 'Design & Customization' },
  TEMPLATES:       { id: 'TEMPLATES',       name: 'Templates Library' },
  EXPORT:          { id: 'EXPORT',          name: 'Export & Downloads' },
  BATCH:           { id: 'BATCH',           name: 'Batch & Bulk Operations' },
  SAVED:           { id: 'SAVED',           name: 'Saved Collection' },
  HISTORY:         { id: 'HISTORY',         name: 'History Tracking' },
  CLOUD:           { id: 'CLOUD',           name: 'Cloud & Data Sync' },
  SETTINGS:        { id: 'SETTINGS',        name: 'Settings & Preferences' },
  ACCOUNT:         { id: 'ACCOUNT',         name: 'Account & Profile' },
};

export const FEATURE_REGISTRY = [
  // ── 1. HOME SCREEN ──
  { featureId: 'home_view', displayName: 'Home Dashboard View', category: 'HOME', description: 'Access main Home screen', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'home_recent_items', displayName: 'Recent Activity Grid', category: 'HOME', description: 'Display recent items on Home', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'home_quick_qr', displayName: 'Quick QR Shortcuts', category: 'HOME', description: 'Quick QR creation cards', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'home_quick_barcode', displayName: 'Quick Barcode Shortcuts', category: 'HOME', description: 'Quick barcode creation cards', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'home_scanner_shortcut', displayName: 'Quick Scanner Launch Card', category: 'HOME', description: 'Scanner launcher card', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'home_batch_shortcut', displayName: 'Batch Generator Launch Card', category: 'HOME', description: 'Batch generator card', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },

  // ── 2. QR CONTENT TYPES ──
  { featureId: 'qr_text', displayName: 'Plain Text QR', category: 'QR_CONTENT', description: 'Generate plain text QR code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_url', displayName: 'Website URL QR', category: 'QR_CONTENT', description: 'Generate website URL QR code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_wifi', displayName: 'Wi-Fi Network QR', category: 'QR_CONTENT', description: 'Generate Wi-Fi credentials QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_email', displayName: 'Email Message QR', category: 'QR_CONTENT', description: 'Generate mailto QR code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_phone', displayName: 'Phone Call QR', category: 'QR_CONTENT', description: 'Generate tel QR code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_sms', displayName: 'SMS Text Message QR', category: 'QR_CONTENT', description: 'Generate smsto QR code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_vcard', displayName: 'vCard Contact QR', category: 'QR_CONTENT', description: 'Generate contact card QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_location', displayName: 'Map Location QR', category: 'QR_CONTENT', description: 'Generate geo location QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_pdf', displayName: 'PDF Document Link QR', category: 'QR_CONTENT', description: 'Generate PDF file QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_image', displayName: 'Image Gallery Link QR', category: 'QR_CONTENT', description: 'Generate image link QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_audio', displayName: 'Audio File Link QR', category: 'QR_CONTENT', description: 'Generate audio link QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_document', displayName: 'Document Link QR', category: 'QR_CONTENT', description: 'Generate document file QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_event', displayName: 'Calendar Event QR', category: 'QR_CONTENT', description: 'Generate iCal event QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_crypto', displayName: 'Crypto Wallet QR', category: 'QR_CONTENT', description: 'Generate cryptocurrency QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_whatsapp', displayName: 'WhatsApp Direct Chat QR', category: 'QR_CONTENT', description: 'Generate WhatsApp QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_youtube', displayName: 'YouTube Video QR', category: 'QR_CONTENT', description: 'Generate YouTube link QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_instagram', displayName: 'Instagram Profile QR', category: 'QR_CONTENT', description: 'Generate Instagram link QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_facebook', displayName: 'Facebook Page QR', category: 'QR_CONTENT', description: 'Generate Facebook link QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_x', displayName: 'X (Twitter) Profile QR', category: 'QR_CONTENT', description: 'Generate X profile QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_linkedin', displayName: 'LinkedIn Profile QR', category: 'QR_CONTENT', description: 'Generate LinkedIn QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 3. QR ENGINE & CONTROLS ──
  { featureId: 'qr_matrix_engine', displayName: 'Core QR Matrix Generator', category: 'QR_ENGINE', description: 'Standard QR matrix creation', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_error_correction', displayName: 'Error Correction Levels', category: 'QR_ENGINE', description: 'Adjust L/M/Q/H error levels', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_quiet_zone', displayName: 'Quiet Zone Slider', category: 'QR_ENGINE', description: 'Adjust margin padding around QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'qr_center_text', displayName: 'Center Text & Fonts', category: 'QR_ENGINE', description: 'Embed text inside QR center', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'qr_size_custom', displayName: 'Custom Canvas Size', category: 'QR_ENGINE', description: 'Adjust render resolution slider', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 4. BARCODE STANDARDS ──
  { featureId: 'barcode_code128', displayName: 'Code 128 Standard', category: 'BARCODE_FORMATS', description: 'Standard logistics 1D barcode', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_code39', displayName: 'Code 39 Industrial', category: 'BARCODE_FORMATS', description: 'Industrial legacy 1D barcode', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_ean13', displayName: 'EAN-13 Retail', category: 'BARCODE_FORMATS', description: 'Global retail 13-digit standard', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_ean8', displayName: 'EAN-8 Compact', category: 'BARCODE_FORMATS', description: 'Condensed retail 8-digit standard', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_upca', displayName: 'UPC-A Retail (US)', category: 'BARCODE_FORMATS', description: 'US retail 12-digit standard', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_upce', displayName: 'UPC-E Condensed', category: 'BARCODE_FORMATS', description: 'US condensed retail format', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_itf14', displayName: 'ITF-14 Shipping Carton', category: 'BARCODE_FORMATS', description: '14-digit shipping carton barcode', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_i25', displayName: 'Interleaved 2 of 5', category: 'BARCODE_FORMATS', description: 'Numeric industrial format', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_codabar', displayName: 'Codabar Library/Health', category: 'BARCODE_FORMATS', description: 'Library & blood bank tracking', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_code93', displayName: 'Code 93 Compact', category: 'BARCODE_FORMATS', description: 'Compact alphanumeric 1D', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_code11', displayName: 'Code 11 Telecom', category: 'BARCODE_FORMATS', description: 'Telecommunications standard', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_msi', displayName: 'MSI Plessey', category: 'BARCODE_FORMATS', description: 'Retail shelf marking standard', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_datamatrix', displayName: 'Data Matrix 2D', category: 'BARCODE_FORMATS', description: 'High-density industrial 2D', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_pdf417', displayName: 'PDF417 2D Stacked', category: 'BARCODE_FORMATS', description: 'High-capacity 2D stacked format', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_aztec', displayName: 'Aztec Code 2D', category: 'BARCODE_FORMATS', description: 'Transit & ticketing 2D code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_gs1databar', displayName: 'GS1 DataBar Omni', category: 'BARCODE_FORMATS', description: 'Omnidirectional retail GTIN', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_gs1128', displayName: 'GS1-128 Logistics', category: 'BARCODE_FORMATS', description: 'GS1 logistics carrier identifier', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_postnet', displayName: 'Postnet USPS Zip', category: 'BARCODE_FORMATS', description: 'US Postal Service zip code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_planet', displayName: 'Planet USPS Mail', category: 'BARCODE_FORMATS', description: 'US Postal Service mail tracking', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_royalmail', displayName: 'Royal Mail Code', category: 'BARCODE_FORMATS', description: 'UK Postal routing code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_telepen', displayName: 'Telepen Full-ASCII', category: 'BARCODE_FORMATS', description: 'Full ASCII industrial format', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_pharmacode', displayName: 'Pharmacode Packaging', category: 'BARCODE_FORMATS', description: 'Pharmaceutical packaging code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_maxicode', displayName: 'MaxiCode UPS Parcel', category: 'BARCODE_FORMATS', description: 'UPS 2D parcel tracking matrix', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_qrcode', displayName: 'Barcode Engine QR 2D', category: 'BARCODE_FORMATS', description: 'Standard 2D QR via barcode engine', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_microqrcode', displayName: 'Micro QR Compact', category: 'BARCODE_FORMATS', description: 'Compact miniaturized 2D QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'barcode_hanxin', displayName: 'Han Xin Code 2D', category: 'BARCODE_FORMATS', description: 'Chinese national standard 2D', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_codablockf', displayName: 'Codablock F Stacked', category: 'BARCODE_FORMATS', description: 'Stacked alphanumeric barcode', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_code16k', displayName: 'Code 16K Stacked', category: 'BARCODE_FORMATS', description: 'Multi-row stacked layout', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_code49', displayName: 'Code 49 Stacked', category: 'BARCODE_FORMATS', description: 'Compact stacked 81-char code', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },
  { featureId: 'barcode_channelcode', displayName: 'Channel Code', category: 'BARCODE_FORMATS', description: 'Condensed numeric 2-7 channel', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'monthly' },

  // ── 5. BARCODE ENGINE & STYLING ──
  { featureId: 'barcode_custom_colors', displayName: 'Barcode Custom Colors', category: 'BARCODE_ENGINE', description: 'Custom bar and background colors', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_dimension_controls', displayName: 'Barcode Height & Width', category: 'BARCODE_ENGINE', description: 'Adjust bar width multiplier & height', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_text_display', displayName: 'Toggle Text Under Barcode', category: 'BARCODE_ENGINE', description: 'Show/hide human readable text', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 6. SCANNER ──
  { featureId: 'scanner_camera_live', displayName: 'Live Lens Camera Scanning', category: 'SCANNER', description: 'Real-time camera lens barcode scan', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_image_upload', displayName: 'Gallery Image Scanning', category: 'SCANNER', description: 'Scan QR/barcode from local photo', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_flashlight', displayName: 'Flashlight Torch Toggle', category: 'SCANNER', description: 'Camera flashlight activation', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_zoom', displayName: 'Camera Pinch-Zoom', category: 'SCANNER', description: 'Adjust camera optical/digital zoom', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_barcode_detect', displayName: '1D & 2D Format Auto-Detect', category: 'SCANNER', description: 'Automatic detection of 14 formats', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner_result_actions', displayName: 'Result Actions & Copy', category: 'SCANNER', description: 'Copy text, open URL from scan', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 7. DESIGN & CUSTOMIZATION ──
  { featureId: 'custom_logo_upload', displayName: 'Custom Brand Logo Upload', category: 'DESIGN', description: 'Upload personal image inside QR', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_logo_presets', displayName: 'Brand Logo Presets Gallery', category: 'DESIGN', description: 'Select pre-installed social logos', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'custom_colors_solid', displayName: 'Custom Solid Color Picker', category: 'DESIGN', description: 'Advanced RGB/HSB solid picker', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'custom_colors_gradient', displayName: 'Dual-Color Gradient QR', category: 'DESIGN', description: 'Linear gradient color fills', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_dot_styles', displayName: 'Custom Dot Module Shapes', category: 'DESIGN', description: '20+ dot shapes (dots, leaf, etc)', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_eye_styles', displayName: 'Custom Eye Finder Shapes', category: 'DESIGN', description: '20+ corner eye shapes', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_frames', displayName: 'Outer Frames & Badges', category: 'DESIGN', description: 'Decorative QR frame borders', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },

  // ── 8. TEMPLATES ──
  { featureId: 'templates_browse', displayName: 'Browse Templates Gallery', category: 'TEMPLATES', description: 'Explore pre-designed QR designs', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'templates_free_apply', displayName: 'Apply Standard Templates', category: 'TEMPLATES', description: 'Use free standard templates', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'templates_premium_apply', displayName: 'Apply Premium Templates', category: 'TEMPLATES', description: 'Use high-conversion premium templates', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'templates_save_custom', displayName: 'Save Custom User Template', category: 'TEMPLATES', description: 'Save current design as template', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'templates_cloud_library', displayName: 'Cloud Template Library', category: 'TEMPLATES', description: 'Access community cloud templates', defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },

  // ── 9. EXPORT & DOWNLOAD ──
  { featureId: 'export_png', displayName: 'PNG Image Export', category: 'EXPORT', description: 'Download high-res PNG image', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'export_jpg', displayName: 'JPG Image Export', category: 'EXPORT', description: 'Download compressed JPG image', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'export_svg', displayName: 'SVG Vector Export', category: 'EXPORT', description: 'Download scalable SVG vector file', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'export_pdf', displayName: 'PDF Document Export', category: 'EXPORT', description: 'Download print-ready A4 PDF', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'export_native_share', displayName: 'Native OS Share Sheet', category: 'EXPORT', description: 'Share file directly to social apps', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 10. BATCH / BULK OPERATIONS ──
  { featureId: 'batch_view', displayName: 'Batch Generator Screen', category: 'BATCH', description: 'Access bulk generation tool', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_csv_import', displayName: 'CSV Data Import', category: 'BATCH', description: 'Upload CSV file for bulk codes', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_manual_input', displayName: 'Multi-line Text Input', category: 'BATCH', description: 'Paste multi-line raw data', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_custom_style', displayName: 'Apply Style to Batch', category: 'BATCH', description: 'Apply active design to all codes', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'batch_zip_export', displayName: 'Download ZIP Archive', category: 'BATCH', description: 'Export all codes as compressed ZIP', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },

  // ── 11. SAVED COLLECTION ──
  { featureId: 'saved_view', displayName: 'Saved Collection Screen', category: 'SAVED', description: 'Access bookmarked QR collection', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved_save_action', displayName: 'Bookmark / Save Action', category: 'SAVED', description: 'Bookmark QR code to saved list', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved_delete_action', displayName: 'Remove Bookmarked Item', category: 'SAVED', description: 'Delete item from saved list', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved_search_filter', displayName: 'Search & Filter Saved', category: 'SAVED', description: 'Search query filter in saved list', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 12. HISTORY TRACKING ──
  { featureId: 'history_view', displayName: 'Creation History Screen', category: 'HISTORY', description: 'View generation & scan logs', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history_save_auto', displayName: 'Auto-Save Generation Log', category: 'HISTORY', description: 'Auto-log created items to history', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history_delete_item', displayName: 'Delete History Log Item', category: 'HISTORY', description: 'Delete single entry from history', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history_clear_all', displayName: 'Clear History Range', category: 'HISTORY', description: 'Clear history log by time window', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 13. CLOUD & DATA SYNC ──
  { featureId: 'cloud_sync_auto', displayName: 'Auto Data Synchronization', category: 'CLOUD', description: 'Auto-sync history & saved in cloud', defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'cloud_firestore_mirror', displayName: 'Firestore Document Mirror', category: 'CLOUD', description: 'Mirror local records to Firestore', defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'cloud_template_upload', displayName: 'Upload Cloud Template', category: 'CLOUD', description: 'Publish custom design to cloud', defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'cloud_preferences_sync', displayName: 'Sync User Preferences', category: 'CLOUD', description: 'Sync app settings across devices', defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 14. SETTINGS & PREFERENCES ──
  { featureId: 'settings_view', displayName: 'View Settings Page', category: 'SETTINGS', description: 'Access app preferences screen', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'settings_theme_toggle', displayName: 'Dark / Light Theme Toggle', category: 'SETTINGS', description: 'Switch app visual theme mode', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'settings_save_location', displayName: 'Custom Save Directory', category: 'SETTINGS', description: 'Select custom storage folder', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'settings_haptics', displayName: 'Haptic Vibration Feedback', category: 'SETTINGS', description: 'Enable/disable haptic vibrations', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },

  // ── 15. ACCOUNT & PROFILE (SECURITY CONTROLS NOT REMOTELY DISABLEABLE) ──
  { featureId: 'account_view', displayName: 'Account / Profile Screen', category: 'ACCOUNT', description: 'View user profile & status', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'account_google_signin', displayName: 'Google One-Tap Auth', category: 'ACCOUNT', description: 'Google Sign In security control', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: false, defaultPlan: 'free' },
  { featureId: 'account_subscription_status', displayName: 'Subscription Badge Display', category: 'ACCOUNT', description: 'Display active subscription plan', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'account_logout', displayName: 'Account Log Out Action', category: 'ACCOUNT', description: 'Revoke active session token', defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: false, defaultPlan: 'free' },

  // ── LEGACY 16 COMPATIBILITY MAPPINGS ──
  { featureId: 'qr_generator', displayName: 'Legacy QR Generator', category: 'QR_ENGINE', description: 'Legacy container ID for QR engine', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'barcode_generator', displayName: 'Legacy Barcode Generator', category: 'BARCODE_ENGINE', description: 'Legacy container ID for Barcode engine', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'scanner', displayName: 'Legacy Scanner', category: 'SCANNER', description: 'Legacy container ID for Scanner', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'history', displayName: 'Legacy History', category: 'HISTORY', description: 'Legacy container ID for History', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'saved', displayName: 'Legacy Saved', category: 'SAVED', description: 'Legacy container ID for Saved', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'cloud_sync', displayName: 'Legacy Cloud Sync', category: 'CLOUD', description: 'Legacy container ID for Cloud Sync', defaultEnabled: true, requiresAuthentication: true, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_logo', displayName: 'Legacy Custom Logo', category: 'DESIGN', description: 'Legacy container ID for Logo Embed', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'custom_colors', displayName: 'Legacy Custom Colors', category: 'DESIGN', description: 'Legacy container ID for Custom Colors', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'free' },
  { featureId: 'custom_shapes', displayName: 'Legacy Custom Shapes', category: 'DESIGN', description: 'Legacy container ID for Custom Shapes', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'premium_templates', displayName: 'Legacy Premium Templates', category: 'TEMPLATES', description: 'Legacy container ID for Templates', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'bulk_generation', displayName: 'Legacy Bulk Generation', category: 'BATCH', description: 'Legacy container ID for Batch', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
  { featureId: 'save_location', displayName: 'Legacy Save Location', category: 'SETTINGS', description: 'Legacy container ID for Save Location', defaultEnabled: true, requiresAuthentication: false, allowSuperAdminOverride: true, defaultPlan: 'weekly' },
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
// 4. CENTRALIZED FEATURE ACCESS MANAGER CLASS
// ═══════════════════════════════════════════════════════════════════════════
class FeatureAccessManagerService {
  constructor() {
    this.currentUser = null;
    this.userClaims = {};
    this.userSubscription = null;
    this.globalFlags = {};       // global_config/featureFlags doc
    this.planConfigs = {};       // subscription_plans/{planId} docs
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
        if (this.unsubSub) this.unsubSub();
      }
      this.notifyListeners();
    });

    // 2. Real-time listener for global_config/featureFlags
    try {
      this.unsubFlags = onSnapshot(doc(db, 'global_config', 'featureFlags'), (docSnap) => {
        if (docSnap.exists()) {
          this.globalFlags = docSnap.data() || {};
        } else {
          this.globalFlags = {};
        }
        this.notifyListeners();
      }, (err) => console.warn('[FeatureAccessManager] Global flags listener notice:', err.message));
    } catch (e) {
      console.warn('[FeatureAccessManager] Failed to init globalFlags listener:', e);
    }

    // 3. Real-time listener for subscription_plans collection
    try {
      this.unsubPlans = onSnapshot(collection(db, 'subscription_plans'), (colSnap) => {
        const plans = {};
        colSnap.forEach(d => {
          plans[d.id] = d.data();
        });
        this.planConfigs = plans;
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
        } else {
          this.userSubscription = null;
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
}

export const FeatureAccessManager = new FeatureAccessManagerService();
export default FeatureAccessManager;
