"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Phone, MessageSquare } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "./mobile-nav"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Header() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("2625018982")
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleCall = () => {
    window.location.href = "tel:+12625018982"
  }

  const handleText = () => {
    window.location.href = "sms:+12625018982"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
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
            <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
              <Button variant="outline" className="ml-auto hidden h-8 md:flex" onClick={() => setHelpOpen(true)}>
                Help
              </Button>
              <DialogContent className="sm:max-w-md bg-black text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl">Need Help?</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Text your questions to our support team for immediate assistance.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                  <div className="flex items-center space-x-4 rounded-lg border border-gray-800 p-4">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Support Number</p>
                      <p className="text-lg">+1 (262) 501-8982</p>
                    </div>
                    <Button variant="secondary" onClick={handleCopy} className="bg-gray-800 hover:bg-gray-700">
                      {copySuccess ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleCall}
                      className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      onClick={handleText}
                      className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Text
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full bg-gray-800 hover:bg-gray-700"
                  onClick={() => setHelpOpen(false)}
                >
                  Close
                </Button>
              </DialogContent>
            </Dialog>
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
