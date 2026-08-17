// admin/src/components/VisualQRControlStudio.jsx
// ─── Complete Visual QR Feature, Shapes, Logos, Textures & Fonts Studio ─────
// Comprehensive WYSIWYG studio for Super Admins. Controls all 18 QR content types,
// 37 dot shapes (with live canvas render), 35 eye shapes (with live canvas render),
// 40 brand logos, 9 social textures, 12 dual-gradients, 8 background shapes,
// 30 typography fonts, 12 scan-me frames, and 20+ templates with 1-click Free/Pro & Active toggles.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  QrCode, Sparkles, Shield, Crown, Power, XCircle, Search, Check,
  Palette, Sliders, Image, Type, Download, Share2, Layers, RefreshCw,
  FileText, Globe, Wifi, Mail, Phone, MessageSquare, User, MapPin,
  FileSpreadsheet, Music, Calendar, DollarSign, MessageCircle, Video,
  Send, AtSign, CheckCircle2, SlidersHorizontal, ChevronRight, Eye,
  Grid, Box, Wand2, ArrowRightLeft, Lock, Unlock, EyeOff, LayoutGrid,
  FileCheck, Star, Heart, Bookmark, UploadCloud, Brush, Layers2,
  Eraser, Paintbrush
} from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { setFeatureFlagCloud, setFeatureFlagsBatchCloud, setFeaturesTierBatchCloud } from '../services/adminDataService';
import { FEATURE_REGISTRY } from '../services/FeatureAccessManager';
import { drawDotModule, drawEye, renderQR, generateQRMatrix } from '../utils/qrEngine.js';
import { QR_TEMPLATES } from '../utils/qrTemplates.js';
import qrcode from 'qrcode-generator';

// ─── 1. RAW CATALOG DATA ───────────────────────────────────────────────────

export const ALL_DOT_STYLES = [
  { id: 'denso', name: 'Denso Classic', desc: 'Standard square matrix' },
  { id: 'dots', name: 'Circular Dots', desc: 'Smooth round dot modules' },
  { id: 'sparkle', name: 'Diamond Sparkle', desc: 'Radiant 4-point sparkle' },
  { id: 'fluid', name: 'Fluid Liquid', desc: 'Organic connected fluid curves' },
  { id: 'capsule', name: 'Capsule Pill', desc: 'Rounded vertical capsules' },
  { id: 'hexagon', name: 'Hexagon Tech', desc: 'Futuristic 6-sided polygon' },
  { id: 'square', name: 'Crisp Square', desc: 'Sharp geometric squares' },
  { id: 'rounded', name: 'Rounded Corners', desc: 'Softened square modules' },
  { id: 'leaf', name: 'Nature Leaf', desc: 'Organic curved leaf shapes' },
  { id: 'diamond', name: 'Precious Diamond', desc: '45-degree angled diamond' },
  { id: 'pixel', name: 'Retro Pixel', desc: '8-bit arcade retro style' },
  { id: 'shield', name: 'Knight Shield', desc: 'Protective shield badges' },
  { id: 'star', name: '5-Point Star', desc: 'Decorative golden stars' },
  { id: 'heart', name: 'Love Heart', desc: 'Romantic heart shapes' },
  { id: 'triangle', name: 'Modern Triangle', desc: 'Sharp delta geometry' },
  { id: 'octagon', name: 'Stop Octagon', desc: '8-sided industrial stop style' },
  { id: 'plus', name: 'Plus Cross', desc: 'Medical and geometric cross' },
  { id: 'cross', name: 'Diagonal Cross', desc: 'X-form dynamic module' },
  { id: 'cherry-blossom', name: 'Cherry Blossom', desc: 'Japanese sakura floral petals' },
  { id: 'violet-flower', name: 'Violet Flower', desc: 'Petal flower flourish' },
  { id: 'sunflower', name: 'Summer Sunflower', desc: 'Radiant sunburst petals' },
  { id: 'rose', name: 'Royal Rose', desc: 'Intricate blooming rose petals' },
  { id: 'daisy', name: 'Spring Daisy', desc: 'Multi-petal daisy flora' },
  { id: 'tulip', name: 'Spring Tulip', desc: 'Dutch tulip cup floral' },
  { id: 'lotus', name: 'Zen Lotus', desc: 'Spiritual floating water lotus' },
  { id: 'forget-me-not', name: 'Forget Me Not', desc: 'Delicate floral pattern' },
  { id: 'pansy', name: 'Colorful Pansy', desc: 'Garden bloom module' },
  { id: 'dollar-coin', name: 'Dollar Coin', desc: 'Financial dollar token badge' },
  { id: 'cute-emoticon', name: 'Cute Emoji Smile', desc: 'Playful smiley face avatar' },
  { id: 'lavender', name: 'Provence Lavender', desc: 'Herbaceous botanical sprig' },
  { id: 'monstera', name: 'Tropical Monstera', desc: 'Exotic jungle palm leaf' },
  { id: 'coffee-bean', name: 'Coffee Bean', desc: 'Artisanal roasted coffee bean' },
  { id: 'raindrop', name: 'Water Raindrop', desc: 'Teardrop moisture drop' },
  { id: 'cactus-plant', name: 'Desert Cactus', desc: 'Southwest succulent cactus' },
  { id: 'basketball-dot', name: 'Basketball', desc: 'Sport basketball orb' },
  { id: 'chess-pawn', name: 'Chess Pawn', desc: 'Strategic chess piece' },
  { id: 'bow-ribbon', name: 'Gift Bow Ribbon', desc: 'Celebration gift tie' }
];

export const ALL_EYE_STYLES = [
  { id: 'square', name: 'Square Standard', desc: 'Classic square finder corners' },
  { id: 'rounded', name: 'Rounded Frame', desc: 'Gentle rounded corners' },
  { id: 'circle', name: 'Circle Eye', desc: 'Target ring concentric circles' },
  { id: 'leaf', name: 'Curved Leaf', desc: 'Organic plant leaf contour' },
  { id: 'teardrop', name: 'Teardrop Angle', desc: 'Fluid droplet point' },
  { id: 'modern', name: 'Modern Dual', desc: 'Contemporary double-beveled' },
  { id: 'flower', name: 'Floral Eye', desc: 'Botanical petal corner' },
  { id: 'shield', name: 'Security Shield', desc: 'Defensive badge shape' },
  { id: 'diamond', name: 'Diamond Gem', desc: 'Angled jewel finder' },
  { id: 'geometric', name: 'Geometric Hex', desc: 'Sharp futuristic contour' },
  { id: 'octagon', name: 'Octagon Frame', desc: '8-sided industrial corner' },
  { id: 'hexagon', name: 'Hexagonal Tech', desc: '6-sided cyber frame' },
  { id: 'notch', name: 'LCD Notched', desc: 'Cyberpunk corner cuts' },
  { id: 'star', name: 'Golden Star Eye', desc: '5-pointed celestial star' },
  { id: 'spotlight', name: 'Spotlight Beacon', desc: 'Circular glow lens' },
  { id: 'pillow', name: 'Pillow Cushion', desc: 'Concave cushion edges' },
  { id: 'dollar-coin', name: 'Dollar Coin Eye', desc: 'Fintech coin badge' },
  { id: 'cute-emoticon', name: 'Emoji Smile Eye', desc: 'Playful character eye' },
  { id: 'cherry-blossom', name: 'Sakura Eye', desc: 'Cherry blossom petal eye' },
  { id: 'lotus', name: 'Lotus Bloom Eye', desc: 'Zen flower corner' },
  { id: 'sunflower', name: 'Sunflower Eye', desc: 'Radiant sunflower frame' },
  { id: 'lavender', name: 'Lavender Eye', desc: 'Botanical corner eye' },
  { id: 'rose', name: 'Rose Petal Eye', desc: 'Blooming rose corner' },
  { id: 'monstera', name: 'Monstera Leaf Eye', desc: 'Palm frond eye' },
  { id: 'daisy', name: 'Daisy Eye', desc: 'Floral daisy eye' },
  { id: 'coffee-bean-eye', name: 'Coffee Roaster Eye', desc: 'Cafe branded corner' },
  { id: 'raindrop-eye', name: 'Raindrop Eye', desc: 'Water droplet eye' },
  { id: 'cactus-eye', name: 'Cactus Eye', desc: 'Succulent plant corner' },
  { id: 'basketball-eye', name: 'Basketball Eye', desc: 'Sports ball finder' },
  { id: 'chess-eye', name: 'Chess Crown Eye', desc: 'Chess piece corner' },
  { id: 'bow-eye', name: 'Bow Ribbon Eye', desc: 'Gift ribbon corner' },
  { id: 'violet-flower-eye', name: 'Violet Flower Eye', desc: 'Petal flower corner' },
  { id: 'tulip-eye', name: 'Tulip Eye', desc: 'Spring tulip corner' },
  { id: 'forget-me-not-eye', name: 'Forget Me Not Eye', desc: 'Delicate floral eye' },
  { id: 'pansy-eye', name: 'Pansy Bloom Eye', desc: 'Garden pansy eye' }
];

