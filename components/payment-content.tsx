"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { processPayment } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LegalNotice } from "@/components/legal-notice"
import { ShieldCheck } from "lucide-react"

interface PaymentContentProps {
  paymentLink: any
}

export default function PaymentContent({ paymentLink }: PaymentContentProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const job = paymentLink.job
  const customer = job.customer

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await processPayment(formData)

      if (result.error) {
        console.error(result.error)
        return
      }

      router.push(`/confirmation/${paymentLink.token}`)
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border py-4">
        <div className="container flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Image src="/jobvault-logo.png" alt="JobVault Logo" width={120} height={30} className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Materials Deposit</CardTitle>
              <CardDescription>Secure payment for {job.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md bg-secondary p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-blue" />
                  <div className="font-medium">Payment Details</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job:</span>
                    <span className="font-medium">{job.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{formatCurrency(job.deposit_amount)}</span>
                  </div>
                </div>
              </div>

              <LegalNotice />

              <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="token" value={paymentLink.token} />
                <input type="hidden" name="job_id" value={job.id} />
                <input type="hidden" name="amount" value={job.deposit_amount} />

                <div className="rounded-md bg-blue/10 p-4 text-center">
                  <p className="font-medium text-blue">Total: {formatCurrency(job.deposit_amount)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Materials-only deposit</p>
                </div>

                <Button type="submit" className="w-full bg-blue hover:bg-blue-dark" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Pay Now"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-center text-xs text-muted-foreground">
              <p>
                By submitting this payment, you agree to the terms of service and acknowledge that this is a
                materials-only deposit.
              </p>
            </CardFooter>
          </Card>
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
