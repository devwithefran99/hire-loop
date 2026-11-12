import Link from "next/link"
import { FileText, Users } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
  Panel,
  TableHeader,
} from "../../_components/dashboard-ui"

const columns = [
  { key: "candidate", label: "Candidate" },
  { key: "role", label: "Role" },
  { key: "applied", label: "Applied" },
  { key: "status", label: "Status" },
]

const tabs = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "hired", label: "Hired" },
]

export default function RecruiterApplicationsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Applications"
        description="Review candidates and move them through your pipeline."
      />

      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-3 sm:p-4">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/dashboard/recruiter/applications?status=${tab.id}`}
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

      <Panel contentClassName="p-0">
        <TableHeader columns={columns} />
        <div className="p-4 sm:p-5">
          <EmptyState
            icon={Users}
            title="No applications yet"
            description="When candidates apply to your job posts, you can review them here."
            action={
              <Link
                href="/dashboard/recruiter/jobs"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-lg border-hl-border-default bg-hl-surface-1 text-hl-text-primary hover:bg-hl-surface-2"
                )}
              >
                <FileText className="size-4" />
                Manage jobs
              </Link>
            }
          />
        </div>
      </Panel>
    </PageShell>
  )
}
