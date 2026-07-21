import connectDB from '../../../../middleware/db'

const SYSTEM_PROMPT = `You are a professional legal drafting assistant specializing in Indian law.
Your task is to draft a formal legal document of the specified type using ONLY the provided fields (answers).
Do not invent any facts, names, dates, locations, or numbers that are not provided in the answers. If any crucial information is missing, use underscores or placeholders like "________".
You must write the document in formal legal language appropriate for India (e.g., standard terminology under Indian statutes like the Indian Contract Act, 1872, Negotiable Instruments Act, 1881, etc.).

CRITICAL REQUIREMENT:
You must identify any clauses or terms that require professional legal review (such as jurisdiction-specific terms, liability limits, indemnification clauses, dispute resolution, or waiver of rights). Next to every such clause, you MUST insert a bracketed placeholder in exactly this format: [VERIFY WITH LAWYER: <reason>], where <reason> is a short explanation of why a lawyer should review this specific clause (e.g., "Verify governing law and jurisdiction", "Verify liability limitation under Indian law"). Do not make the reasons generic; make them specific to the clause context.

Provide only the drafted document text. Do not include any conversational intro or outro.`;

function generateMockDocument(documentType, answers) {
  const now = new Date().toLocaleDateString('en-IN');
  let draftText = '';
  
  if (documentType === 'rental') {
    draftText = `RENTAL AGREEMENT / LEASE DEED

This RENTAL AGREEMENT is made and executed on this ${answers.startDate || now} at ${answers.state || '________'}, between:

LANDLORD: ${answers.landlord || '________'}
ADDRESS: ${answers.propertyAddress || '________'}
(Hereinafter referred to as the "LESSOR" / "FIRST PARTY")

AND

TENANT: ${answers.tenant || '________'}
(Hereinafter referred to as the "LESSEE" / "SECOND PARTY")

The LESSOR is the absolute owner of the property situated at: ${answers.propertyAddress || '________'}

TERMS AND CONDITIONS:

1. LEASE PERIOD: The Lessor hereby lets and the Lessee hereby takes on rent the said premises for a period of ${answers.period || '11'} months, commencing from ${answers.startDate || now}. [VERIFY WITH LAWYER: Verify if an 11-month lease term requires registration in the state of ${answers.state || 'jurisdiction'}]

2. MONTHLY RENT: The Lessee agrees to pay a monthly rent of ₹${answers.rent || '________'} (Rupees Only) to the Lessor on or before the 5th day of every calendar month.

3. SECURITY DEPOSIT: The Lessee has deposited a sum of ₹${answers.deposit || '0'} (Rupees Only) as an interest-free security deposit, which shall be refunded by the Lessor at the time of vacating the premises, subject to deductions for any damages or outstanding dues. [VERIFY WITH LAWYER: Check if the security deposit amount and refund terms comply with local state laws]

4. USAGE: The premises shall be used solely for residential purposes and the Lessee shall not sub-let or part with possession of the premises to any third party.

5. MAINTENANCE: The Lessee shall maintain the premises in good condition and shall be responsible for minor repairs and electricity/water charges.

6. TERMINATION: Either party may terminate this agreement by giving one month's prior written notice to the other party. [VERIFY WITH LAWYER: Confirm if a one-month notice period is standard and sufficient under state laws]

7. JURISDICTION: This agreement shall be governed by the laws of India and any disputes shall be subject to the jurisdiction of the courts in the State of ${answers.state || '________'}. [VERIFY WITH LAWYER: Verify that the governing courts and jurisdiction are appropriately defined]

IN WITNESS WHEREOF, the parties have signed this agreement on the date mentioned above.


_________________________          _________________________
Signature of Lessor                Signature of Lessee
${answers.landlord || '________'}     ${answers.tenant || '________'}


Witness 1: _________________________

Witness 2: _________________________`;
  } else if (documentType === 'legal-notice') {
    draftText = `LEGAL NOTICE

Date: ${answers.noticeDate || now}

TO,
${answers.recipientName || '________'}
${answers.recipientAddress || '________'}

SUBJECT: ${answers.subject || '________'}

Sir/Madam,

Under the instructions and on behalf of my client, ${answers.senderName || '________'}, residing at ${answers.senderAddress || '________'}, I hereby serve upon you this Legal Notice:

1. That the facts of the matter are as follows: ${answers.noticeBody || '________'}

2. That by way of this notice, my client seeks the following relief: ${answers.relief || '________'} [VERIFY WITH LAWYER: Ensure the relief sought is legally enforceable and appropriate under Indian civil/criminal law]

3. You are hereby called upon to comply with the above demands within ${answers.daysToRespond || '15'} days of receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, including civil and criminal actions, at your cost and consequences. [VERIFY WITH LAWYER: Confirm if the notice response period matches the statutory minimum for this cause of action]

Issued under instructions.


_________________________
ADVOCATE FOR SENDER
(Office of ${answers.senderName || '________'})`;
  } else if (documentType === 'affidavit') {
    draftText = `GENERAL AFFIDAVIT

BEFORE THE COMPETENT AUTHORITY / NOTARY PUBLIC AT ${answers.city || '________'}

I, ${answers.name || '________'}, S/o / W/o ${answers.fatherName || '________'}, aged about ${answers.age || '___'} years, residing at ${answers.address || '________'}, do hereby solemnly affirm and state on oath as follows:

1. That I am the deponent in this affidavit and I am well conversant with the facts stated herein.

2. That the purpose of this affidavit is: ${answers.statement || '________'} [VERIFY WITH LAWYER: Check if this statement requires specific statutory wording for court submission]

3. That I declare that the contents of this affidavit are true and correct to the best of my knowledge, information, and belief, and nothing material has been concealed therefrom. [VERIFY WITH LAWYER: Deponent is criminally liable under IPC Section 193 for false statements in affidavits]

I verify that the above statement is true and correct.

Verified at ${answers.city || '________'} on this ${answers.date || now}.


_________________________
Signature of Deponent
(${answers.name || '________'})


IDENTIFIED BY ME,
ADVOCATE`;
  } else {
    // Default fallback document
    draftText = `LEGAL DOCUMENT DRAFT (${documentType.toUpperCase()})

This document is drafted based on user answers:
${Object.entries(answers || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}

[VERIFY WITH LAWYER: Verify that the document type and legal clauses are valid and enforceable under Indian law]`;
  }
  
  return draftText;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { documentType, answers } = req.body;
    if (!documentType) {
      return res.status(400).json({ error: 'documentType is required' });
    }
    if (!answers) {
      return res.status(400).json({ error: 'answers is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    let draftText = '';

    if (!apiKey || apiKey.startsWith('your_') || apiKey.includes('placeholder')) {
      console.log('Anthropic API key is not configured, falling back to local document generation.');
      draftText = generateMockDocument(documentType, answers);
    } else {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 4000,
            system: SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: `Draft the following document type: "${documentType}".\nHere are the user-provided answers to incorporate:\n${JSON.stringify(answers, null, 2)}`
              }
            ]
          })
        });

        if (!response.ok) {
          const err = await response.json();
          console.error('Anthropic API error:', err);
          draftText = generateMockDocument(documentType, answers);
        } else {
          const data = await response.json();
          draftText = data.content?.[0]?.text || '';
          if (!draftText) {
            draftText = generateMockDocument(documentType, answers);
          }
        }
      } catch (apiErr) {
        console.error('Anthropic network/fetch error:', apiErr);
        draftText = generateMockDocument(documentType, answers);
      }
    }

    // Parse draftText for all instances of [VERIFY WITH LAWYER: <reason>]
    const flaggedSections = [];
    const regex = /\[VERIFY WITH LAWYER: [^\]]+\]/g;
    let match;
    while ((match = regex.exec(draftText)) !== null) {
      flaggedSections.push(match[0]);
    }

    return res.status(200).json({ draftText, flaggedSections });
  } catch (err) {
    console.error('AI generate document Next.js endpoint error:', err);
    return res.status(500).json({ error: err.message });
  }
}
