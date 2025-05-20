"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, Plus, Search } from "lucide-react"
import type { Job } from "@/lib/types"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface JobsContentProps {
  jobs: Job[]
}

export default function JobsContent({ jobs }: JobsContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const activeJobs = jobs.filter((job) => job.status === "active")
  const pendingJobs = jobs.filter((job) => job.status === "pending")
  const completedJobs = jobs.filter((job) => job.status === "completed")
  const cancelledJobs = jobs.filter((job) => job.status === "cancelled")

  const filterJobs = (jobList: Job[]) => {
    return jobList.filter(
      (job) =>
        job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const filteredActiveJobs = filterJobs(activeJobs)
  const filteredPendingJobs = filterJobs(pendingJobs)
  const filteredCompletedJobs = filterJobs(completedJobs)
  const filteredCancelledJobs = filterJobs(cancelledJobs)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">All Jobs</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="w-[150px] sm:w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link href="/jobs/new">
                <Plus className="mr-2 h-4 w-4" />
                New Job
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="active">Active ({filteredActiveJobs.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filteredPendingJobs.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filteredCompletedJobs.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({filteredCancelledJobs.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 mt-4">
              {renderJobList(filteredActiveJobs)}
            </TabsContent>
            <TabsContent value="pending" className="space-y-4 mt-4">
              {renderJobList(filteredPendingJobs)}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4 mt-4">
              {renderJobList(filteredCompletedJobs)}
            </TabsContent>
            <TabsContent value="cancelled" className="space-y-4 mt-4">
              {renderJobList(filteredCancelledJobs)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function renderJobList(jobs: Job[]) {
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
