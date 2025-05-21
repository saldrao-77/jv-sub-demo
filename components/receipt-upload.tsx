"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { uploadReceipt, createReceiptTransaction } from "@/lib/api"
import { ImageIcon } from "lucide-react"

interface ReceiptUploadProps {
  jobId: string
  cardId: string
  onSuccess?: () => void
}

export function ReceiptUpload({ jobId, cardId, onSuccess }: ReceiptUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSubmit = async () => {
    if (!file || !user) return

    setIsUploading(true)
    setError(null)

    try {
      // Upload the receipt image
      const { url, error: uploadError } = await uploadReceipt(file, user.id)

      if (uploadError) {
        throw new Error("Failed to upload receipt")
      }

      // Create a receipt transaction
      const receiptData = {
        jobId,
        cardId,
        date: new Date().toISOString().split("T")[0],
        vendor: "Receipt Upload",
        amount: 0, // Receipt with 0 transaction value as requested
        description: "Receipt uploaded via app",
        receiptUrl: url,
      }

      const { error: transactionError } = await createReceiptTransaction(receiptData, user.id)

      if (transactionError) {
        throw new Error("Failed to create receipt transaction")
      }

      // Clear the form
      setFile(null)
      setPreview(null)

      // Call the success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while uploading the receipt")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {!preview ? (
        <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="font-medium">Click to upload receipt</p>
            <p className="text-sm text-muted-foreground mt-1">Or drag and drop an image file</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
            <img src={preview || "/placeholder.svg"} alt="Receipt preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFile(null)
                setPreview(null)
              }}
            >
              Replace
            </Button>
            <Button
              type="button"
              className="flex-1 bg-blue hover:bg-blue-dark"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Submit Receipt"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
