import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '@/api/auth'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setAuth = (u: User, t: string) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('auth_token', t)
    localStorage.setItem('auth_user', JSON.stringify(u))
  }

  const clearAuth = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }, [])

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      setToken(storedToken)
      authApi.getMe()
        .then((u) => setUser(u))
        .catch(() => clearAuth())
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }

    // Handle auth:logout event from API interceptor
    const handleLogout = () => clearAuth()
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [clearAuth])

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password })
    setAuth(result.user, result.token)
  }

  const register = async (name: string, email: string, password: string) => {
    const result = await authApi.register({ name, email, password })
    setAuth(result.user, result.token)
  }

  const logout = useCallback(() => clearAuth(), [clearAuth])

  const refreshUser = async () => {
    const u = await authApi.getMe()
    setUser(u)
    localStorage.setItem('auth_user', JSON.stringify(u))
  }

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!user,
      isLoading,
      isAdmin: user?.role === 'ADMIN',
      login, register, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
