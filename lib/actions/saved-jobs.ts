"use server"

import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

import { getCurrentUser } from "@/lib/auth-server"
import { JOBS_COLLECTION, type JobDocument } from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"
import { SAVED_JOBS_COLLECTION, type SavedJobDocument } from "@/lib/saved-jobs"

export type ToggleSavedJobResult = {
  success: boolean
  saved?: boolean
  requiresAuth?: boolean
  message: string
}

/**
 * Saves or unsaves one job for the signed-in user.
 *
 * Used from the bookmark buttons on `/jobs` and `/jobs/[id]`.
 */
export async function toggleSavedJob(
  jobId: string
): Promise<ToggleSavedJobResult> {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      requiresAuth: true,
      message: "Sign in to save jobs.",
    }
  }

  if (!ObjectId.isValid(jobId)) {
    return { success: false, message: "This job could not be found." }
  }

  const jobObjectId = new ObjectId(jobId)

  try {
    const db = await getDb()
    const savedJobs = db.collection<SavedJobDocument>(SAVED_JOBS_COLLECTION)
    const existing = await savedJobs.findOne({
      userId: user.id,
      jobId: jobObjectId,
    })

    let saved: boolean

    if (existing) {
      await savedJobs.deleteOne({ userId: user.id, jobId: jobObjectId })
      saved = false
    } else {
      // Confirm the job exists before creating a dangling save.
      const job = await db
        .collection<JobDocument>(JOBS_COLLECTION)
        .findOne({ _id: jobObjectId })

      if (!job) {
        return { success: false, message: "This job could not be found." }
      }

      await savedJobs.insertOne({
        userId: user.id,
        jobId: jobObjectId,
        createdAt: new Date(),
      })
      saved = true
    }

    revalidatePath("/jobs")
    revalidatePath(`/jobs/${jobId}`)
    revalidatePath("/dashboard/seeker/saved-jobs")

    return {
      success: true,
      saved,
      message: saved ? "Job saved." : "Job removed from saved.",
    }
  } catch (error) {
    console.error("Failed to toggle saved job:", error)
    return {
      success: false,
      message: "Could not update your saved jobs. Please try again.",
    }
  }
}
