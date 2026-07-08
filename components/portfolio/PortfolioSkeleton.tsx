import { Skeleton } from "@/components/ui/skeleton"

/** Suspense fallback for /portfolio while getVaults() resolves. See plan/08 §1. */
export function PortfolioSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-xl border">
          <div className="flex h-10 items-center gap-6 border-b bg-muted/30 px-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="ml-auto h-3 w-20" />
            <Skeleton className="h-3 w-20" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex h-16 items-center gap-4 border-b border-border/50 px-4 last:border-0">
              <Skeleton className="size-6 shrink-0 rounded-full" />
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="ml-auto h-3.5 w-20" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border bg-card p-4">
          <Skeleton className="mx-auto aspect-square w-full max-w-64 rounded-full" />
        </div>
      </div>
    </div>
  )
}
