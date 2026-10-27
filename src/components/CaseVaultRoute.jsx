import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const VAULT_ROLES = ['officer', 'legal-officer', 'court-clerk', 'admin']

export default function CaseVaultRoute({ children }) {
  const { user, loading, isLoggedIn } = useAuth()

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: 32, height: 32, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#7B1D2E', borderRadius: '50%' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Authorizing Case Vault...</div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />
  }

  if (!VAULT_ROLES.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
