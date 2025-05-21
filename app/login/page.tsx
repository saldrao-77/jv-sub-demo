"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()

  useEffect(() => {
    // Check for query parameters
    const emailVerified = searchParams.get("email_verified")
    const resetSuccess = searchParams.get("reset") === "success"

    if (emailVerified === "true") {
      setSuccess("Email verified successfully! You can now sign in.")
    } else if (resetSuccess) {
      setSuccess("Password has been reset successfully. You can now sign in with your new password.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        console.error("Login error:", error)

        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.")
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please confirm your email before signing in. Check your inbox for a confirmation link.")
        } else {
          setError(error.message)
        }
      }
      // Successful login will redirect in the signIn function
    } catch (err) {
      console.error("Unexpected login error:", err)
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-900 border-green-800 text-white">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
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
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#2a2a2a] border-gray-700 text-white"
              />
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