export const ALL_LOGO_PRESETS = [
  { slug: 'custom-icon', name: 'Mushi App Icon', color: '#D60036', url: '/presets/Icon.avif' },
  { slug: 'facebook', name: 'Facebook', color: '#1877F2', url: '/presets/facebook.avif' },
  { slug: 'whatsapp', name: 'WhatsApp', color: '#25D366', url: '/presets/whatsapp.avif' },
  { slug: 'instagram', name: 'Instagram', color: '#E4405F', url: '/presets/instagram.avif' },
  { slug: 'youtube', name: 'YouTube', color: '#FF0000', url: '/presets/youtube.avif' },
  { slug: 'tiktok', name: 'TikTok', color: '#000000', url: '/presets/tiktok.avif' },
  { slug: 'linkedin', name: 'LinkedIn', color: '#0A66C2', url: '/presets/linkedin.avif' },
  { slug: 'twitter', name: 'Twitter / X', color: '#1DA1F2', url: '/presets/twitter.avif' },
  { slug: 'gmail', name: 'Gmail Email', color: '#EA4335', url: '/presets/gmail.avif' },
  { slug: 'github', name: 'GitHub Code', color: '#24292F', url: '/presets/github.avif' },
  { slug: 'spotify', name: 'Spotify Music', color: '#1DB954', url: '/presets/spotify.avif' },
  { slug: 'apple', name: 'Apple Brand', color: '#A2AAAD', url: '/presets/apple.avif' },
  { slug: 'picsart', name: 'Picsart Studio', color: '#00C5FF', url: '/presets/Picsart_26-07-18_11-14-07-816.avif' },
  { slug: 'messenger', name: 'FB Messenger', color: '#0084FF', url: '/presets/messenger.avif' },
  { slug: 'pinterest', name: 'Pinterest Pin', color: '#BD081C', url: '/presets/pinterest.avif' },
  { slug: 'reddit', name: 'Reddit Community', color: '#FF4500', url: '/presets/reddit.avif' },
  { slug: 'internet', name: 'Global Web', color: '#00BCD4', url: '/presets/internet.avif' },
  { slug: 'wifi', name: 'Wi-Fi Signal', color: '#2196F3', url: '/presets/wifi.avif' },
  { slug: 'id-card', name: 'vCard ID Badge', color: '#FF9800', url: '/presets/id-card.avif' },
  { slug: 'sms', name: 'SMS Chat', color: '#4CAF50', url: '/presets/sms.avif' },
  { slug: 'pdf', name: 'Adobe PDF Doc', color: '#F44336', url: '/presets/pdf.avif' },
  { slug: 'bitcoin', name: 'Bitcoin Crypto', color: '#F7931A', url: '/presets/bitcoin.avif' },
  { slug: 'chatting', name: 'Direct Chat', color: '#4CAF50', url: '/presets/chatting.avif' },
  { slug: 'dribbble', name: 'Dribbble Design', color: '#EA4C89', url: '/presets/dribbble.avif' },
  { slug: 'behance', name: 'Behance Portfolio', color: '#1769FF', url: '/presets/behance.avif' },
  { slug: 'google-calendar', name: 'Google Calendar', color: '#4285F4', url: '/presets/google-calendar.avif' },
  { slug: 'google-maps', name: 'Google Maps GPS', color: '#34A853', url: '/presets/google-maps.avif' },
  { slug: 'google-play', name: 'Google Play Store', color: '#4285F4', url: '/presets/google-play.avif' },
  { slug: 'skype', name: 'Skype Video', color: '#00AFF0', url: '/presets/skype.avif' },
  { slug: 'viber', name: 'Viber Messenger', color: '#7360F2', url: '/presets/viber.avif' },
  { slug: 'vimeo', name: 'Vimeo Video', color: '#1AB7EA', url: '/presets/vimeo.avif' }
];

export const ALL_TEXTURES = [
  { slug: 'facebook', name: 'Facebook Texture', color: '#1877F2', url: '/textures/facebook_texture.webp' },
  { slug: 'whatsapp', name: 'WhatsApp Texture', color: '#25D366', url: '/textures/whatsapp_texture.webp' },
  { slug: 'instagram', name: 'Instagram Gradient Texture', color: '#E4405F', url: '/textures/instagram_texture.webp' },
  { slug: 'youtube', name: 'YouTube Video Texture', color: '#FF0000', url: '/textures/youtube_texture.webp' },
  { slug: 'tiktok', name: 'TikTok Dark Texture', color: '#000000', url: '/textures/tiktok_texture.webp' },
  { slug: 'snapchat', name: 'Snapchat Yellow Texture', color: '#FFFC00', url: '/textures/snapchat_texture.webp' },
  { slug: 'twitter', name: 'Twitter / X Texture', color: '#1DA1F2', url: '/textures/twitter_texture.webp' },
  { slug: 'telegram', name: 'Telegram Blue Texture', color: '#0088CC', url: '/textures/telegram_texture.webp' },
  { slug: 'spotify', name: 'Spotify Wave Texture', color: '#1DB954', url: '/textures/spotify_texture.webp' },
  { slug: 'custom_upload', name: 'Custom Photo Texture Upload', color: '#8B5CF6', isUpload: true, desc: 'Upload custom image pattern' }
];

export const ALL_COLOR_TOOLS = [
  { 
    id: 'qr_color_presets', 
    name: 'Color Presets Gallery', 
    desc: 'Pre-designed solid & gradient multi-color theme swatch gallery',
    category: 'Color Tools',
    icon: Bookmark,
    defaultPlan: 'free'
  },
  { 
    id: 'qr_color_dots', 
    name: 'Dots Custom Color Tool', 
    desc: 'Fine-tune custom solid hex/RGB colors and dual gradients for dot modules',
    category: 'Color Tools',
    icon: Grid,
    defaultPlan: 'free'
  },
  { 
    id: 'qr_color_eyes', 
    name: 'Eyes Color Customizer', 
    desc: 'Independent color pickers for corner finder outer frame & inner pupil',
    category: 'Color Tools',
    icon: Eye,
    defaultPlan: 'free'
  },
  { 
    id: 'qr_color_bg', 
    name: 'Background Color & Transparency', 
    desc: 'Custom canvas background color picker and transparent background toggle',
    category: 'Color Tools',
    icon: Palette,
    defaultPlan: 'free'
  },
  { 
    id: 'qr_color_bg_image', 
    name: 'Background Photo & Texture Canvas', 
    desc: 'Upload custom background images, overlay dimming slider & contrast container',
    category: 'Color Tools',
    icon: Image,
    defaultPlan: 'weekly'
  }
];

export const ALL_COLOR_THEME_PRESETS = [
  { id: 'classic', name: 'Classic B&W', qr: '#000000', bg: '#FFFFFF', desc: 'Standard high-contrast' },
  { id: 'ocean', name: 'Ocean Blue', qr: '#0055ff', bg: '#eef4ff', desc: 'Calm electric ocean hue' },
  { id: 'forest', name: 'Forest Green', qr: '#008844', bg: '#f0fff4', desc: 'Fresh organic green' },
  { id: 'sunset', name: 'Sunset Orange', qr: '#ff4400', bg: '#fff5f0', desc: 'Warm glowing sunset' },
  { id: 'purple', name: 'Royal Purple', qr: '#8800cc', bg: '#faf0ff', desc: 'Vibrant majesty purple' },
  { id: 'dark', name: 'Dark Cyberpunk', qr: '#00ffff', bg: '#111122', desc: 'Neon cyan on dark navy' },
  { id: 'monochrome', name: 'Monochrome Inverted', qr: '#ffffff', bg: '#000000', desc: 'White matrix on black' },
  { id: 'cyberpunk', name: 'Cyberpunk Yellow', qr: '#ffff00', bg: '#110022', desc: 'Neon yellow on deep purple' },
  { id: 'crimson', name: 'Crimson Passion', qr: '#D60036', bg: '#fff0f3', desc: 'Passionate brand crimson' },
  { id: 'emerald', name: 'Emerald Mint', qr: '#10B981', bg: '#ECFDF5', desc: 'Vibrant clean emerald' }
];

export const ALL_LOGO_CONTROLS = [
  { id: 'custom_logo_upload', name: 'Custom Brand Logo Upload', desc: 'Upload personal image/photo logo inside QR center', icon: UploadCloud, defaultPlan: 'weekly' },
  { id: 'custom_logo_presets', name: 'Brand Logo Presets Gallery', desc: 'Pre-installed library of 40+ social, fintech & tech brand logos', icon: Image, defaultPlan: 'free' },
  { id: 'qr_logo_bg_remover', name: 'AI Logo Background Remover & Crop', desc: 'Remove image backgrounds and custom crop logos', icon: Eraser, defaultPlan: 'weekly' },
  { id: 'qr_logo_stroke_shadow', name: 'Logo Stroke, Shadow & Card', desc: 'Custom outline borders, badge card backings & drop shadows', icon: Paintbrush, defaultPlan: 'free' }
];

export const ALL_TEXT_CONTROLS = [
  { id: 'qr_center_text', name: 'Center Text Watermark Embed', desc: 'Custom text banner embedded directly inside the QR code center', icon: Type, defaultPlan: 'weekly' },
  { id: 'qr_text_frame', name: 'CTA Frame Text (Top / Bottom)', desc: 'Call to action text rendered inside the frame badge header/footer', icon: LayoutGrid, defaultPlan: 'free' },
  { id: 'qr_custom_font_upload', name: 'Custom TTF / OTF Font Upload', desc: 'Upload proprietary brand font files directly to QR matrix', icon: UploadCloud, defaultPlan: 'weekly' },
  { id: 'qr_text_styling', name: 'Text Colors, Stroke & Drop Shadow', desc: 'Fine-tune typography colors, outlines, glow and drop shadows', icon: Palette, defaultPlan: 'free' }
];

export const ALL_EXPORT_FORMATS = [
  { id: 'export_png', name: 'PNG Image Export', desc: 'Download high-res PNG image', defaultPlan: 'free' },
  { id: 'export_jpg', name: 'JPG Image Export', desc: 'Download compressed JPG image', defaultPlan: 'free' },
  { id: 'export_svg', name: 'SVG Vector Export', desc: 'Download scalable SVG vector file', defaultPlan: 'weekly' },
  { id: 'export_pdf', name: 'PDF Document Export', desc: 'Download print-ready A4 PDF', defaultPlan: 'weekly' }
];

export const ALL_EXPORT_QUALITIES = [
  { id: 'export_quality_low', name: 'Quality: Low (512px)', desc: 'Export standard low resolution (512px)', defaultPlan: 'free' },
  { id: 'export_quality_medium', name: 'Quality: Normal (1024px)', desc: 'Export normal resolution (1024px)', defaultPlan: 'free' },
  { id: 'export_quality_hd', name: 'Quality: HD (2048px)', desc: 'Export crisp HD resolution (2048px)', defaultPlan: 'weekly' },
  { id: 'export_quality_ultra', name: 'Quality: 4K Ultra (4096px)', desc: 'Export ultra 4K resolution (4096px)', defaultPlan: 'weekly' },
  { id: 'export_native_share', name: 'Native OS Share Sheet', desc: 'Share file directly to social apps', defaultPlan: 'free' }
];

