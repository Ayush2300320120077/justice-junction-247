import '../index.css'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
const AIChatWidget = dynamic(() => import('../components/AIChatWidget'), { ssr: false })
const WhatsAppHelpline = dynamic(() => import('../components/WhatsAppHelpline'), { ssr: false })
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
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
          <Navbar />
          <Component {...pageProps} />
          <Footer />
          <AIChatWidget />
          <WhatsAppHelpline />
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp

