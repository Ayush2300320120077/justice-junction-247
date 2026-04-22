import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AIChatWidget from './components/AIChatWidget'
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import Book from './pages/Book'
import Dashboard from './pages/Dashboard'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Pricing from './pages/LawyerPlans'
import LawyerPlans from './pages/LawyerPlans'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/search"       element={<Search />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/about"        element={<About />} />
        <Route path="/pricing"      element={<LawyerPlans />} />
        <Route path="/lawyer-plans" element={<LawyerPlans />} />
        <Route path="/favorites"    element={<Favorites />} />
        <Route path="/book"         element={<ProtectedRoute><Book /></ProtectedRoute>} />
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin"        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <AIChatWidget />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