export const ALL_GRADIENTS = [
  { id: 'sunset_glow', name: 'Sunset Glow', from: '#FF512F', to: '#DD2476' },
  { id: 'ocean_breeze', name: 'Ocean Breeze', from: '#00c6ff', to: '#0072ff' },
  { id: 'neon_violet', name: 'Neon Violet', from: '#7F00FF', to: '#E100FF' },
  { id: 'lush_emerald', name: 'Lush Emerald', from: '#11998e', to: '#38ef7d' },
  { id: 'midnight_gold', name: 'Midnight Gold', from: '#F59E0B', to: '#D97706' },
  { id: 'cyberpunk_aqua', name: 'Cyberpunk Aqua', from: '#00F0FF', to: '#7000FF' },
  { id: 'fire_phoenix', name: 'Fire Phoenix', from: '#f12711', to: '#f5af19' },
  { id: 'royal_amethyst', name: 'Royal Amethyst', from: '#654ea3', to: '#eaafc8' },
  { id: 'deep_space', name: 'Deep Space', from: '#000428', to: '#004e92' },
  { id: 'sweet_candy', name: 'Sweet Candy', from: '#FF007F', to: '#7928CA' },
  { id: 'electric_blue', name: 'Electric Blue', from: '#4facfe', to: '#00f2fe' },
  { id: 'citrus_lime', name: 'Citrus Lime', from: '#0ba360', to: '#3cba92' }
];

export const ALL_BG_SHAPES = [
  { id: 'solid', name: 'Solid Rectangle Card', desc: 'Standard rectangular card backing' },
  { id: 'rounded', name: 'Rounded Card', desc: 'Smooth curved card backing' },
  { id: 'circle', name: 'Circular Shield Badge', desc: 'Concentric circular backing' },
  { id: 'pill', name: 'Horizontal Pill Capsule', desc: 'Capsule shaped backing' },
  { id: 'ribbon', name: 'Banner Ribbon Card', desc: 'Flagged decorative banner' },
  { id: 'glow', name: 'Ambient Radiant Glow', desc: 'Soft neon blur shadow backing' },
  { id: 'hexagon', name: 'Cyber Hexagon Badge', desc: '6-sided polygon backing' },
  { id: 'brackets', name: 'Camera Focus Brackets', desc: 'Camera lens corner framing' }
];

export const ALL_FONTS = [
  { id: 'Outfit', name: 'Outfit', category: 'Geometric Sans' },
  { id: 'Inter', name: 'Inter', category: 'Clean Sans' },
  { id: 'Montserrat', name: 'Montserrat', category: 'Modern Sans' },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'Luxury Serif' },
  { id: 'Oswald', name: 'Oswald', category: 'Condensed Display' },
  { id: 'Pacifico', name: 'Pacifico', category: 'Casual Script' },
  { id: 'Caveat', name: 'Caveat', category: 'Handwritten' },
  { id: 'Dancing Script', name: 'Dancing Script', category: 'Formal Script' },
  { id: 'Bebas Neue', name: 'Bebas Neue', category: 'Bold Impact' },
  { id: 'Lobster', name: 'Lobster', category: 'Retro Display' },
  { id: 'Roboto', name: 'Roboto', category: 'Standard Sans' },
  { id: 'Open Sans', name: 'Open Sans', category: 'Universal Sans' },
  { id: 'Lato', name: 'Lato', category: 'Warm Sans' },
  { id: 'Poppins', name: 'Poppins', category: 'Geometric Sans' },
  { id: 'Raleway', name: 'Raleway', category: 'Elegant Sans' },
  { id: 'Merriweather', name: 'Merriweather', category: 'Editorial Serif' },
  { id: 'Noto Sans', name: 'Noto Sans', category: 'Global Sans' },
  { id: 'Ubuntu', name: 'Ubuntu', category: 'Modern Tech' },
  { id: 'Anton', name: 'Anton', category: 'Heavy Display' },
  { id: 'Permanent Marker', name: 'Permanent Marker', category: 'Graffiti Street' },
  { id: 'Righteous', name: 'Righteous', category: 'Cyber Sci-Fi' },
  { id: 'Cinzel', name: 'Cinzel', category: 'Classic Roman' },
  { id: 'Courgette', name: 'Courgette', category: 'Italic Script' },
  { id: 'Fredoka One', name: 'Fredoka One', category: 'Playful Chunky' },
  { id: 'Great Vibes', name: 'Great Vibes', category: 'Wedding Calligraphy' },
  { id: 'Kanit', name: 'Kanit', category: 'Modern Geometric' },
  { id: 'Luckiest Guy', name: 'Luckiest Guy', category: 'Cartoon Bubble' },
  { id: 'Orbitron', name: 'Orbitron', category: 'Futuristic Sci-Fi' },
  { id: 'Quicksand', name: 'Quicksand', category: 'Soft Rounded' },
  { id: 'Satisfy', name: 'Satisfy', category: 'Signature Script' }
];

export const ALL_FRAMES = [
  { id: 'none', name: 'No Outer Frame', desc: 'Raw borderless QR matrix' },
  { id: 'solid', name: 'Solid Border Card', desc: 'Crisp bounding box card' },
  { id: 'rounded', name: 'Rounded Shield Frame', desc: 'Curved corners container' },
  { id: 'pill', name: 'Bottom "SCAN ME" Pill', desc: 'Modern high-conversion CTA pill' },
  { id: 'outline', name: 'Neon Outline Frame', desc: 'Glow outline frame' },
  { id: 'underline', name: 'Bottom Ribbon Banner', desc: 'Lower text ribbon banner' },
  { id: 'ribbon', name: 'Badge Stamp Ribbon', desc: 'Diagonal corner ribbon' },
  { id: 'glow', name: 'Ambient Neon Glow', desc: 'Radiant shadow glow' },
  { id: 'brackets', name: 'Camera Focus Brackets', desc: 'Lens finder corners' },
  { id: 'hexagon', name: 'Cyber Hexagon Badge', desc: '6-sided geometric frame' },
  { id: 'dots', name: 'Perforated Dot Border', desc: 'Ticket stamp border' },
  { id: 'stamp', name: 'Official Verified Stamp', desc: 'Seal stamp backing' }
];

export const ALL_TEMPLATES = QR_TEMPLATES;

function getSampleMatrixDirect() {
  try {
    const qr = qrcode(0, 'H');
    qr.addData('https://mushiqr.pro');
    qr.make();
    const count = qr.getModuleCount();
    const matrix = [];
    for (let r = 0; r < count; r++) {
      matrix[r] = [];
      for (let c = 0; c < count; c++) {
        matrix[r][c] = qr.isDark(r, c);
      }
    }
    return { matrix, moduleCount: count };
  } catch {
    return null;
  }
}

function TemplatePreviewCanvas({ template }) {
  const canvasRef = useRef(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('qr-template-loaded', handler);
    return () => window.removeEventListener('qr-template-loaded', handler);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !template) return;
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const w = 480;
      const h = template.heightRatio ? Math.round(w * template.heightRatio) : Math.round(w * 1.25);
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, w, h);

      // 1. Draw template background
      if (template.drawBackground) {
        template.drawBackground(ctx, w, h);
      }

      // 2. Draw real custom QR code inside placeholder slot
      ctx.save();
      const tplQrSize = w * (template.qrSize || 0.44);
      const tplQrX = w * (template.qrX || 0.5) - tplQrSize / 2;
      const tplQrY = h * (template.qrY || 0.54) - tplQrSize / 2;

      const activeMatrixInfo = generateQRMatrix('https://mushiqr.pro') || getSampleMatrixDirect();

      if (activeMatrixInfo) {
        const qrTempCanvas = document.createElement('canvas');
        qrTempCanvas.width = 512;
        qrTempCanvas.height = 512;

        const optionsForQR = {
          ...activeMatrixInfo,
          size: 512,
          qrColor: template.preset?.qrColor || '#000000',
          bgColor: template.preset?.bgColor || '#FFFFFF',
          bgTransparent: template.preset?.bgTransparent ?? false,
          qrBgShape: 'full',
          dotStyle: template.preset?.dotStyle || 'rounded',
          eyeStyle: template.preset?.eyeStyle || 'rounded',
          eyeColor: template.preset?.eyeColor || '',
          eyeOuterColor: template.preset?.eyeOuterColor || '',
          syncEyes: true,
          quietZone: 2,
        };

        renderQR(qrTempCanvas, optionsForQR);
        ctx.drawImage(qrTempCanvas, tplQrX, tplQrY, tplQrSize, tplQrSize);
      }
      ctx.restore();

      // 3. Draw template foreground overlay
      if (template.drawForeground) {
        template.drawForeground(ctx, w, h);
      }
    } catch (err) {
      console.warn('[TemplatePreviewCanvas] Render error for template:', template?.id, err);
    }
  }, [template, tick]);

  return (
    <div style={{
      width: '100%',
      aspectRatio: template.heightRatio ? `1 / ${template.heightRatio}` : '1 / 1.25',
      borderRadius: 10,
      overflow: 'hidden',
      background: '#0d1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </div>
  );
}

// ─── MINI CANVAS RENDERERS ──────────────────────────────────────────────────

function MiniDotCanvas({ dotStyle, color = '#D60036' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 64;
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // 5x5 grid preview with center eye
    const gridCount = 5;
    const padding = 2;
    const availableSize = size - padding * 2;
    const cellSize = availableSize / gridCount;

    const matrix = [
      [1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1]
    ];

    ctx.fillStyle = color;

    for (let r = 0; r < gridCount; r++) {
      for (let c = 0; c < gridCount; c++) {
        if (!matrix[r][c]) continue;
        const x = padding + c * cellSize;
        const y = padding + r * cellSize;
        const neighbors = {
          top: r > 0 && !!matrix[r - 1][c],
          bottom: r < gridCount - 1 && !!matrix[r + 1][c],
          left: c > 0 && !!matrix[r][c - 1],
          right: c < gridCount - 1 && !!matrix[r][c + 1]
        };
        try {
          drawDotModule(ctx, x, y, cellSize, dotStyle, neighbors, {}, r, c);
        } catch {
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }
  }, [dotStyle, color]);

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      style={{
        width: 38,
        height: 38,
        borderRadius: 8,
        border: '1px solid var(--ad-border)',
        display: 'block',
        flexShrink: 0
      }}
    />
  );
}

function MiniEyeCanvas({ eyeStyle, color = '#D60036' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 64;
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    const padding = 3;
    const eyeSize = size - padding * 2;
    try {
      drawEye(ctx, padding, padding, eyeSize, eyeStyle, color, color);
    } catch {
      ctx.fillStyle = color;
      ctx.fillRect(padding, padding, eyeSize, eyeSize);
    }
  }, [eyeStyle, color]);

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      style={{
        width: 38,
        height: 38,
        borderRadius: 8,
        border: '1px solid var(--ad-border)',
        display: 'block',
        flexShrink: 0
      }}
    />
  );
}

