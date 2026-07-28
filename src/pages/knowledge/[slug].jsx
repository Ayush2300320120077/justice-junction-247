import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Share2, MessageSquare, ChevronLeft, BookOpen } from 'lucide-react'
import { ARTICLES } from '../rights'

export async function getStaticPaths() {
  return {
    paths: ARTICLES.map(a => ({ params: { slug: a.id } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const article = ARTICLES.find(a => a.id === params.slug)
  if (!article) return { notFound: true }
  // Serialize: remove React icon elements which aren't serializable
  const { icon, ...rest } = article
  return { props: { article: rest } }
}

export default function ArticlePage({ article }) {
  const ogTitle = `${article.title} — Justice Junction 24/7`
  const ogDesc = article.desc
  const ogUrl = `https://justice-junction-app.vercel.app/knowledge/${article.id}`
  const shareText = encodeURIComponent(`${article.title} — Know your rights with Justice Junction 24/7: ${ogUrl}`)

  const handleShare = (platform) => {
    const links = {
      whatsapp: `https://wa.me/?text=${shareText}`,
      twitter: `https://twitter.com/intent/tweet?text=${shareText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ogUrl)}`
    }
    window.open(links[platform], '_blank')
  }

  // Convert markdown-like content to paragraphs and headers
  const renderContent = (text) => {
    const lines = text.trim().split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**') && !line.slice(2,-2).includes('**')) {
        // Bold heading
        return <h3 key={i} style={cs.h3}>{line.slice(2,-2)}</h3>
      }
      if (line.startsWith('- ')) {
        return <li key={i} style={cs.li}>{renderInline(line.slice(2))}</li>
      }
      if (line === '') return <div key={i} style={{height:'0.8rem'}}/>
      return <p key={i} style={cs.p}>{renderInline(line)}</p>
    })
  }

  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2,-2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="page-wrap" style={{background:'var(--cream)'}}>
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDesc} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.desc,
          "publisher": { "@type": "Organization", "name": "Justice Junction 24/7", "url": "https://justice-junction-app.vercel.app/" },
          "url": ogUrl
        })}} />
      </Helmet>

      <div className="container" style={{padding:'3rem 5vw', maxWidth:860}}>
        <Link to="/knowledge-hub" style={cs.back}><ChevronLeft size={16}/> Back to Knowledge Hub</Link>

        <article style={cs.article}>
          {/* Header */}
          <header style={cs.header}>
            <span style={cs.category}>{article.category}</span>
            <h1 style={cs.h1}>{article.title}</h1>
            <div style={cs.meta}>
              <span style={cs.metaItem}><Clock size={14}/> {article.readTime}</span>
              <span style={cs.metaItem}><BookOpen size={14}/> Justice Junction 24/7</span>
            </div>
            <p style={cs.lead}>{article.desc}</p>
          </header>

          {/* Share Bar */}
          <div style={cs.shareBar}>
            <span style={{fontWeight:700, fontSize:'.82rem', color:'var(--txt-3)'}}>Share this guide:</span>
            <button style={{...cs.shareBtn, background:'#25D366'}} onClick={() => handleShare('whatsapp')}>WhatsApp</button>
            <button style={{...cs.shareBtn, background:'#1DA1F2'}} onClick={() => handleShare('twitter')}>Twitter</button>
            <button style={{...cs.shareBtn, background:'#0A66C2'}} onClick={() => handleShare('linkedin')}>LinkedIn</button>
          </div>

          {/* Content */}
          <div style={cs.content}>
            <ul style={{listStyle:'disc', paddingLeft:'1.5rem', marginBottom:0}}>
              {renderContent(article.content)}
            </ul>
          </div>

          {/* CTA */}
          <div style={cs.lawyerCTA}>
            <div style={cs.ctaText}>
              <MessageSquare size={24} color="var(--bur)"/>
              <div>
                <div style={{fontWeight:800, fontSize:'1.05rem', marginBottom:4}}>Talk to a Lawyer About This</div>
                <div style={{fontSize:'.88rem', color:'var(--txt-3)'}}>Get personalised legal advice on your specific situation from a verified expert.</div>
              </div>
            </div>
            <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
              <Link to="/search" className="btn btn-primary">Find a Lawyer →</Link>
              <a href={`https://wa.me/919188371233?text=${encodeURIComponent(`Hi, I read the article "${article.title}" on Justice Junction 24/7 and need legal advice.`)}`}
                target="_blank" rel="noreferrer" className="btn btn-outline">
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Bottom Share */}
          <div style={cs.shareBar}>
            <span style={{fontWeight:700, fontSize:'.82rem', color:'var(--txt-3)'}}>Found this helpful? Share it:</span>
            <button style={{...cs.shareBtn, background:'#25D366'}} onClick={() => handleShare('whatsapp')}>WhatsApp</button>
            <button style={{...cs.shareBtn, background:'#1DA1F2'}} onClick={() => handleShare('twitter')}>Twitter</button>
            <button style={{...cs.shareBtn, background:'#0A66C2'}} onClick={() => handleShare('linkedin')}>LinkedIn</button>
          </div>

          {/* Related Articles */}
          <div style={cs.relatedSection}>
            <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', marginBottom:'1.5rem'}}>More Legal Guides</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem'}}>
              {ARTICLES.filter(a => a.id !== article.id).slice(0,3).map(a => (
                <Link key={a.id} href={`/knowledge/${a.id}`} style={cs.relatedCard}>
                  <span style={{fontSize:'.7rem', fontWeight:800, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.1em'}}>{a.category}</span>
                  <div style={{fontWeight:700, fontSize:'.95rem', marginTop:6, color:'var(--txt)'}}>{a.title}</div>
                  <div style={{fontSize:'.78rem', color:'var(--txt-3)', marginTop:4}}>{a.readTime}</div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

const cs = {
  back: { display:'inline-flex', alignItems:'center', gap:4, fontSize:'.85rem', fontWeight:700, color:'var(--bur)', marginBottom:'2rem', textDecoration:'none' },
  article: { background:'#fff', borderRadius:'24px', border:'1px solid var(--border)', overflow:'hidden' },
  header: { padding:'3rem 3rem 2rem', borderBottom:'1px solid var(--border)', background:'linear-gradient(to bottom, var(--cream), #fff)' },
  category: { fontSize:'.72rem', fontWeight:800, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.12em', display:'block', marginBottom:12 },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:800, lineHeight:1.2, marginBottom:'1rem' },
  meta: { display:'flex', gap:'1.5rem', marginBottom:'1.2rem' },
  metaItem: { display:'flex', alignItems:'center', gap:6, fontSize:'.8rem', fontWeight:600, color:'var(--txt-3)' },
  lead: { fontSize:'1.05rem', color:'var(--txt-2)', lineHeight:1.7, fontStyle:'italic', borderLeft:'3px solid var(--bur)', paddingLeft:'1rem', margin:0 },
  shareBar: { padding:'1rem 3rem', background:'var(--cream-2)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'0.8rem', flexWrap:'wrap' },
  shareBtn: { padding:'.4rem 1rem', borderRadius:'8px', border:'none', color:'#fff', fontSize:'.78rem', fontWeight:700, cursor:'pointer' },
  content: { padding:'2.5rem 3rem' },
  h3: { fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:800, color:'var(--bur)', marginTop:'1.8rem', marginBottom:'.8rem' },
  p: { lineHeight:1.8, color:'var(--txt-2)', marginBottom:'0.4rem', fontSize:'.95rem' },
  li: { lineHeight:1.8, color:'var(--txt-2)', marginBottom:'.3rem', fontSize:'.95rem' },
  lawyerCTA: { margin:'2rem 3rem', background:'var(--cream-2)', border:'2px solid var(--bur)', borderRadius:'20px', padding:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' },
  ctaText: { display:'flex', gap:'1rem', alignItems:'flex-start', flex:1 },
  relatedSection: { padding:'2.5rem 3rem', borderTop:'1px solid var(--border)', background:'var(--cream-2)' },
  relatedCard: { background:'#fff', padding:'1.2rem', borderRadius:'14px', border:'1px solid var(--border)', textDecoration:'none', display:'block', transition:'all .2s' },
}
