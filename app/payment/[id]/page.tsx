"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

// Update the PaymentPage component to properly handle the ID from the URL
export default function PaymentPage({ params }: { params: { id: string } }) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [jobDetails, setJobDetails] = useState({
    job: "Bathroom Renovation",
    customer: "",
    email: "",
    vendors: "",
    amount: 850.0,
    description: "",
  })

  // In a real app, you would fetch job details based on the ID
  useEffect(() => {
    // This would be an API call in a real application
    console.log(`Fetching payment details for job ID: ${params.id}`)

    // For demo purposes, we're just using the hardcoded data
    // In a real app, you would do something like:
    // async function fetchJobDetails() {
    //   const response = await fetch(`/api/jobs/${params.id}`);
    //   const data = await response.json();
    //   setJobDetails(data);
    // }
    // fetchJobDetails();

    // Simulate fetching more detailed job information
    setJobDetails({
      job: "Bathroom Renovation",
      customer: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      vendors: "Home Depot, Lowe's",
      amount: 850.0,
      description: "Materials for bathroom renovation including tiles, fixtures, and plumbing supplies.",
    })
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing and sending confirmation email
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // In a real application, this would be handled by a server action
      console.log("Sending confirmation email to:", e.target.email.value)

      // Simulate email content
      const emailContent = `
        Dear ${e.target.firstName.value} ${e.target.lastName.value},
        
        Thank you for your materials pre-payment of $${jobDetails.amount.toFixed(2)} for ${jobDetails.job}.
        
        Your payment has been received and the funds are securely held for use at the specified vendors: ${jobDetails.vendors}.
        
        You can view the status of your order at any time by visiting:
        https://jobvault.com/confirmation/${params.id}
        
        Thank you,
        JobVault Team
      `

      console.log("Email content:", emailContent)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/20">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-center">Payment Successful</h1>
            <p className="text-muted-foreground text-center mb-8">Your materials pre-payment has been received</p>

            <div className="w-full rounded-lg bg-secondary p-6 text-center mb-6">
              <div className="text-sm text-muted-foreground">Amount Paid</div>
              <div className="text-3xl font-bold mt-1">${jobDetails.amount.toFixed(2)}</div>
            </div>

            <div className="w-full space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Job:</span>
                <span className="font-medium">{jobDetails.job}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendors:</span>
                <span className="font-medium">{jobDetails.vendors || "Home Depot, Lowe's"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-medium">JV-{params.id}</span>
              </div>
            </div>

            <div className="w-full flex items-center space-x-3 bg-blue/10 p-4 rounded-lg mb-8">
              <ShieldCheck className="h-5 w-5 text-blue flex-shrink-0" />
              <span className="text-sm">Funds are held securely and can only be used at the specified vendors</span>
            </div>

            <div className="w-full space-y-3">
              <Button className="w-full" variant="outline" onClick={() => window.print()}>
                Download Receipt
              </Button>
              <Button className="w-full bg-blue hover:bg-blue-dark" asChild>
                <Link href={`/confirmation/${params.id}`}>View Order Status</Link>
              </Button>
              <div className="text-center text-xs text-muted-foreground mt-2">
                A confirmation email has been sent to your email address
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border py-4">
        <div className="container flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Image src="/jobvault-logo.png" alt="JobVault Logo" width={120} height={30} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Materials Pre-payment</h1>
              <p className="text-muted-foreground">
                This payment is for materials only. Funds are held securely and can only be used at the vendors
                specified.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                    <p className="text-xs text-muted-foreground">For receipt and confirmation</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                      <TabsTrigger value="ach">Bank Transfer (ACH)</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" required={paymentMethod === "card"} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required={paymentMethod === "card"} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required={paymentMethod === "card"} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Zip Code</Label>
                          <Input id="zip" placeholder="12345" required={paymentMethod === "card"} />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="ach" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Holder Name</Label>
                        <Input id="account-name" required={paymentMethod === "ach"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routing">Routing Number</Label>
                        <Input id="routing" required={paymentMethod === "ach"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account">Account Number</Label>
                        <Input id="account" required={paymentMethod === "ach"} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-type">Account Type</Label>
                        <RadioGroup defaultValue="checking" className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="checking" id="checking" />
                            <Label htmlFor="checking">Checking</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="savings" id="savings" />
                            <Label htmlFor="savings">Savings</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex-col items-start space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-blue" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                  <Button type="submit" className="w-full bg-blue hover:bg-blue-dark" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Pay for Materials"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1">
                  <div className="font-medium text-lg">{jobDetails.job}</div>
                  <div className="text-sm text-muted-foreground">Materials pre-payment</div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Customer Information</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div>{jobDetails.customer || "Sarah Johnson"}</div>
                    <div className="text-muted-foreground">Email:</div>
                    <div className="truncate">{jobDetails.email || "sarah.johnson@example.com"}</div>
                    <div className="text-muted-foreground">Date:</div>
                    <div>{new Date().toLocaleDateString()}</div>
                    <div className="text-muted-foreground">Vendors:</div>
                    <div>{jobDetails.vendors || "Home Depot, Lowe's"}</div>
                  </div>
                </div>

                <div className="rounded-md bg-secondary p-4">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <ShieldCheck className="h-5 w-5 text-blue" />
                    <span>Secure Materials-Only Deposit</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Funds are held securely and can only be used at the vendors specified
                  </div>
                </div>

                <div className="rounded-md bg-blue/10 p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue" />
                    <span>Funds are held securely</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue" />
                    <span>Can only be used at specified vendors</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue" />
                    <span>You'll receive confirmation of purchase</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${jobDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${jobDetails.amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container text-center text-sm text-muted-foreground">
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
      </footer>
    </div>
  )
}
