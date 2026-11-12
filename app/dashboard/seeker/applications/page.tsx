import Link from "next/link"
import { FileText, Search } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-server"
import {
  APPLICATION_STATUS_LABELS,
  getApplicationsForUser,
  type ApplicationStatus,
  type JobApplication,
} from "@/lib/applications"
import { formatPostedDate } from "@/lib/jobs-format"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
  TableHeader,
} from "../../_components/dashboard-ui"

const columns = [
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "applied", label: "Applied" },
  { key: "status", label: "Status" },
]

const statusStyles: Record<ApplicationStatus, string> = {
  submitted: "bg-hl-brand/10 text-hl-brand",
  reviewing: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  interview: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  rejected: "bg-hl-surface-3 text-hl-text-secondary",
  hired: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
}

export default async function SeekerApplicationsPage() {
  const user = await getCurrentUser()

  let applications: JobApplication[] = []
  let loadFailed = false

  if (user) {
    try {
      applications = await getApplicationsForUser(user.id)
    } catch (error) {
      console.error("Failed to load applications:", error)
      loadFailed = true
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Applications"
        description="Follow every application from submitted to hired."
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
          Could not load your applications. Please refresh and try again.
        </p>
      )}

      <Panel
        title="All applications"
        description={`${applications.length} application${
          applications.length === 1 ? "" : "s"
        }`}
        contentClassName="p-0"
      >
        <TableHeader columns={columns} />

        {applications.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState
              icon={FileText}
              title="You have not applied to any jobs yet"
              description="Once you apply, you can track the status of each application right here."
              action={
                <Link
                  href="/jobs"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-lg border-hl-border-default bg-hl-surface-1 text-hl-text-primary hover:bg-hl-surface-2"
                  )}
                >
                  Browse open jobs
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-hl-border-subtle">
            {applications.map(({ application, job }) => (
              <div
                key={application._id.toString()}
                className="flex flex-col gap-1.5 px-4 py-3.5 md:grid md:grid-cols-4 md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  {job ? (
                    <Link
                      href={`/jobs/${job._id.toString()}`}
                      className="truncate text-sm font-semibold text-hl-text-primary hover:text-hl-brand"
                    >
                      {job.title}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-semibold text-hl-text-primary">
                      {application.jobTitle}
                    </p>
                  )}
                  <p className="truncate text-xs text-hl-text-tertiary md:hidden">
                    {application.company}
                  </p>
                </div>

                <p className="hidden truncate text-sm text-hl-text-secondary md:block">
                  {application.company}
                </p>

                <p className="text-xs text-hl-text-secondary md:text-sm">
                  {formatPostedDate(application.appliedAt)}
                </p>

                <div>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase",
                      statusStyles[application.status]
                    )}
                  >
                    {APPLICATION_STATUS_LABELS[application.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </PageShell>
  )
}
