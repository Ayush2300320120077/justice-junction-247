import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, Landmark, Star, ShieldCheck, Award, MessageCircle, Gavel, Languages, Clock, Briefcase, Globe, ExternalLink, CalendarDays, Video } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LawyerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/lawyers/${id}`)
      .then(r => r.json())
      .then(data => {
        setLawyer(data.lawyer || data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ paddingTop: 140, textAlign: 'center' }}><div className="spinner" /></div>
  if (!lawyer || !lawyer._id) return <div style={{ paddingTop: 140, textAlign: 'center' }}><p>Lawyer not found.</p></div>

  const ogTitle = `${lawyer.name} — ${lawyer.specializations?.[0] || 'Lawyer'} in ${lawyer.city}`
  const ogDesc = `Book a consultation with ${lawyer.name}. ${lawyer.experience} years of experience in ${lawyer.city}. Verified by Justice Junction 24/7.`
  const ogUrl = `https://justice-junction-app.vercel.app/lawyer/${lawyer._id}`

  const handleBook = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    navigate(`/book?lawyerId=${lawyer._id}&lawyerName=${encodeURIComponent(lawyer.name)}&fee=${lawyer.consultationFee}`)
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${lawyer.name}, I found you on Justice Junction 24/7. I need help with a legal issue. Can we schedule a consultation?`)
    window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '919188371233'}?text=${text}`, '_blank')
  }

  return (
    <div className="page-reveal" style={{ background: 'var(--cream)', paddingBottom: '5rem', paddingTop: '90px' }}>
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDesc} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Helmet>

      {/* Hero */}
      <div className="profile-hero parallax" style={{ padding: '3rem 0', background: 'linear-gradient(135deg, #7B1D2E 0%, #5C1521 100%)', color: '#fff' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '1rem', fontSize: '.85rem', color: 'rgba(255,255,255,0.7)' }}>
            <Link to="/" style={{ color: 'inherit' }}>Home</Link> / <Link to="/search" style={{ color: 'inherit' }}>Lawyers</Link> / <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{lawyer.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <h1 className="boutique-heading" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.3rem)', color: '#fff', fontStyle: 'normal', margin: 0 }}>Adv. {lawyer.name}</h1>
            {lawyer.isVerified && (
              <div style={{ ...s.barBadge, background: '#e8c9a8', color: '#1A0A0D' }}>
                <ShieldCheck size={14} />
                <span>Bar Council Verified</span>
              </div>
            )}
            {/* Subscription badge — shown only when plan is pro/elite AND not expired.
                Intentionally uses a distinct teal palette so clients never confuse
                a paid membership with a bar-council credential check. */}
            {(['pro', 'elite'].includes(lawyer.subscription)) &&
             lawyer.subscriptionExpiry &&
             new Date(lawyer.subscriptionExpiry) > new Date() && (
              <div style={{
                ...s.barBadge,
                background: lawyer.subscription === 'elite'
                  ? 'linear-gradient(135deg, #0F766E, #0D9488)'
                  : 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
              }}>
                <Award size={14} />
                <span>{lawyer.subscription === 'elite' ? 'Elite Member' : 'Pro Member'}</span>
              </div>
            )}
            {lawyer.designation && (
              <div style={{ ...s.barBadge, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                <Briefcase size={14} />
                <span>{lawyer.designation}</span>
              </div>
            )}
          </div>
          <div style={{ fontSize: '1.2rem', color: '#e8c9a8', fontWeight: 700, marginBottom: '1.5rem' }}>{lawyer.specializations?.join(' · ')}</div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <span style={{ ...s.metaItem, color: 'rgba(255,255,255,0.9)' }}><MapPin size={16} /> {lawyer.city}, {lawyer.state}</span>
            <span style={{ ...s.metaItem, color: 'rgba(255,255,255,0.9)' }}><Landmark size={16} /> {lawyer.experience} Years Experience</span>
            <span style={{ ...s.metaItem, color: 'rgba(255,255,255,0.9)' }}><Star size={16} fill="#e8c9a8" color="#e8c9a8" /> {lawyer.averageRating || 5.0} ({lawyer.totalReviews || 0} Reviews)</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 5, maxWidth: 1100, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ ...s.layout, marginTop: '2rem' }} className="grid-profile">
          {/* Main Info */}
          <div style={s.main}>
            <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--sh-xl)' }}>
              <div style={s.section}>
                <h2 style={s.h2}>Professional Summary</h2>
                <p style={s.bio}>{lawyer.bio || 'No professional bio available for this advocate.'}</p>
              </div>

              <div style={s.section}>
                <h2 style={s.h2}>Practice Areas</h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {lawyer.specializations?.map(spec => (
                    <span key={spec} className="badge badge-primary" style={{ padding: '.5rem 1rem', fontSize: '.9rem' }}>{spec}</span>
                  ))}
                </div>
              </div>

              {lawyer.courts && lawyer.courts.length > 0 && (
                <div style={s.section}>
                  <h2 style={s.h2}><Gavel size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Courts Practiced In</h2>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {lawyer.courts.map(c => (
                      <span key={c} style={s.courtTag}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={s.section}>
                <h2 style={s.h2}><Languages size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Languages Known</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  {lawyer.languages?.map(l => (
                    <span key={l} style={{ fontSize: '0.95rem', fontWeight: 600, color: '#444' }}>{l}</span>
                  )) || 'Not specified'}
                </div>
              </div>

              <div style={s.section}>
                <h2 style={s.h2}>Bar Registration</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ background: '#fdf8f4', padding: '1rem', borderRadius: 8, border: '1px solid #edd5be', display: 'inline-block' }}>
                    <span style={{ fontSize: '.85rem', color: '#888', fontWeight: 700 }}>REGISTRATION NO: </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#7B1D2E' }}>{lawyer.barRegistrationNumber}</span>
                  </div>
                  {lawyer.barCouncilState && (
                    <div style={{ background: '#fdf8f4', padding: '1rem', borderRadius: 8, border: '1px solid #edd5be', display: 'inline-block' }}>
                      <span style={{ fontSize: '.85rem', color: '#888', fontWeight: 700 }}>STATE BAR: </span>
                      <span style={{ fontWeight: 800, color: '#7B1D2E' }}>{lawyer.barCouncilState}</span>
                    </div>
                  )}
                </div>
              </div>

              {(lawyer.linkedinUrl || lawyer.websiteUrl) && (
                <div style={s.section}>
                  <h2 style={s.h2}><Globe size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Online Presence</h2>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {lawyer.linkedinUrl && (
                      <a href={lawyer.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ gap: 6 }}>
                        <ExternalLink size={16} /> LinkedIn Profile
                      </a>
                    )}
                    {lawyer.websiteUrl && (
                      <a href={lawyer.websiteUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ gap: 6 }}>
                        <Globe size={16} /> Personal Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={s.h2}>Client Reviews</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800, color: '#f59e0b' }}>
                  <Star size={20} fill="#f59e0b" color="#f59e0b" /> {lawyer.averageRating || 5.0} / 5
                </div>
              </div>
              {lawyer.reviews?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {lawyer.reviews.map((r, i) => (
                    <div key={i} style={s.review}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{r.clientName}</div>
                        <div style={{ color: '#f59e0b', fontSize: '.9rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#fdf8f4', borderRadius: 8 }}>
                  <p style={{ color: '#888', fontSize: '0.95rem' }}>No reviews yet for this advocate.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Booking */}
          <div style={s.sidebar}>
            <div style={s.stickyBox}>
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Consultation Fee</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7B1D2E' }}>₹{lawyer.consultationFee?.toLocaleString()}</span>
                    <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 600 }}>/ Session</span>
                  </div>
                  <p style={{ fontSize: '.8rem', color: '#888', marginTop: 4 }}>Includes 30 mins video consultation & case summary.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button className="btn btn-primary btn-lg" style={{ width: '100%', borderRadius: 12 }} onClick={handleBook}>
                    Book Appointment Now
                  </button>
                  <button className="btn btn-outline btn-lg" style={{ width: '100%', gap: 8, borderRadius: 12 }} onClick={handleWhatsApp}>
                    <MessageCircle size={20} /> WhatsApp Us
                  </button>
                </div>

                <div style={s.availabilityBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="pulse-dot" style={{ background: '#22c55e' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#22c55e' }}>
                      Available for Consult
                    </span>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={s.availItem}><Clock size={14} /> Next slot: Available today</div>
                    <div style={s.availItem}><Video size={14} /> Secure Video Consultation</div>
                  </div>
                </div>

                <div style={s.trustFooter}>
                  <ShieldCheck size={14} color="#22c55e" />
                  <span>Payment protected by Justice Junction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem' },
  main: { minWidth: 0 },
  sidebar: {},
  stickyBox: { position: 'sticky', top: 110 },
  h2: { fontSize: '1.3rem', marginBottom: '1.2rem', fontWeight: 800, color: '#1A0A0D' },
  bio: { fontSize: '1rem', color: '#444', lineHeight: 1.8 },
  section: { marginTop: '2rem' },
  courtTag: { padding: '.5rem 1rem', background: '#f5e6d3', borderRadius: '8px', fontSize: '.85rem', fontWeight: 700, color: '#1A0A0D' },
  review: { paddingBottom: '1.5rem', borderBottom: '1px solid #edd5be' },
  availabilityBox: { marginTop: '2rem', padding: '1.2rem', background: '#fdf8f4', borderRadius: '12px', border: '1px solid #edd5be' },
  availItem: { fontSize: '.8rem', color: '#555', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 },
  trustFooter: { marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: '.75rem', color: '#888', fontWeight: 700 },
  barBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '.3rem .8rem', borderRadius: 50, fontSize: '.75rem', fontWeight: 800 },
  metaItem: { fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }
}
