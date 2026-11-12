"use client"

import * as React from "react"
import { Loader2, Trash2 } from "lucide-react"

import { deleteJob } from "@/lib/actions/jobs"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify/unstyled"

export function DeleteJobButton({
  jobId,
  jobTitle,
}: {
  jobId: string
  jobTitle: string
}) {
  const [isPending, startTransition] = React.useTransition()

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete “${jobTitle}”? This cannot be undone.`
    )

    if (!confirmed) return

    startTransition(async () => {
      const result = await deleteJob(jobId)

      if (!result.success) {
        toast.error(result.message)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Delete ${jobTitle}`}
      title={`Delete ${jobTitle}`}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-hl-text-tertiary transition-colors",
        "hover:bg-destructive/10 hover:text-destructive",
        "focus-visible:ring-2 focus-visible:ring-hl-brand/40 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
    </button>
  )
}
