import React, { Suspense, lazy, useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminRoute from './components/admin/AdminRoute'
import PrivateRoute from './components/PrivateRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load all pages
const Home            = lazy(() => import('./pages/index'))
const Search          = lazy(() => import('./pages/search'))
const Book            = lazy(() => import('./pages/book'))
const Dashboard       = lazy(() => import('./pages/dashboard'))
const Login           = lazy(() => import('./pages/login'))
const Register        = lazy(() => import('./pages/register'))
const About           = lazy(() => import('./pages/about'))
const Contact         = lazy(() => import('./pages/contact'))
const FAQ             = lazy(() => import('./pages/faq'))
const HowItWorks      = lazy(() => import('./pages/how-it-works'))
const Pricing         = lazy(() => import('./pages/pricing'))
const LawyerPlans     = lazy(() => import('./pages/lawyer-plans'))
const DocumentGen     = lazy(() => import('./pages/document-generator'))
const KnowledgeHub    = lazy(() => import('./pages/knowledge-hub'))
const KnowledgeArticle = lazy(() => import('./pages/knowledge/KnowledgeArticle'))
const LawyerProfile   = lazy(() => import('./pages/lawyer/LawyerProfile'))
const MyCases         = lazy(() => import('./pages/my-cases'))
const Favorites       = lazy(() => import('./pages/favorites'))
const Rights          = lazy(() => import('./pages/rights'))
const Disclaimer      = lazy(() => import('./pages/disclaimer'))
const Terms           = lazy(() => import('./pages/terms'))
const Privacy         = lazy(() => import('./pages/privacy-policy'))
const JoinAsLawyer    = lazy(() => import('./pages/join-as-lawyer'))
const Subscriptions   = lazy(() => import('./pages/Subscriptions'))
const NotFound        = lazy(() => import('./pages/404'))

// Admin pages
const AdminLogin      = lazy(() => import('./pages/admin/login'))
const AdminDashboard  = lazy(() => import('./pages/admin/dashboard'))
const AdminLawyers    = lazy(() => import('./pages/admin/lawyers'))
const AdminClients    = lazy(() => import('./pages/admin/clients'))
const AdminContent    = lazy(() => import('./pages/admin/content'))
const AdminSettings   = lazy(() => import('./pages/admin/settings'))
const AdminSubs       = lazy(() => import('./pages/admin/subscriptions'))
const AdminAnalytics  = lazy(() => import('./pages/admin/analytics'))
const AdminInbox      = lazy(() => import('./pages/admin/contact-inbox'))
const AdminReports    = lazy(() => import('./pages/admin/reports'))
const AdminTemplates  = lazy(() => import('./pages/admin/templates'))
const AdminAiEval     = lazy(() => import('./pages/admin/ai-eval'))


// Floating widgets (loaded lazily, no SSR concerns now)
const AIAssistantChat  = lazy(() => import('./components/AIAssistantChat'))
const WhatsAppHelpline = lazy(() => import('./components/WhatsAppHelpline'))
const CookieConsent    = lazy(() => import('./components/CookieConsent'))
const BackToTop        = lazy(() => import('./components/BackToTop'))

const LoadingSpinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="spinner" />
  </div>
)

export default function App() {
  const location = useLocation()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Hide navbar/footer for admin routes
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="global-bg">
        <div className="bg-mesh" />
        <div className="floating-shape" style={{ width: '40vw', height: '40vw', top: '-10%', left: '-10%' }} />
        <div className="floating-shape" style={{ width: '30vw', height: '30vw', bottom: '10%', right: '-5%', animationDelay: '-5s' }} />
      </div>

      {!isAdminRoute && <Navbar />}

      <div className="page-reveal">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/book" element={<Book />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/lawyer-plans" element={<LawyerPlans />} />
            <Route path="/document-generator" element={<DocumentGen />} />
            <Route path="/knowledge-hub" element={<KnowledgeHub />} />
            <Route path="/knowledge/:slug" element={<KnowledgeArticle />} />
            <Route path="/lawyer/:id" element={<LawyerProfile />} />
            <Route path="/join-as-lawyer" element={<JoinAsLawyer />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/rights" element={<Rights />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />

            {/* Authenticated routes — require login */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/my-cases" element={<PrivateRoute><MyCases /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/lawyers" element={<AdminRoute><AdminLawyers /></AdminRoute>} />
            <Route path="/admin/clients" element={<AdminRoute><AdminClients /></AdminRoute>} />
            <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubs /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/contact-inbox" element={<AdminRoute><AdminInbox /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/templates" element={<AdminRoute><AdminTemplates /></AdminRoute>} />
            <Route path="/admin/ai-eval" element={<AdminRoute><AdminAiEval /></AdminRoute>} />


            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </div>

      {!isAdminRoute && <Footer />}

      {/* Global floating widgets */}
      <Suspense fallback={null}>
        <AIAssistantChat />
        <WhatsAppHelpline />
        <BackToTop />
        <CookieConsent />
      </Suspense>
    </>
  )
}
