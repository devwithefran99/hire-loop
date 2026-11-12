import Link from "next/link"
import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import { ArrowLeft } from "lucide-react"

import { updateJob } from "@/lib/actions/jobs"
import { requireRole } from "@/lib/auth-server"
import {
  JOBS_COLLECTION,
  type JobDocument,
  type JobFormValues,
} from "@/lib/jobs"
import { getDb } from "@/lib/mongodb"

import { PageHeader, PageShell } from "../../../../_components/dashboard-ui"
import { JobForm } from "../../_components/job-form"

export default async function EditRecruiterJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireRole("recruiter")
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const job = await db.collection<JobDocument>(JOBS_COLLECTION).findOne({
    _id: new ObjectId(id),
    recruiterId: user.id,
  })

  if (!job) {
    notFound()
  }

  const initialValues: JobFormValues = {
    title: job.title,
    company: job.company,
    location: job.location,
    workType: job.workType,
    employmentType: job.employmentType,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements,
    status: job.status,
  }

  return (
    <PageShell>
      <div>
        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-hl-text-secondary transition-colors hover:text-hl-text-primary"
        >
          <ArrowLeft className="size-3.5" />
          Back to Manage Jobs
        </Link>
      </div>

      <PageHeader
        title="Edit job"
        description={`Update the details for “${job.title}”.`}
      />

      <div className="rounded-lg border border-hl-border-subtle bg-hl-surface-2 px-4 py-2.5 text-xs text-hl-text-tertiary">
        Changes are saved to MongoDB and appear on the Manage Jobs page.
      </div>

      <JobForm
        action={updateJob}
        jobId={id}
        initialValues={initialValues}
        submitLabel="Save changes"
        pendingLabel="Saving..."
        successLink={{
          href: "/dashboard/recruiter/jobs",
          label: "Back to Manage Jobs",
        }}
      />
    </PageShell>
  )
}
