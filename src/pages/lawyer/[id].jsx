import Head from 'next/head'
import { useRouter } from 'next/router'
import { MapPin, Landmark, Star, CheckCircle, Clock, ShieldCheck, MessageCircle, Gavel, Languages, Phone, Calendar, Video } from 'lucide-react'
import connectDB from '../../../middleware/db'
import Lawyer from '../../../models/Lawyer'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import LinkNext from 'next/link'

export async function getServerSideProps(context) {
  try {
    await connectDB()
    const { id } = context.params
    const lawyerData = await Lawyer.findById(id).lean()
    
    if (!lawyerData) {
      return { notFound: true }
    }

    const lawyer = JSON.parse(JSON.stringify(lawyerData))
    return { props: { lawyer } }
  } catch (err) {
    console.error(err)
    return { notFound: true }
  }
}

export default function LawyerProfile({ lawyer }) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  
  const ogTitle = `${lawyer.name} — ${lawyer.specializations?.[0] || 'Lawyer'} in ${lawyer.city}`
  const ogDesc = `Book a consultation with ${lawyer.name}. ${lawyer.experience} years of experience in ${lawyer.city}. Verified by Justice Junction 24/7.`
  const ogUrl = `https://justice-junction-app.vercel.app/lawyer/${lawyer._id}`

  const handleBook = () => {
    if (!isLoggedIn) { router.push('/login'); return }
    router.push(`/book?lawyerId=${lawyer._id}&lawyerName=${encodeURIComponent(lawyer.name)}&fee=${lawyer.consultationFee}`)
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${lawyer.name}, I found you on Justice Junction 24/7. I need help with a legal issue. Can we schedule a consultation?`)
    window.open(`https://wa.me/91XXXXXXXXXX?text=${text}`, '_blank')
  }

  return (
    <div className="page-wrap" style={{background:'var(--cream)', paddingBottom: '5rem', paddingTop: 95}}>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDesc} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": lawyer.name,
            "description": lawyer.bio,
            "image": "https://justice-junction-app.vercel.app/og-image.png",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": lawyer.city,
              "addressRegion": lawyer.state,
              "addressCountry": "IN"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": lawyer.averageRating,
              "reviewCount": lawyer.totalReviews
            },
            "priceRange": `₹${lawyer.consultationFee}`
          })
        }} />
      </Head>

      <div className="container" style={{paddingTop:'3rem'}}>
        {/* Breadcrumbs */}
        <div style={{marginBottom: '1.5rem', fontSize: '.85rem', color: 'var(--txt-3)'}}>
          <LinkNext href="/" style={{color: 'inherit'}}>Home</LinkNext> / <LinkNext href="/search" style={{color: 'inherit'}}>Lawyers</LinkNext> / <span style={{color: 'var(--bur)', fontWeight: 700}}>{lawyer.name}</span>
        </div>

        <div style={s.layout} className="grid-profile">
          {/* Main Info */}
          <div style={s.main}>
            <div style={s.card}>
              <div style={s.profileHeader}>
                <div style={s.avatar}>
                  {lawyer.name.split(' ').map(n=>n[0]).join('').toUpperCase()}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom: 8}}>
                    <h1 style={s.h1}>{lawyer.name}</h1>
                    {lawyer.isVerified && (
                      <div style={s.barBadge}>
                        <ShieldCheck size={14}/>
                        <span>Bar Council Verified</span>
                      </div>
                    )}
                  </div>
                  <div style={s.sub}>{lawyer.specializations?.join(' · ')}</div>
                  <div style={s.metaRow}>
                    <span style={s.metaItem}><MapPin size={14}/> {lawyer.city}, {lawyer.state}</span>
                    <span style={s.metaItem}><Landmark size={14}/> {lawyer.experience} Years Experience</span>
                    <span style={s.metaItem}><Star size={14} fill="var(--gold)" color="var(--gold)"/> {lawyer.averageRating} ({lawyer.totalReviews} Reviews)</span>
                  </div>
                </div>
              </div>

              <div className="divider" style={{margin: '2rem 0'}} />

              <div style={s.section}>
                <h2 style={s.h2}>Professional Summary</h2>
                <p style={s.bio}>{lawyer.bio || 'No professional bio available for this advocate.'}</p>
              </div>

              <div style={s.section}>
                <h2 style={s.h2}>Practice Areas</h2>
                <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
                  {lawyer.specializations?.map(s => (
                    <span key={s} className="tag" style={{padding: '.5rem 1rem', fontSize: '.9rem'}}>{s}</span>
                  ))}
                </div>
              </div>

              {lawyer.courts && lawyer.courts.length > 0 && (
                <div style={s.section}>
                  <h2 style={s.h2}><Gavel size={18} style={{marginRight: 8, verticalAlign:'middle'}}/> Courts Practiced In</h2>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    {lawyer.courts.map(c => (
                      <span key={c} style={s.courtTag}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={s.section}>
                <h2 style={s.h2}><Languages size={18} style={{marginRight: 8, verticalAlign:'middle'}}/> Languages Known</h2>
                <div style={{display:'flex', gap:12}}>
                  {lawyer.languages?.map(l => (
                    <span key={l} style={{fontSize: '0.95rem', fontWeight: 600, color: 'var(--txt-2)'}}>{l}</span>
                  )) || 'Not specified'}
                </div>
              </div>
              
              <div style={s.section}>
                <h2 style={s.h2}>Bar Registration</h2>
                <div style={{background: 'var(--cream-2)', padding: '1rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', display: 'inline-block'}}>
                  <span style={{fontSize: '.85rem', color: 'var(--txt-3)', fontWeight: 700}}>REGISTRATION NO: </span>
                  <span style={{fontFamily: 'monospace', fontWeight: 800, color: 'var(--bur)'}}>{lawyer.barRegistrationNumber}</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{...s.card, marginTop:'2rem'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={s.h2}>Client Reviews</h2>
                <div style={{display:'flex', alignItems:'center', gap:4, fontWeight: 800, color: 'var(--gold)'}}>
                  <Star size={20} fill="var(--gold)"/> {lawyer.averageRating} / 5
                </div>
              </div>
              {lawyer.reviews?.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  {lawyer.reviews.map((r, i) => (
                    <div key={i} style={s.review}>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                        <div style={{fontWeight:800, fontSize:'1rem'}}>{r.clientName}</div>
                        <div style={{color:'var(--gold)', fontSize: '.9rem'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                      </div>
                      <p style={{fontSize:'0.9rem', color:'var(--txt-2)', lineHeight: 1.6}}>{r.comment}</p>
                      <div style={{fontSize: '.75rem', color: 'var(--txt-3)', marginTop: 8}}>
                        {new Date(r.createdAt).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '2rem', background: 'var(--cream-2)', borderRadius: 'var(--r-sm)'}}>
                  <p style={{color:'var(--txt-3)', fontSize:'0.95rem'}}>No reviews yet for this advocate.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Booking */}
          <div style={s.sidebar}>
            <div style={s.stickyBox}>
              <div style={s.bookingCard}>
                <div style={{marginBottom:'2rem'}}>
                  <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--txt-3)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8}}>Consultation Fee</div>
                  <div style={{display:'flex', alignItems:'baseline', gap:4}}>
                    <span style={{fontSize:'2.4rem', fontWeight:800, color:'var(--bur)'}}>₹{lawyer.consultationFee?.toLocaleString()}</span>
                    <span style={{fontSize:'0.9rem', color:'var(--txt-3)', fontWeight: 600}}>/ Session</span>
                  </div>
                  <p style={{fontSize: '.8rem', color: 'var(--txt-3)', marginTop: 4}}>Includes 30 mins video consultation & case summary.</p>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  <button className="btn btn-primary btn-xl" style={{width:'100%', borderRadius: 16}} onClick={handleBook}>
                    Book Appointment Now
                  </button>
                  <button className="btn btn-outline btn-lg" style={{width:'100%', gap:8, borderRadius: 16}} onClick={handleWhatsApp}>
                    <MessageCircle size={20}/> Send WhatsApp Message
                  </button>
                </div>

                <div style={s.availabilityBox}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span className="pulse-dot" style={{background: lawyer.isAvailable ? 'var(--green)' : 'var(--border)'}} />
                    <span style={{fontSize: '0.9rem', fontWeight: 800, color: lawyer.isAvailable ? 'var(--green)' : 'var(--txt-3)'}}>
                      {lawyer.isAvailable ? 'Available for Consult' : 'Currently Unavailable'}
                    </span>
                  </div>
                  <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6}}>
                    <div style={s.availItem}><Clock size={14}/> Next slot: Today, 4:00 PM</div>
                    <div style={s.availItem}><Video size={14}/> Secure Video Consultation</div>
                  </div>
                </div>

                <div style={s.trustFooter}>
                  <ShieldCheck size={14} color="var(--green)"/>
                  <span>Payment protected by Justice Junction</span>
                </div>
              </div>
              
              <div style={s.helpCard}>
                <div style={{fontWeight: 800, fontSize: '.9rem', marginBottom: 8}}>Need help with booking?</div>
                <div style={{fontSize: '.8rem', color: 'var(--txt-2)', marginBottom: 12}}>Our legal coordinators are here to assist you 24/7.</div>
                <button className="btn btn-sm btn-outline" style={{width: '100%'}}>Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  layout: { display:'grid', gridTemplateColumns:'1fr 380px', gap:'2.5rem' },
  main: { minWidth: 0 },
  sidebar: { },
  stickyBox: { position:'sticky', top:110 },
  card: { background:'#fff', border:'1px solid var(--border)', borderRadius:'24px', padding:'2.5rem', boxShadow:'0 10px 40px rgba(0,0,0,0.03)' },
  profileHeader: { display:'flex', gap:'2rem', alignItems:'flex-start' },
  avatar: { width:100, height:100, borderRadius:28, background: 'linear-gradient(135deg, var(--bur), var(--bur-d))', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', fontWeight:800, flexShrink:0 },
  h1: { fontSize:'2.2rem', margin:0, lineHeight:1.1, fontWeight: 800, fontFamily: "'Playfair Display', serif" },
  barBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,163,74,0.1)', color: 'var(--green)', padding: '.3rem .8rem', borderRadius: 50, fontSize: '.75rem', fontWeight: 800 },
  sub: { fontSize:'1.1rem', color:'var(--bur)', fontWeight: 700, marginTop: 8, marginBottom: 16 },
  metaRow: { display:'flex', gap:'1.5rem', flexWrap:'wrap' },
  metaItem: { fontSize:'0.9rem', color:'var(--txt-3)', display:'flex', alignItems:'center', gap:6, fontWeight: 500 },
  h2: { fontSize:'1.3rem', marginBottom:'1.2rem', fontWeight: 800, color: 'var(--txt)' },
  bio: { fontSize:'1rem', color:'var(--txt-2)', lineHeight:1.8 },
  section: { marginTop:'2.5rem' },
  courtTag: { padding: '.5rem 1rem', background: '#f0f0f0', borderRadius: '10px', fontSize: '.85rem', fontWeight: 700, color: 'var(--txt-2)', border: '1px solid var(--border)' },
  review: { paddingBottom:'1.5rem', borderBottom:'1px solid var(--border)' },
  bookingCard: { background:'#fff', border:'1px solid var(--border)', borderRadius:'24px', padding:'2rem', boxShadow:'0 20px 60px rgba(0,0,0,0.08)' },
  availabilityBox: { marginTop:'2rem', padding:'1.2rem', background:'var(--cream-2)', borderRadius:'16px', border: '1px solid var(--border)' },
  availItem: { fontSize: '.8rem', color: 'var(--txt-3)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 },
  trustFooter: { marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: '.7rem', color: 'var(--txt-3)', fontWeight: 700 },
  helpCard: { marginTop: '1rem', background: 'var(--bur)', color: '#fff', padding: '1.5rem', borderRadius: '24px' }
}
