import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'

export default function KnowledgeArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/articles/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Article not found')
        return r.json()
      })
      .then(data => { setArticle(data.article || data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [slug])

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      {article && (
        <Helmet>
          <title>{article.title} — Justice Junction Knowledge Hub</title>
          <meta name="description" content={article.description || article.title} />
        </Helmet>
      )}
      <div className="container" style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
        <button onClick={() => navigate('/knowledge-hub')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#7B1D2E', fontWeight: 700, cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem' }}>
          <ArrowLeft size={18} /> Back to Knowledge Hub
        </button>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : error ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#888' }}>Article not found.</p>
            <Link to="/knowledge-hub" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Articles</Link>
          </div>
        ) : article ? (
          <article className="card" style={{ padding: '2.5rem' }}>
            {article.coverImageUrl && (
              <img src={article.coverImageUrl} alt={article.title} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 12, marginBottom: '2rem' }} />
            )}
            {article.category && (
              <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Tag size={12} /> {article.category}
              </span>
            )}
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#1A0A0D', marginBottom: '1rem', lineHeight: 1.3 }}>{article.title}</h1>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', color: '#888', fontSize: '.85rem', flexWrap: 'wrap' }}>
              {article.createdAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} />
                  {new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
              {article.views !== undefined && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={14} /> {article.views} views
                </span>
              )}
            </div>
            <div
              style={{ lineHeight: 1.8, color: '#333', fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        ) : null}
      </div>
    </div>
  )
}
