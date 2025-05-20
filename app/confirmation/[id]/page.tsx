"use client"

import { CheckCircle2, CreditCard, Receipt, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [jobDetails, setJobDetails] = useState({
    job: "Bathroom Renovation",
    customer: "",
    email: "",
    phone: "",
    vendor: "Home Depot",
    amount: 850.0,
    date: "May 19, 2025",
    status: "Funds Received",
    description: "",
  })

  // In a real app, you would fetch job details based on the ID
  useEffect(() => {
    // This would be an API call in a real application
    console.log(`Fetching confirmation details for job ID: ${params.id}`)

    // For demo purposes, we're just using the hardcoded data
    // In a real app, you would do something like:
    // async function fetchJobDetails() {
    //   const response = await fetch(`/api/jobs/${params.id}/confirmation`);
    //   const data = await response.json();
    //   setJobDetails(data);
    // }
    // fetchJobDetails();

    // Simulate fetching more detailed job information
    setJobDetails({
      job: "Bathroom Renovation",
      customer: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 123-4567",
      vendor: "Home Depot, Lowe's",
      amount: 850.0,
      date: "May 19, 2025",
      status: "Funds Received",
      description: "Materials for bathroom renovation including tiles, fixtures, and plumbing supplies.",
    })
  }, [params.id])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <Image src="/jobvault-logo.png" alt="JobVault Logo" width={120} height={30} className="h-8 w-auto" />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Materials Pre-payment Confirmation</h1>
          <p className="text-muted-foreground">Thank you for your materials pre-payment</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current status of your materials pre-payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/20">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">{jobDetails.status}</div>
                    <div className="text-sm text-muted-foreground">
                      Your payment has been received and is being processed
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-blue/10 p-4">
                  <div className="flex">
                    <ShieldCheck className="h-5 w-5 text-blue mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Materials funds received for {jobDetails.job}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Funds can only be used at the specified vendors and will expire in 30 days if unused.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900/20 text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="h-full w-px bg-border"></div>
                    </div>
                    <div>
                      <div className="font-medium">Payment Received</div>
                      <div className="text-sm text-muted-foreground">{jobDetails.date} • 10:24 AM</div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="h-full w-px bg-border"></div>
                    </div>
                    <div>
                      <div className="font-medium">Virtual Card Issued</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                        <Receipt className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Materials Purchased</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Job</div>
                  <div className="font-medium">{jobDetails.job}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Amount</div>
                  <div className="font-medium">${jobDetails.amount.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Vendors</div>
                  <div className="font-medium">{jobDetails.vendor}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Date</div>
                  <div className="font-medium">{jobDetails.date}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Reference</div>
                  <div className="font-medium">JV-{params.id}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div>{jobDetails.customer}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div>{jobDetails.email}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div>{jobDetails.phone}</div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-md bg-blue/10 p-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-blue" />
                <div className="font-medium">Materials-Only Deposit</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Funds are held securely and can only be used at the specified vendors for purchasing materials.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} JobVault. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-blue">
              Terms
            </a>
            <a href="#" className="hover:text-blue">
              Privacy
            </a>
            <a href="#" className="hover:text-blue">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
