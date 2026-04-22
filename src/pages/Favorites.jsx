import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API } from '../api'
import LawyerCard from '../components/LawyerCard'
import { useToast } from '../context/ToastContext'

export default function Favorites() {
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const load = async () => {
    const ids = JSON.parse(localStorage.getItem('jj_favorites') || '[]')
    if (!ids.length) { setLawyers([]); setLoading(false); return }
    try {
      const results = await Promise.all(ids.map(id => API.getLawyer(id).catch(() => null)))
      setLawyers(results.filter(Boolean).map(r => r.lawyer))
    } catch (err) {
      showToast('Could not load favorites', 'error')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { window.addEventListener('favoritesUpdated', load); return () => window.removeEventListener('favoritesUpdated', load) }, [])

  return (
    <div className="page-wrap" style={{paddingTop:100}}>
      <div className="container" style={{padding:'2rem 5vw 4rem'}}>
        <div style={{marginBottom:'2rem'}}>
          <div className="section-label">Your Saved Lawyers</div>
          <h1 className="section-title">Saved <em>Lawyers</em></h1>
          <p style={{color:'var(--text-muted)'}}>Lawyers you have saved for quick access. Click ❤️ on any card to save or remove.</p>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : lawyers.length === 0 ? (
          <div style={{textAlign:'center',padding:'5rem 2rem',background:'#fff',borderRadius:'var(--radius-xl)',border:'1px solid var(--border)'}}>
            <div style={{fontSize:'3.5rem',marginBottom:'1rem'}}>🤍</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',marginBottom:'0.5rem'}}>No saved lawyers yet</h3>
            <p style={{color:'var(--text-muted)',marginBottom:'1.5rem'}}>Browse lawyers and click the heart icon to save them here.</p>
            <Link to="/search" className="btn btn-primary btn-lg">Find Lawyers →</Link>
          </div>
        ) : (
          <>
            <div style={{fontSize:'0.88rem',color:'var(--text-muted)',marginBottom:'1.5rem'}}>{lawyers.length} saved lawyer{lawyers.length!==1?'s':''}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.5rem'}}>
              {lawyers.map(l => <LawyerCard key={l._id} lawyer={l} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
