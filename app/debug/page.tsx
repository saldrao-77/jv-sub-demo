"use client"

import { useState, useEffect } from "react"
import { getBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function DebugPage() {
  const [users, setUsers] = useState([])
  const [customers, setCustomers] = useState([])
  const [jobs, setJobs] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const supabase = getBrowserClient()

  async function fetchAllData() {
    setLoading(true)
    setError(null)

    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase.from("users").select("*")
      if (usersError) throw usersError
      setUsers(usersData || [])

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase.from("customers").select("*")
      if (customersError) throw customersError
      setCustomers(customersData || [])

      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase.from("jobs").select("*")
      if (jobsError) throw jobsError
      setJobs(jobsData || [])

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase.from("transactions").select("*")
      if (transactionsError) throw transactionsError
      setTransactions(transactionsData || [])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Debug Data</h1>
          <Button onClick={fetchAllData} disabled={loading}>
            {loading ? "Loading..." : "Refresh Data"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-md mb-6">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary p-4 rounded-md overflow-auto max-h-60">{JSON.stringify(users, null, 2)}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customers ({customers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary p-4 rounded-md overflow-auto max-h-60">
                {JSON.stringify(customers, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jobs ({jobs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary p-4 rounded-md overflow-auto max-h-60">{JSON.stringify(jobs, null, 2)}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions ({transactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary p-4 rounded-md overflow-auto max-h-60">
                {JSON.stringify(transactions, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
