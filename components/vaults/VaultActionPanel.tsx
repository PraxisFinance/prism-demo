"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ProfileBadge } from "@/components/vaults/ProfileBadge"
import { ProfileCardSelector } from "@/components/vaults/ProfileCardSelector"
import { SettlementPreviewTable } from "@/components/vaults/SettlementPreviewTable"
import { formatApy } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Position, RiskProfile, Vault } from "@/types"

interface VaultActionPanelProps {
  vault: Vault
  profile: RiskProfile
  onProfileChange: (profile: RiskProfile) => void
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
 * settlement math for the selected profile), but the amount field is
 * disabled and both CTAs just open the (future) modal via uiStore. See
 * plan/06 redesign Q&A.
 */
export function VaultActionPanel({
  vault,
  profile,
  onProfileChange,
  positions,
  onDeposit,
  onWithdraw,
  className,
}: VaultActionPanelProps) {
  const { market } = vault
  const matured = market.matured
  const isMarketProfile = profile !== "standard"

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
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Choose option</span>
            <ProfileCardSelector value={profile} onValueChange={onProfileChange} className="max-w-full" />
          </div>

          <div className="flex flex-col gap-1.5 border-t pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="font-medium text-foreground">{vault.chainLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">APY</span>
              <span className="font-medium text-foreground">
                {formatApy(isMarketProfile ? market.impliedApy : vault.currentApy)}
              </span>
            </div>
            {isMarketProfile && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target APY</span>
                <span className="font-medium text-foreground">{formatApy(market.targetApy)}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <SettlementPreviewTable vault={vault} profile={profile} />
          </div>

          <div className="flex flex-col gap-1.5 border-t pt-4">
            <span className="text-xs text-muted-foreground">Amount</span>
            <div className="flex items-center gap-2">
              <Input disabled placeholder="0.00" className="text-base" />
              <Button variant="outline" size="sm" disabled>
                MAX
              </Button>
            </div>
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
