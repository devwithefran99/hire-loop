import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { DEFAULT_ROLE, isSignUpRole, normalizeRole } from "@/lib/auth-roles"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("hireloopdb")

/**
 * Comma separated list of emails that should be created as admins,
 * e.g. `ADMIN_EMAILS=owner@hireloop.com,ops@hireloop.com` in `.env`.
 */
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      /**
       * "seeker" | "recruiter" | "admin".
       * `input: false` means clients can never write this field directly:
       * the sign-up form's choice is read in the create hook below, and
       * `update-user` silently ignores it.
       */
      role: {
        type: "string",
        required: false,
        defaultValue: DEFAULT_ROLE,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const email =
            typeof user.email === "string" ? user.email.toLowerCase() : ""
          const requested = (context?.body as Record<string, unknown> | null)
            ?.role
          const role = adminEmails.includes(email)
            ? "admin"
            : isSignUpRole(requested)
              ? requested
              : DEFAULT_ROLE

          return { data: { ...user, role } }
        },
      },
    },
  },
})

/** Handy for server code that needs a guaranteed role value. */
export function roleOf(user: { role?: unknown } | null | undefined) {
  return normalizeRole(user?.role)
}
