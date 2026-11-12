import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { createJob } from "@/lib/actions/jobs"

import { PageHeader, PageShell } from "../../../_components/dashboard-ui"
import { JobForm } from "../_components/job-form"

export default function NewRecruiterJobPage() {
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
        title="Post a job"
        description="Tell candidates about the role and what you are looking for."
      />

      <div className="rounded-lg border border-hl-border-subtle bg-hl-surface-2 px-4 py-2.5 text-xs text-hl-text-tertiary">
        New jobs are saved to MongoDB and appear on the Manage Jobs page.
      </div>

      <JobForm
        action={createJob}
        submitLabel="Publish job"
        pendingLabel="Publishing..."
        successLink={{
          href: "/dashboard/recruiter/jobs",
          label: "View job posts",
        }}
      />
    </PageShell>
  )
}
