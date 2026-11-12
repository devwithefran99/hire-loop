import Link from "next/link"
import { Bookmark, Search } from "lucide-react"

import { BookmarkButton } from "@/components/bookmark-button"
import { buttonVariants } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-server"
import {
  companyInitial,
  formatPostedDate,
  formatSalary,
} from "@/lib/jobs-format"
import { getSavedJobsForUser, type SavedJob } from "@/lib/saved-jobs"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
} from "../../_components/dashboard-ui"

export default async function SavedJobsPage() {
  const user = await getCurrentUser()

  let savedJobs: SavedJob[] = []
  let loadFailed = false

  if (user) {
    try {
      savedJobs = await getSavedJobsForUser(user.id)
    } catch (error) {
      console.error("Failed to load saved jobs:", error)
      loadFailed = true
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Saved Jobs"
        description="Roles you bookmarked to review later."
        action={
          <Link
            href="/jobs"
            className={cn(
              buttonVariants(),
              "h-9 rounded-lg bg-hl-brand px-3.5 font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
            )}
          >
            <Search className="size-4" />
            Find jobs
          </Link>
        }
      />

      {loadFailed && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Could not load your saved jobs. Please refresh and try again.
        </p>
      )}

      <Panel contentClassName="p-0">
        {savedJobs.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState
              icon={Bookmark}
              title="No saved jobs yet"
              description="Tap the bookmark icon on any job posting and it will appear here so you can apply when you are ready."
              action={
                <Link
                  href="/jobs"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-lg border-hl-border-default bg-hl-surface-1 text-hl-text-primary hover:bg-hl-surface-2"
                  )}
                >
                  Browse jobs
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-hl-border-subtle">
            {savedJobs.map(({ job, savedAt }) => {
              const jobHref = `/jobs/${job._id.toString()}`

              return (
                <div
                  key={job._id.toString()}
                  className="flex items-start gap-3 px-4 py-4 sm:items-center sm:gap-4 sm:px-5"
                >
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-lg border border-hl-border-subtle bg-hl-surface-2 font-display text-base font-bold text-hl-brand"
                  >
                    {companyInitial(job.company)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={jobHref}
                      className="truncate text-sm font-semibold text-hl-text-primary hover:text-hl-brand"
                    >
                      {job.title}
                    </Link>
                    <p className="truncate text-xs text-hl-text-tertiary">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""} ·{" "}
                      {job.employmentType}
                    </p>
                    <p className="mt-0.5 text-[11px] text-hl-text-tertiary">
                      {formatSalary(job.salary)} · Saved{" "}
                      {formatPostedDate(savedAt)}
                    </p>
                  </div>

                  <BookmarkButton
                    jobId={job._id.toString()}
                    jobTitle={job.title}
                    initialSaved
                    isAuthenticated
                    refreshOnChange
                  />
                </div>
              )
            })}
          </div>
        )}
      </Panel>
    </PageShell>
  )
}
