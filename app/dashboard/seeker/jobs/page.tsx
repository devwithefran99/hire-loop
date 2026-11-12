import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import {
  EmptyState,
  PageHeader,
  PageShell,
} from "../../_components/dashboard-ui"

const filters = [
  { id: "all", label: "All jobs" },
  { id: "remote", label: "Remote" },
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
]

export default function SeekerJobsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Jobs"
        description="Search open roles and find your next opportunity."
      />

      <div className="rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-4 sm:p-5">
        <form
          action="/dashboard/seeker/jobs"
          method="get"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-hl-text-tertiary" />
            <Input
              name="q"
              placeholder="Job title, keyword or company"
              aria-label="Search jobs"
              className="h-10 rounded-lg border-hl-border-default bg-hl-surface-input pl-9 text-sm text-hl-text-primary placeholder:text-hl-text-tertiary"
            />
          </div>
          <button
            type="submit"
            className={cn(
              buttonVariants(),
              "h-10 rounded-lg bg-hl-brand px-5 font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
            )}
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-hl-text-tertiary" />
          {filters.map((filter) => (
            <Link
              key={filter.id}
              href={`/dashboard/seeker/jobs?type=${filter.id}`}
              className={cn(
                "rounded-full border border-hl-border-default px-3 py-1 text-xs font-medium transition-colors",
                filter.id === "all"
                  ? "bg-hl-brand/10 text-hl-brand"
                  : "text-hl-text-secondary hover:bg-hl-surface-2 hover:text-hl-text-primary"
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-4 sm:p-5">
        <EmptyState
          icon={Search}
          title="No jobs to show yet"
          description="New roles are added regularly. Try a different search or clear your filters to see everything."
          action={
            <Link
              href="/dashboard/seeker/jobs"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-lg border-hl-border-default bg-hl-surface-1 text-hl-text-primary hover:bg-hl-surface-2"
              )}
            >
              Clear filters
            </Link>
          }
        />
      </div>
    </PageShell>
  )
}
