import Head from 'next/head'
import Link from 'next/link'
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
  }
]

const CATEGORIES = ['All', 'Consumer Rights', 'Criminal Rights', 'Tenant Rights', 'RTI', 'Family Law', 'Cyber Law', 'Labour Rights', 'Legal Process']

export default function Rights() {
  return (
    <div style={{ paddingTop:95, background:'var(--cream)', minHeight:'100vh' }}>
      <Head>
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
      </Head>

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
            <Link key={cat} href={cat==='All' ? '/rights' : `/knowledge-hub?category=${encodeURIComponent(cat)}`}
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
              <Link href={`/knowledge/${a.id}`} style={s.readMore}>Read Full Guide →</Link>
            </div>
          ))}
        </div>
      </div>

      <section style={{padding:'5rem 5vw', background:'var(--bur)', color:'#fff', textAlign:'center'}}>
        <div className="container">
          <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', marginBottom:'1rem'}}>Need Personalised Legal Advice?</h2>
          <p style={{color:'rgba(255,255,255,.8)', marginBottom:'2.5rem', fontSize:'1.05rem'}}>These guides provide general information. For your specific situation, speak to a verified lawyer.</p>
          <Link href="/search" className="btn btn-gold btn-xl">Find a Verified Lawyer →</Link>
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
