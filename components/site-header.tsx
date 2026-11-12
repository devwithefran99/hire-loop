"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MenuIcon, LayoutDashboard } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MobileUserMenu, UserMenu } from "@/components/user-menu"
import { authClient, useSession } from "@/lib/auth-client"
import { dashboardPathForRole } from "@/lib/auth-roles"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
] as const

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="HireLoop"
      width={154}
      height={44}
      priority
      className={cn("h-9 w-auto shrink-0 sm:h-11", className)}
    />
  )
}

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HireLoop — home"
      className={cn(
        "inline-flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-hl-brand/50",
        className
      )}
    >
      <LogoMark />
    </Link>
  )
}

function NavLinks({
  pathname,
  className,
}: {
  pathname: string
  className?: string
}) {
  return (
    <ul className={cn("flex items-center", className)}>
      {navLinks.map((link) => {
        const active = isActive(pathname, link.href)
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex text-base leading-none tracking-[-0.01em] text-hl-text-primary transition-colors outline-none hover:text-hl-brand focus-visible:text-hl-brand",
                active ? "font-semibold" : "font-normal"
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function SiteHeader() {
  const pathname = usePathname() ?? "/"
  const router = useRouter()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [signingOut, setSigningOut] = React.useState(false)
  const { data: session, isPending } = useSession()
  const user = session?.user ?? null

  async function handleSignOut() {
    setSigningOut(true)

    try {
      await authClient.signOut()
      setMenuOpen(false)
      router.push("/")
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-background from-55% to-transparent px-4 pt-3 pb-3 sm:px-6 lg:px-8 xl:px-20">
      <div
        className={cn(
          "mx-auto flex h-[68px] w-full max-w-[1280px] items-center justify-between gap-4",
          "rounded-[14px] border border-hl-border-subtle bg-hl-nav-surface pr-2 pl-4 sm:pl-5",
          "shadow-[0_1px_2px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)]"
        )}
      >
        <Logo />

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <div className="flex h-[52px] items-center gap-6 rounded-lg border border-hl-border-subtle bg-hl-nav-pill pr-2 pl-6">
            <NavLinks pathname={pathname} className="gap-5" />

            <Separator
              orientation="vertical"
              className="mt-3 h-6 bg-hl-text-secondary/40"
            />

            <div className="flex items-center gap-2">
              {isPending ? (
                <div aria-hidden className="flex items-center gap-2.5 pr-2">
                  <span className="size-9 animate-pulse rounded-full bg-hl-surface-3" />
                  <span className="h-3 w-20 animate-pulse rounded-full bg-hl-surface-3" />
                </div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={dashboardPathForRole(user.role)}
                    className={cn(
                      buttonVariants(),
                      "h-10 gap-1.5 rounded-lg border border-hl-border-default bg-hl-surface-2 px-3 text-[13px] font-semibold text-hl-text-primary shadow-none hover:bg-hl-surface-3 hover:text-hl-text-primary"
                    )}
                  >
                    <LayoutDashboard className="size-4 text-hl-text-tertiary" />
                    Dashboard
                  </Link>
                  <UserMenu
                    user={user}
                    signingOut={signingOut}
                    onSignOut={handleSignOut}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/sign-in"
                    className={cn(
                      buttonVariants(),
                      "h-10 rounded-lg border border-black/10 bg-white px-4 text-[15px] font-semibold text-hl-brand shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] hover:bg-white/90 hover:text-hl-brand"
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants(),
                      "h-10 rounded-lg bg-hl-brand px-5 text-[15px] font-semibold text-hl-brand-foreground shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] hover:bg-hl-brand/90"
                    )}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile / tablet navigation */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="size-10 rounded-lg text-hl-text-primary hover:bg-hl-surface-2 lg:hidden"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="gap-0 border-l border-hl-border-subtle bg-hl-nav-surface p-0 data-[side=right]:w-[min(340px,100vw)]"
          >
            <SheetHeader className="flex h-[68px] flex-row items-center border-b border-hl-border-subtle p-0 px-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <LogoMark className="h-9" />
            </SheetHeader>

            <nav aria-label="Primary" className="px-3 py-4">
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href)
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex h-11 items-center rounded-lg px-3 text-base tracking-[-0.01em] text-hl-text-primary transition-colors outline-none hover:bg-hl-surface-2 focus-visible:bg-hl-surface-2",
                          active && "bg-hl-surface-2 font-semibold"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}

                {user && (
                  <li className="mt-2 border-t border-hl-border-subtle pt-2">
                    <Link
                      href={dashboardPathForRole(user.role)}
                      onClick={() => setMenuOpen(false)}
                      className="flex h-11 items-center gap-2.5 rounded-lg px-3 text-base font-semibold tracking-[-0.01em] text-hl-text-primary transition-colors outline-none hover:bg-hl-surface-2 focus-visible:bg-hl-surface-2"
                    >
                      <LayoutDashboard className="size-4 text-hl-text-tertiary" />
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            <SheetFooter className="gap-2 border-t border-hl-border-subtle p-4">
              {isPending ? (
                <div aria-hidden className="flex items-center gap-3">
                  <span className="size-10 animate-pulse rounded-full bg-hl-surface-3" />
                  <div className="flex flex-col gap-1.5">
                    <span className="h-3 w-28 animate-pulse rounded-full bg-hl-surface-3" />
                    <span className="h-2.5 w-20 animate-pulse rounded-full bg-hl-surface-3" />
                  </div>
                </div>
              ) : user ? (
                <MobileUserMenu
                  user={user}
                  signingOut={signingOut}
                  onSignOut={handleSignOut}
                />
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      buttonVariants(),
                      "h-11 rounded-lg border border-black/10 bg-white text-[15px] font-semibold text-hl-brand hover:bg-white/90 hover:text-hl-brand"
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      buttonVariants(),
                      "h-11 rounded-lg bg-hl-brand text-[15px] font-semibold text-hl-brand-foreground hover:bg-hl-brand/90"
                    )}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export { SiteHeader }
