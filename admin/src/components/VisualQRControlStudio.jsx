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
  FileCheck, Star, Heart, Bookmark, UploadCloud, Brush, Layers2
} from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { setFeatureFlagCloud, setFeaturesTierBatchCloud } from '../services/adminDataService';
import { FEATURE_REGISTRY } from '../services/FeatureAccessManager';
import { drawDotModule, drawEye } from '../../src/utils/qrEngine';

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

export const ALL_TEMPLATES = [
  {
    id: 'sm_instagram_pro',
    name: 'Instagram Pro Follower Card',
    logoSrc: '/presets/instagram.avif',
    title: 'INSTAGRAM',
    actionText: 'Follow Me',
    defaultHandle: '@your.instagram',
    bgGradStart: '#3B0826',
    bgGradEnd: '#15020D',
    glowColor: 'rgba(225, 48, 108, 0.4)',
    iconGradStart: '#833AB4',
    iconGradEnd: '#FD1D1D',
    actionTextColor: '#FF4D79',
    preset: { qrColor: '#1A0210', bgColor: '#FFFFFF', eyeColor: '#E1306C', eyeOuterColor: '#833AB4', dotStyle: 'rounded', eyeStyle: 'rounded' }
  },
  {
    id: 'sm_facebook_pro',
    name: 'Facebook Pro Community Card',
    logoSrc: '/presets/facebook.avif',
    title: 'FACEBOOK',
    actionText: 'Join Our Community',
    defaultHandle: 'facebook.com/yourpage',
    bgGradStart: '#061B3A',
    bgGradEnd: '#020916',
    glowColor: 'rgba(24, 119, 242, 0.4)',
    iconGradStart: '#1877F2',
    iconGradEnd: '#0056C6',
    actionTextColor: '#4D9BFF',
    preset: { qrColor: '#030E20', bgColor: '#FFFFFF', eyeColor: '#1877F2', eyeOuterColor: '#0056C6', dotStyle: 'square', eyeStyle: 'square' }
  },
  {
    id: 'sm_whatsapp_pro',
    name: 'WhatsApp Pro Live Chat',
    logoSrc: '/presets/whatsapp.avif',
    title: 'WHATSAPP',
    actionText: 'Chat With Us',
    defaultHandle: '+1 (555) 019-2834',
    bgGradStart: '#052B1E',
    bgGradEnd: '#01120C',
    glowColor: 'rgba(37, 211, 102, 0.4)',
    iconGradStart: '#25D366',
    iconGradEnd: '#128C7E',
    actionTextColor: '#52E08A',
    preset: { qrColor: '#021810', bgColor: '#FFFFFF', eyeColor: '#25D366', eyeOuterColor: '#128C7E', dotStyle: 'dots', eyeStyle: 'rounded' }
  },
  {
    id: 'sm_youtube_pro',
    name: 'YouTube Pro Subscribe Stand',
    logoSrc: '/presets/youtube.avif',
    title: 'YOUTUBE',
    actionText: 'Watch & Subscribe',
    defaultHandle: 'youtube.com/@channel',
    bgGradStart: '#3A060B',
    bgGradEnd: '#150103',
    glowColor: 'rgba(255, 0, 0, 0.4)',
    iconGradStart: '#FF0000',
    iconGradEnd: '#990000',
    actionTextColor: '#FF4D4D',
    preset: { qrColor: '#200305', bgColor: '#FFFFFF', eyeColor: '#FF0000', eyeOuterColor: '#990000', dotStyle: 'rounded', eyeStyle: 'rounded' }
  },
  {
    id: 'sm_x_pro',
    name: 'X / Twitter Pro Profile',
    logoSrc: '/presets/twitter.avif',
    title: 'X (TWITTER)',
    actionText: 'Follow Me',
    defaultHandle: '@your_twitter_handle',
    bgGradStart: '#0F172A',
    bgGradEnd: '#020617',
    glowColor: 'rgba(29, 155, 240, 0.4)',
    iconGradStart: '#1DA1F2',
    iconGradEnd: '#0C7ABF',
    actionTextColor: '#58B9F5',
    preset: { qrColor: '#0B132B', bgColor: '#FFFFFF', eyeColor: '#1DA1F2', eyeOuterColor: '#0C7ABF', dotStyle: 'square', eyeStyle: 'square' }
  },
  {
    id: 'sm_tiktok_pro',
    name: 'TikTok Pro Trending Card',
    logoSrc: '/presets/tik-tok.avif',
    title: 'TIKTOK',
    actionText: 'Watch Trending Videos',
    defaultHandle: '@tiktok_creator',
    bgGradStart: '#1A0B26',
    bgGradEnd: '#08030F',
    glowColor: 'rgba(254, 44, 85, 0.4)',
    iconGradStart: '#25F4EE',
    iconGradEnd: '#FE2C55',
    actionTextColor: '#FF5E80',
    preset: { qrColor: '#10061A', bgColor: '#FFFFFF', eyeColor: '#FE2C55', eyeOuterColor: '#25F4EE', dotStyle: 'rounded', eyeStyle: 'rounded' }
  },
  {
    id: 'sm_linkedin_pro',
    name: 'LinkedIn Pro Connect Card',
    logoSrc: '/presets/linkedin.avif',
    title: 'LINKEDIN',
    actionText: 'Connect With Me',
    defaultHandle: 'linkedin.com/in/yourname',
    bgGradStart: '#0A1E3F',
    bgGradEnd: '#030A17',
    glowColor: 'rgba(10, 102, 194, 0.4)',
    iconGradStart: '#0A66C2',
    iconGradEnd: '#004182',
    actionTextColor: '#4A9EFF',
    preset: { qrColor: '#051226', bgColor: '#FFFFFF', eyeColor: '#0A66C2', eyeOuterColor: '#004182', dotStyle: 'square', eyeStyle: 'square' }
  },
  {
    id: 'sm_spotify_pro',
    name: 'Spotify Pro Music Card',
    logoSrc: '/presets/spotify.avif',
    title: 'SPOTIFY',
    actionText: 'Listen On Spotify',
    defaultHandle: 'spotify:user:playlist',
    bgGradStart: '#092612',
    bgGradEnd: '#020F06',
    glowColor: 'rgba(30, 215, 96, 0.4)',
    iconGradStart: '#1DB954',
    iconGradEnd: '#107C35',
    actionTextColor: '#4DE07E',
    preset: { qrColor: '#041409', bgColor: '#FFFFFF', eyeColor: '#1DB954', eyeOuterColor: '#107C35', dotStyle: 'dots', eyeStyle: 'rounded' }
  },
  {
    id: 'sm_messenger_pro',
    name: 'Messenger Pro Direct Chat',
    logoSrc: '/presets/messenger.avif',
    title: 'MESSENGER',
    actionText: 'Chat With Us',
    defaultHandle: 'm.me/yourpage',
    bgGradStart: '#1F0836',
    bgGradEnd: '#0B0215',
    glowColor: 'rgba(0, 132, 255, 0.4)',
    iconGradStart: '#0084FF',
    iconGradEnd: '#A200FF',
    actionTextColor: '#33A3FF',
    preset: { qrColor: '#0E031A', bgColor: '#FFFFFF', eyeColor: '#0084FF', eyeOuterColor: '#A200FF', dotStyle: 'rounded', eyeStyle: 'rounded' }
  },
  {
    id: 'sm_social_pro',
    name: 'Social Hub Multi-Link Pro',
    logoSrc: '/presets/social.avif',
    title: 'SOCIAL HUB',
    actionText: 'Join Us',
    defaultHandle: 'linktr.ee/yourhub',
    bgGradStart: '#25083B',
    bgGradEnd: '#0D0216',
    glowColor: 'rgba(235, 64, 52, 0.4)',
    iconGradStart: '#FF3B30',
    iconGradEnd: '#AF52DE',
    actionTextColor: '#FF6B60',
    preset: { qrColor: '#140320', bgColor: '#FFFFFF', eyeColor: '#FF3B30', eyeOuterColor: '#AF52DE', dotStyle: 'rounded', eyeStyle: 'rounded' }
  }
];

