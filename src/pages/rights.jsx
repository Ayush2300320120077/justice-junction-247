import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Scale, Shield, Landmark, FileText, AlertCircle, Users, Smartphone } from 'lucide-react'

export const ARTICLES = [
  {
    id: 'consumer-complaint',
    title: 'How to File a Consumer Complaint in India',
    category: 'Consumer Rights',
    desc: 'Step-by-step guide to filing a complaint in Consumer Disputes Redressal Forums under the Consumer Protection Act 2019.',
    readTime: '6 min read',
    icon: <Shield size={24}/>,
    content: `The Consumer Protection Act 2019 is one of India's strongest consumer rights laws. If you've received defective goods or poor services, you have the right to file a complaint.

**Who can file?**
Any consumer who has purchased goods or services for personal use (not for resale/commercial purpose).

**Steps to File:**
1. First, send a legal notice to the business/seller giving 15-30 days to resolve.
2. If unresolved, file at the appropriate forum:
   - District Consumer Forum: Claims up to ₹1 crore
   - State Consumer Commission: ₹1 crore to ₹10 crore
   - National Consumer Commission: Above ₹10 crore

**Documents Required:**
- Bill/receipt of purchase
- Warranty card (if applicable)
- Copy of legal notice sent
- Evidence of defect (photos, videos, reports)

**Online Filing:** You can file at consumerhelpline.gov.in or visit the nearest Consumer Forum.

**Time Limit:** File within 2 years of the cause of complaint.

**Relief Available:** Replacement of goods, refund, compensation for mental agony, and litigation costs.`
  },
  {
    id: 'rights-if-arrested',
    title: 'What Are Your Rights If Arrested?',
    category: 'Criminal Rights',
    desc: 'Know your fundamental rights under the Constitution and CrPC if you are arrested or detained by the police.',
    readTime: '5 min read',
    icon: <AlertCircle size={24}/>,
    content: `Being arrested is frightening, but the Indian Constitution and CrPC protect your rights. Know them.

**Your Rights Under Article 22:**
1. **Right to be informed:** Police must immediately tell you why you are being arrested.
2. **Right to a lawyer:** You have the right to consult and be defended by a legal practitioner of your choice.
3. **Right to be presented before a magistrate:** Within 24 hours of arrest (excluding travel time).
4. **Right against self-incrimination:** You cannot be forced to confess (Article 20(3)).

**Additional Rights (D.K. Basu Guidelines):**
- Police must carry identification
- You must be given a memo of arrest
- A family member or friend must be notified
- You must be medically examined within 48 hours

**If You're a Woman:**
- Arrest can only be done by a female police officer
- Cannot be arrested after sunset and before sunrise (except with Magistrate's order)

**Bail Rights:**
- For bailable offences, bail is your right — police must grant it
- For non-bailable offences, apply to Magistrate or Sessions Court

**What NOT to do:** Do not resist arrest physically, do not sign any document without reading, do not confess without a lawyer present.`
  },
  {
    id: 'legal-notice',
    title: 'How to Send a Legal Notice Without a Lawyer',
    category: 'Legal Process',
    desc: 'Learn the format, process, and legal validity of sending a legal notice yourself before approaching courts.',
    readTime: '5 min read',
    icon: <FileText size={24}/>,
    content: `A legal notice is a formal written communication that signals your intent to take legal action. It often resolves disputes without going to court.

**When to Send a Legal Notice:**
- Before filing a consumer complaint
- For cheque bounce (mandatory under Section 138 NI Act — 30 day notice)
- Employment disputes (unpaid salary, wrongful termination)
- Property disputes, breach of contract
- Recovery of money

**Format of a Legal Notice:**
1. Date and place of sending
2. Full name and address of sender
3. Full name and address of recipient
4. Details of the grievance (facts only)
5. Relief/demand sought
6. Time given for response (usually 15-30 days)
7. Consequences if ignored
8. Signature

**How to Send:**
- Send by Registered Post with Acknowledgment Due (RPAD) — this creates legal evidence of delivery
- Keep a copy of the notice and the postal receipt

**Is a lawyer mandatory?**
No — for most notices you can write and send one yourself. However, for complex matters (cheque bounce, property), a lawyer's legal notice carries more weight.

**Use our free Document Generator** to create a legal notice template instantly.`
  },
  {
    id: 'tenant-rights',
    title: "Tenant Rights in India — What Your Landlord Cannot Do",
    category: 'Tenant Rights',
    desc: 'Understanding the Rent Control Act and what rights tenants have against landlord harassment, illegal eviction, and rent hikes.',
    readTime: '7 min read',
    icon: <Landmark size={24}/>,
    content: `India's Rent Control Acts (state-wise) and the Model Tenancy Act 2021 protect tenants from unfair practices.

**What Your Landlord CANNOT Do:**
1. **Cannot evict without notice:** Landlord must give proper notice (usually 15-30 days for month-to-month, more for longer leases).
2. **Cannot cut utilities:** Disconnecting electricity, water, or gas to force eviction is illegal.
3. **Cannot increase rent arbitrarily:** Rent increases must be as per the rent agreement or Rent Control Act.
4. **Cannot enter without notice:** Landlord must give advance notice (usually 24 hours) before entering.
5. **Cannot retain security deposit illegally:** Must return within 30 days of vacating (deducting only legitimate damages).

**Your Rights as a Tenant:**
- Right to a rent receipt for every payment
- Right to a copy of the rent agreement
- Right to peaceful possession during tenancy
- Right to sublet (if agreement permits)
- Right to fair repairs for habitability

**If Landlord Harasses You:**
1. Send a written complaint to the landlord
2. Approach Rent Control Court/Rent Authority
3. File an FIR for wrongful eviction or harassment
4. Under Model Tenancy Act 2021 — approach District Collector

**Important:** Always get a registered rent agreement. An unregistered agreement over 11 months has limited legal protection.`
  },
  {
    id: 'rti-guide',
    title: 'Right to Information (RTI) — Complete Filing Guide',
    category: 'RTI',
    desc: 'Learn how to file an RTI application, what information you can request, and how to appeal if denied.',
    readTime: '6 min read',
    icon: <BookOpen size={24}/>,
    content: `The RTI Act 2005 gives every Indian citizen the right to access information held by government bodies.

**What Can You Ask?**
- Government decisions, orders, policies
- Budget allocations and expenditure
- Status of your application/case
- Public records, licenses, permits
- Performance of public authorities

**What CANNOT be RTI'd?**
- Cabinet papers before decisions are public
- Information affecting national security
- Fiduciary (confidential commercial) information
- Personal information that has no public interest

**How to File an RTI Application:**
1. Identify the correct Public Information Officer (PIO) of the relevant department
2. Write application in English, Hindi, or official regional language
3. State the information you need clearly (be specific)
4. Pay fee: ₹10 (Central Govt) — free for BPL card holders
5. Send by post (registered), in person, or online at rtionline.gov.in

**Time Limits:**
- 30 days for normal response
- 48 hours if life/liberty is at stake
- 35 days if from Below Poverty Line applicant

**If Your RTI is Rejected:**
1. First Appeal: To Appellate Authority (within 30 days)
2. Second Appeal: To Central/State Information Commission (within 90 days)

**Penalties:** PIO can face ₹250/day penalty for delays, up to ₹25,000 maximum.`
  },
  {
    id: 'divorce-laws',
    title: 'Divorce Laws in India — Everything You Need to Know',
    category: 'Family Law',
    desc: 'Understanding mutual consent vs. contested divorce, alimony, child custody, and the legal process in India.',
    readTime: '8 min read',
    icon: <Scale size={24}/>,
    content: `Divorce in India is governed by personal laws based on religion, and the Special Marriage Act for others.

**Types of Divorce:**

**1. Mutual Consent Divorce**
Both spouses agree to separate. Under Hindu Marriage Act (Section 13B):
- File joint petition in Family Court
- 6-month "cooling off" period (may be waived by court)
- Second motion filed after the period
- Fastest and least expensive route: typically 6–18 months

**2. Contested Divorce**
One spouse files against the other on specific grounds:
- Adultery, Cruelty (physical or mental)
- Desertion for 2+ years
- Conversion to another religion
- Mental illness, leprosy, venereal disease
- Renunciation of the world (Sannyasa)
- Presumed dead for 7+ years

**Personal Laws:**
- Hindus: Hindu Marriage Act 1955
- Muslims: Muslim Personal Law (divorce through Talaq, Khula, Mubara'at)
- Christians: Indian Divorce Act 1869
- Parsis: Parsi Marriage and Divorce Act 1936
- Any religion: Special Marriage Act 1954

**Alimony (Maintenance):**
- Either spouse can claim maintenance during/after divorce
- Amount depends on income, assets, standard of living
- Section 125 CrPC provides maintenance to wives, children, parents

**Child Custody:**
Courts prioritize child's welfare above all. Types:
- Physical custody (with whom child lives)
- Legal custody (decision-making rights)
- Joint custody is increasingly common

**Property Division:**
India does not have community property laws. Courts consider contributions, standard of living, and welfare needs.`
  },
  {
    id: 'cyber-crime',
    title: 'Cyber Crime in India — How to Report and Protect Yourself',
    category: 'Cyber Law',
    desc: 'What to do if you are a victim of online fraud, harassment, or data theft. How to report cyber crimes in India.',
    readTime: '5 min read',
    icon: <Smartphone size={24}/>,
    content: `Cyber crime is governed by the Information Technology Act 2000 (IT Act) and Indian Penal Code.

**Common Cyber Crimes and Laws:**
- Online fraud / phishing: Section 66D IT Act (up to 3 years imprisonment)
- Identity theft: Section 66C IT Act
- Cyber stalking/harassment: Section 66A IT Act, Section 354D IPC
- Data breach: Section 43A IT Act
- Child pornography: Section 67B IT Act
- Hacking: Section 66 IT Act

**How to Report Cyber Crime:**
1. **Online:** cybercrime.gov.in (24/7, handles all cyber crimes)
2. **National Helpline:** Call 1930 (Cyber Crime Helpline)
3. **Local Police Station:** File an FIR under relevant sections
4. **Bank Fraud:** Call your bank immediately + report at 1930

**For Financial Fraud:**
- Call 1930 within the FIRST FEW HOURS to have the best chance of blocking/recovering funds
- File report at cybercrime.gov.in
- Visit nearest cyber cell

**Evidence to Preserve:**
- Screenshots of all conversations
- Transaction IDs, reference numbers
- Email headers (for phishing)
- URLs visited
- Device information

**Protecting Yourself:**
- Use 2-Factor Authentication
- Never share OTP, PIN, or banking passwords
- Check website URLs before entering payment details
- Report suspicious profiles/messages immediately`
  },
  {
    id: 'labour-rights',
    title: 'Labour Rights in India — What Every Employee Must Know',
    category: 'Labour Rights',
    desc: 'Your rights regarding minimum wage, working hours, termination, maternity leave, and how to file a complaint.',
    readTime: '6 min read',
    icon: <Users size={24}/>,
    content: `India has comprehensive labour laws protecting employees. Here are the key rights every worker should know.

**Working Hours & Overtime:**
- Maximum 8 hours/day, 48 hours/week (Factories Act)
- Overtime at double the regular rate
- Weekly holiday mandatory (Section 52 Factories Act)

**Minimum Wage:**
- Every state sets minimum wages — employer cannot pay below this
- Updated periodically; check your state's official notification
- Non-payment is a criminal offence

**Termination Rights:**
- Permanent employees cannot be terminated without notice or cause
- Notice period: as per contract (typically 30-90 days)
- Must receive gratuity if worked 5+ years (Payment of Gratuity Act)
- Wrongful termination: file complaint with Labour Commissioner

**Maternity Benefits (Maternity Benefit Act 2017):**
- 26 weeks paid maternity leave for first two children
- 12 weeks for third child
- Work from home option after leave (if role permits)
- Cannot be dismissed during/for maternity leave

**POSH — Sexual Harassment at Workplace:**
- Every company with 10+ employees must have an Internal Complaints Committee (ICC)
- File complaint with ICC or Local Complaints Committee
- Employer must take action within 60 days

**Filing a Labour Complaint:**
1. Approach Labour Commissioner of your district
2. File online at shramsuvidha.gov.in
3. For central PSUs: Central Industrial Relations Machinery (CIRM)

**Key Acts:** Factories Act 1948, Minimum Wages Act 1948, Industrial Disputes Act 1947, Employees' Provident Funds Act 1952, Code on Wages 2019`
  },
  {
    id: 'rti',
    title: 'Right to Information (RTI) — Complete Guide',
    category: 'Citizens Rights',
    desc: 'Learn how to file an RTI application, what information you can request, and how to appeal if your request is denied.',
    readTime: '7 min read',
    icon: null,
    content: `**What is RTI?**
The Right to Information Act 2005 is a landmark law that empowers every Indian citizen to access information held by public authorities. It promotes transparency, accountability, and good governance. Any citizen can request information from any government body, and the authority is obligated to respond within 30 days.

**Who Can File an RTI?**
Any Indian citizen can file an RTI application. You do not need to give a reason for requesting information. Non-citizens, corporations, and trusts cannot file RTI applications directly, but Indian citizens acting on their behalf can. There is no age restriction — even a minor can file through a guardian.

**How to File Step by Step**
1. Identify the correct Public Information Officer (PIO) of the relevant government department.
2. Write your application in English, Hindi, or the official language of your state.
3. Be specific about what information you need — vague requests are often rejected.
4. Pay the application fee: ₹10 for Central Government (by postal order, demand draft, or court fee stamp). BPL card holders are exempt.
5. Submit by registered post, in person at the government office, or online at rtionline.gov.in for central departments.

**What Information Can You Request?**
You can ask for copies of documents, inspection of records and works, certified samples of materials, and information in electronic form. This includes government decisions, expenditure details, file notings, project reports, tender documents, and public servant salary details.

**What If the PIO Refuses?**
If your RTI is denied or you receive no response within 30 days, you have the right to appeal. First Appeal goes to the Appellate Authority within the same department (within 30 days of denial). Second Appeal goes to the Central or State Information Commission (within 90 days). The PIO can face a penalty of ₹250 per day of delay, up to ₹25,000.

**RTI for State vs Central Government**
For central government bodies, file at rtionline.gov.in or send to the relevant ministry in New Delhi. For state government bodies, check your state's RTI portal or send to the district-level PIO. The fee structure and language may vary by state.

**Common RTI Mistakes to Avoid**
Do not ask multiple unrelated questions in one application. Do not ask for "opinions" — RTI only covers factual information. Always keep a copy of your application and postal receipt. Do not send RTI to the wrong department — identify the correct PIO first.`
  },
  {
    id: 'fir',
    title: 'How to File an FIR — Complete Guide',
    category: 'Criminal Law',
    desc: 'Step-by-step guide on filing a First Information Report at a police station and your rights during the process.',
    readTime: '6 min read',
    icon: null,
    content: `**What is an FIR?**
A First Information Report (FIR) is a written document prepared by the police when they receive information about a cognizable offence. It is the first step in the criminal justice process and sets the law in motion. Filing an FIR is free of cost and is your legal right under Section 154 of the Code of Criminal Procedure (CrPC).

**When Should You File an FIR?**
You should file an FIR immediately when a cognizable offence has been committed — these include theft, robbery, assault, murder, kidnapping, fraud, domestic violence, and sexual offences. For non-cognizable offences (minor disputes, defamation), the police register an NCR (Non-Cognizable Report) instead.

**Step-by-Step at the Police Station**
1. Visit the nearest police station — you can file at any station regardless of jurisdiction.
2. Provide your details and narrate the incident clearly to the duty officer.
3. The officer will write down your statement in the FIR register.
4. Read the FIR carefully before signing — ensure all facts are accurately recorded.
5. Collect a free copy of the FIR — this is your legal right under Section 154(2) CrPC.

**What If Police Refuse to File?**
If the police refuse to register your FIR, you have several options: Send a written complaint to the Superintendent of Police (SP) of the district. File a complaint before the Judicial Magistrate under Section 156(3) CrPC. File an online FIR through your state's police portal. Contact the State Human Rights Commission.

**Zero FIR Explained**
A Zero FIR can be filed at any police station in India, regardless of where the crime occurred. The FIR is later transferred to the police station that has jurisdiction. This is especially important for emergencies — do not waste time finding the "correct" police station.

**After FIR is Filed**
The police must begin investigation immediately for cognizable offences. You will receive a copy of the FIR with a unique FIR number. You can track the investigation status. The police must file a charge sheet within 60-90 days, or the accused may get default bail.

**Your Rights During This Process**
You have the right to file an FIR in your own language. Women complainants can record statements at their residence. You cannot be forced to visit the police station at night. You have the right to a lawyer at every stage. The police cannot refuse to register a cognizable offence.`
  },
  {
    id: 'consumer',
    title: 'Consumer Protection Rights in India',
    category: 'Civil Rights',
    desc: 'Your complete guide to consumer rights, unfair trade practices, and how to file complaints under the Consumer Protection Act 2019.',
    readTime: '8 min read',
    icon: null,
    content: `**Consumer Protection Act 2019 Overview**
The Consumer Protection Act 2019 replaced the older 1986 Act and significantly strengthened consumer rights in India. It covers all goods and services including e-commerce, introduces product liability, and establishes the Central Consumer Protection Authority (CCPA). The Act applies to all transactions whether online or offline.

**Your Rights as a Consumer**
Every Indian consumer has six fundamental rights: Right to Safety (protection against hazardous goods), Right to Information (full disclosure about products), Right to Choose (access to variety at competitive prices), Right to be Heard (representation in consumer forums), Right to Redressal (fair settlement of disputes), and Right to Consumer Education.

**What is Unfair Trade Practice?**
Unfair trade practices include false advertising, misleading claims about product quality, selling defective goods, charging hidden fees, refusing refunds on defective products, and not honouring warranties. Under the 2019 Act, even misleading online advertisements and fake reviews are actionable offences.

**How to Approach Consumer Forum**
Step 1: Send a legal notice to the seller/company giving 15-30 days to resolve. Step 2: If unresolved, file a complaint at the appropriate forum — District Commission (claims up to ₹1 crore), State Commission (₹1 crore to ₹10 crore), or National Commission (above ₹10 crore). Step 3: You can file online at edaakhil.nic.in. Filing fees range from ₹200 to ₹5,000 depending on claim value.

**RERA for Real Estate Buyers**
The Real Estate Regulatory Authority (RERA) protects homebuyers against builder fraud. Every project must be RERA-registered. Builders cannot change plans without buyer consent. Delayed possession entitles you to interest compensation. File complaints at your state RERA portal.

**E-Commerce Consumer Rights**
Under the 2019 Act, e-commerce platforms must display seller details, return/refund policies, and grievance officer contact. You have the right to return defective products within the stated period. Platforms cannot manipulate prices or engage in unfair trade practices. The CCPA can order product recalls for unsafe goods.

**Compensation You Can Claim**
Consumer forums can award refund of amount paid, replacement of defective product, compensation for mental agony and harassment, litigation costs, and punitive damages for negligence. There is no upper limit on compensation — courts decide based on the severity of the case.`
  },
  {
    id: 'divorce',
    title: 'Divorce Laws in India — Complete Guide',
    category: 'Family Law',
    desc: 'Understanding mutual consent vs contested divorce, alimony, child custody, and the legal process across religions.',
    readTime: '9 min read',
    icon: null,
    content: `**Types of Divorce**
Indian law recognizes two primary types of divorce: Mutual Consent Divorce (both parties agree to separate amicably) and Contested Divorce (one party files against the other on specific legal grounds). Mutual consent is faster, less expensive, and less emotionally draining. Contested divorces can take 2-5 years.

**Hindu Marriage Act**
For Hindus, Buddhists, Jains, and Sikhs, divorce is governed by the Hindu Marriage Act 1955. Mutual consent divorce requires both parties to live separately for at least one year. The court grants a 6-month cooling-off period after filing (which may be waived). Contested divorce can be filed on grounds of adultery, cruelty, desertion (2+ years), conversion, mental disorder, communicable disease, or renunciation.

**Grounds for Divorce**
Common grounds across all personal laws include: Adultery, Cruelty (physical or mental), Desertion for a continuous period of two years, Conversion to another religion, Unsoundness of mind, Communicable disease, and Presumption of death (missing for 7+ years). Additional grounds for women include husband's rape/sodomy/bestiality conviction.

**Alimony and Maintenance Rights**
Either spouse can claim maintenance during and after divorce proceedings. Interim maintenance (pendente lite) is granted during the case. Permanent alimony is decided based on income, earning capacity, standard of living, duration of marriage, and assets. Under Section 125 CrPC, wives, children, and elderly parents can claim maintenance regardless of religion.

**Child Custody Law**
Indian courts prioritize the welfare of the child above all else. Children below 5 years are generally given to the mother (tender years doctrine). Both parents can seek physical custody, legal custody, or joint custody. The non-custodial parent typically gets visitation rights. Courts consider the child's wishes if they are old enough to form an opinion.

**How Long Does It Take?**
Mutual consent divorce: 6-18 months. Contested divorce: 2-5 years depending on complexity. If both parties cooperate and the court waives the cooling period, mutual consent can be completed in as little as 6 months. Mediation is increasingly encouraged to speed up proceedings.

**Documents Needed**
Marriage certificate, address proof of both parties, evidence of marriage (photos, invitation cards), income proof and asset declarations, evidence supporting grounds for divorce (if contested), and details of children (birth certificates, school records). For mutual consent, a joint petition signed by both parties is required.`
  },
  {
    id: 'arrest',
    title: 'Your Rights During Arrest',
    category: 'Citizens Rights',
    desc: 'Know your constitutional rights under Article 22 and CrPC if you are arrested or detained by police.',
    readTime: '6 min read',
    icon: null,
    content: `**Your Constitutional Rights (Article 22)**
The Indian Constitution provides fundamental protections during arrest. Article 22(1) guarantees the right to be informed of the grounds of arrest. Article 22(1) also guarantees the right to consult and be defended by a legal practitioner of your choice. Article 22(2) requires that the arrested person be produced before a magistrate within 24 hours (excluding travel time). Article 20(3) protects against self-incrimination — you cannot be compelled to be a witness against yourself.

**Right to Know Reason for Arrest**
The police must immediately inform you why you are being arrested. They must show the arrest warrant if it is a warrant-based arrest. For warrantless arrests (cognizable offences), they must still explain the offence. The arrest memo must be prepared at the time of arrest, containing the time, date, and place of arrest.

**Right to a Lawyer Immediately**
You have the right to contact and consult a lawyer from the moment of arrest. If you cannot afford a lawyer, the state must provide free legal aid under Article 39A and the Legal Services Authorities Act. You can contact the nearest District Legal Services Authority (DLSA) for a free lawyer. No interrogation should happen without giving you the opportunity to consult a lawyer.

**Right Against Self-Incrimination**
Under Article 20(3), you cannot be forced to make any statement that may be used against you. You have the right to remain silent during interrogation. Any confession made to police is not admissible in court (Section 25 Indian Evidence Act). Only confessions made before a Judicial Magistrate are admissible.

**What Police Cannot Do**
Police cannot use torture, threats, or inducements to extract confessions. They cannot detain you beyond 24 hours without producing you before a magistrate. They cannot deny you food, water, or medical attention. They cannot arrest you at night (between sunset and sunrise) except in exceptional circumstances. They cannot handcuff you without a court order (Supreme Court guidelines).

**Bail Rights**
For bailable offences, bail is a right — the police must grant it. For non-bailable offences, you must apply to the Magistrate or Sessions Court. Default bail (Section 167(2) CrPC) applies if the police fail to file a charge sheet within 60 days (for offences up to 10 years) or 90 days (for more serious offences). Anticipatory bail can be sought before arrest if you apprehend arrest.

**Women's Special Protections**
Women cannot be arrested after sunset and before sunrise except by a female police officer with a written order from a Judicial Magistrate. A female accused must be searched only by a female officer. Pregnant women and mothers of children under 7 can apply for bail more easily. The arrest of a woman must be intimated to her family immediately.`
  },
  {
    id: 'tenant',
    title: 'Tenant and Landlord Rights in India',
    category: 'Property Law',
    desc: 'Understanding Rent Control Acts, tenant protections, landlord rights, and what to include in your rent agreement.',
    readTime: '7 min read',
    icon: null,
    content: `**Rent Control Acts in India**
Each Indian state has its own Rent Control Act governing the landlord-tenant relationship. The central Model Tenancy Act 2021 was introduced to modernize these laws but adoption varies by state. These laws regulate rent increases, eviction procedures, and maintenance responsibilities. They generally favor tenants by restricting arbitrary eviction and excessive rent hikes.

**Tenant Rights You Must Know**
As a tenant, you have the right to peaceful possession of the rented property during the tenancy period. You have the right to essential services — the landlord cannot cut electricity, water, or gas to force eviction. You have the right to a rent receipt for every payment made. You have the right to reasonable notice before eviction (typically 1-3 months). You have the right to get your security deposit back (minus legitimate deductions) within 1-3 months of vacating.

**Landlord Rights**
Landlords have the right to receive rent on time as per the agreement. They can increase rent as per the terms of the agreement or applicable Rent Control Act provisions. They can evict tenants for non-payment of rent, subletting without permission, misuse of property, or bona fide personal need (with court approval). They can inspect the property with reasonable notice (usually 24 hours).

**Rent Agreement Essentials**
A proper rent agreement must include: names and addresses of both parties, property description and address, monthly rent amount and due date, security deposit amount and refund terms, lease duration and renewal terms, maintenance responsibilities, notice period for termination, and restrictions (pets, subletting, modifications). Always get the agreement registered if the term exceeds 11 months.

**When Can Landlord Evict?**
A landlord can seek eviction through court for: non-payment of rent for a specified period, subletting without permission, causing damage to the property, using the property for illegal purposes, or bona fide personal need. The landlord cannot forcibly evict you — they must obtain a court order. Self-help eviction (changing locks, removing belongings) is illegal.

**Security Deposit Rules**
The Model Tenancy Act caps security deposits at 2 months' rent for residential and 6 months for commercial properties. The deposit must be returned within 1-3 months of vacating. Deductions can only be made for unpaid rent, unpaid utility bills, and damage beyond normal wear and tear. The landlord must provide an itemized list of any deductions made.

**RERA Protections for Buyers**
If you are buying property, RERA (Real Estate Regulatory Authority) protects you. All projects above 500 sq meters must be RERA-registered. Builders must deposit 70% of buyer funds in a separate escrow account. Delayed possession entitles buyers to interest at SBI lending rate + 2%. Structural defects must be fixed free for 5 years after possession.`
  },
  {
    id: 'cyber',
    title: 'Cyber Crime Protection in India',
    category: 'Digital Law',
    desc: 'Types of cyber crime, how to report online fraud, and your data privacy rights under Indian law.',
    readTime: '7 min read',
    icon: null,
    content: `**Types of Cyber Crime in India**
Common cyber crimes include phishing (fake emails/websites to steal credentials), identity theft (misusing someone's personal information), online financial fraud (UPI fraud, card cloning, fake payment links), cyberstalking and harassment, ransomware attacks, social media impersonation, and data breaches. India saw over 65,000 cyber crime cases in 2023, with financial fraud being the most common.

**IT Act 2000 Key Sections**
Section 66 — Computer hacking (up to 3 years imprisonment). Section 66C — Identity theft (up to 3 years). Section 66D — Cheating by personation using computer (up to 3 years). Section 67 — Publishing obscene material online (up to 5 years). Section 67B — Child pornography (up to 7 years). Section 72 — Breach of confidentiality and privacy. Section 43A — Corporate liability for data breaches.

**How to Report Online Fraud**
Step 1: Call the national cyber crime helpline 1930 immediately — especially for financial fraud, as quick reporting increases chances of fund recovery. Step 2: File a complaint at cybercrime.gov.in — India's official cyber crime reporting portal, available 24/7. Step 3: Visit your nearest police station or dedicated cyber cell to file an FIR. Step 4: For banking fraud, also contact your bank's fraud department immediately to block transactions.

**National Cyber Crime Portal (cybercrime.gov.in)**
This is the government's centralized platform for reporting all types of cyber crime. You can report anonymously for crimes against women and children. You need to provide your details, incident description, and any evidence. You will receive a complaint number to track the status. The portal routes your complaint to the relevant state cyber cell for investigation.

**Banking Fraud — What to Do**
If you are a victim of banking fraud: Call 1930 within the first few hours — RBI guidelines mandate banks to reverse unauthorized transactions reported within 3 working days. Block your card/UPI immediately through your banking app. File a complaint at cybercrime.gov.in. Visit your bank branch with a written complaint. File an FIR at the nearest police station. Under RBI's zero-liability policy, you may be fully refunded if you report within 3 days.

**Social Media Harassment**
If you face harassment, threats, or stalking on social media: Take screenshots of all offensive content as evidence. Report the content/profile to the platform. File a complaint at cybercrime.gov.in under the "women/child related" category if applicable. File an FIR under Sections 354D IPC (stalking), 509 IPC (word/gesture to insult modesty), or relevant IT Act sections.

**Data Privacy Rights**
The Digital Personal Data Protection Act 2023 (DPDP Act) gives you the right to know what personal data is collected about you, the right to correction and erasure of your data, the right to nominate someone to exercise your rights, and the right to grievance redressal. Companies must obtain explicit consent before collecting your data and cannot process children's data without parental consent.`
  },
  {
    id: 'wills',
    title: 'Wills and Inheritance Laws in India',
    category: 'Family Law',
    desc: 'How to draft a legally valid Will, succession laws across religions, and the process of Will registration.',
    readTime: '8 min read',
    icon: null,
    content: `**What is a Will?**
A Will (or Testament) is a legal document that declares how a person's property and assets should be distributed after their death. In India, Wills are governed by the Indian Succession Act 1925 for most communities, while Muslims follow their personal law. A Will ensures your wishes are honoured and prevents family disputes over inheritance.

**Who Can Make a Will?**
Any person who is of sound mind and is at least 18 years of age can make a Will. The testator (person making the Will) must not be under coercion, undue influence, or fraud. A person of unsound mind can make a Will during a period of lucidity. Married women can make Wills for their self-acquired property (Stridhan).

**How to Draft a Legally Valid Will**
A valid Will in India must be: written (typed or handwritten), signed by the testator at the bottom of every page, attested by at least two witnesses who must also sign in the testator's presence, clearly identify the testator with full name, address, and age. The Will should clearly describe all properties and their intended beneficiaries. Name an executor who will carry out the Will's instructions. Include a revocation clause cancelling all previous Wills.

**Succession Without a Will (Intestate)**
If a person dies without a Will, their property is distributed according to applicable succession laws. For Hindus: the Hindu Succession Act 1956 governs inheritance. Class I heirs (spouse, children, mother) get equal shares. For Muslims: Sharia law applies — sons get double the share of daughters, spouse gets a fixed fraction. For Christians and Parsis: the Indian Succession Act 1925 applies.

**Hindu Succession Act**
Under the Hindu Succession Act 1956 (amended 2005), daughters have equal coparcenary rights in ancestral property. Self-acquired property goes to Class I heirs equally: spouse, sons, daughters, and mother. If no Class I heirs exist, it passes to Class II heirs (father, siblings, etc.). A Hindu can Will away their self-acquired property to anyone, but ancestral property can only be Willed to the extent of their undivided share.

**Muslim Personal Law**
Under Islamic law, a Muslim can only Will away one-third of their total property. The remaining two-thirds is distributed according to fixed Sharia shares. Sons receive double the share of daughters. The spouse receives a fixed fraction (1/4 or 1/8 depending on whether there are children). A Will (Wasiyat) exceeding one-third requires consent of legal heirs.

**How to Register a Will**
While registration is not mandatory for a Will to be valid, it adds legal weight and reduces chances of dispute. To register: Visit the Sub-Registrar's office with the original Will, two witnesses, and ID proof. Pay the nominal registration fee. The Will is stored in the Sub-Registrar's records. A registered Will is presumed genuine unless proven otherwise. You can also store your Will in a bank locker or with a trusted lawyer.`
  }
]

