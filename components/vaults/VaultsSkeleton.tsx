import { Skeleton } from "@/components/ui/skeleton"

/** Suspense fallback for the /vaults table while getVaults() resolves. See plan/05 §1, §5. */
export function VaultsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-36" />
        </div>
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="overflow-hidden rounded-xl border">
        <div className="flex h-10 items-center gap-6 border-b bg-muted/30 px-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="ml-auto h-3 w-32" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex h-16 items-center gap-4 border-b border-border/50 px-4 last:border-0"
          >
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="ml-auto h-3.5 w-20" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
