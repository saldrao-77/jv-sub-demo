"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, businessName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
        setIsLoading(false)
        return
      }

      setSession(data.session)
      setUser(data.session?.user || null)
      setIsLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session)
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, businessName: string) => {
    try {
      console.log("Signing up:", email, businessName)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("Signup response:", data, error)
      return { error }
    } catch (error) {
      console.error("Signup error:", error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Signin response:", data, error)

      if (!error) {
        router.push("/dashboard")
      }

      return { error }
    } catch (error) {
      console.error("Signin error:", error)
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      console.error("Reset password error:", error)
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
