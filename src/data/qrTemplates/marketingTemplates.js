// src/data/qrTemplates/marketingTemplates.js
import { TEMPLATE_ICONS } from './templateIcons';

export const MARKETING_TEMPLATES = [
  {
    id: 'coupon',
    name: 'Coupon & Discount',
    category: 'Marketing',
    headline: 'CLAIM OFFER',
    subtitle: 'Limited time discount',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #4a0404 0%, #dc2626 55%, #f97373 100%)',
    svg: TEMPLATE_ICONS.coupon,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Promo Offer / Coupon URL', type: 'url', placeholder: 'https://myshop.com/promo/20off' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'feedback',
    name: 'Customer Feedback',
    category: 'Marketing',
    headline: 'LEAVE FEEDBACK',
    subtitle: 'We value your review',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #4a2c02 0%, #b45309 55%, #fbbf24 100%)',
    svg: TEMPLATE_ICONS.feedback,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Feedback Form / Survey URL', type: 'url', placeholder: 'https://forms.gle/feedbackform' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'video',
    name: 'Promotional Video',
    category: 'Marketing',
    headline: 'WATCH VIDEO',
    subtitle: 'Scan to play',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #1a0505 0%, #7f1d1d 55%, #262626 100%)',
    svg: TEMPLATE_ICONS.video,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Video Stream / Landing Page URL', type: 'url', placeholder: 'https://youtube.com/watch?v=...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'survey',
    name: 'Survey',
    category: 'Marketing',
    headline: 'TAKE SURVEY',
    subtitle: 'Your feedback matters',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #a5b4fc 100%)',
    svg: TEMPLATE_ICONS.survey,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Survey Link / Questionnaire', type: 'url', placeholder: 'https://surveymonkey.com/r/...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'loyalty',
    name: 'Loyalty & Rewards',
    category: 'Marketing',
    headline: 'JOIN REWARDS',
    subtitle: 'Earn points every visit',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #3b0a45 0%, #a21caf 55%, #facc15 100%)',
    svg: TEMPLATE_ICONS.loyalty,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Loyalty Program Join Link', type: 'url', placeholder: 'https://brand.com/rewards' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'donation',
    name: 'Donation & Cause',
    category: 'Marketing',
    headline: 'DONATE NOW',
    subtitle: 'Support our cause',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #500724 0%, #be185d 55%, #fb7185 100%)',
    svg: TEMPLATE_ICONS.donation,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Donation Campaign / PayPal Link', type: 'url', placeholder: 'https://paypal.me/yourcause' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    category: 'Marketing',
    headline: 'SUBSCRIBE',
    subtitle: 'Join our newsletter',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #022c22 0%, #0d9488 55%, #5eead4 100%)',
    svg: TEMPLATE_ICONS.newsletter,
    qrType: 'email',
    fields: [
      { id: 'email', label: 'Newsletter Signup Email Address', type: 'email', placeholder: 'newsletter@yourdomain.com' },
      { id: 'subject', label: 'Email Subject', type: 'text', placeholder: 'Subscribe to Newsletter' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }
];
