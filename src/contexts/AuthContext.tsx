import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        toast.success('Login realizado com sucesso!')
      } else if (event === 'SIGNED_OUT') {
        toast.success('Logout realizado com sucesso!')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Conta criada com sucesso! Verifique seu email.')
      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast.error('Erro ao criar conta')
      return { error: authError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast.error('Erro ao fazer login')
      return { error: authError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Email de recuperação enviado!')
      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast.error('Erro ao enviar email de recuperação')
      return { error: authError }
    }
  }

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      // Also update the user_profiles table
      if (user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            full_name: data.full_name,
            avatar_url: data.avatar_url,
          })

        if (profileError) {
          toast.error('Erro ao atualizar perfil')
          return { error: profileError }
        }
      }

      toast.success('Perfil atualizado com sucesso!')
      return { error: null }
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}