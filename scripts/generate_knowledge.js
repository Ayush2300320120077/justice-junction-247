const fs = require('fs');
const path = require('path');

const articles = [
  {
    id: 'rti', title: 'Right to Information (RTI) Act, 2005', category: 'Citizens Rights',
    emoji: '📋', readTime: '8 min', difficulty: 'Beginner',
    desc: 'The RTI Act empowers every Indian citizen to request information from any public authority. You can ask for documents, records, memos, emails, opinions, data, and samples held by the government.',
    keyPoints: ['File RTI online at rtionline.gov.in', 'Pay ₹10 application fee (BPL card holders exempt)', 'Response within 30 days (48 hrs for life/liberty matters)', "First Appeal to PIO's superior within 30 days", 'Second Appeal to CIC/SIC within 90 days'],
    govLink: 'https://rtionline.gov.in', govSource: 'rtionline.gov.in',
    content: `
      <div style="font-family: inherit;">
        <h2 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem;">Understanding the RTI Act, 2005</h2>
        <p style="margin-bottom: 1rem;">The Right to Information (RTI) Act 2005 is a landmark legislation that revolutionized transparency and accountability in the Indian government. It gives every citizen the fundamental right to demand information from public authorities.</p>
        
        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">What Can You Ask?</h3>
        <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li>Copies of government documents, orders, and policies.</li>
          <li>Details of budget allocations, expenditures, and public works.</li>
          <li>Status of your applications, pensions, or FIRs.</li>
          <li>Inspection of government records and public works.</li>
        </ul>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Recent Updates & Amendments</h3>
        <div style="background-color: #FDF6EE; padding: 1rem; border-left: 4px solid #D97706; margin-bottom: 1rem;">
          <strong>🚨 Important Update (DPDP Act 2023):</strong> The Digital Personal Data Protection Act, 2023 has amended Section 8(1)(j) of the RTI Act. Now, public authorities can absolutely deny information if it relates to "personal information" of a third party, removing the previous public interest override caveat. Always frame your questions to seek objective, non-personal data.
        </div>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Step-by-Step Filing Guide</h3>
        <ol style="list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>Identify the Authority:</strong> Determine which department holds the information.</li>
          <li><strong>Draft the Application:</strong> Keep questions specific. Do not ask "Why" questions, ask for "Records pertaining to...".</li>
          <li><strong>Pay the Fee:</strong> A nominal fee of ₹10 is required (via Postal Order, DD, or online). Below Poverty Line (BPL) applicants are exempt.</li>
          <li><strong>Submit:</strong> Send via Registered Post to the Public Information Officer (PIO) or apply online at rtionline.gov.in.</li>
        </ol>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">What if Information is Denied or Delayed?</h3>
        <p style="margin-bottom: 1rem;">If you do not receive a reply within 30 days, or are unsatisfied with the reply, you can file a <strong>First Appeal</strong> to the First Appellate Authority (FAA) within the same department. If the FAA also fails to provide relief, you can file a <strong>Second Appeal</strong> to the Central/State Information Commission.</p>
        <p style="margin-bottom: 1rem;">Under Section 20, PIOs can be penalized ₹250 per day (up to ₹25,000) for unreasonable delays or destroying information.</p>
      </div>
    `
  },
  {
    id: 'fir', title: 'How to File an FIR in India', category: 'Criminal Law',
    emoji: '🚨', readTime: '6 min', difficulty: 'Beginner',
    desc: 'A First Information Report (FIR) is the first step in the criminal justice process. Under Section 154 CrPC, any person can report a cognizable offence to the police. The police cannot refuse to register an FIR.',
    keyPoints: ['Police CANNOT refuse to register FIR for cognizable offences', 'File e-FIR online on state police portals', 'Free copy of FIR is your right', 'If refused, complain to Superintendent of Police', 'Zero FIR can be filed at any police station'],
    govLink: 'https://www.mha.gov.in', govSource: 'mha.gov.in',
    content: `
      <div style="font-family: inherit;">
        <h2 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem;">Complete Guide to Filing an FIR</h2>
        <p style="margin-bottom: 1rem;">A First Information Report (FIR) is a critical document that sets the criminal justice process in motion. Knowing your rights regarding FIR registration is essential for every citizen.</p>
        
        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Recent Updates: BNSS 2024</h3>
        <div style="background-color: #FDF6EE; padding: 1rem; border-left: 4px solid #DC2626; margin-bottom: 1rem;">
          <strong>🚨 Bharatiya Nagarik Suraksha Sanhita (BNSS), 2024:</strong> Replacing the CrPC from July 1, 2024, the BNSS formalizes the concept of <strong>Zero FIR</strong> and allows for <strong>e-FIRs</strong>. You can now report crimes electronically, but you must sign the physical record within 3 days. Preliminary inquiries are now permitted for offences punishable with 3 to 7 years of imprisonment before an FIR is registered, but must be concluded within 14 days.
        </div>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">What is a Zero FIR?</h3>
        <p style="margin-bottom: 1rem;">A Zero FIR can be filed at <strong>any police station</strong>, regardless of where the crime occurred. It is given a serial number "0" and is subsequently transferred to the police station with the correct jurisdiction. This ensures critical time is not lost in jurisdictional disputes, especially in heinous crimes.</p>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Your Rights When Filing</h3>
        <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li>You have the right to receive a copy of the FIR free of cost immediately.</li>
          <li>For non-cognizable offences, the police will record the information in the Daily Diary (NCR) and direct you to a Magistrate.</li>
          <li>You can narrate the incident in your native language.</li>
        </ul>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">What if Police Refuse to Register an FIR?</h3>
        <ol style="list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li>Send the complaint in writing by post to the Superintendent of Police (SP) or DCP.</li>
          <li>If the SP does not act, you can approach a Magistrate under Section 175(3) BNSS (formerly 156(3) CrPC) to order an investigation.</li>
          <li>You can file a complaint directly in court (Private Complaint).</li>
          <li>In cases of severe police inaction, you can approach the High Court via a writ petition.</li>
        </ol>
      </div>
    `
  },
  {
    id: 'arrest', title: 'Your Rights During Arrest', category: 'Citizens Rights',
    emoji: '⚖️', readTime: '7 min', difficulty: 'Beginner',
    desc: 'Article 22 of the Indian Constitution and the CrPC protect citizens during arrest. You have the right to know the reason for arrest, to be produced before a magistrate within 24 hours, and to legal representation.',
    keyPoints: ['Right to know grounds of arrest (Art. 22)', 'Produced before magistrate within 24 hours', 'Right to inform a friend/relative of arrest', 'Right to consult a lawyer of your choice', 'Women can only be arrested by female officers (sunset to sunrise exempt)'],
    govLink: 'https://nalsa.gov.in', govSource: 'nalsa.gov.in',
    content: `
      <div style="font-family: inherit;">
        <h2 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem;">Constitutional & Statutory Rights During Arrest</h2>
        <p style="margin-bottom: 1rem;">Arrest deprives a person of their liberty. The Indian Constitution (Article 20, 21, and 22) and the BNSS 2024 ensure that no person is arrested arbitrarily and that fundamental human rights are maintained.</p>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">The D.K. Basu Guidelines (Now Codified)</h3>
        <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>Identification:</strong> The arresting officer must wear a clear, visible, and accurate name tag.</li>
          <li><strong>Arrest Memo:</strong> An arrest memo must be prepared at the time of arrest, attested by at least one witness (preferably a family member), and countersigned by the arrestee.</li>
          <li><strong>Right to Inform:</strong> The police must notify a friend or relative about the arrest and the location of detention immediately.</li>
          <li><strong>Medical Examination:</strong> The arrestee must be medically examined by a trained doctor every 48 hours during detention.</li>
        </ul>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Recent Amendments in BNSS 2024</h3>
        <div style="background-color: #FDF6EE; padding: 1rem; border-left: 4px solid #16A34A; margin-bottom: 1rem;">
          <strong>🚨 BNSS Update:</strong> The BNSS 2024 mandates audio-video recording of the search and seizure processes, adding a layer of accountability for the police during arrests. Additionally, the maximum police custody period can now be sought in blocks across the initial 40/60 days, unlike the rigid 15-day rule in the old CrPC.
        </div>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Special Protections for Women</h3>
        <p style="margin-bottom: 1rem;">A woman cannot be arrested after sunset and before sunrise except in exceptional circumstances, and only with prior permission from a Judicial Magistrate. The arrest must be made by a female police officer. Search of a woman must only be conducted by another woman with strict regard to decency.</p>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Right Against Self-Incrimination</h3>
        <p style="margin-bottom: 1rem;">Under Article 20(3), you cannot be compelled to be a witness against yourself. Confessions made to the police are inadmissible in court under the Bharatiya Sakshya Adhiniyam (BSA) 2024 (formerly Indian Evidence Act). You have the right to remain silent.</p>
      </div>
    `
  },
  {
    id: 'legal-aid', title: 'Free Legal Aid — Who Qualifies?', category: 'Citizens Rights',
    emoji: '🏛️', readTime: '5 min', difficulty: 'Beginner',
    desc: 'NALSA (National Legal Services Authority) provides free legal services to eligible citizens. Under Section 12 of the Legal Services Authorities Act, 1987, you are entitled to free legal representation.',
    keyPoints: ['Women & children are eligible (regardless of income)', 'SC/ST members entitled to free legal aid', 'Persons with income below ₹1 lakh p.a.', 'Victims of disaster, violence, industrial accident', 'Call NALSA Helpline: 15100 (toll-free)'],
    govLink: 'https://nalsa.gov.in', govSource: 'nalsa.gov.in',
    content: `
      <div style="font-family: inherit;">
        <h2 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem;">Access to Justice: Free Legal Aid in India</h2>
        <p style="margin-bottom: 1rem;">Article 39A of the Constitution directs the State to provide free legal aid to ensure that justice is not denied to any citizen by reason of economic or other disabilities. The Legal Services Authorities Act, 1987 operationalizes this through NALSA, SLSAs, and DLSAs.</p>
        
        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Who is Entitled?</h3>
        <p style="margin-bottom: 1rem;">Under Section 12 of the Act, the following persons are entitled to absolutely free legal aid, including court fees, drafting, and lawyer representation:</p>
        <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>Women and Children:</strong> Regardless of their financial income.</li>
          <li><strong>SC/ST Members:</strong> Members of Scheduled Castes and Scheduled Tribes.</li>
          <li><strong>Industrial Workmen:</strong> For disputes relating to employment.</li>
          <li><strong>Victims of Disaster:</strong> Including ethnic violence, floods, drought, earthquake, or industrial disasters.</li>
          <li><strong>Disabled Persons:</strong> Persons with disabilities.</li>
          <li><strong>Persons in Custody:</strong> Inmates in protective homes, juvenile homes, or psychiatric hospitals.</li>
          <li><strong>Low-Income Individuals:</strong> Persons whose annual income is less than the limit prescribed by the State Government (usually ₹1 Lakh to ₹3 Lakh depending on the state).</li>
        </ul>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">How to Apply</h3>
        <ol style="list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>Online:</strong> Fill out the application on the NALSA portal (nalsa.gov.in).</li>
          <li><strong>In Person:</strong> Visit the Front Office of the District Legal Services Authority (DLSA) usually located in the District Court premises.</li>
          <li><strong>Through Jail Superintendent:</strong> If you are incarcerated, you can apply through the jail authorities.</li>
        </ol>

        <div style="background-color: #FDF6EE; padding: 1rem; border-left: 4px solid #7B1D2E; margin-bottom: 1rem;">
          <strong>📞 Toll-Free Helpline:</strong> You can call the NALSA National Legal Helpline at <strong>15100</strong> for immediate assistance and guidance.
        </div>
      </div>
    `
  },
  {
    id: 'divorce', title: 'Divorce Laws in India — Complete Guide', category: 'Family Law',
    emoji: '👨‍👩‍👧', readTime: '12 min', difficulty: 'Intermediate',
    desc: 'India has multiple divorce laws based on religion. The Hindu Marriage Act 1955, Special Marriage Act 1954, Muslim Personal Law, and Indian Divorce Act 1869 govern divorces for different communities.',
    keyPoints: ['Mutual consent divorce under Sec. 13B HMA — 6 month waiting period', 'Contested divorce grounds: cruelty, adultery, desertion (2+ yrs)', 'Alimony under Section 125 CrPC for all religions', 'Child custody — best interest of child is paramount', 'Divorce can now be filed online in some High Courts'],
    govLink: 'https://legislative.gov.in/acts/hindu-marriage-act-1955', govSource: 'legislative.gov.in',
    content: `
      <div style="font-family: inherit;">
        <h2 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem;">Divorce and Separation in India</h2>
        <p style="margin-bottom: 1rem;">Divorce in India is primarily governed by religion-specific personal laws. A secular option is also available under the Special Marriage Act. Understanding the type of divorce you are filing is critical for timelines and strategy.</p>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Mutual Consent Divorce</h3>
        <p style="margin-bottom: 1rem;">This is the fastest, least traumatic, and most cost-effective way to divorce. Under Section 13B of the Hindu Marriage Act, both parties must agree to terms of alimony, child custody, and property division before filing.</p>
        <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li>Must have lived separately for at least 1 year.</li>
          <li>First Motion is filed jointly.</li>
          <li>A mandatory 6-month cooling-off period follows (though the Supreme Court has ruled this can be waived in exceptional circumstances where reconciliation is impossible).</li>
          <li>Second Motion is filed, and divorce is granted. Total time: 1-7 months.</li>
        </ul>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Contested Divorce</h3>
        <p style="margin-bottom: 1rem;">If one party refuses, the other must file for a contested divorce on specific legal grounds. These include:</p>
        <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>Cruelty:</strong> Physical or mental.</li>
          <li><strong>Adultery:</strong> Voluntary sexual intercourse outside marriage.</li>
          <li><strong>Desertion:</strong> Abandonment for a continuous period of at least 2 years.</li>
          <li><strong>Conversion:</strong> Ceasing to be a Hindu by conversion to another religion.</li>
          <li><strong>Mental Illness:</strong> Incurable unsoundness of mind.</li>
        </ul>
        
        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Recent Legal Precedents & Updates</h3>
        <div style="background-color: #FDF6EE; padding: 1rem; border-left: 4px solid #D97706; margin-bottom: 1rem;">
          <strong>🚨 Supreme Court Ruling on "Irretrievable Breakdown":</strong> While "irretrievable breakdown of marriage" is not explicitly a statutory ground for divorce in India, the Supreme Court recently clarified in Shilpa Sailesh vs. Varun Sreenivasan (2023) that it can exercise its inherent powers under Article 142 of the Constitution to dissolve a marriage that has completely broken down, bypassing the family courts, to do "complete justice".
        </div>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Alimony and Child Custody</h3>
        <p style="margin-bottom: 1rem;">Maintenance can be claimed pendente lite (during the proceedings) and as permanent alimony upon divorce. It depends on the income of both spouses, standard of living, and financial needs. Child custody is decided purely on the "welfare of the child" principle, regardless of the parents' financial status.</p>
      </div>
    `
  },
  {
    id: 'cyber', title: 'Cyber Crime — How to Report & Recover', category: 'Digital Law',
    emoji: '💻', readTime: '9 min', difficulty: 'Beginner',
    desc: 'The IT Act 2000 (amended 2008) and BNS 2023 deal with cyber offences. India\'s National Cyber Crime Reporting Portal at cybercrime.gov.in allows you to report online fraud, harassment, and hacking 24/7.',
    keyPoints: ['Report financial fraud at cybercrime.gov.in within 24 hours', 'Call 1930 (Cyber Crime Helpline) to freeze fraudulent transaction', 'Report CSAM/online harassment: cybercrime.gov.in', 'Section 66C IT Act: identity theft — 3 yrs imprisonment + fine', 'File complaint with local cyber cell for faster action'],
    govLink: 'https://cybercrime.gov.in', govSource: 'cybercrime.gov.in',
    content: `
      <div style="font-family: inherit;">
        <h2 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem;">Combating Cyber Crime in India</h2>
        <p style="margin-bottom: 1rem;">With the rapid digitization of services, cyber crimes such as phishing, identity theft, financial fraud, and cyberstalking have surged. The Information Technology Act, 2000 and the new Bharatiya Nyaya Sanhita (BNS) 2024 provide strict frameworks for prosecuting cyber offenders.</p>
        
        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Financial Frauds: The "Golden Hour"</h3>
        <p style="margin-bottom: 1rem;">If you lose money to online fraud (UPI scams, fake links, OTP fraud), the first 2-4 hours are critical.</p>
        <ol style="list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li>Immediately call the National Cyber Crime Helpline at <strong>1930</strong>. This connects directly to the Citizen Financial Cyber Fraud Reporting and Management System.</li>
          <li>The police can coordinate with banks/wallets to freeze the fraudulent transaction before the money is withdrawn by the scammer.</li>
          <li>Register a formal complaint at <strong>cybercrime.gov.in</strong>.</li>
        </ol>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Recent Amendments: Deepfakes and DPDP Act</h3>
        <div style="background-color: #FDF6EE; padding: 1rem; border-left: 4px solid #16A34A; margin-bottom: 1rem;">
          <strong>🚨 Deepfake Regulations (2024):</strong> Following the rise of AI-generated deepfakes, the Ministry of Electronics and IT (MeitY) has issued strict advisories under the IT Rules 2021. Social media platforms must take down deepfake content within 24 hours of receiving a complaint, failing which they lose their "safe harbour" immunity and can be prosecuted directly.<br/><br/>
          <strong>🚨 Digital Personal Data Protection Act (2023):</strong> The newly passed DPDP Act imposes heavy penalties (up to ₹250 Crores) on corporations failing to prevent data breaches, giving citizens stronger rights to demand erasure of their data and report privacy violations to the Data Protection Board.
        </div>

        <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Cyberstalking and Harassment</h3>
        <p style="margin-bottom: 1rem;">Cyberstalking (Section 354D IPC / corresponding BNS section) and transmitting obscene material (Section 67 IT Act) are serious crimes. If harassed online:</p>
        <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
          <li>Do not delete the messages. Take screenshots encompassing the URL, timestamp, and profile details.</li>
          <li>Women and children can file anonymous complaints on the cybercrime.gov.in portal.</li>
          <li>Block the offender and report the profile to the platform.</li>
        </ul>
      </div>
    `
  }
];

