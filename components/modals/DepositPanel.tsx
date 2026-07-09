"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { AmountReadout, formatBalanceLabel } from "@/components/modals/AmountReadout"
import { ProfileCardSelector } from "@/components/vaults/ProfileCardSelector"
import { SettlementPreviewTable } from "@/components/vaults/SettlementPreviewTable"
import { chainLogoSrc } from "@/lib/chain-logos"
import { daysUntil } from "@/lib/vault-filters"
import { formatApy, formatUsd } from "@/lib/format"
import { simulateTx } from "@/lib/mock-tx"
import { effectiveApyForEntry, headlineApyForProfile } from "@/lib/portfolio"
import { useUiStore } from "@/stores/ui-store"
import { usePortfolioStore } from "@/stores/portfolio-store"
import { useWalletStore } from "@/stores/wallet-store"
import type { Vault } from "@/types"

const FALLBACK_ILLUSTRATIVE_DAYS = 30

interface DepositPanelProps {
  vault: Vault
  onDone: () => void
}

/**
 * Deposit tab content of the Stake dialog. See
 * plan/07-deposit-withdraw-modals.md §3, reconciled with the Figma
 * `Vaults_Stake_Poap` frame per the plan-vs-Figma Q&A: big amount readout
 * (no slider), a Network row, key/value projection rows (not prose), and
 * the "Real APY -> You receive" distribution table.
 *
 * The amount lives in `uiStore.depositAmount` rather than local state (same
 * cross-component-sync pattern as `selectedProfile`) so a value typed into
 * the `VaultActionPanel` sidebar carries straight in here when the modal
 * opens. Cleared back to "" on a successful deposit.
 */
export function DepositPanel({ vault, onDone }: DepositPanelProps) {
  const profile = useUiStore((state) => state.selectedProfile)
  const setProfile = useUiStore((state) => state.setProfile)
  const amount = useUiStore((state) => state.depositAmount)
  const setAmount = useUiStore((state) => state.setDepositAmount)
  const balanceUsd = useWalletStore((state) => state.balanceUsd)

  const [pending, setPending] = useState(false)

  const matured = vault.market.matured
  const amountUsd = Number.parseFloat(amount) || 0
  const entryPrice = profile === "standard" ? undefined : vault.market.stablePrice

  const error =
    amount && amountUsd <= 0
      ? "Enter an amount greater than 0"
      : amountUsd > balanceUsd
        ? "Amount exceeds wallet balance"
        : undefined
  const valid = amountUsd > 0 && amountUsd <= balanceUsd && !matured

  const days = Math.max(daysUntil(vault.market.marketEndAt), 0) || FALLBACK_ILLUSTRATIVE_DAYS
  const apyFraction = effectiveApyForEntry(profile, entryPrice, vault)
  const projectedValue = amountUsd > 0 ? amountUsd * (1 + apyFraction * (days / 365)) : 0

  async function handleConfirm() {
    if (!valid || pending) return
    setPending(true)
    const { hash } = await simulateTx()
    usePortfolioStore.getState().deposit({ vaultId: vault.id, profile, amountUsd, entryPrice })
    toast.success(`Deposited ${formatUsd(amountUsd)} into ${vault.name}`, {
      description: `Tx ${hash.slice(0, 10)}\u2026`,
    })
    setPending(false)
    setAmount("")
    onDone()
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <AmountReadout
        label={`Deposit ${vault.asset}`}
        value={amount}
        onChange={setAmount}
        max={balanceUsd}
        balanceLabel={formatBalanceLabel("Balance", balanceUsd)}
        disabled={pending || matured}
        error={error}
      />

      <div className="flex flex-col gap-1.5 border-t pt-4">
        <span className="text-xs text-foreground">Choose option</span>
        <ProfileCardSelector value={profile} onValueChange={setProfile} className="max-w-full" disabled={pending} vault={vault} />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">Network</span>
        <div className="flex items-center gap-1.5">
          <Avatar size="sm" title={vault.chainLabel}>
            {chainLogoSrc(vault.chainLabel) && (
              <AvatarImage src={chainLogoSrc(vault.chainLabel)} alt={vault.chainLabel} />
            )}
            <AvatarFallback className="text-[10px]">
              {vault.chainLabel.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{vault.chainLabel}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Deposit amount</span>
          <span className="font-medium text-foreground tabular-nums">{formatUsd(amountUsd)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground">APY</span>
          <span className="font-medium text-foreground">{formatApy(headlineApyForProfile(vault, profile))}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground">Option</span>
          <span className="font-medium text-foreground">
            {profile.charAt(0).toUpperCase() + profile.slice(1)}
          </span>
        </div>
        {profile !== "standard" && (
          <div className="flex items-center justify-between">
            <span className="text-foreground">Target APY</span>
            <span className="font-medium text-foreground">{formatApy(vault.market.targetApy)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-foreground">Est. value at {days}d</span>
          <span className="font-medium text-foreground tabular-nums">{formatUsd(projectedValue)}</span>
        </div>
      </div>

      <div className="border-t pt-4 pb-2">
        <SettlementPreviewTable vault={vault} profile={profile} />
      </div>

      <DialogFooter>
        <Button variant="outline" className="flex-1" onClick={onDone} disabled={pending}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleConfirm} disabled={!valid || pending} aria-disabled={!valid || pending}>
          {pending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {"Confirming\u2026"}
            </>
          ) : matured ? (
            "Market settled"
          ) : (
            "Confirm Deposit"
          )}
        </Button>
      </DialogFooter>
    </div>
  )
}
