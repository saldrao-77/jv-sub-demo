"use client"

import { useState } from "react"
import { seedDatabase } from "@/lib/seed-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Database, RefreshCw } from "lucide-react"

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: any } | null>(null)

  async function handleSeed() {
    setIsSeeding(true)
    try {
      const seedResult = await seedDatabase()
      setResult(seedResult)
    } catch (error) {
      setResult({ success: false, message: "Error seeding database", error })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Seed Database</CardTitle>
          <CardDescription>Initialize the database with sample data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <div
              className={`rounded-lg p-4 ${
                result.success ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle2 className="h-5 w-5" /> : <Database className="h-5 w-5" />}
                <p className="font-medium">{result.message}</p>
              </div>
              {result.error && <p className="mt-2 text-sm">{JSON.stringify(result.error)}</p>}
            </div>
          ) : (
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm">
                This will create sample data in your database including users, customers, jobs, transactions, and more.
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                Note: This action will only seed the database if it's empty.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full"
            variant={result?.success ? "outline" : "default"}
          >
            {isSeeding ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : result?.success ? (
              "Seed Again"
            ) : (
              "Seed Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
