"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function CreateCardPage() {
  const [jobId, setJobId] = useState("")
  const [jobName, setJobName] = useState("")
  const [customer, setCustomer] = useState("")
  const [amount, setAmount] = useState("")
  const [vendor, setVendor] = useState("")
  const [issuedTo, setIssuedTo] = useState("")
  const [role, setRole] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Get jobId from URL query parameter
    const params = new URLSearchParams(window.location.search)
    const id = params.get("jobId")
    if (id) {
      setJobId(id)
      // For demo purposes, set some default values based on jobId
      if (id === "1") {
        setJobName("Bathroom Renovation")
        setCustomer("Sarah Johnson")
        setAmount("850")
        setVendor("Home Depot")
      } else if (id === "2") {
        setJobName("Kitchen Remodel")
        setCustomer("Michael Chen")
        setAmount("1200")
        setVendor("Lowe's, Home Depot")
      } else {
        setJobName("Job #" + id)
        setCustomer("Customer")
        setAmount("1000")
        setVendor("Home Depot")
      }
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
    }, 1000)
  }

  const goBack = () => {
    window.location.href = jobId ? `/jobs/${jobId}` : "/cards"
  }

  const goToCards = () => {
    window.location.href = "/cards"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="mb-6">
          <button
            onClick={goBack}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </button>
        </div>

        {success ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-500">Card Created Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="mb-4">Your new virtual card has been created for {jobName}.</p>
                <Button className="bg-blue hover:bg-blue-dark" onClick={goToCards}>
                  View All Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Issue New Virtual Card</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="job-name">Job</Label>
                  <Input
                    id="job-name"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    disabled={!!jobId}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    disabled={!!jobId}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">Approved Vendor(s)</Label>
                  <Input
                    id="vendor"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g., Home Depot, Lowe's"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issued-to">Issued To</Label>
                  <Input
                    id="issued-to"
                    value={issuedTo}
                    onChange={(e) => setIssuedTo(e.target.value)}
                    placeholder="Full name of the person who will use this card"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Contractor, Foreman, Carpenter"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={goBack}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue hover:bg-blue-dark" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Issue Virtual Card"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
