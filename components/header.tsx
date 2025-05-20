import Link from "next/link"
import Image from "next/image"
import { CreditCard } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/jobvault-logo.png"
              alt="JobVault Logo"
              width={120}
              height={30}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Jobs
          </Link>
          <Link
            href="/cards"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cards
          </Link>
          <Link
            href="/transactions"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Transactions
          </Link>
          <Button asChild variant="default" size="sm">
            <Link href="/jobs/new">
              <CreditCard className="mr-2 h-4 w-4" />
              New Job
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
