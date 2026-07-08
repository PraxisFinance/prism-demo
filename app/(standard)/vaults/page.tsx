import { Suspense } from "react"
import { connection } from "next/server"

import { VaultsExplorer } from "@/components/vaults/VaultsExplorer"
import { VaultsSkeleton } from "@/components/vaults/VaultsSkeleton"
import { getVaults } from "@/data/vaults"

/**
 * The vault catalog — plan/05-vault-list.md. `getVaults()` does real
 * (cached) DeFiLlama I/O, so it's isolated in its own async component behind
 * a `<Suspense>` boundary per the Cache Components streaming rules (see
 * node_modules/next/dist/docs/01-app/02-guides/streaming.md).
 */
export default function VaultsPage() {
  return (
    <Suspense fallback={<VaultsSkeleton />}>
      <VaultsContent />
    </Suspense>
  )
}

async function VaultsContent() {
  // buildVaultMarket() (called inside getVaults()) reads Date.now() to
  // derive market lifecycle/maturity — genuinely per-request data, so this
  // opts the boundary out of static prerendering instead of baking a
  // build-time timestamp into the page. See
  // node_modules/next/dist/docs/01-app/03-api-reference/04-functions/connection.md.
  await connection()
  const vaults = await getVaults()
  return <VaultsExplorer vaults={vaults} />
}
