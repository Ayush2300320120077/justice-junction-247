import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { API } from '../api'
import LawyerCard from '../components/LawyerCard'
import { useToast } from '../context/ToastContext'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law','Civil Disputes','Divorce']

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [lawyers, setLawyers] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [spec, setSpec] = useState(searchParams.get('specialization') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [maxFee, setMaxFee] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const { showToast } = useToast()

  const load = async (p = 1) => {
    setLoading(true)
    setPage(p)
    try {
      const params = { page: p, sort: sortBy }
      if (spec) params.specialization = spec
      if (city) params.city = city
      if (maxFee) params.maxFee = maxFee
      const data = await API.getLawyers(params)
      setLawyers(data.lawyers)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const seed = async () => {
    try { await API.seedDemo(); showToast('Demo lawyers loaded!'); load() }
    catch (err) { showToast(err.message, 'error') }
  }

  useEffect(() => { load(1) }, [sortBy])

  return (
    <div className="page-wrap" style={{paddingTop:70}}>
      {/* Search Header */}
      <div style={s.header}>
        <h1 style={s.h1}>Find Your Lawyer</h1>
        <p style={{color:'rgba(255,255,255,0.7)',marginBottom:'1.5rem'}}>Search from 2,400+ verified lawyers across India — with transparent pricing.</p>
        <div className="grid-search-main" style={s.searchBar}>
          <div>
            <label style={s.label}>Practice Area</label>
            <select style={s.input} value={spec} onChange={e => setSpec(e.target.value)}>
              <option value="">All Areas</option>
              {SPECS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>City</label>
            <input style={s.input} type="text" placeholder="e.g. Delhi, Mumbai..." value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div>
            <label style={s.label}>Max Fee (₹)</label>
            <select style={s.input} value={maxFee} onChange={e => setMaxFee(e.target.value)}>
              <option value="">Any Price</option>
              <option value="1000">Up to ₹1,000</option>
              <option value="2500">Up to ₹2,500</option>
              <option value="5000">Up to ₹5,000</option>
              <option value="10000">Up to ₹10,000</option>
            </select>
          </div>
          <button className="btn-primary" onClick={() => load(1)} style={{alignSelf:'flex-end',padding:'0.7rem 1.5rem'}}>Search</button>
        </div>
      </div>

      {/* Results */}
      <div style={{padding:'2.5rem 5vw'}}>
        <div style={s.resultsHeader}>
          <div style={{fontSize:'0.88rem',color:'var(--text-muted)'}}>
            {loading ? 'Searching...' : `${total} lawyer${total !== 1 ? 's' : ''} found`}
          </div>
          <select style={{padding:'0.45rem 0.9rem',border:'1.5px solid var(--border)',borderRadius:8,fontFamily:'Nunito,sans-serif',fontSize:'0.85rem',outline:'none'}} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="rating">Top Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : lawyers.length === 0 ? (
          <div style={{textAlign:'center',padding:'4rem'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔍</div>
            <p style={{color:'var(--text-muted)',marginBottom:'1.5rem'}}>No lawyers found. Try different filters.</p>
            <button className="btn-outline" onClick={seed}>Load Demo Lawyers</button>
          </div>
        ) : (
          <>
            <div style={s.grid}>
              {lawyers.map(l => <LawyerCard key={l._id} lawyer={l} />)}
            </div>
            {pages > 1 && (
              <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:'2rem'}}>
                {Array.from({length:pages},(_,i)=>i+1).map(n => (
                  <button key={n} onClick={() => load(n)} style={{padding:'0.4rem 0.9rem',border:'1.5px solid var(--border)',borderRadius:8,background: n===page ? 'var(--burgundy)' : '#fff',color: n===page ? '#fff' : 'var(--text-muted)',cursor:'pointer',fontFamily:'Nunito,sans-serif',fontSize:'0.85rem'}}>{n}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  header: { background:'var(--burgundy)', padding:'5rem 5vw 3rem', color:'#fff' },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:700, marginBottom:8 },
  searchBar: { background:'#fff', borderRadius:12, padding:'1rem', display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:'0.8rem', alignItems:'flex-end' },
  label: { fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:4 },
  input: { width:'100%', padding:'0.6rem 0.9rem', border:'1.5px solid var(--border)', borderRadius:8, fontSize:'0.9rem', color:'var(--text)', fontFamily:'Nunito,sans-serif', outline:'none' },
  resultsHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:8 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' },
}
