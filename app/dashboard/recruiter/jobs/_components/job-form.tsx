"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, PlusCircle, Save } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  EMPTY_JOB_FORM_VALUES,
  JOB_STATUSES,
  JOB_STATUS_LABELS,
  type JobFormState,
  type JobFormValues,
} from "@/lib/jobs"
import { cn } from "@/lib/utils"

import { Panel } from "../../../_components/dashboard-ui"

const fieldClass =
  "h-10 rounded-lg border-hl-border-default bg-hl-surface-input text-sm text-hl-text-primary placeholder:text-hl-text-tertiary"

const selectClass =
  "h-10 w-full rounded-lg border border-hl-border-default bg-hl-surface-input px-2.5 text-sm text-hl-text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const textareaClass =
  "w-full rounded-lg border border-hl-border-default bg-hl-surface-input px-2.5 py-2 text-sm text-hl-text-primary outline-none placeholder:text-hl-text-tertiary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const initialState: JobFormState = { status: "idle", message: "" }

type JobFormProps = {
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>
  initialValues?: JobFormValues
  jobId?: string
  submitLabel?: string
  pendingLabel?: string
  successLink?: { href: string; label: string }
}

export function JobForm({
  action,
  initialValues = EMPTY_JOB_FORM_VALUES,
  jobId,
  submitLabel = "Publish job",
  pendingLabel = "Saving...",
  successLink,
}: JobFormProps) {
  const [state, formAction, isPending] = React.useActionState(
    action,
    initialState
  )

  return (
    <>
      {state.status === "success" && (
        <div className="flex flex-col gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 sm:flex-row sm:items-start sm:justify-between dark:text-emerald-400">
          <span className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>{state.message}</span>
          </span>
          {successLink && (
            <Link
              href={successLink.href}
              className="shrink-0 font-semibold underline underline-offset-4"
            >
              {successLink.label}
            </Link>
          )}
        </div>
      )}

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        {jobId && <input type="hidden" name="jobId" value={jobId} />}

        <Panel
          title="Job details"
          description="The basics candidates see first."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="job-title" className="text-hl-text-secondary">
                Job title
              </Label>
              <Input
                id="job-title"
                name="title"
                required
                defaultValue={initialValues.title}
                placeholder="Senior Frontend Developer"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-hl-text-secondary">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                required
                defaultValue={initialValues.company}
                placeholder="HireLoop"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-hl-text-secondary">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                defaultValue={initialValues.location}
                placeholder="Remote / Dhaka, BD"
                className={fieldClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-type" className="text-hl-text-secondary">
                Work type
              </Label>
              <select
                id="work-type"
                name="workType"
                defaultValue={initialValues.workType}
                className={selectClass}
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment" className="text-hl-text-secondary">
                Employment type
              </Label>
              <select
                id="employment"
                name="employment"
                defaultValue={initialValues.employmentType}
                className={selectClass}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-hl-text-secondary">
                Status
              </Label>
              <select
                id="status"
                name="status"
                defaultValue={initialValues.status}
                className={selectClass}
              >
                {JOB_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {JOB_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-hl-text-secondary">
                Salary range
              </Label>
              <Input
                id="salary"
                name="salary"
                defaultValue={initialValues.salary}
                placeholder="$60,000 – $90,000 per year"
                className={fieldClass}
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="Description"
          description="Help candidates understand the role."
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-hl-text-secondary">
                About the role
              </Label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                defaultValue={initialValues.description}
                placeholder="Describe the role, the team and what success looks like."
                className={textareaClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-hl-text-secondary">
                Requirements
              </Label>
              <textarea
                id="requirements"
                name="requirements"
                rows={5}
                defaultValue={initialValues.requirements}
                placeholder="List the skills and experience you need."
                className={textareaClass}
              />
            </div>
          </div>
        </Panel>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/recruiter/jobs"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 rounded-lg border-hl-border-default bg-hl-surface-1 px-3.5 text-hl-text-primary hover:bg-hl-surface-2"
            )}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-lg bg-hl-brand px-3.5 font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
          >
            {jobId ? (
              <Save className="size-4" />
            ) : (
              <PlusCircle className="size-4" />
            )}
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </>
  )
}
