import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Shield, Clock, Users, Award, MapPin, Scale, Target, Globe, Zap, CheckCircle2, Sparkles, Building2, Quote, ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="page-wrap" style={{ background: '#FDFBF7', color: '#1A0A0D' }}>
      <Helmet>
        <title>About Us — Founder & Mission | Justice Junction 24/7</title>
        <meta name="description" content="Learn about Justice Junction 24/7, founded by Ayush Kumar (Founder & CEO). Discover our mission to democratize legal access across India with 24/7 verified lawyers and transparent pricing." />
        <meta property="og:title" content="About Us — Founder & Mission | Justice Junction 24/7" />
        <meta property="og:description" content="Founded by Ayush Kumar (Founder & CEO), Justice Junction 24/7 connects citizens with Bar Council verified advocates across India." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/about" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ─── Hero Section with High-Res Legal Background ─── */}
      <section style={{
        padding: '9rem 0 7rem',
        backgroundImage: `linear-gradient(135deg, rgba(26, 13, 16, 0.92) 0%, rgba(123, 29, 46, 0.88) 50%, rgba(61, 14, 22, 0.94) 100%), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(245, 196, 179, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '.4rem 1.2rem',
            background: 'rgba(245, 196, 179, 0.12)',
            border: '1px solid rgba(245, 196, 179, 0.3)',
            borderRadius: '30px',
            fontSize: '.85rem',
            fontWeight: 700,
            color: '#F5C4B3',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <Sparkles size={14} color="#F5C4B3" />
            Democratizing Legal Access Across India
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 auto 1.5rem',
            maxWidth: 950
          }}>
            Bridging Citizens & Justice <br />
            <span style={{ color: '#F5C4B3', fontStyle: 'italic', fontWeight: 700 }}>With Transparency, Tech & Trust.</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(249, 238, 228, 0.85)',
            maxWidth: 720,
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
            fontWeight: 400
          }}>
            Justice Junction 24/7 was created to eliminate opacity, exorbitant hidden fees, and delay in finding trusted legal help in India.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/search" className="btn btn-lg" style={{
              background: '#F5C4B3',
              color: '#1A0D10',
              fontWeight: 800,
              padding: '1rem 2.2rem',
              borderRadius: '14px',
              border: 'none',
              boxShadow: '0 8px 25px rgba(245, 196, 179, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}>
              Explore Verified Advocates <ArrowRight size={18} />
            </Link>
            <a href="#founder" className="btn btn-lg" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#FFF',
              fontWeight: 700,
              padding: '1rem 2.2rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)'
            }}>
              Meet Our Founder
            </a>
          </div>
        </div>
      </section>

      {/* ─── Founder & CEO Spotlight Section (Ayush Kumar) ─── */}
      <section id="founder" style={{
        padding: '7rem 0',
        backgroundImage: `linear-gradient(rgba(253, 251, 247, 0.96), rgba(253, 251, 247, 0.96)), url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              fontSize: '.8rem',
              fontWeight: 800,
              color: '#7B1D2E',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 8
            }}>
              Leadership & Vision
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2.6rem',
              fontWeight: 900,
              color: '#1A0A0D'
            }}>
              Meet the <span style={{ color: '#7B1D2E' }}>Founder & CEO</span>
            </h2>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '1px solid #EAE2D8',
            boxShadow: '0 20px 50px rgba(123, 29, 46, 0.08)',
            padding: '3.5rem',
            position: 'relative',
            overflow: 'hidden'
          }} className="mobile-p-6">
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, rgba(123, 29, 46, 0.05) 0%, transparent 100%)',
              borderBottomLeftRadius: '100%',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3.5rem', alignItems: 'center' }} className="mobile-stack">
              {/* Founder Avatar & Badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  position: 'relative',
                  width: '210px',
                  height: '210px',
                  margin: '0 auto 1.5rem',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #7B1D2E 0%, #3D0E16 100%)',
                  boxShadow: '0 15px 35px rgba(123, 29, 46, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '4px solid #FFF',
                  outline: '2px solid #F5C4B3'
                }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    color: '#F5C4B3',
                    letterSpacing: '-1px'
                  }}>
                    AK
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-12px',
                    background: '#7B1D2E',
                    color: '#FFF',
                    padding: '.35rem 1rem',
                    borderRadius: '20px',
                    fontSize: '.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Award size={13} color="#F5C4B3" /> Founder & CEO
                  </div>
                </div>

                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#1A0A0D',
                  margin: '1.2rem 0 4px'
                }}>
                  Ayush Kumar
                </h3>
                <div style={{ fontSize: '.88rem', color: '#7B1D2E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Founder & Chief Executive Officer
                </div>
                <div style={{ fontSize: '.8rem', color: '#6B4050', marginTop: 4, fontWeight: 600 }}>
                  Justice Junction 24/7
                </div>
              </div>

              {/* Founder Story & Message */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7B1D2E', marginBottom: 12 }}>
                  <Quote size={28} />
                  <span style={{ fontSize: '.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Founder's Statement</span>
                </div>

                <p style={{
                  fontSize: '1.12rem',
                  color: '#2D151B',
                  lineHeight: 1.85,
                  margin: '0 0 1.5rem',
                  fontStyle: 'italic',
                  fontWeight: 500
                }}>
                  "I founded Justice Junction 24/7 after witnessing firsthand how difficult, opaque, and intimidating it was for ordinary families in India to find trustworthy legal counsel. Legal protection should not be a luxury reserved for the privileged — it is a fundamental right for every citizen."
                </p>

                <p style={{
                  fontSize: '1rem',
                  color: '#4A2030',
                  lineHeight: 1.8,
                  margin: '0 0 2rem'
                }}>
                  Under Ayush Kumar's leadership, Justice Junction 24/7 has evolved into India’s leading tech-enabled legal marketplace — uniting multi-step Bar Council verification, upfront pricing transparency, instant video consultations, and AI-driven legal classification to make legal help accessible 24 hours a day, 7 days a week.
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  padding: '1.2rem 1.5rem',
                  background: '#FDFBF7',
                  borderRadius: '16px',
                  border: '1px solid #EAE2D8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} color="#16A34A" />
                    <span style={{ fontSize: '.85rem', fontWeight: 700, color: '#1A0A0D' }}>100% Bar Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} color="#16A34A" />
                    <span style={{ fontSize: '.85rem', fontWeight: 700, color: '#1A0A0D' }}>24/7 Legal Assistance</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} color="#16A34A" />
                    <span style={{ fontSize: '.85rem', fontWeight: 700, color: '#1A0A0D' }}>AI Issue Matching</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Impact Statistics Section with High-Quality Background ─── */}
      <section style={{
        padding: '5rem 0',
        backgroundImage: `linear-gradient(135deg, rgba(123, 29, 46, 0.94) 0%, rgba(61, 14, 22, 0.96) 100%), url('https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFF'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#F5C4B3', fontFamily: "'Playfair Display', serif" }}>2024</div>
              <div style={{ fontSize: '.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Year Founded</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#F5C4B3', fontFamily: "'Playfair Display', serif" }}>1,300+</div>
              <div style={{ fontSize: '.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Verified Advocates</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#F5C4B3', fontFamily: "'Playfair Display', serif" }}>100+</div>
              <div style={{ fontSize: '.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Cities Across India</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#F5C4B3', fontFamily: "'Playfair Display', serif" }}>10,000+</div>
              <div style={{ fontSize: '.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Citizens Assisted</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Pillars & Values Section ─── */}
      <section style={{ padding: '7rem 0', background: '#FFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '.8rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>
              Why Choose Justice Junction
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: '#1A0A0D' }}>
              Our Core Platform Pillars
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: <Shield size={32} color="#7B1D2E" />, title: 'Bar Council Verification', desc: 'Every advocate on Justice Junction passes background checks and Bar Council license verification.' },
              { icon: <Scale size={32} color="#7B1D2E" />, title: 'Upfront Fixed Pricing', desc: 'No hidden consultation fees or surprise retainers. Transparent rates published directly on lawyer profiles.' },
              { icon: <Clock size={32} color="#7B1D2E" />, title: '24/7 Emergency Availability', desc: 'Legal emergencies, bail matters, and police station summons require immediate attention — day or night.' },
              { icon: <Zap size={32} color="#7B1D2E" />, title: 'AI Legal Matching', desc: 'Our RAG pipeline and AI Classifier match your specific legal problem with the most qualified legal specialists.' }
            ].map((pillar, idx) => (
              <div key={idx} style={{
                background: '#FDFBF7',
                borderRadius: '20px',
                padding: '2.5rem 2rem',
                border: '1px solid #EAE2D8',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                textAlign: 'left'
              }} className="card-hover">
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'rgba(123, 29, 46, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  {pillar.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 800, color: '#1A0A0D', marginBottom: '0.75rem' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '.95rem', color: '#5A3A42', lineHeight: 1.7, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Hiring & Contact Footer CTA ─── */}
      <section style={{
        padding: '5rem 0',
        background: '#1A0D10',
        color: '#FFF',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 900, color: '#F5C4B3', marginBottom: '1rem' }}>
            Join Us in Building the Future of Legal-Tech
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '2rem' }}>
            We're continuously expanding across Tier-2 and Tier-3 cities in India. Have feedback or want to partner with Founder & CEO Ayush Kumar?
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:supportjusticejunction@gmail.com" className="btn" style={{
              background: '#7B1D2E',
              color: '#FFF',
              fontWeight: 800,
              padding: '.85rem 1.8rem',
              borderRadius: '12px',
              border: 'none',
              textDecoration: 'none'
            }}>
              Contact Founder Team
            </a>
            <Link to="/join-as-lawyer" className="btn" style={{
              background: 'transparent',
              color: '#F5C4B3',
              fontWeight: 700,
              padding: '.85rem 1.8rem',
              borderRadius: '12px',
              border: '1px solid #F5C4B3',
              textDecoration: 'none'
            }}>
              Register as Advocate
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
