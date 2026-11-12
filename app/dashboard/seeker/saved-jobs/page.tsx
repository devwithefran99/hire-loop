import Link from "next/link"
import { Bookmark, Search } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
} from "../../_components/dashboard-ui"

export default function SavedJobsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Saved Jobs"
        description="Roles you bookmarked to review later."
        action={
          <Link
            href="/dashboard/seeker/jobs"
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

      <div className="rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-4 sm:p-5">
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Tap the bookmark icon on any job posting and it will appear here so you can apply when you are ready."
          action={
            <Link
              href="/dashboard/seeker/jobs"
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
    </PageShell>
  )
}
