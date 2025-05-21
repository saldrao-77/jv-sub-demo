"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  items: { href: string; label: string }[]
  setIsOpen: (open: boolean) => void
}

export function MobileNav({ items, setIsOpen }: MobileNavProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex flex-col space-y-3 p-4">
      <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
        <img src="/jobvault-logo.png" alt="JobVault Logo" className="h-6 w-auto" />
        <span className="font-bold">JobVault</span>
      </Link>
      <div className="flex flex-col space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex h-10 w-full items-center rounded-md px-3 text-sm font-medium ${
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Button variant="ghost" size="sm" onClick={signOut} className="justify-start gap-2 px-3">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
