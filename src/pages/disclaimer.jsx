import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Disclaimer() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6EE' }}>
      <Helmet>
        <title>Legal Disclaimer — Justice Junction 24/7</title>
        <meta name="description" content="Legal disclaimer for Justice Junction 24/7 lawyer discovery platform." />
      </Helmet>
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#7B1D2E', padding: '4rem 0', textAlign: 'center', paddingTop: '120px' }}>
        <span style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '9999px', marginBottom: '1rem' }}>
          Legal Document
        </span>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>
          Legal Disclaimer
        </h1>
        <div style={{ color: '#F5C4B3', fontSize: '1rem', marginTop: '0.5rem' }}>
          Last updated: April 2025
        </div>
        <div style={{ color: 'rgba(245,196,179,0.7)', fontSize: '0.875rem', marginTop: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link> &gt; Legal Disclaimer
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

        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          1. Nature of Service
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          <strong style={{ fontWeight: 600, color: '#1A0D10' }}>Justice Junction 24/7</strong> is a technology-driven lawyer discovery platform. We are not a law firm and do not provide legal advice, legal services, or legal representation. The platform serves as a directory to connect clients with independent legal professionals.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          2. No Attorney-Client Relationship
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          Use of the Justice Junction 24/7 platform, including the use of our search tools, booking systems, or automated chatbots, does not create an attorney-client relationship between you and Justice Junction 24/7. An attorney-client relationship is only formed when you explicitly engage a lawyer found through our platform and enter into a direct agreement with them.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          3. Accuracy of Information
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          While we strive to verify the credentials of lawyers listed on our platform (including Bar Council enrollment), we do not guarantee the accuracy, completeness, or timeliness of the information provided by lawyers. Users are encouraged to independently verify a lawyer's credentials and suitability before engagement.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          4. Limitation of Liability
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          Justice Junction 24/7 shall not be liable for any advice, actions, or omissions of any lawyer found through the platform. Any legal engagement is strictly between the user and the lawyer.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
          5. General Guidance
        </h2>
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          Information provided on this website, including articles in the "Know Your Rights" section or responses from the AI assistant, is for general informational purposes only and should not be construed as legal advice.
        </div>
      </div>
    </div>
  )
}
