import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6EE' }}>
      <Helmet>
        <title>Privacy Policy — Justice Junction 24/7</title>
        <meta name="description" content="Privacy policy for Justice Junction 24/7. Learn how we handle your data." />
      </Helmet>
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#7B1D2E', padding: '4rem 0', textAlign: 'center', paddingTop: '120px' }}>
        <span style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '9999px', marginBottom: '1rem' }}>
          Legal Document
        </span>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>
          Privacy Policy
        </h1>
        <div style={{ color: '#F5C4B3', fontSize: '1rem', marginTop: '0.5rem' }}>
          Last updated: April 2025
        </div>
        <div style={{ color: 'rgba(245,196,179,0.7)', fontSize: '0.875rem', marginTop: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link> &gt; Privacy Policy
        </div>
      </div>

      {/* Content Area */}
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #E8C9A8', color: '#7B1D2E', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', transition: 'all 0.2s' }} className="legal-back-btn">
            ← Back to Home
          </Link>
          <style>{`.legal-back-btn:hover { background-color: #7B1D2E !important; color: #fff !important; }`}</style>
        </div>

        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          At <strong style={{ fontWeight: 600, color: '#1A0D10' }}>Justice Junction 24/7</strong>, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          1. Information We Collect
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          We collect information you provide directly to us, such as when you create an account, search for a lawyer, or book a consultation. This may include your name, email address, phone number, and details related to your legal query.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          2. How We Use Your Information
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          We use your information to facilitate connections with legal professionals, process bookings, improve our platform, and communicate with you about your account and our services.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          3. Data Security
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          4. Sharing with Third Parties
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          We only share your information with lawyers you choose to book consultations with. We do not sell your personal data to third parties for marketing purposes.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          5. Your Rights
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          You have the right to access, correct, or delete your personal information at any time through your dashboard or by contacting our support team.
        </div>
      </div>
    </div>
  )
}
