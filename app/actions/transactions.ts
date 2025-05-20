"use server"

import { getTransactions, getTransactionsByJobId } from "@/lib/data/transactions"

export async function fetchTransactions() {
  return getTransactions()
}

export async function fetchJobTransactions(jobId: string) {
  return getTransactionsByJobId(jobId)
}
