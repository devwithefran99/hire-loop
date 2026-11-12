"use server"

import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

import { getCurrentUser } from "@/lib/auth-server"
import { normalizeRole } from "@/lib/auth-roles"
import {
  JOBS_COLLECTION,
  type JobActionResult,
  type JobDocument,
  type JobFormState,
  type JobStatus,
} from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"

function readText(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === "string" ? value.trim() : ""
}

function readStatus(formData: FormData): JobStatus {
  const status = readText(formData, "status")

  return status === "active" || status === "draft" || status === "closed"
    ? status
    : "active"
}

function revalidateJobPages(jobId?: string) {
  revalidatePath("/dashboard/recruiter/jobs")
  revalidatePath("/dashboard/recruiter")

  if (jobId) {
    revalidatePath(`/dashboard/recruiter/jobs/${jobId}/edit`)
  }
}

/**
 * Creates a job in MongoDB for the signed-in recruiter.
 *
 * Used as a React form action:
 * `const [state, formAction, isPending] = useActionState(createJob, initialState)`
 */
export async function createJob(
  _previousState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const user = await getCurrentUser()

  if (!user) {
    return { status: "error", message: "Please sign in to post a job." }
  }

  if (normalizeRole(user.role) !== "recruiter") {
    return {
      status: "error",
      message: "Only recruiter accounts can post jobs.",
    }
  }

  const title = readText(formData, "title")
  const company = readText(formData, "company")
  const description = readText(formData, "description")

  if (!title || !company || !description) {
    return {
      status: "error",
      message: "Job title, company and description are required.",
    }
  }

  const now = new Date()
  const status = readStatus(formData)
  const job: JobDocument = {
    recruiterId: user.id,
    title,
    company,
    location: readText(formData, "location"),
    workType: readText(formData, "workType") || "Remote",
    employmentType: readText(formData, "employment") || "Full-time",
    salary: readText(formData, "salary"),
    description,
    requirements: readText(formData, "requirements"),
    status,
    applicants: 0,
    createdAt: now,
    updatedAt: now,
  }

  try {
    const db = await getDb()
    await db.collection<JobDocument>(JOBS_COLLECTION).insertOne(job)
  } catch (error) {
    console.error("Failed to save job:", error)
    return {
      status: "error",
      message: "Could not save the job. Please try again.",
    }
  }

  revalidateJobPages()

  return {
    status: "success",
    message:
      status === "active"
        ? `“${title}” was published successfully.`
        : `“${title}” was saved successfully.`,
  }
}

/** Updates one job, but only if it belongs to the signed-in recruiter. */
export async function updateJob(
  _previousState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const user = await getCurrentUser()

  if (!user) {
    return { status: "error", message: "Please sign in to edit a job." }
  }

  if (normalizeRole(user.role) !== "recruiter") {
    return {
      status: "error",
      message: "Only recruiter accounts can edit jobs.",
    }
  }

  const jobId = readText(formData, "jobId")

  if (!ObjectId.isValid(jobId)) {
    return { status: "error", message: "This job could not be found." }
  }

  const title = readText(formData, "title")
  const company = readText(formData, "company")
  const description = readText(formData, "description")

  if (!title || !company || !description) {
    return {
      status: "error",
      message: "Job title, company and description are required.",
    }
  }

  try {
    const db = await getDb()
    const result = await db.collection<JobDocument>(JOBS_COLLECTION).updateOne(
      { _id: new ObjectId(jobId), recruiterId: user.id },
      {
        $set: {
          title,
          company,
          location: readText(formData, "location"),
          workType: readText(formData, "workType") || "Remote",
          employmentType: readText(formData, "employment") || "Full-time",
          salary: readText(formData, "salary"),
          description,
          requirements: readText(formData, "requirements"),
          status: readStatus(formData),
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return {
        status: "error",
        message: "Job not found, or you do not have permission to edit it.",
      }
    }
  } catch (error) {
    console.error("Failed to update job:", error)
    return {
      status: "error",
      message: "Could not update the job. Please try again.",
    }
  }

  revalidateJobPages(jobId)

  return {
    status: "success",
    message: `“${title}” was updated successfully.`,
  }
}

/** Deletes one job, but only if it belongs to the signed-in recruiter. */
export async function deleteJob(jobId: string): Promise<JobActionResult> {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "Please sign in to delete a job." }
  }

  if (normalizeRole(user.role) !== "recruiter") {
    return {
      success: false,
      message: "Only recruiter accounts can delete jobs.",
    }
  }

  if (!ObjectId.isValid(jobId)) {
    return { success: false, message: "This job could not be found." }
  }

  try {
    const db = await getDb()
    const result = await db.collection<JobDocument>(JOBS_COLLECTION).deleteOne({
      _id: new ObjectId(jobId),
      recruiterId: user.id,
    })

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "Job not found, or you do not have permission to delete it.",
      }
    }
  } catch (error) {
    console.error("Failed to delete job:", error)
    return {
      success: false,
      message: "Could not delete the job. Please try again.",
    }
  }

  revalidateJobPages()

  return { success: true, message: "Job deleted." }
}
