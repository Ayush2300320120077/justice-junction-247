import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import LawyerCard from '../components/LawyerCard'
import SkeletonCard from '../components/SkeletonCard'
import { useToast } from '../context/ToastContext'
import { SearchX, Filter, X, ChevronDown, Star, MapPin, Scale, DollarSign, Loader2, Globe, Video } from 'lucide-react'
import Head from 'next/head'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law','Civil Disputes','Divorce','Taxation','Intellectual Property','Cyber Law']
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
  
  // Filter States (init from URL)
  const [spec, setSpec] = useState('')
  const [city, setCity] = useState('')
  const [maxFee, setMaxFee] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [language, setLanguage] = useState('')
  const [availability, setAvailability] = useState('')
  const [minRating, setMinRating] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const observer = useRef()
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

  // Sync state with URL on mount
  useEffect(() => {
    if (!router.isReady) return
    const { specialization, city: qCity, maxFee: qFee, sort } = router.query
    if (specialization) setSpec(specialization)
    if (qCity) setCity(qCity)
    if (qFee) setMaxFee(qFee)
    if (sort) setSortBy(sort)
    if (router.query.language) setLanguage(router.query.language)
    if (router.query.availability) setAvailability(router.query.availability)
    if (router.query.minRating) setMinRating(router.query.minRating)
  }, [router.isReady, router.query])

  // Load data
  const fetchData = async (p, isNew = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 8, sort: sortBy })
      if (spec) params.append('specialization', spec)
      if (city) params.append('city', city)
      if (maxFee) params.append('maxFee', maxFee)
      if (language) params.append('language', language)
      if (availability) params.append('availability', availability)
      if (minRating) params.append('minRating', minRating)

      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      
      if (isNew) {
        setLawyers(data.lawyers)
      } else {
        setLawyers(prev => [...prev, ...data.lawyers])
      }
      
      setHasMore(data.lawyers.length === 8)
      setTotal(data.total)
    } catch (err) {
      showToast('Failed to fetch lawyers', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Effect for page change (Infinite Scroll)
  useEffect(() => {
    if (page > 1) fetchData(page)
  }, [page])

  // Effect for filter change (Reset)
  useEffect(() => {
    setPage(1)
    fetchData(1, true)
    const p = {}
    if (spec) p.specialization = spec
    if (city) p.city = city
    if (maxFee) p.maxFee = maxFee
    if (language) p.language = language
    if (availability) p.availability = availability
    if (minRating) p.minRating = minRating
    if (sortBy !== 'rating') p.sort = sortBy
    router.push({ pathname: '/search', query: p }, undefined, { shallow: true })
  }, [spec, city, maxFee, sortBy, language, availability, minRating])

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
    <div className="search-page-bg">
      <div className="page-wrap page-reveal" style={{background: 'transparent'}}>
      <Head>
        <title>Find Verified Lawyers — Justice Junction 24/7</title>
        <meta name="description" content="Browse and compare top-rated advocates by specialization, fee, and location. Book instant video consultations." />
      </Head>

      <div className="container" style={{paddingTop: '2rem'}}>
        {/* Header Area */}
        <div style={s.searchHeader} className="search-header-responsive">
          <div className="mobile-text-center mobile-w-full">
            <h1 style={s.h1} className="text-balance">Expert Legal Counsel</h1>
            <p style={{color: 'var(--txt-3)', fontSize: '.9rem'}} className="text-balance">Found {total} verified professionals matching your criteria.</p>
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

        <div style={s.layout} className="search-layout-responsive">
          {/* Sidebar Filters */}
          <aside style={s.sidebar} className={`search-sidebar-mobile ${showFilters ? 'open' : ''}`}>
            <div style={s.sbHeader}>
              <h3 style={{fontWeight: 800, fontSize: '1.2rem'}}>Filters</h3>
              <button className="show-mobile" style={s.closeBtn} onClick={() => setShowFilters(false)}><X size={24}/></button>
            </div>
            
            <div style={{overflowY: 'auto', flex: 1, paddingRight: 5}}>
              <div style={s.filterGroup}>
                <label style={s.label}><Scale size={14}/> Specialization</label>
                <select style={s.select} value={spec} onChange={e => setSpec(e.target.value)}>
                  <option value="">All Practice Areas</option>
                  {SPECS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                </select>
              </div>

              <div style={s.filterGroup}>
                <label style={s.label}><MapPin size={14}/> Location</label>
                <input style={s.input} placeholder="City or Pincode" value={city} onChange={e => setCity(e.target.value)} />
              </div>

              <div style={s.filterGroup}>
                <label style={s.label}><DollarSign size={14}/> Max Consultation Fee</label>
                <div style={s.feeRange}>
                  {[1000, 2500, 5000, 10000].map(amt => (
                    <button 
                      key={amt} 
                      style={{...s.feeBtn, background: maxFee == amt ? 'var(--bur)' : '#fff', color: maxFee == amt ? '#fff' : 'var(--txt-2)'}}
                      onClick={() => setMaxFee(maxFee == amt ? '' : amt)}
                    >
                      ₹{amt/1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.filterGroup}>
                <label style={s.label}><ChevronDown size={14}/> Sort By</label>
                <select style={s.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="rating">Top Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="price_low">Fee: Low to High</option>
                  <option value="price_high">Fee: High to Low</option>
                </select>
              </div>

              <div style={s.filterGroup}>
                <label style={s.label}><Globe size={14}/> Language</label>
                <select style={s.select} value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="">All Languages</option>
                  {['Hindi','English','Tamil','Bengali','Marathi','Gujarati','Telugu','Kannada','Punjabi','Urdu'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div style={s.filterGroup}>
                <label style={s.label}><Video size={14}/> Availability</label>
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                  {[['','Any'],['online','Online'],['offline','Offline'],['both','Both (Online + Offline)']].map(([v,l]) => (
                    <label key={v} style={{display:'flex', alignItems:'center', gap:10, fontSize:'.9rem', fontWeight:600, cursor:'pointer', padding: '8px 12px', background: availability===v ? 'var(--bur-l)' : 'var(--cream)', color: availability===v ? '#fff' : 'var(--txt)', borderRadius: 10, transition: 'all 0.2s'}}>
                      <input type="radio" name="availability" value={v} checked={availability===v} onChange={() => setAvailability(v)} style={{display: 'none'}}/>{l}
                    </label>
                  ))}
                </div>
              </div>

              <div style={s.filterGroup}>
                <label style={s.label}><Star size={14}/> Minimum Rating</label>
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                  {[['','All Ratings'],['4','4+ Stars ★★★★'],['3','3+ Stars ★★★']].map(([v,l]) => (
                    <label key={v} style={{display:'flex', alignItems:'center', gap:10, fontSize:'.9rem', fontWeight:600, cursor:'pointer', padding: '8px 12px', background: minRating===v ? 'var(--gold)' : 'var(--cream)', color: minRating===v ? '#fff' : 'var(--txt)', borderRadius: 10, transition: 'all 0.2s'}}>
                      <input type="radio" name="minRating" value={v} checked={minRating===v} onChange={() => setMinRating(v)} style={{display: 'none'}}/>{l}
                    </label>
                  ))}
                </div>
              </div>

              <div style={s.promoBox}>
                <Star size={24} color="var(--gold)" fill="var(--gold)"/>
                <div style={{fontWeight: 800, fontSize: '.9rem', margin: '8px 0'}}>Justice Junction Pro</div>
                <p style={{fontSize: '.75rem', color: 'var(--txt-3)'}}>Get 20% off on your first 3 consultations. Use code: JJSTART20</p>
              </div>
            </div>

            <button className="btn btn-primary show-mobile" style={{marginTop: '1.5rem', width: '100%', borderRadius: 14, padding: '1rem'}} onClick={() => setShowFilters(false)}>Apply Filters</button>
          </aside>

          {/* Main Results */}
          <main style={s.main}>
            {lawyers.length === 0 && !loading ? (
              <div style={s.empty}>
                <SearchX size={64} color="var(--border-2)" strokeWidth={1} />
                <h2 style={{marginTop: '1.5rem', fontWeight: 800}}>No lawyers found</h2>
                <p style={{color: 'var(--txt-3)', marginBottom: '2rem'}}>Try adjusting your filters or search terms.</p>
                <button className="btn btn-outline" onClick={clearFilters}>Clear All Filters</button>
              </div>
            ) : (
              <div style={s.grid} className="grid-lawyers">
                {lawyers.map((l, idx) => (
                  <div key={l._id} ref={idx === lawyers.length - 1 ? lastElementRef : null} className="magnetic-hover">
                    <LawyerCard lawyer={l} />
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div style={s.grid} className="grid-lawyers">
                {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {!hasMore && lawyers.length > 0 && (
              <div style={{textAlign: 'center', padding: '4rem 0', color: 'var(--txt-3)', fontSize: '.9rem', fontWeight: 600}}>
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

const s = {
  searchHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1 },
  layout: { display: 'flex', gap: '2.5rem', alignItems: 'flex-start' },
  sidebar: { background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', position: 'sticky', top: 110, transition: 'all 0.3s ease', zIndex: 100, width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column' },
  sbHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  filterGroup: { marginBottom: '1.8rem' },
  label: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem', fontWeight: 800, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 },
  select: { width: '100%', padding: '.75rem 1rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--cream)', fontSize: '.9rem', fontWeight: 600, outline: 'none' },
  input: { width: '100%', padding: '.75rem 1rem', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--cream)', fontSize: '.9rem', fontWeight: 600, outline: 'none' },
  feeRange: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  feeBtn: { padding: '.6rem', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all .2s' },
  promoBox: { marginTop: '2rem', padding: '1.5rem', background: 'var(--cream-2)', borderRadius: 20, textAlign: 'center', border: '1px solid var(--border)' },
  main: { minWidth: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
  empty: { textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '32px', border: '1px solid var(--border)' }
}
