import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LawyerCard from '../components/LawyerCard'
import SkeletonCard from '../components/SkeletonCard'
import { useToast } from '../context/ToastContext'
import { SearchX, Filter, X, ChevronDown, Star, MapPin, Scale, DollarSign, Loader2, Globe, Video, Phone } from 'lucide-react'
import Head from 'next/head'
import demoLawyers from '../data/demoLawyers'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law','Civil Disputes','Divorce','Taxation','Intellectual Property','Cyber Law','Bail & FIR']
const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Ahmedabad','Pune','Jaipur','Lucknow']

export default function Search() {
  const router = useRouter()
  const { showToast } = useToast()
  
  // States
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [usingDemo, setUsingDemo] = useState(false)
  const [showDemoBanner, setShowDemoBanner] = useState(true)
  
  // Filter States (init from URL)
  const [spec, setSpec] = useState('')
  const [city, setCity] = useState('')
  const [debouncedCity, setDebouncedCity] = useState('')
  const [maxFee, setMaxFee] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [language, setLanguage] = useState('')
  const [availability, setAvailability] = useState('')
  const [minRating, setMinRating] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const observer = useRef()
  const initialSyncDone = useRef(false)
  const lastElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  // Debounce city input — only update debouncedCity 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city)
    }, 500)
    return () => clearTimeout(timer)
  }, [city])

  // Sync state with URL on mount (one-time)
  useEffect(() => {
    if (!router.isReady || initialSyncDone.current) return
    initialSyncDone.current = true
    const { specialization, city: qCity, maxFee: qFee, sort } = router.query
    if (specialization) setSpec(specialization)
    if (qCity) {
      setCity(qCity)
      setDebouncedCity(qCity)
    }
    if (qFee) setMaxFee(qFee)
    if (sort) setSortBy(sort)
    if (router.query.language) setLanguage(router.query.language)
    if (router.query.availability) setAvailability(router.query.availability)
    if (router.query.minRating) setMinRating(router.query.minRating)
  }, [router.isReady])

  // Filter demo data in-memory
  const getFilteredDemoLawyers = () => {
    let filtered = [...demoLawyers]

    if (spec) {
      filtered = filtered.filter(l =>
        l.specialization.toLowerCase() === spec.toLowerCase() ||
        (l.specializations && l.specializations.some(s => s.toLowerCase() === spec.toLowerCase()))
      )
    }
    if (debouncedCity) {
      filtered = filtered.filter(l =>
        l.city.toLowerCase().includes(debouncedCity.toLowerCase())
      )
    }
    if (maxFee) {
      filtered = filtered.filter(l => (l.fee || l.consultationFee) <= Number(maxFee))
    }
    if (language) {
      filtered = filtered.filter(l =>
        l.languages && l.languages.some(lang => lang.toLowerCase() === language.toLowerCase())
      )
    }
    if (availability) {
      filtered = filtered.filter(l => {
        if (availability === 'online') return l.availability === 'Online' || l.availability === 'Both'
        if (availability === 'offline') return l.availability === 'Offline' || l.availability === 'Both'
        if (availability === 'both') return l.availability === 'Both'
        return true
      })
    }
    if (minRating) {
      filtered = filtered.filter(l => (l.rating || l.averageRating) >= Number(minRating))
    }

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || b.averageRating) - (a.rating || a.averageRating))
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience)
    } else if (sortBy === 'price_low') {
      filtered.sort((a, b) => (a.fee || a.consultationFee) - (b.fee || b.consultationFee))
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => (b.fee || b.consultationFee) - (a.fee || a.consultationFee))
    }

    return filtered
  }

  // Load data
  const fetchData = async (p, isNew = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 8, sort: sortBy })
      if (spec) params.append('specialization', spec)
      if (debouncedCity) params.append('city', debouncedCity)
      if (maxFee) params.append('maxFee', maxFee)
      if (language) params.append('language', language)
      if (availability) params.append('availability', availability)
      if (minRating) params.append('minRating', minRating)

      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      
      if (data.lawyers && data.lawyers.length > 0) {
        if (isNew) {
          setLawyers(data.lawyers)
        } else {
          setLawyers(prev => [...prev, ...data.lawyers])
        }
        setHasMore(data.lawyers.length === 8)
        setTotal(data.total)
        setUsingDemo(false)
      } else {
        // Fallback to demo data
        const demoFiltered = getFilteredDemoLawyers()
        setLawyers(demoFiltered)
        setTotal(demoFiltered.length)
        setHasMore(false)
        setUsingDemo(true)
      }
    } catch (err) {
      // API failed — fallback to demo data
      const demoFiltered = getFilteredDemoLawyers()
      setLawyers(demoFiltered)
      setTotal(demoFiltered.length)
      setHasMore(false)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }

  // Effect for page change (Infinite Scroll)
  useEffect(() => {
    if (page > 1 && !usingDemo) fetchData(page)
  }, [page])

  const hasMounted = useRef(false)

  // Effect for filter change (Reset) — uses debouncedCity so typing doesn't cause reload
  useEffect(() => {
    // Skip the very first run since mount sync handles it
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    setPage(1)
    fetchData(1, true)
    const p = {}
    if (spec) p.specialization = spec
    if (debouncedCity) p.city = debouncedCity
    if (maxFee) p.maxFee = maxFee
    if (language) p.language = language
    if (availability) p.availability = availability
    if (minRating) p.minRating = minRating
    if (sortBy !== 'rating') p.sort = sortBy
    router.push({ pathname: '/search', query: p }, undefined, { shallow: true, scroll: false })
  }, [spec, debouncedCity, maxFee, sortBy, language, availability, minRating])

  const clearFilters = () => {
    setSpec('')
    setCity('')
    setMaxFee('')
    setSortBy('rating')
    setLanguage('')
    setAvailability('')
    setMinRating('')
  }

  return (
    <div style={{background:'#FDF8F4',minHeight:'100vh'}}>
      <div className="page-wrap page-reveal" style={{background: 'transparent'}}>
      <Head>
        <title>Find Verified Lawyers in India | Justice Junction 24/7</title>
        <meta name="description" content="Browse and compare top-rated advocates by specialization, fee, and location. Book instant video consultations." />
      </Head>

      {/* Hero Banner */}
      <section style={{ padding: '6rem 0', background: '#7B1D2E', color: '#F9EEE4', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Find the Right Legal Expert</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>Browse verified advocates across India. Filter by practice area, location, language, and experience.</p>
        </div>
      </section>

      <div className="container" style={{paddingTop: '2rem'}}>
        {/* Demo Banner */}
        {usingDemo && showDemoBanner && lawyers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm mb-6 flex items-start justify-between">
            <div className="flex gap-2">
              <span className="text-lg leading-none">🔔</span>
              <div>
                <span className="font-semibold block">Showing demo profiles. Real verified lawyers joining soon.</span>
                <span>Register to be notified.</span>
              </div>
            </div>
            <button onClick={() => setShowDemoBanner(false)} className="text-amber-500 hover:text-amber-700 ml-4 flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header Area */}
        <div style={st.searchHeader} className="search-header-responsive">
          <div className="mobile-text-center mobile-w-full">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A0A0D', marginBottom: 4 }}>Search Results</h2>
            <p style={{color: '#4A2030', fontSize: '.9rem'}} className="text-balance">Found {total} verified professionals matching your criteria.</p>
          </div>
          <div style={{display: 'flex', gap: 12, width: '100%', justifyContent: 'center'}} className="show-mobile">
             <button className="btn btn-primary" style={{flex:1, borderRadius: 12}} onClick={() => setShowFilters(true)}>
              <Filter size={18} /> Filters
            </button>
            <button className="btn btn-ghost" style={{flex:1, borderRadius: 12}} onClick={clearFilters}>Reset</button>
          </div>
          <div className="hide-mobile">
            <button className="btn btn-ghost" onClick={clearFilters}>Reset All</button>
          </div>
        </div>

        <div style={st.layout} className="search-layout-responsive">
          {/* Sidebar Filters */}
          <aside style={st.sidebar} className={`search-sidebar-mobile ${showFilters ? 'open' : ''}`}>
            <div style={st.sbHeader}>
              <h3 style={{fontWeight: 800, fontSize: '1.2rem', color:'#1A0A0D'}}>Filters</h3>
              <button className="show-mobile" style={st.closeBtn} onClick={() => setShowFilters(false)}><X size={24}/></button>
            </div>
            
            <div style={{overflowY: 'auto', flex: 1, paddingRight: 5}}>
              <div style={st.filterGroup}>
                <label style={st.label}><Scale size={14} color="#7B1D2E"/> Specialization</label>
                <select style={st.select} value={spec} onChange={e => setSpec(e.target.value)}>
                  <option value="">All Practice Areas</option>
                  {SPECS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                </select>
              </div>

              <div style={st.filterGroup}>
                <label style={st.label}><MapPin size={14} color="#7B1D2E"/> Location</label>
                <input style={st.input} placeholder="City or Pincode" value={city} onChange={e => setCity(e.target.value)} />
              </div>

              <div style={st.filterGroup}>
                <label style={st.label}><DollarSign size={14} color="#7B1D2E"/> Max Consultation Fee</label>
                <div style={st.feeRange}>
                  {[1000, 2500, 5000, 10000].map(amt => (
                    <button 
                      key={amt} 
                      style={{...st.feeBtn, background: maxFee == amt ? '#7B1D2E' : '#fff', color: maxFee == amt ? '#fff' : '#1A0D10'}}
                      onClick={() => setMaxFee(maxFee == amt ? '' : amt)}
                    >
                      ₹{amt/1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div style={st.filterGroup}>
                <label style={st.label}><ChevronDown size={14} color="#7B1D2E"/> Sort By</label>
                <select style={st.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="rating">Top Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="price_low">Fee: Low to High</option>
                  <option value="price_high">Fee: High to Low</option>
                </select>
              </div>

              <div style={st.filterGroup}>
                <label style={st.label}><Globe size={14} color="#7B1D2E"/> Language</label>
                <select style={st.select} value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="">All Languages</option>
                  {['Hindi','English','Tamil','Bengali','Marathi','Gujarati','Telugu','Kannada','Punjabi','Urdu'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div style={st.filterGroup}>
                <label style={st.label}><Video size={14} color="#7B1D2E"/> Availability</label>
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                  {[['','Any'],['online','Online'],['offline','Offline'],['both','Both (Online + Offline)']].map(([v,l]) => (
                    <label key={v} style={{display:'flex', alignItems:'center', gap:10, fontSize:'.9rem', fontWeight:600, cursor:'pointer', padding: '8px 12px', background: availability===v ? '#7B1D2E' : '#fff', color: availability===v ? '#fff' : '#1A0D10', borderRadius: 10, transition: 'all 0.2s', border: '1px solid #E8C9A8'}}>
                      <input type="radio" name="availability" value={v} checked={availability===v} onChange={() => setAvailability(v)} style={{display: 'none'}}/>{l}
                    </label>
                  ))}
                </div>
              </div>

              <div style={st.filterGroup}>
                <label style={st.label}><Star size={14} color="#7B1D2E"/> Minimum Rating</label>
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                  {[['','All Ratings'],['4','4+ Stars ★★★★'],['3','3+ Stars ★★★']].map(([v,l]) => (
                    <label key={v} style={{display:'flex', alignItems:'center', gap:10, fontSize:'.9rem', fontWeight:600, cursor:'pointer', padding: '8px 12px', background: minRating===v ? '#7B1D2E' : '#fff', color: minRating===v ? '#fff' : '#1A0D10', borderRadius: 10, transition: 'all 0.2s', border: '1px solid #E8C9A8'}}>
                      <input type="radio" name="minRating" value={v} checked={minRating===v} onChange={() => setMinRating(v)} style={{display: 'none'}}/>{l}
                    </label>
                  ))}
                </div>
              </div>

              <div style={st.promoBox}>
                <Star size={24} color="#F9EEE4" fill="#F9EEE4"/>
                <div style={{fontWeight: 800, fontSize: '.9rem', margin: '8px 0', color:'#F9EEE4'}}>Justice Junction Pro</div>
                <p style={{fontSize: '.75rem', color: '#F5C4B3'}}>Get 20% off on your first 3 consultations. Use code: JJSTART20</p>
              </div>
            </div>

            <button className="btn btn-primary show-mobile" style={{marginTop: '1.5rem', width: '100%', borderRadius: 14, padding: '1rem'}} onClick={() => setShowFilters(false)}>Apply Filters</button>
          </aside>

          {/* Main Results */}
          <main style={st.main}>
            {lawyers.length === 0 && !loading ? (
              <div>
                <div style={st.empty}>
                  <SearchX size={64} color="#D4A882" strokeWidth={1} />
                  <h2 style={{marginTop: '1.5rem', fontWeight: 800, color:'#1A0A0D'}}>No lawyers match your filters</h2>
                  <p style={{color: '#4A2030', marginBottom: '1rem', maxWidth:420, margin:'0.5rem auto 1rem', lineHeight:1.7, fontSize:'.92rem'}}>
                    Our network is growing fast. Try adjusting your filters to see more results.
                  </p>
                  <button className="btn btn-outline" onClick={clearFilters}>Clear All Filters</button>
                  <div style={{marginTop:'1rem'}}>
                    <Link href="/join-as-lawyer" style={{fontSize:'.88rem',fontWeight:700,color:'#8B1A2A',textDecoration:'none'}}>Are you a lawyer? List your profile free →</Link>
                  </div>
                </div>
              </div>
            ) : (
              <div style={st.grid} className="grid-lawyers">
                {lawyers.map((l, idx) => (
                  <div key={l._id} ref={idx === lawyers.length - 1 ? lastElementRef : null} className="magnetic-hover">
                    <LawyerCard lawyer={l} isDemo={l.isDemo || usingDemo} />
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div style={st.grid} className="grid-lawyers">
                {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {!hasMore && lawyers.length > 0 && (
              <div style={{textAlign: 'center', padding: '4rem 0', color: '#6B4050', fontSize: '.9rem', fontWeight: 600}}>
                You've reached the end of the list.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  </div>
  )
}

const st = {
  searchHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1, color: '#1A0A0D' },
  layout: { display: 'flex', gap: '2.5rem', alignItems: 'flex-start' },
  sidebar: { background: '#FDF6EE', border: '1px solid #E8C9A8', borderRadius: '24px', padding: '2rem', position: 'sticky', top: 110, transition: 'all 0.3s ease', zIndex: 100, width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column' },
  sbHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#1A0D10' },
  filterGroup: { marginBottom: '1.8rem' },
  label: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', fontWeight: 700, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 },
  select: { width: '100%', padding: '.75rem 1rem', borderRadius: 12, border: '1.5px solid #E8C9A8', background: '#fff', fontSize: '.9rem', fontWeight: 600, outline: 'none', color: '#1A0D10' },
  input: { width: '100%', padding: '.75rem 1rem', borderRadius: 12, border: '1.5px solid #E8C9A8', background: '#fff', fontSize: '.9rem', fontWeight: 600, outline: 'none', color: '#1A0D10' },
  feeRange: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  feeBtn: { padding: '.6rem', borderRadius: 10, border: '1.5px solid #E8C9A8', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all .2s' },
  promoBox: { marginTop: '2rem', padding: '1.5rem', background: '#7B1D2E', borderRadius: 20, textAlign: 'center', border: '1px solid #7B1D2E' },
  main: { flex: 1, minWidth: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
  empty: { textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '24px', border: '1px solid #EDD5BE' }
}
