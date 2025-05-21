import { Suspense } from "react"
import { CardsList } from "./cards-list"
import { Header } from "@/components/header"
import { getCurrentUser } from "@/lib/get-current-user"
import { redirect } from "next/navigation"
import { getCards } from "@/lib/api"

export default async function CardsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const cards = await getCards(user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <Suspense fallback={<div className="text-center p-8">Loading cards...</div>}>
          <CardsList initialCards={cards} userId={user.id} />
        </Suspense>
      </main>
    </div>
  )
}
