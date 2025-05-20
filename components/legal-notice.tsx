import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LegalNotice() {
  return (
    <Alert className="bg-blue/10 border-blue/20 text-foreground">
      <AlertCircle className="h-4 w-4 text-blue" />
      <AlertTitle>Materials-Only Deposit</AlertTitle>
      <AlertDescription className="text-sm">
        JobVault helps you stay compliant with CA law by structuring this as a materials-only deposit. Funds can only be
        used for purchasing materials at the specified vendor.
      </AlertDescription>
    </Alert>
  )
}
