"use client"

import { usePathname } from "next/navigation"

import { SiteHeader } from "@/components/site-header"

/**
 * The public marketing header would sit on top of the dashboard sidebar, so
 * it is only rendered outside `/dashboard`.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/"
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <>
      {!isDashboard && <SiteHeader />}
      {children}
    </>
  )
}
