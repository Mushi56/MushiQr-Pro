// src/data/qrTemplates/brandTemplates.js
// 50 Professional Brand Style Templates from follow-me-brand-style-5.html
// Matching exact template names, categories, and top headlines with dynamic geometric/fluid accent shapes

import { TEMPLATE_ICONS } from './templateIcons';

export const BRAND_TEMPLATES = [
  {
    id: 'brand-google',
    baseId: 'google',
    name: 'Google Review (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'REVIEW US',
    subtitle: '@YOURBUSINESS',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%)',
    bgShapes: "<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#FBBC05\" opacity=\"0.35\"/>\n<line x1=\"217.5\" y1=\"8.0\" x2=\"193.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"239.0,76.1 239.0,103.9 215.0,117.7 191.0,103.9 191.0,76.1 215.0,62.3\" fill=\"none\" stroke=\"#4285F4\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"244.3\" y1=\"8.0\" x2=\"220.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"266.0,272.3 260.5,300.9 238.5,281.8\" fill=\"#FBBC05\" opacity=\"0.7\"/>\n<polygon points=\"39.9,267.0 40.6,302.5 9.5,285.5\" fill=\"#34A853\" opacity=\"0.75\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#34A853\" opacity=\"0.3\"/>\n<line x1=\"231.7\" y1=\"8.0\" x2=\"207.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"259.0\" y1=\"8.0\" x2=\"235.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#FBBC05\" opacity=\"0.4\"/>\n<polygon points=\"69.8,226.5 76.6,289.6 18.6,263.9\" fill=\"#4285F4\" opacity=\"0.9\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#4285F4\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"121.4,13.1 129.6,32.1 109.0,29.8\" fill=\"#34A853\" opacity=\"0.6\"/>\n<line x1=\"203.2\" y1=\"8.0\" x2=\"179.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#4285F4\" opacity=\"0.4\"/>\n<polygon points=\"259.6,19.1 275.1,62.0 230.3,53.9\" fill=\"#FBBC05\" opacity=\"0.85\"/>\n<polygon points=\"96.5,268.7 97.7,310.6 60.8,290.7\" fill=\"#FBBC05\" opacity=\"0.8\"/>\n<polygon points=\"32.1,228.0 32.1,242.0 20.0,249.0 7.9,242.0 7.9,228.0 20.0,221.0\" fill=\"none\" stroke=\"#4285F4\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"23.4,126.8 13.6,138.9 8.0,124.3\" fill=\"#34A853\" opacity=\"0.55\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#34A853\" opacity=\"0.85\" transform=\"rotate(-30.20885467603628 300.0 173.0)\"/>\n<polygon points=\"290.0,207.3 290.0,232.7 268.0,245.4 246.0,232.7 246.0,207.3 268.0,194.6\" fill=\"#4285F4\" stroke=\"#4285F4\" stroke-width=\"1.6\" opacity=\"1.0\"/>",
    svg: TEMPLATE_ICONS['google'] || TEMPLATE_ICONS['google'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-whatsapp',
    baseId: 'whatsapp',
    name: 'WhatsApp (Brand Style)',
    category: 'Communication',
    styleFamily: 'brand',
    headline: 'MESSAGE ME',
    subtitle: '+60 12-345 6789',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)',
    bgShapes: "<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#075E54\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"21.6,123.9 17.0,138.8 6.4,127.4\" fill=\"#128C7E\" opacity=\"0.55\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#128C7E\" opacity=\"0.3\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#128C7E\" opacity=\"0.85\" transform=\"rotate(-37.16314911907107 300.0 173.0)\"/>\n<line x1=\"244.4\" y1=\"8.0\" x2=\"220.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#25D366\" opacity=\"0.35\"/>\n<line x1=\"218.7\" y1=\"8.0\" x2=\"194.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"234.4\" y1=\"8.0\" x2=\"210.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"40.3,268.8 38.9,302.0 10.8,284.2\" fill=\"#128C7E\" opacity=\"0.75\"/>\n<polygon points=\"102.5,272.1 91.7,314.0 60.8,283.8\" fill=\"#25D366\" opacity=\"0.8\"/>\n<polygon points=\"264.0,274.2 259.8,298.2 241.2,282.6\" fill=\"#25D366\" opacity=\"0.7\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#075E54\" opacity=\"0.4\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#25D366\" opacity=\"0.4\"/>\n<polygon points=\"266.2,16.5 274.0,68.9 224.7,49.5\" fill=\"#25D366\" opacity=\"0.85\"/>\n<polygon points=\"34.6,226.6 34.6,243.4 20.0,251.8 5.4,243.4 5.4,226.6 20.0,218.2\" fill=\"none\" stroke=\"#075E54\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"290.9,206.8 290.9,233.2 268.0,246.5 245.1,233.2 245.1,206.8 268.0,193.5\" fill=\"#075E54\" stroke=\"#075E54\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"75.5,233.6 67.6,290.9 21.9,255.4\" fill=\"#075E54\" opacity=\"0.9\"/>\n<polygon points=\"120.2,13.0 130.3,31.2 109.5,30.8\" fill=\"#128C7E\" opacity=\"0.6\"/>\n<line x1=\"202.6\" y1=\"8.0\" x2=\"178.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"236.2,77.8 236.2,102.2 215.0,114.4 193.8,102.2 193.8,77.8 215.0,65.6\" fill=\"none\" stroke=\"#075E54\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"259.1\" y1=\"8.0\" x2=\"235.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['whatsapp'] || TEMPLATE_ICONS['whatsapp'] || TEMPLATE_ICONS['website'],
    qrType: 'whatsapp',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-facebook',
    baseId: 'facebook',
    name: 'Facebook (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'FOLLOW ME',
    subtitle: '@YOURPAGE',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0d47a1 0%, #1877F2 50%, #42a5f5 100%)',
    bgShapes: "<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#0d47a1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#1877F2\" opacity=\"0.4\"/>\n<polygon points=\"264.8,274.6 259.1,298.7 241.1,281.7\" fill=\"#0d47a1\" opacity=\"0.7\"/>\n<line x1=\"261.1\" y1=\"8.0\" x2=\"237.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"46.5,268.4 36.1,307.6 7.3,279.0\" fill=\"#42a5f5\" opacity=\"0.75\"/>\n<line x1=\"221.4\" y1=\"8.0\" x2=\"197.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"128.4,16.5 123.2,36.6 108.4,22.0\" fill=\"#42a5f5\" opacity=\"0.6\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#42a5f5\" opacity=\"0.85\" transform=\"rotate(-33.77389292724609 300.0 173.0)\"/>\n<polygon points=\"261.9,14.4 278.0,66.3 225.1,54.3\" fill=\"#0d47a1\" opacity=\"0.85\"/>\n<polygon points=\"18.9,121.9 20.0,137.4 6.0,130.6\" fill=\"#42a5f5\" opacity=\"0.55\"/>\n<line x1=\"230.4\" y1=\"8.0\" x2=\"206.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"204.7\" y1=\"8.0\" x2=\"180.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"291.0,206.7 291.0,233.3 268.0,246.5 245.0,233.3 245.0,206.7 268.0,193.5\" fill=\"#1877F2\" stroke=\"#1877F2\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"236.8,77.4 236.8,102.6 215.0,115.2 193.2,102.6 193.2,77.4 215.0,64.8\" fill=\"none\" stroke=\"#1877F2\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"62.8,226.3 80.3,283.6 21.9,270.1\" fill=\"#1877F2\" opacity=\"0.9\"/>\n<polygon points=\"89.0,267.0 103.0,305.0 63.1,298.1\" fill=\"#0d47a1\" opacity=\"0.8\"/>\n<line x1=\"249.2\" y1=\"8.0\" x2=\"225.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#1877F2\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#42a5f5\" opacity=\"0.3\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#0d47a1\" opacity=\"0.4\"/>\n<polygon points=\"34.1,226.8 34.1,243.2 20.0,251.3 5.9,243.2 5.9,226.8 20.0,218.7\" fill=\"none\" stroke=\"#1877F2\" stroke-width=\"1.6\" opacity=\"0.5\"/>",
    svg: TEMPLATE_ICONS['facebook'] || TEMPLATE_ICONS['facebook'] || TEMPLATE_ICONS['website'],
    qrType: 'facebook',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-threads',
    baseId: 'threads',
    name: 'Threads (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'FOLLOW ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0e0e0e 0%, #2b2b2b 50%, #4a4a4a 100%)',
    bgShapes: "<line x1=\"231.2\" y1=\"8.0\" x2=\"207.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"33.6,227.2 33.6,242.8 20.0,250.7 6.4,242.8 6.4,227.2 20.0,219.3\" fill=\"none\" stroke=\"#4a4a4a\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"203.2\" y1=\"8.0\" x2=\"179.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"287.4,208.8 287.4,231.2 268.0,242.5 248.6,231.2 248.6,208.8 268.0,197.5\" fill=\"#4a4a4a\" stroke=\"#4a4a4a\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"130.1,18.5 120.6,37.0 109.3,19.5\" fill=\"#2b2b2b\" opacity=\"0.6\"/>\n<polygon points=\"258.3,18.4 276.4,61.2 230.3,55.4\" fill=\"#0e0e0e\" opacity=\"0.85\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#2b2b2b\" opacity=\"0.85\" transform=\"rotate(-35.69002724058643 300.0 173.0)\"/>\n<polygon points=\"257.3,268.6 268.1,295.2 239.6,291.2\" fill=\"#0e0e0e\" opacity=\"0.7\"/>\n<line x1=\"246.3\" y1=\"8.0\" x2=\"222.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"41.4,267.4 39.6,303.6 9.1,284.0\" fill=\"#2b2b2b\" opacity=\"0.75\"/>\n<polygon points=\"85.4,263.1 108.2,303.8 61.5,303.2\" fill=\"#0e0e0e\" opacity=\"0.8\"/>\n<line x1=\"258.9\" y1=\"8.0\" x2=\"234.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"68.8,225.1 78.4,289.4 17.9,265.5\" fill=\"#4a4a4a\" opacity=\"0.9\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#0e0e0e\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#2b2b2b\" opacity=\"0.3\"/>\n<polygon points=\"238.3,76.5 238.3,103.5 215.0,116.9 191.7,103.5 191.7,76.5 215.0,63.1\" fill=\"none\" stroke=\"#4a4a4a\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#4a4a4a\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"218.4\" y1=\"8.0\" x2=\"194.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"18.0,121.5 20.9,136.8 6.2,131.7\" fill=\"#2b2b2b\" opacity=\"0.55\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#0e0e0e\" opacity=\"0.4\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#4a4a4a\" opacity=\"0.4\"/>",
    svg: TEMPLATE_ICONS['threads'] || TEMPLATE_ICONS['threads'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-x',
    baseId: 'x',
    name: 'X (Twitter) (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'FOLLOW ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #333333 100%)',
    bgShapes: "<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#000000\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"218.3\" y1=\"8.0\" x2=\"194.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#1a1a1a\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#333333\" opacity=\"0.35\"/>\n<polygon points=\"32.9,227.5 32.9,242.5 20.0,249.9 7.1,242.5 7.1,227.5 20.0,220.1\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"246.7\" y1=\"8.0\" x2=\"222.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"232.7\" y1=\"8.0\" x2=\"208.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"259.0\" y1=\"8.0\" x2=\"235.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"267.6,16.6 273.3,70.1 224.1,48.3\" fill=\"#333333\" opacity=\"0.85\"/>\n<polygon points=\"97.3,266.4 99.3,312.5 58.4,291.1\" fill=\"#333333\" opacity=\"0.8\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#1a1a1a\" opacity=\"0.85\" transform=\"rotate(-35.20639698447781 300.0 173.0)\"/>\n<polygon points=\"237.4,77.0 237.4,103.0 215.0,115.9 192.6,103.0 192.6,77.0 215.0,64.1\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"130.3,18.9 120.1,37.0 109.6,19.1\" fill=\"#1a1a1a\" opacity=\"0.6\"/>\n<polygon points=\"46.1,272.9 32.4,305.0 11.5,277.1\" fill=\"#1a1a1a\" opacity=\"0.75\"/>\n<polygon points=\"17.0,121.2 21.6,136.1 6.4,132.6\" fill=\"#1a1a1a\" opacity=\"0.55\"/>\n<polygon points=\"76.6,229.8 70.4,293.8 18.0,256.4\" fill=\"#000000\" opacity=\"0.9\"/>\n<polygon points=\"259.8,269.7 265.9,296.8 239.3,288.5\" fill=\"#333333\" opacity=\"0.7\"/>\n<polygon points=\"290.3,207.1 290.3,232.9 268.0,245.8 245.7,232.9 245.7,207.1 268.0,194.2\" fill=\"#000000\" stroke=\"#000000\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#000000\" opacity=\"0.4\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#333333\" opacity=\"0.4\"/>\n<line x1=\"206.6\" y1=\"8.0\" x2=\"182.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['x'] || TEMPLATE_ICONS['x'] || TEMPLATE_ICONS['website'],
    qrType: 'x',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-youtube',
    baseId: 'youtube',
    name: 'YouTube (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'SUBSCRIBE',
    subtitle: '@YOURCHANNEL',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #7a0c10 0%, #b31217 50%, #FF0000 100%)',
    bgShapes: "<polygon points=\"44.5,267.7 37.7,306.2 7.8,281.1\" fill=\"#b31217\" opacity=\"0.75\"/>\n<polygon points=\"257.3,268.3 268.3,295.4 239.4,291.3\" fill=\"#7a0c10\" opacity=\"0.7\"/>\n<polygon points=\"120.1,13.0 130.4,31.1 109.6,30.9\" fill=\"#b31217\" opacity=\"0.6\"/>\n<line x1=\"248.4\" y1=\"8.0\" x2=\"224.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#b31217\" opacity=\"0.85\" transform=\"rotate(-35.695125835752116 300.0 173.0)\"/>\n<polygon points=\"264.0,19.2 272.8,65.7 228.2,50.0\" fill=\"#7a0c10\" opacity=\"0.85\"/>\n<polygon points=\"237.6,77.0 237.6,103.0 215.0,116.1 192.4,103.0 192.4,77.0 215.0,63.9\" fill=\"none\" stroke=\"#FF0000\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"18.4,121.7 20.5,137.1 6.1,131.2\" fill=\"#b31217\" opacity=\"0.55\"/>\n<line x1=\"233.0\" y1=\"8.0\" x2=\"209.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#FF0000\" opacity=\"0.4\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#7a0c10\" opacity=\"0.4\"/>\n<polygon points=\"34.2,226.8 34.2,243.2 20.0,251.4 5.8,243.2 5.8,226.8 20.0,218.6\" fill=\"none\" stroke=\"#FF0000\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"61.4,230.1 77.7,280.5 25.9,269.4\" fill=\"#FF0000\" opacity=\"0.9\"/>\n<line x1=\"205.5\" y1=\"8.0\" x2=\"181.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#FF0000\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#7a0c10\" opacity=\"0.35\"/>\n<line x1=\"263.3\" y1=\"8.0\" x2=\"239.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"288.1,208.4 288.1,231.6 268.0,243.2 247.9,231.6 247.9,208.4 268.0,196.8\" fill=\"#FF0000\" stroke=\"#FF0000\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"220.9\" y1=\"8.0\" x2=\"196.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#b31217\" opacity=\"0.3\"/>\n<polygon points=\"108.3,273.7 87.4,318.4 59.2,277.9\" fill=\"#7a0c10\" opacity=\"0.8\"/>",
    svg: TEMPLATE_ICONS['youtube'] || TEMPLATE_ICONS['youtube'] || TEMPLATE_ICONS['website'],
    qrType: 'youtube',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-tiktok',
    baseId: 'tiktok',
    name: 'TikTok (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'FOLLOW ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #010101 0%, #131313 33%, #35163f 66%, #001a1a 100%)',
    bgShapes: "<polygon points=\"101.4,270.6 93.6,313.9 60.0,285.4\" fill=\"#131313\" opacity=\"0.8\"/>\n<polygon points=\"123.7,13.6 128.1,33.9 108.3,27.5\" fill=\"#35163f\" opacity=\"0.6\"/>\n<polygon points=\"258.7,13.0 280.8,64.1 225.5,57.8\" fill=\"#131313\" opacity=\"0.85\"/>\n<polygon points=\"291.2,206.6 291.2,233.4 268.0,246.8 244.8,233.4 244.8,206.6 268.0,193.2\" fill=\"#010101\" stroke=\"#010101\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"203.0\" y1=\"8.0\" x2=\"179.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#35163f\" opacity=\"0.3\"/>\n<line x1=\"216.0\" y1=\"8.0\" x2=\"192.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#131313\" opacity=\"0.35\"/>\n<line x1=\"259.2\" y1=\"8.0\" x2=\"235.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#35163f\" opacity=\"0.85\" transform=\"rotate(-37.17400580499325 300.0 173.0)\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#010101\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"263.0,274.7 259.9,297.1 242.1,283.2\" fill=\"#131313\" opacity=\"0.7\"/>\n<polygon points=\"237.9,76.8 237.9,103.2 215.0,116.5 192.1,103.2 192.1,76.8 215.0,63.5\" fill=\"none\" stroke=\"#010101\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#131313\" opacity=\"0.4\"/>\n<polygon points=\"73.0,231.4 70.7,289.8 21.3,258.7\" fill=\"#010101\" opacity=\"0.9\"/>\n<polygon points=\"23.6,127.4 12.9,138.8 8.5,123.8\" fill=\"#35163f\" opacity=\"0.55\"/>\n<polygon points=\"35.5,264.9 44.6,299.8 9.9,290.3\" fill=\"#35163f\" opacity=\"0.75\"/>\n<line x1=\"244.1\" y1=\"8.0\" x2=\"220.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#010101\" opacity=\"0.4\"/>\n<polygon points=\"34.7,226.5 34.7,243.5 20.0,252.0 5.3,243.5 5.3,226.5 20.0,218.0\" fill=\"none\" stroke=\"#010101\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"230.2\" y1=\"8.0\" x2=\"206.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['tiktok'] || TEMPLATE_ICONS['tiktok'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-linkedin',
    baseId: 'linkedin',
    name: 'LinkedIn (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'CONNECT',
    subtitle: '@YOURPROFILE',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #004182 0%, #0A66C2 50%, #0084bf 100%)',
    bgShapes: "<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0084bf\" opacity=\"0.4\"/>\n<polygon points=\"288.7,208.1 288.7,231.9 268.0,243.9 247.3,231.9 247.3,208.1 268.0,196.1\" fill=\"#0084bf\" stroke=\"#0084bf\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#0A66C2\" opacity=\"0.35\"/>\n<line x1=\"202.7\" y1=\"8.0\" x2=\"178.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"72.0,228.9 73.4,290.3 19.6,260.8\" fill=\"#0084bf\" opacity=\"0.9\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0084bf\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"221.0\" y1=\"8.0\" x2=\"197.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"235.9\" y1=\"8.0\" x2=\"211.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#0A66C2\" opacity=\"0.4\"/>\n<polygon points=\"123.4,13.5 128.3,33.7 108.3,27.8\" fill=\"#004182\" opacity=\"0.6\"/>\n<polygon points=\"257.7,268.0 268.4,295.8 238.9,291.2\" fill=\"#0A66C2\" opacity=\"0.7\"/>\n<polygon points=\"86.0,266.2 105.1,302.8 63.9,301.0\" fill=\"#0A66C2\" opacity=\"0.8\"/>\n<polygon points=\"236.6,77.5 236.6,102.5 215.0,115.0 193.4,102.5 193.4,77.5 215.0,65.0\" fill=\"none\" stroke=\"#0084bf\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"18.4,121.7 20.5,137.1 6.1,131.2\" fill=\"#004182\" opacity=\"0.55\"/>\n<line x1=\"258.8\" y1=\"8.0\" x2=\"234.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"46.0,274.0 31.5,304.3 12.5,276.6\" fill=\"#004182\" opacity=\"0.75\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#004182\" opacity=\"0.3\"/>\n<polygon points=\"265.2,13.3 277.4,69.7 222.5,52.0\" fill=\"#0A66C2\" opacity=\"0.85\"/>\n<line x1=\"248.3\" y1=\"8.0\" x2=\"224.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#004182\" opacity=\"0.85\" transform=\"rotate(-32.867241506495006 300.0 173.0)\"/>\n<polygon points=\"33.9,227.0 33.9,243.0 20.0,251.0 6.1,243.0 6.1,227.0 20.0,219.0\" fill=\"none\" stroke=\"#0084bf\" stroke-width=\"1.6\" opacity=\"0.5\"/>",
    svg: TEMPLATE_ICONS['linkedin'] || TEMPLATE_ICONS['linkedin'] || TEMPLATE_ICONS['website'],
    qrType: 'linkedin',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-reddit',
    baseId: 'reddit',
    name: 'Reddit (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'JOIN US',
    subtitle: 'r/YOURSUBREDDIT',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #ad3b00 0%, #FF4500 50%, #ff7a3d 100%)',
    bgShapes: "<line x1=\"204.6\" y1=\"8.0\" x2=\"180.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"124.2,13.8 127.6,34.3 108.2,27.0\" fill=\"#FF4500\" opacity=\"0.6\"/>\n<polygon points=\"18.1,121.5 20.8,136.9 6.1,131.6\" fill=\"#FF4500\" opacity=\"0.55\"/>\n<polygon points=\"260.9,11.8 280.8,66.8 223.3,56.5\" fill=\"#ad3b00\" opacity=\"0.85\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#ad3b00\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#ad3b00\" opacity=\"0.4\"/>\n<line x1=\"249.0\" y1=\"8.0\" x2=\"225.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#ff7a3d\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"99.3,270.5 94.8,312.1 61.0,287.4\" fill=\"#ad3b00\" opacity=\"0.8\"/>\n<polygon points=\"288.0,208.5 288.0,231.5 268.0,243.0 248.0,231.5 248.0,208.5 268.0,197.0\" fill=\"#ff7a3d\" stroke=\"#ff7a3d\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"259.1\" y1=\"8.0\" x2=\"235.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"35.3,226.1 35.3,243.9 20.0,252.7 4.7,243.9 4.7,226.1 20.0,217.3\" fill=\"none\" stroke=\"#ff7a3d\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"230.4\" y1=\"8.0\" x2=\"206.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"74.1,228.8 72.4,292.2 18.4,259.0\" fill=\"#ff7a3d\" opacity=\"0.9\"/>\n<line x1=\"217.3\" y1=\"8.0\" x2=\"193.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"236.9,77.3 236.9,102.7 215.0,115.3 193.1,102.7 193.1,77.3 215.0,64.7\" fill=\"none\" stroke=\"#ff7a3d\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#FF4500\" opacity=\"0.85\" transform=\"rotate(-33.657823567814546 300.0 173.0)\"/>\n<polygon points=\"42.4,263.4 42.5,306.5 5.1,285.1\" fill=\"#FF4500\" opacity=\"0.75\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#ff7a3d\" opacity=\"0.4\"/>\n<polygon points=\"262.7,271.3 263.0,298.5 239.3,285.2\" fill=\"#ad3b00\" opacity=\"0.7\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#FF4500\" opacity=\"0.3\"/>",
    svg: TEMPLATE_ICONS['reddit'] || TEMPLATE_ICONS['reddit'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-discord',
    baseId: 'discord',
    name: 'Discord (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'JOIN US',
    subtitle: 'discord.gg/yourinvite',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #2b2f77 0%, #404EED 50%, #5865F2 100%)',
    bgShapes: "<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#5865F2\" opacity=\"0.3\"/>\n<line x1=\"204.9\" y1=\"8.0\" x2=\"180.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"256.7,267.9 268.9,295.0 239.4,292.1\" fill=\"#2b2f77\" opacity=\"0.7\"/>\n<polygon points=\"286.8,209.1 286.8,230.9 268.0,241.7 249.2,230.9 249.2,209.1 268.0,198.3\" fill=\"#404EED\" stroke=\"#404EED\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"22.6,125.1 15.4,139.0 7.0,125.9\" fill=\"#5865F2\" opacity=\"0.55\"/>\n<polygon points=\"98.1,266.9 98.4,312.9 58.4,290.2\" fill=\"#2b2f77\" opacity=\"0.8\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#404EED\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"258.9\" y1=\"8.0\" x2=\"234.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#2b2f77\" opacity=\"0.4\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#2b2f77\" opacity=\"0.35\"/>\n<line x1=\"230.1\" y1=\"8.0\" x2=\"206.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"263.2,12.7 278.9,68.3 222.9,54.0\" fill=\"#2b2f77\" opacity=\"0.85\"/>\n<line x1=\"221.3\" y1=\"8.0\" x2=\"197.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#404EED\" opacity=\"0.4\"/>\n<polygon points=\"237.6,77.0 237.6,103.0 215.0,116.0 192.4,103.0 192.4,77.0 215.0,64.0\" fill=\"none\" stroke=\"#404EED\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"125.9,14.6 126.1,35.3 108.0,25.1\" fill=\"#5865F2\" opacity=\"0.6\"/>\n<polygon points=\"44.9,272.9 33.0,303.9 12.1,278.1\" fill=\"#5865F2\" opacity=\"0.75\"/>\n<line x1=\"248.4\" y1=\"8.0\" x2=\"224.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#5865F2\" opacity=\"0.85\" transform=\"rotate(-38.71252131467585 300.0 173.0)\"/>\n<polygon points=\"35.5,226.0 35.5,244.0 20.0,252.9 4.5,244.0 4.5,226.0 20.0,217.1\" fill=\"none\" stroke=\"#404EED\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"73.4,228.3 73.2,291.8 18.4,259.9\" fill=\"#404EED\" opacity=\"0.9\"/>",
    svg: TEMPLATE_ICONS['discord'] || TEMPLATE_ICONS['discord'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-spotify',
    baseId: 'spotify',
    name: 'Spotify (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'LISTEN NOW',
    subtitle: '@YOURARTISTNAME',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0f2a1a 0%, #145c33 50%, #1DB954 100%)',
    bgShapes: "<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#1DB954\" opacity=\"0.85\" transform=\"rotate(-39.76560739462449 300.0 173.0)\"/>\n<polygon points=\"23.9,129.0 11.4,138.2 9.7,122.7\" fill=\"#1DB954\" opacity=\"0.55\"/>\n<polygon points=\"264.7,272.1 261.3,299.8 239.0,283.0\" fill=\"#145c33\" opacity=\"0.7\"/>\n<polygon points=\"265.3,19.3 272.1,66.8 227.6,48.9\" fill=\"#145c33\" opacity=\"0.85\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0f2a1a\" opacity=\"0.4\"/>\n<line x1=\"218.8\" y1=\"8.0\" x2=\"194.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"35.0,261.9 47.5,300.9 7.5,292.2\" fill=\"#1DB954\" opacity=\"0.75\"/>\n<polygon points=\"120.8,13.0 130.0,31.7 109.2,30.3\" fill=\"#1DB954\" opacity=\"0.6\"/>\n<polygon points=\"238.4,76.5 238.4,103.5 215.0,117.1 191.6,103.5 191.6,76.5 215.0,62.9\" fill=\"none\" stroke=\"#0f2a1a\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#145c33\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#145c33\" opacity=\"0.4\"/>\n<polygon points=\"67.9,229.6 74.9,286.4 22.2,264.0\" fill=\"#0f2a1a\" opacity=\"0.9\"/>\n<line x1=\"248.0\" y1=\"8.0\" x2=\"224.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"259.5\" y1=\"8.0\" x2=\"235.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#1DB954\" opacity=\"0.3\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0f2a1a\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"100.5,268.6 95.8,314.1 58.7,287.3\" fill=\"#145c33\" opacity=\"0.8\"/>\n<line x1=\"202.1\" y1=\"8.0\" x2=\"178.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"288.9,207.9 288.9,232.1 268.0,244.2 247.1,232.1 247.1,207.9 268.0,195.8\" fill=\"#0f2a1a\" stroke=\"#0f2a1a\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"35.2,226.2 35.2,243.8 20.0,252.5 4.8,243.8 4.8,226.2 20.0,217.5\" fill=\"none\" stroke=\"#0f2a1a\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"230.5\" y1=\"8.0\" x2=\"206.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['spotify'] || TEMPLATE_ICONS['spotify'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-snapchat',
    baseId: 'snapchat',
    name: 'Snapchat (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'ADD ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #a69f4d 0%, #FFF477 50%, #fff7a0 100%)',
    bgShapes: "<line x1=\"262.4\" y1=\"8.0\" x2=\"238.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"40.6,266.4 40.8,303.5 8.5,285.1\" fill=\"#FFFC00\" opacity=\"0.75\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#FFFC00\" opacity=\"0.3\"/>\n<polygon points=\"257.0,269.7 267.3,294.4 240.7,290.9\" fill=\"#FFF477\" opacity=\"0.7\"/>\n<polygon points=\"93.1,268.1 99.9,307.9 62.0,293.9\" fill=\"#FFF477\" opacity=\"0.8\"/>\n<polygon points=\"34.6,226.5 34.6,243.5 20.0,251.9 5.4,243.5 5.4,226.5 20.0,218.1\" fill=\"none\" stroke=\"#FFFC00\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#FFFC00\" opacity=\"0.4\"/>\n<line x1=\"244.5\" y1=\"8.0\" x2=\"220.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#FFF477\" opacity=\"0.4\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#FFFC00\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"287.1,209.0 287.1,231.0 268.0,242.0 248.9,231.0 248.9,209.0 268.0,198.0\" fill=\"#FFFC00\" stroke=\"#FFFC00\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"70.4,233.3 70.5,286.7 24.2,260.1\" fill=\"#FFFC00\" opacity=\"0.9\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#FFF477\" opacity=\"0.35\"/>\n<line x1=\"220.7\" y1=\"8.0\" x2=\"196.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"237.4,77.1 237.4,102.9 215.0,115.8 192.6,102.9 192.6,77.1 215.0,64.2\" fill=\"none\" stroke=\"#FFFC00\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#FFFC00\" opacity=\"0.85\" transform=\"rotate(-34.769934208598656 300.0 173.0)\"/>\n<polygon points=\"260.2,12.6 280.4,65.7 224.4,56.7\" fill=\"#FFF477\" opacity=\"0.85\"/>\n<polygon points=\"23.9,129.1 11.3,138.2 9.7,122.7\" fill=\"#FFFC00\" opacity=\"0.55\"/>\n<polygon points=\"121.5,13.1 129.6,32.2 109.0,29.7\" fill=\"#FFFC00\" opacity=\"0.6\"/>\n<line x1=\"231.3\" y1=\"8.0\" x2=\"207.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"206.6\" y1=\"8.0\" x2=\"182.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['snapchat'] || TEMPLATE_ICONS['snapchat'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-pinterest',
    baseId: 'pinterest',
    name: 'Pinterest (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'FOLLOW ME',
    subtitle: '@YOURPROFILE',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #7a0518 0%, #ad081b 50%, #E60023 100%)',
    bgShapes: "<line x1=\"203.0\" y1=\"8.0\" x2=\"179.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"67.6,226.3 77.9,287.8 19.5,265.9\" fill=\"#7a0518\" opacity=\"0.9\"/>\n<polygon points=\"265.8,269.4 263.1,302.2 236.1,283.4\" fill=\"#ad081b\" opacity=\"0.7\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#7a0518\" opacity=\"0.4\"/>\n<polygon points=\"237.8,76.8 237.8,103.2 215.0,116.4 192.2,103.2 192.2,76.8 215.0,63.6\" fill=\"none\" stroke=\"#7a0518\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"31.0,260.3 50.9,298.3 8.0,296.5\" fill=\"#E60023\" opacity=\"0.75\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#7a0518\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#E60023\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#ad081b\" opacity=\"0.35\"/>\n<line x1=\"246.4\" y1=\"8.0\" x2=\"222.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#ad081b\" opacity=\"0.4\"/>\n<line x1=\"260.9\" y1=\"8.0\" x2=\"236.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"258.6,14.7 279.5,63.3 227.0,57.1\" fill=\"#ad081b\" opacity=\"0.85\"/>\n<polygon points=\"101.9,274.1 90.3,312.6 62.7,283.3\" fill=\"#ad081b\" opacity=\"0.8\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#E60023\" opacity=\"0.85\" transform=\"rotate(-36.615067406517326 300.0 173.0)\"/>\n<polygon points=\"126.7,15.1 125.2,35.8 108.0,24.1\" fill=\"#E60023\" opacity=\"0.6\"/>\n<line x1=\"233.3\" y1=\"8.0\" x2=\"209.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"220.5\" y1=\"8.0\" x2=\"196.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"288.5,208.2 288.5,231.8 268.0,243.6 247.5,231.8 247.5,208.2 268.0,196.4\" fill=\"#7a0518\" stroke=\"#7a0518\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"22.6,125.1 15.4,139.0 7.0,125.9\" fill=\"#E60023\" opacity=\"0.55\"/>\n<polygon points=\"32.2,228.0 32.2,242.0 20.0,249.1 7.8,242.0 7.8,228.0 20.0,220.9\" fill=\"none\" stroke=\"#7a0518\" stroke-width=\"1.6\" opacity=\"0.5\"/>",
    svg: TEMPLATE_ICONS['pinterest'] || TEMPLATE_ICONS['pinterest'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-google-drive',
    baseId: 'google-drive',
    name: 'Google Drive (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'VIEW FILES',
    subtitle: 'drive.google.com/yourfolder',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #1a73e8 0%, #34A853 50%, #FBBC05 100%)',
    bgShapes: "<line x1=\"247.8\" y1=\"8.0\" x2=\"223.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"104.3,274.9 88.5,314.3 62.2,280.9\" fill=\"#1a73e8\" opacity=\"0.8\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#FBBC05\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"259.9\" y1=\"8.0\" x2=\"235.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#FBBC05\" opacity=\"0.4\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#1a73e8\" opacity=\"0.35\"/>\n<polygon points=\"32.9,227.5 32.9,242.5 20.0,249.9 7.1,242.5 7.1,227.5 20.0,220.1\" fill=\"none\" stroke=\"#FBBC05\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"258.0,19.0 276.0,60.6 231.0,55.4\" fill=\"#1a73e8\" opacity=\"0.85\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#34A853\" opacity=\"0.3\"/>\n<polygon points=\"238.4,76.5 238.4,103.5 215.0,117.0 191.6,103.5 191.6,76.5 215.0,63.0\" fill=\"none\" stroke=\"#FBBC05\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#34A853\" opacity=\"0.85\" transform=\"rotate(-35.80641731057034 300.0 173.0)\"/>\n<polygon points=\"46.7,268.3 36.1,307.8 7.2,278.9\" fill=\"#34A853\" opacity=\"0.75\"/>\n<polygon points=\"286.5,209.3 286.5,230.7 268.0,241.4 249.5,230.7 249.5,209.3 268.0,198.6\" fill=\"#FBBC05\" stroke=\"#FBBC05\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#1a73e8\" opacity=\"0.4\"/>\n<polygon points=\"19.1,122.0 19.9,137.5 6.0,130.5\" fill=\"#34A853\" opacity=\"0.55\"/>\n<line x1=\"205.6\" y1=\"8.0\" x2=\"181.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"129.5,17.7 121.5,36.9 108.9,20.4\" fill=\"#34A853\" opacity=\"0.6\"/>\n<line x1=\"221.7\" y1=\"8.0\" x2=\"197.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"258.9,268.4 267.4,296.7 238.6,289.9\" fill=\"#1a73e8\" opacity=\"0.7\"/>\n<polygon points=\"75.2,233.2 68.1,290.9 21.7,255.9\" fill=\"#FBBC05\" opacity=\"0.9\"/>\n<line x1=\"230.5\" y1=\"8.0\" x2=\"206.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['google-drive'] || TEMPLATE_ICONS['drive'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-github',
    baseId: 'github',
    name: 'GitHub (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'STAR US',
    subtitle: 'github.com/yourusername',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #05070a 0%, #0d1117 50%, #24292e 100%)',
    bgShapes: "<line x1=\"260.2\" y1=\"8.0\" x2=\"236.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#05070a\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#24292e\" opacity=\"0.85\" transform=\"rotate(-32.48900874080084 300.0 173.0)\"/>\n<polygon points=\"290.9,206.8 290.9,233.2 268.0,246.5 245.1,233.2 245.1,206.8 268.0,193.5\" fill=\"#0d1117\" stroke=\"#0d1117\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"206.1\" y1=\"8.0\" x2=\"182.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#24292e\" opacity=\"0.3\"/>\n<polygon points=\"34.4,265.9 44.3,298.4 11.2,290.7\" fill=\"#24292e\" opacity=\"0.75\"/>\n<line x1=\"248.3\" y1=\"8.0\" x2=\"224.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"262.4,16.7 275.8,65.6 226.7,52.7\" fill=\"#05070a\" opacity=\"0.85\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#05070a\" opacity=\"0.4\"/>\n<polygon points=\"238.7,76.3 238.7,103.7 215.0,117.4 191.3,103.7 191.3,76.3 215.0,62.6\" fill=\"none\" stroke=\"#0d1117\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0d1117\" opacity=\"0.4\"/>\n<polygon points=\"85.1,265.7 106.0,302.2 63.9,302.1\" fill=\"#05070a\" opacity=\"0.8\"/>\n<polygon points=\"15.3,121.0 22.6,134.8 7.0,134.2\" fill=\"#24292e\" opacity=\"0.55\"/>\n<polygon points=\"262.2,273.1 261.7,297.2 241.1,284.7\" fill=\"#05070a\" opacity=\"0.7\"/>\n<polygon points=\"33.3,227.3 33.3,242.7 20.0,250.3 6.7,242.7 6.7,227.3 20.0,219.7\" fill=\"none\" stroke=\"#0d1117\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"231.7\" y1=\"8.0\" x2=\"207.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0d1117\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"125.3,14.2 126.7,35.0 108.0,25.8\" fill=\"#24292e\" opacity=\"0.6\"/>\n<polygon points=\"59.9,223.0 84.5,282.7 20.5,274.2\" fill=\"#0d1117\" opacity=\"0.9\"/>\n<line x1=\"221.2\" y1=\"8.0\" x2=\"197.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['github'] || TEMPLATE_ICONS['github'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-telegram',
    baseId: 'telegram',
    name: 'Telegram (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'JOIN US',
    subtitle: 't.me/yourchannel',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #1c5f8a 0%, #1c92d2 50%, #56c5f0 100%)',
    bgShapes: "<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#1c5f8a\" opacity=\"0.4\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#1c5f8a\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#56c5f0\" opacity=\"0.3\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#56c5f0\" opacity=\"0.85\" transform=\"rotate(-35.090262461295964 300.0 173.0)\"/>\n<polygon points=\"35.3,226.1 35.3,243.9 20.0,252.7 4.7,243.9 4.7,226.1 20.0,217.3\" fill=\"none\" stroke=\"#1c5f8a\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"122.0,13.2 129.2,32.6 108.8,29.2\" fill=\"#56c5f0\" opacity=\"0.6\"/>\n<line x1=\"234.5\" y1=\"8.0\" x2=\"210.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"263.9\" y1=\"8.0\" x2=\"239.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"289.2,207.8 289.2,232.2 268.0,244.4 246.8,232.2 246.8,207.8 268.0,195.6\" fill=\"#1c5f8a\" stroke=\"#1c5f8a\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"220.1\" y1=\"8.0\" x2=\"196.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"205.6\" y1=\"8.0\" x2=\"181.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"90.4,264.5 104.4,307.5 60.2,298.1\" fill=\"#1c92d2\" opacity=\"0.8\"/>\n<polygon points=\"23.7,127.6 12.7,138.7 8.6,123.7\" fill=\"#56c5f0\" opacity=\"0.55\"/>\n<polygon points=\"67.2,227.1 77.4,287.0 20.4,265.9\" fill=\"#1c5f8a\" opacity=\"0.9\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#1c92d2\" opacity=\"0.35\"/>\n<polygon points=\"37.4,264.4 44.1,301.7 8.5,288.9\" fill=\"#56c5f0\" opacity=\"0.75\"/>\n<polygon points=\"264.5,273.1 260.6,299.2 239.9,282.7\" fill=\"#1c92d2\" opacity=\"0.7\"/>\n<line x1=\"244.3\" y1=\"8.0\" x2=\"220.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"239.2,76.0 239.2,104.0 215.0,117.9 190.8,104.0 190.8,76.0 215.0,62.1\" fill=\"none\" stroke=\"#1c5f8a\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#1c92d2\" opacity=\"0.4\"/>\n<polygon points=\"258.4,13.1 280.9,63.9 225.7,58.0\" fill=\"#1c92d2\" opacity=\"0.85\"/>",
    svg: TEMPLATE_ICONS['telegram'] || TEMPLATE_ICONS['telegram'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-message',
    baseId: 'message',
    name: 'SMS Message (Brand Style)',
    category: 'Communication',
    styleFamily: 'brand',
    headline: 'TEXT ME',
    subtitle: '+60 12-345 6789',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0a5fc4 0%, #0b93f6 50%, #4CD964 100%)',
    bgShapes: "<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#4CD964\" opacity=\"0.85\" transform=\"rotate(-35.171301151245 300.0 173.0)\"/>\n<polygon points=\"37.5,266.3 42.5,300.9 10.0,287.9\" fill=\"#4CD964\" opacity=\"0.75\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#0a5fc4\" opacity=\"0.4\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#0a5fc4\" opacity=\"0.35\"/>\n<polygon points=\"22.1,124.5 16.2,138.9 6.7,126.5\" fill=\"#4CD964\" opacity=\"0.55\"/>\n<line x1=\"258.7\" y1=\"8.0\" x2=\"234.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#4CD964\" opacity=\"0.3\"/>\n<polygon points=\"55.4,227.2 83.2,276.7 26.4,276.1\" fill=\"#0b93f6\" opacity=\"0.9\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0b93f6\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"287.7,208.6 287.7,231.4 268.0,242.7 248.3,231.4 248.3,208.6 268.0,197.3\" fill=\"#0b93f6\" stroke=\"#0b93f6\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"245.2\" y1=\"8.0\" x2=\"221.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"90.1,267.5 102.0,305.7 62.9,296.8\" fill=\"#0a5fc4\" opacity=\"0.8\"/>\n<polygon points=\"238.1,76.7 238.1,103.3 215.0,116.7 191.9,103.3 191.9,76.7 215.0,63.3\" fill=\"none\" stroke=\"#0b93f6\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"219.4\" y1=\"8.0\" x2=\"195.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"262.9,273.2 261.3,297.8 240.8,284.0\" fill=\"#0a5fc4\" opacity=\"0.7\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0b93f6\" opacity=\"0.4\"/>\n<line x1=\"206.4\" y1=\"8.0\" x2=\"182.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"230.1\" y1=\"8.0\" x2=\"206.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"120.5,13.0 130.1,31.4 109.4,30.6\" fill=\"#4CD964\" opacity=\"0.6\"/>\n<polygon points=\"276.5,19.2 266.6,76.6 221.9,39.3\" fill=\"#0a5fc4\" opacity=\"0.85\"/>\n<polygon points=\"34.4,226.7 34.4,243.3 20.0,251.6 5.6,243.3 5.6,226.7 20.0,218.4\" fill=\"none\" stroke=\"#0b93f6\" stroke-width=\"1.6\" opacity=\"0.5\"/>",
    svg: TEMPLATE_ICONS['message'] || TEMPLATE_ICONS['message'] || TEMPLATE_ICONS['website'],
    qrType: 'sms',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-contact',
    baseId: 'contact',
    name: 'Contact vCard (Brand Style)',
    category: 'Communication',
    styleFamily: 'brand',
    headline: 'SAVE CONTACT',
    subtitle: 'Your Name Here',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0d5c52 0%, #11998e 50%, #38ef7d 100%)',
    bgShapes: "<polygon points=\"287.5,208.8 287.5,231.2 268.0,242.5 248.5,231.2 248.5,208.8 268.0,197.5\" fill=\"#11998e\" stroke=\"#11998e\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"123.1,13.4 128.5,33.5 108.4,28.1\" fill=\"#0d5c52\" opacity=\"0.6\"/>\n<polygon points=\"70.7,227.8 75.0,289.7 19.3,262.5\" fill=\"#11998e\" opacity=\"0.9\"/>\n<line x1=\"234.3\" y1=\"8.0\" x2=\"210.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"217.2\" y1=\"8.0\" x2=\"193.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"34.8,260.9 48.5,301.2 6.7,292.9\" fill=\"#0d5c52\" opacity=\"0.75\"/>\n<polygon points=\"236.4,77.7 236.4,102.3 215.0,114.7 193.6,102.3 193.6,77.7 215.0,65.3\" fill=\"none\" stroke=\"#11998e\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"96.2,268.0 98.4,310.7 60.4,291.3\" fill=\"#38ef7d\" opacity=\"0.8\"/>\n<line x1=\"247.3\" y1=\"8.0\" x2=\"223.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"256.2,16.7 278.9,60.2 229.9,58.1\" fill=\"#38ef7d\" opacity=\"0.85\"/>\n<polygon points=\"32.9,227.5 32.9,242.5 20.0,249.9 7.1,242.5 7.1,227.5 20.0,220.1\" fill=\"none\" stroke=\"#11998e\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"24.0,129.8 10.6,137.9 10.4,122.3\" fill=\"#0d5c52\" opacity=\"0.55\"/>\n<line x1=\"260.5\" y1=\"8.0\" x2=\"236.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#0d5c52\" opacity=\"0.85\" transform=\"rotate(-34.163431050995314 300.0 173.0)\"/>\n<polygon points=\"263.5,270.3 263.5,299.7 238.0,285.0\" fill=\"#38ef7d\" opacity=\"0.7\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#38ef7d\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#38ef7d\" opacity=\"0.4\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#11998e\" opacity=\"0.4\"/>\n<line x1=\"204.6\" y1=\"8.0\" x2=\"180.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#11998e\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#0d5c52\" opacity=\"0.3\"/>",
    svg: TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['contact'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-email',
    baseId: 'email',
    name: 'Email (Brand Style)',
    category: 'Communication',
    styleFamily: 'brand',
    headline: 'EMAIL ME',
    subtitle: 'you@example.com',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #6a1b9a 0%, #8E2DE2 50%, #4A00E0 100%)',
    bgShapes: "<polygon points=\"34.6,226.6 34.6,243.4 20.0,251.8 5.4,243.4 5.4,226.6 20.0,218.2\" fill=\"none\" stroke=\"#8E2DE2\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"271.8,23.9 264.9,70.1 228.3,41.0\" fill=\"#4A00E0\" opacity=\"0.85\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#4A00E0\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#6a1b9a\" opacity=\"0.85\" transform=\"rotate(-31.203969494304207 300.0 173.0)\"/>\n<polygon points=\"288.8,208.0 288.8,232.0 268.0,244.1 247.2,232.0 247.2,208.0 268.0,195.9\" fill=\"#8E2DE2\" stroke=\"#8E2DE2\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"38.6,262.2 45.5,303.8 5.9,289.0\" fill=\"#6a1b9a\" opacity=\"0.75\"/>\n<polygon points=\"93.3,267.3 100.5,308.6 61.2,294.2\" fill=\"#4A00E0\" opacity=\"0.8\"/>\n<polygon points=\"120.5,13.0 130.1,31.4 109.4,30.6\" fill=\"#6a1b9a\" opacity=\"0.6\"/>\n<line x1=\"219.7\" y1=\"8.0\" x2=\"195.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"244.9\" y1=\"8.0\" x2=\"220.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"238.5,76.4 238.5,103.6 215.0,117.1 191.5,103.6 191.5,76.4 215.0,62.9\" fill=\"none\" stroke=\"#8E2DE2\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#6a1b9a\" opacity=\"0.3\"/>\n<polygon points=\"67.9,227.1 77.0,287.7 20.0,265.3\" fill=\"#8E2DE2\" opacity=\"0.9\"/>\n<line x1=\"260.4\" y1=\"8.0\" x2=\"236.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#4A00E0\" opacity=\"0.4\"/>\n<polygon points=\"264.6,275.5 258.4,298.0 242.0,281.5\" fill=\"#4A00E0\" opacity=\"0.7\"/>\n<line x1=\"231.3\" y1=\"8.0\" x2=\"207.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"203.0\" y1=\"8.0\" x2=\"179.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#8E2DE2\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"23.7,127.8 12.6,138.7 8.7,123.6\" fill=\"#6a1b9a\" opacity=\"0.55\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#8E2DE2\" opacity=\"0.4\"/>",
    svg: TEMPLATE_ICONS['email'] || TEMPLATE_ICONS['email'] || TEMPLATE_ICONS['website'],
    qrType: 'email',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-wifi',
    baseId: 'wifi',
    name: 'Wi-Fi Network (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'CONNECT TO WIFI',
    subtitle: 'Network: YourWiFi',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #06283D 0%, #1363DF 50%, #47B5FF 100%)',
    bgShapes: "<line x1=\"221.9\" y1=\"8.0\" x2=\"197.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#1363DF\" opacity=\"0.85\" transform=\"rotate(-31.16919055958579 300.0 173.0)\"/>\n<polygon points=\"289.8,207.4 289.8,232.6 268.0,245.2 246.2,232.6 246.2,207.4 268.0,194.8\" fill=\"#47B5FF\" stroke=\"#47B5FF\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"30.9,261.8 49.7,297.4 9.4,295.8\" fill=\"#1363DF\" opacity=\"0.75\"/>\n<polygon points=\"265.4,275.6 258.0,298.7 241.7,280.7\" fill=\"#06283D\" opacity=\"0.7\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#06283D\" opacity=\"0.35\"/>\n<polygon points=\"122.3,13.2 129.1,32.9 108.7,28.9\" fill=\"#1363DF\" opacity=\"0.6\"/>\n<line x1=\"233.5\" y1=\"8.0\" x2=\"209.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#1363DF\" opacity=\"0.3\"/>\n<polygon points=\"238.9,76.2 238.9,103.8 215.0,117.6 191.1,103.8 191.1,76.2 215.0,62.4\" fill=\"none\" stroke=\"#47B5FF\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"258.7\" y1=\"8.0\" x2=\"234.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"23.8,128.3 12.0,138.5 9.1,123.2\" fill=\"#1363DF\" opacity=\"0.55\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#47B5FF\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"68.6,232.5 72.1,285.5 24.4,262.0\" fill=\"#47B5FF\" opacity=\"0.9\"/>\n<polygon points=\"32.9,227.5 32.9,242.5 20.0,249.9 7.1,242.5 7.1,227.5 20.0,220.1\" fill=\"none\" stroke=\"#47B5FF\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"256.2,13.3 281.9,61.9 226.9,59.8\" fill=\"#06283D\" opacity=\"0.85\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#47B5FF\" opacity=\"0.4\"/>\n<line x1=\"204.5\" y1=\"8.0\" x2=\"180.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"248.1\" y1=\"8.0\" x2=\"224.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"88.4,267.1 103.2,304.4 63.5,298.5\" fill=\"#06283D\" opacity=\"0.8\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#06283D\" opacity=\"0.4\"/>",
    svg: TEMPLATE_ICONS['wifi'] || TEMPLATE_ICONS['wifi'] || TEMPLATE_ICONS['website'],
    qrType: 'wifi',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-website',
    baseId: 'website',
    name: 'Website (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'VISIT WEBSITE',
    subtitle: 'www.yourwebsite.com',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #003c30 0%, #0f766e 50%, #2dd4bf 100%)',
    bgShapes: "<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#003c30\" opacity=\"0.35\"/>\n<polygon points=\"35.3,226.2 35.3,243.8 20.0,252.6 4.7,243.8 4.7,226.2 20.0,217.4\" fill=\"none\" stroke=\"#0f766e\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"120.7,13.0 130.0,31.6 109.3,30.4\" fill=\"#2dd4bf\" opacity=\"0.6\"/>\n<polygon points=\"18.7,121.8 20.2,137.3 6.0,130.9\" fill=\"#2dd4bf\" opacity=\"0.55\"/>\n<polygon points=\"67.9,224.3 79.5,289.0 17.7,266.7\" fill=\"#0f766e\" opacity=\"0.9\"/>\n<line x1=\"207.0\" y1=\"8.0\" x2=\"183.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0f766e\" opacity=\"0.4\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#003c30\" opacity=\"0.4\"/>\n<polygon points=\"235.4,78.2 235.4,101.8 215.0,113.5 194.6,101.8 194.6,78.2 215.0,66.5\" fill=\"none\" stroke=\"#0f766e\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#2dd4bf\" opacity=\"0.85\" transform=\"rotate(-34.98825565592705 300.0 173.0)\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0f766e\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"290.3,207.1 290.3,232.9 268.0,245.8 245.7,232.9 245.7,207.1 268.0,194.2\" fill=\"#0f766e\" stroke=\"#0f766e\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#2dd4bf\" opacity=\"0.3\"/>\n<line x1=\"234.9\" y1=\"8.0\" x2=\"210.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"260.3\" y1=\"8.0\" x2=\"236.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"218.2\" y1=\"8.0\" x2=\"194.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"255.3,271.5 266.6,292.0 243.2,291.5\" fill=\"#003c30\" opacity=\"0.7\"/>\n<polygon points=\"95.2,268.0 99.0,309.9 60.8,292.2\" fill=\"#003c30\" opacity=\"0.8\"/>\n<line x1=\"247.0\" y1=\"8.0\" x2=\"223.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"48.0,274.3 30.3,306.0 11.7,274.7\" fill=\"#2dd4bf\" opacity=\"0.75\"/>\n<polygon points=\"272.9,22.3 265.7,71.9 226.3,40.8\" fill=\"#003c30\" opacity=\"0.85\"/>",
    svg: TEMPLATE_ICONS['website'] || TEMPLATE_ICONS['website'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-menu',
    baseId: 'menu',
    name: 'Digital Menu (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'VIEW MENU',
    subtitle: 'Scan for full menu',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #4a1c02 0%, #a34a10 50%, #e08e3e 100%)',
    bgShapes: "<polygon points=\"35.8,266.0 43.5,299.5 10.7,289.5\" fill=\"#4a1c02\" opacity=\"0.75\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#4a1c02\" opacity=\"0.85\" transform=\"rotate(-34.31413738270043 300.0 173.0)\"/>\n<polygon points=\"125.7,14.4 126.3,35.2 108.0,25.4\" fill=\"#4a1c02\" opacity=\"0.6\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#a34a10\" opacity=\"0.4\"/>\n<polygon points=\"106.5,275.7 86.7,315.8 61.8,278.6\" fill=\"#a34a10\" opacity=\"0.8\"/>\n<line x1=\"231.0\" y1=\"8.0\" x2=\"207.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"18.0,121.5 20.8,136.9 6.1,131.6\" fill=\"#4a1c02\" opacity=\"0.55\"/>\n<polygon points=\"286.7,209.2 286.7,230.8 268.0,241.6 249.3,230.8 249.3,209.2 268.0,198.4\" fill=\"#e08e3e\" stroke=\"#e08e3e\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#a34a10\" opacity=\"0.35\"/>\n<line x1=\"220.4\" y1=\"8.0\" x2=\"196.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"262.4,273.2 261.5,297.3 241.1,284.5\" fill=\"#a34a10\" opacity=\"0.7\"/>\n<polygon points=\"266.9,14.3 275.7,70.7 222.4,50.0\" fill=\"#a34a10\" opacity=\"0.85\"/>\n<line x1=\"202.0\" y1=\"8.0\" x2=\"178.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"66.3,226.7 78.2,286.4 20.6,266.9\" fill=\"#e08e3e\" opacity=\"0.9\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#e08e3e\" opacity=\"0.4\"/>\n<polygon points=\"235.8,78.0 235.8,102.0 215.0,114.1 194.2,102.0 194.2,78.0 215.0,65.9\" fill=\"none\" stroke=\"#e08e3e\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"247.6\" y1=\"8.0\" x2=\"223.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"33.8,227.1 33.8,242.9 20.0,250.9 6.2,242.9 6.2,227.1 20.0,219.1\" fill=\"none\" stroke=\"#e08e3e\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#e08e3e\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#4a1c02\" opacity=\"0.3\"/>\n<line x1=\"263.8\" y1=\"8.0\" x2=\"239.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['menu'] || TEMPLATE_ICONS['menu'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-app',
    baseId: 'app',
    name: 'App Download (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'DOWNLOAD APP',
    subtitle: 'Get it on App Store / Play',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #1e0a3c 0%, #4c1d95 50%, #7c3aed 100%)',
    bgShapes: "<polygon points=\"32.2,228.0 32.2,242.0 20.0,249.1 7.8,242.0 7.8,228.0 20.0,220.9\" fill=\"none\" stroke=\"#1e0a3c\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"127.6,15.7 124.2,36.2 108.2,23.0\" fill=\"#4c1d95\" opacity=\"0.6\"/>\n<line x1=\"259.5\" y1=\"8.0\" x2=\"235.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"238.7,76.3 238.7,103.7 215.0,117.3 191.3,103.7 191.3,76.3 215.0,62.7\" fill=\"none\" stroke=\"#1e0a3c\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"16.6,121.1 21.9,135.8 6.5,133.0\" fill=\"#4c1d95\" opacity=\"0.55\"/>\n<polygon points=\"263.6,272.2 261.7,298.9 239.6,283.9\" fill=\"#7c3aed\" opacity=\"0.7\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#7c3aed\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#4c1d95\" opacity=\"0.85\" transform=\"rotate(-30.09235038589412 300.0 173.0)\"/>\n<polygon points=\"37.4,261.2 46.9,303.3 5.7,290.4\" fill=\"#4c1d95\" opacity=\"0.75\"/>\n<polygon points=\"289.2,207.7 289.2,232.3 268.0,244.5 246.8,232.3 246.8,207.7 268.0,195.5\" fill=\"#1e0a3c\" stroke=\"#1e0a3c\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#7c3aed\" opacity=\"0.4\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#4c1d95\" opacity=\"0.3\"/>\n<line x1=\"231.9\" y1=\"8.0\" x2=\"207.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#1e0a3c\" opacity=\"0.4\"/>\n<polygon points=\"90.0,263.6 105.4,307.5 59.6,298.9\" fill=\"#7c3aed\" opacity=\"0.8\"/>\n<line x1=\"245.5\" y1=\"8.0\" x2=\"221.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"58.0,222.8 85.7,281.2 21.3,276.0\" fill=\"#1e0a3c\" opacity=\"0.9\"/>\n<polygon points=\"257.6,17.2 277.8,61.1 229.7,56.7\" fill=\"#7c3aed\" opacity=\"0.85\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#1e0a3c\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"220.7\" y1=\"8.0\" x2=\"196.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"204.1\" y1=\"8.0\" x2=\"180.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['app'] || TEMPLATE_ICONS['app'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-payment',
    baseId: 'payment',
    name: 'Payment & Cashless (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'SCAN TO PAY',
    subtitle: 'Accepted here',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #052e16 0%, #15803d 50%, #eab308 100%)',
    bgShapes: "<line x1=\"206.3\" y1=\"8.0\" x2=\"182.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"51.3,272.2 30.5,309.8 8.2,273.0\" fill=\"#eab308\" opacity=\"0.75\"/>\n<polygon points=\"236.9,77.3 236.9,102.7 215.0,115.3 193.1,102.7 193.1,77.3 215.0,64.7\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"23.8,127.9 12.4,138.6 8.8,123.5\" fill=\"#eab308\" opacity=\"0.55\"/>\n<polygon points=\"74.1,233.1 68.8,290.0 22.1,256.9\" fill=\"#15803d\" opacity=\"0.9\"/>\n<polygon points=\"265.8,275.1 258.2,299.3 241.0,280.6\" fill=\"#052e16\" opacity=\"0.7\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#052e16\" opacity=\"0.4\"/>\n<polygon points=\"286.9,209.1 286.9,230.9 268.0,241.8 249.1,230.9 249.1,209.1 268.0,198.2\" fill=\"#15803d\" stroke=\"#15803d\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"262.9,18.7 273.8,65.0 228.3,51.3\" fill=\"#052e16\" opacity=\"0.85\"/>\n<polygon points=\"103.0,274.1 89.8,313.5 62.2,282.4\" fill=\"#052e16\" opacity=\"0.8\"/>\n<line x1=\"263.2\" y1=\"8.0\" x2=\"239.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"245.5\" y1=\"8.0\" x2=\"221.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#15803d\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#052e16\" opacity=\"0.35\"/>\n<polygon points=\"34.0,226.9 34.0,243.1 20.0,251.2 6.0,243.1 6.0,226.9 20.0,218.8\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"130.3,18.9 120.1,37.0 109.5,19.1\" fill=\"#eab308\" opacity=\"0.6\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#15803d\" opacity=\"0.4\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#eab308\" opacity=\"0.85\" transform=\"rotate(-32.82795095153597 300.0 173.0)\"/>\n<line x1=\"235.8\" y1=\"8.0\" x2=\"211.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#eab308\" opacity=\"0.3\"/>\n<line x1=\"217.5\" y1=\"8.0\" x2=\"193.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['payment'] || TEMPLATE_ICONS['payment'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-location',
    baseId: 'location',
    name: 'Map Location (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'GET DIRECTIONS',
    subtitle: 'Find us on the map',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #4c0519 0%, #be123c 50%, #fb7185 100%)',
    bgShapes: "<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#fb7185\" opacity=\"0.85\" transform=\"rotate(-31.920441389602512 300.0 173.0)\"/>\n<polygon points=\"260.7,19.0 274.7,63.0 229.6,53.1\" fill=\"#be123c\" opacity=\"0.85\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#be123c\" opacity=\"0.35\"/>\n<line x1=\"230.6\" y1=\"8.0\" x2=\"206.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"128.4,16.4 123.2,36.6 108.4,22.0\" fill=\"#fb7185\" opacity=\"0.6\"/>\n<line x1=\"204.9\" y1=\"8.0\" x2=\"180.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#4c0519\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#be123c\" opacity=\"0.4\"/>\n<line x1=\"221.0\" y1=\"8.0\" x2=\"197.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"46.9,273.1 31.8,305.6 11.2,276.3\" fill=\"#fb7185\" opacity=\"0.75\"/>\n<polygon points=\"287.6,208.7 287.6,231.3 268.0,242.6 248.4,231.3 248.4,208.7 268.0,197.4\" fill=\"#4c0519\" stroke=\"#4c0519\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"59.1,229.4 79.4,278.8 26.5,271.8\" fill=\"#4c0519\" opacity=\"0.9\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#4c0519\" opacity=\"0.4\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#fb7185\" opacity=\"0.3\"/>\n<line x1=\"258.7\" y1=\"8.0\" x2=\"234.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"239.8,75.7 239.8,104.3 215.0,118.6 190.2,104.3 190.2,75.7 215.0,61.4\" fill=\"none\" stroke=\"#4c0519\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"266.0,269.9 262.6,302.0 236.5,283.0\" fill=\"#be123c\" opacity=\"0.7\"/>\n<polygon points=\"18.7,121.8 20.2,137.3 6.0,130.9\" fill=\"#fb7185\" opacity=\"0.55\"/>\n<polygon points=\"104.9,272.0 90.7,316.2 59.4,281.8\" fill=\"#be123c\" opacity=\"0.8\"/>\n<line x1=\"248.9\" y1=\"8.0\" x2=\"224.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"35.2,226.2 35.2,243.8 20.0,252.6 4.8,243.8 4.8,226.2 20.0,217.4\" fill=\"none\" stroke=\"#4c0519\" stroke-width=\"1.6\" opacity=\"0.5\"/>",
    svg: TEMPLATE_ICONS['location'] || TEMPLATE_ICONS['location'] || TEMPLATE_ICONS['website'],
    qrType: 'location',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-event',
    baseId: 'event',
    name: 'Calendar Event (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'SAVE THE DATE',
    subtitle: 'Add to your calendar',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #2e1065 0%, #6d28d9 50%, #a78bfa 100%)',
    bgShapes: "<line x1=\"207.5\" y1=\"8.0\" x2=\"183.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"267.6,20.5 269.9,68.1 227.5,46.4\" fill=\"#6d28d9\" opacity=\"0.85\"/>\n<line x1=\"245.3\" y1=\"8.0\" x2=\"221.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#2e1065\" opacity=\"0.4\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#2e1065\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"96.5,264.5 101.4,312.7 57.1,292.8\" fill=\"#6d28d9\" opacity=\"0.8\"/>\n<polygon points=\"23.0,125.8 14.6,139.0 7.4,125.2\" fill=\"#a78bfa\" opacity=\"0.55\"/>\n<polygon points=\"290.9,206.8 290.9,233.2 268.0,246.5 245.1,233.2 245.1,206.8 268.0,193.5\" fill=\"#2e1065\" stroke=\"#2e1065\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"230.6\" y1=\"8.0\" x2=\"206.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"217.8\" y1=\"8.0\" x2=\"193.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"259.5\" y1=\"8.0\" x2=\"235.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#6d28d9\" opacity=\"0.4\"/>\n<polygon points=\"65.2,226.2 79.2,285.7 20.6,268.1\" fill=\"#2e1065\" opacity=\"0.9\"/>\n<polygon points=\"34.5,226.6 34.5,243.4 20.0,251.8 5.5,243.4 5.5,226.6 20.0,218.2\" fill=\"none\" stroke=\"#2e1065\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"46.5,271.1 33.8,306.3 9.7,277.6\" fill=\"#a78bfa\" opacity=\"0.75\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#6d28d9\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#a78bfa\" opacity=\"0.3\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#a78bfa\" opacity=\"0.85\" transform=\"rotate(-38.143620031859285 300.0 173.0)\"/>\n<polygon points=\"124.3,13.8 127.6,34.3 108.2,26.9\" fill=\"#a78bfa\" opacity=\"0.6\"/>\n<polygon points=\"259.1,270.1 265.9,296.0 240.1,288.9\" fill=\"#6d28d9\" opacity=\"0.7\"/>\n<polygon points=\"236.8,77.4 236.8,102.6 215.0,115.2 193.2,102.6 193.2,77.4 215.0,64.8\" fill=\"none\" stroke=\"#2e1065\" stroke-width=\"1.6\" opacity=\"0.55\"/>",
    svg: TEMPLATE_ICONS['event'] || TEMPLATE_ICONS['event'] || TEMPLATE_ICONS['website'],
    qrType: 'event',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-coupon',
    baseId: 'coupon',
    name: 'Coupon & Discount (Brand Style)',
    category: 'Marketing',
    styleFamily: 'brand',
    headline: 'CLAIM OFFER',
    subtitle: 'Limited time discount',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #4a0404 0%, #dc2626 50%, #f97373 100%)',
    bgShapes: "<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#f97373\" opacity=\"0.4\"/>\n<polygon points=\"23.6,127.2 13.1,138.8 8.3,124.0\" fill=\"#dc2626\" opacity=\"0.55\"/>\n<line x1=\"247.1\" y1=\"8.0\" x2=\"223.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"103.9,273.9 89.5,314.4 61.6,281.7\" fill=\"#4a0404\" opacity=\"0.8\"/>\n<line x1=\"233.1\" y1=\"8.0\" x2=\"209.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"286.2,209.5 286.2,230.5 268.0,241.0 249.8,230.5 249.8,209.5 268.0,199.0\" fill=\"#f97373\" stroke=\"#f97373\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#4a0404\" opacity=\"0.4\"/>\n<polygon points=\"123.2,13.4 128.4,33.6 108.4,28.0\" fill=\"#dc2626\" opacity=\"0.6\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#dc2626\" opacity=\"0.3\"/>\n<polygon points=\"34.1,226.8 34.1,243.2 20.0,251.3 5.9,243.2 5.9,226.8 20.0,218.7\" fill=\"none\" stroke=\"#f97373\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#f97373\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#dc2626\" opacity=\"0.85\" transform=\"rotate(-31.27218336545331 300.0 173.0)\"/>\n<line x1=\"221.1\" y1=\"8.0\" x2=\"197.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"43.6,265.0 40.6,306.8 5.9,283.2\" fill=\"#dc2626\" opacity=\"0.75\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#4a0404\" opacity=\"0.35\"/>\n<polygon points=\"257.7,16.2 278.6,61.7 228.7,57.0\" fill=\"#4a0404\" opacity=\"0.85\"/>\n<line x1=\"260.9\" y1=\"8.0\" x2=\"236.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"206.2\" y1=\"8.0\" x2=\"182.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"259.2,271.5 264.6,295.4 241.2,288.2\" fill=\"#4a0404\" opacity=\"0.7\"/>\n<polygon points=\"237.2,77.2 237.2,102.8 215.0,115.6 192.8,102.8 192.8,77.2 215.0,64.4\" fill=\"none\" stroke=\"#f97373\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"66.7,226.3 78.3,287.0 20.0,266.7\" fill=\"#f97373\" opacity=\"0.9\"/>",
    svg: TEMPLATE_ICONS['coupon'] || TEMPLATE_ICONS['coupon'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-feedback',
    baseId: 'feedback',
    name: 'Customer Feedback (Brand Style)',
    category: 'Marketing',
    styleFamily: 'brand',
    headline: 'LEAVE FEEDBACK',
    subtitle: 'We value your review',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #4a2c02 0%, #b45309 50%, #fbbf24 100%)',
    bgShapes: "<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#4a2c02\" opacity=\"0.35\"/>\n<line x1=\"245.5\" y1=\"8.0\" x2=\"221.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"35.5,262.8 46.5,300.9 8.0,291.3\" fill=\"#fbbf24\" opacity=\"0.75\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#4a2c02\" opacity=\"0.4\"/>\n<polygon points=\"259.7,272.1 263.8,295.5 241.5,287.3\" fill=\"#4a2c02\" opacity=\"0.7\"/>\n<line x1=\"261.7\" y1=\"8.0\" x2=\"237.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#fbbf24\" opacity=\"0.85\" transform=\"rotate(-33.35392837484017 300.0 173.0)\"/>\n<polygon points=\"33.4,227.2 33.4,242.8 20.0,250.5 6.6,242.8 6.6,227.2 20.0,219.5\" fill=\"none\" stroke=\"#b45309\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"230.3\" y1=\"8.0\" x2=\"206.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"129.9,18.2 121.0,37.0 109.1,19.9\" fill=\"#fbbf24\" opacity=\"0.6\"/>\n<polygon points=\"105.4,276.6 86.4,314.3 63.2,279.1\" fill=\"#4a2c02\" opacity=\"0.8\"/>\n<polygon points=\"259.8,14.2 279.3,64.5 225.9,56.3\" fill=\"#4a2c02\" opacity=\"0.85\"/>\n<polygon points=\"15.2,121.0 22.7,134.7 7.1,134.3\" fill=\"#fbbf24\" opacity=\"0.55\"/>\n<polygon points=\"238.0,76.7 238.0,103.3 215.0,116.5 192.0,103.3 192.0,76.7 215.0,63.5\" fill=\"none\" stroke=\"#b45309\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"58.3,224.7 83.9,280.5 22.8,274.8\" fill=\"#b45309\" opacity=\"0.9\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#b45309\" opacity=\"0.4\"/>\n<line x1=\"202.9\" y1=\"8.0\" x2=\"178.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#b45309\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#fbbf24\" opacity=\"0.3\"/>\n<line x1=\"221.8\" y1=\"8.0\" x2=\"197.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"287.0,209.0 287.0,231.0 268.0,241.9 249.0,231.0 249.0,209.0 268.0,198.1\" fill=\"#b45309\" stroke=\"#b45309\" stroke-width=\"1.6\" opacity=\"1.0\"/>",
    svg: TEMPLATE_ICONS['feedback'] || TEMPLATE_ICONS['feedback'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-video',
    baseId: 'video',
    name: 'Promotional Video (Brand Style)',
    category: 'Marketing',
    styleFamily: 'brand',
    headline: 'WATCH VIDEO',
    subtitle: 'Scan to play',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #1a0505 0%, #7f1d1d 50%, #262626 100%)',
    bgShapes: "<polygon points=\"32.4,227.8 32.4,242.2 20.0,249.3 7.6,242.2 7.6,227.8 20.0,220.7\" fill=\"none\" stroke=\"#262626\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"235.9,77.9 235.9,102.1 215.0,114.1 194.1,102.1 194.1,77.9 215.0,65.9\" fill=\"none\" stroke=\"#262626\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"259.2,18.0 276.3,62.1 229.6,54.9\" fill=\"#7f1d1d\" opacity=\"0.85\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#7f1d1d\" opacity=\"0.4\"/>\n<polygon points=\"102.0,273.8 90.5,312.8 62.5,283.4\" fill=\"#7f1d1d\" opacity=\"0.8\"/>\n<line x1=\"221.1\" y1=\"8.0\" x2=\"197.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#7f1d1d\" opacity=\"0.35\"/>\n<polygon points=\"121.8,13.1 129.4,32.5 108.8,29.4\" fill=\"#262626\" opacity=\"0.6\"/>\n<polygon points=\"287.0,209.0 287.0,231.0 268.0,242.0 249.0,231.0 249.0,209.0 268.0,198.0\" fill=\"#262626\" stroke=\"#262626\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#262626\" opacity=\"0.4\"/>\n<polygon points=\"46.0,271.0 34.1,305.8 9.9,278.1\" fill=\"#262626\" opacity=\"0.75\"/>\n<line x1=\"244.5\" y1=\"8.0\" x2=\"220.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"202.6\" y1=\"8.0\" x2=\"178.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"230.4\" y1=\"8.0\" x2=\"206.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#262626\" opacity=\"0.85\" transform=\"rotate(-34.324969042849176 300.0 173.0)\"/>\n<polygon points=\"55.7,227.7 82.6,276.7 26.7,275.6\" fill=\"#262626\" opacity=\"0.9\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#262626\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"22.8,125.4 15.1,139.0 7.2,125.6\" fill=\"#262626\" opacity=\"0.55\"/>\n<polygon points=\"259.9,270.2 265.4,296.6 239.7,288.2\" fill=\"#7f1d1d\" opacity=\"0.7\"/>\n<line x1=\"262.4\" y1=\"8.0\" x2=\"238.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#262626\" opacity=\"0.3\"/>",
    svg: TEMPLATE_ICONS['video'] || TEMPLATE_ICONS['video'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-twitch',
    baseId: 'twitch',
    name: 'Twitch (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'FOLLOW ME',
    subtitle: 'twitch.tv/yourusername',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #2a0845 0%, #6441A5 50%, #9146FF 100%)',
    bgShapes: "<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#9146FF\" opacity=\"0.4\"/>\n<polygon points=\"20.9,123.2 18.0,138.5 6.2,128.3\" fill=\"#6441A5\" opacity=\"0.55\"/>\n<polygon points=\"290.7,206.9 290.7,233.1 268.0,246.2 245.3,233.1 245.3,206.9 268.0,193.8\" fill=\"#9146FF\" stroke=\"#9146FF\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"258.2,13.8 280.4,63.4 226.4,57.8\" fill=\"#2a0845\" opacity=\"0.85\"/>\n<line x1=\"221.8\" y1=\"8.0\" x2=\"197.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#6441A5\" opacity=\"0.85\" transform=\"rotate(-30.853919549751993 300.0 173.0)\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#2a0845\" opacity=\"0.35\"/>\n<polygon points=\"41.6,264.5 42.0,305.3 6.5,285.2\" fill=\"#6441A5\" opacity=\"0.75\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#2a0845\" opacity=\"0.4\"/>\n<line x1=\"260.3\" y1=\"8.0\" x2=\"236.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"238.3,76.6 238.3,103.4 215.0,116.9 191.7,103.4 191.7,76.6 215.0,63.1\" fill=\"none\" stroke=\"#9146FF\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#9146FF\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#6441A5\" opacity=\"0.3\"/>\n<polygon points=\"128.7,16.7 122.8,36.7 108.5,21.6\" fill=\"#6441A5\" opacity=\"0.6\"/>\n<line x1=\"203.1\" y1=\"8.0\" x2=\"179.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"71.4,232.3 70.8,288.1 22.8,259.6\" fill=\"#9146FF\" opacity=\"0.9\"/>\n<line x1=\"234.8\" y1=\"8.0\" x2=\"210.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"108.1,273.3 88.0,318.4 59.0,278.4\" fill=\"#2a0845\" opacity=\"0.8\"/>\n<polygon points=\"264.4,270.6 262.8,300.3 237.8,284.1\" fill=\"#2a0845\" opacity=\"0.7\"/>\n<line x1=\"249.0\" y1=\"8.0\" x2=\"225.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"33.7,227.1 33.7,242.9 20.0,250.8 6.3,242.9 6.3,227.1 20.0,219.2\" fill=\"none\" stroke=\"#9146FF\" stroke-width=\"1.6\" opacity=\"0.5\"/>",
    svg: TEMPLATE_ICONS['twitch'] || TEMPLATE_ICONS['twitch'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-vimeo',
    baseId: 'vimeo',
    name: 'Vimeo (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'WATCH MORE',
    subtitle: 'vimeo.com/yourchannel',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #00121a 0%, #003244 50%, #1ab7ea 100%)',
    bgShapes: "<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#003244\" opacity=\"0.4\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#003244\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"286.9,209.1 286.9,230.9 268.0,241.8 249.1,230.9 249.1,209.1 268.0,198.2\" fill=\"#003244\" stroke=\"#003244\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"42.4,269.5 37.2,303.5 10.4,282.0\" fill=\"#00121a\" opacity=\"0.75\"/>\n<polygon points=\"236.2,77.8 236.2,102.2 215.0,114.5 193.8,102.2 193.8,77.8 215.0,65.5\" fill=\"none\" stroke=\"#003244\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"262.9,268.8 265.1,300.0 237.0,286.2\" fill=\"#1ab7ea\" opacity=\"0.7\"/>\n<line x1=\"204.3\" y1=\"8.0\" x2=\"180.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"258.4\" y1=\"8.0\" x2=\"234.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"249.0\" y1=\"8.0\" x2=\"225.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"23.4,126.8 13.5,138.9 8.0,124.3\" fill=\"#00121a\" opacity=\"0.55\"/>\n<line x1=\"217.1\" y1=\"8.0\" x2=\"193.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"230.0\" y1=\"8.0\" x2=\"206.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#1ab7ea\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#1ab7ea\" opacity=\"0.4\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#00121a\" opacity=\"0.85\" transform=\"rotate(-37.931917839590675 300.0 173.0)\"/>\n<polygon points=\"106.5,274.0 88.1,316.6 60.4,279.4\" fill=\"#1ab7ea\" opacity=\"0.8\"/>\n<polygon points=\"128.1,16.1 123.7,36.4 108.3,22.5\" fill=\"#00121a\" opacity=\"0.6\"/>\n<polygon points=\"76.2,231.7 68.9,292.5 19.9,255.8\" fill=\"#003244\" opacity=\"0.9\"/>\n<polygon points=\"35.0,226.4 35.0,243.6 20.0,252.3 5.0,243.6 5.0,226.4 20.0,217.7\" fill=\"none\" stroke=\"#003244\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"258.5,17.5 277.1,61.7 229.5,55.7\" fill=\"#1ab7ea\" opacity=\"0.85\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#00121a\" opacity=\"0.3\"/>",
    svg: TEMPLATE_ICONS['vimeo'] || TEMPLATE_ICONS['vimeo'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-medium',
    baseId: 'medium',
    name: 'Medium (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'READ MORE',
    subtitle: 'medium.com/@yourusername',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #050505 0%, #0f2f24 50%, #02b875 100%)',
    bgShapes: "<line x1=\"202.6\" y1=\"8.0\" x2=\"178.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"98.8,267.6 97.5,313.1 58.7,289.3\" fill=\"#02b875\" opacity=\"0.8\"/>\n<line x1=\"259.7\" y1=\"8.0\" x2=\"235.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"235.4\" y1=\"8.0\" x2=\"211.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"245.3\" y1=\"8.0\" x2=\"221.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"35.4,226.1 35.4,243.9 20.0,252.8 4.6,243.9 4.6,226.1 20.0,217.2\" fill=\"none\" stroke=\"#0f2f24\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"286.8,209.2 286.8,230.8 268.0,241.7 249.2,230.8 249.2,209.2 268.0,198.3\" fill=\"#0f2f24\" stroke=\"#0f2f24\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0f2f24\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#050505\" opacity=\"0.3\"/>\n<polygon points=\"120.5,13.0 130.1,31.5 109.3,30.5\" fill=\"#050505\" opacity=\"0.6\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0f2f24\" opacity=\"0.4\"/>\n<polygon points=\"42.9,267.0 39.2,305.2 8.0,282.9\" fill=\"#050505\" opacity=\"0.75\"/>\n<line x1=\"220.6\" y1=\"8.0\" x2=\"196.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#050505\" opacity=\"0.85\" transform=\"rotate(-32.74079471680097 300.0 173.0)\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#02b875\" opacity=\"0.35\"/>\n<polygon points=\"237.9,76.8 237.9,103.2 215.0,116.5 192.1,103.2 192.1,76.8 215.0,63.5\" fill=\"none\" stroke=\"#0f2f24\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"76.4,232.9 67.8,292.1 20.8,255.0\" fill=\"#0f2f24\" opacity=\"0.9\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#02b875\" opacity=\"0.4\"/>\n<polygon points=\"264.0,14.5 276.9,68.0 224.1,52.5\" fill=\"#02b875\" opacity=\"0.85\"/>\n<polygon points=\"23.4,126.8 13.5,138.9 8.1,124.3\" fill=\"#050505\" opacity=\"0.55\"/>\n<polygon points=\"268.4,272.1 259.5,303.1 237.1,279.8\" fill=\"#02b875\" opacity=\"0.7\"/>",
    svg: TEMPLATE_ICONS['medium'] || TEMPLATE_ICONS['medium'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-wechat',
    baseId: 'wechat',
    name: 'WeChat (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'SCAN TO CHAT',
    subtitle: 'WeChat ID: yourid',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #04240b 0%, #0a5c26 50%, #07C160 100%)',
    bgShapes: "<polygon points=\"16.1,121.1 22.2,135.4 6.7,133.5\" fill=\"#04240b\" opacity=\"0.55\"/>\n<polygon points=\"57.7,223.0 85.7,280.8 21.6,276.1\" fill=\"#07C160\" opacity=\"0.9\"/>\n<polygon points=\"46.2,274.1 31.4,304.5 12.5,276.5\" fill=\"#04240b\" opacity=\"0.75\"/>\n<polygon points=\"262.3,271.4 263.2,298.1 239.6,285.5\" fill=\"#0a5c26\" opacity=\"0.7\"/>\n<polygon points=\"237.5,77.0 237.5,103.0 215.0,115.9 192.5,103.0 192.5,77.0 215.0,64.1\" fill=\"none\" stroke=\"#07C160\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"124.8,14.0 127.1,34.6 108.1,26.4\" fill=\"#04240b\" opacity=\"0.6\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#04240b\" opacity=\"0.3\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#04240b\" opacity=\"0.85\" transform=\"rotate(-30.684845355387644 300.0 173.0)\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#07C160\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"235.8\" y1=\"8.0\" x2=\"211.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#0a5c26\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#07C160\" opacity=\"0.4\"/>\n<polygon points=\"287.0,209.1 287.0,230.9 268.0,241.9 249.0,230.9 249.0,209.1 268.0,198.1\" fill=\"#07C160\" stroke=\"#07C160\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"32.4,227.8 32.4,242.2 20.0,249.4 7.6,242.2 7.6,227.8 20.0,220.6\" fill=\"none\" stroke=\"#07C160\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#0a5c26\" opacity=\"0.4\"/>\n<line x1=\"205.1\" y1=\"8.0\" x2=\"181.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"85.2,262.0 109.2,304.2 60.6,303.8\" fill=\"#0a5c26\" opacity=\"0.8\"/>\n<polygon points=\"258.4,15.1 279.2,62.9 227.4,57.0\" fill=\"#0a5c26\" opacity=\"0.85\"/>\n<line x1=\"246.8\" y1=\"8.0\" x2=\"222.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"258.9\" y1=\"8.0\" x2=\"234.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"219.1\" y1=\"8.0\" x2=\"195.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['wechat'] || TEMPLATE_ICONS['wechat'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-skype',
    baseId: 'skype',
    name: 'Skype (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'CALL ME',
    subtitle: 'live:yourskypeid',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #001c3d 0%, #0078D4 50%, #00AFF0 100%)',
    bgShapes: "<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0078D4\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"235.4\" y1=\"8.0\" x2=\"211.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"206.8\" y1=\"8.0\" x2=\"182.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"96.6,267.3 98.8,311.4 59.5,291.3\" fill=\"#001c3d\" opacity=\"0.8\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#001c3d\" opacity=\"0.35\"/>\n<polygon points=\"22.0,124.3 16.4,138.9 6.6,126.8\" fill=\"#00AFF0\" opacity=\"0.55\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#00AFF0\" opacity=\"0.85\" transform=\"rotate(-30.91650607900878 300.0 173.0)\"/>\n<polygon points=\"43.1,266.7 39.3,305.5 7.6,282.8\" fill=\"#00AFF0\" opacity=\"0.75\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0078D4\" opacity=\"0.4\"/>\n<polygon points=\"256.9,11.6 283.0,63.4 225.1,60.0\" fill=\"#001c3d\" opacity=\"0.85\"/>\n<line x1=\"261.2\" y1=\"8.0\" x2=\"237.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#001c3d\" opacity=\"0.4\"/>\n<polygon points=\"264.4,271.2 262.3,300.0 238.3,283.8\" fill=\"#001c3d\" opacity=\"0.7\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#00AFF0\" opacity=\"0.3\"/>\n<line x1=\"248.9\" y1=\"8.0\" x2=\"224.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"219.8\" y1=\"8.0\" x2=\"195.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"288.1,208.4 288.1,231.6 268.0,243.2 247.9,231.6 247.9,208.4 268.0,196.8\" fill=\"#0078D4\" stroke=\"#0078D4\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"238.8,76.2 238.8,103.8 215.0,117.5 191.2,103.8 191.2,76.2 215.0,62.5\" fill=\"none\" stroke=\"#0078D4\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"34.6,226.6 34.6,243.4 20.0,251.9 5.4,243.4 5.4,226.6 20.0,218.1\" fill=\"none\" stroke=\"#0078D4\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"123.0,13.4 128.6,33.4 108.4,28.2\" fill=\"#00AFF0\" opacity=\"0.6\"/>\n<polygon points=\"72.8,226.5 75.1,292.2 17.1,261.3\" fill=\"#0078D4\" opacity=\"0.9\"/>",
    svg: TEMPLATE_ICONS['skype'] || TEMPLATE_ICONS['skype'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-zoom',
    baseId: 'zoom',
    name: 'Zoom (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'JOIN MEETING',
    subtitle: 'zoom.us/j/yourmeetingid',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #001c47 0%, #0b5cad 50%, #2D8CFF 100%)',
    bgShapes: "<polygon points=\"289.4,207.7 289.4,232.3 268.0,244.7 246.6,232.3 246.6,207.7 268.0,195.3\" fill=\"#001c47\" stroke=\"#001c47\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#0b5cad\" opacity=\"0.4\"/>\n<polygon points=\"104.5,272.4 90.5,315.7 60.0,282.0\" fill=\"#0b5cad\" opacity=\"0.8\"/>\n<polygon points=\"19.5,122.2 19.5,137.8 6.0,130.0\" fill=\"#2D8CFF\" opacity=\"0.55\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#0b5cad\" opacity=\"0.35\"/>\n<polygon points=\"33.7,262.9 47.3,299.2 9.0,292.9\" fill=\"#2D8CFF\" opacity=\"0.75\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#2D8CFF\" opacity=\"0.85\" transform=\"rotate(-36.6455122956869 300.0 173.0)\"/>\n<line x1=\"206.1\" y1=\"8.0\" x2=\"182.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"265.3,271.7 261.4,300.6 238.3,282.7\" fill=\"#0b5cad\" opacity=\"0.7\"/>\n<line x1=\"263.1\" y1=\"8.0\" x2=\"239.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"35.3,226.1 35.3,243.9 20.0,252.7 4.7,243.9 4.7,226.1 20.0,217.3\" fill=\"none\" stroke=\"#001c47\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"231.0\" y1=\"8.0\" x2=\"207.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"217.1\" y1=\"8.0\" x2=\"193.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"248.0\" y1=\"8.0\" x2=\"224.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#2D8CFF\" opacity=\"0.3\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#001c47\" opacity=\"0.4\"/>\n<polygon points=\"265.5,17.5 273.6,67.8 226.0,49.7\" fill=\"#0b5cad\" opacity=\"0.85\"/>\n<polygon points=\"126.8,15.1 125.1,35.8 108.0,24.0\" fill=\"#2D8CFF\" opacity=\"0.6\"/>\n<polygon points=\"236.5,77.6 236.5,102.4 215.0,114.9 193.5,102.4 193.5,77.6 215.0,65.1\" fill=\"none\" stroke=\"#001c47\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"55.2,223.2 86.8,278.6 23.0,278.2\" fill=\"#001c47\" opacity=\"0.9\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#001c47\" stroke-width=\"1.4\" opacity=\"0.3\"/>",
    svg: TEMPLATE_ICONS['zoom'] || TEMPLATE_ICONS['zoom'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-slack',
    baseId: 'slack',
    name: 'Slack (Brand Style)',
    category: 'Social Media',
    styleFamily: 'brand',
    headline: 'JOIN OUR SLACK',
    subtitle: 'yourteam.slack.com',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #36C5F0 0%, #2EB67D 33%, #ECB22E 66%, #E01E5A 100%)',
    bgShapes: "<polygon points=\"265.7,13.2 277.2,70.2 222.1,51.6\" fill=\"#2EB67D\" opacity=\"0.85\"/>\n<polygon points=\"288.3,208.3 288.3,231.7 268.0,243.4 247.7,231.7 247.7,208.3 268.0,196.6\" fill=\"#ECB22E\" stroke=\"#ECB22E\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"219.8\" y1=\"8.0\" x2=\"195.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"15.8,121.0 22.4,135.2 6.8,133.8\" fill=\"#E01E5A\" opacity=\"0.55\"/>\n<polygon points=\"260.0,270.7 264.9,296.5 240.1,287.8\" fill=\"#2EB67D\" opacity=\"0.7\"/>\n<line x1=\"261.8\" y1=\"8.0\" x2=\"237.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"93.7,266.1 101.3,309.5 59.9,294.4\" fill=\"#2EB67D\" opacity=\"0.8\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#ECB22E\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"249.6\" y1=\"8.0\" x2=\"225.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"127.9,16.0 123.8,36.4 108.2,22.6\" fill=\"#E01E5A\" opacity=\"0.6\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#E01E5A\" opacity=\"0.85\" transform=\"rotate(-30.197507807749336 300.0 173.0)\"/>\n<polygon points=\"38.5,264.1 43.9,302.8 7.6,288.1\" fill=\"#E01E5A\" opacity=\"0.75\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#ECB22E\" opacity=\"0.4\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#E01E5A\" opacity=\"0.3\"/>\n<polygon points=\"34.0,226.9 34.0,243.1 20.0,251.1 6.0,243.1 6.0,226.9 20.0,218.9\" fill=\"none\" stroke=\"#ECB22E\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"204.4\" y1=\"8.0\" x2=\"180.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#2EB67D\" opacity=\"0.4\"/>\n<line x1=\"235.8\" y1=\"8.0\" x2=\"211.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"74.4,232.2 69.4,290.7 21.2,257.1\" fill=\"#ECB22E\" opacity=\"0.9\"/>\n<polygon points=\"237.5,77.0 237.5,103.0 215.0,116.0 192.5,103.0 192.5,77.0 215.0,64.0\" fill=\"none\" stroke=\"#ECB22E\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#2EB67D\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['slack'] || TEMPLATE_ICONS['slack'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-yelp',
    baseId: 'yelp',
    name: 'Yelp (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'REVIEW US',
    subtitle: 'yelp.com/biz/yourbusiness',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #3d0a0a 0%, #D32323 50%, #FF6F61 100%)',
    bgShapes: "<line x1=\"259.6\" y1=\"8.0\" x2=\"235.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#FF6F61\" opacity=\"0.35\"/>\n<line x1=\"221.2\" y1=\"8.0\" x2=\"197.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#3d0a0a\" opacity=\"0.3\"/>\n<polygon points=\"268.7,14.2 274.8,72.3 221.5,48.5\" fill=\"#FF6F61\" opacity=\"0.85\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#FF6F61\" opacity=\"0.4\"/>\n<polygon points=\"287.1,209.0 287.1,231.0 268.0,242.1 248.9,231.0 248.9,209.0 268.0,197.9\" fill=\"#3d0a0a\" stroke=\"#3d0a0a\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"95.3,265.1 101.5,311.4 58.3,293.6\" fill=\"#FF6F61\" opacity=\"0.8\"/>\n<polygon points=\"19.7,122.3 19.3,137.9 6.0,129.8\" fill=\"#3d0a0a\" opacity=\"0.55\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#3d0a0a\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"207.6\" y1=\"8.0\" x2=\"183.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"128.9,16.9 122.6,36.7 108.6,21.4\" fill=\"#3d0a0a\" opacity=\"0.6\"/>\n<polygon points=\"32.6,227.7 32.6,242.3 20.0,249.5 7.4,242.3 7.4,227.7 20.0,220.5\" fill=\"none\" stroke=\"#3d0a0a\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"238.1,76.6 238.1,103.4 215.0,116.7 191.9,103.4 191.9,76.6 215.0,63.3\" fill=\"none\" stroke=\"#3d0a0a\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"73.3,232.0 70.1,289.9 21.6,258.1\" fill=\"#3d0a0a\" opacity=\"0.9\"/>\n<polygon points=\"267.1,271.2 260.9,302.4 237.0,281.4\" fill=\"#FF6F61\" opacity=\"0.7\"/>\n<line x1=\"232.6\" y1=\"8.0\" x2=\"208.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"38.2,265.7 42.6,301.7 9.2,287.5\" fill=\"#3d0a0a\" opacity=\"0.75\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#3d0a0a\" opacity=\"0.85\" transform=\"rotate(-38.826100946294204 300.0 173.0)\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#3d0a0a\" opacity=\"0.4\"/>\n<line x1=\"244.3\" y1=\"8.0\" x2=\"220.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['yelp'] || TEMPLATE_ICONS['yelp'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-etsy',
    baseId: 'etsy',
    name: 'Etsy (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'SHOP NOW',
    subtitle: 'etsy.com/shop/yourshop',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #3d1f00 0%, #F1641E 50%, #FFB238 100%)',
    bgShapes: "<polygon points=\"22.1,124.5 16.3,138.9 6.7,126.6\" fill=\"#3d1f00\" opacity=\"0.55\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#F1641E\" opacity=\"0.35\"/>\n<polygon points=\"34.3,226.8 34.3,243.2 20.0,251.5 5.7,243.2 5.7,226.8 20.0,218.5\" fill=\"none\" stroke=\"#3d1f00\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#3d1f00\" opacity=\"0.3\"/>\n<polygon points=\"75.7,233.2 67.8,291.4 21.4,255.4\" fill=\"#3d1f00\" opacity=\"0.9\"/>\n<polygon points=\"34.1,260.8 48.9,300.7 7.0,293.5\" fill=\"#3d1f00\" opacity=\"0.75\"/>\n<line x1=\"246.6\" y1=\"8.0\" x2=\"222.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"259.3\" y1=\"8.0\" x2=\"235.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"286.7,209.2 286.7,230.8 268.0,241.6 249.3,230.8 249.3,209.2 268.0,198.4\" fill=\"#3d1f00\" stroke=\"#3d1f00\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"92.2,266.9 101.4,307.8 61.4,295.3\" fill=\"#F1641E\" opacity=\"0.8\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#3d1f00\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"205.5\" y1=\"8.0\" x2=\"181.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#F1641E\" opacity=\"0.4\"/>\n<line x1=\"235.1\" y1=\"8.0\" x2=\"211.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"260.3,15.1 278.2,64.5 226.5,55.3\" fill=\"#F1641E\" opacity=\"0.85\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#3d1f00\" opacity=\"0.4\"/>\n<polygon points=\"123.4,13.5 128.3,33.7 108.3,27.8\" fill=\"#3d1f00\" opacity=\"0.6\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#3d1f00\" opacity=\"0.85\" transform=\"rotate(-31.05984185506177 300.0 173.0)\"/>\n<line x1=\"216.7\" y1=\"8.0\" x2=\"192.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"238.9,76.2 238.9,103.8 215.0,117.6 191.1,103.8 191.1,76.2 215.0,62.4\" fill=\"none\" stroke=\"#3d1f00\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"255.0,268.9 268.9,293.1 241.0,293.0\" fill=\"#F1641E\" opacity=\"0.7\"/>",
    svg: TEMPLATE_ICONS['etsy'] || TEMPLATE_ICONS['etsy'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-amazon',
    baseId: 'amazon',
    name: 'Amazon (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'SHOP NOW',
    subtitle: 'amazon.com/shops/yourstore',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0f1c2e 0%, #232f3e 50%, #FF9900 100%)',
    bgShapes: "<polygon points=\"260.3,17.2 276.4,63.5 228.3,54.3\" fill=\"#FF9900\" opacity=\"0.85\"/>\n<line x1=\"219.1\" y1=\"8.0\" x2=\"195.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#0f1c2e\" opacity=\"0.85\" transform=\"rotate(-35.51962390080407 300.0 173.0)\"/>\n<polygon points=\"46.6,267.5 36.8,308.1 6.6,279.3\" fill=\"#0f1c2e\" opacity=\"0.75\"/>\n<polygon points=\"21.3,123.6 17.4,138.7 6.3,127.7\" fill=\"#0f1c2e\" opacity=\"0.55\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#FF9900\" opacity=\"0.4\"/>\n<polygon points=\"128.8,16.8 122.7,36.7 108.5,21.5\" fill=\"#0f1c2e\" opacity=\"0.6\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#232f3e\" opacity=\"0.4\"/>\n<polygon points=\"287.6,208.7 287.6,231.3 268.0,242.7 248.4,231.3 248.4,208.7 268.0,197.3\" fill=\"#232f3e\" stroke=\"#232f3e\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"94.4,265.5 101.5,310.4 59.1,294.1\" fill=\"#FF9900\" opacity=\"0.8\"/>\n<polygon points=\"69.1,233.0 71.3,285.7 24.5,261.3\" fill=\"#232f3e\" opacity=\"0.9\"/>\n<line x1=\"245.0\" y1=\"8.0\" x2=\"221.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"261.7\" y1=\"8.0\" x2=\"237.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"230.5\" y1=\"8.0\" x2=\"206.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"32.8,227.6 32.8,242.4 20.0,249.8 7.2,242.4 7.2,227.6 20.0,220.2\" fill=\"none\" stroke=\"#232f3e\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"238.2,76.6 238.2,103.4 215.0,116.7 191.8,103.4 191.8,76.6 215.0,63.3\" fill=\"none\" stroke=\"#232f3e\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#0f1c2e\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#FF9900\" opacity=\"0.35\"/>\n<polygon points=\"262.2,269.7 264.6,298.9 238.2,286.4\" fill=\"#FF9900\" opacity=\"0.7\"/>\n<line x1=\"207.9\" y1=\"8.0\" x2=\"183.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#232f3e\" stroke-width=\"1.4\" opacity=\"0.3\"/>",
    svg: TEMPLATE_ICONS['amazon'] || TEMPLATE_ICONS['amazon'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-trustpilot',
    baseId: 'trustpilot',
    name: 'Trustpilot (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'RATE US',
    subtitle: 'trustpilot.com/review/yoursite',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #012a1f 0%, #00623f 50%, #00B67A 100%)',
    bgShapes: "<polygon points=\"239.7,75.7 239.7,104.3 215.0,118.5 190.3,104.3 190.3,75.7 215.0,61.5\" fill=\"none\" stroke=\"#012a1f\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"249.1\" y1=\"8.0\" x2=\"225.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#012a1f\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#00623f\" opacity=\"0.35\"/>\n<line x1=\"202.6\" y1=\"8.0\" x2=\"178.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"65.2,226.8 78.7,285.4 21.1,267.8\" fill=\"#012a1f\" opacity=\"0.9\"/>\n<polygon points=\"85.6,263.5 107.7,303.8 61.7,302.8\" fill=\"#00623f\" opacity=\"0.8\"/>\n<polygon points=\"32.3,227.9 32.3,242.1 20.0,249.2 7.7,242.1 7.7,227.9 20.0,220.8\" fill=\"none\" stroke=\"#012a1f\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"264.8,270.4 262.8,300.8 237.5,283.8\" fill=\"#00623f\" opacity=\"0.7\"/>\n<line x1=\"262.9\" y1=\"8.0\" x2=\"238.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#012a1f\" opacity=\"0.4\"/>\n<polygon points=\"127.7,15.8 124.1,36.3 108.2,22.9\" fill=\"#00B67A\" opacity=\"0.6\"/>\n<polygon points=\"31.2,264.4 47.3,296.4 11.5,294.3\" fill=\"#00B67A\" opacity=\"0.75\"/>\n<polygon points=\"255.9,14.6 280.8,61.0 228.3,59.4\" fill=\"#00623f\" opacity=\"0.85\"/>\n<polygon points=\"287.0,209.1 287.0,230.9 268.0,241.9 249.0,230.9 249.0,209.1 268.0,198.1\" fill=\"#012a1f\" stroke=\"#012a1f\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#00623f\" opacity=\"0.4\"/>\n<line x1=\"216.7\" y1=\"8.0\" x2=\"192.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"22.8,125.5 15.0,139.0 7.2,125.5\" fill=\"#00B67A\" opacity=\"0.55\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#00B67A\" opacity=\"0.3\"/>\n<line x1=\"230.0\" y1=\"8.0\" x2=\"206.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#00B67A\" opacity=\"0.85\" transform=\"rotate(-31.850555758009033 300.0 173.0)\"/>",
    svg: TEMPLATE_ICONS['trustpilot'] || TEMPLATE_ICONS['trustpilot'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-businesscard',
    baseId: 'businesscard',
    name: 'Business Card (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'SAVE MY CARD',
    subtitle: 'Your Name — Your Title',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0b1d33 0%, #1f3b57 50%, #c9a227 100%)',
    bgShapes: "<polygon points=\"127.9,15.9 123.9,36.3 108.2,22.7\" fill=\"#c9a227\" opacity=\"0.6\"/>\n<line x1=\"259.7\" y1=\"8.0\" x2=\"235.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"291.3,206.5 291.3,233.5 268.0,246.9 244.7,233.5 244.7,206.5 268.0,193.1\" fill=\"#0b1d33\" stroke=\"#0b1d33\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"255.9,13.5 281.9,61.5 227.3,60.0\" fill=\"#1f3b57\" opacity=\"0.85\"/>\n<line x1=\"244.6\" y1=\"8.0\" x2=\"220.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"18.6,121.8 20.3,137.3 6.1,131.0\" fill=\"#c9a227\" opacity=\"0.55\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#c9a227\" opacity=\"0.85\" transform=\"rotate(-30.791216130383056 300.0 173.0)\"/>\n<polygon points=\"264.3,273.3 260.4,298.9 240.3,282.8\" fill=\"#1f3b57\" opacity=\"0.7\"/>\n<line x1=\"234.8\" y1=\"8.0\" x2=\"210.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#c9a227\" opacity=\"0.3\"/>\n<line x1=\"217.3\" y1=\"8.0\" x2=\"193.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0b1d33\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"207.5\" y1=\"8.0\" x2=\"183.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#1f3b57\" opacity=\"0.35\"/>\n<polygon points=\"35.3,226.2 35.3,243.8 20.0,252.7 4.7,243.8 4.7,226.2 20.0,217.3\" fill=\"none\" stroke=\"#0b1d33\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#1f3b57\" opacity=\"0.4\"/>\n<polygon points=\"45.6,265.5 39.1,308.3 5.3,281.2\" fill=\"#c9a227\" opacity=\"0.75\"/>\n<polygon points=\"93.5,263.6 103.6,310.6 57.8,295.8\" fill=\"#1f3b57\" opacity=\"0.8\"/>\n<polygon points=\"238.9,76.2 238.9,103.8 215.0,117.6 191.1,103.8 191.1,76.2 215.0,62.4\" fill=\"none\" stroke=\"#0b1d33\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0b1d33\" opacity=\"0.4\"/>\n<polygon points=\"68.7,232.9 71.6,285.4 24.7,261.6\" fill=\"#0b1d33\" opacity=\"0.9\"/>",
    svg: TEMPLATE_ICONS['businesscard'] || TEMPLATE_ICONS['businesscard'] || TEMPLATE_ICONS['website'],
    qrType: 'vcard',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-resume',
    baseId: 'resume',
    name: 'Resume & CV (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'VIEW RESUME',
    subtitle: 'View my portfolio & resume',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0b0f19 0%, #334155 50%, #94a3b8 100%)',
    bgShapes: "<polygon points=\"263.1,19.7 272.9,64.7 229.0,50.6\" fill=\"#94a3b8\" opacity=\"0.85\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#94a3b8\" opacity=\"0.35\"/>\n<polygon points=\"286.8,209.1 286.8,230.9 268.0,241.7 249.2,230.9 249.2,209.1 268.0,198.3\" fill=\"#0b0f19\" stroke=\"#0b0f19\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#334155\" opacity=\"0.85\" transform=\"rotate(-38.91828543234066 300.0 173.0)\"/>\n<polygon points=\"89.4,266.6 103.1,305.5 62.5,297.9\" fill=\"#94a3b8\" opacity=\"0.8\"/>\n<line x1=\"232.3\" y1=\"8.0\" x2=\"208.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"260.2,270.7 264.8,296.6 240.0,287.7\" fill=\"#94a3b8\" opacity=\"0.7\"/>\n<line x1=\"221.5\" y1=\"8.0\" x2=\"197.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"33.8,227.0 33.8,243.0 20.0,251.0 6.2,243.0 6.2,227.0 20.0,219.0\" fill=\"none\" stroke=\"#0b0f19\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#94a3b8\" opacity=\"0.4\"/>\n<line x1=\"249.5\" y1=\"8.0\" x2=\"225.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0b0f19\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"235.5,78.2 235.5,101.8 215.0,113.6 194.5,101.8 194.5,78.2 215.0,66.4\" fill=\"none\" stroke=\"#0b0f19\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"206.1\" y1=\"8.0\" x2=\"182.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"35.3,266.6 43.2,298.8 11.4,289.6\" fill=\"#334155\" opacity=\"0.75\"/>\n<line x1=\"262.9\" y1=\"8.0\" x2=\"238.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#334155\" opacity=\"0.3\"/>\n<polygon points=\"58.5,223.7 84.7,281.2 21.8,275.1\" fill=\"#0b0f19\" opacity=\"0.9\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0b0f19\" opacity=\"0.4\"/>\n<polygon points=\"129.9,18.2 120.9,37.0 109.2,19.8\" fill=\"#334155\" opacity=\"0.6\"/>\n<polygon points=\"15.1,121.0 22.7,134.6 7.1,134.4\" fill=\"#334155\" opacity=\"0.55\"/>",
    svg: TEMPLATE_ICONS['resume'] || TEMPLATE_ICONS['resume'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-pdf',
    baseId: 'pdf',
    name: 'PDF Document (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'VIEW DOCUMENT',
    subtitle: 'Scan to open PDF',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #2b0a0a 0%, #7f1d1d 50%, #94a3b8 100%)',
    bgShapes: "<polygon points=\"290.3,207.1 290.3,232.9 268.0,245.8 245.7,232.9 245.7,207.1 268.0,194.2\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"34.5,226.6 34.5,243.4 20.0,251.8 5.5,243.4 5.5,226.6 20.0,218.2\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"48.1,269.1 34.7,308.7 7.1,277.3\" fill=\"#2b0a0a\" opacity=\"0.75\"/>\n<polygon points=\"124.6,13.9 127.3,34.5 108.1,26.5\" fill=\"#2b0a0a\" opacity=\"0.6\"/>\n<line x1=\"244.6\" y1=\"8.0\" x2=\"220.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"92.0,263.9 104.1,309.1 58.9,297.0\" fill=\"#7f1d1d\" opacity=\"0.8\"/>\n<line x1=\"234.8\" y1=\"8.0\" x2=\"210.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"256.4,268.0 269.0,294.7 239.6,292.3\" fill=\"#7f1d1d\" opacity=\"0.7\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#7f1d1d\" opacity=\"0.4\"/>\n<polygon points=\"255.7,11.7 283.5,62.2 225.9,61.0\" fill=\"#7f1d1d\" opacity=\"0.85\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#94a3b8\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"72.4,233.7 69.1,288.2 23.5,258.1\" fill=\"#94a3b8\" opacity=\"0.9\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#94a3b8\" opacity=\"0.4\"/>\n<line x1=\"262.0\" y1=\"8.0\" x2=\"238.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"239.5,75.9 239.5,104.1 215.0,118.3 190.5,104.1 190.5,75.9 215.0,61.7\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"218.6\" y1=\"8.0\" x2=\"194.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#2b0a0a\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#7f1d1d\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#2b0a0a\" opacity=\"0.85\" transform=\"rotate(-30.2806053301397 300.0 173.0)\"/>\n<polygon points=\"19.3,122.1 19.7,137.7 6.0,130.2\" fill=\"#2b0a0a\" opacity=\"0.55\"/>\n<line x1=\"203.2\" y1=\"8.0\" x2=\"179.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['pdf'] || TEMPLATE_ICONS['pdf'] || TEMPLATE_ICONS['website'],
    qrType: 'pdf',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-linkhub',
    baseId: 'linkhub',
    name: 'Link Hub (Brand Style)',
    category: 'Business',
    styleFamily: 'brand',
    headline: 'ALL MY LINKS',
    subtitle: '@yourusername',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #4c1d95 0%, #be185d 33%, #f97316 66%, #eab308 100%)',
    bgShapes: "<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#f97316\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#be185d\" opacity=\"0.35\"/>\n<line x1=\"261.1\" y1=\"8.0\" x2=\"237.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"89.2,261.3 107.7,308.0 58.1,300.7\" fill=\"#be185d\" opacity=\"0.8\"/>\n<polygon points=\"33.2,227.4 33.2,242.6 20.0,250.3 6.8,242.6 6.8,227.4 20.0,219.7\" fill=\"none\" stroke=\"#f97316\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"264.0,268.6 264.7,301.0 236.3,285.5\" fill=\"#be185d\" opacity=\"0.7\"/>\n<line x1=\"203.3\" y1=\"8.0\" x2=\"179.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#f97316\" opacity=\"0.4\"/>\n<line x1=\"233.6\" y1=\"8.0\" x2=\"209.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#eab308\" opacity=\"0.85\" transform=\"rotate(-37.886595652919866 300.0 173.0)\"/>\n<polygon points=\"42.5,266.6 39.7,305.0 7.8,283.4\" fill=\"#eab308\" opacity=\"0.75\"/>\n<polygon points=\"23.2,126.3 14.1,139.0 7.7,124.7\" fill=\"#eab308\" opacity=\"0.55\"/>\n<polygon points=\"271.7,21.7 266.8,71.1 226.5,42.1\" fill=\"#be185d\" opacity=\"0.85\"/>\n<polygon points=\"61.5,229.0 78.6,281.2 24.9,269.8\" fill=\"#f97316\" opacity=\"0.9\"/>\n<line x1=\"249.1\" y1=\"8.0\" x2=\"225.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#eab308\" opacity=\"0.3\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#be185d\" opacity=\"0.4\"/>\n<polygon points=\"238.0,76.7 238.0,103.3 215.0,116.6 192.0,103.3 192.0,76.7 215.0,63.4\" fill=\"none\" stroke=\"#f97316\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"220.6\" y1=\"8.0\" x2=\"196.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"125.7,14.4 126.3,35.2 108.0,25.4\" fill=\"#eab308\" opacity=\"0.6\"/>\n<polygon points=\"287.9,208.5 287.9,231.5 268.0,242.9 248.1,231.5 248.1,208.5 268.0,197.1\" fill=\"#f97316\" stroke=\"#f97316\" stroke-width=\"1.6\" opacity=\"1.0\"/>",
    svg: TEMPLATE_ICONS['linkhub'] || TEMPLATE_ICONS['linkhub'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-survey',
    baseId: 'survey',
    name: 'Survey (Brand Style)',
    category: 'Marketing',
    styleFamily: 'brand',
    headline: 'TAKE SURVEY',
    subtitle: 'Your feedback matters',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #a5b4fc 100%)',
    bgShapes: "<polygon points=\"259.6,18.4 275.8,62.3 229.6,54.3\" fill=\"#a5b4fc\" opacity=\"0.85\"/>\n<line x1=\"205.3\" y1=\"8.0\" x2=\"181.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"101.4,272.9 91.6,312.8 62.0,284.3\" fill=\"#a5b4fc\" opacity=\"0.8\"/>\n<polygon points=\"124.0,13.7 127.8,34.1 108.2,27.2\" fill=\"#1e1b4b\" opacity=\"0.6\"/>\n<line x1=\"262.6\" y1=\"8.0\" x2=\"238.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#4338ca\" opacity=\"0.4\"/>\n<polygon points=\"262.3,271.2 263.3,298.3 239.3,285.6\" fill=\"#a5b4fc\" opacity=\"0.7\"/>\n<line x1=\"233.6\" y1=\"8.0\" x2=\"209.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"45.5,267.4 37.5,307.2 7.0,280.4\" fill=\"#1e1b4b\" opacity=\"0.75\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#1e1b4b\" opacity=\"0.3\"/>\n<polygon points=\"288.2,208.3 288.2,231.7 268.0,243.3 247.8,231.7 247.8,208.3 268.0,196.7\" fill=\"#4338ca\" stroke=\"#4338ca\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"245.8\" y1=\"8.0\" x2=\"221.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#1e1b4b\" opacity=\"0.85\" transform=\"rotate(-31.49680014260074 300.0 173.0)\"/>\n<polygon points=\"22.2,124.5 16.1,138.9 6.7,126.5\" fill=\"#1e1b4b\" opacity=\"0.55\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#a5b4fc\" opacity=\"0.4\"/>\n<polygon points=\"62.5,223.6 82.7,284.7 19.7,271.7\" fill=\"#4338ca\" opacity=\"0.9\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#a5b4fc\" opacity=\"0.35\"/>\n<polygon points=\"32.7,227.7 32.7,242.3 20.0,249.7 7.3,242.3 7.3,227.7 20.0,220.3\" fill=\"none\" stroke=\"#4338ca\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"239.7,75.7 239.7,104.3 215.0,118.5 190.3,104.3 190.3,75.7 215.0,61.5\" fill=\"none\" stroke=\"#4338ca\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"221.7\" y1=\"8.0\" x2=\"197.7\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#4338ca\" stroke-width=\"1.4\" opacity=\"0.3\"/>",
    svg: TEMPLATE_ICONS['survey'] || TEMPLATE_ICONS['survey'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-loyalty',
    baseId: 'loyalty',
    name: 'Loyalty & Rewards (Brand Style)',
    category: 'Marketing',
    styleFamily: 'brand',
    headline: 'JOIN REWARDS',
    subtitle: 'Earn points every visit',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #3b0a45 0%, #a21caf 50%, #facc15 100%)',
    bgShapes: "<polygon points=\"289.4,207.6 289.4,232.4 268.0,244.7 246.6,232.4 246.6,207.6 268.0,195.3\" fill=\"#a21caf\" stroke=\"#a21caf\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"263.9,273.1 260.9,298.7 240.2,283.2\" fill=\"#3b0a45\" opacity=\"0.7\"/>\n<polygon points=\"129.5,17.7 121.6,36.9 108.9,20.4\" fill=\"#facc15\" opacity=\"0.6\"/>\n<polygon points=\"260.5,17.8 275.8,63.4 228.7,53.8\" fill=\"#3b0a45\" opacity=\"0.85\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#a21caf\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<line x1=\"202.2\" y1=\"8.0\" x2=\"178.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#facc15\" opacity=\"0.85\" transform=\"rotate(-32.49095595357739 300.0 173.0)\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#3b0a45\" opacity=\"0.4\"/>\n<polygon points=\"235.9,77.9 235.9,102.1 215.0,114.2 194.1,102.1 194.1,77.9 215.0,65.8\" fill=\"none\" stroke=\"#a21caf\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"99.9,267.7 96.8,314.0 58.3,288.2\" fill=\"#3b0a45\" opacity=\"0.8\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#facc15\" opacity=\"0.3\"/>\n<polygon points=\"23.9,128.4 11.9,138.5 9.2,123.1\" fill=\"#facc15\" opacity=\"0.55\"/>\n<polygon points=\"73.1,235.0 67.6,288.1 24.3,256.8\" fill=\"#a21caf\" opacity=\"0.9\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#a21caf\" opacity=\"0.4\"/>\n<polygon points=\"50.2,271.5 31.6,309.3 8.2,274.3\" fill=\"#facc15\" opacity=\"0.75\"/>\n<line x1=\"259.4\" y1=\"8.0\" x2=\"235.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"33.3,227.3 33.3,242.7 20.0,250.4 6.7,242.7 6.7,227.3 20.0,219.6\" fill=\"none\" stroke=\"#a21caf\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"220.4\" y1=\"8.0\" x2=\"196.4\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#3b0a45\" opacity=\"0.35\"/>\n<line x1=\"248.8\" y1=\"8.0\" x2=\"224.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"232.2\" y1=\"8.0\" x2=\"208.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['loyalty'] || TEMPLATE_ICONS['loyalty'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-donation',
    baseId: 'donation',
    name: 'Donation & Cause (Brand Style)',
    category: 'Marketing',
    styleFamily: 'brand',
    headline: 'DONATE NOW',
    subtitle: 'Support our cause',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #500724 0%, #be185d 50%, #fb7185 100%)',
    bgShapes: "<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#fb7185\" opacity=\"0.85\" transform=\"rotate(-37.595104403374535 300.0 173.0)\"/>\n<line x1=\"221.2\" y1=\"8.0\" x2=\"197.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"41.8,266.4 40.2,304.5 8.0,284.1\" fill=\"#fb7185\" opacity=\"0.75\"/>\n<polygon points=\"286.7,209.2 286.7,230.8 268.0,241.5 249.3,230.8 249.3,209.2 268.0,198.5\" fill=\"#500724\" stroke=\"#500724\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<polygon points=\"33.3,227.3 33.3,242.7 20.0,250.3 6.7,242.7 6.7,227.3 20.0,219.7\" fill=\"none\" stroke=\"#500724\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"257.1,270.1 266.8,294.3 241.0,290.6\" fill=\"#be185d\" opacity=\"0.7\"/>\n<polygon points=\"262.6,14.3 277.8,66.9 224.6,53.8\" fill=\"#be185d\" opacity=\"0.85\"/>\n<line x1=\"202.5\" y1=\"8.0\" x2=\"178.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#be185d\" opacity=\"0.35\"/>\n<polygon points=\"19.8,122.4 19.2,137.9 6.0,129.7\" fill=\"#fb7185\" opacity=\"0.55\"/>\n<polygon points=\"88.8,262.2 107.2,307.2 59.0,300.6\" fill=\"#be185d\" opacity=\"0.8\"/>\n<polygon points=\"239.5,75.9 239.5,104.1 215.0,118.2 190.5,104.1 190.5,75.9 215.0,61.8\" fill=\"none\" stroke=\"#500724\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#fb7185\" opacity=\"0.3\"/>\n<line x1=\"244.0\" y1=\"8.0\" x2=\"220.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"230.2\" y1=\"8.0\" x2=\"206.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#be185d\" opacity=\"0.4\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#500724\" opacity=\"0.4\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#500724\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"128.7,16.7 122.8,36.7 108.5,21.6\" fill=\"#fb7185\" opacity=\"0.6\"/>\n<polygon points=\"66.0,229.1 76.2,285.0 22.7,265.9\" fill=\"#500724\" opacity=\"0.9\"/>\n<line x1=\"262.0\" y1=\"8.0\" x2=\"238.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['donation'] || TEMPLATE_ICONS['donation'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-newsletter',
    baseId: 'newsletter',
    name: 'Newsletter (Brand Style)',
    category: 'Marketing',
    styleFamily: 'brand',
    headline: 'SUBSCRIBE',
    subtitle: 'Join our newsletter',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #022c22 0%, #0d9488 50%, #5eead4 100%)',
    bgShapes: "<polygon points=\"23.1,126.1 14.4,139.0 7.5,125.0\" fill=\"#0d9488\" opacity=\"0.55\"/>\n<polygon points=\"34.8,226.5 34.8,243.5 20.0,252.1 5.2,243.5 5.2,226.5 20.0,217.9\" fill=\"none\" stroke=\"#0d9488\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<polygon points=\"238.0,76.7 238.0,103.3 215.0,116.6 192.0,103.3 192.0,76.7 215.0,63.4\" fill=\"none\" stroke=\"#0d9488\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#0d9488\" opacity=\"0.3\"/>\n<line x1=\"205.8\" y1=\"8.0\" x2=\"181.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"124.7,13.9 127.2,34.6 108.1,26.5\" fill=\"#0d9488\" opacity=\"0.6\"/>\n<line x1=\"260.6\" y1=\"8.0\" x2=\"236.6\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"46.8,268.2 36.2,307.9 7.1,278.9\" fill=\"#0d9488\" opacity=\"0.75\"/>\n<line x1=\"234.0\" y1=\"8.0\" x2=\"210.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"247.8\" y1=\"8.0\" x2=\"223.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"60.6,223.3 83.9,283.2 20.4,273.5\" fill=\"#0d9488\" opacity=\"0.9\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#5eead4\" opacity=\"0.4\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#0d9488\" opacity=\"0.85\" transform=\"rotate(-38.268541845277674 300.0 173.0)\"/>\n<polygon points=\"288.1,208.4 288.1,231.6 268.0,243.2 247.9,231.6 247.9,208.4 268.0,196.8\" fill=\"#0d9488\" stroke=\"#0d9488\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#5eead4\" opacity=\"0.35\"/>\n<polygon points=\"261.6,267.2 267.1,299.6 236.3,288.1\" fill=\"#5eead4\" opacity=\"0.7\"/>\n<line x1=\"218.3\" y1=\"8.0\" x2=\"194.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#0d9488\" opacity=\"0.4\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#0d9488\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"108.3,273.5 87.6,318.5 59.0,278.0\" fill=\"#5eead4\" opacity=\"0.8\"/>\n<polygon points=\"267.2,14.9 274.9,70.6 222.9,49.5\" fill=\"#5eead4\" opacity=\"0.85\"/>",
    svg: TEMPLATE_ICONS['newsletter'] || TEMPLATE_ICONS['newsletter'] || TEMPLATE_ICONS['website'],
    qrType: 'email',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-booking',
    baseId: 'booking',
    name: 'Booking & Reservation (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'BOOK NOW',
    subtitle: 'Reserve your table / stay',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #0c1b33 0%, #1e3a5f 50%, #d4af37 100%)',
    bgShapes: "<polygon points=\"262.0,272.7 262.2,297.2 240.9,285.1\" fill=\"#d4af37\" opacity=\"0.7\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#1e3a5f\" opacity=\"0.85\" transform=\"rotate(-34.362169058808874 300.0 173.0)\"/>\n<polygon points=\"289.5,207.6 289.5,232.4 268.0,244.8 246.5,232.4 246.5,207.6 268.0,195.2\" fill=\"#1e3a5f\" stroke=\"#1e3a5f\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"249.0\" y1=\"8.0\" x2=\"225.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"259.5\" y1=\"8.0\" x2=\"235.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#d4af37\" opacity=\"0.35\"/>\n<polygon points=\"64.7,228.5 77.5,284.2 22.8,267.4\" fill=\"#1e3a5f\" opacity=\"0.9\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#1e3a5f\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"269.0,19.3 270.3,70.0 225.7,45.7\" fill=\"#d4af37\" opacity=\"0.85\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#1e3a5f\" opacity=\"0.3\"/>\n<line x1=\"216.5\" y1=\"8.0\" x2=\"192.5\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"33.4,227.3 33.4,242.7 20.0,250.4 6.6,242.7 6.6,227.3 20.0,219.6\" fill=\"none\" stroke=\"#1e3a5f\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#d4af37\" opacity=\"0.4\"/>\n<polygon points=\"99.5,265.6 98.9,314.8 56.6,289.6\" fill=\"#d4af37\" opacity=\"0.8\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#1e3a5f\" opacity=\"0.4\"/>\n<line x1=\"204.9\" y1=\"8.0\" x2=\"180.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"124.3,13.8 127.6,34.3 108.1,26.9\" fill=\"#1e3a5f\" opacity=\"0.6\"/>\n<polygon points=\"19.4,122.2 19.6,137.7 6.0,130.1\" fill=\"#1e3a5f\" opacity=\"0.55\"/>\n<polygon points=\"238.9,76.2 238.9,103.8 215.0,117.6 191.1,103.8 191.1,76.2 215.0,62.4\" fill=\"none\" stroke=\"#1e3a5f\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<polygon points=\"45.5,270.5 34.8,305.7 9.7,278.8\" fill=\"#1e3a5f\" opacity=\"0.75\"/>\n<line x1=\"230.0\" y1=\"8.0\" x2=\"206.0\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>",
    svg: TEMPLATE_ICONS['booking'] || TEMPLATE_ICONS['booking'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'brand-ticket',
    baseId: 'ticket',
    name: 'Event Ticket / Pass (Brand Style)',
    category: 'Utility',
    styleFamily: 'brand',
    headline: 'GET TICKETS',
    subtitle: 'Scan for your e-ticket',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #fbbf24 100%)',
    bgShapes: "<line x1=\"219.2\" y1=\"8.0\" x2=\"195.2\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<line x1=\"244.9\" y1=\"8.0\" x2=\"220.9\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<circle cx=\"280.0\" cy=\"60.0\" r=\"2.5\" fill=\"#4c1d95\" opacity=\"0.3\"/>\n<circle cx=\"275.0\" cy=\"260.0\" r=\"5.0\" fill=\"#1e1b4b\" opacity=\"0.4\"/>\n<circle cx=\"230.0\" cy=\"130.0\" r=\"3.0\" fill=\"#fbbf24\" opacity=\"0.4\"/>\n<polygon points=\"91.5,264.4 103.9,308.4 59.6,297.2\" fill=\"#1e1b4b\" opacity=\"0.8\"/>\n<polygon points=\"55.3,228.1 82.5,276.2 27.2,275.7\" fill=\"#fbbf24\" opacity=\"0.9\"/>\n<polygon points=\"288.0,208.5 288.0,231.5 268.0,243.1 248.0,231.5 248.0,208.5 268.0,196.9\" fill=\"#fbbf24\" stroke=\"#fbbf24\" stroke-width=\"1.6\" opacity=\"1.0\"/>\n<line x1=\"234.1\" y1=\"8.0\" x2=\"210.1\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"128.8,16.8 122.7,36.7 108.5,21.5\" fill=\"#4c1d95\" opacity=\"0.6\"/>\n<circle cx=\"45.0\" cy=\"90.0\" r=\"2.5\" fill=\"#1e1b4b\" opacity=\"0.35\"/>\n<polygon points=\"18.8,121.9 20.1,137.4 6.0,130.8\" fill=\"#4c1d95\" opacity=\"0.55\"/>\n<line x1=\"15.0\" y1=\"195.0\" x2=\"40.0\" y2=\"205.0\" stroke=\"#fbbf24\" stroke-width=\"1.4\" opacity=\"0.3\"/>\n<polygon points=\"32.2,228.0 32.2,242.0 20.0,249.1 7.8,242.0 7.8,228.0 20.0,220.9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"1.6\" opacity=\"0.5\"/>\n<line x1=\"263.8\" y1=\"8.0\" x2=\"239.8\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"261.1,15.0 277.9,65.3 226.0,54.7\" fill=\"#1e1b4b\" opacity=\"0.85\"/>\n<polygon points=\"41.1,262.6 43.8,305.8 5.1,286.6\" fill=\"#4c1d95\" opacity=\"0.75\"/>\n<polygon points=\"237.4,77.1 237.4,102.9 215.0,115.8 192.6,102.9 192.6,77.1 215.0,64.2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"1.6\" opacity=\"0.55\"/>\n<line x1=\"203.3\" y1=\"8.0\" x2=\"179.3\" y2=\"55.0\" stroke=\"#bbbbbb\" stroke-width=\"1.1\" opacity=\"0.35\"/>\n<polygon points=\"257.9,267.8 268.5,296.2 238.6,291.1\" fill=\"#1e1b4b\" opacity=\"0.7\"/>\n<rect x=\"255\" y=\"150\" width=\"90\" height=\"46\" fill=\"#4c1d95\" opacity=\"0.85\" transform=\"rotate(-37.0187117352554 300.0 173.0)\"/>",
    svg: TEMPLATE_ICONS['ticket'] || TEMPLATE_ICONS['ticket'] || TEMPLATE_ICONS['website'],
    qrType: 'url',
    fields: [
      { id: 'url', label: 'URL / Profile', type: 'text', placeholder: 'Enter content...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
];
