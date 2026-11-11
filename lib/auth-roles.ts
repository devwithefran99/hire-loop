/**
 * Single source of truth for HireLoop account roles.
 *
 * These values are stored on the `user.role` field in MongoDB (see `lib/auth.ts`).
 */
export const ROLES = ["seeker", "recruiter", "admin"] as const

export type Role = (typeof ROLES)[number]

/** Every new account starts here until the user picks a role. */
export const DEFAULT_ROLE: Role = "seeker"

/**
 * Roles a visitor is allowed to pick when they create their own account.
 * `admin` is intentionally left out — it can only be granted server-side
 * (see `ADMIN_EMAILS` in `lib/auth.ts`).
 */
export const SIGN_UP_ROLES = ["seeker", "recruiter"] as const

export type SignUpRole = (typeof SIGN_UP_ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  seeker: "Job seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

export const ROLE_DESCRIPTIONS: Record<SignUpRole, string> = {
  seeker: "Find jobs and track your applications",
  recruiter: "Post jobs and hire great talent",
}

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  )
}

export function isSignUpRole(value: unknown): value is SignUpRole {
  return (
    typeof value === "string" &&
    (SIGN_UP_ROLES as readonly string[]).includes(value)
  )
}

/** Never returns `undefined`, so UI/server code always has a usable role. */
export function normalizeRole(value: unknown): Role {
  return isRole(value) ? value : DEFAULT_ROLE
}
