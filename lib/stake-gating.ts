/**
 * Shared wallet-gating check for every deposit/withdraw trigger (vault
 * list rows, Vault Details action panel, position cards). See
 * plan/07-deposit-withdraw-modals.md §2 — toast-and-prompt is the chosen
 * path over a separate "connect first" modal.
 */
import { toast } from "sonner"

/** Returns true if the caller should proceed (open the modal); toasts and returns false otherwise. */
export function requireWalletConnected(connected: boolean, action: "deposit" | "withdraw"): boolean {
  if (connected) return true
  toast(`Connect your wallet to ${action}`, {
    description: "Use the Connect Wallet button in the header to get started.",
  })
  return false
}
