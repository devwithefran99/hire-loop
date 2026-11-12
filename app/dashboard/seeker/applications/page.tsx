import Link from "next/link"
import { FileText, Search } from "lucide-react"

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
  { key: "role", label: "Role" },
  { key: "company", label: "Company" },
  { key: "applied", label: "Applied" },
  { key: "status", label: "Status" },
]

export default function SeekerApplicationsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Applications"
        description="Follow every application from submitted to hired."
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

      <Panel
        title="All applications"
        description="0 applications"
        contentClassName="p-0"
      >
        <TableHeader columns={columns} />
        <div className="p-4 sm:p-5">
          <EmptyState
            icon={FileText}
            title="You have not applied to any jobs yet"
            description="Once you apply, you can track the status of each application right here."
            action={
              <Link
                href="/dashboard/seeker/jobs"
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
      </Panel>
    </PageShell>
  )
}
