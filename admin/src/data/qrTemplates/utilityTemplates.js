// src/data/qrTemplates/utilityTemplates.js
import { TEMPLATE_ICONS } from './templateIcons';

export const UTILITY_TEMPLATES = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'Utility',
    headline: 'VIEW FILES',
    subtitle: 'drive.google.com/yourfolder',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #1a73e8 0%, #34A853 55%, #FBBC05 100%)',
    svg: TEMPLATE_ICONS['google-drive'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Google Drive Share Link', type: 'url', placeholder: 'https://drive.google.com/drive/folders/...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'wifi',
    name: 'Wi-Fi Network',
    category: 'Utility',
    headline: 'CONNECT TO WIFI',
    subtitle: 'Network: YourWiFi',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #06283D 0%, #1363DF 55%, #47B5FF 100%)',
    svg: TEMPLATE_ICONS.wifi,
    qrType: 'wifi',
    fields: [
      { id: 'ssid', label: 'Network Name (SSID)', type: 'text', placeholder: 'MyHomeWiFi' },
      { id: 'password', label: 'Network Password', type: 'password', placeholder: '••••••••' },
      { id: 'encryption', label: 'Security Type', type: 'select', options: ['WPA', 'WEP', 'nopass'], placeholder: 'WPA' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'dots',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'menu',
    name: 'Digital Menu',
    category: 'Utility',
    headline: 'VIEW MENU',
    subtitle: 'Scan for full menu',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #4a1c02 0%, #a34a10 55%, #e08e3e 100%)',
    svg: TEMPLATE_ICONS.menu,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Online Menu URL', type: 'url', placeholder: 'https://myrestaurant.com/menu.pdf' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'app',
    name: 'App Download',
    category: 'Utility',
    headline: 'DOWNLOAD APP',
    subtitle: 'Get it on App Store / Play',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #1e0a3c 0%, #4c1d95 55%, #7c3aed 100%)',
    svg: TEMPLATE_ICONS.app,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'App Store / Play Store Link', type: 'url', placeholder: 'https://play.google.com/store/apps/details?id=...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'payment',
    name: 'Payment & Cashless',
    category: 'Utility',
    headline: 'SCAN TO PAY',
    subtitle: 'Accepted here',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #052e16 0%, #15803d 55%, #eab308 100%)',
    svg: TEMPLATE_ICONS.payment,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Payment Link / UPI / PayPal', type: 'url', placeholder: 'https://paypal.me/yourbusiness' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'location',
    name: 'Map Location',
    category: 'Utility',
    headline: 'GET DIRECTIONS',
    subtitle: 'Find us on the map',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #4c0519 0%, #be123c 55%, #fb7185 100%)',
    svg: TEMPLATE_ICONS.location,
    qrType: 'location',
    fields: [
      { id: 'latitude', label: 'Latitude', type: 'text', placeholder: '37.7749' },
      { id: 'longitude', label: 'Longitude', type: 'text', placeholder: '-122.4194' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'event',
    name: 'Calendar Event',
    category: 'Utility',
    headline: 'SAVE THE DATE',
    subtitle: 'Add to your calendar',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #2e1065 0%, #6d28d9 55%, #a78bfa 100%)',
    svg: TEMPLATE_ICONS.event,
    qrType: 'event',
    fields: [
      { id: 'title', label: 'Event Title', type: 'text', placeholder: 'Grand Opening' },
      { id: 'location', label: 'Event Location', type: 'text', placeholder: '123 Main St, New York' },
      { id: 'startDate', label: 'Start Date & Time', type: 'date', placeholder: '2026-09-01' },
      { id: 'endDate', label: 'End Date & Time', type: 'date', placeholder: '2026-09-01' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'resume',
    name: 'Resume & CV',
    category: 'Utility',
    headline: 'VIEW RESUME',
    subtitle: 'View my portfolio & resume',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0b0f19 0%, #334155 55%, #94a3b8 100%)',
    svg: TEMPLATE_ICONS.resume,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Online Resume / Portfolio Link', type: 'url', placeholder: 'https://myportfolio.com/cv.pdf' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'pdf',
    name: 'PDF Document',
    category: 'Utility',
    headline: 'VIEW DOCUMENT',
    subtitle: 'Scan to open PDF',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #2b0a0a 0%, #7f1d1d 55%, #94a3b8 100%)',
    svg: TEMPLATE_ICONS.pdf,
    qrType: 'pdf',
    fields: [
      { id: 'url', label: 'PDF Document Link', type: 'url', placeholder: 'https://example.com/document.pdf' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  },
  {
    id: 'booking',
    name: 'Booking & Reservation',
    category: 'Utility',
    headline: 'BOOK NOW',
    subtitle: 'Reserve your table / stay',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0c1b33 0%, #1e3a5f 55%, #d4af37 100%)',
    svg: TEMPLATE_ICONS.booking,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Booking URL / Calendar link', type: 'url', placeholder: 'https://opentable.com/...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'ticket',
    name: 'Event Ticket / Pass',
    category: 'Utility',
    headline: 'GET TICKETS',
    subtitle: 'Scan for your e-ticket',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #fbbf24 100%)',
    svg: TEMPLATE_ICONS.ticket,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Ticket Link / Verification URL', type: 'url', placeholder: 'https://eventbrite.com/tickets/...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }
];
