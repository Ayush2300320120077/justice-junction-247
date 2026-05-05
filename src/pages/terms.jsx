import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6EE' }}>
      <Head>
        <title>Terms of Service — Justice Junction 24/7</title>
        <meta name="description" content="Read the Terms of Service for Justice Junction 24/7 — India's verified lawyer discovery platform." />
      </Head>
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#7B1D2E', padding: '4rem 0', textAlign: 'center', paddingTop: '120px' }}>
        <span style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '9999px', marginBottom: '1rem' }}>
          Legal Document
        </span>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '2.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>
          Terms of Service
        </h1>
        <div style={{ color: '#F5C4B3', fontSize: '1rem', marginTop: '0.5rem' }}>
          Last updated: April 2025
        </div>
        <div style={{ color: 'rgba(245,196,179,0.7)', fontSize: '0.875rem', marginTop: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link> &gt; Terms of Service
        </div>
      </div>

      {/* Content Area */}
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #E8C9A8', color: '#7B1D2E', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', transition: 'all 0.2s' }} className="legal-back-btn">
            ← Back to Home
          </Link>
          <style>{`.legal-back-btn:hover { background-color: #7B1D2E !important; color: #fff !important; }`}</style>
        </div>
        
        <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
          Please read these terms carefully before using <strong style={{ fontWeight: 600, color: '#1A0D10' }}>Justice Junction 24/7</strong>.
        </div>
        
        <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>
        
        <Section title="1. Acceptance of Terms">
          By accessing or using Justice Junction 24/7 ("the Platform", "we", "us"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the Platform.
        </Section>

        <Section title="2. Nature of the Platform">
          Justice Junction 24/7 is a technology platform that connects clients with independent legal professionals. We are not a law firm and do not provide legal advice, legal services, or legal representation. All legal services are provided by independent advocates registered with the Bar Council of India.
        </Section>

        <Section title="3. User Eligibility">
          You must be at least 18 years of age to use this Platform. By registering, you confirm that all information you provide is accurate, complete, and up to date.
        </Section>

        <Section title="4. Lawyer Listings & Verification">
          We verify lawyer credentials against Bar Council of India records. However, we do not guarantee the accuracy, completeness, or currency of any lawyer's information. Users are encouraged to independently verify a lawyer's credentials before engaging their services. The "Verified" badge indicates Bar Council enrollment verification only.
        </Section>

        <Section title="5. Bookings & Payments">
          Consultation fees are set by individual lawyers. All payments are processed securely via Razorpay. Justice Junction does not retain payment information. Refunds are subject to our Refund Policy and the circumstances of the booking.
        </Section>

        <Section title="6. No Attorney-Client Relationship">
          Use of this Platform, including use of search tools, booking systems, or the AI assistant, does not create an attorney-client relationship between you and Justice Junction 24/7. Such a relationship is only formed when you directly engage a lawyer and enter into a formal agreement with them.
        </Section>

        <Section title="7. User Conduct">
          You agree not to: (a) misuse the Platform; (b) submit false or misleading information; (c) harass, defame, or threaten any user or lawyer; (d) attempt to circumvent our security measures; (e) use the Platform for any illegal purpose.
        </Section>

        <Section title="8. Intellectual Property">
          All content, trademarks, and software on this Platform are owned by Justice Junction 24/7 or licensed to us. You may not reproduce, distribute, or create derivative works without our express written consent.
        </Section>

        <Section title="9. Limitation of Liability">
          Justice Junction 24/7 shall not be liable for any advice, actions, or omissions of any lawyer found through the Platform. Our total liability in any matter shall not exceed the amount paid by you for the relevant booking.
        </Section>

        <Section title="10. Governing Law">
          These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.
        </Section>

        <Section title="11. Contact Us" isLast={true}>
          For any questions about these Terms, please contact us via our <Link href="/contact" style={{ color: '#7B1D2E', fontWeight: 600, textDecoration: 'underline' }}>Contact page</Link> or WhatsApp at +91 9188371233.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children, isLast }) {
  return (
    <>
      <h2 style={{ color: '#7B1D2E', fontWeight: 700, fontSize: '1.25rem', marginTop: '2.5rem', marginBottom: '0.75rem', borderLeft: '4px solid #7B1D2E', paddingLeft: '1rem' }}>
        {title}
      </h2>
      <div style={{ color: '#1A0D10', fontSize: '1rem', lineHeight: 1.625, marginBottom: '1rem' }}>
        {children}
      </div>
      {!isLast && <div style={{ borderTop: '1px solid #E8C9A8', margin: '2rem 0' }}></div>}
    </>
  )
}
