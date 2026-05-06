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
  const serialNo = STAMP_SERIAL()
  const certNo = CERT_NO()
  const denomination = data.denomination || '100'
  const amtWords = numberToWords(parseInt(denomination))

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>e-Stamp Paper - ₹${denomination} - ${data.state || 'India'}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;800&family=Noto+Serif:wght@400;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: A4; margin: 12mm; }
  body { font-family: 'Noto Sans', Arial, sans-serif; background: #e8e8e8; display: flex; justify-content: center; padding: 20px; }
  .stamp-page {
    width: 210mm; min-height: 297mm; background: #fff;
    border: 3px solid #1a5c2e; position: relative; overflow: hidden;
    box-shadow: 0 4px 30px rgba(0,0,0,0.15);
  }
  .stamp-page::before {
    content: 'e-STAMP'; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-35deg);
    font-size: 120px; font-weight: 900; color: rgba(26,92,46,0.04);
    letter-spacing: 20px; pointer-events: none; z-index: 0;
    font-family: 'Noto Serif', serif;
  }
  .inner-border {
    border: 1.5px solid #1a5c2e; margin: 6px; min-height: calc(297mm - 16px);
    position: relative; z-index: 1;
  }
  .header {
    background: linear-gradient(135deg, #1a5c2e 0%, #0d3d1a 100%);
    color: #fff; padding: 18px 24px; display: flex; justify-content: space-between;
    align-items: center;
  }
  .header-left h1 { font-family: 'Noto Serif', serif; font-size: 20px; font-weight: 700; letter-spacing: 2px; }
  .header-left p { font-size: 11px; opacity: 0.85; margin-top: 2px; letter-spacing: 1px; }
  .header-right { text-align: right; }
  .header-right .value {
    font-size: 32px; font-weight: 900; font-family: 'Noto Serif', serif;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  .header-right .value-text { font-size: 10px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
  .ashoka { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 28px; border: 2px solid rgba(255,255,255,0.3); }

  .meta-bar {
    background: #f0f7f2; border-bottom: 1px solid #c8dece;
    padding: 10px 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
    font-size: 10px; color: #1a5c2e; font-weight: 600;
  }
  .meta-bar span { display: flex; align-items: center; gap: 4px; }

  .body { padding: 28px 32px; }
  .section-title {
    font-family: 'Noto Serif', serif; font-size: 13px; font-weight: 700;
    color: #1a5c2e; text-transform: uppercase; letter-spacing: 2px;
    border-bottom: 2px solid #1a5c2e; padding-bottom: 6px; margin-bottom: 14px;
  }
  .detail-grid { display: grid; grid-template-columns: 180px 1fr; gap: 0; margin-bottom: 24px; }
  .detail-grid .label {
    padding: 8px 12px; font-size: 11px; font-weight: 700; color: #2d6e3f;
    background: #f7faf8; border: 1px solid #e4efe7; text-transform: uppercase; letter-spacing: .5px;
  }
  .detail-grid .value-cell {
    padding: 8px 14px; font-size: 12px; font-weight: 600; color: #1a1a1a;
    border: 1px solid #e4efe7; border-left: none;
  }

  .writing-area {
    border: 1.5px dashed #c8dece; border-radius: 8px; min-height: 260px;
    padding: 24px; position: relative; background: repeating-linear-gradient(
      transparent, transparent 31px, #e8f0ea 31px, #e8f0ea 32px
    );
  }
  .writing-area::before {
    content: 'WRITE YOUR AGREEMENT / DOCUMENT CONTENT HERE';
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-size: 13px; color: #b0c8b6; font-weight: 700; letter-spacing: 2px;
    text-align: center; pointer-events: none;
  }

  .footer-strip {
    position: absolute; bottom: 0; left: 6px; right: 6px;
    background: #f0f7f2; border-top: 2px solid #1a5c2e; padding: 12px 24px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-strip .disclaimer { font-size: 8px; color: #5a7d63; max-width: 65%; line-height: 1.5; }
  .qr-placeholder {
    width: 64px; height: 64px; border: 2px solid #1a5c2e; border-radius: 4px;
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    font-size: 7px; color: #1a5c2e; font-weight: 700; text-align: center; gap: 2px;
    background: repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(26,92,46,0.05) 3px, rgba(26,92,46,0.05) 6px);
  }

  .sig-row { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
  .sig-block { text-align: center; width: 200px; }
  .sig-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 6px; font-size: 10px; color: #444; }

  @media print {
    body { background: #fff; padding: 0; }
    .stamp-page { box-shadow: none; border-width: 2px; }
    .no-print { display: none !important; }
  }
  .print-bar {
    position: fixed; top: 0; left: 0; right: 0; background: #1a5c2e;
    color: #fff; padding: 12px 24px; display: flex; justify-content: space-between;
    align-items: center; z-index: 999; font-size: 14px; font-weight: 600;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  .print-bar button {
    background: #fff; color: #1a5c2e; border: none; padding: 8px 20px;
    border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 13px;
  }
  .print-bar button:hover { background: #f0f7f2; }
</style>
</head>
<body>
  <div class="print-bar no-print">
    <span>☑ e-Stamp Paper Generated — Justice Junction 24/7</span>
    <div style="display:flex;gap:10px;">
      <button onclick="window.print()">🖨 Print / Save as PDF</button>
      <button onclick="window.close()">✕ Close</button>
    </div>
  </div>

  <div class="stamp-page" style="margin-top:60px;">
    <div class="inner-border">
      <div class="header">
        <div style="display:flex;gap:16px;align-items:center;">
          <div class="ashoka">🏛</div>
          <div class="header-left">
            <h1>e-STAMP PAPER</h1>
            <p>Government of ${data.state || 'India'} • Non-Judicial</p>
          </div>
        </div>
        <div class="header-right">
          <div class="value">₹${parseInt(denomination).toLocaleString('en-IN')}</div>
          <div class="value-text">Rupees ${amtWords} Only</div>
        </div>
      </div>

      <div class="meta-bar">
        <span>📋 Certificate No: ${certNo}</span>
        <span>🔢 Serial No: ${serialNo}</span>
        <span>📅 Date: ${dateStr} ${timeStr}</span>
        <span>🏛 Issuer: Stock Holding Corporation of India Ltd.</span>
      </div>

      <div class="body">
        <div class="section-title">Stamp Details</div>
        <div class="detail-grid">
          <div class="label">Certificate Number</div><div class="value-cell">${certNo}</div>
          <div class="label">Stamp Duty Paid</div><div class="value-cell">₹${parseInt(denomination).toLocaleString('en-IN')} (${amtWords} Rupees)</div>
          <div class="label">First Party</div><div class="value-cell">${data.purchaserName || '—'}</div>
          <div class="label">Second Party</div><div class="value-cell">${data.secondPartyName || '—'}</div>
          <div class="label">Purpose</div><div class="value-cell">${data.purpose || '—'}</div>
          ${data.considerationAmount ? `<div class="label">Consideration Amt</div><div class="value-cell">₹${parseInt(data.considerationAmount).toLocaleString('en-IN')}</div>` : ''}
          <div class="label">State</div><div class="value-cell">${data.state || '—'}</div>
          <div class="label">Date of Issue</div><div class="value-cell">${dateStr}</div>
        </div>

        <div class="section-title" style="margin-top:28px;">Document Content Area</div>
        <div class="writing-area"></div>

        <div class="sig-row">
          <div class="sig-block">
            <div class="sig-line">Signature of First Party<br/><strong>${data.purchaserName || ''}</strong></div>
          </div>
          <div class="sig-block">
            <div class="sig-line">Signature of Second Party<br/><strong>${data.secondPartyName || ''}</strong></div>
          </div>
          <div class="sig-block">
            <div class="sig-line">Witness Signature</div>
          </div>
        </div>
      </div>

      <div class="footer-strip">
        <div class="disclaimer">
          <strong>Disclaimer:</strong> This e-Stamp Paper is generated via Justice Junction 24/7 as a template/draft for reference and practice purposes.
          It is NOT an official government-issued stamp paper. For legally valid stamp papers, please purchase through
          authorized vendors or the Stock Holding Corporation of India Ltd (SHCIL). Generated on ${dateStr}.
        </div>
        <div class="qr-placeholder">
          <span>VERIFY</span>
          <span style="font-size:16px;">⊞</span>
          <span>SCAN QR</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
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

const DISCLAIMER = `\n\n---\nDISCLAIMER: This document was auto-generated by Justice Junction 24/7 (www.justicejunction247.com) as a draft template only. It may not be legally binding without proper stamp duty, notarization, and review by a qualified advocate registered with the Bar Council of India. Justice Junction 24/7 is not a law firm and this does not constitute legal advice. Generated on: ${new Date().toLocaleDateString('en-IN')}`

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

  const handleSelectTemplate = (templateId) => {
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
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGenerate = (template) => {
    // Validate required fields
    const errs = {}
    template.fields.forEach(f => {
      if (f.required && !formData[f.name]?.toString().trim()) {
        errs[f.name] = `${f.label} is required`
      }
    })
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

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
          {TEMPLATES.map(t => (
            <div key={t.id}>
              <div style={s.templateCard} className="card-hover" onClick={() => handleSelectTemplate(t.id)}>
                <div style={s.iconBox}>{t.isStampPaper ? <Stamp size={32}/> : <FileText size={32}/>}</div>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: 8}}>{t.name}</h3>
                {t.isStampPaper && <span style={{display:'inline-block', background:'linear-gradient(135deg, #D4AF37, #B8860B)', color:'#fff', fontSize:'.65rem', fontWeight:800, padding:'3px 10px', borderRadius:50, marginBottom:8, letterSpacing:'.5px'}}>NEW · PREMIUM</span>}
                <p style={{fontSize: '.9rem', color: 'var(--txt-3)', lineHeight: 1.6}}>{t.description}</p>
                <button className="btn btn-outline" style={{marginTop: '1.5rem', width: '100%', gap: 6}}>
                  {expandedTemplate === t.id ? <><ChevronDown size={16} style={{transform:'rotate(180deg)', transition: 'transform 0.2s'}}/> Close</> : 'Select Template'}
                </button>
              </div>

              {/* Accordion Form */}
              {expandedTemplate === t.id && (
                <div style={s.accordionForm}>
                  <h4 style={{marginBottom: '1.2rem', fontWeight: 800, fontSize: '1rem', color: '#7B1D2E', borderBottom: '1px solid #E8C9A8', paddingBottom: 8}}>
                    Fill in Details — {t.name}
                  </h4>
                  <div style={s.formFields}>
                    {t.fields.map(field => (
                      <div className="form-group" key={field.name}>
                        <label>{field.label}{field.required && ' *'}</label>
                        {field.type === 'textarea' ? (
                          <>
                            <textarea
                              name={field.name}
                              rows={4}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              style={fieldErrors[field.name] ? {borderColor:'#DC2626'} : {}}
                            />
                            {fieldErrors[field.name] && <span style={{color:'#DC2626',fontSize:'.72rem',fontWeight:600,marginTop:2,display:'block'}}>{fieldErrors[field.name]}</span>}
                          </>
                        ) : field.type === 'select' ? (
                          <>
                            <select name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} style={fieldErrors[field.name] ? {borderColor:'#DC2626'} : {}}>
                              <option value="">Select...</option>
                              {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            {fieldErrors[field.name] && <span style={{color:'#DC2626',fontSize:'.72rem',fontWeight:600,marginTop:2,display:'block'}}>{fieldErrors[field.name]}</span>}
                          </>
                        ) : (
                          <>
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.type !== 'date' ? `Enter ${field.label.toLowerCase()}` : ''}
                              style={fieldErrors[field.name] ? {borderColor:'#DC2626'} : {}}
                            />
                            {fieldErrors[field.name] && <span style={{color:'#DC2626',fontSize:'.72rem',fontWeight:600,marginTop:2,display:'block'}}>{fieldErrors[field.name]}</span>}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    style={{width: '100%', marginTop: '1.5rem', gap: 8}}
                    onClick={() => handleGenerate(t)}
                  >
                    <Download size={20}/> {t.isStampPaper ? 'Generate Stamp Paper' : 'Generate Document'}
                  </button>

                  {generatedId === t.id && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(46, 204, 113, 0.1)',
                      border: '1px solid #2ECC71',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '.88rem',
                      fontWeight: 600,
                      color: '#15803D',
                    }}>
                      <CheckCircle size={18}/> ✓ {t.isStampPaper ? 'Stamp paper generated! Use Ctrl+P / ⌘+P to save as PDF in the opened window.' : 'Document downloaded. We recommend having it reviewed by a verified advocate.'}
                      <Link href="/search" style={{marginLeft:8,color:'#7B1D2E',fontWeight:700,textDecoration:'underline',fontSize:'.85rem'}}>Find a Lawyer →</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={s.footerNote}>
          <p>Disclaimer: Justice Junction 24/7 is not a law firm. These documents are drafts and may need specific modifications to be legally binding in your jurisdiction. Stamp duty and notarization are not included.</p>
        </div>
      </div>
    </div>
  )
}

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: 1100, margin: '0 auto' },
  templateCard: { background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #E8C9A8', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
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
