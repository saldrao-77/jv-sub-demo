import Link from "next/link"
import Image from "next/image"

export function MobileNav() {
  return (
    <div className="flex flex-col space-y-3 p-4">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/jobvault-logo.png" alt="JobVault Logo" width={120} height={30} className="h-8 w-auto" />
      </Link>
      <div className="flex flex-col space-y-2 mt-4">
        <Link href="/dashboard" className="text-foreground font-medium">
          Dashboard
        </Link>
        <Link href="/jobs" className="text-foreground/60 font-medium">
          Jobs
        </Link>
        <Link href="/transactions" className="text-foreground/60 font-medium">
          Transactions
        </Link>
        <Link href="/cards" className="text-foreground/60 font-medium">
          Cards
        </Link>
        <Link href="/help" className="text-foreground/60 font-medium">
          Help
        </Link>
      </div>
    </div>
  )
}
