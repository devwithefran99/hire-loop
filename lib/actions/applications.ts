"use server"

import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

import { getCurrentUser } from "@/lib/auth-server"
import { normalizeRole } from "@/lib/auth-roles"
import {
  APPLICATIONS_COLLECTION,
  type ApplicationDocument,
} from "@/lib/applications"
import { JOBS_COLLECTION, type JobDocument } from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"

export type ApplyToJobResult = {
  success: boolean
  requiresAuth?: boolean
  alreadyApplied?: boolean
  message: string
}

/** Creates an application and bumps the job's applicant count. */
export async function applyToJob(jobId: string): Promise<ApplyToJobResult> {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      requiresAuth: true,
      message: "Sign in to apply for this job.",
    }
  }

  if (normalizeRole(user.role) !== "seeker") {
    return {
      success: false,
      message: "Only job seeker accounts can apply for jobs.",
    }
  }

  if (!ObjectId.isValid(jobId)) {
    return { success: false, message: "This job could not be found." }
  }

  const jobObjectId = new ObjectId(jobId)

  try {
    const db = await getDb()
    const applications = db.collection<ApplicationDocument>(
      APPLICATIONS_COLLECTION
    )

    const existing = await applications.findOne({
      userId: user.id,
      jobId: jobObjectId,
    })

    if (existing) {
      return {
        success: true,
        alreadyApplied: true,
        message: "You have already applied to this job.",
      }
    }

    const job = await db
      .collection<JobDocument>(JOBS_COLLECTION)
      .findOne({ _id: jobObjectId, status: "active" })

    if (!job) {
      return {
        success: false,
        message: "This job is no longer accepting applications.",
      }
    }

    await applications.insertOne({
      userId: user.id,
      jobId: jobObjectId,
      jobTitle: job.title,
      company: job.company,
      status: "submitted",
      appliedAt: new Date(),
    })

    await db
      .collection<JobDocument>(JOBS_COLLECTION)
      .updateOne({ _id: jobObjectId }, { $inc: { applicants: 1 } })

    revalidatePath("/jobs")
    revalidatePath(`/jobs/${jobId}`)
    revalidatePath("/dashboard/seeker/applications")

    return {
      success: true,
      message: `Your application for “${job.title}” was submitted.`,
    }
  } catch (error) {
    // The unique { userId, jobId } index turns a double click into a duplicate
    // key error. Treat it as "already applied" instead of a failure.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return {
        success: true,
        alreadyApplied: true,
        message: "You have already applied to this job.",
      }
    }

    console.error("Failed to apply for job:", error)
    return {
      success: false,
      message: "Could not submit your application. Please try again.",
    }
  }
}
