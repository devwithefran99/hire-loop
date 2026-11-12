/**
 * Presentation helpers for job listings. Safe to import from both Server and
 * Client Components — keep this file free of Node/Mongo dependencies.
 */

const CURRENCY = "৳"

/**
 * The `jobs.salary` field is free text. Ranges such as `30000-40000` are
 * formatted with a currency symbol; anything else is shown as written.
 */
export function formatSalary(salary: string | null | undefined) {
  const value = salary?.trim()

  if (!value) return "Salary not disclosed"

  const range = value.match(/^(\d[\d,]*)\s*(?:-|–|—|to)\s*(\d[\d,]*)$/i)
  if (!range) return value

  const start = Number(range[1].replace(/,/g, ""))
  const end = Number(range[2].replace(/,/g, ""))

  if (!Number.isFinite(start) || !Number.isFinite(end)) return value

  return `${CURRENCY}${start.toLocaleString("en-US")} – ${CURRENCY}${end.toLocaleString("en-US")}`
}

function toDate(input: Date | string) {
  const date = input instanceof Date ? input : new Date(input)
  return Number.isNaN(date.getTime()) ? null : date
}

/** "2 days ago", "Yesterday", or a calendar date for older posts. */
export function formatPostedDate(input: Date | string) {
  const date = toDate(input)
  if (!date) return ""

  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60_000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/** Compact filter counts: 436 -> "436", 1500 -> "1.5k". */
export function formatCount(value: number) {
  if (!Number.isFinite(value)) return "0"
  if (value < 1000) return value.toLocaleString("en-US")

  const thousands = value / 1000
  return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}k`
}

/** Deterministic company avatar letter, e.g. "PixelSoft" -> "P". */
export function companyInitial(company: string) {
  const match = company.trim().match(/[a-z0-9]/i)
  return match ? match[0].toUpperCase() : "•"
}