function TemplateMiniPosterCard({ template }) {
  const bgGrad = `linear-gradient(160deg, ${template.bgGradStart || '#1e1b4b'} 0%, ${template.bgGradEnd || '#0f172a'} 100%)`;
  const iconGrad = `linear-gradient(135deg, ${template.iconGradStart || '#FF4D9D'}, ${template.iconGradEnd || '#7B61FF'})`;

  return (
    <div style={{
      width: '100%',
      aspectRatio: '4 / 4.4',
      background: bgGrad,
      borderRadius: 10,
      padding: '8px 6px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: `0 4px 14px ${template.glowColor || 'rgba(0,0,0,0.3)'}`
    }}>
      {/* Top Ambient Glow */}
      <div style={{
        position: 'absolute', top: -15, width: 60, height: 60, borderRadius: '50%',
        background: template.glowColor || 'rgba(255,77,157,0.3)', filter: 'blur(12px)', pointerEvents: 'none'
      }} />

      {/* Header with Icon + Title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 1, maxWidth: '100%' }}>
        <div style={{
          width: 20, height: 20, borderRadius: 5, background: iconGrad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)', padding: 2, flexShrink: 0
        }}>
          {template.logoSrc ? (
            <img src={template.logoSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <QrCode size={11} color="#fff" />
          )}
        </div>
        <span style={{
          fontSize: 7.5, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.4px',
          textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'
        }}>
          {template.title || template.name}
        </span>
      </div>

      {/* Center White QR Card with Live Canvas / Matrix */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 5,
        padding: '3px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <MiniDotCanvas
          dotStyle={template.preset?.dotStyle || 'rounded'}
          color={template.preset?.eyeColor || '#000000'}
        />
      </div>

      {/* Bottom Action Pill & Handle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, zIndex: 1, maxWidth: '100%' }}>
        <span style={{
          fontSize: 7, fontWeight: 800, color: template.actionTextColor || '#FF4D79',
          letterSpacing: '0.2px', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'
        }}>
          {template.actionText || 'Scan Me'}
        </span>
        <span style={{
          fontSize: 6, fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'
        }}>
          {template.defaultHandle || '@mushiqr'}
        </span>
      </div>
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

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function VisualQRControlStudio({ currentUser, isDark = false }) {
  const [liveFlagsMap, setLiveFlagsMap] = useState({});
  const [livePlans, setLivePlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
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
        updates[item.key] = enable;
        await setFeatureFlagCloud(item.key, enable, { name: item.name, category: 'QR_GENERATOR', subcategory });
      }
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

  // Sub-Navigation Tabs
  const TABS = [
    { id: 'overview', label: '1. Overview & Content Grid', count: 18, icon: QrCode },
    { id: 'dots', label: '2. 37 Dot Module Shapes', count: ALL_DOT_STYLES.length, icon: Grid },
    { id: 'eyes', label: '3. 35 Eye Finder Shapes', count: ALL_EYE_STYLES.length, icon: Eye },
    { id: 'textures', label: '4. 10 Textures & Overlays', count: ALL_TEXTURES.length, icon: Brush },
    { id: 'gradients', label: '5. 12 Dual Gradients', count: ALL_GRADIENTS.length, icon: Wand2 },
    { id: 'bg_shapes', label: '6. 8 Card Backgrounds', count: ALL_BG_SHAPES.length, icon: Box },
    { id: 'logos', label: '7. 40 Brand Logo Presets', count: ALL_LOGO_PRESETS.length, icon: Image },
    { id: 'fonts', label: '8. 30 Google Fonts', count: ALL_FONTS.length, icon: Type },
    { id: 'frames', label: '9. 12 Scan-Me Frames', count: ALL_FRAMES.length, icon: Sparkles },
    { id: 'templates', label: '10. Templates Gallery', count: ALL_TEMPLATES.length, icon: LayoutGrid }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Feedback Toast */}
      {feedbackToast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(15, 18, 33, 0.96)', border: '1.5px solid #FF4D9D',
          borderRadius: 100, padding: '10px 22px', color: '#fff',
          fontSize: 13, fontWeight: 800, boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 999999, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Studio Header ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
        borderRadius: 20, padding: '24px', boxShadow: 'var(--ad-card-shadow)',
        display: 'flex', flexDirection: 'column', gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(214, 0, 54, 0.18) 0%, rgba(255, 77, 157, 0.15) 100%)',
              border: '1.5px solid rgba(214, 0, 54, 0.4)', color: '#D60036',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(214, 0, 54, 0.2)'
            }}>
              <QrCode size={28} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ad-text)', margin: 0, letterSpacing: '-0.4px' }}>
                  QR Code Generator Master Studio
                </h1>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 100, background: 'rgba(214, 0, 54, 0.15)', color: '#D60036' }}>
                  Live Assets &amp; Canvas Rendering
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '4px 0 0', fontWeight: 500 }}>
                Granular control over all 18 formats, 37 dot shapes, 35 eye corners, 10 textures, 12 gradients, 8 card shapes, 40 logos, 30 fonts &amp; templates.
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div style={{ minWidth: 260, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, color: 'var(--ad-text-sec)' }} />
            <input
              type="text"
              placeholder="Search shapes, eyes, textures, logos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
                borderRadius: 10, padding: '8px 32px 8px 34px', color: 'var(--ad-text)',
                fontSize: 12, fontWeight: 600, outline: 'none'
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', color: 'var(--ad-text-sec)', cursor: 'pointer' }}>
                <XCircle size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Carousel Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {TABS.map(t => {
            const isActive = activeTab === t.id;
            const IconC = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                  borderRadius: 12, border: `1.5px solid ${isActive ? '#FF4D9D' : 'var(--ad-border)'}`,
                  background: isActive ? 'rgba(255, 77, 157, 0.14)' : 'var(--ad-input)',
                  color: isActive ? '#FF4D9D' : 'var(--ad-text-sec)',
                  fontSize: 12, fontWeight: isActive ? 800 : 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s ease'
                }}
              >
                <IconC size={15} />
                <span>{t.label}</span>
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: isActive ? '#FF4D9D' : 'var(--ad-card)', color: isActive ? '#fff' : 'var(--ad-text-sec)', fontWeight: 800 }}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW & 18 CONTENT TYPES ────────────────────────────────── */}
      {activeTab === 'overview' && (
        <SectionCatalog
          title="18 Main App QR Content Formats"
          subtitle="The 18 content format cards shown to users on the creation screen."
          icon={Grid}
          onMakeFree={() => handleBatchActiveTabTier('free', canonicalQRFeatures.filter(f => f.subcategory === 'Content').map(f => f.key))}
          onMakePro={() => handleBatchActiveTabTier('paid', canonicalQRFeatures.filter(f => f.subcategory === 'Content').map(f => f.key))}
          onEnableAll={() => handleBatchActiveTabEnable(true, canonicalQRFeatures.filter(f => f.subcategory === 'Content'), 'Content')}
          onDisableAll={() => handleBatchActiveTabEnable(false, canonicalQRFeatures.filter(f => f.subcategory === 'Content'), 'Content')}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {canonicalQRFeatures
              .filter(f => f.subcategory === 'Content' && (!searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())))
              .map(feature => (
                <ItemControlTile
                  key={feature.key}
                  name={feature.name}
                  desc={feature.description}
                  enabled={feature.enabled}
                  isPaid={feature.isPaid}
                  icon={FileText}
                  updating={updatingKey === feature.key}
                  onToggleEnable={() => handleToggleEnable(feature.key, feature.name, 'Content')}
                  onToggleTier={() => handleToggleTier(feature.key, feature.name)}
                />
              ))}
          </div>
        </SectionCatalog>
      )}

      {/* ── TAB 2: 37 DOT MODULE SHAPES (With Live Canvas Preview) ────────────── */}
      {activeTab === 'dots' && (
        <SectionCatalog
          title="37 Custom QR Dot Module Shapes (Live Canvas Preview)"
          subtitle="Every dot shape renders its actual canvas drawing pattern. Click to toggle Free/Pro & Active state."
          icon={Grid}
          onMakeFree={() => handleBatchActiveTabTier('free', ALL_DOT_STYLES.map(d => `qr_dot_${d.id}`))}
          onMakePro={() => handleBatchActiveTabTier('paid', ALL_DOT_STYLES.map(d => `qr_dot_${d.id}`))}
          onEnableAll={() => handleBatchActiveTabEnable(true, ALL_DOT_STYLES.map(d => ({ key: `qr_dot_${d.id}`, name: d.name })), 'Dot Shapes')}
          onDisableAll={() => handleBatchActiveTabEnable(false, ALL_DOT_STYLES.map(d => ({ key: `qr_dot_${d.id}`, name: d.name })), 'Dot Shapes')}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
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
                    onToggleEnable={() => handleToggleEnable(key, dot.name, 'Dot Shapes')}
                    onToggleTier={() => handleToggleTier(key, dot.name)}
                  />
                );
              })}
          </div>
        </SectionCatalog>
      )}

      {/* ── TAB 3: 35 EYE FINDER SHAPES (With Live Canvas Preview) ────────────── */}
      {activeTab === 'eyes' && (
        <SectionCatalog
          title="35 Corner Eye Finder Shapes (Live Canvas Preview)"
          subtitle="Every eye frame renders its actual corner contour. Click to toggle Free/Pro & Active state."
          icon={Eye}
          onMakeFree={() => handleBatchActiveTabTier('free', ALL_EYE_STYLES.map(e => `qr_eye_${e.id}`))}
          onMakePro={() => handleBatchActiveTabTier('paid', ALL_EYE_STYLES.map(e => `qr_eye_${e.id}`))}
          onEnableAll={() => handleBatchActiveTabEnable(true, ALL_EYE_STYLES.map(e => ({ key: `qr_eye_${e.id}`, name: e.name })), 'Eye Shapes')}
          onDisableAll={() => handleBatchActiveTabEnable(false, ALL_EYE_STYLES.map(e => ({ key: `qr_eye_${e.id}`, name: e.name })), 'Eye Shapes')}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
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
                    onToggleEnable={() => handleToggleEnable(key, eye.name, 'Eye Shapes')}
                    onToggleTier={() => handleToggleTier(key, eye.name)}
                  />
                );
              })}
          </div>
        </SectionCatalog>
      )}

      {/* ── TAB 4: 10 TEXTURES & PATTERN OVERLAYS ────────────────────────────── */}
      {activeTab === 'textures' && (
        <SectionCatalog
          title="10 Social Textures &amp; Matrix Overlays"
          subtitle="Facebook, WhatsApp, Instagram, TikTok, Snapchat textures, plus custom texture uploads."
          icon={Brush}
          onMakeFree={() => handleBatchActiveTabTier('free', ALL_TEXTURES.map(t => `qr_texture_${t.slug}`))}
          onMakePro={() => handleBatchActiveTabTier('paid', ALL_TEXTURES.map(t => `qr_texture_${t.slug}`))}
          onEnableAll={() => handleBatchActiveTabEnable(true, ALL_TEXTURES.map(t => ({ key: `qr_texture_${t.slug}`, name: t.name })), 'Textures')}
          onDisableAll={() => handleBatchActiveTabEnable(false, ALL_TEXTURES.map(t => ({ key: `qr_texture_${t.slug}`, name: t.name })), 'Textures')}
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
                    onToggleEnable={() => handleToggleEnable(key, tex.name, 'Textures')}
                    onToggleTier={() => handleToggleTier(key, tex.name)}
                  />
                );
              })}
          </div>
        </SectionCatalog>
      )}

      {/* ── TAB 5: 12 DUAL GRADIENT FILLS ─────────────────────────────────────── */}
      {activeTab === 'gradients' && (
        <SectionCatalog
          title="12 Dual Gradient Color Schemes"
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
      )}

      {/* ── TAB 6: 8 CARD BACKGROUND SHAPES ──────────────────────────────────── */}
      {activeTab === 'bg_shapes' && (
        <SectionCatalog
          title="8 QR Background Shapes &amp; Shield Backings"
          subtitle="Solid, Rounded, Circle Badge, Pill Capsule, Ribbon, Neon Glow, Cyber Hexagon, etc."
          icon={Box}
          onMakeFree={() => handleBatchActiveTabTier('free', ALL_BG_SHAPES.map(s => `qr_bgshape_${s.id}`))}
          onMakePro={() => handleBatchActiveTabTier('paid', ALL_BG_SHAPES.map(s => `qr_bgshape_${s.id}`))}
          onEnableAll={() => handleBatchActiveTabEnable(true, ALL_BG_SHAPES.map(s => ({ key: `qr_bgshape_${s.id}`, name: s.name })), 'Background Shapes')}
          onDisableAll={() => handleBatchActiveTabEnable(false, ALL_BG_SHAPES.map(s => ({ key: `qr_bgshape_${s.id}`, name: s.name })), 'Background Shapes')}
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
                    onToggleEnable={() => handleToggleEnable(key, shape.name, 'Background Shapes')}
                    onToggleTier={() => handleToggleTier(key, shape.name)}
                  />
                );
              })}
          </div>
        </SectionCatalog>
      )}

      {/* ── TAB 7: 40 BRAND LOGO PRESETS ─────────────────────────────────────── */}
      {activeTab === 'logos' && (
        <SectionCatalog
          title="40 Pre-installed Brand Logo Presets"
          subtitle="Social icons, fintech logos, communication badges, and media brands."
          icon={Image}
          onMakeFree={() => handleBatchActiveTabTier('free', ALL_LOGO_PRESETS.map(l => `qr_logo_${l.slug}`))}
          onMakePro={() => handleBatchActiveTabTier('paid', ALL_LOGO_PRESETS.map(l => `qr_logo_${l.slug}`))}
          onEnableAll={() => handleBatchActiveTabEnable(true, ALL_LOGO_PRESETS.map(l => ({ key: `qr_logo_${l.slug}`, name: l.name })), 'Logo Presets')}
          onDisableAll={() => handleBatchActiveTabEnable(false, ALL_LOGO_PRESETS.map(l => ({ key: `qr_logo_${l.slug}`, name: l.name })), 'Logo Presets')}
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
                    onToggleEnable={() => handleToggleEnable(key, logo.name, 'Logo Presets')}
                    onToggleTier={() => handleToggleTier(key, logo.name)}
                  />
                );
              })}
          </div>
        </SectionCatalog>
      )}

      {/* ── TAB 8: 30 GOOGLE FONTS ───────────────────────────────────────────── */}
      {activeTab === 'fonts' && (
        <SectionCatalog
          title="30 Google Fonts Typography Collection"
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
      )}

      {/* ── TAB 9: 12 SCAN-ME FRAMES ─────────────────────────────────────────── */}
      {activeTab === 'frames' && (
        <SectionCatalog
          title="12 Scan-Me Frames &amp; Badge Backings"
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
      )}

      {/* ── TAB 10: TEMPLATES GALLERY ────────────────────────────────────────── */}
      {activeTab === 'templates' && (
        <SectionCatalog
          title="Social Media &amp; Marketing Template Posters"
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
      <TemplateMiniPosterCard template={tpl} />

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
// REUSABLE SUB-CONTAINER CARDS
// ═════════════════════════════════════════════════════════════════════════

function SectionCatalog({ title, subtitle, icon: Icon, onMakeFree, onMakePro, onEnableAll, onDisableAll, children }) {
  return (
    <div style={{
      background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
      borderRadius: 18, padding: '20px', boxShadow: 'var(--ad-card-shadow)',
      display: 'flex', flexDirection: 'column', gap: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255, 77, 157, 0.12)', color: '#FF4D9D',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={18} strokeWidth={2.4} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--ad-text)', margin: 0 }}>
              {title}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ad-text-sec)', margin: '2px 0 0', fontWeight: 500 }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Section Quick Batch Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={onMakeFree}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#10B981', fontSize: 11, fontWeight: 800, cursor: 'pointer'
            }}
          >
            <Shield size={12} />
            <span>Make Free</span>
          </button>
          <button
            onClick={onMakePro}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#F59E0B', fontSize: 11, fontWeight: 800, cursor: 'pointer'
            }}
          >
            <Crown size={12} />
            <span>Make Pro</span>
          </button>
          <button
            onClick={onEnableAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px',
              borderRadius: 8, background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22C55E', fontSize: 11, fontWeight: 800, cursor: 'pointer'
            }}
          >
            <Power size={12} />
            <span>Enable</span>
          </button>
          <button
            onClick={onDisableAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px',
              borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444', fontSize: 11, fontWeight: 800, cursor: 'pointer'
            }}
          >
            <XCircle size={12} />
            <span>Hide</span>
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

