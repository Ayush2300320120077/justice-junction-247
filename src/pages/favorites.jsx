import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react'
import LawyerCard from '../components/LawyerCard'
import { API } from '../api'
import { Heart, Search } from 'lucide-react'

export default function Favorites() {
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const ids = JSON.parse(localStorage.getItem('jj_favorites') || '[]')
      if (ids.length === 0) { setLawyers([]); setLoading(false); return }
      
      // We'll fetch all lawyers and filter client-side for simplicity in demo
      const data = await API.getLawyers({ limit: 100 })
      setLawyers(data.lawyers.filter(l => ids.includes(l._id)))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const handleUpdate = () => load()
    window.addEventListener('favoritesUpdated', handleUpdate)
    return () => window.removeEventListener('favoritesUpdated', handleUpdate)
  }, [])

  return (
    <div className="page-wrap" style={{background: '#F8F9FA'}}>
      <Helmet>
        <title>Saved Lawyers — Justice Junction 24/7</title>
      </Helmet>
      <div className="container" style={{paddingTop: '8rem', paddingBottom: '5rem'}}>
        <div style={{marginBottom: '2rem'}}>
          <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 800}}>Your Saved Lawyers</h1>
          <p style={{color: 'var(--txt-3)'}}>Advocates you've shortlisted for future consultation.</p>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : lawyers.length === 0 ? (
          <div style={{textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '32px', border: '1px solid var(--border)'}}>
            <Heart size={64} color="var(--border-2)" strokeWidth={1} />
            <h2 style={{marginTop: '1.5rem', fontWeight: 800}}>No saved lawyers</h2>
            <p style={{color: 'var(--txt-3)', marginBottom: '2rem'}}>Shortlist lawyers to easily find them later.</p>
            <Link to="/search" className="btn btn-primary">Browse Lawyers</Link>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem'}}>
            {lawyers.map(l => <LawyerCard key={l._id} lawyer={l} />)}
          </div>
        )}
      </div>
    </div>
  )
}
