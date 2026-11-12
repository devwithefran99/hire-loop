import { requireRole } from "@/lib/auth-server"

export default async function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("recruiter")

  return children
}
