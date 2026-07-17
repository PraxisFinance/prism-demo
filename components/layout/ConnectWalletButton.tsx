"use client"

import { Copy, LogOut, Wallet } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePersistedStoresHydrated } from "@/components/providers/StoreHydration"
import { formatCurrency, truncateAddress } from "@/lib/format"
import { useWalletStore } from "@/stores/wallet-store"
import { resetPortfolioOnDisconnect } from "@/stores/portfolio-store"

/**
 * Fake wallet connect/disconnect control — no extension popup, no RPC.
 * See plan/03-design-system-and-figma.md §4.
 */
export function ConnectWalletButton() {
  const hydrated = usePersistedStoresHydrated()
  const connected = useWalletStore((state) => state.connected)
  const connecting = useWalletStore((state) => state.connecting)
  const address = useWalletStore((state) => state.address)
  const balanceUsd = useWalletStore((state) => state.balanceUsd)
  const connect = useWalletStore((state) => state.connect)
  const disconnect = useWalletStore((state) => state.disconnect)

  if (!hydrated) {
    return (
      <Button disabled>
        <Wallet />
        Connect Wallet
      </Button>
    )
  }

  if (!connected) {
    return (
      <Button onClick={() => connect()} disabled={connecting}>
        <Wallet />
        {connecting ? "Connecting\u2026" : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="pl-1.5">
            <Avatar size="sm">
              <AvatarFallback>
                <Wallet />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{truncateAddress(address ?? "")}</span>
            <span className="text-muted-foreground">
              {formatCurrency(balanceUsd)}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            if (address) navigator.clipboard?.writeText(address)
            toast.success("Address copied")
          }}
        >
          <Copy />
          Copy address
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            disconnect()
            resetPortfolioOnDisconnect()
            toast("Wallet disconnected", {
              description: "Your session and portfolio have been reset.",
            })
          }}
        >
          <LogOut />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
