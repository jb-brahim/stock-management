'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      authApi
        .getMe()
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user)
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authApi.login(credentials)
    if (res.data) {
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
    }
  }

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    const res = await authApi.register(userData)
    if (res.data) {
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
