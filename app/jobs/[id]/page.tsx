import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Briefcase,
  CalendarClock,
  MapPin,
  Users,
  Wallet,
} from "lucide-react"

import { BookmarkButton } from "@/components/bookmark-button"
import { getCurrentUser } from "@/lib/auth-server"
import { getApplicationForJob } from "@/lib/applications"
import {
  companyInitial,
  formatPostedDate,
  formatSalary,
} from "@/lib/jobs-format"
import { getPublicJob } from "@/lib/jobs-query"
import { isJobSaved } from "@/lib/saved-jobs"
import { cn } from "@/lib/utils"

import { ApplyButton } from "../_components/apply-button"

export const metadata: Metadata = {
  title: "Job details — HireLoop",
  description:
    "Read the full role description, requirements and salary, then apply in a few clicks.",
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const job = await getPublicJob(id).catch((error) => {
    console.error("Failed to load job:", error)
    return null
  })

  if (!job) notFound()

  const user = await getCurrentUser().catch(() => null)

  let saved = false
  let applied = false

  if (user) {
    const [savedResult, application] = await Promise.all([
      isJobSaved(user.id, id).catch(() => false),
      getApplicationForJob(user.id, id).catch(() => null),
    ])
    saved = savedResult
    applied = Boolean(application)
  }

  const jobId = job._id.toString()
  const posted = formatPostedDate(job.createdAt)
  const postedLabel = posted === "Just now" ? "just now" : posted
  const skills = job.requirements
    .split(/[,\n;]/)
    .map((skill) => skill.trim())
    .filter(Boolean)

  const overview = [
    { icon: Briefcase, label: "Employment", value: job.employmentType },
    { icon: MapPin, label: "Work type", value: job.workType },
    { icon: MapPin, label: "Location", value: job.location || "Flexible" },
    { icon: Wallet, label: "Salary", value: formatSalary(job.salary) },
    {
      icon: CalendarClock,
      label: "Posted",
      value: formatPostedDate(job.createdAt),
    },
    {
      icon: Users,
      label: "Applicants",
      value: `${job.applicants} applicant${job.applicants === 1 ? "" : "s"}`,
    },
  ]

  return (
    <main className="min-h-[calc(100svh-92px)] bg-background">
      <div className="mx-auto w-full max-w-[980px] px-4 py-6 pb-16 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-hl-text-secondary transition-colors hover:text-hl-text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to all jobs
        </Link>

        <article className="mt-4 overflow-hidden rounded-2xl border border-hl-border-subtle bg-hl-surface-1">
          <header className="border-b border-hl-border-subtle p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className={cn(
                  "grid size-14 shrink-0 place-items-center rounded-xl border border-hl-border-subtle sm:size-16",
                  "bg-[linear-gradient(145deg,var(--hl-surface-3),var(--hl-surface-1))]",
                  "font-display text-xl font-bold text-hl-brand sm:text-2xl"
                )}
              >
                {companyInitial(job.company)}
              </span>

              <div className="min-w-0 flex-1">
                <h1 className="font-display text-xl leading-tight font-bold tracking-[-0.02em] text-hl-text-primary sm:text-2xl">
                  {job.title}
                </h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-hl-text-secondary">
                  <span className="font-medium">{job.company}</span>
                  <span aria-hidden className="text-hl-text-tertiary">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin
                      aria-hidden
                      className="size-3.5 text-hl-text-tertiary"
                    />
                    {job.location || "Location flexible"}
                  </span>
                </p>
              </div>

              <BookmarkButton
                jobId={jobId}
                jobTitle={job.title}
                initialSaved={saved}
                isAuthenticated={Boolean(user)}
                className="size-9"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-hl-border-subtle bg-hl-surface-2 px-2.5 py-1 text-[11px] font-medium text-hl-text-secondary">
                <Wallet
                  aria-hidden
                  className="size-3.5 text-hl-text-tertiary"
                />
                {formatSalary(job.salary)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-hl-border-subtle bg-hl-surface-2 px-2.5 py-1 text-[11px] font-medium text-hl-text-secondary">
                <Briefcase
                  aria-hidden
                  className="size-3.5 text-hl-text-tertiary"
                />
                {job.employmentType}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-current"
                />
                Easy Apply
              </span>
              {job.applicants >= 8 && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-current"
                  />
                  Actively hiring
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-hl-text-tertiary">
                Posted {postedLabel} · {job.applicants} applicant
                {job.applicants === 1 ? "" : "s"} so far
              </p>
              <ApplyButton
                jobId={jobId}
                jobTitle={job.title}
                initialApplied={applied}
                isAuthenticated={Boolean(user)}
              />
            </div>
          </header>

          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_268px]">
            <div className="min-w-0 space-y-7">
              <section>
                <h2 className="text-sm font-semibold text-hl-text-primary">
                  About the role
                </h2>
                <p className="mt-3 text-sm leading-7 whitespace-pre-line text-hl-text-secondary">
                  {job.description ||
                    "No description was provided for this role."}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold text-hl-text-primary">
                  Requirements
                </h2>
                {skills.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-md border border-hl-border-subtle bg-hl-surface-2 px-2.5 py-1 text-[11px] font-medium text-hl-text-secondary"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-hl-text-secondary">
                    No specific requirements were listed for this role.
                  </p>
                )}
              </section>
            </div>

            <aside className="h-fit rounded-xl border border-hl-border-subtle bg-hl-surface-2/50 p-4">
              <h2 className="text-[13px] font-semibold text-hl-text-primary">
                Job overview
              </h2>
              <dl className="mt-3 divide-y divide-hl-border-subtle">
                {overview.map(({ icon: Icon, label, value }, index) => (
                  <div
                    key={`${label}-${index}`}
                    className="flex items-start gap-2.5 py-2.5"
                  >
                    <Icon
                      aria-hidden
                      className="mt-0.5 size-3.5 shrink-0 text-hl-text-tertiary"
                    />
                    <div className="min-w-0">
                      <dt className="text-[10px] font-medium tracking-[0.06em] text-hl-text-tertiary uppercase">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-[13px] font-medium text-hl-text-primary">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </article>
      </div>
    </main>
  )
}
