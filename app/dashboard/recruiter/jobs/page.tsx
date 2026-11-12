import Link from "next/link"
import type { Filter, WithId } from "mongodb"
import { Briefcase, Pencil, PlusCircle, Search } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { requireRole } from "@/lib/auth-server"
import { JOBS_COLLECTION, type JobDocument, type JobStatus } from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
  TableHeader,
} from "../../_components/dashboard-ui"
import { DeleteJobButton } from "./_components/delete-job-button"

const columns = [
  { key: "job", label: "Job title" },
  { key: "status", label: "Status" },
  { key: "applicants", label: "Applicants" },
  { key: "posted", label: "Posted" },
  { key: "actions", label: "Actions", className: "text-right" },
]

const tabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Drafts" },
  { id: "closed", label: "Closed" },
] as const

const statusStyles: Record<JobStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  closed: "bg-hl-surface-3 text-hl-text-secondary",
}

function isJobStatus(value: string): value is JobStatus {
  return value === "active" || value === "draft" || value === "closed"
}

export default async function RecruiterJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const user = await requireRole("recruiter")
  const { status, q } = await searchParams

  const activeTab = status && isJobStatus(status) ? status : "all"
  const search = q?.trim() ?? ""

  const filter: Filter<JobDocument> = { recruiterId: user.id }
  if (activeTab !== "all") filter.status = activeTab
  if (search) filter.title = { $regex: search, $options: "i" }

  let jobs: WithId<JobDocument>[] = []
  let loadFailed = false

  try {
    const db = await getDb()
    jobs = await db
      .collection<JobDocument>(JOBS_COLLECTION)
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) {
    console.error("Failed to load jobs:", error)
    loadFailed = true
  }

  return (
    <PageShell>
      <PageHeader
        title="Manage Jobs"
        description="Create, edit and close the roles you are hiring for."
        action={
          <Link
            href="/dashboard/recruiter/jobs/new"
            className={cn(
              buttonVariants(),
              "h-9 rounded-lg bg-hl-brand px-3.5 font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
            )}
          >
            <PlusCircle className="size-4" />
            Post a job
          </Link>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/recruiter/jobs?status=${tab.id}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-hl-brand/10 text-hl-brand"
                  : "text-hl-text-secondary hover:bg-hl-surface-2 hover:text-hl-text-primary"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form
          action="/dashboard/recruiter/jobs"
          method="get"
          className="relative w-full sm:max-w-xs"
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-hl-text-tertiary" />
          <Input
            name="q"
            defaultValue={search}
            placeholder="Search job posts"
            aria-label="Search job posts"
            className="h-9 rounded-lg border-hl-border-default bg-hl-surface-input pl-9 text-sm text-hl-text-primary placeholder:text-hl-text-tertiary"
          />
        </form>
      </div>

      {loadFailed && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Could not load your jobs from MongoDB. Please refresh and try again.
        </p>
      )}

      <Panel contentClassName="p-0">
        <TableHeader columns={columns} />

        {jobs.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState
              icon={Briefcase}
              title={
                search || activeTab !== "all"
                  ? "No jobs match your filters"
                  : "No job posts yet"
              }
              description={
                search || activeTab !== "all"
                  ? "Try a different search term or switch back to the All tab."
                  : "Your job posts will appear here with their status and applicant count."
              }
              action={
                <Link
                  href="/dashboard/recruiter/jobs/new"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-lg border-hl-border-default bg-hl-surface-1 text-hl-text-primary hover:bg-hl-surface-2"
                  )}
                >
                  <PlusCircle className="size-4" />
                  Create a job post
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-hl-border-subtle">
            {jobs.map((job) => (
              <div
                key={job._id.toString()}
                className="flex flex-col gap-2 px-4 py-3.5 md:grid md:grid-cols-5 md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-hl-text-primary">
                    {job.title}
                  </p>
                  <p className="truncate text-xs text-hl-text-tertiary">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>

                <div>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase",
                      statusStyles[job.status]
                    )}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-sm text-hl-text-secondary">
                  {job.applicants} applicant
                  {job.applicants === 1 ? "" : "s"}
                </p>

                <p className="text-sm text-hl-text-secondary">
                 {new Date(job.createdAt).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})}
                </p>

                <div className="flex items-center gap-1 md:justify-end">
                  <Link
                    href={`/dashboard/recruiter/jobs/${job._id.toString()}/edit`}
                    aria-label={`Edit ${job.title}`}
                    title={`Edit ${job.title}`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-hl-text-tertiary transition-colors hover:bg-hl-surface-2 hover:text-hl-text-primary focus-visible:ring-2 focus-visible:ring-hl-brand/40 focus-visible:outline-none"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteJobButton
                    jobId={job._id.toString()}
                    jobTitle={job.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </PageShell>
  )
}
