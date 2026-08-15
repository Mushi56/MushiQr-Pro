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
        boxShadow: shadow ? `0 ${size * 0.08}px ${size * 0.2}px rgba(214,0,54,0.3)` : 'none',
        ...style
      }}
    >
      <img
        src="/logo.webp"
        alt="Mushi QR Pro Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}
