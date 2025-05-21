"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Loader2 } from "lucide-react"
import { uploadReceiptImage } from "@/app/actions/receipt-actions"
import { createReceiptEntry } from "@/app/actions/receipt-actions"
import { useRouter } from "next/navigation"

interface ReceiptUploadFormProps {
  jobId?: string
  cardId?: string
  onSuccess?: () => void
}

export function ReceiptUploadForm({ jobId, cardId, onSuccess }: ReceiptUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [vendor, setVendor] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const router = useRouter()

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

  // Update the handleSubmit function to use the new createReceiptEntry action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !user) return

    setIsUploading(true)
    setError(null)

    try {
      // Create FormData for the file upload
      const uploadFormData = new FormData()
      uploadFormData.append("userId", user.id)
      uploadFormData.append("file", file)

      // Upload the receipt image
      const { url, error: uploadError } = await uploadReceiptImage(uploadFormData)

      if (uploadError) {
        throw new Error(uploadError)
      }

      // Create FormData for the receipt
      const receiptFormData = new FormData()
      receiptFormData.append("userId", user.id)
      if (jobId) receiptFormData.append("jobId", jobId)
      if (cardId) receiptFormData.append("cardId", cardId)
      receiptFormData.append("date", new Date().toISOString().split("T")[0])
      receiptFormData.append("vendor", vendor)
      receiptFormData.append("amount", "0") // Receipt with 0 transaction value as requested
      receiptFormData.append("description", description)
      receiptFormData.append("receiptUrl", url)

      // Create a receipt entry
      const { error: receiptError } = await createReceiptEntry(receiptFormData)

      if (receiptError) {
        throw new Error(receiptError)
      }

      // Clear the form
      setFile(null)
      setPreview(null)
      setVendor("")
      setDescription("")

      // Call the success callback or redirect
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/receipts")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while uploading the receipt")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {!preview ? (
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="font-medium">Click to upload receipt</p>
          <p className="text-sm text-muted-foreground mt-1">Or drag and drop an image file</p>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
            <img src={preview || "/placeholder.svg"} alt="Receipt preview" className="w-full h-full object-cover" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setFile(null)
              setPreview(null)
            }}
          >
            Replace Image
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="vendor">Vendor</Label>
        <Select value={vendor} onValueChange={setVendor} required>
          <SelectTrigger id="vendor">
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Home Depot">Home Depot</SelectItem>
            <SelectItem value="Lowe's">Lowe's</SelectItem>
            <SelectItem value="Menards">Menards</SelectItem>
            <SelectItem value="Ace Hardware">Ace Hardware</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what was purchased"
          className="min-h-[80px]"
        />
      </div>

      <Button type="submit" className="w-full bg-blue hover:bg-blue-dark" disabled={!file || !vendor || isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Submit Receipt"
        )}
      </Button>
    </form>
  )
}
