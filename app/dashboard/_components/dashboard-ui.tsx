import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function PageShell({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8",
        className
      )}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-hl-text-primary sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-hl-text-secondary">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      )}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: React.ReactNode
  hint?: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-hl-text-secondary">
          {label}
        </p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-hl-brand/10 text-hl-brand">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl leading-none font-bold tracking-tight text-hl-text-primary">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-hl-text-tertiary">{hint}</p>}
    </div>
  )
}

export function Panel({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-hl-border-subtle bg-hl-surface-1",
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-hl-border-subtle px-4 py-3 sm:px-5">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold text-hl-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-hl-text-tertiary">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn("p-4 sm:p-5", contentClassName)}>{children}</div>
    </section>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-hl-border-default px-6 py-10 text-center",
        className
      )}
    >
      <span className="grid size-11 place-items-center rounded-full bg-hl-surface-2 text-hl-text-tertiary">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-3 text-sm font-semibold text-hl-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-hl-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Header row shared by the empty list tables on the dashboard pages. */
export function TableHeader({
  columns,
}: {
  columns: { key: string; label: string; className?: string }[]
}) {
  return (
    <div
      className="hidden border-b border-hl-border-subtle bg-hl-surface-2/60 px-4 py-2.5 text-[11px] font-semibold tracking-[0.08em] text-hl-text-tertiary uppercase md:grid md:gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((column) => (
        <span key={column.key} className={column.className}>
          {column.label}
        </span>
      ))}
    </div>
  )
}
