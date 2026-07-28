import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import LawyerCard from '../components/LawyerCard'
import SkeletonCard from '../components/SkeletonCard'
import { useToast } from '../context/ToastContext'
import { SearchX, Filter, X, ChevronDown, Star, MapPin, Scale, DollarSign, Loader2, Globe, Video, Phone, TrendingUp, Info, Sparkles, Bot, AlertTriangle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import demoLawyers from '../data/demoLawyers'
import { API } from '../api'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law','Civil Disputes','Divorce','Taxation','Intellectual Property','Cyber Law','Bail & FIR']
const CITIES = ['Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata','Ahmedabad','Pune','Jaipur','Lucknow']

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
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
  const [caseEstimate, setCaseEstimate] = useState(null)
  const [estimateLoading, setEstimateLoading] = useState(false)

  // AI Free-Text Issue Classification States
  const [aiProblemText, setAiProblemText] = useState('')
  const [classifying, setClassifying] = useState(false)
  const [aiNote, setAiNote] = useState('')
  const [urgencyFlag, setUrgencyFlag] = useState(null)

  const handleAiClassify = async () => {
    if (!aiProblemText.trim() || classifying) return
    setClassifying(true)
    try {
      const res = await API.classify({ text: aiProblemText })
      if (res && res.category) {
        setSpec(res.category)
        setAiNote(`AI suggested: ${res.category} — you can change this anytime`)
        if (res.urgency === 'emergency') {
          setUrgencyFlag('emergency')
          setAvailability('available')
        } else {
          setUrgencyFlag('routine')
        }
      }
    } catch (err) {
      console.warn('AI Classify error:', err)
    } finally {
      setClassifying(false)
    }
  }


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

  // Sync state with URL or LocalStorage on mount
  useEffect(() => {
    if (initialSyncDone.current) return
    initialSyncDone.current = true
    
    // Try URL first, then LocalStorage
    const specialization = searchParams.get('specialization')
    const qCity = searchParams.get('city')
    const qFee = searchParams.get('maxFee')
    const sort = searchParams.get('sort')
    const saved = JSON.parse(localStorage.getItem('jj_search_filters') || '{}')

    const initialSpec = specialization || saved.spec || ''
    const initialCity = qCity || saved.city || ''
    const initialFee = qFee || saved.maxFee || ''
    const initialSort = sort || saved.sortBy || 'rating'

    if (initialSpec) setSpec(initialSpec)
    if (initialCity) {
      setCity(initialCity)
      setDebouncedCity(initialCity)
    }
    if (initialFee) setMaxFee(initialFee)
    if (initialSort) setSortBy(initialSort)
    
    if (saved.language) setLanguage(saved.language)
    if (saved.availability) setAvailability(saved.availability)
    if (saved.minRating) setMinRating(saved.minRating)
  }, [])

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    if (!hasMounted.current) return
    const filters = { spec, city, maxFee, sortBy, language, availability, minRating }
    localStorage.setItem('jj_search_filters', JSON.stringify(filters))
  }, [spec, city, maxFee, sortBy, language, availability, minRating])

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
          setLawyers(prev => {
            // Prevent duplicates
            const ids = new Set(prev.map(l => l._id))
            const filtered = data.lawyers.filter(l => !ids.has(l._id))
            return [...prev, ...filtered]
          })
        }
        setHasMore(data.lawyers.length === 8)
        setTotal(data.total)
        setUsingDemo(false)
      } else {
        if (isNew) {
          // Fallback to demo data
          const demoFiltered = getFilteredDemoLawyers()
          setLawyers(demoFiltered)
          setTotal(demoFiltered.length)
          setUsingDemo(true)
        }
        setHasMore(false)
      }
    } catch (err) {
      if (isNew) {
        // API failed — fallback to demo data
        const demoFiltered = getFilteredDemoLawyers()
        setLawyers(demoFiltered)
        setTotal(demoFiltered.length)
        setUsingDemo(true)
      }
      setHasMore(false)
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
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    setPage(1)
    fetchData(1, true)

    // Silently update URL without triggering Next.js router transitions
    const p = new URLSearchParams()
    if (spec) p.set('specialization', spec)
    if (debouncedCity) p.set('city', debouncedCity)
    if (maxFee) p.set('maxFee', maxFee)
    if (language) p.set('language', language)
    if (availability) p.set('availability', availability)
    if (minRating) p.set('minRating', minRating)
    if (sortBy !== 'rating') p.set('sort', sortBy)
    
    const newUrl = `/search${p.toString() ? '?' + p.toString() : ''}`
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)

  }, [spec, debouncedCity, maxFee, sortBy, language, availability, minRating])

  // Fetch case estimate when specialization filter changes
  useEffect(() => {
    if (!spec) { setCaseEstimate(null); return }
    setEstimateLoading(true)
    fetch(`/api/ai/case-estimate?caseType=${encodeURIComponent(spec)}`)
      .then(r => r.json())
      .then(d => { setCaseEstimate(d); setEstimateLoading(false) })
      .catch(() => { setCaseEstimate(null); setEstimateLoading(false) })
  }, [spec])

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
      <div className="page-wrap" style={{background: 'transparent'}}>
      <Helmet>
        <title>Find Verified Lawyers in India | Justice Junction 24/7</title>
        <meta name="description" content="Browse and compare top-rated advocates by specialization, fee, and location. Book instant video consultations." />
      </Helmet>

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

        {/* Emergency Case Alert Banner */}
        {urgencyFlag === 'emergency' && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={24} color="#DC2626" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '.95rem' }}>🚨 Emergency Case Flagged by AI</div>
              <div style={{ color: '#B91C1C', fontSize: '.82rem', marginTop: 2 }}>
                This matter indicates an urgent legal situation (arrest/FIR/eviction/threat). Showing currently available lawyers first.
              </div>
            </div>
          </div>
        )}

        {/* Case Outcome Estimate Card */}
        {spec && (
          <div style={st.estimateCard}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={st.estimateIcon}><TrendingUp size={18} color="#7B1D2E"/></div>
              <div style={{flex:1}}>
                {estimateLoading ? (
                  <div style={st.estimateSkeleton}/>
                ) : caseEstimate && !caseEstimate.insufficientData ? (
                  <>
                    <div style={{fontWeight:800,fontSize:'.95rem',color:'#1A0A0D'}}>
                      Cases like this:&nbsp;
                      <span style={{color:'#16A34A'}}>{caseEstimate.winRate}% resolved favourably</span>,&nbsp;
                      avg <span style={{color:'#7B1D2E'}}>{caseEstimate.avgDurationDays} days</span>
                      &nbsp;<span style={{color:'#6B4050',fontWeight:600,fontSize:'.82rem'}}>(based on {caseEstimate.sampleSize} past cases on this platform)</span>
                    </div>
                  </>
                ) : (
                  <div style={{fontWeight:700,fontSize:'.9rem',color:'#6B4050'}}>
                    {caseEstimate?.insufficientData ? 'Not enough data yet for this case type' : `Estimating outcomes for ${spec}...`}
                  </div>
                )}
              </div>
              <div style={{position:'relative'}} className="estimate-tooltip-wrap">
                <Info size={16} color="#9CA3AF" style={{cursor:'help'}}/>
                <div style={st.tooltip}>Statistical estimate from platform history, not a prediction for your specific case.</div>
              </div>
            </div>
          </div>
        )}

        <div style={st.layout} className="search-layout-responsive">
          {/* Sidebar Filters */}
          <aside style={st.sidebar} className={`search-sidebar-mobile ${showFilters ? 'open' : ''}`}>
            <div style={st.sbHeader}>
              <h3 style={{fontWeight: 800, fontSize: '1.2rem', color:'#1A0A0D'}}>Filters</h3>
              <button className="show-mobile" style={st.closeBtn} onClick={() => setShowFilters(false)}><X size={24}/></button>
            </div>
            
            <div style={{overflowY: 'auto', flex: 1, paddingRight: 5}}>
              {/* Free-Text AI Classifier Input */}
              <div style={st.filterGroup}>
                <label style={st.label}><Sparkles size={14} color="#7B1D2E"/> Describe Problem (AI Classifier)</label>
                <textarea
                  style={{ ...st.input, minHeight: 60, resize: 'vertical', fontSize: '.82rem' }}
                  placeholder="Or describe your problem in your own words..."
                  value={aiProblemText}
                  onChange={e => setAiProblemText(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAiClassify}
                  disabled={classifying || !aiProblemText.trim()}
                  style={{
                    marginTop: 6,
                    width: '100%',
                    padding: '.45rem .8rem',
                    background: 'var(--bur)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  {classifying ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />}
                  {classifying ? 'Analyzing with AI...' : 'AI Auto-Match Specialization'}
                </button>
              </div>

              <div style={st.filterGroup}>
                <label style={st.label}><Scale size={14} color="#7B1D2E"/> Specialization</label>
                <select style={st.select} value={spec} onChange={e => setSpec(e.target.value)}>
                  <option value="">All Practice Areas</option>
                  {SPECS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                </select>
                {aiNote && (
                  <div style={{ fontSize: '.72rem', color: '#166534', background: '#F0FDF4', padding: '.35rem .6rem', borderRadius: '8px', marginTop: 4, fontWeight: 700, border: '1px solid #BBF7D0' }}>
                    {aiNote}
                  </div>
                )}
              </div>


              <div style={st.filterGroup}>
                <label style={st.label}><MapPin size={14} color="#7B1D2E"/> Location</label>
                <input 
                  style={st.input} 
                  placeholder="City or Pincode" 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), setDebouncedCity(e.target.value))}
                />
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
                    <Link to="/join-as-lawyer" style={{fontSize:'.88rem',fontWeight:700,color:'#8B1A2A',textDecoration:'none'}}>Are you a lawyer? List your profile free →</Link>
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

            {loading && lawyers.length === 0 && (
              <div style={st.grid} className="grid-lawyers">
                {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {loading && lawyers.length > 0 && (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--bur)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Loader2 className="spinner" size={20} /> Updating results...
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
  empty: { textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '24px', border: '1px solid #EDD5BE' },

  estimateCard: { background: '#fff', border: '1.5px solid #E8C9A8', borderRadius: 16, padding: '1rem 1.4rem', marginBottom: '1.8rem', boxShadow: '0 4px 20px rgba(123,29,46,0.05)' },
  estimateIcon: { width: 38, height: 38, borderRadius: 10, background: '#FDF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #E8C9A8' },
  estimateSkeleton: { height: 18, width: '70%', borderRadius: 8, background: 'linear-gradient(90deg,#f0e8e0 25%,#faf4ef 50%,#f0e8e0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' },
  tooltip: { position: 'absolute', right: 0, top: '130%', background: '#1A0A0D', color: '#F5E6D3', fontSize: '.75rem', fontWeight: 600, padding: '.5rem .85rem', borderRadius: 10, width: 220, lineHeight: 1.5, zIndex: 50, pointerEvents: 'none', opacity: 0, transition: 'opacity .2s', whiteSpace: 'normal' }
}

