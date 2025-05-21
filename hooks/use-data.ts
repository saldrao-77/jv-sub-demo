"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  getJobs,
  getJobById,
  getCards,
  getCardById,
  getTransactions,
  getTransactionsByJobId,
  getTransactionsByCardId,
} from "@/lib/api"

// Hook for fetching jobs
export function useJobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const data = await getJobs(user.id)
        setJobs(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [user])

  return { jobs, isLoading, error }
}

// Hook for fetching a single job
export function useJob(jobId: string) {
  const [job, setJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchJob = async () => {
      if (!user || !jobId) return

      try {
        setIsLoading(true)
        const data = await getJobById(jobId, user.id)
        setJob(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch job")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [jobId, user])

  return { job, isLoading, error }
}

// Hook for fetching cards
export function useCards() {
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCards = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const data = await getCards(user.id)
        setCards(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch cards")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCards()
  }, [user])

  return { cards, isLoading, error }
}

// Hook for fetching a single card
export function useCard(cardId: string) {
  const [card, setCard] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCard = async () => {
      if (!user || !cardId) return

      try {
        setIsLoading(true)
        const data = await getCardById(cardId, user.id)
        setCard(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch card")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCard()
  }, [cardId, user])

  return { card, isLoading, error }
}

// Hook for fetching transactions
export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const data = await getTransactions(user.id)
        setTransactions(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch transactions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [user])

  return { transactions, isLoading, error }
}

// Hook for fetching transactions by job ID
export function useJobTransactions(jobId: string) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user || !jobId) return

      try {
        setIsLoading(true)
        const data = await getTransactionsByJobId(jobId, user.id)
        setTransactions(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch job transactions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [jobId, user])

  return { transactions, isLoading, error }
}

// Hook for fetching transactions by card ID
export function useCardTransactions(cardId: string) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user || !cardId) return

      try {
        setIsLoading(true)
        const data = await getTransactionsByCardId(cardId, user.id)
        setTransactions(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch card transactions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [cardId, user])

  return { transactions, isLoading, error }
}
