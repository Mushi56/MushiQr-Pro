// src/data/qrTemplates/businessTemplates.js
import { TEMPLATE_ICONS } from './templateIcons';

export const BUSINESS_TEMPLATES = [
  {
    id: 'google',
    name: 'Google Review',
    category: 'Business',
    headline: 'REVIEW US',
    subtitle: '@YOURBUSINESS',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #e8eaed 0%, #ffffff 60%, #e8eaed 100%)',
    svg: TEMPLATE_ICONS.google,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Google Review / Maps Link', type: 'url', placeholder: 'https://g.page/r/yourbusiness/review' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'website',
    name: 'Website',
    category: 'Business',
    headline: 'VISIT WEBSITE',
    subtitle: 'www.yourwebsite.com',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #003c30 0%, #0f766e 55%, #2dd4bf 100%)',
    svg: TEMPLATE_ICONS.website,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Website URL', type: 'url', placeholder: 'https://www.yourwebsite.com' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  },
  {
    id: 'yelp',
    name: 'Yelp',
    category: 'Business',
    headline: 'REVIEW US',
    subtitle: 'yelp.com/biz/yourbusiness',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #3d0a0a 0%, #D32323 55%, #FF6F61 100%)',
    svg: TEMPLATE_ICONS.yelp,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Yelp Business URL', type: 'url', placeholder: 'https://yelp.com/biz/yourbusiness' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'etsy',
    name: 'Etsy',
    category: 'Business',
    headline: 'SHOP NOW',
    subtitle: 'etsy.com/shop/yourshop',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #3d1f00 0%, #F1641E 55%, #FFB238 100%)',
    svg: TEMPLATE_ICONS.etsy,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Etsy Store Link', type: 'url', placeholder: 'https://etsy.com/shop/yourshop' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Business',
    headline: 'SHOP NOW',
    subtitle: 'amazon.com/shops/yourstore',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0f1c2e 0%, #232f3e 55%, #FF9900 100%)',
    svg: TEMPLATE_ICONS.amazon,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Amazon Store / Product URL', type: 'url', placeholder: 'https://amazon.com/shops/yourstore' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    category: 'Business',
    headline: 'RATE US',
    subtitle: 'trustpilot.com/review/yoursite',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #012a1f 0%, #00623f 55%, #00B67A 100%)',
    svg: TEMPLATE_ICONS.trustpilot,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Trustpilot Review URL', type: 'url', placeholder: 'https://trustpilot.com/review/yoursite' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'businesscard',
    name: 'Business Card',
    category: 'Business',
    headline: 'SAVE MY CARD',
    subtitle: 'Your Name — Your Title',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0b1d33 0%, #1f3b57 55%, #c9a227 100%)',
    svg: TEMPLATE_ICONS.businesscard,
    qrType: 'vcard',
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
      { id: 'title', label: 'Job Title', type: 'text', placeholder: 'CEO / Founder' },
      { id: 'org', label: 'Company Name', type: 'text', placeholder: 'Acme Corp' },
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 555-0199' },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
      { id: 'url', label: 'Website', type: 'url', placeholder: 'https://example.com' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'linkhub',
    name: 'Link Hub',
    category: 'Business',
    headline: 'ALL MY LINKS',
    subtitle: '@yourusername',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #4c1d95 0%, #be185d 45%, #f97316 75%, #eab308 100%)',
    svg: TEMPLATE_ICONS.linkhub,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Link Hub / Bio Link URL', type: 'url', placeholder: 'https://linktr.ee/yourname' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'dots',
      eyeStyle: 'rounded'
    }
  }
];
