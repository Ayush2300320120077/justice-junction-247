import { useState } from 'react'
import Head from 'next/head'
import { FileText, Download, CheckCircle, ShieldCheck, Info } from 'lucide-react'
import { jsPDF } from 'jspdf'

const TEMPLATES = [
  { id: 'rental', name: 'Rental Agreement', description: 'Standard residential lease agreement for India.' },
  { id: 'affidavit', name: 'General Affidavit', description: 'Standard self-declaration for various legal purposes.' },
  { id: 'promissory', name: 'Promissory Note', description: 'Legal document for debt acknowledgment and repayment.' },
  { id: 'legal-notice', name: 'Legal Notice', description: 'Formal legal notice to demand action or assert rights before filing a case.' },
  { id: 'consumer-complaint', name: 'Consumer Complaint', description: 'Complaint letter to Consumer Forum under Consumer Protection Act 2019.' },
  { id: 'nda', name: 'Non-Disclosure Agreement', description: 'Mutual or one-way NDA for business and employment purposes.' },
]

export default function DocumentGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [showFreemiumGate, setShowFreemiumGate] = useState(false)

  const getUsageCount = () => {
    if (typeof window === 'undefined') return 0
    const data = JSON.parse(localStorage.getItem('jj_doc_usage') || '{}')
    const month = new Date().toISOString().slice(0, 7)
    return data[month] || 0
  }

  const incrementUsage = () => {
    const data = JSON.parse(localStorage.getItem('jj_doc_usage') || '{}')
    const month = new Date().toISOString().slice(0, 7)
    data[month] = (data[month] || 0) + 1
    localStorage.setItem('jj_doc_usage', JSON.stringify(data))
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generatePDF = () => {
    const count = getUsageCount()
    if (count >= 2) { setShowFreemiumGate(true); return }
    setIsGenerating(true)
    incrementUsage()
    const doc = new jsPDF()
    const now = new Date().toLocaleDateString()

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.text(selectedTemplate.name.toUpperCase(), 105, 20, { align: 'center' })
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated via Justice Junction 24/7 on ${now}`, 105, 28, { align: 'center' })

    doc.line(20, 32, 190, 32)

    doc.setFontSize(12)
    let y = 45

    if (selectedTemplate.id === 'rental') {
      doc.text(`This RENTAL AGREEMENT is made on this ${now} between:`, 20, y)
      y += 10
      doc.setFont('helvetica', 'bold')
      doc.text(`LANDLORD: ${formData.landlord || '____________________'}`, 20, y)
      y += 7
      doc.setFont('helvetica', 'normal')
      doc.text(`Residing at: ${formData.landlordAddress || '____________________'}`, 20, y)
      y += 10
      doc.text(`AND`, 20, y)
      y += 10
      doc.setFont('helvetica', 'bold')
      doc.text(`TENANT: ${formData.tenant || '____________________'}`, 20, y)
      y += 7
      doc.setFont('helvetica', 'normal')
      doc.text(`Residing at: ${formData.tenantAddress || '____________________'}`, 20, y)
      y += 15
      doc.text(`Property Address: ${formData.propertyAddress || '____________________'}`, 20, y)
      y += 10
      doc.text(`Monthly Rent: Rs. ${formData.rent || '____'} payable on ${formData.rentDate || '___'} of every month.`, 20, y)
      y += 10
      doc.text(`Security Deposit: Rs. ${formData.deposit || '____'}`, 20, y)
      y += 15
      doc.text(`The lease is for a period of ${formData.period || '11'} months starting from ${formData.startDate || '___'}.`, 20, y)
    } else if (selectedTemplate.id === 'affidavit') {
      doc.text(`I, ${formData.name || '____________________'}, S/o / D/o ${formData.parentName || '____________________'},`, 20, y)
      y += 7
      doc.text(`aged about ${formData.age || '___'} years, residing at ${formData.address || '____________________'},`, 20, y)
      y += 7
      doc.text(`do hereby solemnly affirm and declare as under:`, 20, y)
      y += 15
      doc.setFont('helvetica', 'bold')
      doc.text(`1. That ${formData.point1 || '____________________________________________________'}`, 20, y)
      y += 10
      doc.text(`2. That ${formData.point2 || '____________________________________________________'}`, 20, y)
      y += 10
      doc.text(`3. That the contents of this affidavit are true to the best of my knowledge.`, 20, y)
    } else if (selectedTemplate.id === 'legal-notice') {
      doc.text(`From:`, 20, y); y += 7
      doc.setFont('helvetica', 'bold')
      doc.text(formData.senderName || '____________________', 20, y); y += 7
      doc.setFont('helvetica', 'normal')
      doc.text(formData.senderAddress || '____________________', 20, y); y += 12
      doc.text(`To,`, 20, y); y += 7
      doc.setFont('helvetica', 'bold')
      doc.text(formData.recipientName || '____________________', 20, y); y += 7
      doc.setFont('helvetica', 'normal')
      doc.text(formData.recipientAddress || '____________________', 20, y); y += 12
      doc.text(`Subject: Legal Notice — ${formData.subject || '____________________'}`, 20, y); y += 12
      doc.text(`Sir/Madam,`, 20, y); y += 10
      const noticeParagraph = `Through this notice, I, ${formData.senderName || '____'}, hereby inform you of the following matter: ${formData.grievance || '____'}. You are hereby called upon to ${formData.demand || '____'} within ${formData.days || '15'} days of receipt of this notice. Failing which, I shall be constrained to initiate appropriate legal proceedings against you without any further notice, at your risk, cost, and consequences.`
      const noticeLines = doc.splitTextToSize(noticeParagraph, 165)
      doc.text(noticeLines, 20, y)
    } else if (selectedTemplate.id === 'consumer-complaint') {
      doc.text(`To,`, 20, y); y += 7
      doc.text(`The President, District Consumer Disputes Redressal Commission`, 20, y); y += 12
      doc.text(`COMPLAINANT: ${formData.complainantName || '____________________'}`, 20, y); y += 7
      doc.text(`Address: ${formData.complainantAddress || '____________________'}`, 20, y); y += 12
      doc.text(`OPPOSITE PARTY: ${formData.oppositeName || '____________________'}`, 20, y); y += 7
      doc.text(`Address: ${formData.oppositeAddress || '____________________'}`, 20, y); y += 12
      doc.text(`SUBJECT: Complaint under Consumer Protection Act 2019`, 20, y); y += 12
      doc.text(`Date of purchase/service: ${formData.purchaseDate || '____'}`, 20, y); y += 7
      doc.text(`Amount paid: Rs. ${formData.amount || '____'}`, 20, y); y += 7
      const grievanceLines = doc.splitTextToSize(`Grievance: ${formData.grievance || '____'}`, 165)
      doc.text(grievanceLines, 20, y); y += grievanceLines.length * 7 + 5
      doc.text(`Relief sought: ${formData.relief || 'Refund, compensation, and cost of litigation.'}`, 20, y)
    } else if (selectedTemplate.id === 'nda') {
      doc.text(`This Non-Disclosure Agreement is entered into on ${now} between:`, 20, y); y += 10
      doc.setFont('helvetica', 'bold')
      doc.text(`DISCLOSING PARTY: ${formData.disclosingParty || '____________________'}`, 20, y); y += 10
      doc.text(`RECEIVING PARTY: ${formData.receivingParty || '____________________'}`, 20, y); y += 10
      doc.setFont('helvetica', 'normal')
      doc.text(`Purpose: ${formData.purpose || '____________________'}`, 20, y); y += 10
      doc.text(`Duration: ${formData.duration || '2'} years from the date of signing.`, 20, y); y += 10
      const ndaText = `The Receiving Party agrees to: (a) Keep all Confidential Information strictly confidential; (b) Not disclose any Confidential Information to third parties without prior written consent; (c) Use Confidential Information solely for the stated Purpose; (d) Notify the Disclosing Party immediately upon any unauthorized disclosure.`
      const ndaLines = doc.splitTextToSize(ndaText, 165)
      doc.text(ndaLines, 20, y)
    } else if (selectedTemplate.id === 'promissory') {
      doc.text(`Rs. ${formData.amount || '________'}`, 160, y)
      y += 15
      doc.text(`On demand, I ${formData.borrower || '____________________'}, residing at`, 20, y)
      y += 7
      doc.text(`${formData.borrowerAddress || '____________________'}, promise to pay to`, 20, y)
      y += 7
      doc.text(`${formData.lender || '____________________'} or order, the sum of Rupees`, 20, y)
      y += 7
      doc.text(`${formData.amountWords || '____________________'} with interest at the rate of`, 20, y)
      y += 7
      doc.text(`${formData.interest || '___'}% per annum for value received.`, 20, y)
    }

    y += 40
    doc.line(20, y, 80, y)
    doc.line(130, y, 190, y)
    y += 7
    doc.text('Signature of First Party', 20, y)
    doc.text('Signature of Second Party', 130, y)

    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('This is a computer-generated draft and may require stamp duty as per state laws.', 105, 285, { align: 'center' })

    doc.save(`${selectedTemplate.id}_document.pdf`)
    setIsGenerating(false)
  }

  return (
    <div style={{ paddingTop: 95, background: '#F8F9FA', minHeight: '100vh' }}>
      <Head>
        <title>Legal Document Generator — Justice Junction 24/7</title>
        <meta name="description" content="Generate professional legal documents: Rental Agreements, Legal Notices, NDA, Affidavits, Consumer Complaints and more. Free PDF download." />
        <meta property="og:title" content="Legal Document Generator — Justice Junction 24/7" />
        <meta property="og:description" content="Generate professional legal documents instantly. Fill the form, preview, and download PDF." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/document-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Legal Document Generator — Justice Junction 24/7" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Head>

      {/* Freemium Gate Modal */}
      {showFreemiumGate && (
        <div className="modal-overlay" onClick={() => setShowFreemiumGate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{textAlign:'center'}}>
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>📄</div>
            <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', marginBottom:'0.8rem'}}>Free Limit Reached</h3>
            <p style={{color:'var(--txt-3)', marginBottom:'1.5rem'}}>You've used your 2 free documents for this month. Upgrade to Justice Junction Pro for unlimited document generation.</p>
            <Link href="/pricing" className="btn btn-primary btn-lg" style={{width:'100%', marginBottom:'0.8rem'}}>Upgrade to Pro</Link>
            <button className="btn btn-ghost" style={{width:'100%'}} onClick={() => setShowFreemiumGate(false)}>Maybe Later</button>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '3rem 5vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="sec-label" style={{ justifyContent: 'center' }}>DIY Legal Tools</div>
          <h1 className="sec-title" style={{ textAlign: 'center' }}>Legal <em>Document Generator</em></h1>
          <p style={{ color: 'var(--txt-3)', maxWidth: 600, margin: '0 auto' }}>Create professional drafts for common legal needs in minutes. Just fill the details and download your PDF.</p>
        </div>

        {!selectedTemplate ? (
          <div style={s.grid}>
            {TEMPLATES.map(t => (
              <div key={t.id} style={s.templateCard} className="card-hover" onClick={() => setSelectedTemplate(t)}>
                <div style={s.iconBox}><FileText size={32}/></div>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: 8}}>{t.name}</h3>
                <p style={{fontSize: '.9rem', color: 'var(--txt-3)', lineHeight: 1.6}}>{t.description}</p>
                <button className="btn btn-outline" style={{marginTop: '1.5rem', width: '100%'}}>Select Template</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={s.editorBox}>
            <div style={s.editorHeader}>
              <button onClick={() => setSelectedTemplate(null)} style={s.backBtn}>← Change Template</button>
              <h2 style={{margin:0}}>{selectedTemplate.name}</h2>
            </div>
            
            <div style={s.editorBody}>
              <div style={s.formSide}>
                <h4 style={{marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: 8}}>Enter Details</h4>
                <div style={s.formGrid}>
                  {selectedTemplate.id === 'rental' && (
                    <>
                      <div className="form-group"><label>Landlord Name</label><input name="landlord" onChange={handleInputChange} placeholder="Full Name"/></div>
                      <div className="form-group"><label>Landlord Address</label><input name="landlordAddress" onChange={handleInputChange} placeholder="Full Address"/></div>
                      <div className="form-group"><label>Tenant Name</label><input name="tenant" onChange={handleInputChange} placeholder="Full Name"/></div>
                      <div className="form-group"><label>Tenant Address</label><input name="tenantAddress" onChange={handleInputChange} placeholder="Full Address"/></div>
                      <div className="form-group"><label>Property Address</label><input name="propertyAddress" onChange={handleInputChange} placeholder="Full Address"/></div>
                      <div className="form-group"><label>Monthly Rent (₹)</label><input name="rent" type="number" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Security Deposit (₹)</label><input name="deposit" type="number" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Start Date</label><input name="startDate" type="date" onChange={handleInputChange} /></div>
                    </>
                  )}
                  {selectedTemplate.id === 'affidavit' && (
                    <>
                      <div className="form-group"><label>Full Name</label><input name="name" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Father / Spouse Name</label><input name="parentName" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Age</label><input name="age" type="number" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Full Address</label><input name="address" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Declaration Point 1</label><textarea name="point1" rows={3} onChange={handleInputChange} placeholder="e.g. That I am a citizen of India..."/></div>
                      <div className="form-group"><label>Declaration Point 2</label><textarea name="point2" rows={3} onChange={handleInputChange} placeholder="e.g. That my date of birth is..."/></div>
                    </>
                  )}
                  {selectedTemplate.id === 'promissory' && (
                    <>
                      <div className="form-group"><label>Borrower Name</label><input name="borrower" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Borrower Address</label><input name="borrowerAddress" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Lender Name</label><input name="lender" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Amount (₹)</label><input name="amount" type="number" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Amount in Words</label><input name="amountWords" onChange={handleInputChange} /></div>
                      <div className="form-group"><label>Interest Rate (% p.a.)</label><input name="interest" type="number" onChange={handleInputChange} /></div>
                    </>
                  )}
                  {selectedTemplate.id === 'legal-notice' && (
                    <>
                      <div className="form-group"><label>Sender Full Name</label><input name="senderName" onChange={handleInputChange} placeholder="Your full name"/></div>
                      <div className="form-group"><label>Sender Address</label><input name="senderAddress" onChange={handleInputChange} placeholder="Your full address"/></div>
                      <div className="form-group"><label>Recipient Name</label><input name="recipientName" onChange={handleInputChange} placeholder="Person/company to serve"/></div>
                      <div className="form-group"><label>Recipient Address</label><input name="recipientAddress" onChange={handleInputChange} placeholder="Their full address"/></div>
                      <div className="form-group"><label>Subject of Notice</label><input name="subject" onChange={handleInputChange} placeholder="e.g. Unpaid dues of ₹50,000"/></div>
                      <div className="form-group"><label>Grievance (what happened)</label><textarea name="grievance" rows={3} onChange={handleInputChange} placeholder="Briefly describe the issue..."/></div>
                      <div className="form-group"><label>Demand (what you want them to do)</label><input name="demand" onChange={handleInputChange} placeholder="e.g. Pay the outstanding amount"/></div>
                      <div className="form-group"><label>Days to Respond</label><input name="days" type="number" onChange={handleInputChange} placeholder="15"/></div>
                    </>
                  )}
                  {selectedTemplate.id === 'consumer-complaint' && (
                    <>
                      <div className="form-group"><label>Your Name (Complainant)</label><input name="complainantName" onChange={handleInputChange}/></div>
                      <div className="form-group"><label>Your Address</label><input name="complainantAddress" onChange={handleInputChange}/></div>
                      <div className="form-group"><label>Opposite Party Name</label><input name="oppositeName" onChange={handleInputChange} placeholder="Company/seller name"/></div>
                      <div className="form-group"><label>Opposite Party Address</label><input name="oppositeAddress" onChange={handleInputChange}/></div>
                      <div className="form-group"><label>Date of Purchase/Service</label><input name="purchaseDate" type="date" onChange={handleInputChange}/></div>
                      <div className="form-group"><label>Amount Paid (₹)</label><input name="amount" type="number" onChange={handleInputChange}/></div>
                      <div className="form-group"><label>Grievance</label><textarea name="grievance" rows={3} onChange={handleInputChange} placeholder="Describe the defect or poor service..."/></div>
                      <div className="form-group"><label>Relief Sought</label><input name="relief" onChange={handleInputChange} placeholder="e.g. Full refund + ₹10,000 compensation"/></div>
                    </>
                  )}
                  {selectedTemplate.id === 'nda' && (
                    <>
                      <div className="form-group"><label>Disclosing Party (Shares Info)</label><input name="disclosingParty" onChange={handleInputChange} placeholder="Name or Company"/></div>
                      <div className="form-group"><label>Receiving Party (Receives Info)</label><input name="receivingParty" onChange={handleInputChange} placeholder="Name or Company"/></div>
                      <div className="form-group"><label>Purpose of Disclosure</label><input name="purpose" onChange={handleInputChange} placeholder="e.g. Evaluating a business partnership"/></div>
                      <div className="form-group"><label>Duration (years)</label><input name="duration" type="number" onChange={handleInputChange} placeholder="2"/></div>
                    </>
                  )}
                </div>
                <button className="btn btn-primary btn-lg" style={{width:'100%', marginTop: '2rem', gap: 8}} onClick={generatePDF} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : <><Download size={20}/> Download PDF Draft</>}
                </button>
                {typeof window !== 'undefined' && getUsageCount() > 0 && (
                  <p style={{textAlign:'center', fontSize:'.75rem', color:'var(--txt-3)', marginTop:'0.5rem'}}>
                    {2 - Math.min(getUsageCount(), 2)} free download{2 - Math.min(getUsageCount(), 2) !== 1 ? 's' : ''} remaining this month
                  </p>
                )}
              </div>

              <div style={s.previewSide}>
                <div style={s.previewCard}>
                  <div style={{display:'flex', gap:10, color: 'var(--bur)', marginBottom: 12}}><Info size={20}/> <span style={{fontWeight: 800, fontSize: '.9rem'}}>Professional Guidance</span></div>
                  <p style={{fontSize: '.85rem', color: 'var(--txt-2)', lineHeight: 1.6}}>This tool generates a legal draft based on your inputs. For complex matters, we recommend having the final document reviewed by a verified lawyer.</p>
                  <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
                    <Link href="/search" className="btn btn-sm btn-outline" style={{width: '100%'}}>Consult a Lawyer Instead</Link>
                  </div>
                </div>
                <div style={{marginTop: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontWeight: 700, fontSize: '.8rem'}}>
                    <ShieldCheck size={16}/> Secure & Confidential
                  </div>
                  <p style={{fontSize: '.75rem', color: 'var(--txt-3)', marginTop: 4}}>Your data is processed locally and not stored on our servers.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={s.footerNote}>
          <p>Disclaimer: Justice Junction 24/7 is not a law firm. These documents are drafts and may need specific modifications to be legally binding in your jurisdiction. Stamp duty and notarization are not included.</p>
        </div>
      </div>
    </div>
  )
}

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: 1100, margin: '0 auto' },
  templateCard: { background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'center' },
  iconBox: { width: 64, height: 64, borderRadius: '16px', background: 'var(--bur-l)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
  editorBox: { background: '#fff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.08)', border: '1px solid var(--border)', maxWidth: 1000, margin: '0 auto' },
  editorHeader: { padding: '1.5rem 2.5rem', background: 'var(--bur)', color: '#fff', display: 'flex', alignItems: 'center', gap: '2rem' },
  backBtn: { background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '.5rem 1rem', borderRadius: '50px', cursor: 'pointer', fontSize: '.85rem', fontWeight: 700 },
  editorBody: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', padding: '2.5rem' },
  formSide: { minWidth: 0 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' },
  previewSide: { },
  previewCard: { background: 'var(--cream-2)', padding: '1.8rem', borderRadius: '20px', border: '1px solid var(--border)' },
  footerNote: { marginTop: '4rem', textAlign: 'center', fontSize: '.75rem', color: 'var(--txt-3)', maxWidth: 800, margin: '4rem auto 0', lineHeight: 1.6 },
}

import Link from 'next/link'
