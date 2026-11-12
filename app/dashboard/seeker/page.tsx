import Link from "next/link"
import {
  Bookmark,
  Clock,
  Eye,
  FileText,
  Search,
  Send,
  Sparkles,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-server"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
  StatCard,
} from "../_components/dashboard-ui"

export default async function SeekerDashboardPage() {
  const user = await getCurrentUser()
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there"

  return (
    <PageShell>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Track your applications, saved roles and interviews in one place."
        action={
          <Link
            href="/dashboard/seeker/jobs"
            className={cn(
              buttonVariants(),
              "h-9 rounded-lg bg-hl-brand px-3.5 font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
            )}
          >
            <Search className="size-4" />
            Browse jobs
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applications"
          value="0"
          hint="No applications sent yet"
          icon={Send}
        />
        <StatCard
          label="Saved jobs"
          value="0"
          hint="Bookmark roles to revisit"
          icon={Bookmark}
        />
        <StatCard
          label="Interviews"
          value="0"
          hint="Scheduled conversations"
          icon={FileText}
        />
        <StatCard
          label="Profile views"
          value="0"
          hint="Recruiters who found you"
          icon={Eye}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Recommended jobs"
          description="Roles matched to your profile"
          action={
            <Link
              href="/dashboard/seeker/jobs"
              className="text-xs font-semibold text-hl-brand hover:underline"
            >
              View all
            </Link>
          }
        >
          <EmptyState
            icon={Sparkles}
            title="Your recommendations are on the way"
            description="Add your skills, experience and preferred roles so we can start matching you with the right jobs."
            action={
              <Link
                href="/dashboard/seeker/settings"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-lg border-hl-border-default bg-hl-surface-1 text-hl-text-primary hover:bg-hl-surface-2"
                )}
              >
                Complete your profile
              </Link>
            }
          />
        </Panel>

        <Panel title="Application activity" description="Your latest updates">
          <EmptyState
            icon={Clock}
            title="Nothing here yet"
            description="When you apply to a job, its status will show up here."
          />
        </Panel>
      </div>
    </PageShell>
  )
}
