import { Hand } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer" style={{
      marginTop: 'auto',
      padding: '4rem 2rem 2rem 2rem',
      borderTop: '1px solid var(--card-border)',
      background: 'var(--bg-main)',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Branding Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
            <Hand size={28} color="var(--primary)" />
            <span>HandMotion <span style={{ color: "var(--primary)" }}>Play</span></span>
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '300px' }}>
            AI-powered hand exercise gaming platform for physiotherapy and rehabilitation. Improve hand mobility through fun, interactive games.
          </p>
        </div>

        {/* Links Columns */}
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/games" style={{ color: 'var(--text-muted)' }}>Games</a>
            <a href="/progress" style={{ color: 'var(--text-muted)' }}>Progress</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>How It Works</a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Resources</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Documentation</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Help Center</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Contact Us</a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Legal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Services</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Cookie Policy</a>
          </div>
        </div>
      </div>

      <div style={{
        paddingTop: '2rem',
        borderTop: '1px solid var(--card-border)',
        textAlign: 'center',
        fontSize: '0.875rem'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>© 2026 Hand Motion Play. All rights reserved.</div>
        <div style={{ color: 'var(--text-main)' }}>Built with care for rehabilitation</div>
      </div>
    </footer>
  );
};

export default Footer;