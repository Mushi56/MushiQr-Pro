// About.jsx
import { Link } from 'react-router-dom';
import { Zap, Sliders, ShieldCheck, Smartphone, ArrowLeft, Paintbrush, Layers, Maximize } from 'lucide-react';

export default function About() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.badge}>About the App</div>
        <h1 style={styles.title}>Mushi Qr Pro</h1>
        <p style={styles.subtitle}>
          A professional-grade, fully customizable QR code generator. Design custom shapes, blend logos, remove backgrounds, and export vectors in real-time.
        </p>
      </div>

      <div style={styles.grid}>
        <FeatureCard icon={<Zap size={32} color="var(--accent-primary)" />} title="Instant Live Preview" desc="QR codes update instantly on the canvas as you adjust content, colors, shapes, or presets." />
        <FeatureCard icon={<Maximize size={32} color="var(--accent-primary)" />} title="Interactive Canvas" desc="Click and drag elements directly on the preview canvas to scale, rotate, or reposition them." />
        <FeatureCard icon={<Paintbrush size={32} color="var(--accent-primary)" />} title="Advanced Styling" desc="Customize dot designs, select custom eye frame styles, and add linear or radial gradients." />
        <FeatureCard icon={<Layers size={32} color="var(--accent-primary)" />} title="Background Remover" desc="Erase white or black backgrounds, or pick target colors precisely with a pixel magnifier pipette." />
        <FeatureCard icon={<ShieldCheck size={32} color="var(--accent-primary)" />} title="100% Client-Side" desc="All logo blending, background removal, and rendering are done locally in your browser for absolute privacy." />
        <FeatureCard icon={<Smartphone size={32} color="var(--accent-primary)" />} title="Responsive Design" desc="Designed for mobile, tablet, and desktop. Tap, swipe, and drag on any screen size." />
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Our Mission</h2>
        <p style={styles.cardText}>
          Mushi Qr Pro was created to provide everyone with free access to high-fidelity, professional QR code creation tools. We believe that custom branding, vector exports, and high-quality designs should be available to small business owners, developers, and creators without subscription limits, accounts, or watermarks.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Key Features</h2>
        <div style={styles.steps}>
          <Step num="1" text="Custom Typography: Support for Center and Frame text, with Top/Bottom options and backgrounds like pill, outline, underline, ribbon, glow, or hexagon." />
          <Step num="2" text="Official Preset Library: Instantly load high-resolution app store brand icon presets onto the QR code canvas." />
          <Step num="3" text="Vector Formats: Export your final creations instantly as PNG, JPG, vector SVG, or print-ready PDF files." />
        </div>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Built with ❤️ by <strong>Mushi</strong> · Deployed on Vercel
        </p>
        <Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" style={styles.backLink}>
            <ArrowLeft size={16} /> Back to Generator
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.icon}>{icon}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDesc}>{desc}</p>
    </div>
  );
}

function Step({ num, text }) {
  return (
    <div style={styles.step}>
      <div style={styles.stepNum}>{num}</div>
      <p style={styles.stepText}>{text}</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    padding: "60px 20px",
    fontFamily: "var(--font-sans)",
    color: "var(--text-primary)",
  },
  hero: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 60px",
  },
  badge: {
    display: "inline-block",
    background: "var(--accent-soft)",
    color: "var(--accent-primary)",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  title: {
    fontSize: "clamp(40px, 8vw, 56px)",
    fontWeight: "900",
    color: "var(--text-primary)",
    margin: "0 0 16px",
    background: "var(--accent-gradient)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "18px",
    color: "var(--text-secondary)",
    lineHeight: "1.7",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto 40px",
  },
  featureCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "20px",
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "var(--shadow-sm)",
  },
  icon: { marginBottom: "16px", display: "flex", justifyContent: "center" },
  featureTitle: { fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" },
  featureDesc: { fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 },
  card: {
    maxWidth: "800px",
    margin: "0 auto 30px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "var(--shadow-md)",
  },
  cardTitle: { fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "20px" },
  cardText: { fontSize: "16px", lineHeight: "1.8", color: "var(--text-secondary)", margin: 0 },
  steps: { display: "flex", flexDirection: "column", gap: "20px" },
  step: { display: "flex", alignItems: "center", gap: "20px" },
  stepNum: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "var(--accent-gradient)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "800", fontSize: "16px", color: "#fff", flexShrink: 0,
    boxShadow: "var(--shadow-glow)",
  },
  stepText: { fontSize: "15px", color: "var(--text-secondary)", margin: 0, fontWeight: "500", lineHeight: "1.5" },
  footer: { textAlign: "center", marginTop: "80px" },
  footerText: { color: "var(--text-tertiary)", fontSize: "14px", marginBottom: "16px" },
  link: { color: "var(--accent-primary)", textDecoration: "none", fontSize: "14px", fontWeight: "600" },
  backLink: {
    color: "var(--text-primary)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 24px",
    background: "var(--bg-elevated)",
    borderRadius: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.2s",
    border: "1px solid var(--border-color)",
  }
};
