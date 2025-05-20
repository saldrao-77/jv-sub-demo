"use server"

import { getCards, getCardsByJobId, updateCardAmount } from "@/lib/data/cards"

export async function fetchCards() {
  return getCards()
}

export async function fetchJobCards(jobId: string) {
  return getCardsByJobId(jobId)
}

export async function updateCardBalance(cardId: string, amount: number) {
  return updateCardAmount(cardId, amount)
}
