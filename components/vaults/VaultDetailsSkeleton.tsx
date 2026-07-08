import { Skeleton } from "@/components/ui/skeleton"

/** Suspense fallback for /vaults/[vaultId] while getVaultById() resolves. See plan/06 §1 and its Figma redesign follow-up. */
export function VaultDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-4 w-40" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>

        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      <div className="flex flex-col gap-6 border-t pt-8">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-9 w-56 rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
