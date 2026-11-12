import { ObjectId, type Document, type WithId } from "mongodb"

import {
  EMPLOYMENT_TYPES,
  JOBS_PAGE_SIZE,
  POSTED_RANGES,
  WORK_TYPES,
  isEmploymentType,
  isJobSort,
  isPostedRange,
  isWorkType,
  postedRangeDays,
  type JobSort,
  type PostedRange,
} from "@/lib/job-taxonomy"
import { JOBS_COLLECTION, type JobDocument } from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"

export type SearchParamsRecord = Record<string, string | string[] | undefined>

export type BrowseJobsFilters = {
  q: string
  employment: string[]
  workType: string[]
  posted: PostedRange | ""
  sort: JobSort
  page: number
}

export type JobCounts = {
  employmentType: Record<string, number>
  workType: Record<string, number>
}

export type BrowseJobsResult = {
  jobs: WithId<JobDocument>[]
  total: number
  page: number
  pageCount: number
  counts: JobCounts
}

type CountRow = { _id: string | null; count: number }

type JobRow = WithId<JobDocument> & { __createdAt?: Date | null }

/** Normalises legacy ISO-string dates and real `Date` values in one field. */
const createdAtExpression = {
  $convert: {
    input: "$createdAt",
    to: "date",
    onError: null,
    onNull: null,
  },
} as const

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function listValue(value: string | string[] | undefined) {
  const values = Array.isArray(value) ? value : value ? [value] : []
  return values.flatMap((entry) => entry.split(",")).filter(Boolean)
}

export function parseBrowseJobsParams(
  params: SearchParamsRecord
): BrowseJobsFilters {
  const rawPosted = firstValue(params.posted)
  const rawSort = firstValue(params.sort)
  const rawPage = Number.parseInt(firstValue(params.page) ?? "1", 10)

  return {
    q: (firstValue(params.q) ?? "").trim().slice(0, 120),
    employment: listValue(params.employment).filter(isEmploymentType),
    workType: listValue(params.workType).filter(isWorkType),
    posted: isPostedRange(rawPosted) ? rawPosted : "",
    sort: isJobSort(rawSort) ? rawSort : "recent",
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function emptyCounts(): JobCounts {
  return {
    employmentType: Object.fromEntries(
      EMPLOYMENT_TYPES.map((type) => [type, 0])
    ),
    workType: Object.fromEntries(WORK_TYPES.map((type) => [type, 0])),
  }
}

function countsFrom(rows: CountRow[], keys: readonly string[]) {
  const counts = Object.fromEntries(keys.map((key) => [key, 0]))

  for (const row of rows) {
    if (row._id && row._id in counts) counts[row._id] = row.count
  }

  return counts
}

function sortStage(sort: JobSort): Document {
  switch (sort) {
    case "oldest":
      return { __createdAt: 1, _id: 1 }
    case "company":
      return { company: 1, __createdAt: -1, _id: -1 }
    case "applicants":
      return { applicants: -1, __createdAt: -1, _id: -1 }
    case "recent":
    default:
      return { __createdAt: -1, _id: -1 }
  }
}

/**
 * Reads one page of active jobs plus the facet counts used by the filter
 * sidebar. Search and facet counts run as two aggregations in parallel.
 *
 * `createdAt` is stored as a real `Date` by the app, but some seeded documents
 * use ISO strings. `$convert` makes both shapes sort and filter correctly.
 */
export async function browseJobs(
  filters: BrowseJobsFilters
): Promise<BrowseJobsResult> {
  const db = await getDb()
  const jobs = db.collection<JobDocument>(JOBS_COLLECTION)

  const baseMatch: Record<string, unknown> = { status: "active" }

  if (filters.q) {
    const pattern = escapeRegex(filters.q)
    baseMatch.$or = [
      { title: { $regex: pattern, $options: "i" } },
      { company: { $regex: pattern, $options: "i" } },
      { location: { $regex: pattern, $options: "i" } },
      { requirements: { $regex: pattern, $options: "i" } },
    ]
  }

  const days = filters.posted ? postedRangeDays(filters.posted) : null
  if (days) {
    baseMatch.__createdAt = {
      $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    }
  }

  const basePipeline: Document[] = [
    { $addFields: { __createdAt: createdAtExpression } },
    { $match: baseMatch },
  ]

  const pageMatch: Record<string, unknown> = { ...baseMatch }

  if (filters.employment.length > 0) {
    pageMatch.employmentType = { $in: filters.employment }
  }
  if (filters.workType.length > 0) {
    pageMatch.workType = { $in: filters.workType }
  }

  const skip = (filters.page - 1) * JOBS_PAGE_SIZE

  const [countsResult, pageResult] = await Promise.all([
    jobs
      .aggregate<{
        employmentType: CountRow[]
        workType: CountRow[]
      }>([
        ...basePipeline,
        {
          $facet: {
            employmentType: [
              { $group: { _id: "$employmentType", count: { $sum: 1 } } },
            ],
            workType: [{ $group: { _id: "$workType", count: { $sum: 1 } } }],
          },
        },
      ])
      .toArray(),
    jobs
      .aggregate<{
        jobs: JobRow[]
        total: { count: number }[]
      }>([
        ...basePipeline,
        { $match: pageMatch },
        {
          $facet: {
            jobs: [
              { $sort: sortStage(filters.sort) },
              { $skip: skip },
              { $limit: JOBS_PAGE_SIZE },
              { $project: { __createdAt: 0 } },
            ],
            total: [{ $count: "count" }],
          },
        },
      ])
      .toArray(),
  ])

  const facets = countsResult[0]
  const pageData = pageResult[0]
  const total = pageData?.total[0]?.count ?? 0

  return {
    jobs: pageData?.jobs ?? [],
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / JOBS_PAGE_SIZE)),
    counts: facets
      ? {
          employmentType: countsFrom(facets.employmentType, EMPLOYMENT_TYPES),
          workType: countsFrom(facets.workType, WORK_TYPES),
        }
      : emptyCounts(),
  }
}

/** Loads a single active job for the public details page. */
export async function getPublicJob(id: string) {
  if (!ObjectId.isValid(id)) return null

  const db = await getDb()
  return db
    .collection<JobDocument>(JOBS_COLLECTION)
    .findOne({ _id: new ObjectId(id), status: "active" })
}

/** Builds a `/jobs` URL while keeping the current filters. */
export function jobsHref(
  params: SearchParamsRecord,
  updates: Record<string, string | string[] | null> = {}
) {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    const values = Array.isArray(value) ? value : value ? [value] : []
    for (const entry of values) {
      if (entry) search.append(key, entry)
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    search.delete(key)
    const values = Array.isArray(value) ? value : value ? [value] : []
    for (const entry of values) search.append(key, entry)
  }

  const query = search.toString()
  return query ? `/jobs?${query}` : "/jobs"
}

export { EMPLOYMENT_TYPES, WORK_TYPES, POSTED_RANGES }
