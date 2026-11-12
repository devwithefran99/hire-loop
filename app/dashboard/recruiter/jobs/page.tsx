import Link from "next/link"
import { Briefcase, PlusCircle, Search } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
  TableHeader,
} from "../../_components/dashboard-ui"

const columns = [
  { key: "job", label: "Job title" },
  { key: "status", label: "Status" },
  { key: "applicants", label: "Applicants" },
  { key: "posted", label: "Posted" },
]

const tabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Drafts" },
  { id: "closed", label: "Closed" },
]

export default function RecruiterJobsPage() {
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
                tab.id === "all"
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
            placeholder="Search job posts"
            aria-label="Search job posts"
            className="h-9 rounded-lg border-hl-border-default bg-hl-surface-input pl-9 text-sm text-hl-text-primary placeholder:text-hl-text-tertiary"
          />
        </form>
      </div>

      <Panel contentClassName="p-0">
        <TableHeader columns={columns} />
        <div className="p-4 sm:p-5">
          <EmptyState
            icon={Briefcase}
            title="No job posts yet"
            description="Your job posts will appear here with their status and applicant count."
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
      </Panel>
    </PageShell>
  )
}
