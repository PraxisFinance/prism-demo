"use client"

/**
 * Session-scoped portfolio of Positions. Client-side, in-memory, resets on
 * refresh (and on wallet disconnect — see `resetPortfolioOnDisconnect`
 * below). See plan/04-mock-data-and-state.md §9.2.
 *
 * Deliberately does NOT import data/vaults.ts (server-only, real I/O) —
 * `deposit()` takes the vault's current `entryPrice` as an argument instead
 * of fetching it itself. Current value / earnings are DERIVED elsewhere
 * (lib/portfolio.ts), never stored here.
 */

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

import type { Position, RiskProfile } from "@/types"
import { useWalletStore } from "@/stores/wallet-store"

interface DepositInput {
  vaultId: string
  profile: RiskProfile
  amountUsd: number
  /** Required iff profile !== 'standard' — vault.market.stablePrice (or elevatedPrice) at deposit time. */
  entryPrice?: number
}

interface WithdrawInput {
  positionId: string
  amountUsd: number
}

export interface PortfolioState {
  positions: Position[]
}

export interface PortfolioActions {
  deposit: (input: DepositInput) => void
  withdraw: (input: WithdrawInput) => void
  reset: () => void
}

export type PortfolioStore = PortfolioState & PortfolioActions

function makePositionId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `pos_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export const usePortfolioStore = create<PortfolioStore>()(
  subscribeWithSelector((set, get) => ({
    positions: [],

    deposit: ({ vaultId, profile, amountUsd, entryPrice }) => {
      if (amountUsd <= 0) return
      if (profile !== "standard" && entryPrice === undefined) {
        throw new Error("entryPrice is required for stable/elevated deposits")
      }

      const existing = get().positions.find(
        (p) =>
          p.vaultId === vaultId &&
          p.profile === profile &&
          (profile === "standard" || p.entryPrice === entryPrice)
      )

      if (existing) {
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === existing.id ? { ...p, principalUsd: p.principalUsd + amountUsd } : p
          ),
        }))
      } else {
        const position: Position = {
          id: makePositionId(),
          vaultId,
          profile,
          principalUsd: amountUsd,
          depositedAt: Date.now(),
          ...(profile !== "standard" ? { entryPrice } : {}),
        }
        set((state) => ({ positions: [...state.positions, position] }))
      }

      useWalletStore.getState().debit(amountUsd)
    },

    withdraw: ({ positionId, amountUsd }) => {
      const position = get().positions.find((p) => p.id === positionId)
      if (!position || amountUsd <= 0) return

      const remaining = position.principalUsd - amountUsd
      if (remaining <= 0.01) {
        set((state) => ({ positions: state.positions.filter((p) => p.id !== positionId) }))
      } else {
        set((state) => ({
          positions: state.positions.map((p) => (p.id === positionId ? { ...p, principalUsd: remaining } : p)),
        }))
      }

      useWalletStore.getState().credit(amountUsd)
    },

    reset: () => set({ positions: [] }),
  }))
)

/** Call from the wallet disconnect flow (e.g. ConnectWalletButton) to clear the session portfolio alongside the wallet. */
export function resetPortfolioOnDisconnect(): void {
  usePortfolioStore.getState().reset()
}