// Add the rest of the articles from knowledge-hub with a generic but robust HTML content
const additionalArticles = [
  { id: 'domestic-violence', title: 'Protection from Domestic Violence', category: 'Family Law', emoji: '🛡️', readTime: '8 min', difficulty: 'Beginner', desc: 'The Protection of Women from Domestic Violence Act, 2005 provides civil remedies and protection orders for women facing domestic abuse.', keyPoints: ['File complaint with Protection Officer or directly in Magistrate Court', 'Get Protection, Residence & Monetary Relief Orders'], govLink: 'https://wcd.nic.in', govSource: 'wcd.nic.in' },
  { id: 'maintenance', title: 'Maintenance & Alimony Rights', category: 'Family Law', emoji: '💰', readTime: '7 min', difficulty: 'Intermediate', desc: 'Under Section 125 CrPC, any person with sufficient means who neglects to maintain their wife, children, or parents can be ordered to pay monthly maintenance.', keyPoints: ['Wife, minor children & parents can claim maintenance', 'Interim maintenance can be granted within 60 days'], govLink: 'https://legislative.gov.in', govSource: 'legislative.gov.in' },
  { id: 'tenant', title: 'Tenant & Landlord Rights in India', category: 'Property Law', emoji: '🏠', readTime: '10 min', difficulty: 'Intermediate', desc: 'Rent agreements are governed by state Rent Control Acts and the Model Tenancy Act 2021.', keyPoints: ['Rent agreement must be registered if tenure > 11 months', 'Security deposit capped at 2 months rent'], govLink: 'https://mohua.gov.in', govSource: 'mohua.gov.in' },
  { id: 'property-registration', title: 'Property Registration & Stamp Duty', category: 'Property Law', emoji: '📜', readTime: '9 min', difficulty: 'Intermediate', desc: 'Under the Registration Act, 1908 and Transfer of Property Act, 1882, immovable property transactions above ₹100 must be registered.', keyPoints: ['Register sale deed at Sub-Registrar office within 4 months', 'Stamp duty: 3-7% varies by state'], govLink: 'https://rera.gov.in', govSource: 'rera.gov.in' },
  { id: 'consumer', title: 'Consumer Protection Rights', category: 'Consumer Rights', emoji: '🛒', readTime: '8 min', difficulty: 'Beginner', desc: 'The Consumer Protection Act, 2019 strengthens consumer rights with e-commerce coverage and product liability.', keyPoints: ['File complaint online at edaakhil.nic.in (no lawyer needed)', 'Product liability covers manufacturers & sellers'], govLink: 'https://edaakhil.nic.in', govSource: 'edaakhil.nic.in' },
  { id: 'ecommerce-rights', title: 'Your Rights While Shopping Online', category: 'Consumer Rights', emoji: '📦', readTime: '6 min', difficulty: 'Beginner', desc: 'The Consumer Protection (E-Commerce) Rules 2020 mandate that platforms clearly display seller info, prices, return policies.', keyPoints: ['E-commerce platforms must display all-inclusive prices', 'Right to return or exchange — check platform policy'], govLink: 'https://consumerhelpline.gov.in', govSource: 'consumerhelpline.gov.in' },
  { id: 'upi-fraud', title: 'UPI / Banking Fraud — Recovery Steps', category: 'Digital Law', emoji: '📱', readTime: '7 min', difficulty: 'Beginner', desc: 'With UPI fraud on the rise, knowing the recovery process is critical. You must act within the first 24 hours.', keyPoints: ['Call 1930 immediately — freeze account within minutes', 'File RBI Ombudsman complaint at cms.rbi.org.in'], govLink: 'https://cybercrime.gov.in', govSource: 'cybercrime.gov.in' },
  { id: 'labour', title: 'Employee Rights at the Workplace', category: 'Labour Law', emoji: '👷', readTime: '10 min', difficulty: 'Intermediate', desc: 'India\'s Four Labour Codes consolidate 44 central labour laws. Employees have legally enforceable rights regarding wages, hours, PF, and termination.', keyPoints: ['Minimum wage varies by state', 'PF deduction mandatory for salary ≤ ₹15,000 (EPFO)'], govLink: 'https://labour.gov.in', govSource: 'labour.gov.in' },
  { id: 'posh', title: 'Sexual Harassment at Workplace (POSH)', category: 'Labour Law', emoji: '🤝', readTime: '8 min', difficulty: 'Intermediate', desc: 'The POSH Act, 2013 mandates every employer with 10+ employees to form an Internal Complaints Committee (ICC).', keyPoints: ['File complaint with ICC within 3 months of incident', 'Inquiry must be completed in 90 days'], govLink: 'https://wcd.nic.in', govSource: 'wcd.nic.in' },
  { id: 'bail', title: 'Bail Rights — Bailable vs Non-Bailable', category: 'Criminal Law', emoji: '⛓️', readTime: '8 min', difficulty: 'Intermediate', desc: 'Under BNSS 2023, bail is categorized as bailable (automatic right) and non-bailable (court discretion). Anticipatory bail prevents arrest.', keyPoints: ['Bailable offences: bail is a right', 'Anticipatory bail protects before arrest'], govLink: 'https://nalsa.gov.in', govSource: 'nalsa.gov.in' },
  { id: 'bnss', title: 'New Criminal Laws 2024 (BNS/BNSS/BSA)', category: 'Criminal Law', emoji: '📚', readTime: '12 min', difficulty: 'Advanced', desc: 'From July 1, 2024, three new criminal laws replaced IPC, CrPC, and the Indian Evidence Act.', keyPoints: ['IPC replaced by BNS', 'CrPC replaced by BNSS', 'Evidence Act replaced by BSA'], govLink: 'https://legislative.gov.in', govSource: 'legislative.gov.in' },
  { id: 'income-tax', title: 'Income Tax — Basics Every Citizen Must Know', category: 'Tax & Finance', emoji: '💼', readTime: '10 min', difficulty: 'Intermediate', desc: 'Under the Income Tax Act, 1961, individuals must file ITR annually if income exceeds the basic exemption limit.', keyPoints: ['File ITR at incometax.gov.in', 'New regime: 0% tax up to ₹3L'], govLink: 'https://incometax.gov.in', govSource: 'incometax.gov.in' },
  { id: 'gst', title: 'GST — Rights & Compliance for Consumers', category: 'Tax & Finance', emoji: '🧾', readTime: '7 min', difficulty: 'Intermediate', desc: 'Goods and Services Tax unifies India\'s indirect tax system. As a consumer, you have a right to a proper GST invoice.', keyPoints: ['Demand GST invoice for every purchase', 'File anti-profiteering complaint at naa.gov.in'], govLink: 'https://gst.gov.in', govSource: 'gst.gov.in' },
  { id: 'wills', title: 'Wills & Succession Laws in India', category: 'Family Law', emoji: '📝', readTime: '9 min', difficulty: 'Intermediate', desc: 'Every Indian above 18 can make a Will. Under the Indian Succession Act, a Will must be in writing and signed by two witnesses.', keyPoints: ['Will does not need to be on stamp paper', 'Registration optional but recommended'], govLink: 'https://legislative.gov.in', govSource: 'legislative.gov.in' },
  { id: 'grievance', title: 'Government Grievance Portals — File Complaints', category: 'Citizens Rights', emoji: '📢', readTime: '5 min', difficulty: 'Beginner', desc: 'India has a robust network of online grievance portals. CPGRAMS allows citizens to file complaints against any central government department.', keyPoints: ['CPGRAMS: pgportal.gov.in', 'Railway complaints: railmadad.indianrailways.gov.in'], govLink: 'https://pgportal.gov.in', govSource: 'pgportal.gov.in' },
  { id: 'passport', title: 'Passport & Visa — Rights & Procedures', category: 'Citizens Rights', emoji: '✈️', readTime: '6 min', difficulty: 'Beginner', desc: 'Every Indian citizen has the right to a passport. Under the Passports Act, 1967, the government can only refuse a passport on limited grounds.', keyPoints: ['Apply online at passportindia.gov.in', 'Normal passport: 30 days, Tatkal: 7 days'], govLink: 'https://passportindia.gov.in', govSource: 'passportindia.gov.in' },
  { id: 'disability', title: 'Rights of Persons with Disabilities', category: 'Citizens Rights', emoji: '♿', readTime: '7 min', difficulty: 'Beginner', desc: 'The Rights of Persons with Disabilities Act, 2016 recognizes 21 disabilities and guarantees rights to education, employment, accessibility.', keyPoints: ['4% reservation in government jobs for PwD', 'Free education up to 18 years for disabled children'], govLink: 'https://disabilityaffairs.gov.in', govSource: 'disabilityaffairs.gov.in' }
];