const CATEGORIES = ['All', 'Consumer Rights', 'Criminal Rights', 'Tenant Rights', 'RTI', 'Family Law', 'Cyber Law', 'Labour Rights', 'Legal Process']

export default function Rights() {
  return (
    <div style={{ paddingTop:95, background:'var(--cream)', minHeight:'100vh' }}>
      <Helmet>
        <title>Know Your Rights — Legal Guides for Indians — Justice Junction 24/7</title>
        <meta name="description" content="Free legal guides on Consumer Rights, Tenant Rights, Criminal Rights, RTI, Family Law, Cyber Law and Labour Rights for Indian citizens." />
        <meta property="og:title" content="Know Your Rights — Justice Junction 24/7" />
        <meta property="og:description" content="Free legal guides for every Indian citizen. Know your rights before you take the next step." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/rights" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Know Your Rights — Justice Junction 24/7" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Helmet>

      <section style={s.hero}>
        <div className="container" style={{textAlign:'center', position:'relative', zIndex:2}}>
          <div className="sec-label" style={{justifyContent:'center', color:'rgba(255,255,255,.7)'}}>Legal Literacy</div>
          <h1 style={s.h1}>Know Your Rights.</h1>
          <p style={s.heroSub}>Free, accurate legal guides for every Indian citizen. Understand the law before you need a lawyer.</p>
        </div>
        <div style={s.heroBg}/>
      </section>

      <div className="container" style={{padding:'4rem 5vw'}}>
        <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'3rem'}}>
          {CATEGORIES.map(cat => (
            <Link key={cat} href={cat==='All' ? '/knowledge-hub' : `/knowledge-hub?category=${encodeURIComponent(cat)}`}
              style={{...s.catChip, ...(cat==='All'?s.catActive:{})}}>
              {cat}
            </Link>
          ))}
        </div>

        <div style={s.grid}>
          {ARTICLES.map(a => (
            <div key={a.id} style={s.card} className="card-hover">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.2rem'}}>
                <div style={s.iconBox}>{a.icon}</div>
                <span style={s.readTime}>{a.readTime}</span>
              </div>
              <span style={s.category}>{a.category}</span>
              <h3 style={s.cardTitle}>{a.title}</h3>
              <p style={s.cardDesc}>{a.desc}</p>
              <Link to={`/knowledge/${a.id}`} style={s.readMore}>Read Full Guide →</Link>
            </div>
          ))}
        </div>
      </div>

      <section style={{padding:'5rem 5vw', background:'var(--bur)', color:'#fff', textAlign:'center'}}>
        <div className="container">
          <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', marginBottom:'1rem'}}>Need Personalised Legal Advice?</h2>
          <p style={{color:'rgba(255,255,255,.8)', marginBottom:'2.5rem', fontSize:'1.05rem'}}>These guides provide general information. For your specific situation, speak to a verified lawyer.</p>
          <Link to="/search" className="btn btn-gold btn-xl">Find a Verified Lawyer →</Link>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding:'6rem 0', position:'relative', overflow:'hidden', color:'#fff', background:'var(--bur)' },
  heroBg: { position:'absolute', inset:0, background:`linear-gradient(rgba(123,29,46,0.92),rgba(123,29,46,0.97)),url('/justice-bg.png')`, backgroundSize:'cover', zIndex:1 },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.5rem,5vw,3.8rem)', fontWeight:800, marginBottom:'1.2rem' },
  heroSub: { fontSize:'1.1rem', color:'rgba(255,255,255,.85)', maxWidth:600, margin:'0 auto' },
  catChip: { padding:'.5rem 1.1rem', borderRadius:'50px', background:'#fff', border:'1.5px solid var(--border)', fontSize:'.82rem', fontWeight:700, color:'var(--txt-2)', textDecoration:'none', transition:'all .2s' },
  catActive: { background:'var(--bur)', color:'#fff', borderColor:'var(--bur)' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.5rem' },
  card: { background:'#fff', padding:'2rem', borderRadius:'20px', border:'1px solid var(--border)', display:'flex', flexDirection:'column' },
  iconBox: { width:48, height:48, borderRadius:'13px', background:'var(--cream-2)', color:'var(--bur)', display:'flex', alignItems:'center', justifyContent:'center' },
  readTime: { fontSize:'.72rem', fontWeight:700, color:'var(--txt-3)', background:'var(--cream-2)', padding:'.3rem .7rem', borderRadius:'50px' },
  category: { fontSize:'.68rem', fontWeight:800, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.1em', display:'block', marginBottom:8 },
  cardTitle: { fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:800, marginBottom:10, lineHeight:1.3 },
  cardDesc: { fontSize:'.88rem', color:'var(--txt-2)', lineHeight:1.6, flex:1, marginBottom:'1.5rem' },
  readMore: { fontSize:'.88rem', fontWeight:700, color:'var(--bur)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4 },
}
