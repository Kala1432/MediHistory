import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, register as registerRequest } from '../utils/api'

type AuthState = {
  token: string
  username: string
  role: string
} | null

type AuthContextState = {
  auth: AuthState
  login: (payload: { usernameOrEmail: string; password: string }) => Promise<void>
  register: (payload: { username: string; email: string; password: string; phone?: string }) => Promise<string>
  logout: () => void
}

const AuthContext = createContext<AuthContextState | undefined>(undefined)

const STORAGE_KEY = 'medihistory_auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setAuth(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [auth])

  const login = async (payload: { usernameOrEmail: string; password: string }) => {
    const response = await loginRequest(payload)
    setAuth({ token: response.token, username: response.username, role: normalizeRole(response.role) })
  }

  const register = async (payload: { username: string; email: string; password: string; phone?: string }) => {
    const response = await registerRequest(payload)
    return response.message
  }

  const logout = () => setAuth(null)

  const value = useMemo(() => ({ auth, login, register, logout }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function normalizeRole(role?: string) {
  return (role || 'patient').replace(/^ROLE_/i, '').toLowerCase()
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
