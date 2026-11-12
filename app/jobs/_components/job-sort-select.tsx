"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

import { JOB_SORTS } from "@/lib/job-taxonomy"

export function JobSortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  const current = searchParams.get("sort") ?? "recent"

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams.toString())
    const value = event.target.value

    next.delete("page")

    if (value === "recent") next.delete("sort")
    else next.set("sort", value)

    startTransition(() => {
      const query = next.toString()
      router.replace(query ? `/jobs?${query}` : "/jobs", { scroll: false })
    })
  }

  return (
    <label className="flex items-center gap-2 text-xs text-hl-text-secondary">
      <span className="hidden whitespace-nowrap sm:inline">Sort by</span>
      <span className="relative inline-flex">
        <select
          value={current}
          onChange={handleChange}
          disabled={isPending}
          aria-label="Sort jobs"
          className="h-8 appearance-none rounded-lg border border-hl-border-subtle bg-hl-surface-1 pr-8 pl-3 text-xs font-medium text-hl-text-primary transition-colors outline-none hover:border-hl-border-default focus-visible:border-hl-brand/60 focus-visible:ring-2 focus-visible:ring-hl-brand/20 disabled:opacity-60"
        >
          {JOB_SORTS.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-hl-text-tertiary"
        />
      </span>
    </label>
  )
}
