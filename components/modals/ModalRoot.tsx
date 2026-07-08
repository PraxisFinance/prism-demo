"use client"

import { StakeModal } from "@/components/modals/StakeModal"
import { usePortfolioStore } from "@/stores/portfolio-store"
import { useUiStore } from "@/stores/ui-store"
import type { Vault } from "@/types"

interface ModalRootProps {
  /**
   * Vaults in scope for the page this is mounted on (the modal never
   * fetches its own vault data — `data/vaults.ts` is server-only). Pass
   * the single vault on Vault Details, or the full list on the vaults
   * page, per plan/07 §3's "vault passed as a prop" rule.
   */
  vaults: readonly Vault[]
}

/**
 * Renders the single Deposit/Withdraw `StakeModal` when `uiStore.modal` is
 * open, resolving `vaultId`/`positionId` against the vaults passed in from
 * whichever page mounted it. Renders nothing (and the trigger silently
 * no-ops) if the vault/position isn't in scope for this page. See
 * plan/07-deposit-withdraw-modals.md §1.
 */
export function ModalRoot({ vaults }: ModalRootProps) {
  const modal = useUiStore((state) => state.modal)
  const positions = usePortfolioStore((state) => state.positions)

  if (modal.type === "deposit") {
    const vault = vaults.find((v) => v.id === modal.vaultId)
    if (!vault) return null
    return <StakeModal vault={vault} initialTab="deposit" />
  }

  if (modal.type === "withdraw") {
    const position = positions.find((p) => p.id === modal.positionId)
    const vault = position && vaults.find((v) => v.id === position.vaultId)
    if (!vault || !position) return null
    return <StakeModal vault={vault} initialTab="withdraw" initialPositionId={position.id} />
  }

  return null
}
