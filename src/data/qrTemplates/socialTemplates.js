// src/data/qrTemplates/socialTemplates.js
import { TEMPLATE_ICONS } from './templateIcons';

export const SOCIAL_TEMPLATES = [
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social Media',
    headline: 'FOLLOW ME',
    subtitle: '@YOURPAGE',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0d47a1 0%, #1877F2 60%, #42a5f5 100%)',
    svg: TEMPLATE_ICONS.facebook,
    qrType: 'facebook',
    fields: [
      { id: 'username', label: 'Facebook Username / Page ID', type: 'text', placeholder: 'yourpage' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'Social Media',
    headline: 'FOLLOW ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0e0e0e 0%, #2b2b2b 55%, #4a4a4a 100%)',
    svg: TEMPLATE_ICONS.threads,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Threads Profile URL', type: 'url', placeholder: 'https://threads.net/@yourusername' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    category: 'Social Media',
    headline: 'FOLLOW ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 55%, #333333 100%)',
    svg: TEMPLATE_ICONS.x,
    qrType: 'x',
    fields: [
      { id: 'username', label: 'X Username', type: 'text', placeholder: 'yourusername' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Social Media',
    headline: 'SUBSCRIBE',
    subtitle: '@YOURCHANNEL',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #7a0c10 0%, #b31217 45%, #FF0000 100%)',
    svg: TEMPLATE_ICONS.youtube,
    qrType: 'youtube',
    fields: [
      { id: 'url', label: 'YouTube Channel / Video URL', type: 'url', placeholder: 'https://youtube.com/@channel' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Social Media',
    headline: 'FOLLOW ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #010101 0%, #131313 40%, #35163f 75%, #001a1a 100%)',
    svg: TEMPLATE_ICONS.tiktok,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'TikTok Profile URL', type: 'url', placeholder: 'https://tiktok.com/@yourusername' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Social Media',
    headline: 'CONNECT',
    subtitle: '@YOURPROFILE',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #004182 0%, #0A66C2 55%, #0084bf 100%)',
    svg: TEMPLATE_ICONS.linkedin,
    qrType: 'linkedin',
    fields: [
      { id: 'username', label: 'LinkedIn Profile ID', type: 'text', placeholder: 'yourprofile' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  },
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'Social Media',
    headline: 'JOIN US',
    subtitle: 'r/YOURSUBREDDIT',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #ad3b00 0%, #FF4500 55%, #ff7a3d 100%)',
    svg: TEMPLATE_ICONS.reddit,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Reddit Subreddit / Profile URL', type: 'url', placeholder: 'https://reddit.com/r/subreddit' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Social Media',
    headline: 'JOIN US',
    subtitle: 'discord.gg/yourinvite',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #2b2f77 0%, #404EED 55%, #5865F2 100%)',
    svg: TEMPLATE_ICONS.discord,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Discord Server Invite Link', type: 'url', placeholder: 'https://discord.gg/invitecode' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Social Media',
    headline: 'LISTEN NOW',
    subtitle: '@YOURARTISTNAME',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #0f2a1a 0%, #145c33 45%, #1DB954 100%)',
    svg: TEMPLATE_ICONS.spotify,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Spotify Track / Playlist / Artist URL', type: 'url', placeholder: 'https://open.spotify.com/...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'dots',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'Social Media',
    headline: 'ADD ME',
    subtitle: '@YOURUSERNAME',
    isDarkHeadline: true,
    isDarkQrFrame: true,
    isDarkUser: true,
    background: 'linear-gradient(135deg, #FFFC00 0%, #FFF477 55%, #FFFC00 100%)',
    svg: TEMPLATE_ICONS.snapchat,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Snapchat Add Link', type: 'url', placeholder: 'https://snapchat.com/add/username' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'Social Media',
    headline: 'FOLLOW ME',
    subtitle: '@YOURPROFILE',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #7a0518 0%, #ad081b 45%, #E60023 100%)',
    svg: TEMPLATE_ICONS.pinterest,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Pinterest Profile URL', type: 'url', placeholder: 'https://pinterest.com/username' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Social Media',
    headline: 'STAR US',
    subtitle: 'github.com/yourusername',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #05070a 0%, #0d1117 45%, #24292e 100%)',
    svg: TEMPLATE_ICONS.github,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'GitHub Repository / Profile Link', type: 'url', placeholder: 'https://github.com/username' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'square',
      eyeStyle: 'square'
    }
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'Social Media',
    headline: 'JOIN US',
    subtitle: 't.me/yourchannel',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #1c5f8a 0%, #1c92d2 55%, #56c5f0 100%)',
    svg: TEMPLATE_ICONS.telegram,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Telegram Channel / Group Link', type: 'url', placeholder: 'https://t.me/channel' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'Social Media',
    headline: 'FOLLOW ME',
    subtitle: 'twitch.tv/yourusername',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #2a0845 0%, #6441A5 55%, #9146FF 100%)',
    svg: TEMPLATE_ICONS.twitch,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Twitch Channel URL', type: 'url', placeholder: 'https://twitch.tv/username' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    category: 'Social Media',
    headline: 'WATCH MORE',
    subtitle: 'vimeo.com/yourchannel',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #00121a 0%, #003244 55%, #1ab7ea 100%)',
    svg: TEMPLATE_ICONS.vimeo,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Vimeo Video / Channel Link', type: 'url', placeholder: 'https://vimeo.com/channel' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'Social Media',
    headline: 'READ MORE',
    subtitle: 'medium.com/@yourusername',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #050505 0%, #0f2f24 55%, #02b875 100%)',
    svg: TEMPLATE_ICONS.medium,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Medium Story / Author URL', type: 'url', placeholder: 'https://medium.com/@username' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'wechat',
    name: 'WeChat',
    category: 'Social Media',
    headline: 'SCAN TO CHAT',
    subtitle: 'WeChat ID: yourid',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #04240b 0%, #0a5c26 55%, #07C160 100%)',
    svg: TEMPLATE_ICONS.wechat,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'WeChat Link / Contact ID', type: 'text', placeholder: 'weixin://dl/chat?yourid' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'skype',
    name: 'Skype',
    category: 'Social Media',
    headline: 'CALL ME',
    subtitle: 'live:yourskypeid',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #001c3d 0%, #0078D4 55%, #00AFF0 100%)',
    svg: TEMPLATE_ICONS.skype,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Skype Name / Invite Link', type: 'text', placeholder: 'skype:yourskypeid?chat' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'Social Media',
    headline: 'JOIN MEETING',
    subtitle: 'zoom.us/j/yourmeetingid',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #001c47 0%, #0b5cad 55%, #2D8CFF 100%)',
    svg: TEMPLATE_ICONS.zoom,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Zoom Meeting URL', type: 'url', placeholder: 'https://zoom.us/j/1234567890' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Social Media',
    headline: 'JOIN OUR SLACK',
    subtitle: 'yourteam.slack.com',
    isDarkHeadline: false,
    isDarkQrFrame: false,
    isDarkUser: false,
    background: 'linear-gradient(135deg, #1a0d1f 0%, #4A154B 55%, #ECB22E 100%)',
    svg: TEMPLATE_ICONS.slack,
    qrType: 'url',
    fields: [
      { id: 'url', label: 'Slack Invite / Workspace Link', type: 'url', placeholder: 'https://join.slack.com/...' }
    ],
    preset: {
      qrColor: '#000000',
      bgColor: '#FFFFFF',
      dotStyle: 'rounded',
      eyeStyle: 'rounded'
    }
  }
];
