import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { SearchParamsRecord } from "@/lib/jobs-query"

type JobSearchBarProps = {
  q: string
  params: SearchParamsRecord
}

const preservedKeys = ["employment", "workType", "posted", "sort"] as const

export function JobSearchBar({ q, params }: JobSearchBarProps) {
  return (
    <form
      action="/jobs"
      method="get"
      role="search"
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-hl-border-subtle bg-hl-surface-1 p-2",
        "shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)] sm:flex-row sm:items-center sm:gap-3 sm:p-2.5"
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-hl-text-tertiary"
        />
        <Input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by job title, keywords..."
          aria-label="Search jobs by title, company or keywords"
          autoComplete="off"
          className="h-12 rounded-xl border-0 bg-transparent pr-4 pl-11 text-[15px] text-hl-text-primary shadow-none placeholder:text-hl-text-tertiary focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />
      </div>

      {preservedKeys.map((key) => {
        const value = params[key]
        const values = Array.isArray(value) ? value : value ? [value] : []

        return values.map((entry) => (
          <input
            key={`${key}-${entry}`}
            type="hidden"
            name={key}
            value={entry}
          />
        ))
      })}

      <Button
        type="submit"
        className={cn(
          "h-12 w-full rounded-xl bg-hl-action-primary px-7 text-[15px] font-semibold text-hl-action-primary-foreground sm:w-auto",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-hl-action-primary/90"
        )}
      >
        Search Jobs
      </Button>
    </form>
  )
}
