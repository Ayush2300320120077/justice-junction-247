const mongoose = require('mongoose');
require('dotenv').config();
const DocumentTemplate = require('./models/DocumentTemplate');

const templatesToSeed = [
  {
    title: 'Rental Agreement',
    category: 'Real Estate',
    description: 'A standard residential rental or lease agreement between a landlord and a tenant.',
    fields: [
      { label: 'Landlord Name', fieldName: 'landlordName', type: 'text', required: true },
      { label: 'Tenant Name', fieldName: 'tenantName', type: 'text', required: true },
      { label: 'Property Address', fieldName: 'propertyAddress', type: 'textarea', required: true },
      { label: 'Rent Amount', fieldName: 'rentAmount', type: 'number', required: true },
      { label: 'Security Deposit', fieldName: 'securityDeposit', type: 'number', required: true },
      { label: 'Start Date', fieldName: 'startDate', type: 'date', required: true }
    ],
    templateBody: `RENTAL AGREEMENT\n\nThis Rental Agreement is made and entered into on {{startDate}}, between:\n\n1. {{landlordName}} (hereinafter referred to as the "Landlord"), and\n2. {{tenantName}} (hereinafter referred to as the "Tenant").\n\nThe Landlord agrees to rent out the property located at {{propertyAddress}} to the Tenant under the following terms and conditions:\n\n1. The monthly rent is set at Rs. {{rentAmount}}, payable in advance on the 1st of every month.\n2. A security deposit of Rs. {{securityDeposit}} has been paid by the Tenant.\n3. The Tenant agrees to keep the property in good condition.\n\nSigned by:\n\n___________________\nLandlord: {{landlordName}}\n\n___________________\nTenant: {{tenantName}}`
  },
  {
    title: 'General Affidavit',
    category: 'Legal',
    description: 'A general sworn statement of facts by an individual.',
    fields: [
      { label: 'Affiant Name', fieldName: 'affiantName', type: 'text', required: true },
      { label: 'Age', fieldName: 'age', type: 'number', required: true },
      { label: 'Address', fieldName: 'address', type: 'textarea', required: true },
      { label: 'Statement', fieldName: 'statement', type: 'textarea', required: true },
      { label: 'Date', fieldName: 'date', type: 'date', required: true }
    ],
    templateBody: `AFFIDAVIT\n\nI, {{affiantName}}, aged about {{age}} years, residing at {{address}}, do hereby solemnly affirm and state on oath as follows:\n\n{{statement}}\n\nI state that what is stated above is true and correct to the best of my knowledge, information, and belief.\n\nDate: {{date}}\n\n___________________\nSignature of Deponent`
  },
  {
    title: 'Power of Attorney (General)',
    category: 'Legal',
    description: 'A document granting someone the authority to act on your behalf in general legal and financial matters.',
    fields: [
      { label: 'Principal Name', fieldName: 'principalName', type: 'text', required: true },
      { label: 'Agent Name', fieldName: 'agentName', type: 'text', required: true },
      { label: 'Agent Address', fieldName: 'agentAddress', type: 'textarea', required: true },
      { label: 'Date of Execution', fieldName: 'date', type: 'date', required: true }
    ],
    templateBody: `GENERAL POWER OF ATTORNEY\n\nKNOW ALL MEN BY THESE PRESENTS that I, {{principalName}}, do hereby appoint {{agentName}}, residing at {{agentAddress}}, as my true and lawful attorney to act in my name and on my behalf in all matters related to my properties, bank accounts, and legal affairs.\n\nMy attorney shall have the power to execute, sign, and deliver all documents necessary for the management of my affairs.\n\nExecuted on this date: {{date}}\n\n___________________\nSignature of Principal: {{principalName}}`
  },
  {
    title: 'Non-Disclosure Agreement (NDA)',
    category: 'Business',
    description: 'A confidentiality agreement protecting sensitive business information.',
    fields: [
      { label: 'Disclosing Party', fieldName: 'disclosingParty', type: 'text', required: true },
      { label: 'Receiving Party', fieldName: 'receivingParty', type: 'text', required: true },
      { label: 'Purpose', fieldName: 'purpose', type: 'text', required: true },
      { label: 'Date', fieldName: 'date', type: 'date', required: true }
    ],
    templateBody: `NON-DISCLOSURE AGREEMENT\n\nThis Agreement is entered into on {{date}} between {{disclosingParty}} (Disclosing Party) and {{receivingParty}} (Receiving Party).\n\nThe Receiving Party acknowledges that they will have access to confidential information regarding {{purpose}}. The Receiving Party agrees to maintain the confidentiality of this information and not disclose it to any third party without written consent.\n\n___________________\n{{disclosingParty}}\n\n___________________\n{{receivingParty}}`
  },
  {
    title: 'Legal Notice',
    category: 'Legal',
    description: 'A general legal demand notice sent to a party before initiating litigation.',
    fields: [
      { label: 'Sender Name', fieldName: 'senderName', type: 'text', required: true },
      { label: 'Recipient Name', fieldName: 'recipientName', type: 'text', required: true },
      { label: 'Recipient Address', fieldName: 'recipientAddress', type: 'textarea', required: true },
      { label: 'Grievance', fieldName: 'grievance', type: 'textarea', required: true },
      { label: 'Demand', fieldName: 'demand', type: 'textarea', required: true }
    ],
    templateBody: `LEGAL NOTICE\n\nTo,\n{{recipientName}}\n{{recipientAddress}}\n\nUnder instruction from my client {{senderName}}, I hereby issue this legal notice to you:\n\n{{grievance}}\n\nYou are hereby called upon to {{demand}} within 15 days of receiving this notice, failing which my client shall be constrained to initiate legal proceedings against you entirely at your risk and cost.\n\n___________________\nAdvocate for {{senderName}}`
  },
  {
    title: 'Sale Deed',
    category: 'Real Estate',
    description: 'A legal document that records the transfer of ownership of immovable property.',
    fields: [
      { label: 'Seller Name', fieldName: 'sellerName', type: 'text', required: true },
      { label: 'Buyer Name', fieldName: 'buyerName', type: 'text', required: true },
      { label: 'Property Details', fieldName: 'propertyDetails', type: 'textarea', required: true },
      { label: 'Sale Consideration', fieldName: 'saleConsideration', type: 'number', required: true },
      { label: 'Date', fieldName: 'date', type: 'date', required: true }
    ],
    templateBody: `SALE DEED\n\nThis Sale Deed is executed on {{date}} by and between {{sellerName}} (Vendor) and {{buyerName}} (Purchaser).\n\nThe Vendor is the absolute owner of the property described as: {{propertyDetails}}.\n\nFor a total sale consideration of Rs. {{saleConsideration}}, the Vendor hereby sells, transfers, and conveys all rights, title, and interest in the said property to the Purchaser.\n\n___________________\nVendor: {{sellerName}}\n\n___________________\nPurchaser: {{buyerName}}`
  },
  {
    title: 'Will / Testament',
    category: 'Personal',
    description: 'A legal declaration of the intention of a testator with respect to their property.',
    fields: [
      { label: 'Testator Name', fieldName: 'testatorName', type: 'text', required: true },
      { label: 'Age', fieldName: 'age', type: 'number', required: true },
      { label: 'Executor Name', fieldName: 'executorName', type: 'text', required: true },
      { label: 'Beneficiary Details', fieldName: 'beneficiaryDetails', type: 'textarea', required: true }
    ],
    templateBody: `LAST WILL AND TESTAMENT\n\nI, {{testatorName}}, aged {{age}} years, being of sound mind and memory, do hereby declare this to be my Last Will and Testament, revoking all prior wills and codicils.\n\nI appoint {{executorName}} as the Executor of this Will.\n\nI hereby bequeath my properties and assets as follows:\n{{beneficiaryDetails}}\n\nSigned by me on this day.\n\n___________________\nTestator: {{testatorName}}`
  },
  {
    title: 'Partnership Deed',
    category: 'Business',
    description: 'An agreement outlining the terms and conditions of a partnership business.',
    fields: [
      { label: 'Partner 1', fieldName: 'partner1', type: 'text', required: true },
      { label: 'Partner 2', fieldName: 'partner2', type: 'text', required: true },
      { label: 'Business Name', fieldName: 'businessName', type: 'text', required: true },
      { label: 'Business Nature', fieldName: 'businessNature', type: 'text', required: true },
      { label: 'Date', fieldName: 'date', type: 'date', required: true }
    ],
    templateBody: `PARTNERSHIP DEED\n\nThis Deed of Partnership is made on {{date}} between {{partner1}} and {{partner2}}.\n\nThe parties have agreed to carry on the business of {{businessNature}} under the name and style of "{{businessName}}".\n\nBoth partners agree to share profits and losses equally and conduct the business with mutual trust and good faith.\n\n___________________\n{{partner1}}\n\n___________________\n{{partner2}}`
  },
  {
    title: 'Employment Agreement',
    category: 'Business',
    description: 'A contract between an employer and an employee outlining terms of employment.',
    fields: [
      { label: 'Employer Name', fieldName: 'employerName', type: 'text', required: true },
      { label: 'Employee Name', fieldName: 'employeeName', type: 'text', required: true },
      { label: 'Job Title', fieldName: 'jobTitle', type: 'text', required: true },
      { label: 'Salary', fieldName: 'salary', type: 'number', required: true },
      { label: 'Start Date', fieldName: 'startDate', type: 'date', required: true }
    ],
    templateBody: `EMPLOYMENT AGREEMENT\n\nThis Agreement is between {{employerName}} (Employer) and {{employeeName}} (Employee).\n\nThe Employer agrees to employ the Employee as a {{jobTitle}} starting on {{startDate}}. The Employee's monthly salary shall be Rs. {{salary}}.\n\nThe Employee agrees to perform their duties diligently and adhere to company policies.\n\n___________________\nEmployer: {{employerName}}\n\n___________________\nEmployee: {{employeeName}}`
  },
  {
    title: 'Consumer Complaint Letter',
    category: 'Legal',
    description: 'A formal complaint letter to a company regarding defective goods or deficient services.',
    fields: [
      { label: 'Consumer Name', fieldName: 'consumerName', type: 'text', required: true },
      { label: 'Company Name', fieldName: 'companyName', type: 'text', required: true },
      { label: 'Product/Service Details', fieldName: 'productDetails', type: 'textarea', required: true },
      { label: 'Issue Description', fieldName: 'issueDescription', type: 'textarea', required: true },
      { label: 'Resolution Demanded', fieldName: 'resolution', type: 'textarea', required: true }
    ],
    templateBody: `CONSUMER COMPLAINT\n\nTo,\n{{companyName}}\n\nFrom:\n{{consumerName}}\n\nSubject: Complaint regarding {{productDetails}}\n\nDear Sir/Madam,\n\nI purchased the aforementioned product/service and have faced the following issue:\n{{issueDescription}}\n\nI request you to kindly resolve this matter by: {{resolution}}.\n\nIf this is not resolved within 15 days, I will be forced to approach the Consumer Forum.\n\nSincerely,\n{{consumerName}}`
  }
];

