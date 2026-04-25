import Head from 'next/head'

export default function PrivacyPolicy() {
  return (
    <div className="page-wrap" style={{background:'var(--cream)'}}>
      <Head>
        <title>Privacy Policy — Justice Junction 24/7</title>
        <meta name="description" content="Privacy policy for Justice Junction 24/7. Learn how we handle your data." />
      </Head>
      <div className="container" style={{padding:'4rem 0'}}>
        <div style={{background:'#fff', padding:'3rem', borderRadius:'var(--r-lg)', border:'1px solid var(--border)'}}>
          <h1 style={{fontFamily:"'Playfair Display',serif", marginBottom:'2rem'}}>Privacy Policy</h1>
          
          <div style={s.content}>
            <p>At Justice Junction 24/7, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
            
            <h2 style={s.h2}>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, search for a lawyer, or book a consultation. This may include your name, email address, phone number, and details related to your legal query.</p>
            
            <h2 style={s.h2}>2. How We Use Your Information</h2>
            <p>We use your information to facilitate connections with legal professionals, process bookings, improve our platform, and communicate with you about your account and our services.</p>
            
            <h2 style={s.h2}>3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
            
            <h2 style={s.h2}>4. Sharing with Third Parties</h2>
            <p>We only share your information with lawyers you choose to book consultations with. We do not sell your personal data to third parties for marketing purposes.</p>
            
            <h2 style={s.h2}>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time through your dashboard or by contacting our support team.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  content: { display:'flex', flexDirection:'column', gap:'1.5rem', lineHeight:1.8, color:'var(--txt-2)' },
  h2: { fontSize:'1.3rem', fontWeight:700, color:'var(--bur)', marginTop:'1rem' }
}
