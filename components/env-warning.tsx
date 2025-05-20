"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function EnvWarning() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="border-yellow-500/50 bg-yellow-500/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-base">Environment Warning</CardTitle>
          </div>
          <CardDescription>Using direct database connection instead of Supabase environment variables</CardDescription>
        </CardHeader>
        <CardContent className="pb-2 text-sm">
          <p>
            The application is running with a direct database connection. For better security and full functionality,
            please set up the required Supabase environment variables.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={() => setDismissed(true)}>
            Dismiss
          </Button>
          <Button variant="default" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
            <Link href="/api/env-check">Check Environment</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
