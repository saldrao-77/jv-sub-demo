"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function EnvError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-xl">Environment Error</CardTitle>
          </div>
          <CardDescription>Missing Supabase environment variables. Please check your configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-500/10 p-4 text-sm">
            <p className="font-medium text-red-500">Required Environment Variables:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            These environment variables are required for the application to connect to the Supabase database.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
          <Button onClick={() => (window.location.href = "/api/env-check")}>Check Environment</Button>
        </CardFooter>
        <div className="px-6 pb-6">
          <Button variant="link" className="w-full" asChild>
            <Link href="/dashboard?bypass=true">
              Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
