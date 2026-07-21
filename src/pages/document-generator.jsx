import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { FileText, Download, CheckCircle, ShieldCheck, Info, ChevronDown, Stamp, IndianRupee, Printer } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const TEMPLATES = [
  {
    id: 'rental', name: 'Rental Agreement', description: 'Standard residential lease agreement for India.',
    fields: [
      { name: 'landlord', label: 'Landlord Full Name', type: 'text', required: true },
      { name: 'tenant', label: 'Tenant Full Name', type: 'text', required: true },
      { name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
      { name: 'rent', label: 'Monthly Rent in ₹', type: 'number', required: true },
      { name: 'deposit', label: 'Security Deposit in ₹', type: 'number', required: true },
      { name: 'startDate', label: 'Lease Start Date', type: 'date', required: true },
      { name: 'period', label: 'Lease Duration (months)', type: 'number', required: true },
      { name: 'state', label: 'State of Jurisdiction', type: 'text', required: true },
    ],
  },
  {
    id: 'affidavit', name: 'General Affidavit', description: 'Standard self-declaration for various legal purposes.',
    fields: [
      { name: 'name', label: 'Deponent Full Name', type: 'text', required: true },
      { name: 'fatherName', label: "Deponent Father's/Husband's Name", type: 'text', required: true },
      { name: 'address', label: 'Deponent Address', type: 'textarea', required: true },
      { name: 'age', label: 'Deponent Age', type: 'number', required: true },
      { name: 'statement', label: 'Affidavit Purpose / Statement', type: 'textarea', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
    ],
  },
  {
    id: 'promissory', name: 'Promissory Note', description: 'Legal document for debt acknowledgment and repayment.',
    fields: [
      { name: 'borrower', label: 'Borrower Full Name', type: 'text', required: true },
      { name: 'borrowerAddress', label: 'Borrower Address', type: 'textarea', required: true },
      { name: 'lender', label: 'Lender Full Name', type: 'text', required: true },
      { name: 'amount', label: 'Loan Amount in ₹', type: 'number', required: true },
      { name: 'interest', label: 'Interest Rate % per annum', type: 'number' },
      { name: 'repaymentDate', label: 'Repayment Date', type: 'date', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
    ],
  },
  {
    id: 'legal-notice', name: 'Legal Notice', description: 'Formal legal notice to demand action or assert rights.',
    fields: [
      { name: 'senderName', label: 'Sender Full Name', type: 'text', required: true },
      { name: 'senderAddress', label: 'Sender Address', type: 'textarea', required: true },
      { name: 'recipientName', label: 'Recipient Full Name', type: 'text', required: true },
      { name: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
      { name: 'subject', label: 'Subject of Notice', type: 'text', required: true },
      { name: 'noticeBody', label: 'Facts / Notice Body', type: 'textarea', required: true },
      { name: 'relief', label: 'Relief Sought', type: 'textarea', required: true },
      { name: 'noticeDate', label: 'Notice Date', type: 'date', required: true },
      { name: 'daysToRespond', label: 'Days to Respond', type: 'number', required: true },
    ],
  },
  {
    id: 'consumer-complaint', name: 'Consumer Complaint', description: 'Complaint to Consumer Forum under Consumer Protection Act 2019.',
    fields: [
      { name: 'complainantName', label: 'Complainant Name', type: 'text', required: true },
      { name: 'complainantAddress', label: 'Complainant Address', type: 'textarea', required: true },
      { name: 'oppositeParty', label: 'Opposite Party Name', type: 'text', required: true },
      { name: 'oppositePartyAddress', label: 'Opposite Party Address', type: 'textarea', required: true },
      { name: 'product', label: 'Product/Service Purchased', type: 'text', required: true },
      { name: 'purchaseDate', label: 'Date of Purchase', type: 'date', required: true },
      { name: 'amountPaid', label: 'Amount Paid in ₹', type: 'number', required: true },
      { name: 'complaintDetails', label: 'Nature of Defect/Deficiency', type: 'textarea', required: true },
      { name: 'reliefRequested', label: 'Relief Requested', type: 'textarea', required: true },
    ],
  },
  {
    id: 'nda', name: 'Non-Disclosure Agreement', description: 'Mutual or one-way NDA for business and employment.',
    fields: [
      { name: 'partyA', label: 'Party A Name', type: 'text', required: true },
      { name: 'partyAAddress', label: 'Party A Address', type: 'textarea', required: true },
      { name: 'partyB', label: 'Party B Name', type: 'text', required: true },
      { name: 'partyBAddress', label: 'Party B Address', type: 'textarea', required: true },
      { name: 'purpose', label: 'Purpose of Disclosure', type: 'text', required: true },
      { name: 'duration', label: 'Duration of Confidentiality (months)', type: 'number', required: true },
      { name: 'ndaType', label: 'Agreement Type', type: 'select', options: ['Mutual', 'One-way — Party A discloses', 'One-way — Party B discloses'], required: true },
      { name: 'agreementDate', label: 'Date of Agreement', type: 'date', required: true },
      { name: 'governingState', label: 'Governing State', type: 'text', required: true },
    ],
  },
  {
    id: 'stamp-paper', name: 'e-Stamp Paper', description: 'Generate a printable e-Stamp Paper for legal agreements, affidavits, and notarization.',
    fields: [
      { name: 'denomination', label: 'Stamp Value (₹)', type: 'select', options: ['10', '20', '50', '100', '200', '500', '1000'], required: true },
      { name: 'state', label: 'State / UT', type: 'select', options: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'West Bengal', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Punjab', 'Haryana', 'Bihar', 'Odisha', 'Jharkhand', 'Chhattisgarh', 'Assam', 'Uttarakhand', 'Himachal Pradesh', 'Goa', 'Jammu & Kashmir', 'Other'], required: true },
      { name: 'purchaserName', label: 'First Party / Purchaser Name', type: 'text', required: true },
      { name: 'secondPartyName', label: 'Second Party Name (if applicable)', type: 'text' },
      { name: 'purpose', label: 'Purpose / Description of Document', type: 'select', options: ['Rental Agreement', 'Affidavit', 'Sale Deed', 'Power of Attorney', 'Indemnity Bond', 'Gift Deed', 'Mortgage Deed', 'Partnership Deed', 'General Agreement', 'Other'], required: true },
      { name: 'considerationAmount', label: 'Consideration Amount in ₹ (if any)', type: 'number' },
    ],
    isStampPaper: true,
  },
]

const STAMP_SERIAL = () => `IN-DL${Math.floor(10000000 + Math.random() * 90000000)}${Math.floor(1000 + Math.random() * 9000)}`
const CERT_NO = () => `SUBIN-DL${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`

function generateStampPaperHTML(data) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const stCode = (data.state||'DL').substring(0,2).toUpperCase()
  const certNo = `IN-${stCode}${String(Math.floor(Math.random()*99999999)).padStart(8,'0')}`
  const udr = `SUBIN-${stCode}${String(Math.floor(Math.random()*9999999999)).padStart(10,'0')}`
  const stampId = `${stCode}e${String(Math.floor(Math.random()*9999999)).padStart(7,'0')}`
  const denomination = data.denomination || '100'
  const amtWords = numberToWords(parseInt(denomination))
  const articleMap = {'Rental Agreement':'5(h)(A)','Affidavit':'4','Sale Deed':'23','Power of Attorney':'48','Indemnity Bond':'34','Gift Deed':'33','Mortgage Deed':'40','Partnership Deed':'46','General Agreement':'5','Other':'5'}
  const article = articleMap[data.purpose] || '5'

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>e-Stamp Certificate - Rs.${denomination} - ${data.state||'India'}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4;margin:10mm}
body{font-family:Arial,Helvetica,sans-serif;background:#d0d0d0;display:flex;flex-direction:column;align-items:center;padding:20px}
.toolbar{position:fixed;top:0;left:0;right:0;background:#004d26;color:#fff;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;z-index:99;font-size:13px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.toolbar button{background:#fff;color:#004d26;border:none;padding:7px 16px;border-radius:4px;font-weight:700;cursor:pointer;font-size:12px}
.page{width:210mm;min-height:297mm;background:#fff;position:relative;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,.18);margin-top:50px}
.page::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,77,38,.008) 1px,rgba(0,77,38,.008) 2px);pointer-events:none;z-index:0}
.watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:90px;font-weight:900;color:rgba(0,77,38,.035);letter-spacing:15px;white-space:nowrap;z-index:0;font-family:serif}
.top-band{background:#004d26;color:#fff;text-align:center;padding:6px;font-size:11px;font-weight:700;letter-spacing:4px;position:relative;z-index:1}
.emblem-row{display:flex;align-items:center;justify-content:center;padding:14px 30px 8px;gap:16px;position:relative;z-index:1;border-bottom:2px solid #004d26}
.emblem{width:70px;height:70px;display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:10px;color:#004d26;font-weight:800}
.emblem svg{width:50px;height:50px}
.emblem-text{text-align:center;flex:1}
.emblem-text h1{font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#004d26;letter-spacing:3px;font-weight:800}
.emblem-text h2{font-family:Georgia,serif;font-size:13px;color:#004d26;letter-spacing:1px;margin-top:2px;font-weight:600}
.emblem-text .state-name{font-size:14px;color:#333;font-weight:700;margin-top:4px;letter-spacing:1px}
.denom-box{text-align:center;padding:4px 20px;border:2px solid #004d26;display:inline-block;border-radius:2px}
.denom-box .fig{font-family:Georgia,serif;font-size:28px;font-weight:900;color:#004d26}
.denom-box .words{font-size:9px;color:#333;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.cert-bar{background:#e8f5e9;border-bottom:1px solid #b8d8be;padding:8px 24px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:9px;color:#004d26;font-weight:700;position:relative;z-index:1}
.cert-bar span{letter-spacing:.3px}
.content{padding:20px 28px;position:relative;z-index:1}
.row{display:flex;border-bottom:1px solid #cde0d3;min-height:28px}
.row:last-child{border-bottom:none}
.row .lbl{width:220px;padding:6px 10px;font-size:10px;font-weight:700;color:#004d26;background:#f5faf7;border-right:1px solid #cde0d3;text-transform:uppercase;letter-spacing:.5px;flex-shrink:0}
.row .val{flex:1;padding:6px 12px;font-size:11px;color:#111;font-weight:600}
.tbl{border:1px solid #b8d8be;border-radius:2px;margin-bottom:16px;overflow:hidden}
.writing{border:1.5px dashed #b8d8be;min-height:280px;margin-top:12px;position:relative;background:repeating-linear-gradient(transparent,transparent 27px,#eef5f0 27px,#eef5f0 28px);padding:16px}
.writing::before{content:'This space is intentionally left for the content of the document / agreement.';position:absolute;top:45%;left:50%;transform:translate(-50%,-50%);font-size:12px;color:#b0c8b6;font-weight:600;letter-spacing:1px;text-align:center;pointer-events:none;max-width:80%}
.sigs{display:flex;justify-content:space-between;margin-top:50px;padding:0 10px}
.sig{text-align:center;width:180px}
.sig .line{border-top:1px solid #444;margin-top:55px;padding-top:5px;font-size:9px;color:#555}
.sig .name{font-size:10px;font-weight:700;color:#111;margin-top:2px}
.bottom-bar{position:absolute;bottom:0;left:0;right:0;background:#f5faf7;border-top:2px solid #004d26;padding:10px 24px;display:flex;justify-content:space-between;align-items:center;z-index:1}
.bottom-bar .disc{font-size:7.5px;color:#5a7d63;max-width:70%;line-height:1.6}
.qr{width:56px;height:56px;border:1.5px solid #004d26;display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(7,1fr);gap:1px;padding:3px}
.qr i{background:#004d26;border-radius:0}
.qr i.w{background:transparent}
@media print{body{background:#fff;padding:0}.page{box-shadow:none;margin-top:0}.toolbar{display:none!important}}
</style></head><body>
<div class="toolbar no-print">
<span>✅ e-Stamp Certificate Generated — Justice Junction 24/7</span>
<div style="display:flex;gap:8px">
<button onclick="window.print()">🖨️ Print / Save as PDF</button>
<button onclick="window.close()">✕ Close</button>
</div></div>
<div class="page">
<div class="watermark">INDIA NON JUDICIAL</div>
<div class="top-band">GOVERNMENT OF INDIA</div>
<div class="emblem-row">
<div class="emblem">
<svg viewBox="0 0 100 100" fill="#004d26"><circle cx="50" cy="30" r="18" fill="none" stroke="#004d26" stroke-width="3"/><text x="50" y="35" text-anchor="middle" font-size="16" font-weight="800" fill="#004d26">☸</text><rect x="35" y="48" width="30" height="4" rx="1"/><polygon points="50,55 30,90 70,90" fill="none" stroke="#004d26" stroke-width="2"/><text x="50" y="78" text-anchor="middle" font-size="8" font-weight="800" fill="#004d26">सत्यमेव जयते</text></svg>
</div>
<div class="emblem-text">
<h1>INDIA NON JUDICIAL</h1>
<h2>e-Stamp Certificate</h2>
<div class="state-name">${data.state || 'India'}</div>
</div>
<div class="denom-box">
<div class="fig">₹${parseInt(denomination).toLocaleString('en-IN')}</div>
<div class="words">${amtWords} Rupees Only</div>
</div>
</div>
<div class="cert-bar">
<span>Certificate No: ${certNo}</span>
<span>UDR: ${udr}</span>
<span>Stamp ID: ${stampId}</span>
<span>Date: ${dateStr} ${timeStr}</span>
</div>
<div class="content">
<div class="tbl">
<div class="row"><div class="lbl">Certificate Number</div><div class="val">${certNo}</div></div>
<div class="row"><div class="lbl">Unique Doc. Reference</div><div class="val">${udr}</div></div>
<div class="row"><div class="lbl">Account Reference</div><div class="val">${stampId} / SHCIL / ${stCode}</div></div>
<div class="row"><div class="lbl">Purchased by</div><div class="val">${data.purchaserName||'—'}</div></div>
<div class="row"><div class="lbl">Description of Document</div><div class="val">${data.purpose||'—'}</div></div>
<div class="row"><div class="lbl">Article Number</div><div class="val">Article ${article}</div></div>
<div class="row"><div class="lbl">Consideration Price (Rs.)</div><div class="val">${data.considerationAmount ? '₹'+parseInt(data.considerationAmount).toLocaleString('en-IN') : 'N/A'}</div></div>
<div class="row"><div class="lbl">First Party</div><div class="val">${data.purchaserName||'—'}</div></div>
<div class="row"><div class="lbl">Second Party</div><div class="val">${data.secondPartyName||'—'}</div></div>
<div class="row"><div class="lbl">Stamp Duty Paid By</div><div class="val">${data.purchaserName||'—'}</div></div>
<div class="row"><div class="lbl">Stamp Duty Amount (Rs.)</div><div class="val">₹${parseInt(denomination).toLocaleString('en-IN')} (${amtWords} Rupees Only)</div></div>
</div>
<p style="font-size:9px;color:#004d26;font-weight:700;text-align:center;margin:8px 0 4px;letter-spacing:2px">——— PLEASE WRITE OR TYPE BELOW THIS LINE ———</p>
<div class="writing"></div>
<div class="sigs">
<div class="sig"><div class="line">Executant / First Party</div><div class="name">${data.purchaserName||''}</div></div>
<div class="sig"><div class="line">Claimant / Second Party</div><div class="name">${data.secondPartyName||''}</div></div>
<div class="sig"><div class="line">Witness</div><div class="name"></div></div>
</div>
</div>
<div class="bottom-bar">
<div class="disc"><strong>DISCLAIMER:</strong> This e-Stamp Certificate is generated via Justice Junction 24/7 for reference/practice purposes only. This is NOT an official government-issued stamp paper. For legally valid e-Stamp Certificates, purchase through authorized SHCIL (Stock Holding Corporation of India Ltd.) counters or licensed stamp vendors in your state. Issued: ${dateStr}.</div>
<div class="qr"><i></i><i></i><i></i><i class="w"></i><i></i><i></i><i></i><i></i><i class="w"></i><i></i><i></i><i></i><i class="w"></i><i></i><i></i><i></i><i class="w"></i><i class="w"></i><i></i><i class="w"></i><i></i><i class="w"></i><i class="w"></i><i class="w"></i><i></i><i class="w"></i><i></i><i class="w"></i><i></i><i></i><i class="w"></i><i></i><i></i><i class="w"></i><i></i><i></i><i></i><i class="w"></i><i></i><i class="w"></i><i></i><i class="w"></i><i></i><i></i><i></i><i></i><i></i><i class="w"></i><i></i><i></i><i></i></div>
</div>
</div>
</body></html>`
}

function numberToWords(num) {
  if (num === 0) return 'Zero'
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
  if (num < 20) return ones[num]
  if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? ' ' + ones[num%10] : '')
  if (num < 1000) return ones[Math.floor(num/100)] + ' Hundred' + (num%100 ? ' and ' + numberToWords(num%100) : '')
  if (num < 100000) return numberToWords(Math.floor(num/1000)) + ' Thousand' + (num%1000 ? ' ' + numberToWords(num%1000) : '')
  if (num < 10000000) return numberToWords(Math.floor(num/100000)) + ' Lakh' + (num%100000 ? ' ' + numberToWords(num%100000) : '')
  return numberToWords(Math.floor(num/10000000)) + ' Crore' + (num%10000000 ? ' ' + numberToWords(num%10000000) : '')
}

const DISCLAIMER = `\n\n---\nDISCLAIMER: This document was auto-generated by Justice Junction 24/7 (www.justicejunction.in) as a draft template only. It may not be legally binding without proper stamp duty, notarization, and review by a qualified advocate registered with the Bar Council of India. Justice Junction 24/7 is not a law firm and this does not constitute legal advice. Generated on: ${new Date().toLocaleDateString('en-IN')}`

function generateDocumentText(templateId, data) {
  const now = new Date().toLocaleDateString('en-IN')
  switch (templateId) {
    case 'rental':
      return `RENTAL AGREEMENT / LEASE DEED

This RENTAL AGREEMENT is made and executed on this ${data.startDate || now} at ${data.state || '________'}, between:

LANDLORD: ${data.landlord || '________'}
ADDRESS: ${data.propertyAddress || '________'}
(Hereinafter referred to as the "LESSOR" / "FIRST PARTY")

AND

TENANT: ${data.tenant || '________'}
(Hereinafter referred to as the "LESSEE" / "SECOND PARTY")

The LESSOR is the absolute owner of the property situated at: ${data.propertyAddress || '________'}

TERMS AND CONDITIONS:

1. LEASE PERIOD: The Lessor hereby lets and the Lessee hereby takes on rent the said premises for a period of ${data.period || '11'} months, commencing from ${data.startDate || now}.

2. MONTHLY RENT: The Lessee agrees to pay a monthly rent of ₹${data.rent || '________'} (Rupees Only) to the Lessor on or before the 5th day of every calendar month.

3. SECURITY DEPOSIT: The Lessee has deposited a sum of ₹${data.deposit || '0'} (Rupees Only) as an interest-free security deposit, which shall be refunded by the Lessor at the time of vacating the premises, subject to deductions for any damages or outstanding dues.

4. USAGE: The premises shall be used solely for residential purposes and the Lessee shall not sub-let or part with possession of the premises to any third party.

5. MAINTENANCE: The Lessee shall maintain the premises in good condition and shall be responsible for minor repairs and electricity/water charges.

6. TERMINATION: Either party may terminate this agreement by giving one month's prior written notice to the other party.

7. JURISDICTION: This agreement shall be governed by the laws of India and any disputes shall be subject to the jurisdiction of the courts in the State of ${data.state || '________'}.

IN WITNESS WHEREOF, the parties have signed this agreement on the date mentioned above.


_________________________          _________________________
Signature of Lessor                Signature of Lessee
${data.landlord || '________'}     ${data.tenant || '________'}


Witness 1: _________________________

Witness 2: _________________________${DISCLAIMER}`

    case 'affidavit':
      return `GENERAL AFFIDAVIT

BEFORE THE COMPETENT AUTHORITY / NOTARY PUBLIC AT ${data.city || '________'}

I, ${data.name || '________'}, S/o / W/o ${data.fatherName || '________'}, aged about ${data.age || '___'} years, residing at ${data.address || '________'}, do hereby solemnly affirm and state on oath as follows:

1. That I am the deponent in this affidavit and I am well conversant with the facts stated herein.

2. That the purpose of this affidavit is: ${data.statement || '________'}

3. That I declare that the contents of this affidavit are true and correct to the best of my knowledge, information, and belief, and nothing material has been concealed therefrom.

I verify that the above statement is true and correct.

Verified at ${data.city || '________'} on this ${data.date || now}.


_________________________
Signature of Deponent
(${data.name || '________'})


IDENTIFIED BY ME,
ADVOCATE${DISCLAIMER}`

    case 'promissory':
      return `PROMISSORY NOTE

ON DEMAND, I, ${data.borrower || '________'}, residing at ${data.borrowerAddress || '________'} (hereinafter referred to as the "BORROWER"), do hereby promise to pay to ${data.lender || '________'} (hereinafter referred to as the "LENDER"), or to their order, the sum of ₹${data.amount || '________'} (Rupees Only) together with interest at the rate of ${data.interest || '0'}% per annum.

The value received is the loan amount provided by the Lender to the Borrower on this ${now}.

I hereby waive presentment, notice of dishonor, and protest. This debt is acknowledged as a legally enforceable debt under the Negotiable Instruments Act, 1881.

Payment shall be made in full at ${data.city || '________'} on or before ${data.repaymentDate || '________'}.


Place: ${data.city || '________'}
Date: ${now}


_________________________
Signature of Borrower
(${data.borrower || '________'})

(Stamp)


Witness: _________________________${DISCLAIMER}`

    case 'legal-notice':
      return `LEGAL NOTICE

Date: ${data.noticeDate || now}

TO,
${data.recipientName || '________'}
${data.recipientAddress || '________'}

SUBJECT: ${data.subject || '________'}

Sir/Madam,

Under the instructions and on behalf of my client, ${data.senderName || '________'}, residing at ${data.senderAddress || '________'}, I hereby serve upon you this Legal Notice:

1. That the facts of the matter are as follows: ${data.noticeBody || '________'}

2. That by way of this notice, my client seeks the following relief: ${data.relief || '________'}

3. You are hereby called upon to comply with the above demands within ${data.daysToRespond || '15'} days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, including civil and criminal actions, at your cost and consequences.

Issued under instructions.


_________________________
ADVOCATE FOR SENDER
(Office of ${data.senderName || '________'})${DISCLAIMER}`

    case 'consumer-complaint':
      return `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION

IN THE MATTER OF:

${data.complainantName || '________'}
${data.complainantAddress || '________'}
... COMPLAINANT

VERSUS

${data.oppositeParty || '________'}
${data.oppositePartyAddress || '________'}
... OPPOSITE PARTY

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

The Complainant above-named states as follows:

1. That the Complainant purchased/availed ${data.product || '________'} from the Opposite Party on ${data.purchaseDate || '________'} for a total consideration of ₹${data.amountPaid || '________'}.

2. That there has been a gross deficiency in service / defect in the product as detailed below:
${data.complaintDetails || '________'}

3. That the Complainant is entitled to the following relief:
${data.reliefRequested || '________'}

PRAYER:
It is, therefore, prayed that this Hon'ble Commission may be pleased to direct the Opposite Party to provide the relief mentioned above and award compensation for mental agony and costs of litigation.

Verified at ____________ on ${now}.


_________________________
Signature of Complainant
(${data.complainantName || '________'})${DISCLAIMER}`

    case 'nda':
      return `NON-DISCLOSURE AGREEMENT

This NON-DISCLOSURE AGREEMENT ("Agreement") is entered into on ${data.agreementDate || now} at ${data.governingState || '________'}, by and between:

PARTY A: ${data.partyA || '________'}
ADDRESS: ${data.partyAAddress || '________'}

AND

PARTY B: ${data.partyB || '________'}
ADDRESS: ${data.partyBAddress || '________'}

1. PURPOSE: The parties intend to engage in discussions regarding ${data.purpose || '________'}.

2. CONFIDENTIALITY: ${data.ndaType || 'The Parties'} agree to maintain absolute confidentiality regarding all proprietary information disclosed during the term of this agreement.

3. DURATION: The obligations of confidentiality shall remain in force for a period of ${data.duration || '12'} months from the date of this agreement.

4. EXCLUSIONS: Confidential information shall not include information that is already in the public domain or independently developed.

5. GOVERNING LAW: This agreement shall be governed by the laws of India and the courts in ${data.governingState || '________'} shall have jurisdiction.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first written above.


_________________________          _________________________
Signature of Party A               Signature of Party B
(${data.partyA || '________'})     (${data.partyB || '________'})${DISCLAIMER}`

    default:
      return 'Document template not found.'
  }
}

export default function DocumentGenerator() {
  const [expandedTemplate, setExpandedTemplate] = useState(null)
  const [formData, setFormData] = useState({})
  const [generatedId, setGeneratedId] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  // New AI state variables
  const [aiMode, setAiMode] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDraftText, setGeneratedDraftText] = useState('')
  const [flaggedSections, setFlaggedSections] = useState([])
  const [activeTab, setActiveTab] = useState('edit')

  const activeTemplate = TEMPLATES.find(t => t.id === expandedTemplate)

  const handleSelectTemplate = (templateId) => {
    if (['promissory', 'consumer-complaint', 'nda'].includes(templateId)) {
      return
    }
    if (!isLoggedIn) {
      router.push('/login?returnUrl=/document-generator')
      return
    }
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null)
    } else {
      setExpandedTemplate(templateId)
      setFormData({})
      setGeneratedId(null)
      setFieldErrors({})
      // Clear AI states as well
      setAiMode(false)
      setGeneratedDraftText('')
      setFlaggedSections([])
      setIsGenerating(false)
      setActiveTab('edit')
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDownloadDraft = () => {
    if (!generatedDraftText) return
    const blob = new Blob([generatedDraftText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTemplate.id}-ai-draft.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGenerate = async (template) => {
    // Validate required fields
    const errs = {}
    template.fields.forEach(f => {
      if (f.required && !formData[f.name]?.toString().trim()) {
        errs[f.name] = `${f.label} is required`
      }
    })
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    if (!aiMode) {
      if (template.isStampPaper) {
        // Generate stamp paper HTML and open in new window for print/PDF
        const html = generateStampPaperHTML(formData)
        const win = window.open('', '_blank', 'width=900,height=1200')
        win.document.write(html)
        win.document.close()
        setGeneratedId(template.id)
        return
      }

      const text = generateDocumentText(template.id, formData)
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template.id}-draft.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setGeneratedId(template.id)
    } else {
      setIsGenerating(true)
      setGeneratedDraftText('')
      setFlaggedSections([])
      
      try {
        const response = await fetch('/api/ai/generate-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType: template.id,
            answers: formData
          })
        })
        
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate document')
        }
        
        setGeneratedDraftText(data.draftText)
        setFlaggedSections(data.flaggedSections || [])
        setGeneratedId(template.id)
      } catch (err) {
        console.error(err)
        alert(err.message || 'An error occurred during AI document generation.')
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const renderPreview = (text) => {
    if (!text) return null;
    const regex = /(\[VERIFY WITH LAWYER: [^\]]+\])/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.match(regex)) {
        return (
          <span
            key={index}
            style={{
              backgroundColor: '#FEF3C7',
              borderBottom: '2px solid #D97706',
              padding: '2px 4px',
              borderRadius: '4px',
              color: '#92400E',
              fontWeight: '600',
              margin: '0 2px',
              display: 'inline-block'
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }

  return (
    <div style={{ paddingTop: 95, background: '#FDF8F4', minHeight: '100vh' }}>
      <Head>
        <title>Legal Document Generator | Justice Junction 24/7</title>
        <meta name="description" content="Generate professional legal documents: Rental Agreements, Legal Notices, NDA, Affidavits, Consumer Complaints and more. Free download." />
        <meta property="og:title" content="Legal Document Generator — Justice Junction 24/7" />
        <meta property="og:description" content="Generate professional legal documents instantly. Fill the form, preview, and download." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/document-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Legal Document Generator — Justice Junction 24/7" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Head>

      {/* Hero Section */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #7B1D2E 0%, #5C1521 100%)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <div className="sec-label" style={{ justifyContent: 'center', color: '#F5C4B3' }}>DIY Legal Tools</div>
          <h1 className="sec-title" style={{ color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>Legal <em style={{ color: '#F5C4B3', fontStyle: 'normal' }}>Document Generator</em></h1>
          <p style={{ color: '#F9EEE4', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>Create professional drafts for common legal needs in minutes. Just fill the details and download your document.</p>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 5vw' }}>
        <div style={s.grid}>
          {TEMPLATES.map(t => {
            const isComingSoon = ['promissory', 'consumer-complaint', 'nda'].includes(t.id)
            const isPremium = t.isStampPaper
            const isAvailable = !isComingSoon

            return (
              <div key={t.id} style={{ position: 'relative' }}>
                <div style={s.templateCard} className="card-hover" onClick={() => handleSelectTemplate(t.id)}>
                  {/* Coming Soon Overlay */}
                  {isComingSoon && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(253, 248, 244, 0.85)',
                      backdropFilter: 'blur(3px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '24px',
                      zIndex: 10,
                      cursor: 'not-allowed'
                    }} onClick={(e) => e.stopPropagation()}>
                      <span style={{
                        background: '#7B1D2E',
                        color: '#fff',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        boxShadow: '0 4px 10px rgba(123, 29, 46, 0.25)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>Coming Soon</span>
                    </div>
                  )}

                  <div style={s.iconBox}>{t.isStampPaper ? <Stamp size={32}/> : <FileText size={32}/>}</div>
                  <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: 8}}>{t.name}</h3>
                  
                  {isAvailable && !isPremium && (
                    <span style={{
                      display: 'inline-block',
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: '#16a34a',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 12px',
                      borderRadius: 50,
                      marginBottom: 8,
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      letterSpacing: '0.5px'
                    }}>AVAILABLE</span>
                  )}
                  {isPremium && (
                    <span style={{
                      display:'inline-block',
                      background:'rgba(212, 175, 55, 0.1)',
                      color:'#B8860B',
                      fontSize:'.65rem',
                      fontWeight:800,
                      padding:'3px 12px',
                      borderRadius:50,
                      marginBottom:8,
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      letterSpacing:'.5px'
                    }}>PREMIUM · AVAILABLE</span>
                  )}

                  <p style={{fontSize: '.9rem', color: 'var(--txt-3)', lineHeight: 1.6}}>{t.description}</p>
                  <button className="btn btn-outline" style={{marginTop: '1.5rem', width: '100%', gap: 6}} disabled={isComingSoon}>
                    Select Template
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Modal Overlay Form */}
        {activeTemplate && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26, 10, 13, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }} onClick={() => setExpandedTemplate(null)}>
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid #E8C9A8',
              boxShadow: '0 20px 50px rgba(123, 29, 46, 0.15)'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #E8C9A8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FDF6EE',
                borderTopLeftRadius: '23px',
                borderTopRightRadius: '23px'
              }}>
                <div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.4rem',
                    color: '#7B1D2E',
                    margin: 0
                  }}>{activeTemplate.name}</h3>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--txt-3)',
                    margin: '4px 0 0 0'
                  }}>{activeTemplate.description}</p>
                </div>
                <button 
                  onClick={() => setExpandedTemplate(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#7B1D2E',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: '4px'
                  }}
                >✕</button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '2rem' }}>
                {generatedDraftText && aiMode ? (
                  // Result Screen for AI Generation
                  <div>
                    {/* Persistent Warning Banner */}
                    <div style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start'
                    }}>
                      <Info color="#D97706" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <h4 style={{ fontWeight: 700, color: '#92400E', margin: 0, fontSize: '0.95rem' }}>Professional Review Recommended</h4>
                        <p style={{ color: '#B45309', fontSize: '0.85rem', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                          This draft is not legal advice. Sections marked below should be reviewed by a lawyer.
                        </p>
                      </div>
                    </div>

                    {/* View/Edit Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #E8C9A8', marginBottom: '1rem' }}>
                      <button
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          background: 'transparent',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: activeTab === 'edit' ? '#7B1D2E' : '#555',
                          borderBottom: activeTab === 'edit' ? '3px solid #7B1D2E' : 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('edit')}
                      >
                        Edit Draft
                      </button>
                      <button
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          background: 'transparent',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: activeTab === 'preview' ? '#7B1D2E' : '#555',
                          borderBottom: activeTab === 'preview' ? '3px solid #7B1D2E' : 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('preview')}
                      >
                        Preview Draft (Highlights)
                      </button>
                    </div>

                    {/* Tab Contents */}
                    {activeTab === 'edit' ? (
                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <textarea
                          value={generatedDraftText}
                          onChange={(e) => setGeneratedDraftText(e.target.value)}
                          rows={15}
                          style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid #E8C9A8',
                            outline: 'none',
                            fontSize: '0.95rem',
                            fontFamily: 'monospace',
                            lineHeight: 1.6,
                            background: '#FAF6F0'
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        maxHeight: '350px',
                        overflowY: 'auto',
                        padding: '1.2rem',
                        borderRadius: '12px',
                        border: '1px solid #E8C9A8',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        background: '#fff',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '1.5rem',
                        fontFamily: 'var(--font-body)'
                      }}>
                        {renderPreview(generatedDraftText)}
                      </div>
                    )}

                    {/* Flagged Sections List */}
                    {flaggedSections.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontWeight: 700, color: '#1A0A0D', fontSize: '0.95rem', marginBottom: '8px' }}>
                          Clauses Flagged for Professional Verification ({flaggedSections.length}):
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {flaggedSections.map((sec, idx) => (
                            <div key={idx} style={{
                              background: '#FEF3C7',
                              color: '#92400E',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              borderLeft: '4px solid #D97706',
                              lineHeight: 1.4
                            }}>
                              <strong>Flag {idx + 1}:</strong> {sec.replace(/\[VERIFY WITH LAWYER:\s*/, '').replace(/\]$/, '')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: 700 }}
                        onClick={() => {
                          setGeneratedDraftText('');
                          setFlaggedSections([]);
                        }}
                      >
                        ← Edit Fields
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.8rem', borderRadius: '12px', background: '#7B1D2E', color: '#fff', fontWeight: 700 }}
                        onClick={handleDownloadDraft}
                      >
                        <Download size={18} style={{ marginRight: 6 }} /> Download Draft
                      </button>
                    </div>

                    {/* Lawyer Booking Call to Action */}
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: 'rgba(123, 29, 46, 0.04)',
                      border: '1px dashed #7B1D2E',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.85rem', color: '#5A3A42', marginBottom: '8px', fontWeight: 500 }}>
                        Need an expert to check these clauses and finalize the agreement?
                      </p>
                      <Link href="/search">
                        <button className="btn btn-primary btn-sm" style={{ background: '#7B1D2E', color: '#fff', borderRadius: '8px', padding: '6px 16px', fontSize: '0.8rem' }}>
                          Get this reviewed by a Lawyer
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Form Fields and Submit Button
                  <div>
                    {/* Toggle: Use Template vs Generate with AI (only shown if not e-stamp paper) */}
                    {!activeTemplate.isStampPaper && (
                      <div style={{
                        display: 'flex',
                        borderRadius: '12px',
                        background: 'rgba(123, 29, 46, 0.05)',
                        border: '1px solid #E8C9A8',
                        padding: '4px',
                        marginBottom: '1.5rem'
                      }}>
                        <button
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            background: !aiMode ? '#7B1D2E' : 'transparent',
                            color: !aiMode ? '#fff' : '#7B1D2E',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => setAiMode(false)}
                        >
                          Use Template
                        </button>
                        <button
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            background: aiMode ? '#7B1D2E' : 'transparent',
                            color: aiMode ? '#fff' : '#7B1D2E',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => setAiMode(true)}
                        >
                          ✨ Generate with AI
                        </button>
                      </div>
                    )}

                    <div style={s.formFields}>
                      {activeTemplate.fields.map(field => (
                        <div className="form-group" key={field.name} style={{ marginBottom: '1.2rem' }}>
                          <label style={{
                            display: 'block',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: '#1A0A0D',
                            marginBottom: '6px'
                          }}>{field.label}{field.required && ' *'}</label>
                          
                          {field.type === 'textarea' ? (
                            <>
                              <textarea
                                name={field.name}
                                rows={4}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                style={{
                                  width: '100%',
                                  padding: '0.8rem 1rem',
                                  borderRadius: '12px',
                                  border: fieldErrors[field.name] ? '1.5px solid #DC2626' : '1px solid #E8C9A8',
                                  outline: 'none',
                                  fontSize: '0.95rem',
                                  fontFamily: 'inherit'
                                }}
                              />
                              {fieldErrors[field.name] && <span style={{color:'#DC2626',fontSize:'.72rem',fontWeight:600,marginTop:4,display:'block'}}>{fieldErrors[field.name]}</span>}
                            </>
                          ) : field.type === 'select' ? (
                            <>
                              <select 
                                name={field.name} 
                                value={formData[field.name] || ''} 
                                onChange={handleInputChange} 
                                style={{
                                  width: '100%',
                                  padding: '0.8rem 1rem',
                                  borderRadius: '12px',
                                  border: fieldErrors[field.name] ? '1.5px solid #DC2626' : '1px solid #E8C9A8',
                                  outline: 'none',
                                  fontSize: '0.95rem'
                                }}
                              >
                                <option value="">Select...</option>
                                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                              {fieldErrors[field.name] && <span style={{color:'#DC2626',fontSize:'.72rem',fontWeight:600,marginTop:4,display:'block'}}>{fieldErrors[field.name]}</span>}
                            </>
                          ) : (
                            <>
                              <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                placeholder={field.type !== 'date' ? `Enter ${field.label.toLowerCase()}` : ''}
                                style={{
                                  width: '100%',
                                  padding: '0.8rem 1rem',
                                  borderRadius: '12px',
                                  border: fieldErrors[field.name] ? '1.5px solid #DC2626' : '1px solid #E8C9A8',
                                  outline: 'none',
                                  fontSize: '0.95rem'
                                }}
                              />
                              {fieldErrors[field.name] && <span style={{color:'#DC2626',fontSize:'.72rem',fontWeight:600,marginTop:4,display:'block'}}>{fieldErrors[field.name]}</span>}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn btn-primary btn-lg"
                      style={{
                        width: '100%', 
                        marginTop: '1.5rem', 
                        gap: 8,
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        borderRadius: '12px',
                        background: '#7B1D2E',
                        color: '#fff',
                        border: 'none',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isGenerating ? 0.7 : 1
                      }}
                      onClick={() => handleGenerate(activeTemplate)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="spinner" style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .75s linear infinite' }} />
                          Generating Draft with AI...
                        </>
                      ) : (
                        <>
                          <Download size={20}/> 
                          {aiMode ? 'Generate with AI' : (activeTemplate.isStampPaper ? 'Generate Stamp Paper' : 'Generate & Download Draft')}
                        </>
                      )}
                    </button>

                    {generatedId === activeTemplate.id && !aiMode && (
                      <div style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        fontSize: '.88rem',
                        fontWeight: 600,
                        color: '#15803D',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircle size={18} color="#16a34a"/> 
                          <span>✓ {activeTemplate.isStampPaper ? 'Stamp paper generated! Use Ctrl+P / ⌘+P to save as PDF in the opened window.' : 'Document downloaded successfully!'}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#555', fontWeight: 500, paddingLeft: 26 }}>
                          We strongly recommend having the drafted document reviewed by a verified legal professional before signature.
                          <Link href="/search" style={{marginLeft:6,color:'#7B1D2E',fontWeight:700,textDecoration:'underline'}}>Find a Lawyer →</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
  templateCard: { background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #E8C9A8', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', position: 'relative' },
  iconBox: { width: 64, height: 64, borderRadius: '16px', background: 'rgba(123, 29, 46, 0.08)', color: '#7B1D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
  accordionForm: {
    background: '#fff',
    border: '1px solid #E8C9A8',
    borderTop: '3px solid #7B1D2E',
    borderRadius: '0 0 20px 20px',
    padding: '1.5rem 2rem',
    marginTop: '-1rem',
    animation: 'slideUp 0.3s ease',
  },
  formFields: { display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem' },
  footerNote: { marginTop: '4rem', textAlign: 'center', fontSize: '.75rem', color: 'var(--txt-3)', maxWidth: 800, margin: '4rem auto 0', lineHeight: 1.6 },
}
