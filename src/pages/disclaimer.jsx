import Head from 'next/head'

export default function Disclaimer() {
  return (
    <div className="page-wrap" style={{background:'var(--cream)'}}>
      <Head>
        <title>Legal Disclaimer — Justice Junction 24/7</title>
        <meta name="description" content="Legal disclaimer for Justice Junction 24/7 lawyer discovery platform." />
      </Head>
      <div className="container" style={{padding:'4rem 0'}}>
        <div style={{background:'#fff', padding:'3rem', borderRadius:'var(--r-lg)', border:'1px solid var(--border)'}}>
          <h1 style={{fontFamily:"'Playfair Display',serif", marginBottom:'2rem'}}>Legal Disclaimer</h1>
          
          <div style={s.content}>
            <p><strong>1. Nature of Service:</strong> Justice Junction 24/7 is a technology-driven lawyer discovery platform. We are not a law firm and do not provide legal advice, legal services, or legal representation. The platform serves as a directory to connect clients with independent legal professionals.</p>
            
            <p><strong>2. No Attorney-Client Relationship:</strong> Use of the Justice Junction 24/7 platform, including the use of our search tools, booking systems, or automated chatbots, does not create an attorney-client relationship between you and Justice Junction 24/7. An attorney-client relationship is only formed when you explicitly engage a lawyer found through our platform and enter into a direct agreement with them.</p>
            
            <p><strong>3. Accuracy of Information:</strong> While we strive to verify the credentials of lawyers listed on our platform (including Bar Council enrollment), we do not guarantee the accuracy, completeness, or timeliness of the information provided by lawyers. Users are encouraged to independently verify a lawyer's credentials and suitability before engagement.</p>
            
            <p><strong>4. Limitation of Liability:</strong> Justice Junction 24/7 shall not be liable for any advice, actions, or omissions of any lawyer found through the platform. Any legal engagement is strictly between the user and the lawyer.</p>
            
            <p><strong>5. General Guidance:</strong> Information provided on this website, including articles in the "Know Your Rights" section or responses from the AI assistant, is for general informational purposes only and should not be construed as legal advice.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  content: { display:'flex', flexDirection:'column', gap:'1.5rem', lineHeight:1.8, color:'var(--txt-2)' }
}
