import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Shared styling for every text field on the auth screens.
 * Keeping it in one place means the sign-in and sign-up inputs can never
 * drift apart — and the pages stay easy to read.
 */
const authInputClassName =
  "h-11 w-full rounded-xl border border-hl-border-default bg-hl-surface-input px-3.5 text-[15px] text-hl-text-primary shadow-none outline-none placeholder:text-hl-text-tertiary focus-visible:border-hl-brand/60 focus-visible:ring-4 focus-visible:ring-hl-brand/15 md:text-[15px] dark:bg-hl-surface-input"

/** The multi-colour Google "G" used by the social sign-in button. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] shrink-0">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.86Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3a7.2 7.2 0 0 1-10.73-3.78H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.34 14.32a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4.04-3.08Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.3 6.6l4.04 3.1A7.2 7.2 0 0 1 12 4.75Z"
      />
    </svg>
  )
}

function GoogleButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full gap-3 rounded-xl border-hl-border-default bg-hl-surface-2/50 text-[15px] font-medium text-hl-text-primary hover:bg-hl-surface-2"
    >
      <GoogleIcon />
      {label}
    </Button>
  )
}

/** The "or with email" rule that separates social sign-in from the form. */
function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-hl-border-subtle" />
      <span className="text-[11px] font-medium tracking-[0.16em] text-hl-text-tertiary uppercase">
        or with email
      </span>
      <span className="h-px flex-1 bg-hl-border-subtle" />
    </div>
  )
}

type AuthShellProps = {
  /** Small label above the marketing headline. */
  eyebrow: string
  /** Marketing headline shown next to the form on large screens. */
  title: string
  description: string
  /** Three short benefits, one per line. */
  points: readonly string[]
  /** The sign-in / sign-up form card. */
  children: React.ReactNode
}

/**
 * Two-column auth layout: brand story on the left, form card on the right.
 * The brand column is hidden on phones and tablets so the form stays the
 * only thing competing for attention.
 */
function AuthShell({
  eyebrow,
  title,
  description,
  points,
  children,
}: AuthShellProps) {
  return (
    <main className="relative isolate overflow-hidden">
      {/* Decorative brand glow + faint grid, behind everything else */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-48 left-1/2 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-hl-brand/20 blur-[150px]" />
        <div className="absolute right-[-140px] bottom-[-180px] size-[420px] rounded-full bg-hl-brand/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--hl-border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--hl-border-subtle)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-5 py-10 sm:px-6 lg:min-h-[calc(100svh-92px)] lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16 lg:px-8 lg:py-14">
        <section className="hidden flex-col lg:flex">
          <p className="inline-flex items-center gap-2 font-echo text-[12px] tracking-[0.22em] text-hl-brand uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-hl-brand" />
            {eyebrow}
          </p>

          <h2 className="mt-6 max-w-[520px] text-balance font-display text-[46px] leading-[1.05] font-bold tracking-[-0.04em] text-hl-text-primary">
            {title}
          </h2>

          <p className="mt-5 max-w-[430px] text-[16px] leading-[1.7] text-hl-text-secondary">
            {description}
          </p>

          <ul className="mt-9 space-y-3.5">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[15px] text-hl-text-secondary"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-hl-brand/15 text-hl-brand">
                  <CheckIcon className="size-3.5" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <div
          className={cn(
            "w-full justify-self-center rounded-[26px] border border-hl-border-subtle bg-hl-surface-1/85 p-6 backdrop-blur-xl sm:p-8",
            "shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)]"
          )}
        >
          {children}
        </div>
      </div>
    </main>
  )
}

export { AuthShell, AuthDivider, GoogleButton, authInputClassName }
