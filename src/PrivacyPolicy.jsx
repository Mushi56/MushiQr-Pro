// PrivacyPolicy.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>Legal</div>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.updated}>Last updated: June 25, 2026</p>

        <Section title="1. Overview">
          Welcome to <strong>Mushi Qr Pro</strong>. We value your privacy above all else. This Privacy Policy outlines how your data is handled when you use our application.
        </Section>

        <Section title="2. 100% Client-Side Processing">
          Mushi Qr Pro is designed as a client-side application. Any content, URLs, text, Wi-Fi credentials, or image logos you upload to blend onto the QR code are processed **entirely within your local browser**. No logo image files or QR data are ever transmitted to, stored on, or processed by external web servers.
        </Section>

        <Section title="3. Local Storage for Projects">
          Your project history, preferences, and saved custom templates are stored locally in your browser's <code>localStorage</code> database. This data never leaves your device and is not shared with us or any third party. You can clear this data at any time through the Settings page or by clearing your browser site settings.
        </Section>

        <Section title="4. Cookies and Advertising">
          We use Google AdSense to serve non-intrusive advertisements to help support this free service. Google may use cookies to serve ads based on your visits to our website and other sites on the Internet. You can manage or disable personalized ads by visiting your Google Ad Settings page.
        </Section>

        <Section title="5. Web Analytics">
          We use Google Analytics and Vercel hosting metrics to gather anonymous, aggregated web server traffic statistics (such as page views, browser types, and screen sizes) to monitor performance and improve usability. No individual QR code contents, text, or logos are tracked or logged.
        </Section>

        <Section title="6. Third-Party Services">
          Our hosting environment and external services are managed by:
          <ul style={styles.list}>
            <li>Vercel (Website Hosting and Performance Logging)</li>
            <li>Google AdSense (Ad Delivery)</li>
            <li>Google Analytics (Aggregated Traffic Insights)</li>
          </ul>
          Please refer to their respective privacy policy pages for details on their data security standards.
        </Section>

        <Section title="7. Contact Us">
          For any inquiries regarding this policy or data safety, you can contact us at:{" "}
          <a href="mailto:contact@mushiqr-pro.com" style={styles.link}>
            contact@mushiqr-pro.com
          </a>
        </Section>
        
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/" state={{ activePage: 'settings' }} style={styles.backLink}>
            <ArrowLeft size={16} /> Back to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.sectionText}>{children}</div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    padding: "60px 20px",
    fontFamily: "var(--font-sans)",
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "var(--bg-card)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    padding: "50px",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    boxShadow: "var(--shadow-md)",
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
    fontSize: "36px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: "0 0 8px 0",
  },
  updated: {
    fontSize: "13px",
    color: "var(--text-tertiary)",
    marginBottom: "40px",
  },
  section: {
    marginBottom: "32px",
    paddingBottom: "32px",
    borderBottom: "1px solid var(--border-light)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--accent-primary)",
    marginBottom: "12px",
    letterSpacing: "0.5px",
  },
  sectionText: {
    fontSize: "15px",
    lineHeight: "1.8",
    color: "var(--text-secondary)",
    margin: 0,
  },
  list: {
    marginTop: "10px",
    paddingLeft: "20px",
    lineHeight: "2",
  },
  link: {
    color: "var(--accent-primary)",
    textDecoration: "none",
    fontWeight: "600",
  },
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
