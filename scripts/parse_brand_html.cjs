const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'follow-me-brand-style-5.html'), 'utf8');

const cards = html.split('<div class="story-light"').slice(1);
console.log('Total cards extracted:', cards.length);

const templates = cards.map((card, idx) => {
  const platMatch = card.match(/data-platform="([^"]+)"/);
  const platform = platMatch ? platMatch[1] : ('template-' + (idx + 1));
  
  const bgMatch = card.match(/style="background:\s*([^;"]+)/);
  const background = bgMatch ? bgMatch[1] : '';

  const bgShapesMatch = card.match(/<svg class="bg-shapes"[^>]*>([\s\S]*?)<\/svg>/);
  const bgShapes = bgShapesMatch ? bgShapesMatch[1].trim() : '';

  const topIconMatch = card.match(/<svg class="top-icon-light"[^>]*>([\s\S]*?)<\/svg>/);
  const topIconSvg = topIconMatch ? ('<svg viewBox="0 0 24 24" fill="none">' + topIconMatch[1].trim() + '</svg>') : '';

  const badgeMatch = card.match(/<div class="badge"><span(?:\s+style="color:([^"]+)")?>([^<]*)<\/span><\/div>/);
  const badgeColor = badgeMatch ? (badgeMatch[1] || '') : '';
  const badgeText = badgeMatch ? badgeMatch[2].trim() : 'SCAN ME';

  const accentMatch = card.match(/class="qr-frame-light"\s+style="--accent:([^"]+)"/);
  const accent = accentMatch ? accentMatch[1] : '#000000';

  const userMatch = card.match(/<div class="username-row-light">[\s\S]*?<span[^>]*>([^<]*)<\/span>/);
  const username = userMatch ? userMatch[1].trim() : '@USERNAME';

  return {
    index: idx + 1,
    platform,
    background,
    badgeText,
    badgeColor,
    accent,
    username,
    bgShapes,
    topIconSvg
  };
});

fs.writeFileSync(path.join(__dirname, 'extracted_brand_templates.json'), JSON.stringify(templates, null, 2));
console.log('Extracted and saved extracted_brand_templates.json successfully. Total:', templates.length);
