import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import LawyerCard from '../components/LawyerCard'
import SkeletonCard from '../components/SkeletonCard'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
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
  const { isLoggedIn } = useAuth()
  
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
    if (!isLoggedIn) {
      showToast('Please log in to use this feature', 'error')
      return
    }
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
    <div style={{ background: '#F5F0EC', minHeight: '100vh' }}>
      <Helmet>
        <title>Find Verified Lawyers in India | Justice Junction 24/7</title>
        <meta name="description" content="Browse and compare top-rated advocates by specialization, fee, and location. Book instant video consultations." />
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .filter-sidebar-inner::-webkit-scrollbar { width: 4px; }
        .filter-sidebar-inner::-webkit-scrollbar-track { background: transparent; }
        .filter-sidebar-inner::-webkit-scrollbar-thumb { background: rgba(123,29,46,0.2); border-radius: 4px; }
        .lawyer-grid-card { animation: fadeInUp 0.4s ease both; }
        .lawyer-grid-card:nth-child(1){animation-delay:.05s}
        .lawyer-grid-card:nth-child(2){animation-delay:.1s}
        .lawyer-grid-card:nth-child(3){animation-delay:.15s}
        .lawyer-grid-card:nth-child(4){animation-delay:.2s}
        .lawyer-grid-card:nth-child(5){animation-delay:.25s}
        .lawyer-grid-card:nth-child(6){animation-delay:.3s}
        .fee-chip:hover { background: #7B1D2E !important; color: #fff !important; }
        .apply-filter-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .reset-btn:hover { background: rgba(123,29,46,0.06) !important; }
        @media(max-width:768px){
          .search-two-col { flex-direction: column !important; }
          .filter-sidebar { width: 100% !important; position: static !important; }
        }
      `}} />

      {/* ── Cinematic Hero ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '9rem 0 5rem',
        backgroundImage: `url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=85')`,
        backgroundSize: 'cover', backgroundPosition: 'center top'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,4,6,0.93) 0%, rgba(92,21,33,0.88) 55%, rgba(10,4,6,0.95) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #F5F0EC)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Breadcrumb pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.22)',
            borderRadius: 30, padding: '.32rem 1rem', marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '.7rem', color: '#F5C4B3', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
              ⚖️ Find Your Advocate
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.2rem, 3.8vw, 2.8rem)',
            fontWeight: 900, color: '#fff', letterSpacing: '-0.04em',
            lineHeight: 1.1, marginBottom: '1rem'
          }}>
            Find the Right <span style={{ color: '#F5C4B3' }}>Legal Expert</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(245,224,200,0.78)', maxWidth: 580, margin: '0 auto 2rem', lineHeight: 1.8 }}>
            Browse <strong style={{ color: '#F5C4B3' }}>1,338+</strong> Bar Council verified advocates across India.
            Filter by area, location, language, fee & availability.
          </p>

        </div>
      </section>

      {/* ── Practice area quick-filter strip ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EDD5BE', padding: '.85rem 0', overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'nowrap', minWidth: 'max-content' }}>
          <span style={{ fontSize: '.72rem', fontWeight: 800, color: '#9A7A84', textTransform: 'uppercase', letterSpacing: '1.5px', flexShrink: 0, marginRight: 4 }}>Quick filter:</span>
          {['Criminal Defence','Family Law','Property Law','Corporate Law','Cyber Law','Bail & FIR','Divorce','Taxation','Labour Law'].map(s => (
            <button key={s} onClick={() => setSpec(s === spec ? '' : s)} style={{
              background: spec === s ? '#7B1D2E' : 'transparent',
              border: `1.5px solid ${spec === s ? '#7B1D2E' : '#E8C9A8'}`,
              color: spec === s ? '#fff' : '#4A2030',
              borderRadius: 30, padding: '.38rem 1rem',
              fontSize: '.78rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.18s', whiteSpace: 'nowrap', flexShrink: 0
            }}>{s}</button>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* Demo Banner */}
        {usingDemo && showDemoBanner && lawyers.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
            background: '#FFFBEB', border: '1px solid #FDE68A',
            borderRadius: 14, padding: '1rem 1.2rem', marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: '1.1rem' }}>🔔</span>
              <div>
                <div style={{ fontWeight: 800, color: '#92400E', fontSize: '.88rem' }}>Showing demo profiles. Real verified lawyers joining soon.</div>
                <div style={{ color: '#B45309', fontSize: '.8rem', marginTop: 2 }}>Register to be notified when live advocates join your city.</div>
              </div>
            </div>
            <button onClick={() => setShowDemoBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B45309', flexShrink: 0, paddingTop: 2 }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Result count + sort strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', border: '1px solid #E8C9A8', borderRadius: 16,
          padding: '1rem 1.4rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'rgba(123,29,46,0.08)', borderRadius: 10,
              padding: '.4rem .8rem', fontFamily: "'Sora', sans-serif",
              fontSize: '1.1rem', fontWeight: 900, color: '#7B1D2E', lineHeight: 1
            }}>{total}</div>
            <div>
              <div style={{ fontWeight: 800, color: '#1A0A0D', fontSize: '.95rem' }}>Verified Advocates Found</div>
              <div style={{ color: '#9A7A84', fontSize: '.75rem', marginTop: 1 }}>
                {spec ? `Specializing in ${spec}` : 'All practice areas'}{city ? ` · ${city}` : ''}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Mobile filter button */}
            <button
              className="show-mobile"
              onClick={() => setShowFilters(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#7B1D2E', color: '#fff', border: 'none', borderRadius: 10, padding: '.55rem 1.1rem', fontSize: '.85rem', fontWeight: 700, cursor: 'pointer' }}
            >
              <Filter size={15} /> Filters
            </button>
            <button onClick={clearFilters} style={{ background: 'rgba(123,29,46,0.06)', border: 'none', borderRadius: 10, padding: '.55rem 1rem', fontSize: '.82rem', fontWeight: 700, color: '#7B1D2E', cursor: 'pointer' }} className="reset-btn">
              Reset All
            </button>
          </div>
        </div>

        {/* Emergency Alert */}
        {urgencyFlag === 'emergency' && (
          <div style={{
            background: '#FEF2F2', border: '1.5px solid #FCA5A5',
            borderRadius: 16, padding: '1rem 1.25rem', marginBottom: '1.2rem',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <AlertTriangle size={22} color="#DC2626" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '.9rem' }}>🚨 Emergency Case Detected by AI</div>
              <div style={{ color: '#B91C1C', fontSize: '.8rem', marginTop: 2 }}>Arrest / FIR / eviction / threat situation. Showing available lawyers first.</div>
            </div>
          </div>
        )}

        {/* Case Outcome Estimate */}
        {spec && (
          <div style={{
            background: '#fff', border: '1.5px solid #E8C9A8',
            borderRadius: 16, padding: '1rem 1.4rem', marginBottom: '1.5rem',
            boxShadow: '0 4px 20px rgba(123,29,46,0.05)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(123,29,46,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={18} color="#7B1D2E" />
            </div>
            <div style={{ flex: 1 }}>
              {estimateLoading ? (
                <div style={{ height: 16, width: '65%', borderRadius: 8, background: 'linear-gradient(90deg,#f0e8e0 25%,#faf4ef 50%,#f0e8e0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
              ) : caseEstimate && !caseEstimate.insufficientData ? (
                <div style={{ fontWeight: 800, fontSize: '.9rem', color: '#1A0A0D' }}>
                  Cases like this:&nbsp;
                  <span style={{ color: '#16A34A' }}>{caseEstimate.winRate}% resolved favourably</span>,&nbsp;
                  avg <span style={{ color: '#7B1D2E' }}>{caseEstimate.avgDurationDays} days</span>
                  &nbsp;<span style={{ color: '#6B4050', fontWeight: 600, fontSize: '.78rem' }}>(based on {caseEstimate.sampleSize} platform cases)</span>
                </div>
              ) : (
                <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#6B4050' }}>
                  {caseEstimate?.insufficientData ? 'Insufficient data for this case type yet.' : `Estimating outcomes for ${spec}…`}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }} className="estimate-tooltip-wrap">
              <Info size={15} color="#9CA3AF" style={{ cursor: 'help' }} />
              <div style={st.tooltip}>Statistical estimate from platform history, not a prediction for your specific case.</div>
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div className="search-two-col" style={{ display: 'flex', gap: '1.8rem', alignItems: 'flex-start' }}>

          {/* ── Sidebar ── */}
          <aside className={`filter-sidebar search-sidebar-mobile ${showFilters ? 'open' : ''}`} style={{
            width: 290, flexShrink: 0,
            background: '#fff', border: '1px solid #E8C9A8',
            borderRadius: 22, overflow: 'hidden',
            position: 'sticky', top: 100, zIndex: 100,
            boxShadow: '0 8px 30px rgba(123,29,46,0.07)',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* Sidebar header */}
            <div style={{
              padding: '1.2rem 1.4rem',
              background: 'linear-gradient(135deg, #7B1D2E, #5C1521)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Filter size={16} color="#F5C4B3" />
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Filters</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={clearFilters} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '.3rem .7rem', color: '#F5C4B3', fontSize: '.72rem', fontWeight: 700, cursor: 'pointer' }}>Reset</button>
                <button className="show-mobile" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F5C4B3', lineHeight: 1 }} onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
            </div>

            {/* Scrollable filter body */}
            <div className="filter-sidebar-inner" style={{ overflowY: 'auto', flex: 1, padding: '1.2rem 1.4rem' }}>

              {/* AI Classifier */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={st.sblabel}><Sparkles size={13} color="#7B1D2E" /> AI Auto-Match</div>
                <textarea
                  style={{ width: '100%', minHeight: 64, resize: 'vertical', border: '1.5px solid #E8C9A8', borderRadius: 12, padding: '.65rem .9rem', fontSize: '.82rem', fontWeight: 600, color: '#1A0A0D', outline: 'none', background: '#FDF6EE', boxSizing: 'border-box' }}
                  placeholder="Describe your legal problem in plain language…"
                  value={aiProblemText}
                  onChange={e => setAiProblemText(e.target.value)}
                />
                <button
                  onClick={handleAiClassify}
                  disabled={classifying || !aiProblemText.trim()}
                  style={{
                    marginTop: 6, width: '100%', padding: '.52rem .8rem',
                    background: classifying ? 'rgba(123,29,46,0.5)' : 'linear-gradient(135deg,#7B1D2E,#5C1521)',
                    color: '#fff', border: 'none', borderRadius: 10,
                    fontSize: '.8rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.2s'
                  }}
                >
                  {classifying ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />}
                  {classifying ? 'AI is analyzing…' : 'AI Auto-Match Specialization'}
                </button>
                {aiNote && (
                  <div style={{ fontSize: '.72rem', color: '#166534', background: '#F0FDF4', padding: '.35rem .6rem', borderRadius: 8, marginTop: 5, fontWeight: 700, border: '1px solid #BBF7D0' }}>{aiNote}</div>
                )}
              </div>

              <div style={st.divider} />

              {/* Specialization */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={st.sblabel}><Scale size={13} color="#7B1D2E" /> Specialization</div>
                <select style={st.sel} value={spec} onChange={e => setSpec(e.target.value)}>
                  <option value="">All Practice Areas</option>
                  {SPECS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                </select>
              </div>

              {/* City */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={st.sblabel}><MapPin size={13} color="#7B1D2E" /> Location</div>
                <input
                  style={st.inp}
                  placeholder="City or Pincode"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), setDebouncedCity(e.target.value))}
                />
              </div>

              {/* Max Fee chips */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={st.sblabel}><DollarSign size={13} color="#7B1D2E" /> Max Consultation Fee</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[1000, 2500, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      className="fee-chip"
                      onClick={() => setMaxFee(maxFee == amt ? '' : amt)}
                      style={{
                        padding: '.55rem .5rem', borderRadius: 10,
                        border: '1.5px solid', borderColor: maxFee == amt ? '#7B1D2E' : '#E8C9A8',
                        background: maxFee == amt ? '#7B1D2E' : '#fff',
                        color: maxFee == amt ? '#fff' : '#1A0D10',
                        fontSize: '.8rem', fontWeight: 800, cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: "'Sora',sans-serif"
                      }}
                    >₹{amt >= 1000 ? (amt / 1000) + 'k' : amt}</button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={st.sblabel}><ChevronDown size={13} color="#7B1D2E" /> Sort By</div>
                <select style={st.sel} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="rating">⭐ Top Rated</option>
                  <option value="experience">🏛️ Most Experienced</option>
                  <option value="price_low">💰 Fee: Low to High</option>
                  <option value="price_high">💎 Fee: High to Low</option>
                </select>
              </div>

              {/* Language */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={st.sblabel}><Globe size={13} color="#7B1D2E" /> Language</div>
                <select style={st.sel} value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="">All Languages</option>
                  {['Hindi','English','Tamil','Bengali','Marathi','Gujarati','Telugu','Kannada','Punjabi','Urdu'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              {/* Availability */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={st.sblabel}><Video size={13} color="#7B1D2E" /> Availability</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['', 'Any Mode'], ['online', '🖥 Online'], ['offline', '🏛 Offline'], ['both', '🌐 Online + Offline']].map(([v, l]) => (
                    <label key={v} style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
                      padding: '9px 12px',
                      background: availability === v ? 'rgba(123,29,46,0.08)' : 'transparent',
                      color: availability === v ? '#7B1D2E' : '#4A2030',
                      borderRadius: 10, transition: 'all 0.18s',
                      border: `1.5px solid ${availability === v ? 'rgba(123,29,46,0.25)' : 'transparent'}`
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: `2px solid ${availability === v ? '#7B1D2E' : '#D1B0B8'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {availability === v && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7B1D2E' }} />}
                      </div>
                      <input type="radio" name="availability" value={v} checked={availability === v} onChange={() => setAvailability(v)} style={{ display: 'none' }} />
                      {l}
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div style={{ marginBottom: '1.4rem' }}>
                <div style={st.sblabel}><Star size={13} color="#7B1D2E" /> Minimum Rating</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['', 'All Ratings'], ['4', '⭐⭐⭐⭐ 4+ Stars'], ['3', '⭐⭐⭐ 3+ Stars']].map(([v, l]) => (
                    <label key={v} style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
                      padding: '9px 12px',
                      background: minRating === v ? 'rgba(123,29,46,0.08)' : 'transparent',
                      color: minRating === v ? '#7B1D2E' : '#4A2030',
                      borderRadius: 10, transition: 'all 0.18s',
                      border: `1.5px solid ${minRating === v ? 'rgba(123,29,46,0.25)' : 'transparent'}`
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: `2px solid ${minRating === v ? '#7B1D2E' : '#D1B0B8'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {minRating === v && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7B1D2E' }} />}
                      </div>
                      <input type="radio" name="minRating" value={v} checked={minRating === v} onChange={() => setMinRating(v)} style={{ display: 'none' }} />
                      {l}
                    </label>
                  ))}
                </div>
              </div>

              {/* Promo box */}
              <div style={{ background: 'linear-gradient(135deg, #7B1D2E, #3D0E16)', borderRadius: 18, padding: '1.3rem', textAlign: 'center', marginTop: '.5rem' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>🌟</div>
                <div style={{ fontWeight: 800, fontSize: '.88rem', color: '#fff', marginBottom: 6 }}>Justice Junction Pro</div>
                <p style={{ fontSize: '.73rem', color: 'rgba(245,196,179,0.8)', lineHeight: 1.6, margin: 0 }}>20% off your first 3 consultations.<br />Use code: <strong style={{ color: '#F5C4B3' }}>JJSTART20</strong></p>
              </div>
            </div>

            {/* Mobile apply button */}
            <div className="show-mobile" style={{ padding: '1rem 1.4rem', borderTop: '1px solid #E8C9A8' }}>
              <button className="apply-filter-btn" onClick={() => setShowFilters(false)} style={{
                width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #7B1D2E, #5C1521)',
                color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>Apply Filters</button>
            </div>
          </aside>

          {/* ── Results ── */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {lawyers.length === 0 && !loading ? (
              <div style={{
                textAlign: 'center', padding: '5rem 2rem',
                background: '#fff', borderRadius: 24,
                border: '1px solid #E8C9A8',
                boxShadow: '0 4px 20px rgba(123,29,46,0.05)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, color: '#1A0A0D', fontSize: '1.5rem', marginBottom: '.8rem' }}>
                  No advocates match your filters
                </h2>
                <p style={{ color: '#4A2030', maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.75, fontSize: '.92rem' }}>
                  Our network is growing fast. Try adjusting your filters or remove a few to see more results.
                </p>
                <button onClick={clearFilters} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #7B1D2E, #5C1521)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '.9rem 2rem', fontWeight: 800, fontSize: '.95rem', cursor: 'pointer'
                }}>
                  <X size={16} /> Clear All Filters
                </button>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link to="/join-as-lawyer" style={{ fontSize: '.88rem', fontWeight: 700, color: '#7B1D2E', textDecoration: 'none' }}>
                    Are you a lawyer? List your profile free →
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.4rem' }}>
                {lawyers.map((l, idx) => (
                  <div key={l._id} ref={idx === lawyers.length - 1 ? lastElementRef : null} className="lawyer-grid-card magnetic-hover">
                    <LawyerCard lawyer={l} isDemo={l.isDemo || usingDemo} />
                  </div>
                ))}
              </div>
            )}

            {/* Skeleton loading */}
            {loading && lawyers.length === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.4rem' }}>
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Inline loading */}
            {loading && lawyers.length > 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#7B1D2E', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Loader2 className="spinner" size={20} /> Updating results…
              </div>
            )}

            {/* End of list */}
            {!hasMore && lawyers.length > 0 && (
              <div style={{
                textAlign: 'center', padding: '3rem 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
              }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(123,29,46,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={22} color="#7B1D2E" />
                </div>
                <div style={{ fontWeight: 700, color: '#7B1D2E', fontSize: '.9rem' }}>You've seen all {lawyers.length} matching advocates.</div>
                <div style={{ fontSize: '.8rem', color: '#9A7A84' }}>Try broadening your filters to discover more.</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

const st = {
  sblabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '.7rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 },
  divider: { height: 1, background: '#F0E8E4', margin: '0 0 1.4rem' },
  sel: { width: '100%', padding: '.65rem .9rem', borderRadius: 12, border: '1.5px solid #E8C9A8', background: '#FDF6EE', fontSize: '.88rem', fontWeight: 600, outline: 'none', color: '#1A0D10', boxSizing: 'border-box' },
  inp: { width: '100%', padding: '.65rem .9rem', borderRadius: 12, border: '1.5px solid #E8C9A8', background: '#FDF6EE', fontSize: '.88rem', fontWeight: 600, outline: 'none', color: '#1A0D10', boxSizing: 'border-box' },
  tooltip: { position: 'absolute', right: 0, top: '130%', background: '#1A0A0D', color: '#F5E6D3', fontSize: '.72rem', fontWeight: 600, padding: '.5rem .85rem', borderRadius: 10, width: 220, lineHeight: 1.5, zIndex: 50, pointerEvents: 'none', opacity: 0, transition: 'opacity .2s', whiteSpace: 'normal' }
}


