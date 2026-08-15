import { 
  Link, 
  Type, 
  Wifi, 
  Mail, 
  Phone, 
  MessageSquare, 
  Contact,
  MapPin,
  FileText,
  File,
  Music,
  Image as ImageIcon,
  Coins,
  MessageCircle,
  Play,
  Calendar
} from 'lucide-react';
import { 
  FaInstagram, 
  FaFacebookF, 
  FaXTwitter, 
  FaLinkedinIn 
} from 'react-icons/fa6';
import { QR_TYPES } from '../utils/qrEngine';
import PaidCrownBadge from './PaidCrownBadge';

const TYPE_CONFIG = {
  [QR_TYPES.URL]: { icon: Link, label: 'URL', featId: 'qr_url' },
  [QR_TYPES.WIFI]: { icon: Wifi, label: 'WiFi', featId: 'qr_wifi' },
  [QR_TYPES.INSTAGRAM]: { icon: FaInstagram, label: 'Instagram', featId: 'qr_instagram' },
  [QR_TYPES.FACEBOOK]: { icon: FaFacebookF, label: 'Facebook', featId: 'qr_facebook' },
  [QR_TYPES.X]: { icon: FaXTwitter, label: 'X', featId: 'qr_x' },
  [QR_TYPES.LINKEDIN]: { icon: FaLinkedinIn, label: 'LinkedIn', featId: 'qr_linkedin' },
  [QR_TYPES.WHATSAPP]: { icon: MessageCircle, label: 'WhatsApp', featId: 'qr_whatsapp' },
  [QR_TYPES.TEXT]: { icon: Type, label: 'Text', featId: 'qr_text' },
  [QR_TYPES.PHONE]: { icon: Phone, label: 'Phone', featId: 'qr_phone' },
  [QR_TYPES.VCARD]: { icon: Contact, label: 'vCard', featId: 'qr_vcard' },
  [QR_TYPES.IMAGE]: { icon: ImageIcon, label: 'Image', featId: 'qr_image' },
  [QR_TYPES.PDF]: { icon: FileText, label: 'PDF', featId: 'qr_pdf' },
  [QR_TYPES.YOUTUBE]: { icon: Play, label: 'YouTube', featId: 'qr_youtube' },
  [QR_TYPES.EMAIL]: { icon: Mail, label: 'Email', featId: 'qr_email' },
  [QR_TYPES.SMS]: { icon: MessageSquare, label: 'SMS', featId: 'qr_sms' },
  [QR_TYPES.LOCATION]: { icon: MapPin, label: 'Location', featId: 'qr_location' },
  [QR_TYPES.EVENT]: { icon: Calendar, label: 'Event', featId: 'qr_event' },
  [QR_TYPES.CRYPTO]: { icon: Coins, label: 'Crypto', featId: 'qr_crypto' },
  [QR_TYPES.AUDIO]: { icon: Music, label: 'Audio', featId: 'qr_audio' },
  [QR_TYPES.DOCUMENT]: { icon: File, label: 'Document', featId: 'qr_document' },
};

export default function QRTypeSelector({ activeType, onTypeChange }) {
  return (
    <div className="type-tabs">
      {Object.entries(TYPE_CONFIG).map(([type, config]) => {
        const Icon = config.icon;
        return (
          <button
            key={type}
            className={`type-tab ${activeType === type ? 'active' : ''}`}
            onClick={() => onTypeChange(type)}
            style={{ position: 'relative' }}
          >
            <PaidCrownBadge featureId={config.featId} position="floating" size={10} />
            <span className="type-tab-icon">
              <Icon size={22} strokeWidth={1.5} />
            </span>
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
