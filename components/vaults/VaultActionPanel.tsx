"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AmountReadout, formatBalanceLabel } from "@/components/modals/AmountReadout"
import { ProfileBadge } from "@/components/vaults/ProfileBadge"
import { ProfileCardSelector } from "@/components/vaults/ProfileCardSelector"
import { SettlementPreviewTable } from "@/components/vaults/SettlementPreviewTable"
import { formatApy } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useWalletStore } from "@/stores/wallet-store"
import type { Position, RiskProfile, Vault } from "@/types"

interface VaultActionPanelProps {
  vault: Vault
  profile: RiskProfile
  onProfileChange: (profile: RiskProfile) => void
  amount: string
  onAmountChange: (amount: string) => void
  positions: Position[]
  onDeposit: () => void
  onWithdraw: (positionId: string) => void
  className?: string
}

/**
 * Visual match of the Figma design's persistent right-side Deposit/Withdraw
 * panel. plan/07 already scopes the real deposit/withdraw flow as a Dialog
 * (see plan/figma-mapping.md) — that decision stands, so this stays a
 * preview: the "Expected performance" table is real (lib/prism.ts
 * settlement math for the selected profile). The amount field is the real,
 * fillable `AmountReadout` (shared draft value in `uiStore.depositAmount`,
 * same cross-component-sync pattern as `selectedProfile`), so whatever is
 * typed here carries straight into the Deposit modal when the CTA opens it
 * via uiStore. See plan/06 redesign Q&A.
 */
export function VaultActionPanel({
  vault,
  profile,
  onProfileChange,
  amount,
  onAmountChange,
  positions,
  onDeposit,
  onWithdraw,
  className,
}: VaultActionPanelProps) {
  const balanceUsd = useWalletStore((state) => state.balanceUsd)
  const { market } = vault
  const matured = market.matured
  const isMarketProfile = profile !== "standard"
  const amountUsd = Number.parseFloat(amount) || 0
  const amountError =
    amount && amountUsd <= 0
      ? "Enter an amount greater than 0"
      : amountUsd > balanceUsd
        ? "Amount exceeds wallet balance"
        : undefined

  return (
    <Card className={cn("h-fit p-5", className)}>
      <Tabs defaultValue="deposit">
        <TabsList className="w-full">
          <TabsTrigger value="deposit" className="flex-1">
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex-1">
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="flex flex-col gap-4 pt-4">
          <AmountReadout
            label="Amount"
            value={amount}
            onChange={onAmountChange}
            max={balanceUsd}
            balanceLabel={formatBalanceLabel("Balance", balanceUsd)}
            disabled={matured}
            error={amountError}
          />

          <div className="flex flex-col gap-1.5 border-t pt-4">
            <span className="text-xs text-foreground">Choose option</span>
            <ProfileCardSelector value={profile} onValueChange={onProfileChange} className="max-w-full" vault={vault} />
          </div>

          <div className="flex flex-col gap-1.5 border-t pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Network</span>
              <span className="font-medium text-foreground">{vault.chainLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">APY</span>
              <span className="font-medium text-foreground">
                {formatApy(isMarketProfile ? market.impliedApy : vault.currentApy)}
              </span>
            </div>
            {isMarketProfile && (
              <div className="flex items-center justify-between">
                <span className="text-foreground">Target APY</span>
                <span className="font-medium text-foreground">{formatApy(market.targetApy)}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4 pb-2">
            <SettlementPreviewTable vault={vault} profile={profile} />
          </div>

          {matured ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-flex w-full" tabIndex={0}>
                    <Button disabled className="w-full">
                      Deposit
                    </Button>
                  </span>
                }
              />
              <TooltipContent>This market has settled</TooltipContent>
            </Tooltip>
          ) : (
            <Button className="w-full" onClick={onDeposit}>
              Deposit {vault.asset}
            </Button>
          )}
        </TabsContent>

        <TabsContent value="withdraw" className="flex flex-col gap-3 pt-4">
          {positions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don{"\u2019"}t have a position in this vault yet.
            </p>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">Your positions</span>
              {positions.map((position) => (
                <Button
                  key={position.id}
                  variant="outline"
                  className="justify-between"
                  onClick={() => onWithdraw(position.id)}
                >
                  <ProfileBadge profile={position.profile} />
                  <span>Withdraw</span>
                </Button>
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
