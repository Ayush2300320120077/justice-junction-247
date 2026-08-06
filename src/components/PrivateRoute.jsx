import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

/**
 * PrivateRoute — wraps routes that require authentication.
 * Unauthenticated users are redirected to /login.
 * Optionally restrict to specific roles via the `roles` prop.
 *
 * Usage:
 *   <PrivateRoute><Dashboard /></PrivateRoute>
 *   <PrivateRoute roles={['lawyer']}><LawyerDashboard /></PrivateRoute>
 */
export default function PrivateRoute({ children, roles }) {
  const { user, loading, isLoggedIn } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (!loading && isLoggedIn && roles && roles.length > 0 && !roles.includes(user?.role)) {
      showToast("You don't have access to this page", 'error')
    }
  }, [loading, isLoggedIn, roles, user?.role, showToast])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
