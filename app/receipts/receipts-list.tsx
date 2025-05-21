"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReceiptUploadForm } from "@/components/receipt-upload-form"
import { ReceiptViewer } from "@/components/receipt-viewer"
import { formatCurrency } from "@/lib/utils"
import { PlusIcon, SearchIcon, FilterIcon } from "lucide-react"

interface Receipt {
  id: number
  job_id: number | null
  card_id: number | null
  date: string
  vendor: string
  amount: number
  description: string
  receipt_url: string
  status: string
  jobs?: {
    job_name: string
    customer_name: string
  }
  cards?: {
    card_number: string
    vendor: string
  }
}

interface ReceiptsListProps {
  initialReceipts: Receipt[]
  userId: string
}

export function ReceiptsList({ initialReceipts, userId }: ReceiptsListProps) {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const router = useRouter()

  // Filter receipts based on search term
  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.jobs?.job_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.jobs?.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group receipts by job
  const receiptsByJob = filteredReceipts.reduce(
    (acc, receipt) => {
      const jobId = receipt.job_id || "unassigned"
      const jobName = receipt.jobs?.job_name || "Unassigned"

      if (!acc[jobId]) {
        acc[jobId] = {
          jobId,
          jobName,
          receipts: [],
        }
      }

      acc[jobId].receipts.push(receipt)
      return acc
    },
    {} as Record<string | number, { jobId: string | number; jobName: string; receipts: Receipt[] }>,
  )

  // Handle successful receipt upload
  const handleUploadSuccess = () => {
    setIsUploadDialogOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Receipts</h1>
          <p className="text-muted-foreground">View and manage all your receipts</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue hover:bg-blue-dark">
              <PlusIcon className="mr-2 h-4 w-4" />
              Upload Receipt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Receipt</DialogTitle>
              <DialogDescription>Upload a receipt image and provide details about the purchase.</DialogDescription>
            </DialogHeader>
            <ReceiptUploadForm onSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search receipts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <FilterIcon className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Receipts</TabsTrigger>
          <TabsTrigger value="by-job">By Job</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {filteredReceipts.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No receipts found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReceipts.map((receipt) => (
                <Card key={receipt.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{receipt.vendor}</CardTitle>
                    <CardDescription>
                      {new Date(receipt.date).toLocaleDateString()}
                      {receipt.jobs && ` • ${receipt.jobs.job_name}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="aspect-[4/3] bg-secondary rounded-md flex items-center justify-center overflow-hidden mb-2">
                      <img
                        src={receipt.receipt_url || "/placeholder.svg"}
                        alt={`Receipt from ${receipt.vendor}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{receipt.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm font-medium">{formatCurrency(receipt.amount)}</div>
                    <ReceiptViewer receiptUrl={receipt.receipt_url} description={receipt.description} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="by-job" className="space-y-6 mt-4">
          {Object.values(receiptsByJob).length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No receipts found</p>
            </div>
          ) : (
            Object.values(receiptsByJob).map((group) => (
              <div key={group.jobId} className="space-y-4">
                <h2 className="text-xl font-semibold">{group.jobName}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.receipts.map((receipt) => (
                    <Card key={receipt.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{receipt.vendor}</CardTitle>
                        <CardDescription>{new Date(receipt.date).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="aspect-[4/3] bg-secondary rounded-md flex items-center justify-center overflow-hidden mb-2">
                          <img
                            src={receipt.receipt_url || "/placeholder.svg"}
                            alt={`Receipt from ${receipt.vendor}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{receipt.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm font-medium">{formatCurrency(receipt.amount)}</div>
                        <ReceiptViewer receiptUrl={receipt.receipt_url} description={receipt.description} />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