// ─── ICON MAPPINGS FOR 18 CONTENT FORMATS ──────────────────────────────────
const QR_CONTENT_FORMAT_ICONS = {
  qr_text: FileText,
  qr_url: Globe,
  qr_wifi: Wifi,
  qr_email: Mail,
  qr_phone: Phone,
  qr_sms: MessageSquare,
  qr_vcard: User,
  qr_location: MapPin,
  qr_pdf: FileText,
  qr_image: Image,
  qr_audio: Music,
  qr_document: FileSpreadsheet,
  qr_event: Calendar,
  qr_crypto: DollarSign,
  qr_whatsapp: MessageCircle,
  qr_youtube: Video,
  qr_instagram: Image,
  qr_facebook: Globe,
  qr_x: Send,
  qr_linkedin: AtSign,
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function VisualQRControlStudio({ currentUser, isDark = false }) {
  const [liveFlagsMap, setLiveFlagsMap] = useState({});
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [updatingKey, setUpdatingKey] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Real-time Firestore sync
  useEffect(() => {
    setLoading(true);
    const unsubGlobal = onSnapshot(doc(db, 'global_config', 'featureFlags'), snap => {
      if (snap.exists()) setLiveFlagsMap(snap.data() || {});
      setLoading(false);
    }, () => setLoading(false));

    const unsubPlans = onSnapshot(collection(db, 'subscription_plans'), colSnap => {
      const plans = {};
      colSnap.forEach(d => { plans[d.id] = d.data(); });
      setLivePlans(plans);
    }, () => {});

    return () => {
      unsubGlobal?.();
      unsubPlans?.();
    };
  }, []);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const getItemState = (key, defaultEnabled = true, defaultPlan = 'free') => {
    const enabled = liveFlagsMap[key] !== undefined ? Boolean(liveFlagsMap[key]) : defaultEnabled;
    let isPaid = false;
    if (Array.isArray(livePlans.free?.features)) {
      isPaid = !livePlans.free.features.includes(key);
    } else {
      isPaid = defaultPlan !== 'free';
    }
    return { enabled, isPaid };
  };

  const handleToggleEnable = async (key, name, subcategory = 'Presets') => {
    setUpdatingKey(key);
    const current = getItemState(key).enabled;
    const nextState = !current;
    try {
      await setFeatureFlagCloud(key, nextState, { name, category: 'QR_GENERATOR', subcategory });
      setLiveFlagsMap(prev => ({ ...prev, [key]: nextState }));
      showToast(`${name} is now ${nextState ? '🟢 ENABLED (Visible)' : '🔴 DISABLED (Hidden)'}`);
    } catch (e) {
      showToast('❌ Update failed');
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleToggleTier = async (key, name) => {
    setUpdatingKey(key);
    const currentPaid = getItemState(key).isPaid;
    const nextTier = currentPaid ? 'free' : 'paid';
    try {
      await setFeaturesTierBatchCloud([key], nextTier);
      showToast(`${name} is now ${nextTier === 'free' ? '🛡️ 100% FREE' : '👑 PAID PRO'}`);
    } catch (e) {
      showToast('❌ Tier update failed');
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleBatchActiveTabTier = async (targetTier, keysList) => {
    setBulkProcessing(true);
    try {
      await setFeaturesTierBatchCloud(keysList, targetTier);
      showToast(`✨ ${keysList.length} items set to ${targetTier === 'free' ? 'FREE' : 'PRO'}`);
    } catch (e) {
      showToast('❌ Batch tier update failed');
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBatchActiveTabEnable = async (enable, itemsList, subcategory) => {
    setBulkProcessing(true);
    try {
      const updates = {};
      for (const item of itemsList) {
        updates[item.key] = Boolean(enable);
      }
      await setFeatureFlagsBatchCloud(updates, { category: 'QR_GENERATOR', subcategory });
      setLiveFlagsMap(prev => ({ ...prev, ...updates }));
      showToast(`✨ ${itemsList.length} items ${enable ? 'ENABLED' : 'DISABLED'}`);
    } catch (e) {
      showToast('❌ Batch update failed');
    } finally {
      setBulkProcessing(false);
    }
  };

  const canonicalQRFeatures = useMemo(() => {
    const raw = FEATURE_REGISTRY.filter(f => f.category === 'QR_GENERATOR');
    return raw.map(f => {
      const st = getItemState(f.featureId, f.defaultEnabled, f.defaultPlan);
      return { ...f, key: f.featureId, name: f.displayName, ...st };
    });
  }, [liveFlagsMap, livePlans]);

  // 7 Main Navbar Sub-Navigation Tabs
  const TABS = [
    { id: 'content', label: '1. Content', count: 18, icon: QrCode },
    { id: 'color', label: '2. Color', count: ALL_COLOR_TOOLS.length + ALL_COLOR_THEME_PRESETS.length + ALL_TEXTURES.length, icon: Palette },
    { id: 'style', label: '3. Style', count: ALL_DOT_STYLES.length + ALL_EYE_STYLES.length + ALL_BG_SHAPES.length + ALL_GRADIENTS.length, icon: Grid },
    { id: 'logo', label: '4. Logo', count: ALL_LOGO_CONTROLS.length + ALL_LOGO_PRESETS.length, icon: Image },
    { id: 'template', label: '5. Template', count: ALL_TEMPLATES.length + ALL_FRAMES.length, icon: Sparkles },
    { id: 'text', label: '6. Text', count: ALL_TEXT_CONTROLS.length + ALL_FONTS.length, icon: Type },
    { id: 'export', label: '7. Save & Export', count: ALL_EXPORT_FORMATS.length + ALL_EXPORT_QUALITIES.length, icon: Download }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Feedback Toast */}
      {feedbackToast && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(15, 18, 33, 0.96)', border: '1.5px solid #FF4D9D',
          borderRadius: 100, padding: '8px 18px', color: '#fff',
          fontSize: 12, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 999999, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
        }}>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Studio Header (Mobile-First UX) ──────────────────────────────────── */}
      <div style={{
        background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
        borderRadius: 16, padding: '14px', boxShadow: 'var(--ad-card-shadow)',
        display: 'flex', flexDirection: 'column', gap: 12
      }}>
        {/* Top: Icon + Title + Status Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(214, 0, 54, 0.18) 0%, rgba(255, 77, 157, 0.15) 100%)',
            border: '1.5px solid rgba(214, 0, 54, 0.4)', color: '#D60036',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(214, 0, 54, 0.15)'
          }}>
            <QrCode size={22} strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: 'var(--ad-text)', margin: 0, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                QR Generator Studio
              </h1>
              <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 100, background: 'rgba(214, 0, 54, 0.15)', color: '#D60036' }}>
                Live Assets
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--ad-text-sec)', margin: '3px 0 0', fontWeight: 500, lineHeight: 1.3 }}>
              Granular Free/Pro controls for all 18 formats, 37 dot shapes, 35 eyes, textures, gradients, shapes, logos, fonts &amp; templates.
            </p>
          </div>
        </div>

        {/* Search Bar (100% Full Width on Mobile) */}
        <div style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--ad-text-sec)' }} />
          <input
            type="text"
            placeholder="Search shapes, eyes, textures, logos, fonts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
              borderRadius: 9, padding: '8px 30px 8px 30px', color: 'var(--ad-text)',
              fontSize: 11.5, fontWeight: 600, outline: 'none', height: 36
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', color: 'var(--ad-text-sec)', cursor: 'pointer', padding: 2 }}>
              <XCircle size={14} />
            </button>
          )}
        </div>

        {/* Carousel Navigation Tabs (Touch Friendly Mobile Pills) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto',
          paddingBottom: 2, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch'
        }}>
          {TABS.map(t => {
            const isActive = activeTab === t.id;
            const IconC = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px',
                  borderRadius: 10, border: `1.5px solid ${isActive ? '#FF4D9D' : 'var(--ad-border)'}`,
                  background: isActive ? 'rgba(255, 77, 157, 0.14)' : 'var(--ad-input)',
                  color: isActive ? '#FF4D9D' : 'var(--ad-text-sec)',
                  fontSize: 11, fontWeight: isActive ? 800 : 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s ease'
                }}
              >
                <IconC size={13} />
                <span>{t.label}</span>
                <span style={{
                  fontSize: 9, padding: '1px 5px', borderRadius: 6,
                  background: isActive ? '#FF4D9D' : 'var(--ad-card)',
                  color: isActive ? '#fff' : 'var(--ad-text-sec)', fontWeight: 800
                }}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: CONTENT (Content Formats Toolbar) ─────────────────────────── */}
      {activeTab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCatalog
            title="18 Main App QR Content Formats"
            subtitle="The 18 content format cards shown to users on the creation screen."
            icon={QrCode}
            onMakeFree={() => handleBatchActiveTabTier('free', canonicalQRFeatures.filter(f => f.subcategory === 'Content' && f.key !== 'qr_tab_content').map(f => f.key))}
            onMakePro={() => handleBatchActiveTabTier('paid', canonicalQRFeatures.filter(f => f.subcategory === 'Content' && f.key !== 'qr_tab_content').map(f => f.key))}
            onEnableAll={() => handleBatchActiveTabEnable(true, canonicalQRFeatures.filter(f => f.subcategory === 'Content' && f.key !== 'qr_tab_content'), 'Content Formats')}
            onDisableAll={() => handleBatchActiveTabEnable(false, canonicalQRFeatures.filter(f => f.subcategory === 'Content' && f.key !== 'qr_tab_content'), 'Content Formats')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 10 }}>
              {canonicalQRFeatures
                .filter(f => f.subcategory === 'Content' && f.key !== 'qr_tab_content' && (!searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())))
                .map(feature => {
                  const FormatIcon = QR_CONTENT_FORMAT_ICONS[feature.key] || FileText;
                  return (
                    <ItemControlTile
                      key={feature.key}
                      name={feature.name}
                      desc={feature.description}
                      enabled={feature.enabled}
                      isPaid={feature.isPaid}
                      icon={FormatIcon}
                      updating={updatingKey === feature.key}
                      onToggleEnable={() => handleToggleEnable(feature.key, feature.name, 'Content Formats')}
                      onToggleTier={() => handleToggleTier(feature.key, feature.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>
        </div>
      )}

      {/* ── TAB 2: COLOR (Presets, Dots, Eyes, BG Color, BG Image, Texture) ───── */}
      {activeTab === 'color' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Subcategory 1: Presets Toolbar */}
          <SectionCatalog
            title="Presets: 10 Solid Theme Presets (Live Dual Swatches)"
            subtitle="Pre-designed color palette swatches and presets gallery access."
            icon={Bookmark}
            onMakeFree={() => handleBatchActiveTabTier('free', ['qr_color_presets', ...ALL_COLOR_THEME_PRESETS.map(p => `qr_color_preset_${p.id}`)])}
            onMakePro={() => handleBatchActiveTabTier('paid', ['qr_color_presets', ...ALL_COLOR_THEME_PRESETS.map(p => `qr_color_preset_${p.id}`)])}
            onEnableAll={() => handleBatchActiveTabEnable(true, [{ key: 'qr_color_presets', name: 'Color Presets Gallery' }, ...ALL_COLOR_THEME_PRESETS.map(p => ({ key: `qr_color_preset_${p.id}`, name: p.name }))], 'Presets')}
            onDisableAll={() => handleBatchActiveTabEnable(false, [{ key: 'qr_color_presets', name: 'Color Presets Gallery' }, ...ALL_COLOR_THEME_PRESETS.map(p => ({ key: `qr_color_preset_${p.id}`, name: p.name }))], 'Presets')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {(() => {
                const state = getItemState('qr_color_presets', true, 'free');
                return (
                  <ItemControlTile
                    key="qr_color_presets"
                    name="Color Presets Gallery"
                    desc="Master toolbar preset gallery tool"
                    badge="qr_color_presets"
                    customPreview={
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: state.isPaid ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)', border: `1.5px solid ${state.isPaid ? '#F59E0B' : '#10B981'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: state.isPaid ? '#F59E0B' : '#10B981' }}>
                        <Bookmark size={20} />
                      </div>
                    }
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Bookmark}
                    updating={updatingKey === 'qr_color_presets'}
                    onToggleEnable={() => handleToggleEnable('qr_color_presets', 'Color Presets Gallery', 'Presets')}
                    onToggleTier={() => handleToggleTier('qr_color_presets', 'Color Presets Gallery')}
                  />
                );
              })()}
              {ALL_COLOR_THEME_PRESETS
                .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery.toLowerCase()))
                .map(preset => {
                  const key = `qr_color_preset_${preset.id}`;
                  const state = getItemState(key, true, preset.id === 'classic' || preset.id === 'ocean' ? 'free' : 'weekly');
                  return (
                    <ItemControlTile
                      key={key}
                      name={preset.name}
                      desc={preset.desc}
                      badge={preset.id}
                      customPreview={
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: preset.bg, border: '1.5px solid var(--ad-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', flexShrink: 0 }}>
                          <div style={{ width: 18, height: 18, borderRadius: 4, background: preset.qr }} />
                        </div>
                      }
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Bookmark}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, preset.name, 'Presets')}
                      onToggleTier={() => handleToggleTier(key, preset.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>

          {/* Subcategory 2: Dots Color Toolbar */}
          <SectionCatalog
            title="Dots: Custom Color & Gradients"
            subtitle="Control solid hex color pickers and dual gradient fills for QR dots."
            icon={Grid}
            onMakeFree={() => handleBatchActiveTabTier('free', ['qr_color_dots', 'custom_colors_solid', 'custom_colors_gradient'])}
            onMakePro={() => handleBatchActiveTabTier('paid', ['qr_color_dots', 'custom_colors_solid', 'custom_colors_gradient'])}
            onEnableAll={() => handleBatchActiveTabEnable(true, [
              { key: 'qr_color_dots', name: 'Dots Color Tool' },
              { key: 'custom_colors_solid', name: 'Solid Color Pickers' },
              { key: 'custom_colors_gradient', name: 'Dual Gradient Color Fills' }
            ], 'Dots Color')}
            onDisableAll={() => handleBatchActiveTabEnable(false, [
              { key: 'qr_color_dots', name: 'Dots Color Tool' },
              { key: 'custom_colors_solid', name: 'Solid Color Pickers' },
              { key: 'custom_colors_gradient', name: 'Dual Gradient Color Fills' }
            ], 'Dots Color')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {[
                { key: 'qr_color_dots', name: 'Dots Color Tool Master', desc: 'Toolbar button for dot module color customization', defaultPlan: 'free', icon: Grid },
                { key: 'custom_colors_solid', name: 'Solid Color Pickers (RGB/HSB)', desc: 'Advanced RGB/HSB/Hex solid color pickers', defaultPlan: 'free', icon: Palette },
                { key: 'custom_colors_gradient', name: 'Dual Gradient Color Fills', desc: 'Linear & radial gradient QR color fills', defaultPlan: 'weekly', icon: Wand2 }
              ].map(item => {
                const state = getItemState(item.key, true, item.defaultPlan);
                const Icon = item.icon;
                return (
                  <ItemControlTile
                    key={item.key}
                    name={item.name}
                    desc={item.desc}
                    badge={item.key}
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Icon}
                    updating={updatingKey === item.key}
                    onToggleEnable={() => handleToggleEnable(item.key, item.name, 'Dots Color')}
                    onToggleTier={() => handleToggleTier(item.key, item.name)}
                  />
                );
              })}
            </div>
          </SectionCatalog>

          {/* Subcategory 3: Eyes Color Toolbar */}
          <SectionCatalog
            title="Eyes: Independent Color Customizer"
            subtitle="Independent color tuning for finder corner eye frame & inner pupil."
            icon={Eye}
            onMakeFree={() => handleBatchActiveTabTier('free', ['qr_color_eyes', 'qr_color_eyes_custom'])}
            onMakePro={() => handleBatchActiveTabTier('paid', ['qr_color_eyes', 'qr_color_eyes_custom'])}
            onEnableAll={() => handleBatchActiveTabEnable(true, [{ key: 'qr_color_eyes', name: 'Eyes Color Tool' }, { key: 'qr_color_eyes_custom', name: 'Custom Eye Finder Colors' }], 'Eyes Color')}
            onDisableAll={() => handleBatchActiveTabEnable(false, [{ key: 'qr_color_eyes', name: 'Eyes Color Tool' }, { key: 'qr_color_eyes_custom', name: 'Custom Eye Finder Colors' }], 'Eyes Color')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {[
                { key: 'qr_color_eyes', name: 'Eyes Color Tool Master', desc: 'Toolbar button for eye color tuning', defaultPlan: 'free' },
                { key: 'qr_color_eyes_custom', name: 'Independent Inner & Outer Colors', desc: 'Dual pickers for eye outer frame & inner pupil', defaultPlan: 'free' }
              ].map(item => {
                const state = getItemState(item.key, true, item.defaultPlan);
                return (
                  <ItemControlTile
                    key={item.key}
                    name={item.name}
                    desc={item.desc}
                    badge={item.key}
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Eye}
                    updating={updatingKey === item.key}
                    onToggleEnable={() => handleToggleEnable(item.key, item.name, 'Eyes Color')}
                    onToggleTier={() => handleToggleTier(item.key, item.name)}
                  />
                );
              })}
            </div>
          </SectionCatalog>

          {/* Subcategory 4: BG Color Toolbar */}
          <SectionCatalog
            title="BG Color: Background Color & Transparency"
            subtitle="Canvas background color pickers and transparent background mode."
            icon={Palette}
            onMakeFree={() => handleBatchActiveTabTier('free', ['qr_color_bg'])}
            onMakePro={() => handleBatchActiveTabTier('paid', ['qr_color_bg'])}
            onEnableAll={() => handleBatchActiveTabEnable(true, [{ key: 'qr_color_bg', name: 'Background Color & Transparency' }], 'BG Color')}
            onDisableAll={() => handleBatchActiveTabEnable(false, [{ key: 'qr_color_bg', name: 'Background Color & Transparency' }], 'BG Color')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {(() => {
                const state = getItemState('qr_color_bg', true, 'free');
                return (
                  <ItemControlTile
                    key="qr_color_bg"
                    name="Background Color & Transparency"
                    desc="Canvas background solid color picker and transparent canvas toggle"
                    badge="qr_color_bg"
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Palette}
                    updating={updatingKey === 'qr_color_bg'}
                    onToggleEnable={() => handleToggleEnable('qr_color_bg', 'Background Color & Transparency', 'BG Color')}
                    onToggleTier={() => handleToggleTier('qr_color_bg', 'Background Color & Transparency')}
                  />
                );
              })()}
            </div>
          </SectionCatalog>

          {/* Subcategory 5: BG Image Toolbar */}
          <SectionCatalog
            title="BG Image: Background Photo & Dimming Overlay"
            subtitle="Custom background photo upload, scannability dimming slider & contrast card."
            icon={Image}
            onMakeFree={() => handleBatchActiveTabTier('free', ['qr_color_bg_image'])}
            onMakePro={() => handleBatchActiveTabTier('paid', ['qr_color_bg_image'])}
            onEnableAll={() => handleBatchActiveTabEnable(true, [{ key: 'qr_color_bg_image', name: 'Background Image & Overlay' }], 'BG Image')}
            onDisableAll={() => handleBatchActiveTabEnable(false, [{ key: 'qr_color_bg_image', name: 'Background Image & Overlay' }], 'BG Image')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {(() => {
                const state = getItemState('qr_color_bg_image', true, 'weekly');
                return (
                  <ItemControlTile
                    key="qr_color_bg_image"
                    name="Background Image & Overlay"
                    desc="Custom canvas background photo upload, dimming opacity slider & contrast container"
                    badge="qr_color_bg_image"
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Image}
                    updating={updatingKey === 'qr_color_bg_image'}
                    onToggleEnable={() => handleToggleEnable('qr_color_bg_image', 'Background Image & Overlay', 'BG Image')}
                    onToggleTier={() => handleToggleTier('qr_color_bg_image', 'Background Image & Overlay')}
                  />
                );
              })()}
            </div>
          </SectionCatalog>

          {/* Subcategory 6: Texture Toolbar */}
          <SectionCatalog
            title="Texture: 10 Social & Pattern Textures"
            subtitle="WhatsApp, Instagram, TikTok, YouTube, Spotify textures, plus custom texture uploads."
            icon={Brush}
            onMakeFree={() => handleBatchActiveTabTier('free', ['qr_color_texture', ...ALL_TEXTURES.map(t => `qr_texture_${t.slug}`)])}
            onMakePro={() => handleBatchActiveTabTier('paid', ['qr_color_texture', ...ALL_TEXTURES.map(t => `qr_texture_${t.slug}`)])}
            onEnableAll={() => handleBatchActiveTabEnable(true, [{ key: 'qr_color_texture', name: 'Texture Tool Master' }, ...ALL_TEXTURES.map(t => ({ key: `qr_texture_${t.slug}`, name: t.name }))], 'Texture')}
            onDisableAll={() => handleBatchActiveTabEnable(false, [{ key: 'qr_color_texture', name: 'Texture Tool Master' }, ...ALL_TEXTURES.map(t => ({ key: `qr_texture_${t.slug}`, name: t.name }))], 'Texture')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {ALL_TEXTURES
                .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(tex => {
                  const key = `qr_texture_${tex.slug}`;
                  const state = getItemState(key, true, 'weekly');
                  return (
                    <ItemControlTile
                      key={key}
                      name={tex.name}
                      desc={tex.desc || 'Social texture overlay'}
                      imageUrl={tex.url}
                      badge={tex.slug}
                      color={tex.color}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={tex.isUpload ? UploadCloud : Brush}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, tex.name, 'Texture')}
                      onToggleTier={() => handleToggleTier(key, tex.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>
        </div>
      )}

      {/* ── TAB 3: STYLE (Dots, Eyes, Background Shapes, Gradients) ─────────── */}
      {activeTab === 'style' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Subcategory 1: Dots (37 Dot Shapes) */}
          <SectionCatalog
            title="Dots: 37 Custom QR Dot Module Shapes"
            subtitle="Every dot shape renders its actual canvas drawing pattern. Click to toggle Free/Pro & Active state."
            icon={Grid}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_DOT_STYLES.map(d => `qr_dot_${d.id}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_DOT_STYLES.map(d => `qr_dot_${d.id}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_DOT_STYLES.map(d => ({ key: `qr_dot_${d.id}`, name: d.name })), 'Dots')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_DOT_STYLES.map(d => ({ key: `qr_dot_${d.id}`, name: d.name })), 'Dots')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10 }}>
              {ALL_DOT_STYLES
                .filter(d => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.includes(searchQuery.toLowerCase()))
                .map(dot => {
                  const key = `qr_dot_${dot.id}`;
                  const state = getItemState(key, true, dot.id === 'denso' || dot.id === 'dots' || dot.id === 'rounded' ? 'free' : 'weekly');
                  return (
                    <ItemControlTile
                      key={key}
                      name={dot.name}
                      desc={dot.desc}
                      badge={dot.id}
                      customPreview={<MiniDotCanvas dotStyle={dot.id} color={state.isPaid ? '#F59E0B' : '#10B981'} />}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Grid}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, dot.name, 'Dots')}
                      onToggleTier={() => handleToggleTier(key, dot.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>

          {/* Subcategory 2: Eyes (35 Eye Shapes) */}
          <SectionCatalog
            title="Eyes: 35 Corner Eye Finder Shapes"
            subtitle="Every eye frame renders its actual corner contour. Click to toggle Free/Pro & Active state."
            icon={Eye}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_EYE_STYLES.map(e => `qr_eye_${e.id}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_EYE_STYLES.map(e => `qr_eye_${e.id}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_EYE_STYLES.map(e => ({ key: `qr_eye_${e.id}`, name: e.name })), 'Eyes')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_EYE_STYLES.map(e => ({ key: `qr_eye_${e.id}`, name: e.name })), 'Eyes')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10 }}>
              {ALL_EYE_STYLES
                .filter(e => !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.includes(searchQuery.toLowerCase()))
                .map(eye => {
                  const key = `qr_eye_${eye.id}`;
                  const state = getItemState(key, true, eye.id === 'square' || eye.id === 'rounded' || eye.id === 'circle' ? 'free' : 'weekly');
                  return (
                    <ItemControlTile
                      key={key}
                      name={eye.name}
                      desc={eye.desc}
                      badge={eye.id}
                      customPreview={<MiniEyeCanvas eyeStyle={eye.id} color={state.isPaid ? '#F59E0B' : '#10B981'} />}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Eye}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, eye.name, 'Eyes')}
                      onToggleTier={() => handleToggleTier(key, eye.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>

          {/* Subcategory 3: Background (8 Background Shapes) */}
          <SectionCatalog
            title="Background: 8 QR Background Shapes & Shield Backings"
            subtitle="Solid, Rounded, Circle Badge, Pill Capsule, Ribbon, Neon Glow, Cyber Hexagon, etc."
            icon={Box}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_BG_SHAPES.map(s => `qr_bgshape_${s.id}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_BG_SHAPES.map(s => `qr_bgshape_${s.id}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_BG_SHAPES.map(s => ({ key: `qr_bgshape_${s.id}`, name: s.name })), 'Background')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_BG_SHAPES.map(s => ({ key: `qr_bgshape_${s.id}`, name: s.name })), 'Background')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {ALL_BG_SHAPES
                .filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(shape => {
                  const key = `qr_bgshape_${shape.id}`;
                  const state = getItemState(key, true, shape.id === 'solid' || shape.id === 'rounded' ? 'free' : 'weekly');
                  return (
                    <ItemControlTile
                      key={key}
                      name={shape.name}
                      desc={shape.desc}
                      badge={shape.id}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Box}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, shape.name, 'Background')}
                      onToggleTier={() => handleToggleTier(key, shape.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>

          {/* Subcategory 4: Gradients (12 Dual Gradients) */}
          <SectionCatalog
            title="Gradients: 12 Dual Gradient Color Schemes"
            subtitle="Sunset Glow, Ocean Breeze, Cyberpunk Aqua, Neon Violet, Midnight Gold, etc."
            icon={Wand2}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_GRADIENTS.map(g => `qr_gradient_${g.id}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_GRADIENTS.map(g => `qr_gradient_${g.id}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_GRADIENTS.map(g => ({ key: `qr_gradient_${g.id}`, name: g.name })), 'Gradients')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_GRADIENTS.map(g => ({ key: `qr_gradient_${g.id}`, name: g.name })), 'Gradients')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {ALL_GRADIENTS
                .filter(g => !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(grad => {
                  const key = `qr_gradient_${grad.id}`;
                  const state = getItemState(key, true, 'weekly');
                  return (
                    <ItemControlTile
                      key={key}
                      name={grad.name}
                      desc={`${grad.from} → ${grad.to}`}
                      gradientFill={`linear-gradient(135deg, ${grad.from}, ${grad.to})`}
                      badge={grad.id}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Wand2}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, grad.name, 'Gradients')}
                      onToggleTier={() => handleToggleTier(key, grad.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>
        </div>
      )}

      {/* ── TAB 4: LOGO (Upload, AI Remover, Cards & 40 Brand Logos) ─────────── */}
      {activeTab === 'logo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Subcategory 1: Logo Tools & Upload Controls */}
          <SectionCatalog
            title="Logo Controls & Upload Tools"
            subtitle="Branding controls including custom logo uploads, presets master, AI background removal and logo cards."
            icon={Image}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_LOGO_CONTROLS.map(c => c.id))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_LOGO_CONTROLS.map(c => c.id))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_LOGO_CONTROLS.map(c => ({ key: c.id, name: c.name })), 'Logo Controls')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_LOGO_CONTROLS.map(c => ({ key: c.id, name: c.name })), 'Logo Controls')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
              {ALL_LOGO_CONTROLS.map(control => {
                const state = getItemState(control.id, true, control.defaultPlan);
                const Icon = control.icon;
                return (
                  <ItemControlTile
                    key={control.id}
                    name={control.name}
                    desc={control.desc}
                    badge={control.id}
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Icon}
                    updating={updatingKey === control.id}
                    onToggleEnable={() => handleToggleEnable(control.id, control.name, 'Logo Controls')}
                    onToggleTier={() => handleToggleTier(control.id, control.name)}
                  />
                );
              })}
            </div>
          </SectionCatalog>

          {/* Subcategory 2: 40 Brand Logos */}
          <SectionCatalog
            title="40 Pre-installed Brand Logos"
            subtitle="Social icons, fintech logos, communication badges, and media brands."
            icon={Image}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_LOGO_PRESETS.map(l => `qr_logo_${l.slug}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_LOGO_PRESETS.map(l => `qr_logo_${l.slug}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_LOGO_PRESETS.map(l => ({ key: `qr_logo_${l.slug}`, name: l.name })), 'Brand Logos')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_LOGO_PRESETS.map(l => ({ key: `qr_logo_${l.slug}`, name: l.name })), 'Brand Logos')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {ALL_LOGO_PRESETS
                .filter(l => !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.slug.includes(searchQuery.toLowerCase()))
                .map(logo => {
                  const key = `qr_logo_${logo.slug}`;
                  const state = getItemState(key, true, 'free');
                  return (
                    <ItemControlTile
                      key={key}
                      name={logo.name}
                      desc={`Brand color: ${logo.color}`}
                      badge={logo.slug}
                      color={logo.color}
                      imageUrl={logo.url}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Image}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, logo.name, 'Brand Logos')}
                      onToggleTier={() => handleToggleTier(key, logo.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>
        </div>
      )}

      {/* ── TAB 5: TEMPLATE (Template Gallery & 12 Frames) ────────────────────── */}
      {activeTab === 'template' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Subcategory 1: Templates Gallery */}
          <SectionCatalog
            title="Marketing & Social Template Posters"
            subtitle="Pre-styled 1080x1350 vertical posters for Instagram, Facebook, WhatsApp, YouTube, TikTok, etc."
            icon={LayoutGrid}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_TEMPLATES.map(t => `qr_template_${t.id}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_TEMPLATES.map(t => `qr_template_${t.id}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_TEMPLATES.map(t => ({ key: `qr_template_${t.id}`, name: t.name })), 'Templates')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_TEMPLATES.map(t => ({ key: `qr_template_${t.id}`, name: t.name })), 'Templates')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10 }}>
              {ALL_TEMPLATES
                .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(tpl => {
                  const key = `qr_template_${tpl.id}`;
                  const state = getItemState(key, true, 'weekly');
                  return (
                    <TemplateItemControlTile
                      key={key}
                      tpl={tpl}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, tpl.name, 'Templates')}
                      onToggleTier={() => handleToggleTier(key, tpl.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>

          {/* Subcategory 2: 12 Scan-Me Frames */}
          <SectionCatalog
            title="12 Scan-Me Frames & Badge Backings"
            subtitle="Pill frames, ribbons, neon glow, camera brackets, official verified stamps, etc."
            icon={Sparkles}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_FRAMES.map(fr => `qr_frame_${fr.id}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_FRAMES.map(fr => `qr_frame_${fr.id}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_FRAMES.map(fr => ({ key: `qr_frame_${fr.id}`, name: fr.name })), 'Frames')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_FRAMES.map(fr => ({ key: `qr_frame_${fr.id}`, name: fr.name })), 'Frames')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
              {ALL_FRAMES
                .filter(fr => !searchQuery || fr.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(frame => {
                  const key = `qr_frame_${frame.id}`;
                  const state = getItemState(key, true, frame.id === 'none' || frame.id === 'solid' ? 'free' : 'weekly');
                  return (
                    <ItemControlTile
                      key={key}
                      name={frame.name}
                      desc={frame.desc}
                      badge={frame.id}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Sparkles}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, frame.name, 'Frames')}
                      onToggleTier={() => handleToggleTier(key, frame.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>
        </div>
      )}

      {/* ── TAB 6: TEXT (Center Text, Frame Text & 30 Google Fonts) ───────────── */}
      {activeTab === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Subcategory 1: Center Text & Frame Text Controls */}
          <SectionCatalog
            title="Center Text & Frame Text Capabilities"
            subtitle="Custom text embeds inside the QR matrix center and CTA frame ribbons."
            icon={Type}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_TEXT_CONTROLS.map(c => c.id))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_TEXT_CONTROLS.map(c => c.id))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_TEXT_CONTROLS.map(c => ({ key: c.id, name: c.name })), 'Text Controls')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_TEXT_CONTROLS.map(c => ({ key: c.id, name: c.name })), 'Text Controls')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
              {ALL_TEXT_CONTROLS.map(control => {
                const state = getItemState(control.id, true, control.defaultPlan);
                const Icon = control.icon;
                return (
                  <ItemControlTile
                    key={control.id}
                    name={control.name}
                    desc={control.desc}
                    badge={control.id}
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Icon}
                    updating={updatingKey === control.id}
                    onToggleEnable={() => handleToggleEnable(control.id, control.name, 'Text Controls')}
                    onToggleTier={() => handleToggleTier(control.id, control.name)}
                  />
                );
              })}
            </div>
          </SectionCatalog>

          {/* Subcategory 2: Fonts (30 Google Typography Fonts) */}
          <SectionCatalog
            title="Fonts: 30 Google Typography Fonts"
            subtitle="Outfit, Inter, Montserrat, Playfair Display, Pacifico, Orbitron, Bebas Neue, etc."
            icon={Type}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_FONTS.map(f => `qr_font_${f.id.toLowerCase().replace(/\s+/g, '_')}`))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_FONTS.map(f => `qr_font_${f.id.toLowerCase().replace(/\s+/g, '_')}`))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_FONTS.map(f => ({ key: `qr_font_${f.id.toLowerCase().replace(/\s+/g, '_')}`, name: f.name })), 'Fonts')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_FONTS.map(f => ({ key: `qr_font_${f.id.toLowerCase().replace(/\s+/g, '_')}`, name: f.name })), 'Fonts')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
              {ALL_FONTS
                .filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.category.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(font => {
                  const key = `qr_font_${font.id.toLowerCase().replace(/\s+/g, '_')}`;
                  const state = getItemState(key, true, 'free');
                  return (
                    <ItemControlTile
                      key={key}
                      name={font.name}
                      desc={font.category}
                      fontFamily={font.id}
                      enabled={state.enabled}
                      isPaid={state.isPaid}
                      icon={Type}
                      updating={updatingKey === key}
                      onToggleEnable={() => handleToggleEnable(key, font.name, 'Fonts')}
                      onToggleTier={() => handleToggleTier(key, font.name)}
                    />
                  );
                })}
            </div>
          </SectionCatalog>
        </div>
      )}

      {/* ── TAB 7: SAVE & EXPORT (Formats & Resolution Controls) ─────────────── */}
      {activeTab === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Subcategory 1: Export Formats */}
          <SectionCatalog
            title="Save & Export File Formats"
            subtitle="PNG, JPG, Scalable Vector SVG, and Print-ready A4 PDF formats."
            icon={Download}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_EXPORT_FORMATS.map(f => f.id))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_EXPORT_FORMATS.map(f => f.id))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_EXPORT_FORMATS.map(f => ({ key: f.id, name: f.name })), 'Export Formats')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_EXPORT_FORMATS.map(f => ({ key: f.id, name: f.name })), 'Export Formats')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 10 }}>
              {ALL_EXPORT_FORMATS.map(item => {
                const state = getItemState(item.id, true, item.defaultPlan);
                return (
                  <ItemControlTile
                    key={item.id}
                    name={item.name}
                    desc={item.desc}
                    badge={item.id}
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Download}
                    updating={updatingKey === item.id}
                    onToggleEnable={() => handleToggleEnable(item.id, item.name, 'Export Formats')}
                    onToggleTier={() => handleToggleTier(item.id, item.name)}
                  />
                );
              })}
            </div>
          </SectionCatalog>

          {/* Subcategory 2: Resolutions & OS Sharing */}
          <SectionCatalog
            title="Resolutions, Quality & Native Share"
            subtitle="Manage export image resolutions (512px–4K Ultra) and OS social share sheet."
            icon={Sliders}
            onMakeFree={() => handleBatchActiveTabTier('free', ALL_EXPORT_QUALITIES.map(q => q.id))}
            onMakePro={() => handleBatchActiveTabTier('paid', ALL_EXPORT_QUALITIES.map(q => q.id))}
            onEnableAll={() => handleBatchActiveTabEnable(true, ALL_EXPORT_QUALITIES.map(q => ({ key: q.id, name: q.name })), 'Quality & Share')}
            onDisableAll={() => handleBatchActiveTabEnable(false, ALL_EXPORT_QUALITIES.map(q => ({ key: q.id, name: q.name })), 'Quality & Share')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 10 }}>
              {ALL_EXPORT_QUALITIES.map(item => {
                const state = getItemState(item.id, true, item.defaultPlan);
                return (
                  <ItemControlTile
                    key={item.id}
                    name={item.name}
                    desc={item.desc}
                    badge={item.id}
                    enabled={state.enabled}
                    isPaid={state.isPaid}
                    icon={Sliders}
                    updating={updatingKey === item.id}
                    onToggleEnable={() => handleToggleEnable(item.id, item.name, 'Quality & Share')}
                    onToggleTier={() => handleToggleTier(item.id, item.name)}
                  />
                );
              })}
            </div>
          </SectionCatalog>
        </div>
      )}
    </div>
  );
}

