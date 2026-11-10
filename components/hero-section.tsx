"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  BriefcaseIcon,
  Building2Icon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const trendingRoles = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
] as const

const stats = [
  { icon: BriefcaseIcon, value: "50K", label: "Active Jobs" },
  { icon: Building2Icon, value: "12K", label: "Companies" },
  { icon: UsersIcon, value: "2M", label: "Job Seekers" },
  { icon: StarIcon, value: "97%", label: "Satisfaction Rate" },
] as const

const fieldClassName =
  "h-auto w-full min-w-0 rounded-none border-0 bg-transparent p-0 text-[15px] leading-none text-white shadow-none outline-none placeholder:text-white/45 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"

/**
 * Hero artwork: the planet / glow export from hireloop.fig, plus a soft brand
 * bloom that keeps the top of the section from ever looking flat.
 */
function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 mx-auto flex w-full justify-center">
        <div className="w-[820px] max-w-none shrink-0 translate-y-[170px] sm:w-[1100px] sm:translate-y-[-75px] lg:w-[1320px] lg:translate-y-[-180px]">
          <Image
            src="/Image/globe-hero.webp"
            alt=""
            width={1440}
            height={1882}
            priority
            unoptimized
            sizes="(min-width: 1024px) 1320px, (min-width: 640px) 1100px, 820px"
            className="h-auto w-full select-none"
          />
        </div>
      </div>

      {/* Brand bloom behind the headline */}
      <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(58%_100%_at_50%_0%,rgba(92,83,254,0.18),transparent_72%)]" />

      {/* Vignette: dissolves the artwork into the hero surface on every edge */}
      <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(to_bottom,#08080a_0%,rgba(8,8,10,0.55)_45%,rgba(8,8,10,0)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-24 bg-[linear-gradient(to_right,#08080a_0%,rgba(8,8,10,0.96)_28%,rgba(8,8,10,0.55)_68%,rgba(8,8,10,0)_100%)] sm:w-48 lg:w-64" />
      <div className="absolute inset-y-0 right-0 w-24 bg-[linear-gradient(to_left,#08080a_0%,rgba(8,8,10,0.96)_28%,rgba(8,8,10,0.55)_68%,rgba(8,8,10,0)_100%)] sm:w-48 lg:w-64" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(to_top,#08080a_0%,rgba(8,8,10,0.8)_55%,rgba(8,8,10,0)_100%)]" />
    </div>
  )
}

function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [location, setLocation] = React.useState("")
  const titleRef = React.useRef<HTMLInputElement>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (location.trim()) params.set("location", location.trim())

    router.push(params.size > 0 ? `/jobs?${params.toString()}` : "/jobs")
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-[784px] sm:mt-10"
    >
      <div
        className={cn(
          "flex flex-col gap-2 rounded-[18px] border border-white/20 bg-[#101010]/90 p-2 backdrop-blur-xl transition-colors",
          "shadow-[0_24px_70px_-24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]",
          "focus-within:border-hl-brand/60 sm:h-16 sm:flex-row sm:items-center sm:gap-0 sm:rounded-2xl sm:p-0 sm:pl-5"
        )}
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 sm:px-0 sm:py-0">
          <span className="sr-only">Job title, skill or company</span>
          <SearchIcon className="size-[18px] shrink-0 text-white/40" />
          <Input
            ref={titleRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Job title, skill or company"
            autoComplete="off"
            className={fieldClassName}
          />
        </label>

        <span
          aria-hidden
          className="hidden h-6 w-px shrink-0 bg-white/20 sm:block"
        />

        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 sm:px-4 sm:py-0">
          <span className="sr-only">Location or remote</span>
          <MapPinIcon className="size-[18px] shrink-0 text-white/40" />
          <Input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location or Remote"
            autoComplete="off"
            className={fieldClassName}
          />
        </label>

        <Button
          type="submit"
          aria-label="Search jobs"
          className={cn(
            "h-12 w-full shrink-0 gap-2 rounded-xl bg-hl-brand text-[15px] font-medium text-white",
            "shadow-[0_12px_34px_-12px_rgba(92,83,254,0.9),inset_0_2px_10px_rgba(255,255,255,0.22)]",
            "hover:bg-hl-brand/90 sm:size-12 sm:w-12 sm:rounded-xl"
          )}
        >
          <SearchIcon className="size-5" />
          <span className="sm:hidden">Search</span>
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="text-[13px] text-white/50 sm:text-sm">
          Trending position
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {trendingRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setQuery(role)
                titleRef.current?.focus()
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-white/80 transition-colors outline-none hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:border-hl-brand/70"
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}

function HeroStats() {
  return (
    <div className="mt-[260px] sm:mt-[300px] lg:mt-[320px]">
      <div className="relative mx-auto max-w-[760px]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[240%] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(8,8,10,0.85)_0%,rgba(8,8,10,0.5)_45%,rgba(8,8,10,0)_75%)]"
        />
        <h2 className="relative text-balance text-center font-display text-[26px] leading-[1.25] font-semibold tracking-[-0.02em] text-white/80 sm:text-[32px] lg:text-[38px]">
          Assisting over 15,000 job seekers find their dream positions.
        </h2>
      </div>

      <dl className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className={cn(
              "group relative flex min-h-[196px] flex-col justify-between overflow-hidden rounded-2xl p-5 sm:min-h-[210px] sm:p-6 lg:min-h-[236px]",
              "border border-white/10 bg-[linear-gradient(160deg,rgba(30,30,40,0.92),rgba(10,10,14,0.94))]",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_-40px_rgba(0,0,0,1)] backdrop-blur-xl",
              "transition-colors hover:border-white/20"
            )}
          >
            <span className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <Icon className="size-6 text-white/70 transition-colors group-hover:text-white" />
            <div className="mt-10 flex flex-col-reverse gap-3">
              <dt className="text-[15px] text-white/55 sm:text-base">{label}</dt>
              <dd className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em] text-white lg:text-[52px] xl:text-[56px]">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="dark relative isolate overflow-hidden bg-[#08080a] pb-16 sm:pb-20 lg:pb-24">
      <HeroBackdrop />

      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center pt-12 text-center sm:pt-16 lg:pt-[88px]">
          <p className="inline-flex items-center rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.14),rgba(92,83,254,0.75),rgba(255,255,255,0.14))] p-px shadow-[0_0_36px_-10px_rgba(92,83,254,0.75)]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#141418] px-4 py-2 sm:px-5 sm:py-2.5">
              <SparklesIcon className="size-4 text-hl-brand" />
              <span className="font-echo text-[12px] text-white/85 sm:text-[13px] lg:text-[15px]">
                50,000+ new jobs this month
              </span>
            </span>
          </p>

          <h1 className="mt-7 max-w-[900px] text-balance font-display text-[36px] leading-[1.06] font-bold tracking-[-0.035em] text-white sm:mt-8 sm:text-[48px] lg:text-[56px]">
            Find Your Dream Job Today
          </h1>

          <p className="mt-5 max-w-[640px] text-balance text-[15px] leading-[1.7] text-white/65 sm:mt-6 sm:text-[17px] lg:text-[19px]">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>

          <HeroSearch />
        </div>

        <HeroStats />
      </div>
    </section>
  )
}

export { HeroSection }
