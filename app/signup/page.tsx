"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simple direct signup call
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      console.log("Signup response:", { data, error })

      if (error) {
        setError(error.message)
        return
      }

      // Show success message
      setSuccess(true)

      // Also create a user record in the database
      if (data.user) {
        const { error: userError } = await supabase.from("users").insert({
          id: data.user.id,
          email: email,
          business_name: businessName,
        })

        if (userError) {
          console.error("Error creating user record:", userError)
        }
      }
    } catch (err) {
      console.error("Signup error:", err)
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
          <CardTitle className="text-2xl text-white">Create an Account</CardTitle>
          <CardDescription className="text-gray-400">Sign up to start managing your materials deposits</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <Alert className="bg-green-900 border-green-800 text-white">
                <AlertDescription>
                  Account created successfully! Please check your email for a confirmation link before signing in.
                </AlertDescription>
              </Alert>
            )}
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
              <Label htmlFor="business-name" className="text-gray-300">
                Business Name
              </Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
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
                minLength={6}
                className="bg-[#2a2a2a] border-gray-700 text-white"
              />
              <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
