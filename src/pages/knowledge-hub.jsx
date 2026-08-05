import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import {
  BookOpen, Scale, Shield, Landmark, Search, ChevronRight, FileText,
  AlertCircle, SearchX, Users, Briefcase, Globe, Home, CreditCard,
  Phone, ExternalLink, TrendingUp, Clock, Star, ArrowRight
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

const ARTICLES = [
  // Citizens Rights
  {
    id: 'rti', title: 'Right to Information (RTI) Act, 2005', category: 'Citizens Rights',
    emoji: '📋', readTime: '8 min', difficulty: 'Beginner',
    desc: 'The RTI Act empowers every Indian citizen to request information from any public authority. You can ask for documents, records, memos, emails, opinions, data, and samples held by the government.',
    keyPoints: ['File RTI online at rtionline.gov.in', 'Pay ₹10 application fee (BPL card holders exempt)', 'Response within 30 days (48 hrs for life/liberty matters)', "First Appeal to PIO's superior within 30 days", 'Second Appeal to CIC/SIC within 90 days'],
    govLink: 'https://rtionline.gov.in', govSource: 'rtionline.gov.in'
  },
  {
    id: 'fir', title: 'How to File an FIR in India', category: 'Criminal Law',
    emoji: '🚨', readTime: '6 min', difficulty: 'Beginner',
    desc: 'A First Information Report (FIR) is the first step in the criminal justice process. Under Section 154 CrPC, any person can report a cognizable offence to the police. The police cannot refuse to register an FIR.',
    keyPoints: ['Police CANNOT refuse to register FIR for cognizable offences', 'File e-FIR online on state police portals', 'Free copy of FIR is your right', 'If refused, complain to Superintendent of Police', 'Zero FIR can be filed at any police station'],
    govLink: 'https://www.mha.gov.in', govSource: 'mha.gov.in'
  },
  {
    id: 'arrest', title: 'Your Rights During Arrest', category: 'Citizens Rights',
    emoji: '⚖️', readTime: '7 min', difficulty: 'Beginner',
    desc: 'Article 22 of the Indian Constitution and the CrPC protect citizens during arrest. You have the right to know the reason for arrest, to be produced before a magistrate within 24 hours, and to legal representation.',
    keyPoints: ['Right to know grounds of arrest (Art. 22)', 'Produced before magistrate within 24 hours', 'Right to inform a friend/relative of arrest', 'Right to consult a lawyer of your choice', 'Women can only be arrested by female officers (sunset to sunrise exempt)'],
    govLink: 'https://nalsa.gov.in', govSource: 'nalsa.gov.in'
  },
  {
    id: 'legal-aid', title: 'Free Legal Aid — Who Qualifies?', category: 'Citizens Rights',
    emoji: '🏛️', readTime: '5 min', difficulty: 'Beginner',
    desc: 'NALSA (National Legal Services Authority) provides free legal services to eligible citizens. Under Section 12 of the Legal Services Authorities Act, 1987, you are entitled to free legal representation.',
    keyPoints: ['Women & children are eligible (regardless of income)', 'SC/ST members entitled to free legal aid', 'Persons with income below ₹1 lakh p.a.', 'Victims of disaster, violence, industrial accident', 'Call NALSA Helpline: 15100 (toll-free)'],
    govLink: 'https://nalsa.gov.in', govSource: 'nalsa.gov.in'
  },
  // Family Law
  {
    id: 'divorce', title: 'Divorce Laws in India — Complete Guide', category: 'Family Law',
    emoji: '👨‍👩‍👧', readTime: '12 min', difficulty: 'Intermediate',
    desc: 'India has multiple divorce laws based on religion. The Hindu Marriage Act 1955, Special Marriage Act 1954, Muslim Personal Law, and Indian Divorce Act 1869 govern divorces for different communities.',
    keyPoints: ['Mutual consent divorce under Sec. 13B HMA — 6 month waiting period', 'Contested divorce grounds: cruelty, adultery, desertion (2+ yrs)', 'Alimony under Section 125 CrPC for all religions', 'Child custody — best interest of child is paramount', 'Divorce can now be filed online in some High Courts'],
    govLink: 'https://legislative.gov.in/acts/hindu-marriage-act-1955', govSource: 'legislative.gov.in'
  },
  {
    id: 'domestic-violence', title: 'Protection from Domestic Violence', category: 'Family Law',
    emoji: '🛡️', readTime: '8 min', difficulty: 'Beginner',
    desc: 'The Protection of Women from Domestic Violence Act, 2005 provides civil remedies and protection orders for women facing domestic abuse — physical, sexual, verbal, emotional, or economic.',
    keyPoints: ['File complaint with Protection Officer or directly in Magistrate Court', 'Get Protection, Residence & Monetary Relief Orders', 'Emergency support: call 181 (Women Helpline)', 'Right to reside in shared household', 'Magistrate must hear matter within 3 days of application'],
    govLink: 'https://wcd.nic.in/act/protection-women-domestic-violence-act-2005', govSource: 'wcd.nic.in'
  },
  {
    id: 'maintenance', title: 'Maintenance & Alimony Rights', category: 'Family Law',
    emoji: '💰', readTime: '7 min', difficulty: 'Intermediate',
    desc: 'Under Section 125 CrPC, any person with sufficient means who neglects to maintain their wife, children, or parents can be ordered to pay monthly maintenance by a Magistrate.',
    keyPoints: ['Wife, minor children & parents can claim maintenance', 'Interim maintenance can be granted within 60 days', 'Quantum decided by courts based on income & lifestyle', 'Hindu women can also claim under HMA Section 24/25', 'Muslim women: covered under Muslim Women (Protection) Act 2019'],
    govLink: 'https://legislative.gov.in', govSource: 'legislative.gov.in'
  },
  // Property Law
  {
    id: 'tenant', title: 'Tenant & Landlord Rights in India', category: 'Property Law',
    emoji: '🏠', readTime: '10 min', difficulty: 'Intermediate',
    desc: 'Rent agreements are governed by state Rent Control Acts and the Model Tenancy Act 2021. Both landlords and tenants have enforceable legal rights that must be respected.',
    keyPoints: ['Rent agreement must be registered if tenure > 11 months', 'Security deposit capped at 2 months rent (Model Tenancy Act)', 'Landlord cannot cut electricity/water to evict', 'Notice period: typically 1-3 months depending on state', 'Dispute resolution via Rent Authority within 60 days'],
    govLink: 'https://mohua.gov.in/cms/model-tenancy-act.php', govSource: 'mohua.gov.in'
  },
  {
    id: 'property-registration', title: 'Property Registration & Stamp Duty', category: 'Property Law',
    emoji: '📜', readTime: '9 min', difficulty: 'Intermediate',
    desc: 'Under the Registration Act, 1908 and Transfer of Property Act, 1882, immovable property transactions above ₹100 must be registered. Stamp duty is a state subject and varies from 3–7% of property value.',
    keyPoints: ['Register sale deed at Sub-Registrar\'s office within 4 months of execution', 'Stamp duty: 3-7% (varies by state, lower for women buyers)', 'Required docs: Sale deed, ID proof, NOC, mutation certificate', 'RERA protects homebuyers from builder delays', 'Check encumbrance via state land records portal'],
    govLink: 'https://rera.maharashtra.gov.in', govSource: 'rera.gov.in'
  },
  // Consumer Rights
  {
    id: 'consumer', title: 'Consumer Protection Rights', category: 'Consumer Rights',
    emoji: '🛒', readTime: '8 min', difficulty: 'Beginner',
    desc: 'The Consumer Protection Act, 2019 strengthens consumer rights with e-commerce coverage, product liability, and a Central Consumer Protection Authority (CCPA). You can file complaints online at edaakhil.nic.in.',
    keyPoints: ['File complaint online at edaakhil.nic.in (no lawyer needed)', 'District Forum: claims up to ₹50 lakh', 'State Commission: ₹50 lakh to ₹2 crore', 'National Commission: above ₹2 crore', 'Product liability now covers manufacturers & sellers'],
    govLink: 'https://edaakhil.nic.in', govSource: 'edaakhil.nic.in'
  },
  {
    id: 'ecommerce-rights', title: 'Your Rights While Shopping Online', category: 'Consumer Rights',
    emoji: '📦', readTime: '6 min', difficulty: 'Beginner',
    desc: 'The Consumer Protection (E-Commerce) Rules 2020 mandate that platforms clearly display seller info, prices, return policies, and grievance officer contacts. You have a right to a no-questions-asked return window.',
    keyPoints: ['E-commerce platforms must display all-inclusive prices', 'Right to return or exchange — check platform policy', 'Grievance Officer must be appointed by every platform', 'File complaint at consumerhelpline.gov.in (1915)', 'Payment fraud: file complaint at cybercrime.gov.in'],
    govLink: 'https://consumerhelpline.gov.in', govSource: 'consumerhelpline.gov.in'
  },
  // Cyber & Digital Law
  {
    id: 'cyber', title: 'Cyber Crime — How to Report & Recover', category: 'Digital Law',
    emoji: '💻', readTime: '9 min', difficulty: 'Beginner',
    desc: 'The IT Act 2000 (amended 2008) and BNS 2023 deal with cyber offences. India\'s National Cyber Crime Reporting Portal at cybercrime.gov.in allows you to report online fraud, harassment, and hacking 24/7.',
    keyPoints: ['Report financial fraud at cybercrime.gov.in within 24 hours', 'Call 1930 (Cyber Crime Helpline) to freeze fraudulent transaction', 'Report CSAM/online harassment: cybercrime.gov.in', 'Section 66C IT Act: identity theft — 3 yrs imprisonment + fine', 'File complaint with local cyber cell for faster action'],
    govLink: 'https://cybercrime.gov.in', govSource: 'cybercrime.gov.in'
  },
  {
    id: 'upi-fraud', title: 'UPI / Banking Fraud — Recovery Steps', category: 'Digital Law',
    emoji: '📱', readTime: '7 min', difficulty: 'Beginner',
    desc: 'With UPI fraud on the rise, knowing the recovery process is critical. You must act within the first 24 hours to maximize chances of fund recovery. RBI\'s ombudsman scheme provides another layer of protection.',
    keyPoints: ['Call 1930 immediately — freeze account within minutes', 'Block UPI at NPCI: dispute.npci.org.in', 'Chargeback request within 30 days for bank debit', 'File RBI Ombudsman complaint at cms.rbi.org.in', 'Keep all transaction screenshots as evidence'],
    govLink: 'https://cybercrime.gov.in', govSource: 'cybercrime.gov.in'
  },
  // Labour Law
  {
    id: 'labour', title: 'Employee Rights at the Workplace', category: 'Labour Law',
    emoji: '👷', readTime: '10 min', difficulty: 'Intermediate',
    desc: 'India\'s Four Labour Codes (Wages, IR, Social Security, Occupational Safety) consolidate 44 central labour laws. Employees have legally enforceable rights regarding wages, hours, PF, gratuity, and termination.',
    keyPoints: ['Minimum wage varies by state — check at labour.gov.in', 'PF deduction mandatory for salary ≤ ₹15,000 (EPFO)', 'Gratuity after 5 years continuous service', 'Maximum 48 hrs/week work (with OT compensation)', 'File wage complaint at shramsuvidha.gov.in'],
    govLink: 'https://labour.gov.in', govSource: 'labour.gov.in'
  },
  {
    id: 'posh', title: 'Sexual Harassment at Workplace (POSH)', category: 'Labour Law',
    emoji: '🤝', readTime: '8 min', difficulty: 'Intermediate',
    desc: 'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 mandates every employer with 10+ employees to form an Internal Complaints Committee (ICC).',
    keyPoints: ['File complaint with ICC within 3 months of incident', 'Inquiry must be completed in 90 days', 'Anonymous complaints accepted by some organizations', 'If no ICC: file with Local Complaints Committee at district level', 'Employer can face ₹50,000 fine for POSH non-compliance'],
    govLink: 'https://wcd.nic.in/act/sexual-harassment-women-workplace-prevention-prohibition-and-redressal-act-2013', govSource: 'wcd.nic.in'
  },
  // Criminal Law
  {
    id: 'bail', title: 'Bail Rights — Bailable vs Non-Bailable', category: 'Criminal Law',
    emoji: '⛓️', readTime: '8 min', difficulty: 'Intermediate',
    desc: 'Under BNSS 2023 (replacing CrPC), bail is categorized as bailable (automatic right) and non-bailable (court discretion). Anticipatory bail under Section 482 BNSS prevents arrest.',
    keyPoints: ['Bailable offences: bail is a right, police must grant', 'Non-bailable: Sessions or HC decides bail', 'Anticipatory bail protects before arrest', 'Bail amount must not be excessive (Art. 39A)', 'NALSA provides free lawyers for bail hearings'],
    govLink: 'https://nalsa.gov.in', govSource: 'nalsa.gov.in'
  },
  {
    id: 'bnss', title: 'New Criminal Laws 2024 (BNS/BNSS/BSA)', category: 'Criminal Law',
    emoji: '📚', readTime: '12 min', difficulty: 'Advanced',
    desc: 'From July 1, 2024, three new criminal laws replaced IPC, CrPC, and the Indian Evidence Act. Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA).',
    keyPoints: ['IPC replaced by BNS — terrorism, organised crime now included', 'CrPC replaced by BNSS — trial timelines tightened', 'Indian Evidence Act replaced by BSA — electronic records', 'Zero FIR now mandatory in BNSS', 'Victim compensation scheme strengthened under BNSS'],
    govLink: 'https://legislative.gov.in', govSource: 'legislative.gov.in'
  },
  // Tax & Finance
  {
    id: 'income-tax', title: 'Income Tax — Basics Every Citizen Must Know', category: 'Tax & Finance',
    emoji: '💼', readTime: '10 min', difficulty: 'Intermediate',
    desc: 'Under the Income Tax Act, 1961, individuals must file ITR annually if income exceeds the basic exemption limit. The New Tax Regime (default from FY 2024-25) offers lower slabs without deductions.',
    keyPoints: ['File ITR at incometax.gov.in — deadline July 31', 'New regime: 0% tax up to ₹3L, 5% from ₹3-7L, etc.', 'Old regime benefits: HRA, 80C (₹1.5L), 80D (health insurance)', 'PAN mandatory for transactions above ₹50,000', 'Penalty ₹5,000 for late filing (₹1,000 if income < ₹5L)'],
    govLink: 'https://incometax.gov.in', govSource: 'incometax.gov.in'
  },
  {
    id: 'gst', title: 'GST — Rights & Compliance for Consumers', category: 'Tax & Finance',
    emoji: '🧾', readTime: '7 min', difficulty: 'Intermediate',
    desc: 'Goods and Services Tax unifies India\'s indirect tax system. As a consumer, you have a right to a proper GST invoice, to check if a business is registered, and to file anti-profiteering complaints.',
    keyPoints: ['Demand GST invoice for every purchase', 'Verify GSTIN of businesses at gst.gov.in', 'File anti-profiteering complaint at naa.gov.in', 'GST rates: 0%, 5%, 12%, 18%, 28%', 'File consumer complaint if GST not passed on to you'],
    govLink: 'https://gst.gov.in', govSource: 'gst.gov.in'
  },
  // Wills & Succession
  {
    id: 'wills', title: 'Wills & Succession Laws in India', category: 'Family Law',
    emoji: '📝', readTime: '9 min', difficulty: 'Intermediate',
    desc: 'Every Indian above 18 can make a Will. Under the Indian Succession Act, 1925 (for non-Hindus) and Hindu Succession Act, 1956, a Will must be in writing and signed by two witnesses.',
    keyPoints: ['Will does not need to be on stamp paper', 'Registration optional but recommended at Sub-Registrar\'s office', 'Probate required in Chennai, Mumbai, Kolkata (High Court jurisdictions)', 'Nominee vs Legal Heir — legal heir prevails for most assets', 'Nominate heirs for all bank accounts, insurance, mutual funds'],
    govLink: 'https://legislative.gov.in/acts/hindu-succession-act-1956', govSource: 'legislative.gov.in'
  },
  // Grievance
  {
    id: 'grievance', title: 'Government Grievance Portals — File Complaints', category: 'Citizens Rights',
    emoji: '📢', readTime: '5 min', difficulty: 'Beginner',
    desc: 'India has a robust network of online grievance portals. CPGRAMS allows citizens to file complaints against any central government department and track resolution status in real time.',
    keyPoints: ['CPGRAMS: pgportal.gov.in — all central ministries', 'PM Helpline: 1800-11-0031 (Mon-Sat)', 'Railway complaints: railmadad.indianrailways.gov.in', 'Police complaints: your state police portal', 'PM SVANidhi, Aadhaar, PAN — dedicated helplines available'],
    govLink: 'https://pgportal.gov.in', govSource: 'pgportal.gov.in'
  },
  {
    id: 'passport', title: 'Passport & Visa — Rights & Procedures', category: 'Citizens Rights',
    emoji: '✈️', readTime: '6 min', difficulty: 'Beginner',
    desc: 'Every Indian citizen has the right to a passport. Under the Passports Act, 1967, the government can only refuse a passport on limited specified grounds. File at your nearest Passport Seva Kendra.',
    keyPoints: ['Apply online at passportindia.gov.in', 'Normal passport: 30 days, Tatkal: 7 days', 'Police verification waived for Aadhaar-linked applications in some cases', 'Lost passport: file FIR + apply for duplicate', 'Right to know reason for rejection under Sec. 8 Passports Act'],
    govLink: 'https://passportindia.gov.in', govSource: 'passportindia.gov.in'
  },
  {
    id: 'disability', title: 'Rights of Persons with Disabilities', category: 'Citizens Rights',
    emoji: '♿', readTime: '7 min', difficulty: 'Beginner',
    desc: 'The Rights of Persons with Disabilities Act, 2016 recognizes 21 disabilities and guarantees rights to education, employment, accessibility, and social security. The CCD (Chief Commissioner for Disabilities) handles complaints.',
    keyPoints: ['4% reservation in government jobs for PwD', 'Disability certificate from medical authority — get UDID card', 'Free education up to 18 years for disabled children', 'Accessibility compliance mandatory for public buildings', 'Helpline: 1800-11-4515'],
    govLink: 'https://disabilityaffairs.gov.in', govSource: 'disabilityaffairs.gov.in'
  },
]

const CATEGORIES = ['All', 'Citizens Rights', 'Criminal Law', 'Family Law', 'Property Law', 'Consumer Rights', 'Digital Law', 'Labour Law', 'Tax & Finance']

const CAT_ICONS = {
  'Citizens Rights': '⚖️', 'Criminal Law': '🚨', 'Family Law': '👨‍👩‍👧',
  'Property Law': '🏠', 'Consumer Rights': '🛒', 'Digital Law': '💻',
  'Labour Law': '👷', 'Tax & Finance': '💼'
}

const DIFF_COLOR = { 'Beginner': '#16A34A', 'Intermediate': '#D97706', 'Advanced': '#DC2626' }
const DIFF_BG = { 'Beginner': '#F0FDF4', 'Intermediate': '#FFFBEB', 'Advanced': '#FEF2F2' }

export default function KnowledgeHub() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [subEmail, setSubEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [featured] = useState(ARTICLES[0])
  const { showToast } = useToast()

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('jj_newsletter_email')
    if (saved) setSubscribed(true)
  }, [])

  const filtered = ARTICLES.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || a.category === category
    return matchSearch && matchCat
  })

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) { showToast('Please enter a valid email address.', 'error'); return }
    try {
      await fetch('/api/subscribe', { credentials: 'include', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: subEmail }) })
    } catch (_) { }
    setSubscribed(true)
    if (typeof window !== 'undefined') localStorage.setItem('jj_newsletter_email', subEmail)
    showToast("Thanks! We'll keep you updated.", 'success')
    setSubEmail('')
  }

  return (
    <div style={{ background: '#F5F0EC', minHeight: '100vh' }}>
      <Helmet>
        <title>Legal Knowledge Hub — Know Your Rights | Justice Junction 24/7</title>
        <meta name="description" content="Free legal guides on RTI, FIR, Consumer Rights, Divorce, Cyber Crime, Labour Law and more. Backed by Indian government sources." />
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .kh-card { animation: fadeInUp 0.4s ease both; transition: transform 0.2s, box-shadow 0.2s; }
        .kh-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(123,29,46,0.12) !important; }
        .kh-card:nth-child(1){animation-delay:.05s} .kh-card:nth-child(2){animation-delay:.1s}
        .kh-card:nth-child(3){animation-delay:.15s} .kh-card:nth-child(4){animation-delay:.2s}
        .kh-card:nth-child(5){animation-delay:.25s} .kh-card:nth-child(6){animation-delay:.3s}
        .cat-chip:hover { background: #7B1D2E !important; color: #fff !important; border-color: #7B1D2E !important; }
        .gov-link:hover { text-decoration: underline !important; }
      `}} />

      {/* ── Cinematic Hero ── */}
      <section style={{
        position: 'relative', overflow: 'hidden', paddingTop: '9rem', paddingBottom: '5rem',
        backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85')`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,3,5,0.95) 0%, rgba(78,18,28,0.9) 50%, rgba(8,3,5,0.96) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, transparent, #F5F0EC)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.2)', borderRadius: 30, padding: '.35rem 1.1rem', marginBottom: '1.5rem' }}>
            <BookOpen size={12} color="#F5C4B3" />
            <span style={{ fontSize: '.7rem', color: '#F5C4B3', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px' }}>Free Legal Knowledge</span>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2.4rem, 3.8vw, 3.0rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Know Your <span style={{ color: '#F5C4B3' }}>Legal Rights</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(245,224,200,0.75)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            {ARTICLES.length} expert guides backed by <strong style={{ color: '#F5C4B3' }}>official Indian government sources</strong> — RTI, FIR, Consumer Court, Cyber Crime, Labour Law, and more.
          </p>
          {/* Search bar */}
          <div style={{ maxWidth: 580, margin: '0 auto', background: '#fff', borderRadius: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '.85rem 1.4rem', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <Search size={20} color="#7B1D2E" style={{ flexShrink: 0 }} />
            <input
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1A0A0D', background: 'transparent', fontWeight: 600 }}
              placeholder="Search topics — RTI, FIR, divorce, cyber fraud…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A7A84', fontWeight: 700, fontSize: '.85rem' }}>Clear</button>}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EDD5BE' }}>
        <div className="container" style={{ display: 'flex', gap: '3rem', padding: '1.2rem 0', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['📚', `${ARTICLES.length} Free Guides`], ['🏛️', '8 Legal Categories'], ['✅', 'Govt-Backed Sources'], ['🔄', 'Updated July 2024']].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.88rem', fontWeight: 700, color: '#4A2030' }}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Category filter ── */}
      <div style={{ background: '#F5F0EC', borderBottom: '1px solid #EDD5BE', padding: '1rem 0', overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', minWidth: 'max-content', alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className="cat-chip"
              onClick={() => setCategory(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: category === cat ? '#7B1D2E' : '#fff',
                border: `1.5px solid ${category === cat ? '#7B1D2E' : '#E8C9A8'}`,
                color: category === cat ? '#fff' : '#4A2030',
                borderRadius: 30, padding: '.45rem 1.1rem',
                fontSize: '.82rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.18s', whiteSpace: 'nowrap', flexShrink: 0
              }}
            >
              {cat !== 'All' && <span>{CAT_ICONS[cat]}</span>} {cat}
              {cat !== 'All' && <span style={{ background: category === cat ? 'rgba(255,255,255,0.2)' : 'rgba(123,29,46,0.1)', borderRadius: 10, padding: '0 5px', fontSize: '.7rem' }}>
                {ARTICLES.filter(a => a.category === cat).length}
              </span>}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 0 5rem' }}>

        {/* ── Featured article ── */}
        {category === 'All' && !search && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={13} fill="#7B1D2E" color="#7B1D2E" /> Featured Guide
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1A0A0D, #4A1020)', borderRadius: 24, padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 12px 40px rgba(123,29,46,0.2)' }}>
              <div style={{ fontSize: '4rem', flexShrink: 0 }}>{featured.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '.7rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '1.5px', background: 'rgba(245,196,179,0.1)', borderRadius: 20, padding: '.25rem .7rem', border: '1px solid rgba(245,196,179,0.2)' }}>{featured.category}</span>
                  <span style={{ fontSize: '.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{featured.readTime} read</span>
                </div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.8rem', letterSpacing: '-0.03em' }}>{featured.title}</h2>
                <p style={{ color: 'rgba(245,224,200,0.7)', lineHeight: 1.7, fontSize: '.95rem', marginBottom: '1.5rem', maxWidth: 560 }}>{featured.desc}</p>
                <Link to={`/knowledge/${featured.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F5C4B3', color: '#1A0A0D', borderRadius: 12, padding: '.8rem 1.8rem', fontWeight: 800, fontSize: '.9rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                  Read Full Guide <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.5rem', minWidth: 220 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Key Points</div>
                {featured.keyPoints.slice(0, 3).map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5C4B3', flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: '.82rem', color: 'rgba(245,224,200,0.8)', lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontWeight: 800, color: '#1A0A0D', fontSize: '1rem' }}>
            {filtered.length === ARTICLES.length ? `All ${ARTICLES.length} Guides` : `${filtered.length} Guide${filtered.length !== 1 ? 's' : ''} Found`}
            {category !== 'All' && <span style={{ color: '#7B1D2E', marginLeft: 6 }}>in {category}</span>}
          </div>
          {(search || category !== 'All') && (
            <button onClick={() => { setSearch(''); setCategory('All') }} style={{ background: 'none', border: '1.5px solid #E8C9A8', borderRadius: 10, padding: '.4rem .9rem', color: '#7B1D2E', fontWeight: 700, fontSize: '.82rem', cursor: 'pointer' }}>
              Clear filters
            </button>
          )}
        </div>

        {/* ── Article grid ── */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((a, idx) => (
              <div key={a.id} className="kh-card" style={{ background: '#fff', borderRadius: 22, border: '1px solid #E8C9A8', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 16px rgba(123,29,46,0.05)', animationDelay: `${idx * 0.05}s` }}>
                {/* Card top accent */}
                <div style={{ height: 4, background: 'linear-gradient(90deg, #7B1D2E, #C44B6B)' }} />
                <div style={{ padding: '1.6rem 1.8rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{a.emoji}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: '.65rem', fontWeight: 800, color: DIFF_COLOR[a.difficulty], background: DIFF_BG[a.difficulty], borderRadius: 20, padding: '.2rem .6rem' }}>{a.difficulty}</span>
                      <span style={{ fontSize: '.68rem', color: '#9A7A84', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{a.readTime}</span>
                    </div>
                  </div>
                  {/* Category tag */}
                  <div style={{ fontSize: '.68rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>
                    {CAT_ICONS[a.category]} {a.category}
                  </div>
                  {/* Title */}
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#1A0A0D', marginBottom: '0.7rem', lineHeight: 1.3 }}>{a.title}</h3>
                  {/* Desc */}
                  <p style={{ fontSize: '.86rem', color: '#5A3A42', lineHeight: 1.65, marginBottom: '1.2rem', flex: 1 }}>{a.desc}</p>
                  {/* Key points preview */}
                  <div style={{ background: '#FDF6EE', borderRadius: 12, padding: '1rem', marginBottom: '1.2rem' }}>
                    <div style={{ fontSize: '.68rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Key Points</div>
                    {a.keyPoints.slice(0, 2).map((pt, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: i < 1 ? 5 : 0 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7B1D2E', flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: '.79rem', color: '#4A2030', lineHeight: 1.45 }}>{pt}</span>
                      </div>
                    ))}
                    {a.keyPoints.length > 2 && <div style={{ fontSize: '.72rem', color: '#9A7A84', marginTop: 5, fontWeight: 600 }}>+{a.keyPoints.length - 2} more points →</div>}
                  </div>
                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to={`/knowledge/${a.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #7B1D2E, #5C1521)', color: '#fff', borderRadius: 10, padding: '.6rem 1.2rem', fontSize: '.82rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s' }}>
                      Read Full Guide <ChevronRight size={14} />
                    </Link>
                    <a href={a.govLink} target="_blank" rel="noopener noreferrer" className="gov-link" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.7rem', color: '#9A7A84', fontWeight: 600, textDecoration: 'none' }}>
                      <Globe size={11} /> {a.govSource} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 24, border: '1px solid #E8C9A8' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#1A0A0D', marginBottom: 8 }}>No guides found for "{search}"</h3>
            <p style={{ color: '#5A3A42', marginBottom: '1.5rem' }}>Try broader terms or browse a category above.</p>
            <button onClick={() => { setSearch(''); setCategory('All') }} style={{ background: 'linear-gradient(135deg, #7B1D2E, #5C1521)', color: '#fff', border: 'none', borderRadius: 12, padding: '.9rem 2rem', fontWeight: 800, cursor: 'pointer' }}>Browse All Guides</button>
          </div>
        )}

        {/* ── Govt portals quick-links ── */}
        <div style={{ marginTop: '4rem', background: '#fff', borderRadius: 24, border: '1px solid #E8C9A8', padding: '2rem', boxShadow: '0 4px 20px rgba(123,29,46,0.05)' }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: '1.2rem', color: '#1A0A0D', marginBottom: '0.5rem' }}>🏛️ Official Government Portals</div>
          <p style={{ color: '#5A3A42', fontSize: '.88rem', marginBottom: '1.5rem' }}>All legal guides on Justice Junction are sourced from or verified against these official Indian government resources.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
            {[
              ['RTI Online', 'rtionline.gov.in', 'https://rtionline.gov.in'],
              ['NALSA (Free Legal Aid)', 'nalsa.gov.in', 'https://nalsa.gov.in'],
              ['Cyber Crime', 'cybercrime.gov.in', 'https://cybercrime.gov.in'],
              ['Consumer Helpline', 'consumerhelpline.gov.in', 'https://consumerhelpline.gov.in'],
              ['CPGRAMS Grievance', 'pgportal.gov.in', 'https://pgportal.gov.in'],
              ['Income Tax India', 'incometax.gov.in', 'https://incometax.gov.in'],
              ['RERA Maharashtra', 'maharera.mahaonline.gov.in', 'https://maharera.mahaonline.gov.in'],
              ['e-Daakhil Consumer', 'edaakhil.nic.in', 'https://edaakhil.nic.in'],
              ['Model Tenancy Act', 'mohua.gov.in', 'https://mohua.gov.in'],
              ['Women Helpline', '181 Helpline', 'https://wcd.nic.in'],
              ['Labour Law Portal', 'labour.gov.in', 'https://labour.gov.in'],
              ['Passport Seva', 'passportindia.gov.in', 'https://passportindia.gov.in'],
            ].map(([name, domain, url]) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FDF6EE', border: '1px solid #E8C9A8', borderRadius: 12, padding: '.75rem 1rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                <Globe size={14} color="#7B1D2E" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.82rem', color: '#1A0A0D' }}>{name}</div>
                  <div style={{ fontSize: '.68rem', color: '#7B1D2E' }}>{domain}</div>
                </div>
                <ExternalLink size={12} color="#9A7A84" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #1A0A0D, #4A1020)', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📬</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.8rem', letterSpacing: '-0.03em' }}>
            Stay Legally Informed
          </h2>
          <p style={{ color: 'rgba(245,224,200,0.7)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            Monthly plain-language legal updates — new laws, court verdicts, and your rights explained simply.
          </p>
          {subscribed ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#4ADE80', fontWeight: 800, fontSize: '1rem', background: 'rgba(74,222,128,0.1)', borderRadius: 14, padding: '1rem 2rem', border: '1px solid rgba(74,222,128,0.2)' }}>
              ✓ You're subscribed! Legal updates coming your way.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, maxWidth: 500, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                style={{ flex: 1, minWidth: 240, padding: '1rem 1.4rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', outline: 'none', fontSize: '.95rem', background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 600 }}
                type="email" placeholder="your@email.com" value={subEmail} onChange={e => setSubEmail(e.target.value)} required
              />
              <button type="submit" style={{ padding: '1rem 2rem', borderRadius: 14, background: '#F5C4B3', color: '#1A0A0D', border: 'none', fontWeight: 800, fontSize: '.95rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Subscribe Free
              </button>
            </form>
          )}
          <p style={{ fontSize: '.75rem', color: 'rgba(245,224,200,0.4)', marginTop: '1rem' }}>No spam · Unsubscribe anytime</p>
        </div>
      </section>
    </div>
  )
}
