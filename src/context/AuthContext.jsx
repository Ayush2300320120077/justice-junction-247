import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, getToken, setAuth, clearAuth } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser())
  const [token, setToken] = useState(getToken())

  const login = (tok, usr) => {
    setAuth(tok, usr)
    setToken(tok)
    setUser(usr)
  }

  const logout = () => {
    clearAuth()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
