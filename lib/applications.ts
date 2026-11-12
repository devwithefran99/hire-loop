import { ObjectId, type WithId } from "mongodb"

import { JOBS_COLLECTION, type JobDocument } from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"

export const APPLICATIONS_COLLECTION = "applications"

export type ApplicationStatus =
  "submitted" | "reviewing" | "interview" | "rejected" | "hired"

export type ApplicationDocument = {
  _id?: ObjectId
  userId: string
  jobId: ObjectId
  jobTitle: string
  company: string
  status: ApplicationStatus
  appliedAt: Date
}

export type JobApplication = {
  application: WithId<ApplicationDocument>
  job: WithId<JobDocument> | null
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  reviewing: "In review",
  interview: "Interview",
  rejected: "Not selected",
  hired: "Hired",
}

export async function getApplicationForJob(userId: string, jobId: string) {
  if (!ObjectId.isValid(jobId)) return null

  const db = await getDb()
  return db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .findOne({ userId, jobId: new ObjectId(jobId) })
}

/** Every application for a seeker, newest first. */
export async function getApplicationsForUser(
  userId: string
): Promise<JobApplication[]> {
  const db = await getDb()
  const applications = await db
    .collection<ApplicationDocument>(APPLICATIONS_COLLECTION)
    .find({ userId })
    .sort({ appliedAt: -1 })
    .toArray()

  if (applications.length === 0) return []

  const jobs = await db
    .collection<JobDocument>(JOBS_COLLECTION)
    .find({ _id: { $in: applications.map((entry) => entry.jobId) } })
    .toArray()

  const jobsById = new Map(jobs.map((job) => [job._id.toString(), job]))

  return applications.map((application) => ({
    application,
    job: jobsById.get(application.jobId.toString()) ?? null,
  }))
}
