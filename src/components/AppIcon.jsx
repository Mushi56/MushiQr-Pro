/**
 * AppIcon — The unified MushiQR Pro app icon component.
 * Renders the logo with iPhone-style squircle (super-ellipse) corners everywhere.
 * Usage: <AppIcon size={42} /> or <AppIcon size={96} shadow />
 */
export default function AppIcon({ size = 42, shadow = false, className = '', style = {} }) {
  const borderRadius = size * 0.22; // iPhone squircle ratio (~22%)
  
  return (
    <div
      className={`app-icon-squircle ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(135deg, #181824 0%, #0d0d15 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: shadow || true ? `0 ${size * 0.05}px ${size * 0.12}px rgba(0,0,0,0.25)` : 'none',
        ...style
      }}
    >
      <svg width="64%" height="64%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff758f" />
            <stop offset="50%" stopColor="#D60036" />
            <stop offset="100%" stopColor="#7000FF" />
          </linearGradient>
        </defs>
        {/* Styled pattern of fluid QR dots without finder eyes */}
        <rect x="10" y="10" width="16" height="16" rx="8" fill="url(#icon-grad)" />
        <rect x="34" y="10" width="32" height="16" rx="8" fill="url(#icon-grad)" />
        <rect x="74" y="10" width="16" height="16" rx="8" fill="url(#icon-grad)" />
        
        <rect x="10" y="34" width="16" height="32" rx="8" fill="url(#icon-grad)" />
        <rect x="34" y="34" width="16" height="16" rx="8" fill="url(#icon-grad)" />
        <rect x="58" y="34" width="32" height="16" rx="8" fill="url(#icon-grad)" />
        
        <rect x="58" y="58" width="16" height="32" rx="8" fill="url(#icon-grad)" />
        <rect x="34" y="58" width="16" height="16" rx="8" fill="url(#icon-grad)" />
        <rect x="76" y="58" width="14" height="14" rx="7" fill="url(#icon-grad)" opacity="0.85" />

        <rect x="10" y="74" width="32" height="16" rx="8" fill="url(#icon-grad)" />
        <circle cx="83" cy="83" r="7" fill="url(#icon-grad)" />
      </svg>
    </div>
  );
}
