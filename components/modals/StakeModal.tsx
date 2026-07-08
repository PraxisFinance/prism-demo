"use client"

import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositPanel } from "@/components/modals/DepositPanel"
import { WithdrawPanel } from "@/components/modals/WithdrawPanel"
import { protocolLogoSrc } from "@/lib/protocol-logos"
import { useUiStore } from "@/stores/ui-store"
import { useWalletStore } from "@/stores/wallet-store"
import type { Vault } from "@/types"

export type StakeTab = "deposit" | "withdraw"

interface StakeModalProps {
  vault: Vault
  initialTab: StakeTab
  /** Only set when opened via `openWithdraw(positionId)` — otherwise the Withdraw tab resolves/picks a position itself. */
  initialPositionId?: string
}

/**
 * Single Dialog with an internal Deposit | Withdraw tab, matching the
 * Figma `Vaults_Stake_Poap` frame and the prior `figma-mapping.md`
 * decision (superseding plan/07's literal "two separate modals" text).
 * Mounted by `ModalRoot`; unmounts entirely on close so all local state
 * (amount, pending status) resets for free on next open, per plan/07 §5.
 */
export function StakeModal({ vault, initialTab, initialPositionId }: StakeModalProps) {
  const [tab, setTab] = useState<StakeTab>(initialTab)
  const closeModal = useUiStore((state) => state.closeModal)
  const connected = useWalletStore((state) => state.connected)

  // Safety net: if the wallet disconnects while this modal is open (which
  // also resets the portfolio, see ConnectWalletButton), close it rather
  // than leaving a stale deposit/withdraw form on screen.
  useEffect(() => {
    if (!connected) closeModal()
  }, [connected, closeModal])

  return (
    <Dialog open onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              {protocolLogoSrc(vault.protocol) && (
                <AvatarImage src={protocolLogoSrc(vault.protocol)} alt={vault.protocol} />
              )}
              <AvatarFallback className="text-xs">{vault.asset.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <DialogTitle>
              {tab === "deposit" ? `Deposit into ${vault.name}` : `Withdraw from ${vault.name}`}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(value) => setTab(value as StakeTab)}>
          <TabsList className="w-full">
            <TabsTrigger value="deposit" className="flex-1">
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex-1">
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <DepositPanel vault={vault} onDone={closeModal} />
          </TabsContent>
          <TabsContent value="withdraw">
            <WithdrawPanel vault={vault} initialPositionId={initialPositionId} onDone={closeModal} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
