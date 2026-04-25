import { useState } from 'react'
import Head from 'next/head'
import { FileText, Download, CheckCircle, ShieldCheck, Info } from 'lucide-react'
import { jsPDF } from 'jspdf'

const TEMPLATES = [
  { id: 'rental', name: 'Rental Agreement', description: 'Standard residential lease agreement for India.' },
  { id: 'affidavit', name: 'General Affidavit', description: 'Standard self-declaration for various legal purposes.' },
  { id: 'promissory', name: 'Promissory Note', description: 'Legal document for debt acknowledgment and repayment.' },
]

export default function DocumentGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generatePDF = () => {
    setIsGenerating(true)
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
        <meta name="description" content="Generate professional legal documents like Rental Agreements, Affidavits, and Promissory Notes instantly." />
      </Head>

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
                </div>
                <button className="btn btn-primary btn-lg" style={{width:'100%', marginTop: '2rem', gap: 8}} onClick={generatePDF} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : <><Download size={20}/> Download PDF Draft</>}
                </button>
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
