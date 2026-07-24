import '../index.css'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
const AIAssistantChat = dynamic(() => import('../components/AIAssistantChat'), { ssr: false })
const WhatsAppHelpline = dynamic(() => import('../components/WhatsAppHelpline'), { ssr: false })
const CookieConsent = dynamic(() => import('../components/CookieConsent'), { ssr: false })
const BackToTop = dynamic(() => import('../components/BackToTop'), { ssr: false })
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        {/* Default OG fallbacks — individual pages override these */}
        <meta property="og:site_name" content="Justice Junction 24/7" />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Head>
      <AuthProvider>
        <ToastProvider>
          <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
          <div className="global-bg">
            <div className="bg-mesh" />
            <div className="floating-shape" style={{ width: '40vw', height: '40vw', top: '-10%', left: '-10%' }} />
            <div className="floating-shape" style={{ width: '30vw', height: '30vw', bottom: '10%', right: '-5%', animationDelay: '-5s' }} />
          </div>
          
          <Navbar />
          <div className="page-reveal">
            <Component {...pageProps} />
          </div>
          <Footer />
          <AIAssistantChat />
          <WhatsAppHelpline />
          <BackToTop />
          <CookieConsent />
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp

