"use client"

import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  Flag,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { normalizeRole, type Role } from "@/lib/auth-roles"
import { useSession } from "@/lib/auth-client"

export type DashboardMenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole: Record<Role, DashboardMenuItem[]> = {
  seeker: [
    {
      id: "overview",
      name: "Overview",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: "browse-jobs",
      name: "Browse Jobs",
      url: "/jobs",
      icon: Search,
    },
    {
      id: "applications",
      name: "My Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "saved-jobs",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      id: "messages",
      name: "Messages",
      url: "/dashboard/seeker/messages",
      icon: MessageSquare,
    },
    {
      id: "profile",
      name: "My Profile",
      url: "/dashboard/seeker/profile",
      icon: User,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],
  recruiter: [
    {
      id: "overview",
      name: "Overview",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "post-job",
      name: "Post a Job",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircle,
    },
    {
      id: "my-jobs",
      name: "My Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "candidates",
      name: "Candidates",
      url: "/dashboard/recruiter/candidates",
      icon: Users,
    },
    {
      id: "applications",
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    {
      id: "messages",
      name: "Messages",
      url: "/dashboard/recruiter/messages",
      icon: MessageSquare,
    },
    {
      id: "company",
      name: "Company Profile",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "overview",
      name: "Overview",
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
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
}

const SKELETON_ITEMS = 6

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const role = normalizeRole(session?.user?.role)
  const menuItems = menuItemsByRole[role]
  const homeUrl = `/dashboard/${role}`

  const isActive = (url: string) =>
    url === homeUrl ? pathname === url : pathname.startsWith(url)

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
          {isPending
            ? Array.from({ length: SKELETON_ITEMS }, (_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))
            : menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    render={<a href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
