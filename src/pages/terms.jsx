import Head from 'next/head'
import Link from 'next/link'
import { Scale, FileText, Shield, AlertTriangle } from 'lucide-react'

export default function Terms() {
  return (
    <div className="page-wrap" style={{background:'var(--cream)'}}>
      <Head>
        <title>Terms of Service — Justice Junction 24/7</title>
        <meta name="description" content="Read the Terms of Service for Justice Junction 24/7 — India's verified lawyer discovery platform." />
        <meta property="og:title" content="Terms of Service — Justice Junction 24/7" />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/terms" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Head>

      <div className="container" style={{padding:'4rem 5vw', maxWidth:860}}>
        <div style={{marginBottom:'2rem'}}>
          <Link href="/" style={{color:'var(--txt-3)', fontSize:'.85rem'}}>← Back to Home</Link>
        </div>

        <div style={s.card}>
          <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:'2rem'}}>
            <div style={s.iconBox}><Scale size={24}/></div>
            <div>
              <h1 style={s.h1}>Terms of Service</h1>
              <p style={{color:'var(--txt-3)', fontSize:'.85rem', margin:0}}>Last updated: April 2025</p>
            </div>
          </div>

          <div style={s.alertBox}>
            <AlertTriangle size={18} color="var(--gold)"/>
            <span>Please read these terms carefully before using Justice Junction 24/7.</span>
          </div>

          <div style={s.content}>
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

            <Section title="11. Contact Us">
              For any questions about these Terms, please contact us via our <Link href="/contact" style={{color:'var(--bur)', fontWeight:700}}>Contact page</Link> or WhatsApp at +91 9188371233.
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{marginBottom:'1.8rem'}}>
      <h2 style={{fontSize:'1.05rem', fontWeight:800, color:'var(--bur)', marginBottom:'0.6rem'}}>{title}</h2>
      <p style={{lineHeight:1.8, color:'var(--txt-2)', margin:0}}>{children}</p>
    </div>
  )
}

const s = {
  card: { background:'#fff', padding:'3rem', borderRadius:'24px', border:'1px solid var(--border)', boxShadow:'0 4px 24px rgba(0,0,0,0.04)' },
  iconBox: { width:52, height:52, borderRadius:'14px', background:'var(--bur)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'2rem', fontWeight:800, margin:0 },
  alertBox: { background:'var(--gold-p)', border:'1px solid var(--gold)', borderRadius:'12px', padding:'1rem 1.2rem', display:'flex', alignItems:'center', gap:10, marginBottom:'2rem', fontSize:'.9rem', fontWeight:600, color:'var(--txt)' },
  content: { borderTop:'1px solid var(--border)', paddingTop:'2rem' },
}
