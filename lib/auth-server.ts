import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { normalizeRole, type Role } from "@/lib/auth-roles"

/** Current Better Auth session (or `null`) inside Server Components / Route Handlers. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

export function hasRole(role: unknown, ...allowed: Role[]) {
  return allowed.length === 0 || allowed.includes(normalizeRole(role))
}

/**
 * Guard for Server Components / layouts that need a signed-in user.
 * Redirects to sign-in when anonymous and to the home page when the role
 * is not allowed.
 *
 * ```tsx
 * // app/admin/page.tsx
 * const user = await requireRole("admin");
 * ```
 */
export async function requireRole(...allowed: Role[]) {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  const role = normalizeRole(session.user.role)
  if (!hasRole(role, ...allowed)) redirect("/")

  return { ...session.user, role }
}
