// src/data/qrTemplates/index.js
// Master registry of all templates — standard categories + vCard

import { SOCIAL_TEMPLATES }         from './socialTemplates';
import { BUSINESS_TEMPLATES }       from './businessTemplates';
import { COMMUNICATION_TEMPLATES }  from './communicationTemplates';
import { MARKETING_TEMPLATES }      from './marketingTemplates';
import { UTILITY_TEMPLATES }        from './utilityTemplates';
import { BRAND_TEMPLATES }          from './brandTemplates';
import { VCARD_TEMPLATES }          from './vcardTemplates';

export const TEMPLATE_CATEGORIES = [
  'All',
  'Social Media',
  'Business',
  'Communication',
  'Marketing',
  'Utility',
  'vCard'
];

export const ALL_TEMPLATES_REGISTRY = [
  ...SOCIAL_TEMPLATES,
  ...BUSINESS_TEMPLATES,
  ...COMMUNICATION_TEMPLATES,
  ...MARKETING_TEMPLATES,
  ...UTILITY_TEMPLATES,
  ...BRAND_TEMPLATES,
  ...VCARD_TEMPLATES
];

// For backward compatibility
export const ALL_50_TEMPLATES = ALL_TEMPLATES_REGISTRY;

export function getTemplateById(id) {
  if (!id) return null;
  return ALL_TEMPLATES_REGISTRY.find(t => t.id === id) || null;
}

export function searchTemplates(query = '', category = 'All') {
  const q = query.trim().toLowerCase();
  return ALL_TEMPLATES_REGISTRY.filter(template => {
    const matchesCategory = category === 'All' || template.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;

    const matchName     = (template.name     || '').toLowerCase().includes(q);
    const matchId       = (template.id       || '').toLowerCase().includes(q);
    const matchCategory = (template.category || '').toLowerCase().includes(q);
    const matchHeadline = (template.headline || '').toLowerCase().includes(q);
    const matchSubtitle = (template.subtitle || '').toLowerCase().includes(q);

    return matchName || matchId || matchCategory || matchHeadline || matchSubtitle;
  });
}

export {
  SOCIAL_TEMPLATES,
  BUSINESS_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  MARKETING_TEMPLATES,
  UTILITY_TEMPLATES,
  BRAND_TEMPLATES,
  VCARD_TEMPLATES
};
