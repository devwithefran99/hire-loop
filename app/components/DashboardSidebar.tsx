"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bookmark,
  Briefcase,
  CreditCard,
  FileText,
  Flag,
  LayoutDashboard,
  Loader2,
  LogOut,
  Search,
  Settings,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { initials } from "@/components/user-menu"
import { authClient } from "@/lib/auth-client"
import { ROLE_LABELS, type Role } from "@/lib/auth-roles"
import { cn } from "@/lib/utils"

export type DashboardMenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

type DashboardMenuGroup = {
  label: string
  items: DashboardMenuItem[]
}

/**
 * Sidebar navigation per role. Add a group to give a role a new section.
 * `url` values must match real routes under `app/dashboard/<role>`.
 */
const menuGroupsByRole: Record<Role, DashboardMenuGroup[]> = {
  seeker: [
    {
      label: "Job search",
      items: [
        {
          id: "dashboard",
          name: "Dashboard",
          url: "/dashboard/seeker",
          icon: LayoutDashboard,
        },
        {
          id: "jobs",
          name: "Jobs",
          url: "/dashboard/seeker/jobs",
          icon: Search,
        },
        {
          id: "saved-jobs",
          name: "Saved Jobs",
          url: "/dashboard/seeker/saved-jobs",
          icon: Bookmark,
        },
        {
          id: "applications",
          name: "Applications",
          url: "/dashboard/seeker/applications",
          icon: FileText,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          id: "billing",
          name: "Billing",
          url: "/dashboard/seeker/billing",
          icon: CreditCard,
        },
        {
          id: "settings",
          name: "Settings",
          url: "/dashboard/seeker/settings",
          icon: Settings,
        },
      ],
    },
  ],
  recruiter: [
    {
      label: "Hiring",
      items: [
        {
          id: "dashboard",
          name: "Dashboard",
          url: "/dashboard/recruiter",
          icon: LayoutDashboard,
        },
        {
          id: "manage-jobs",
          name: "Manage Jobs",
          url: "/dashboard/recruiter/jobs",
          icon: Briefcase,
        },
        {
          id: "applications",
          name: "Applications",
          url: "/dashboard/recruiter/applications",
          icon: FileText,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          id: "settings",
          name: "Settings",
          url: "/dashboard/recruiter/settings",
          icon: Settings,
        },
      ],
    },
  ],
  admin: [
    {
      label: "Admin",
      items: [
        {
          id: "dashboard",
          name: "Dashboard",
          url: "/dashboard/admin",
          icon: LayoutDashboard,
        },
        {
          id: "users",
          name: "Users",
          url: "/dashboard/admin/users",
          icon: Users,
        },
        {
          id: "recruiters",
          name: "Recruiters",
          url: "/dashboard/admin/recruiters",
          icon: UserCheck,
        },
        {
          id: "jobs",
          name: "Job Posts",
          url: "/dashboard/admin/jobs",
          icon: Briefcase,
        },
        {
          id: "reports",
          name: "Reports",
          url: "/dashboard/admin/reports",
          icon: Flag,
        },
        {
          id: "analytics",
          name: "Analytics",
          url: "/dashboard/admin/analytics",
          icon: BarChart3,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          id: "settings",
          name: "Settings",
          url: "/dashboard/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

export type DashboardSidebarUser = {
  name?: string | null
  email?: string | null
  role: Role
}

export function DashboardSidebar({ user }: { user: DashboardSidebarUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = React.useState(false)

  const { role } = user
  const groups = menuGroupsByRole[role]
  const homeUrl = `/dashboard/${role}`

  const isActive = (url: string) =>
    url === homeUrl ? pathname === url : pathname.startsWith(url)

  async function handleSignOut() {
    setSigningOut(true)

    try {
      await authClient.signOut()
      router.push("/")
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-hl-border-subtle p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-hl-brand/40"
        >
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-hl-brand text-sm font-bold text-hl-brand-foreground"
          >
            H
          </span>
          <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm leading-tight font-semibold text-hl-text-primary">
              HireLoop
            </span>
            <span className="text-[10px] font-medium tracking-[0.14em] text-hl-text-tertiary uppercase">
              {ROLE_LABELS[role]}
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-1 py-2">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-[0.14em] text-hl-text-tertiary uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = isActive(item.url)

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.name}
                      render={<Link href={item.url} />}
                      className={cn(
                        "h-9 gap-2.5 rounded-lg px-2.5 text-[13.5px] text-hl-text-secondary",
                        "hover:bg-hl-surface-2 hover:text-hl-text-primary",
                        active &&
                          "bg-hl-brand/10 font-semibold text-hl-brand hover:bg-hl-brand/15 hover:text-hl-brand"
                      )}
                    >
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-1 border-t border-hl-border-subtle p-3">
        <div className="flex items-center gap-2.5 rounded-lg p-1">
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-full bg-hl-brand text-[11px] font-bold text-hl-brand-foreground"
          >
            {initials(user.name)}
          </span>
          <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[13px] font-semibold text-hl-text-primary">
              {user.name?.trim() || "Your account"}
            </span>
            {user.email && (
              <span className="truncate text-[11px] text-hl-text-tertiary">
                {user.email}
              </span>
            )}
          </span>
        </div>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          disabled={signingOut}
          className="h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 text-[13px] font-medium text-hl-text-secondary group-data-[collapsible=icon]:justify-center hover:bg-hl-surface-2 hover:text-hl-text-primary"
        >
          {signingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          <span className="group-data-[collapsible=icon]:hidden">
            {signingOut ? "Logging out..." : "Log out"}
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