function TemplateItemControlTile({ tpl, enabled, isPaid, updating, onToggleEnable, onToggleTier }) {
  const isOff = !enabled;

  return (
    <div style={{
      background: isOff ? 'rgba(15, 18, 33, 0.4)' : 'var(--ad-input)',
      border: `1.5px solid ${isOff ? 'rgba(239, 68, 68, 0.3)' : (isPaid ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)')}`,
      borderRadius: 14, padding: '10px 8px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      gap: 8, opacity: isOff ? 0.65 : 1, transition: 'all 0.18s ease',
      boxShadow: isPaid ? '0 4px 14px rgba(245, 158, 11, 0.1)' : '0 4px 14px rgba(16, 185, 129, 0.1)'
    }}>
      {/* Visual Poster Thumbnail Card */}
      <TemplatePreviewCanvas template={tpl} />

      {/* Details */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: 'var(--ad-text)', lineHeight: 1.25,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {tpl.name}
        </div>
        <div style={{
          fontSize: 9.5, color: 'var(--ad-text-sec)', marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {tpl.actionText} · {tpl.defaultHandle}
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 6, borderTop: '1px solid var(--ad-border)', gap: 4
      }}>
        <button
          type="button"
          disabled={updating}
          onClick={onToggleEnable}
          style={{
            display: 'flex', alignItems: 'center', gap: 3, padding: '3px 6px',
            borderRadius: 6, border: `1px solid ${enabled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            background: enabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: enabled ? '#22C55E' : '#EF4444', fontSize: 9, fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer', flexShrink: 0
          }}
        >
          <Power size={9} strokeWidth={2.5} />
          <span>{enabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          disabled={updating}
          onClick={onToggleTier}
          style={{
            display: 'flex', alignItems: 'center', gap: 3, padding: '3px 7px',
            borderRadius: 100, border: `1.5px solid ${isPaid ? '#F59E0B' : '#10B981'}`,
            background: isPaid ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF', fontSize: 9, fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer', flexShrink: 0,
            boxShadow: isPaid ? '0 2px 6px rgba(245, 158, 11, 0.35)' : '0 2px 6px rgba(16, 185, 129, 0.35)'
          }}
        >
          {updating ? (
            <RefreshCw size={9} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
          ) : isPaid ? (
            <Crown size={9} fill="#fff" color="#fff" strokeWidth={2.2} />
          ) : (
            <Shield size={9} strokeWidth={2.5} />
          )}
          <span>{isPaid ? 'PRO' : 'FREE'}</span>
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// REUSABLE SUB-CONTAINER CARDS (Mobile-First UX)
// ═════════════════════════════════════════════════════════════════════════

function SectionCatalog({ title, subtitle, icon: Icon, onMakeFree, onMakePro, onEnableAll, onDisableAll, children }) {
  const isDarkMode = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

  return (
    <div style={{
      background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
      borderRadius: 18, padding: '14px 12px', boxShadow: 'var(--ad-card-shadow)',
      display: 'flex', flexDirection: 'column', gap: 14, width: '100%', boxSizing: 'border-box'
    }}>
      {/* Mobile-First Header with Title and Action Toolbar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%'
      }}>
        {/* Title and Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, width: '100%' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(255, 77, 157, 0.2) 0%, rgba(214, 0, 54, 0.15) 100%)',
            color: '#FF4D9D',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(255, 77, 157, 0.2)'
          }}>
            <Icon size={18} strokeWidth={2.4} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h2 style={{ fontSize: 14, fontWeight: 900, color: 'var(--ad-text)', margin: 0, lineHeight: 1.25, letterSpacing: '-0.2px' }}>
              {title}
            </h2>
            <p style={{ fontSize: 11, color: 'var(--ad-text-sec)', margin: '2px 0 0', fontWeight: 500, lineHeight: 1.3 }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Section Quick Batch Actions (Mobile-First 4-Pill Action Bar - Crystal Clear in Light & Dark Mode) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          width: '100%',
          padding: '6px',
          background: 'var(--ad-input)',
          borderRadius: 12,
          border: '1px solid var(--ad-border)',
          boxSizing: 'border-box'
        }}>
          {/* 1. Free All Button */}
          <button
            type="button"
            onClick={onMakeFree}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '6px 4px', minHeight: 32,
              borderRadius: 8,
              background: isDarkMode ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5',
              border: `1.5px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.45)' : '#A7F3D0'}`,
              color: isDarkMode ? '#34D399' : '#047857',
              fontSize: 11, fontWeight: 800, cursor: 'pointer',
              boxShadow: isDarkMode ? 'none' : '0 1px 2px rgba(4,120,87,0.06)',
              transition: 'all 0.15s ease'
            }}
          >
            <Shield size={12} strokeWidth={2.5} />
            <span style={{ whiteSpace: 'nowrap' }}>Free All</span>
          </button>

          {/* 2. Pro All Button */}
          <button
            type="button"
            onClick={onMakePro}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '6px 4px', minHeight: 32,
              borderRadius: 8,
              background: isDarkMode ? 'rgba(245, 158, 11, 0.18)' : '#FFFBEB',
              border: `1.5px solid ${isDarkMode ? 'rgba(245, 158, 11, 0.45)' : '#FDE68A'}`,
              color: isDarkMode ? '#FBBF24' : '#B45309',
              fontSize: 11, fontWeight: 800, cursor: 'pointer',
              boxShadow: isDarkMode ? 'none' : '0 1px 2px rgba(180,83,9,0.06)',
              transition: 'all 0.15s ease'
            }}
          >
            <Crown size={12} strokeWidth={2.5} />
            <span style={{ whiteSpace: 'nowrap' }}>Pro All</span>
          </button>

          {/* 3. Enable All Button */}
          <button
            type="button"
            onClick={onEnableAll}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '6px 4px', minHeight: 32,
              borderRadius: 8,
              background: isDarkMode ? 'rgba(34, 197, 94, 0.18)' : '#F0FDF4',
              border: `1.5px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.45)' : '#BBF7D0'}`,
              color: isDarkMode ? '#4ADE80' : '#15803D',
              fontSize: 11, fontWeight: 800, cursor: 'pointer',
              boxShadow: isDarkMode ? 'none' : '0 1px 2px rgba(21,128,61,0.06)',
              transition: 'all 0.15s ease'
            }}
          >
            <Power size={12} strokeWidth={2.5} />
            <span style={{ whiteSpace: 'nowrap' }}>Enable</span>
          </button>

          {/* 4. Hide / Disable All Button */}
          <button
            type="button"
            onClick={onDisableAll}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '6px 4px', minHeight: 32,
              borderRadius: 8,
              background: isDarkMode ? 'rgba(239, 68, 68, 0.18)' : '#FEF2F2',
              border: `1.5px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.45)' : '#FECACA'}`,
              color: isDarkMode ? '#F87171' : '#B91C1C',
              fontSize: 11, fontWeight: 800, cursor: 'pointer',
              boxShadow: isDarkMode ? 'none' : '0 1px 2px rgba(185,28,28,0.06)',
              transition: 'all 0.15s ease'
            }}
          >
            <XCircle size={12} strokeWidth={2.5} />
            <span style={{ whiteSpace: 'nowrap' }}>Hide</span>
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

