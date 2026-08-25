// src/data/qrTemplates/communicationTemplates.js
import { TEMPLATE_ICONS } from './templateIcons';

export const COMMUNICATION_TEMPLATES = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Communication',
    headline: 'MESSAGE ME',
    subtitle: '+60 12-345 6789',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #075E54 0%, #128C7E 45%, #25D366 100%)',
    svg: TEMPLATE_ICONS.whatsapp,
    qrType: 'whatsapp',
    fields: [
      { id: 'phone', label: 'Phone Number (with Country Code)', type: 'tel', placeholder: '+15550199' },
      { id: 'message', label: 'Default Message (Optional)', type: 'text', placeholder: 'Hello! I scanned your QR code.' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'dots',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'message',
    name: 'SMS Message',
    category: 'Communication',
    headline: 'TEXT ME',
    subtitle: '+60 12-345 6789',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0a5fc4 0%, #0b93f6 55%, #4CD964 100%)',
    svg: TEMPLATE_ICONS.message,
    qrType: 'sms',
    fields: [
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+15550199' },
      { id: 'message', label: 'Pre-filled Text Message', type: 'text', placeholder: 'Hi there!' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'contact',
    name: 'Contact vCard',
    category: 'Communication',
    headline: 'SAVE CONTACT',
    subtitle: 'Your Name Here',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0d5c52 0%, #11998e 55%, #38ef7d 100%)',
    svg: TEMPLATE_ICONS.contact,
    qrType: 'vcard',
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Jane' },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 555-0199' },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com' },
      { id: 'org', label: 'Company / Organization', type: 'text', placeholder: 'Acme Inc' },
      { id: 'title', label: 'Job Title', type: 'text', placeholder: 'Product Designer' },
      { id: 'url', label: 'Website / Portfolio', type: 'url', placeholder: 'https://example.com' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'email',
    name: 'Email',
    category: 'Communication',
    headline: 'EMAIL ME',
    subtitle: 'you@example.com',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #6a1b9a 0%, #8E2DE2 55%, #4A00E0 100%)',
    svg: TEMPLATE_ICONS.email,
    qrType: 'email',
    fields: [
      { id: 'email', label: 'Recipient Email Address', type: 'email', placeholder: 'you@example.com' },
      { id: 'subject', label: 'Email Subject Line', type: 'text', placeholder: 'Inquiry from QR code' },
      { id: 'body', label: 'Default Message Body', type: 'textarea', placeholder: 'Hello, I would like to get in touch regarding...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }
];
