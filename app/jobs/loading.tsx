import { Skeleton } from "@/components/ui/skeleton"

export default function BrowseJobsLoading() {
  return (
    <main className="min-h-[calc(100svh-92px)] bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-4 pb-16 sm:px-6 sm:pt-6 lg:px-8 xl:px-20">
        <Skeleton className="h-[68px] w-full rounded-2xl bg-hl-surface-1" />

        <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Skeleton className="hidden h-[360px] rounded-xl bg-hl-surface-1 lg:block" />

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-52 rounded-full bg-hl-surface-2" />
              <Skeleton className="h-8 w-28 rounded-lg bg-hl-surface-2" />
            </div>

            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-hl-border-subtle bg-hl-surface-1 p-4 sm:p-5"
                >
                  <Skeleton className="size-12 shrink-0 rounded-xl bg-hl-surface-3 sm:size-14" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-2/5 rounded-full bg-hl-surface-3" />
                    <Skeleton className="h-3 w-3/5 rounded-full bg-hl-surface-2" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-6 w-28 rounded-md bg-hl-surface-2" />
                      <Skeleton className="h-6 w-20 rounded-md bg-hl-surface-2" />
                      <Skeleton className="h-6 w-24 rounded-md bg-hl-surface-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
