"use client"

import { useMemo, useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { AmountReadout, formatBalanceLabel } from "@/components/modals/AmountReadout"
import { PercentDelta } from "@/components/common/PercentDelta"
import { ProfileBadge } from "@/components/vaults/ProfileBadge"
import { formatUsd } from "@/lib/format"
import { simulateTx } from "@/lib/mock-tx"
import { currentValue, earnings, effectiveApyForPosition } from "@/lib/portfolio"
import { usePortfolioStore } from "@/stores/portfolio-store"
import type { Position, Vault } from "@/types"

interface WithdrawPanelProps {
  vault: Vault
  /** Pre-selected position (e.g. opened from a specific PositionCard's Withdraw button). If unset and the vault has >1 position, the user picks one first. */
  initialPositionId?: string
  onDone: () => void
}

/**
 * Withdraw tab content of the Stake dialog — plan/07 §4. Figma's
 * `Vaults_Stake_Poap` frame only shows the Deposit tab's content, so this
 * mirrors the Deposit panel's structure/style (per the plan-vs-Figma Q&A).
 */
export function WithdrawPanel({ vault, initialPositionId, onDone }: WithdrawPanelProps) {
  const allPositions = usePortfolioStore((state) => state.positions)
  const vaultPositions = useMemo(
    () => allPositions.filter((p) => p.vaultId === vault.id),
    [allPositions, vault.id]
  )

  const [selectedId, setSelectedId] = useState(
    initialPositionId ?? (vaultPositions.length === 1 ? vaultPositions[0].id : undefined)
  )
  const [amount, setAmount] = useState("")
  const [pending, setPending] = useState(false)
  const [now] = useState(() => Date.now())

  const position = vaultPositions.find((p) => p.id === selectedId)

  if (vaultPositions.length === 0) {
    return (
      <div className="flex flex-col gap-4 pt-4">
        <p className="text-sm text-muted-foreground">
          You don{"\u2019"}t have a position in {vault.name} yet.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onDone}>
            Close
          </Button>
        </DialogFooter>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="flex flex-col gap-3 pt-4">
        <span className="text-xs text-muted-foreground">Choose a position to withdraw from</span>
        {vaultPositions.map((p) => (
          <PositionPickerRow key={p.id} position={p} vault={vault} now={now} onSelect={() => setSelectedId(p.id)} />
        ))}
      </div>
    )
  }

  const positionId = position.id
  const value = currentValue(position, vault, now)
  const gain = earnings(position, vault, now)
  const apy = effectiveApyForPosition(position, vault) * 100

  const amountUsd = Number.parseFloat(amount) || 0
  const error =
    amount && amountUsd <= 0
      ? "Enter an amount greater than 0"
      : amountUsd > value
        ? "Amount exceeds your position value"
        : undefined
  const valid = amountUsd > 0 && amountUsd <= value

  const remaining = Math.max(value - amountUsd, 0)

  async function handleConfirm() {
    if (!valid || pending) return
    setPending(true)
    const { hash } = await simulateTx()
    usePortfolioStore.getState().withdraw({ positionId, amountUsd })
    toast.success(`Withdrew ${formatUsd(amountUsd)} from ${vault.name}`, {
      description: `Tx ${hash.slice(0, 10)}\u2026`,
    })
    setPending(false)
    onDone()
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <AmountReadout
        label="Withdraw amount"
        value={amount}
        onChange={setAmount}
        max={value}
        balanceLabel={formatBalanceLabel("Available", value)}
        disabled={pending}
        error={error}
      />

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <ProfileBadge profile={position.profile} />
          <PercentDelta value={apy} />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-foreground">Current value</span>
          <span className="font-heading text-lg font-medium tabular-nums text-foreground">
            {formatUsd(value)}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-foreground">Principal</span>
          <span className="tabular-nums text-foreground">{formatUsd(position.principalUsd)}</span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-foreground">Earnings</span>
          <span className={gain >= 0 ? "tabular-nums text-positive" : "tabular-nums text-destructive"}>
            {gain >= 0 ? "+" : ""}
            {formatUsd(gain)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Remaining in vault</span>
          <span className="font-medium text-foreground tabular-nums">{formatUsd(remaining)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground">Returned to wallet</span>
          <span className="font-medium text-foreground tabular-nums">{formatUsd(amountUsd)}</span>
        </div>
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
          ) : (
            "Confirm Withdraw"
          )}
        </Button>
      </DialogFooter>
    </div>
  )
}

function PositionPickerRow({
  position,
  vault,
  now,
  onSelect,
}: {
  position: Position
  vault: Vault
  now: number
  onSelect: () => void
}) {
  const value = currentValue(position, vault, now)
  return (
    <Button variant="outline" className="justify-between" onClick={onSelect}>
      <ProfileBadge profile={position.profile} />
      <span className="tabular-nums">{formatUsd(value)}</span>
    </Button>
  )
}
