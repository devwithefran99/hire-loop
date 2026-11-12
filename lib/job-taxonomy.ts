/**
 * Shared, dependency-free job metadata used by both the browse filters (client)
 * and the MongoDB query layer (server).
 */

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
] as const

export const WORK_TYPES = ["Remote", "Hybrid", "On-site"] as const

export const POSTED_RANGES = [
  { value: "24h", label: "Past 24 hours", days: 1 },
  { value: "7d", label: "Past week", days: 7 },
  { value: "30d", label: "Past month", days: 30 },
] as const

export const JOB_SORTS = [
  { value: "recent", label: "Most recent" },
  { value: "oldest", label: "Oldest" },
  { value: "company", label: "Company (A–Z)" },
  { value: "applicants", label: "Most applicants" },
] as const

export const JOBS_PAGE_SIZE = 6

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]
export type WorkType = (typeof WORK_TYPES)[number]
export type PostedRange = (typeof POSTED_RANGES)[number]["value"]
export type JobSort = (typeof JOB_SORTS)[number]["value"]

export function isEmploymentType(value: unknown): value is EmploymentType {
  return (
    typeof value === "string" &&
    (EMPLOYMENT_TYPES as readonly string[]).includes(value)
  )
}

export function isWorkType(value: unknown): value is WorkType {
  return (
    typeof value === "string" &&
    (WORK_TYPES as readonly string[]).includes(value)
  )
}

export function isPostedRange(value: unknown): value is PostedRange {
  return (
    typeof value === "string" &&
    POSTED_RANGES.some((range) => range.value === value)
  )
}

export function isJobSort(value: unknown): value is JobSort {
  return (
    typeof value === "string" && JOB_SORTS.some((sort) => sort.value === value)
  )
}

export function postedRangeDays(value: PostedRange) {
  return POSTED_RANGES.find((range) => range.value === value)?.days ?? null
}
