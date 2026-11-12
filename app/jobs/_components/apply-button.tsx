"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Send } from "lucide-react"

import { applyToJob } from "@/lib/actions/applications"
import { cn } from "@/lib/utils"

export function ApplyButton({
  jobId,
  jobTitle,
  initialApplied,
  isAuthenticated,
}: {
  jobId: string
  jobTitle: string
  initialApplied: boolean
  isAuthenticated: boolean
}) {
  const router = useRouter()
  const [applied, setApplied] = React.useState(initialApplied)
  const [message, setMessage] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  function handleClick() {
    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }

    if (applied) return

    startTransition(async () => {
      const result = await applyToJob(jobId)

      if (result.requiresAuth) {
        router.push("/sign-in")
        return
      }

      setMessage(result.message)

      if (result.success) {
        setApplied(true)
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={applied || isPending}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors",
          "focus-visible:ring-2 focus-visible:ring-hl-brand/40 focus-visible:outline-none",
          applied
            ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "bg-hl-brand text-hl-brand-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-hl-brand/90 disabled:opacity-70"
        )}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : applied ? (
          <Check className="size-4" />
        ) : (
          <Send className="size-4" />
        )}
        {isPending
          ? "Submitting..."
          : applied
            ? "Applied"
            : isAuthenticated
              ? "Apply now"
              : "Sign in to apply"}
      </button>

      <p
        role="status"
        className={cn(
          "max-w-[260px] text-center text-[11px]",
          message.includes("already") || applied
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-destructive"
        )}
      >
        {message || `Apply for ${jobTitle} in a few clicks.`}
      </p>
    </div>
  )
}
