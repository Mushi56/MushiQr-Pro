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
        boxShadow: 'none',
        border: '1px solid var(--border-color)',
        ...style
      }}
    >
      <img
        src="/logo.png"
        alt="Mushi Qr Pro"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        onError={(e) => {
          // Fallback: show a styled placeholder if image fails
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #1a1a2e, #0a0a14)';
          e.currentTarget.parentElement.innerHTML = '<span style="color:#D60036;font-weight:900;font-size:' + (size * 0.45) + 'px;font-family:Outfit,sans-serif">M</span>';
        }}
      />
    </div>
  );
}
