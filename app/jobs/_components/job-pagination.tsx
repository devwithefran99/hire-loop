import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import { jobsHref, type SearchParamsRecord } from "@/lib/jobs-query"

type JobPaginationProps = {
  page: number
  pageCount: number
  params: SearchParamsRecord
}

type PageEntry = number | "ellipsis"

/** 1 … 4 5 6 … 42 — at most seven touch targets. */
function paginationRange(page: number, pageCount: number): PageEntry[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const pages: PageEntry[] = [1]

  if (page > 3) pages.push("ellipsis")

  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  for (let value = start; value <= end; value += 1) pages.push(value)

  if (page < pageCount - 2) pages.push("ellipsis")

  pages.push(pageCount)
  return pages
}

export function JobPagination({ page, pageCount, params }: JobPaginationProps) {
  if (pageCount <= 1) return null

  const pages = paginationRange(page, pageCount)
  const previousHref = jobsHref(params, {
    page: page > 2 ? String(page - 1) : null,
  })
  const nextHref = jobsHref(params, { page: String(page + 1) })

  return (
    <nav
      aria-label="Job results pages"
      className="flex items-center justify-center gap-1 pt-2 sm:gap-2"
    >
      {page > 1 ? (
        <Link
          href={previousHref}
          rel="prev"
          aria-label="Previous page"
          className="grid size-7 place-items-center rounded-lg border border-hl-border-subtle bg-hl-surface-1 text-hl-text-secondary transition-colors hover:border-hl-border-default hover:bg-hl-surface-2 hover:text-hl-text-primary sm:size-9"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-lg border border-hl-border-subtle bg-hl-surface-1/50 text-hl-text-tertiary opacity-50 sm:size-9"
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((entry, index) => {
        if (entry === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden
              className="grid size-7 place-items-center text-xs text-hl-text-tertiary sm:size-9"
            >
              …
            </span>
          )
        }

        const isCurrent = entry === page

        return (
          <Link
            key={entry}
            href={jobsHref(params, {
              page: entry > 1 ? String(entry) : null,
            })}
            aria-label={`Page ${entry}`}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "grid size-7 place-items-center rounded-lg border text-xs font-semibold transition-colors sm:size-9",
              isCurrent
                ? "border-transparent bg-hl-action-primary text-hl-action-primary-foreground"
                : "border-hl-border-subtle bg-hl-surface-1 text-hl-text-secondary hover:border-hl-border-default hover:bg-hl-surface-2 hover:text-hl-text-primary"
            )}
          >
            {entry}
          </Link>
        )
      })}

      {page < pageCount ? (
        <Link
          href={nextHref}
          rel="next"
          aria-label="Next page"
          className="grid size-7 place-items-center rounded-lg border border-hl-border-subtle bg-hl-surface-1 text-hl-text-secondary transition-colors hover:border-hl-border-default hover:bg-hl-surface-2 hover:text-hl-text-primary sm:size-9"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-lg border border-hl-border-subtle bg-hl-surface-1/50 text-hl-text-tertiary opacity-50 sm:size-9"
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}
