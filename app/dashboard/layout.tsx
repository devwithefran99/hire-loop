import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { requireRole } from "@/lib/auth-server"
import { ROLE_LABELS } from "@/lib/auth-roles"

import { DashboardSidebar } from "../components/DashboardSidebar"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await requireRole()

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={{ name: user.name, email: user.email, role: user.role }}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-hl-border-subtle bg-background/85 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="text-hl-text-secondary hover:text-hl-text-primary" />
          <span aria-hidden className="h-5 w-px bg-hl-border-default" />
          <p className="text-sm font-medium text-hl-text-secondary">
            {ROLE_LABELS[user.role]} workspace
          </p>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
