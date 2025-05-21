"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting password login with:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Login response:", { data, error })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Please check your email to confirm your account before signing in.")
        } else {
          setError(error.message)
        }
        return
      }

      // Redirect to dashboard on successful login
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Sending magic link to:", email)
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("Magic link response:", { data, error })

      if (error) {
        setError(error.message)
        return
      }

      // Show success message
      setMagicLinkSent(true)
    } catch (err) {
      console.error("Magic link error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="mb-8">
        <Image src="/jobvault-logo.png" alt="JobVault Logo" width={180} height={45} className="h-12 w-auto" />
      </div>

      <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Sign In</CardTitle>
          <CardDescription className="text-gray-400">Sign in to your JobVault account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#2a2a2a]">
              <TabsTrigger value="password" className="text-white data-[state=active]:bg-blue-600">
                Password
              </TabsTrigger>
              <TabsTrigger value="magic-link" className="text-white data-[state=active]:bg-blue-600">
                Magic Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handlePasswordLogin} className="space-y-4 mt-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#2a2a2a] border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#2a2a2a] border-gray-700 text-white"
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="magic-link">
              <form onSubmit={handleMagicLinkLogin} className="space-y-4 mt-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {magicLinkSent && (
                  <Alert className="bg-green-900 border-green-800 text-white">
                    <AlertDescription>
                      Magic link sent! Check your email for a link to sign in automatically.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="magic-email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="magic-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#2a2a2a] border-gray-700 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading || magicLinkSent}
                >
                  {isLoading ? "Sending..." : magicLinkSent ? "Magic Link Sent" : "Send Magic Link"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
