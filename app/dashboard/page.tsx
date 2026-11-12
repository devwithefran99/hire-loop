import { redirect } from "next/navigation"

import { requireRole } from "@/lib/auth-server"

/** `/dashboard` has no UI of its own — send each role to its own workspace. */
export default async function DashboardPage() {
  const user = await requireRole()
  redirect(`/dashboard/${user.role}`)
}