additionalArticles.forEach(a => {
  a.content = \`
    <div style="font-family: inherit;">
      <h2 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem;">Overview of \${a.title}</h2>
      <p style="margin-bottom: 1rem;">\${a.desc}</p>
      
      <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Key Provisions & Details</h3>
      <ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
        \${a.keyPoints.map(kp => \`<li>\${kp}</li>\`).join('')}
      </ul>

      <h3 style="color: #7B1D2E; margin-top: 1.5rem; margin-bottom: 0.8rem; font-size: 1.25rem;">Recent Amendments & Case Laws</h3>
      <div style="background-color: #FDF6EE; padding: 1rem; border-left: 4px solid #3B82F6; margin-bottom: 1rem;">
        <strong>📘 Note:</strong> The government constantly updates policies around \${a.category.toLowerCase()}. For the most recent circulars, amendments, and forms, always refer to the official portal at <a href="\${a.govLink}" target="_blank" style="color: #7B1D2E; text-decoration: underline;">\${a.govSource}</a>. 
        Recent landmark judgments by the Supreme Court of India continue to shape the interpretation of these rights to ensure wider protection for citizens.
      </div>
      
      <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;"><em>Disclaimer: This article provides general legal information and should not be construed as formal legal advice. For specific matters, consult a registered legal practitioner.</em></p>
    </div>
  \`;
  articles.push(a);
});

const fileContent = \`export const KNOWLEDGE_ARTICLES = \${JSON.stringify(articles, null, 2)};\n\`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'knowledgeHubData.js'), fileContent);
console.log('Successfully created knowledgeHubData.js');
