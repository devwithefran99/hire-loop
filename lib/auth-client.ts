import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

/**
 * One client for the whole app: it exposes the custom `user.role` field in a
 * type-safe way and re-exports the helpers the UI imports.
 *
 * `BETTER_AUTH_URL` is server-only, so in the browser we fall back to the
 * current origin (Better Auth's default).
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient
