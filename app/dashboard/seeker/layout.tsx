import { requireRole } from "@/lib/auth-server"

export default async function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("seeker")

  return children
}