function ItemControlTile({ name, desc, badge, color, imageUrl, gradientFill, customPreview, fontFamily, enabled, isPaid, icon: Icon, updating, onToggleEnable, onToggleTier }) {
  const isOff = !enabled;
  const isDarkMode = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

  return (
    <div style={{
      background: isOff ? (isDarkMode ? 'rgba(15, 18, 33, 0.4)' : '#F8FAFC') : 'var(--ad-input)',
      border: `1.5px solid ${isOff ? (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5') : (isPaid ? (isDarkMode ? 'rgba(245, 158, 11, 0.35)' : '#FCD34D') : (isDarkMode ? 'rgba(16, 185, 129, 0.35)' : '#6EE7B7'))}`,
      borderRadius: 14, padding: '11px 10px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      gap: 10, opacity: isOff ? 0.65 : 1, transition: 'all 0.18s ease',
      boxShadow: isPaid ? '0 2px 8px rgba(245, 158, 11, 0.08)' : '0 2px 8px rgba(16, 185, 129, 0.08)',
      boxSizing: 'border-box', minWidth: 0
    }}>
      {/* Top row: Visual Thumbnail + Name + Desc */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 0 }}>
        {customPreview ? (
          <div style={{ flexShrink: 0 }}>{customPreview}</div>
        ) : gradientFill ? (
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: gradientFill,
            border: '1.5px solid rgba(255,255,255,0.2)', flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }} />
        ) : imageUrl ? (
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: '#fff',
            border: '1px solid var(--ad-border)', padding: 4, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        ) : (
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: isOff ? (isDarkMode ? 'rgba(148, 163, 184, 0.15)' : '#F1F5F9') : (isPaid ? (isDarkMode ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(214, 0, 54, 0.15))' : '#FEF3C7') : (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#D1FAE5')),
            color: isOff ? 'var(--ad-text-sec)' : (isPaid ? (isDarkMode ? '#F59E0B' : '#B45309') : (isDarkMode ? '#10B981' : '#047857')),
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            {Icon && <Icon size={18} strokeWidth={2.4} />}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', lineHeight: 1.3,
            fontFamily: fontFamily ? `${fontFamily}, sans-serif` : 'inherit',
            wordBreak: 'break-word', whiteSpace: 'normal'
          }}>
            {name}
          </div>
          {desc && (
            <div style={{
              fontSize: 10.5, color: 'var(--ad-text-sec)', marginTop: 3, lineHeight: 1.35,
              wordBreak: 'break-word', whiteSpace: 'normal'
            }}>
              {desc}
            </div>
          )}
          {badge && (
            <span style={{
              fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4,
              background: 'var(--ad-card)', color: 'var(--ad-text-sec)',
              border: '1px solid var(--ad-border)', display: 'inline-block', marginTop: 4
            }}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar: Active Switch + 1-Click Free/Pro Toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 8, borderTop: '1px solid var(--ad-border)', gap: 6
      }}>
        <button
          type="button"
          disabled={updating}
          onClick={onToggleEnable}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
            borderRadius: 7,
            border: `1.5px solid ${enabled ? (isDarkMode ? 'rgba(34, 197, 94, 0.45)' : '#86EFAC') : (isDarkMode ? 'rgba(239, 68, 68, 0.45)' : '#FCA5A5')}`,
            background: enabled ? (isDarkMode ? 'rgba(34, 197, 94, 0.18)' : '#F0FDF4') : (isDarkMode ? 'rgba(239, 68, 68, 0.18)' : '#FEF2F2'),
            color: enabled ? (isDarkMode ? '#4ADE80' : '#15803D') : (isDarkMode ? '#F87171' : '#B91C1C'),
            fontSize: 9.5, fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer', flexShrink: 0
          }}
        >
          <Power size={10} strokeWidth={2.5} />
          <span>{enabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          disabled={updating}
          onClick={onToggleTier}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px',
            borderRadius: 100, border: `1.5px solid ${isPaid ? '#F59E0B' : '#10B981'}`,
            background: isPaid ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF', fontSize: 9.5, fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer', flexShrink: 0,
            boxShadow: isPaid ? '0 2px 6px rgba(245, 158, 11, 0.35)' : '0 2px 6px rgba(16, 185, 129, 0.35)'
          }}
        >
          {updating ? (
            <RefreshCw size={10} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
          ) : isPaid ? (
            <Crown size={10} fill="#fff" color="#fff" strokeWidth={2.2} />
          ) : (
            <Shield size={10} strokeWidth={2.5} />
          )}
          <span>{isPaid ? 'PRO' : 'FREE'}</span>
        </button>
      </div>
    </div>
  );
}
