"use server"

import { createJob, getJobById, getJobs, updateJobStatus } from "@/lib/data/jobs"
import { createTransaction, getTransactionsByJobId } from "@/lib/data/transactions"
import { createCard, getCardsByJobId } from "@/lib/data/cards"
import { getVendorsByJobId } from "@/lib/data/vendors"

export async function fetchJobs() {
  return getJobs()
}

export async function fetchJobDetails(id: string) {
  const job = await getJobById(id)

  if (!job) {
    return null
  }

  const transactions = await getTransactionsByJobId(id)
  const cards = await getCardsByJobId(id)
  const vendors = await getVendorsByJobId(id)

  return {
    ...job,
    transactions,
    cards,
    vendors: vendors.map((v) => v.name),
  }
}

export async function createNewJob(formData: FormData) {
  const customerName = formData.get("customer-name") as string
  const jobName = formData.get("job-name") as string
  const customerEmail = formData.get("customer-email") as string
  const customerPhone = formData.get("customer-phone") as string
  const propertyAddress = formData.get("property-address") as string
  const depositAmount = Number.parseFloat(formData.get("deposit-amount") as string)
  const startDate = formData.get("created-date") as string

  // Get vendors from form data
  // This assumes vendors are passed as a comma-separated string
  const vendorsString = formData.get("vendors") as string
  const vendors = vendorsString ? vendorsString.split(",").map((v) => v.trim()) : []

  const job = await createJob({
    name: jobName,
    address: propertyAddress,
    deposit_amount: depositAmount,
    status: "Deposit request sent",
    start_date: startDate || new Date().toISOString().split("T")[0],
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      address: propertyAddress,
    },
    vendors,
  })

  if (!job) {
    return { success: false, message: "Failed to create job" }
  }

  // Create initial transaction for deposit request
  await createTransaction({
    job_id: job.id,
    type: "Request",
    amount: depositAmount,
    status: "Deposit request sent",
  })

  return { success: true, jobId: job.id }
}

export async function markDepositPaid(jobId: string) {
  const job = await getJobById(jobId)

  if (!job) {
    return { success: false, message: "Job not found" }
  }

  // Update job status
  await updateJobStatus(jobId, "Deposit paid")

  // Create transaction for deposit payment
  await createTransaction({
    job_id: jobId,
    type: "Deposit",
    amount: job.deposit_amount || 0,
    status: "Deposit paid",
  })

  return { success: true }
}

export async function issueVirtualCard(jobId: string) {
  const job = await getJobById(jobId)

  if (!job) {
    return { success: false, message: "Job not found" }
  }

  // Get vendors for this job
  const vendors = await getVendorsByJobId(jobId)
  const vendorNames = vendors.map((v) => v.name).join(", ")

  // Update job status
  await updateJobStatus(jobId, "Card issued")

  // Create card
  const card = await createCard({
    job_id: jobId,
    card_number: "•••• •••• •••• " + Math.floor(1000 + Math.random() * 9000).toString(),
    expiry_date: "06/25",
    status: "Active",
    available_amount: job.deposit_amount || 0,
  })

  // Create transaction for card issuance
  await createTransaction({
    job_id: jobId,
    type: "Card Issued",
    amount: job.deposit_amount || 0,
    vendor: vendorNames,
    status: "Card issued",
  })

  return { success: true, cardId: card?.id }
}

export async function recordPurchase(jobId: string, amount: number, vendor: string) {
  const job = await getJobById(jobId)

  if (!job) {
    return { success: false, message: "Job not found" }
  }

  // Create transaction for purchase
  await createTransaction({
    job_id: jobId,
    type: "Purchase",
    amount: -Math.abs(amount), // Negative amount for purchases
    vendor,
    status: "Materials purchased",
  })

  // Update job status
  await updateJobStatus(jobId, "Materials purchased")

  return { success: true }
}
