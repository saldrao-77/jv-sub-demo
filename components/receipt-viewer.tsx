"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"

interface ReceiptViewerProps {
  receiptUrl: string
  description?: string
}

export function ReceiptViewer({ receiptUrl, description }: ReceiptViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="flex items-center space-x-1">
        <ImageIcon className="h-4 w-4" />
        <span>View Receipt</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{description || "Receipt"}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={receiptUrl || "/placeholder.svg"}
              alt="Receipt"
              className="max-h-[70vh] object-contain rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
