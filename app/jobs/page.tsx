import type { Metadata } from "next"
import Link from "next/link"
import { Briefcase, Search } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-server"
import { cn } from "@/lib/utils"
import {
  browseJobs,
  jobsHref,
  parseBrowseJobsParams,
  type BrowseJobsResult,
  type SearchParamsRecord,
} from "@/lib/jobs-query"
import { getSavedJobIds } from "@/lib/saved-jobs"

import { JobCard } from "./_components/job-card"
import { JobFilters } from "./_components/job-filters"
import { JobPagination } from "./_components/job-pagination"
import { JobSearchBar } from "./_components/job-search-bar"
import { JobSortSelect } from "./_components/job-sort-select"

export const metadata: Metadata = {
  title: "Browse Jobs — HireLoop",
  description:
    "Search thousands of curated roles by title, company, location and work type. Find your next opportunity on HireLoop.",
}

const emptyResult: BrowseJobsResult = {
  jobs: [],
  total: 0,
  page: 1,
  pageCount: 1,
  counts: { employmentType: {}, workType: {} },
}

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>
}) {
  const params = await searchParams
  const filters = parseBrowseJobsParams(params)

  const [browseResult, user] = await Promise.all([
    browseJobs(filters).catch((error) => {
      console.error("Failed to load jobs:", error)
      return null
    }),
    getCurrentUser().catch(() => null),
  ])

  const result = browseResult ?? { ...emptyResult, page: filters.page }

  let savedJobIds = new Set<string>()
  if (user && result.jobs.length > 0) {
    savedJobIds = await getSavedJobIds(
      user.id,
      result.jobs.map((job) => job._id.toString())
    ).catch((error) => {
      console.error("Failed to load saved jobs:", error)
      return new Set<string>()
    })
  }

  const hasFilters =
    filters.q.length > 0 ||
    filters.employment.length > 0 ||
    filters.workType.length > 0 ||
    filters.posted.length > 0

  const clearFiltersHref = jobsHref(params, {
    q: null,
    employment: null,
    workType: null,
    posted: null,
    page: null,
  })

  return (
    <main className="min-h-[calc(100svh-92px)] bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-4 pb-16 sm:px-6 sm:pt-6 lg:px-8 xl:px-20">
        <JobSearchBar q={filters.q} params={params} />

        <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <JobFilters counts={result.counts} />

          <section aria-label="Job results" className="min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-hl-text-primary">
                  Found {result.total.toLocaleString("en-US")} Professional{" "}
                  {result.total === 1 ? "Job" : "Jobs"}
                </h1>
                {filters.q && (
                  <p className="mt-0.5 truncate text-xs text-hl-text-tertiary">
                    Results for “{filters.q}”
                  </p>
                )}
              </div>

              <JobSortSelect />
            </div>

            {!browseResult && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                Could not load jobs from MongoDB. Please refresh and try again.
              </p>
            )}

            {browseResult && result.jobs.length === 0 ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-hl-border-default bg-hl-surface-1 px-6 py-14 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-hl-surface-2 text-hl-text-tertiary">
                  <Search className="size-5" />
                </span>
                <h2 className="mt-4 text-sm font-semibold text-hl-text-primary">
                  No jobs match your search
                </h2>
                <p className="mt-1 max-w-sm text-sm text-hl-text-secondary">
                  Try a different keyword, remove a filter, or check back soon —
                  new roles are added regularly.
                </p>
                {hasFilters && (
                  <Link
                    href={clearFiltersHref}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "mt-5 h-9 rounded-lg border-hl-border-default bg-hl-surface-1 px-4 text-hl-text-primary hover:bg-hl-surface-2"
                    )}
                  >
                    Clear search & filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {result.jobs.map((job) => (
                  <JobCard
                    key={job._id.toString()}
                    job={job}
                    saved={savedJobIds.has(job._id.toString())}
                    isAuthenticated={Boolean(user)}
                  />
                ))}
              </div>
            )}

            {result.jobs.length > 0 && (
              <div className="mt-6">
                <JobPagination
                  page={result.page}
                  pageCount={result.pageCount}
                  params={params}
                />
              </div>
            )}

            {browseResult && result.jobs.length > 0 && (
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-hl-text-tertiary">
                <Briefcase className="size-3" aria-hidden />
                Showing {result.jobs.length} of{" "}
                {result.total.toLocaleString("en-US")} open roles
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
