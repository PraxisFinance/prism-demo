"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ProfileBadge } from "@/components/vaults/ProfileBadge"
import { ProfileToggle } from "@/components/vaults/ProfileToggle"
import { formatApy } from "@/lib/format"
import { elevatedSettlementApy, stableSettlementApy, toMarketParams } from "@/lib/prism"
import type { Position, RiskProfile, Vault } from "@/types"

interface VaultActionPanelProps {
  vault: Vault
  profile: RiskProfile
  onProfileChange: (profile: RiskProfile) => void
  positions: Position[]
  onDeposit: () => void
  onWithdraw: (positionId: string) => void
}

const PREVIEW_REALIZED_APYS = [2, 4, 6, 8, 10]

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
}: VaultActionPanelProps) {
  const { market } = vault
  const matured = market.matured
  const params = toMarketParams(market.targetApy, market.protectionBuffer)
  const isMarketProfile = profile !== "standard"
  const settle = profile === "elevated" ? elevatedSettlementApy : stableSettlementApy

  return (
    <Card className="h-fit p-5">
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
            <ProfileToggle value={profile} onValueChange={onProfileChange} className="w-full" />
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

          {isMarketProfile ? (
            <div className="flex flex-col gap-2 border-t pt-4">
              <span className="text-xs text-muted-foreground">Expected performance</span>
              <div className="overflow-hidden rounded-lg border text-xs">
                <div className="grid grid-cols-6 gap-1 bg-muted/60 px-2 py-1.5 font-medium text-muted-foreground">
                  <span className="col-span-1">Real APY</span>
                  {PREVIEW_REALIZED_APYS.map((x) => (
                    <span key={x} className="text-right tabular-nums">
                      {x}%
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-1 px-2 py-1.5">
                  <span className="col-span-1 text-muted-foreground">You receive</span>
                  {PREVIEW_REALIZED_APYS.map((x) => (
                    <span key={x} className="text-right font-medium tabular-nums text-foreground">
                      {settle(x, params).toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="border-t pt-4 text-xs text-muted-foreground">
              Standard deposits earn the vault{"\u2019"}s spot APY directly {"\u2014"} no Prism market
              exposure.
            </p>
          )}

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