const matchRegexps = {
  'Rental Agreement': /rental|lease/i,
  'General Affidavit': /affidavit/i,
  'Power of Attorney (General)': /power of attorney|poa/i,
  'Non-Disclosure Agreement (NDA)': /non-disclosure|nda/i,
  'Legal Notice': /legal notice|demand notice/i,
  'Sale Deed': /sale deed|sale agreement/i,
  'Will / Testament': /will|testament/i,
  'Partnership Deed': /partnership/i,
  'Employment Agreement': /employment/i,
  'Consumer Complaint Letter': /consumer complaint/i
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // 1. Fetch current templates
  const existing = await DocumentTemplate.find({});
  console.log('=== BEFORE STATE ===');
  console.log(`Total Templates: ${existing.length}`);
  existing.forEach(t => {
    console.log(`- ${t.title} (${t.category}): ${t.fields.map(f => f.fieldName).join(', ')}`);
  });
  console.log('====================\n');

  let insertedCount = 0;
  let skippedList = [];
  let newTitles = [];

  for (const t of templatesToSeed) {
    const regex = matchRegexps[t.title];
    const exists = existing.find(ex => regex.test(ex.title));
    if (exists) {
      skippedList.push(t.title + ` (matched existing: ${exists.title})`);
    } else {
      await DocumentTemplate.create({ ...t, isActive: true });
      newTitles.push(t.title);
      insertedCount++;
    }
  }

  // 6. Fetch after state
  const after = await DocumentTemplate.find({});
  console.log('\n=== AFTER STATE ===');
  console.log(`Total Templates: ${after.length}`);
  after.forEach(t => {
    console.log(`- ${t.title}`);
  });
  console.log('====================\n');

  console.log('=== SUMMARY ===');
  console.log(`Before count: ${existing.length}`);
  console.log(`After count: ${after.length}`);
  console.log(`Newly inserted (${insertedCount}):\n`, newTitles.join('\n '));
  console.log(`Skipped (${skippedList.length}):\n`, skippedList.join('\n '));

  process.exit(0);
}

run().catch(console.error);
