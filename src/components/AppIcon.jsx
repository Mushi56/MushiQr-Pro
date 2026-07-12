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
        boxShadow: shadow 
          ? `0 ${size * 0.08}px ${size * 0.16}px rgba(0,0,0,0.12), 0 ${size * 0.02}px ${size * 0.04}px rgba(0,0,0,0.08)` 
          : 'none',
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
      
      {/* Premium Emboss & Inner Highlight Overlay */}
      {shadow && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: borderRadius,
            pointerEvents: 'none',
            boxShadow: `
              inset 0 ${size * 0.05}px ${size * 0.06}px rgba(255, 255, 255, 0.9), 
              inset 0 -${size * 0.05}px ${size * 0.06}px rgba(0, 0, 0, 0.18),
              inset 0 0 0 1px rgba(255, 255, 255, 0.4),
              inset 0 0 0 1.5px rgba(0, 0, 0, 0.05)
            `
          }}
        />
      )}
    </div>
  );
}
