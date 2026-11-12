import Link from "next/link"
import {
  Briefcase,
  CalendarClock,
  FileText,
  PlusCircle,
  UserCheck,
  Users,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-server"
import { JOBS_COLLECTION, type JobDocument } from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
  StatCard,
} from "../_components/dashboard-ui"

export default async function RecruiterDashboardPage() {
  const user = await getCurrentUser()
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there"

  let activeJobs = 0

  if (user) {
    try {
      const db = await getDb()
      activeJobs = await db
        .collection<JobDocument>(JOBS_COLLECTION)
        .countDocuments({ recruiterId: user.id, status: "active" })
    } catch (error) {
      console.error("Failed to count active jobs:", error)
    }
  }

  return (
    <PageShell>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="See how your open roles and candidates are doing."
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active jobs"
          value={String(activeJobs)}
          hint="Roles currently live"
          icon={Briefcase}
        />
        <StatCard
          label="Applications"
          value="0"
          hint="Waiting for review"
          icon={FileText}
        />
        <StatCard
          label="Interviews"
          value="0"
          hint="Scheduled this week"
          icon={CalendarClock}
        />
        <StatCard
          label="Hires"
          value="0"
          hint="Candidates hired"
          icon={UserCheck}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Recent applications"
          description="Candidates who applied to your roles"
          action={
            <Link
              href="/dashboard/recruiter/applications"
              className="text-xs font-semibold text-hl-brand hover:underline"
            >
              View all
            </Link>
          }
        >
          <EmptyState
            icon={Users}
            title="No applications yet"
            description="Publish a job and candidate applications will show up here."
            action={
              <Link
                href="/dashboard/recruiter/jobs/new"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-lg border-hl-border-default bg-hl-surface-1 text-hl-text-primary hover:bg-hl-surface-2"
                )}
              >
                Post your first job
              </Link>
            }
          />
        </Panel>

        <Panel title="Your job posts" description="Manage your open roles">
          <EmptyState
            icon={Briefcase}
            title="No jobs posted"
            description="Create a job post to start receiving applications."
            action={
              <Link
                href="/dashboard/recruiter/jobs"
                className="text-xs font-semibold text-hl-brand hover:underline"
              >
                Go to Manage Jobs
              </Link>
            }
          />
        </Panel>
      </div>
    </PageShell>
  )
}
