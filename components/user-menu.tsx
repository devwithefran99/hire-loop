"use client"

import { Loader2, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ROLE_LABELS, normalizeRole, type Role } from "@/lib/auth-roles"
import { cn } from "@/lib/utils"

export type HeaderUser = {
  name?: string | null
  email?: string | null
  role?: unknown
}

/** "Jane Doe" -> "JD", "hireloop" -> "H". */
export function initials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "U"

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

const roleBadgeClassName: Record<Role, string> = {
  seeker: "bg-hl-brand/10 text-hl-brand",
  recruiter: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  admin: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

type UserMenuProps = {
  user: HeaderUser
  signingOut: boolean
  onSignOut: () => void
}

/** Signed-in state for the desktop navigation pill: name, role and log out. */
function UserMenu({ user, signingOut, onSignOut }: UserMenuProps) {
  const role = normalizeRole(user.role)
  const name = user.name?.trim() || "Your account"

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex min-w-0 items-center gap-2.5 py-1 pr-1 pl-1">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full bg-hl-brand text-[13px] font-bold text-hl-brand-foreground"
        >
          {initials(user.name)}
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="max-w-[150px] truncate text-[14px] font-semibold text-hl-text-primary">
            {name}
          </span>
          <span className="text-[11px] font-medium text-hl-text-tertiary">
            {ROLE_LABELS[role]}
          </span>
        </span>
      </div>

      <Button
        variant="ghost"
        onClick={onSignOut}
        disabled={signingOut}
        className="h-10 gap-2 rounded-lg border border-transparent px-3 text-[14px] font-medium text-hl-text-secondary hover:bg-hl-surface-2 hover:text-hl-text-primary"
      >
        {signingOut ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        <span className="hidden xl:inline">Log out</span>
      </Button>
    </div>
  )
}

/** Signed-in state for the mobile sheet: account card + full-width log out. */
function MobileUserMenu({ user, signingOut, onSignOut }: UserMenuProps) {
  const role = normalizeRole(user.role)
  const name = user.name?.trim() || "Your account"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-xl border border-hl-border-subtle bg-hl-surface-2 p-3">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full bg-hl-brand text-sm font-bold text-hl-brand-foreground"
        >
          {initials(user.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-hl-text-primary">
            {name}
          </p>
          {user.email && (
            <p className="truncate text-xs text-hl-text-tertiary">
              {user.email}
            </p>
          )}
        </div>
        <span
          className={cn(
            "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase",
            roleBadgeClassName[role]
          )}
        >
          {ROLE_LABELS[role]}
        </span>
      </div>

      <Button
        onClick={onSignOut}
        disabled={signingOut}
        className="h-11 w-full gap-2 rounded-lg bg-hl-brand text-[15px] font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
      >
        {signingOut ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        {signingOut ? "Logging out..." : "Log out"}
      </Button>
    </div>
  )
}

export { UserMenu, MobileUserMenu }
