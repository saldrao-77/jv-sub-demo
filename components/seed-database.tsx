"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Database, Loader2 } from "lucide-react"

export function SeedDatabase() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if we have data in the database
    async function checkDatabase() {
      try {
        const response = await fetch("/api/check-data")
        const data = await response.json()

        if (data.hasData) {
          setIsSuccess(true)
        }
      } catch (error) {
        console.error("Error checking database:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkDatabase()
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>Your database has been seeded with sample data</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Checking database status...</p>
          </div>
        ) : isSuccess ? (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle className="h-5 w-5" />
            <p>Database seeded successfully! Click the button below to view your data.</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p>Your database has been seeded with sample data via SQL.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleRefresh} className="bg-blue hover:bg-blue-dark">
          <Database className="mr-2 h-4 w-4" />
          View Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}
