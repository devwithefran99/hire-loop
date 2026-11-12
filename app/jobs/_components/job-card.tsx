import Link from "next/link"
import type { WithId } from "mongodb"
import { Briefcase, MapPin, Wallet } from "lucide-react"

import { BookmarkButton } from "@/components/bookmark-button"
import { companyInitial, formatSalary } from "@/lib/jobs-format"
import type { JobDocument } from "@/lib/jobs"
import { cn } from "@/lib/utils"

type JobCardProps = {
  job: WithId<JobDocument>
  saved: boolean
  isAuthenticated: boolean
}

export function JobCard({ job, saved, isAuthenticated }: JobCardProps) {
  const jobHref = `/jobs/${job._id.toString()}`
  const activelyHiring = job.applicants >= 8

  return (
    <article
      className={cn(
        "group relative flex gap-3.5 rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-4 sm:gap-4 sm:p-5",
        "transition-colors hover:border-hl-border-default hover:bg-hl-surface-2/60"
      )}
    >
      <Link
        href={jobHref}
        aria-label={`View ${job.title} at ${job.company}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:ring-2 focus-visible:ring-hl-brand/40 focus-visible:outline-none"
      />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none relative z-10 grid size-12 shrink-0 place-items-center rounded-xl border border-hl-border-subtle sm:size-14",
          "bg-[linear-gradient(145deg,var(--hl-surface-3),var(--hl-surface-1))]",
          "font-display text-lg font-bold text-hl-brand sm:text-xl"
        )}
      >
        {companyInitial(job.company)}
      </span>

      <div className="pointer-events-none min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[16px] leading-snug font-semibold tracking-[-0.01em] text-hl-text-primary sm:text-[17px]">
              {job.title}
            </h2>
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[12.5px] text-hl-text-secondary">
              <span className="truncate font-medium">{job.company}</span>
              <span aria-hidden className="text-hl-text-tertiary">
                ·
              </span>
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPin
                  aria-hidden
                  className="size-3.5 shrink-0 text-hl-text-tertiary"
                />
                <span className="truncate">
                  {job.location || "Location flexible"}
                </span>
              </span>
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-hl-border-subtle bg-hl-surface-2 px-2 py-1 text-[11px] font-medium text-hl-text-secondary">
            <Wallet aria-hidden className="size-3.5 text-hl-text-tertiary" />
            {formatSalary(job.salary)}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-hl-border-subtle bg-hl-surface-2 px-2 py-1 text-[11px] font-medium text-hl-text-secondary">
            <Briefcase aria-hidden className="size-3.5 text-hl-text-tertiary" />
            {job.employmentType}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            Easy Apply
          </span>

          {activelyHiring && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              Actively hiring
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 shrink-0">
        <BookmarkButton
          jobId={job._id.toString()}
          jobTitle={job.title}
          initialSaved={saved}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </article>
  )
}
