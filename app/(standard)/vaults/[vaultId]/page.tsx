import { Suspense } from "react"
import { notFound } from "next/navigation"
import { connection } from "next/server"

import { VaultDetails } from "@/components/vaults/VaultDetails"
import { VaultDetailsSkeleton } from "@/components/vaults/VaultDetailsSkeleton"
import { getVaultById } from "@/data/vaults"
import { VAULT_SOURCES } from "@/data/vault-sources"

interface VaultDetailsPageProps {
  params: Promise<{ vaultId: string }>
}

// Cache Components requires at least one static param for a dynamic route
// (see migrating-to-cache-components.md, "generateStaticParams must return
// at least one param"). VAULT_SOURCES is a plain in-repo list (no I/O), so
// every known vault gets a real prerendered shell with a concrete pathname —
// this is also what fixes usePathname() in the root Header from erroring
// during prerender for an unresolved fallback shell. Unknown ids still work
// at request time and fall through to notFound() below.
export function generateStaticParams() {
  return VAULT_SOURCES.map((source) => ({ vaultId: source.id }))
}

/**
 * The vault details hero screen — plan/06-vault-details-and-prediction.md.
 * Lives under the `(standard)` route group (like /vaults) for the shared
 * Header/Footer chrome.
 */
export default function VaultDetailsPage({ params }: VaultDetailsPageProps) {
  return (
    <Suspense fallback={<VaultDetailsSkeleton />}>
      <VaultDetailsContent params={params} />
    </Suspense>
  )
}

// `params` is a promise (dynamic/runtime data under Cache Components) — it
// must be awaited inside the <Suspense>-wrapped component, not at the top of
// the page, or the whole route fails to prerender ("blocking-route"). See
// node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md
// ("cookies, headers, and searchParams").
async function VaultDetailsContent({ params }: VaultDetailsPageProps) {
  // buildVaultMarket() (inside getVaultById()) reads Date.now(), which Cache
  // Components treats as per-request data too — see
  // app/(standard)/vaults/page.tsx for the same pattern.
  await connection()
  const { vaultId } = await params
  const vault = await getVaultById(vaultId)
  if (!vault) notFound()

  return <VaultDetails vault={vault} />
}
