import { ObjectId, type WithId } from "mongodb"

import { JOBS_COLLECTION, type JobDocument } from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"

export const SAVED_JOBS_COLLECTION = "savedJobs"

/**
 * One document per (user, job) pair. A unique compound index on
 * `{ userId: 1, jobId: 1 }` keeps this idempotent — see the MongoDB setup
 * snippet in the project notes.
 */
export type SavedJobDocument = {
  userId: string
  jobId: ObjectId
  createdAt: Date
}

export type SavedJob = {
  savedAt: Date
  job: WithId<JobDocument>
}

/** Saved job ids for the current user, limited to the jobs on screen. */
export async function getSavedJobIds(userId: string, jobIds: string[]) {
  const ids = jobIds.filter((id) => ObjectId.isValid(id))
  if (ids.length === 0) return new Set<string>()

  const db = await getDb()
  const docs = await db
    .collection<SavedJobDocument>(SAVED_JOBS_COLLECTION)
    .find(
      { userId, jobId: { $in: ids.map((id) => new ObjectId(id)) } },
      { projection: { jobId: 1 } }
    )
    .toArray()

  return new Set(docs.map((doc) => doc.jobId.toString()))
}

/** All saved jobs for a seeker, newest save first. */
export async function getSavedJobsForUser(userId: string): Promise<SavedJob[]> {
  const db = await getDb()
  const saved = await db
    .collection<SavedJobDocument>(SAVED_JOBS_COLLECTION)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()

  if (saved.length === 0) return []

  const jobs = await db
    .collection<JobDocument>(JOBS_COLLECTION)
    .find({ _id: { $in: saved.map((entry) => entry.jobId) } })
    .toArray()

  const jobsById = new Map(jobs.map((job) => [job._id.toString(), job]))

  return saved.flatMap((entry) => {
    const job = jobsById.get(entry.jobId.toString())
    return job ? [{ savedAt: entry.createdAt, job }] : []
  })
}

/** Returns saved ids for a single job — used by the details page. */
export async function isJobSaved(userId: string, jobId: string) {
  if (!ObjectId.isValid(jobId)) return false

  const db = await getDb()
  const saved = await db
    .collection<SavedJobDocument>(SAVED_JOBS_COLLECTION)
    .findOne({ userId, jobId: new ObjectId(jobId) })

  return Boolean(saved)
}
