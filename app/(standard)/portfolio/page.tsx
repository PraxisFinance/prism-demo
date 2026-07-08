import { Suspense } from "react"
import { connection } from "next/server"

import { PortfolioSkeleton } from "@/components/portfolio/PortfolioSkeleton"
import { PortfolioView } from "@/components/portfolio/PortfolioView"
import { getVaults } from "@/data/vaults"

/**
 * The portfolio dashboard — plan/08-portfolio-and-deployment.md. Positions
 * are session-only client state (Zustand), but every position needs its
 * Vault (for currentValue/effectiveApy math) plus the full vault list is
 * needed anyway for ModalRoot's "Deposit more" action — so this fetches the
 * whole catalog server-side, same pattern as /vaults.
 */
export default function PortfolioPage() {
  return (
    <Suspense fallback={<PortfolioSkeleton />}>
      <PortfolioContent />
    </Suspense>
  )
}

async function PortfolioContent() {
  // buildVaultMarket() (inside getVaults()) reads Date.now() — per-request
  // data under Cache Components, same reasoning as app/(standard)/vaults/page.tsx.
  await connection()
  const vaults = await getVaults()
  return <PortfolioView vaults={vaults} />
}
