import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "./mobile-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/jobvault-logo.png" alt="JobVault Logo" width={120} height={30} className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard" className="transition-colors hover:text-blue text-foreground">
              Dashboard
            </Link>
            <Link href="/jobs" className="transition-colors hover:text-blue text-foreground/60">
              Jobs
            </Link>
            <Link href="/transactions" className="transition-colors hover:text-blue text-foreground/60">
              Transactions
            </Link>
            <Link href="/cards" className="transition-colors hover:text-blue text-foreground/60">
              Cards
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="ml-auto hidden h-8 md:flex">
              Help
            </Button>
          </div>
          <nav className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <MobileNav />
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  )
}