function ItemControlTile({ name, desc, badge, color, imageUrl, gradientFill, customPreview, fontFamily, enabled, isPaid, icon: Icon, updating, onToggleEnable, onToggleTier }) {
  const isOff = !enabled;

  return (
    <div style={{
      background: isOff ? 'rgba(15, 18, 33, 0.4)' : 'var(--ad-input)',
      border: `1.5px solid ${isOff ? 'rgba(239, 68, 68, 0.3)' : (isPaid ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)')}`,
      borderRadius: 14, padding: '13px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      gap: 10, opacity: isOff ? 0.65 : 1, transition: 'all 0.18s ease',
      boxShadow: isPaid ? '0 2px 10px rgba(245, 158, 11, 0.08)' : '0 2px 10px rgba(16, 185, 129, 0.08)'
    }}>
      {/* Top row: Visual Thumbnail + Name + Desc */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {customPreview ? (
          customPreview
        ) : gradientFill ? (
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: gradientFill,
            border: '1.5px solid rgba(255,255,255,0.2)', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
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
            background: isOff ? 'rgba(148, 163, 184, 0.15)' : (isPaid ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(214, 0, 54, 0.15))' : 'rgba(16, 185, 129, 0.15)'),
            color: isOff ? 'var(--ad-text-sec)' : (isPaid ? '#F59E0B' : '#10B981'),
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Icon size={18} strokeWidth={2.4} />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: 'var(--ad-text)', lineHeight: 1.3,
            fontFamily: fontFamily ? `${fontFamily}, sans-serif` : 'inherit'
          }}>
            {name}
          </div>
          {desc && (
            <div style={{ fontSize: 11, color: 'var(--ad-text-sec)', marginTop: 2, lineHeight: 1.35 }}>
              {desc}
            </div>
          )}
          {badge && (
            <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'var(--ad-card)', color: 'var(--ad-text-sec)', border: '1px solid var(--ad-border)', display: 'inline-block', marginTop: 4 }}>
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar: Active Switch + 1-Click Free/Pro Toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 8, borderTop: '1px solid var(--ad-border)'
      }}>
        <button
          type="button"
          disabled={updating}
          onClick={onToggleEnable}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
            borderRadius: 7, border: `1px solid ${enabled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            background: enabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: enabled ? '#22C55E' : '#EF4444', fontSize: 10, fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer'
          }}
        >
          <Power size={10} strokeWidth={2.5} />
          <span>{enabled ? 'ACTIVE' : 'HIDDEN'}</span>
        </button>

        <button
          type="button"
          disabled={updating}
          onClick={onToggleTier}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px',
            borderRadius: 100, border: `1.5px solid ${isPaid ? '#F59E0B' : '#10B981'}`,
            background: isPaid ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF', fontSize: 10, fontWeight: 800,
            cursor: updating ? 'not-allowed' : 'pointer',
            boxShadow: isPaid ? '0 2px 8px rgba(245, 158, 11, 0.35)' : '0 2px 8px rgba(16, 185, 129, 0.35)'
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
          <span style={{ fontSize: 8, opacity: 0.8, marginLeft: 2 }}>⇄</span>
        </button>
      </div>
    </div>
  );
}
