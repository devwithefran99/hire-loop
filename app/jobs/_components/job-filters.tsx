"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react"

import { EMPLOYMENT_TYPES, POSTED_RANGES, WORK_TYPES } from "@/lib/job-taxonomy"
import { formatCount } from "@/lib/jobs-format"
import { cn } from "@/lib/utils"

import type { JobCounts } from "@/lib/jobs-query"

type JobFiltersProps = {
  counts: JobCounts
}

function FilterHeading({
  children,
  count,
}: {
  children: React.ReactNode
  count?: number
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-hl-text-primary">
        {children}
      </h3>
      {typeof count === "number" && count > 0 && (
        <span className="rounded-full bg-hl-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-hl-brand">
          {count}
        </span>
      )}
    </div>
  )
}

function CheckMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[4px] border transition-colors",
        checked
          ? "border-hl-brand bg-hl-brand text-hl-brand-foreground"
          : "border-hl-border-default bg-hl-surface-input"
      )}
    >
      {checked && <Check className="size-3" strokeWidth={3} />}
    </span>
  )
}

function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
        checked
          ? "border-hl-brand bg-hl-brand text-hl-brand-foreground"
          : "border-hl-border-default bg-hl-surface-input"
      )}
    >
      {checked && <span className="size-1.5 rounded-full bg-current" />}
    </span>
  )
}

function optionRowClass(checked: boolean, layout: "between" | "start") {
  return cn(
    "flex cursor-pointer rounded-md text-[13px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-hl-brand/40",
    layout === "between"
      ? "items-center justify-between gap-3"
      : "items-center gap-2.5",
    checked ? "font-medium text-hl-text-primary" : "text-hl-text-secondary"
  )
}

export function JobFilters({ counts }: JobFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const [open, setOpen] = React.useState(false)

  const selectedEmployment = searchParams.getAll("employment")
  const selectedWorkTypes = searchParams.getAll("workType")
  const selectedPosted = searchParams.get("posted") ?? ""

  const activeCount =
    selectedEmployment.length +
    selectedWorkTypes.length +
    (selectedPosted ? 1 : 0)

  function update(mutate: (params: URLSearchParams) => void) {
    const next = new URLSearchParams(searchParams.toString())
    mutate(next)
    next.delete("page")

    startTransition(() => {
      const query = next.toString()
      router.replace(query ? `/jobs?${query}` : "/jobs", { scroll: false })
    })
  }

  function toggleValue(key: "employment" | "workType", value: string) {
    update((params) => {
      const current = params.getAll(key)
      params.delete(key)
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value]
      for (const entry of next) params.append(key, entry)
    })
  }

  function setPosted(value: string) {
    update((params) => {
      params.delete("posted")
      if (value) params.set("posted", value)
    })
  }

  function clearAll() {
    update((params) => {
      params.delete("employment")
      params.delete("workType")
      params.delete("posted")
    })
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="job-filters-panel"
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-hl-border-subtle bg-hl-surface-1 px-4 text-sm font-semibold text-hl-text-primary lg:hidden",
          "focus-visible:ring-2 focus-visible:ring-hl-brand/40 focus-visible:outline-none"
        )}
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-hl-text-tertiary" />
          Filters
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-hl-brand text-[10px] font-bold text-hl-brand-foreground">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-hl-text-tertiary transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        id="job-filters-panel"
        aria-busy={isPending}
        className={cn(
          "mt-3 overflow-hidden rounded-xl border border-hl-border-subtle bg-hl-surface-1 lg:mt-0",
          !open && "hidden lg:block",
          isPending && "opacity-70"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-hl-border-subtle px-4 py-3.5">
          <h2 className="text-sm font-semibold text-hl-text-primary">
            Filters
          </h2>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] font-semibold text-hl-brand transition-opacity hover:opacity-80"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="grid size-7 place-items-center rounded-md text-hl-text-tertiary hover:bg-hl-surface-2 hover:text-hl-text-primary lg:hidden"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-hl-border-subtle">
          <section className="px-4 py-4">
            <FilterHeading count={selectedEmployment.length}>
              Job Type
            </FilterHeading>
            <ul className="mt-3 space-y-2.5">
              {EMPLOYMENT_TYPES.filter(
                (type) =>
                  (counts.employmentType[type] ?? 0) > 0 ||
                  selectedEmployment.includes(type)
              ).map((type) => {
                const checked = selectedEmployment.includes(type)
                const count = counts.employmentType[type] ?? 0

                return (
                  <li key={type}>
                    <label className={optionRowClass(checked, "between")}>
                      <span className="flex min-w-0 items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleValue("employment", type)}
                          className="sr-only"
                        />
                        <CheckMark checked={checked} />
                        <span className="truncate">{type}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-hl-text-tertiary tabular-nums">
                        {formatCount(count)}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="px-4 py-4">
            <FilterHeading count={selectedWorkTypes.length}>
              Work Type
            </FilterHeading>
            <ul className="mt-3 space-y-2.5">
              {WORK_TYPES.filter(
                (type) =>
                  (counts.workType[type] ?? 0) > 0 ||
                  selectedWorkTypes.includes(type)
              ).map((type) => {
                const checked = selectedWorkTypes.includes(type)
                const count = counts.workType[type] ?? 0

                return (
                  <li key={type}>
                    <label className={optionRowClass(checked, "between")}>
                      <span className="flex min-w-0 items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleValue("workType", type)}
                          className="sr-only"
                        />
                        <CheckMark checked={checked} />
                        <span className="truncate">{type}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-hl-text-tertiary tabular-nums">
                        {formatCount(count)}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="px-4 py-4">
            <FilterHeading>Date Posted</FilterHeading>
            <ul className="mt-3 space-y-2.5">
              <li>
                <label className={optionRowClass(!selectedPosted, "start")}>
                  <input
                    type="radio"
                    name="posted"
                    checked={!selectedPosted}
                    onChange={() => setPosted("")}
                    className="sr-only"
                  />
                  <RadioMark checked={!selectedPosted} />
                  Any time
                </label>
              </li>
              {POSTED_RANGES.map((range) => {
                const checked = selectedPosted === range.value

                return (
                  <li key={range.value}>
                    <label className={optionRowClass(checked, "start")}>
                      <input
                        type="radio"
                        name="posted"
                        checked={checked}
                        onChange={() => setPosted(range.value)}
                        className="sr-only"
                      />
                      <RadioMark checked={checked} />
                      {range.label}
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>
    </aside>
  )
}
