import type { ObjectId } from "mongodb"

export const JOBS_COLLECTION = "jobs"

export type JobStatus = "active" | "draft" | "closed"

export const JOB_STATUSES: JobStatus[] = ["active", "draft", "closed"]

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  active: "Active",
  draft: "Draft",
  closed: "Closed",
}

/** Shape of a document in the `jobs` collection. */
export type JobDocument = {
  _id?: ObjectId
  recruiterId: string
  title: string
  company: string
  location: string
  workType: string
  employmentType: string
  salary: string
  description: string
  requirements: string
  status: JobStatus
  applicants: number
  createdAt: Date
  updatedAt: Date
}

/** Plain, serializable values passed into the job form. */
export type JobFormValues = {
  title: string
  company: string
  location: string
  workType: string
  employmentType: string
  salary: string
  description: string
  requirements: string
  status: JobStatus
}

export const EMPTY_JOB_FORM_VALUES: JobFormValues = {
  title: "",
  company: "",
  location: "",
  workType: "Remote",
  employmentType: "Full-time",
  salary: "",
  description: "",
  requirements: "",
  status: "active",
}

/** Returned by the `createJob` / `updateJob` server actions. */
export type JobFormState = {
  status: "idle" | "success" | "error"
  message: string
}

/** Returned by the `deleteJob` server action. */
export type JobActionResult = {
  success: boolean
  message: string
}
