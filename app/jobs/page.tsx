import { Suspense } from "react"
import { getJobs } from "@/lib/actions"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import Link from "next/link"
import { ExternalLink, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function JobsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground">View and manage all your jobs</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/jobs/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </Link>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <JobsList />
        </Suspense>
      </main>
    </div>
  )
}

async function JobsList() {
  const jobs = await getJobs()

  const activeJobs = jobs.filter((job) => job.status === "active")
  const pendingJobs = jobs.filter((job) => job.status === "pending")
  const completedJobs = jobs.filter((job) => job.status === "completed")
  const cancelledJobs = jobs.filter((job) => job.status === "cancelled")

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingJobs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledJobs.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <JobsTable jobs={activeJobs} />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <JobsTable jobs={pendingJobs} />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <JobsTable jobs={completedJobs} />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-4">
            <JobsTable jobs={cancelledJobs} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function JobsTable({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No jobs found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-5 gap-4 p-4 font-medium">
        <div>Job Name</div>
        <div>Customer</div>
        <div>Start Date</div>
        <div>Amount</div>
        <div className="text-right">Actions</div>
      </div>
      {jobs.map((job) => (
        <div key={job.id} className="grid grid-cols-5 gap-4 p-4 border-t items-center">
          <div className="font-medium">{job.name}</div>
          <div>{job.customer?.name}</div>
          <div>{formatDate(job.start_date)}</div>
          <div>
            <div className="font-medium">{formatCurrency(job.deposit_amount)}</div>
            <div className="text-sm text-muted-foreground">{formatCurrency(job.spent_amount)} spent</div>
          </div>
          <div className="flex justify-end gap-2">
            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
            <Link href={`/jobs/${job.id}`}>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View job details</span>
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
