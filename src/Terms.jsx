import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>Legal</div>
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.updated}>Last updated: June 25, 2026</p>

        <Section title="1. Acceptance of Terms">
          By accessing and using <strong>Mushi Qr Pro</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
        </Section>

        <Section title="2. Content Ownership and Commercial Rights">
          All QR codes, branded graphics, and design assets generated using Mushi Qr Pro are <strong>100% owned by you</strong> (the creator). You are granted a non-exclusive, perpetual, worldwide, royalty-free license to use, reproduce, and distribute the generated images for any personal or commercial purposes without any credit or attribution required.
        </Section>

        <Section title="3. User Content & Responsibilities">
          You are solely responsible for the content, URLs, text, credentials, or other data you encode into the QR codes using our service. You represent and warrant that you have the legal right to distribute the encoded content and that it does not infringe on any third-party intellectual property or privacy rights.
        </Section>

        <Section title="4. Prohibited Uses">
          You agree not to use Mushi Qr Pro to generate QR codes that link to or distribute:
          <ul style={styles.list}>
            <li>Phishing sites, malware, spyware, or malicious software.</li>
            <li>Fraudulent schemes or deceptive content.</li>
            <li>Illegal goods, services, or materials.</li>
            <li>Spam or unsolicited promotional campaigns.</li>
          </ul>
          We reserve the right to report malicious usage to hosting or network providers if we become aware of abuse.
        </Section>

        <Section title="5. Client-Side Execution & Data Privacy">
          Mushi Qr Pro operates entirely as a client-side web application. All QR code calculations, customization designs, background removals, and logo blending take place directly in your browser. We do not transmit, collect, or store any of your data, uploaded logo images, or generated QR codes on external servers.
        </Section>

        <div style={styles.warningBox}>
          <div style={styles.warningHeader}>
            <AlertTriangle size={20} color="var(--accent-primary)" />
            <span style={styles.warningTitle}>6. Mandatory Pre-Print Scan Verification</span>
          </div>
          <p style={styles.warningText}>
            <strong>CRITICAL NOTICE:</strong> QR code readability depends heavily on contrast, dot sizing, eye frames, logo placement, scan distance, lighting conditions, and device cameras.
            <br /><br />
            You are <strong>required to physically test and verify</strong> the scannability of your generated QR codes on multiple mobile devices and reader applications <strong>before</strong> printing, manufacturing, or distributing physical assets. Mushi Qr Pro and its operators are not liable for any print material losses, marketing costs, or damages arising from unscannable or broken QR codes.
          </p>
        </div>

        <Section title="7. Disclaimer of Warranties">
          The service is provided on an "as is" and "as available" basis. Mushi Qr Pro makes no warranties, expressed or implied, regarding the availability, scannability, reliability, or compatibility of the QR codes across all devices.
        </Section>

        <Section title="8. Limitation of Liability">
          In no event shall Mushi Qr Pro, its creators, or hosting partners (Vercel) be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, including but not limited to print losses, link expiration, or user error.
        </Section>

        <Section title="9. Contact Us">
          If you have any questions, feedback, or concerns regarding these Terms, please contact us at:{" "}
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
  warningBox: {
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
  },
  warningHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  warningTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--accent-primary)",
  },
  warningText: {
    fontSize: "15px",
    lineHeight: "1.8",
    color: "var(--text-secondary)",
    margin: 0,
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
