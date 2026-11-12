"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bookmark, Loader2 } from "lucide-react"

import { toggleSavedJob } from "@/lib/actions/saved-jobs"
import { cn } from "@/lib/utils"

type BookmarkButtonProps = {
  jobId: string
  jobTitle: string
  initialSaved: boolean
  isAuthenticated: boolean
  /** Refresh the current route after a successful toggle (dashboard lists). */
  refreshOnChange?: boolean
  className?: string
}

export function BookmarkButton({
  jobId,
  jobTitle,
  initialSaved,
  isAuthenticated,
  refreshOnChange = false,
  className,
}: BookmarkButtonProps) {
  const router = useRouter()
  const [saved, setSaved] = React.useState(initialSaved)
  const [message, setMessage] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }

    startTransition(async () => {
      const result = await toggleSavedJob(jobId)

      if (result.requiresAuth) {
        router.push("/sign-in")
        return
      }

      if (result.success) {
        setSaved(Boolean(result.saved))
        setMessage(result.message)
        if (refreshOnChange) router.refresh()
      } else {
        setMessage(result.message)
      }
    })
  }

  const label = saved
    ? `Remove ${jobTitle} from saved jobs`
    : `Save ${jobTitle}`

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={label}
        aria-pressed={saved}
        title={label}
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-hl-border-subtle",
          "bg-hl-surface-1 text-hl-text-tertiary transition-colors",
          "hover:border-hl-border-default hover:bg-hl-surface-2 hover:text-hl-brand",
          "focus-visible:ring-2 focus-visible:ring-hl-brand/40 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-60",
          saved && "border-hl-brand/40 bg-hl-brand/10 text-hl-brand",
          className
        )}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Bookmark
            className={cn("size-4", saved && "fill-current")}
            aria-hidden
          />
        )}
      </button>
      <span role="status" className="sr-only">
        {message}
      </span>
    </>
  )
}
