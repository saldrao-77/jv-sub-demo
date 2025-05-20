import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getPaymentLink } from "@/lib/actions"
import PaymentContent from "@/components/payment-content"

interface PaymentPageProps {
  params: {
    id: string
  }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentContentWrapper token={params.id} />
      </Suspense>
    </div>
  )
}

async function PaymentContentWrapper({ token }: { token: string }) {
  const paymentLink = await getPaymentLink(token)

  if (!paymentLink || paymentLink.status !== "active") {
    notFound()
  }

  return <PaymentContent paymentLink={paymentLink} />
}
