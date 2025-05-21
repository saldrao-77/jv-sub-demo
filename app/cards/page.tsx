"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Plus, Search, ShieldCheck, AlertCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Progress } from "@/components/ui/progress"

const cardsData = [
  {
    id: "1",
    jobId: "1",
    jobName: "Bathroom Renovation",
    customer: "Sarah Johnson",
    vendor: "Home Depot",
    cardNumber: "•••• •••• •••• 4589",
    expiryDate: "06/25",
    issuedDate: "May 19, 2025",
    initialAmount: 850,
    remainingAmount: 850,
    status: "active",
    issuedTo: "John Smith",
    role: "Contractor",
    transactions: [],
  },
  {
    id: "2",
    jobId: "2",
    jobName: "Kitchen Remodel",
    customer: "Michael Chen",
    vendor: "Lowe's, Home Depot",
    cardNumber: "•••• •••• •••• 7823",
    expiryDate: "06/25",
    issuedDate: "May 13, 2025",
    initialAmount: 1200,
    remainingAmount: 450,
    status: "active",
    issuedTo: "Alex Wong",
    role: "Foreman",
    transactions: [
      {
        date: "May 15, 2025",
        vendor: "Lowe's",
        amount: 750,
        description: "Kitchen cabinets and countertops",
      },
    ],
  },
  {
    id: "3",
    jobId: "3",
    jobName: "Deck Construction",
    customer: "Robert Garcia",
    vendor: "Home Depot, Ace Hardware",
    cardNumber: "•••• •••• •••• 3456",
    expiryDate: "06/25",
    issuedDate: "May 19, 2025",
    initialAmount: 750,
    remainingAmount: 750,
    status: "active",
    issuedTo: "Carlos Rodriguez",
    role: "Carpenter",
    transactions: [],
  },
  {
    id: "4",
    jobId: "5",
    jobName: "Patio Installation",
    customer: "David Wilson",
    vendor: "Home Depot, Lowe's",
    cardNumber: "•••• •••• •••• 9012",
    expiryDate: "05/25",
    issuedDate: "Apr 30, 2025",
    initialAmount: 950,
    remainingAmount: 0,
    status: "used",
    issuedTo: "Mike Johnson",
    role: "Landscaper",
    transactions: [
      {
        date: "May 2, 2025",
        vendor: "Home Depot",
        amount: 950,
        description: "Patio materials and pavers",
      },
    ],
  },
  {
    id: "5",
    jobId: "6",
    jobName: "Garage Conversion",
    customer: "Emily Rodriguez",
    vendor: "Home Depot, Menards",
    cardNumber: "•••• •••• •••• 5678",
    expiryDate: "05/25",
    issuedDate: "Apr 23, 2025",
    initialAmount: 2000,
    remainingAmount: 0,
    status: "used",
    issuedTo: "David Lee",
    role: "Project Manager",
    transactions: [
      {
        date: "Apr 25, 2025",
        vendor: "Home Depot",
        amount: 1200,
        description: "Drywall, insulation, and framing",
      },
      {
        date: "Apr 27, 2025",
        vendor: "Menards",
        amount: 800,
        description: "Electrical supplies and fixtures",
      },
    ],
  },
  {
    id: "6",
    jobId: "7",
    jobName: "Fence Installation",
    customer: "Thomas Brown",
    vendor: "Home Depot",
    cardNumber: "•••• •••• •••• 1234",
    expiryDate: "05/25",
    issuedDate: "Apr 17, 2025",
    initialAmount: 600,
    remainingAmount: 0,
    status: "expired",
    issuedTo: "James Wilson",
    role: "Installer",
    transactions: [
      {
        date: "Apr 18, 2025",
        vendor: "Home Depot",
        amount: 600,
        description: "Fence posts and panels",
      },
    ],
  },
]

export default function CardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredCards = cardsData.filter((card) => {
    const matchesSearch =
      card.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.issuedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || card.status === statusFilter

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && card.status === "active") ||
      (activeTab === "used" && card.status === "used") ||
      (activeTab === "expired" && card.status === "expired")

    return matchesSearch && matchesStatus && matchesTab
  })

  // Calculate totals for the stats cards
  const totalActiveCards = cardsData.filter((card) => card.status === "active").length
  const totalActiveAmount = cardsData
    .filter((card) => card.status === "active")
    .reduce((sum, card) => sum + card.remainingAmount, 0)
  const totalSpent = cardsData.reduce((sum, card) => sum + (card.initialAmount - card.remainingAmount), 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center rounded-full bg-green-900/20 px-2 py-1 text-xs font-medium text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Active
          </span>
        )
      case "used":
        return (
          <span className="inline-flex items-center rounded-full bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Used
          </span>
        )
      case "expired":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-900/20 px-2 py-1 text-xs font-medium text-gray-400">
            <Clock className="mr-1 h-3 w-3" />
            Expired
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-900/20 px-2 py-1 text-xs font-medium text-gray-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unknown
          </span>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cards</h1>
            <p className="text-muted-foreground">Manage your virtual materials cards</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Link href="/cards/new">
              <Button className="bg-blue hover:bg-blue-dark">
                <Plus className="mr-2 h-4 w-4" /> Issue New Card
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Cards</CardTitle>
              <CardDescription>Currently active virtual cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalActiveCards}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to use for materials purchases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Funds</CardTitle>
              <CardDescription>Total funds on active cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue">${totalActiveAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Across {totalActiveCards} active cards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
              <CardDescription>Materials purchased with cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From {cardsData.filter((card) => card.initialAmount > card.remainingAmount).length} cards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Number</CardTitle>
              <CardDescription>For receipt submission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+18886395525</div>
              <p className="text-xs text-muted-foreground mt-1">Text your receipts to this number</p>
            </CardContent>
          </Card>
        </div>

        {/* Cards List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
              <CardTitle>Virtual Cards</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search cards..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select defaultValue="all" onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Cards</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="used">Used</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                {filteredCards.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCards.map((card) => (
                      <Card key={card.id} className="overflow-hidden">
                        <div
                          className={`h-2 w-full ${
                            card.status === "active"
                              ? "bg-green-400"
                              : card.status === "used"
                                ? "bg-purple-400"
                                : "bg-gray-400"
                          }`}
                        ></div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{card.jobName}</CardTitle>
                              <CardDescription>{card.customer}</CardDescription>
                            </div>
                            {getStatusBadge(card.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="rounded-xl bg-gradient-to-r from-blue-dark to-blue p-4 text-white mb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs opacity-80">MATERIALS ONLY</div>
                                <div className="mt-3 text-base font-bold">{card.cardNumber}</div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-xs font-medium">Vendor Locked</span>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between items-end">
                              <div>
                                <div className="text-xs opacity-80">VALID THRU</div>
                                <div className="text-sm font-medium">{card.expiryDate}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs opacity-80">AVAILABLE</div>
                                <div className="text-base font-bold">${card.remainingAmount.toFixed(2)}</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Vendor(s):</span>
                              <span className="font-medium">{card.vendor}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Issued To:</span>
                              <span className="font-medium">{card.issuedTo}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Role:</span>
                              <span className="font-medium">{card.role}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Issued:</span>
                              <span className="font-medium">{card.issuedDate}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Usage:</span>
                                <span className="font-medium">
                                  ${(card.initialAmount - card.remainingAmount).toFixed(2)} of $
                                  {card.initialAmount.toFixed(2)}
                                </span>
                              </div>
                              <Progress value={(1 - card.remainingAmount / card.initialAmount) * 100} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/cards/${card.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No cards found matching your search criteria.
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing {filteredCards.length} of {cardsData.length} cards
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
