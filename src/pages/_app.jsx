import '../index.css'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import dynamic from 'next/dynamic'
const AIChatWidget = dynamic(() => import('../components/AIChatWidget'), { ssr: false })
const WhatsAppHelpline = dynamic(() => import('../components/WhatsAppHelpline'), { ssr: false })
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
