"use client"

/**
 * Fake wallet session store — no real wallet extension, RPC, or signatures.
 * Persisted to localStorage so balance + connection survive refresh / browser close.
 * Cleared on explicit disconnect (state reset is re-written by persist).
 * See plan/03-design-system-and-figma.md §4 and
 * plan/04-mock-data-and-state.md §9.1.
 */

import { create } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"

const MOCK_ADDRESS = "0x7F3a9C2b1D8e4F6a0B5c3D2e1F4a6B8c9D0e3aE2"
const MOCK_BALANCE_USD = 25_000
const FAKE_CONNECT_DELAY_MS = 400

export interface WalletState {
  connected: boolean
  connecting: boolean
  address: string | null
  balanceUsd: number
}

export interface WalletActions {
  connect: () => Promise<void>
  disconnect: () => void
  /** Deduct funds (e.g. on deposit). Never goes below 0. */
  debit: (amount: number) => void
  /** Add funds back (e.g. on withdraw). */
  credit: (amount: number) => void
}

export type WalletStore = WalletState & WalletActions

export const useWalletStore = create<WalletStore>()(
  persist(
    subscribeWithSelector((set) => ({
      connected: false,
      connecting: false,
      address: null,
      balanceUsd: 0,

      connect: async () => {
        set({ connecting: true })
        await new Promise((resolve) => setTimeout(resolve, FAKE_CONNECT_DELAY_MS))
        set({
          connected: true,
          connecting: false,
          address: MOCK_ADDRESS,
          balanceUsd: MOCK_BALANCE_USD,
        })
      },

      disconnect: () => {
        set({ connected: false, connecting: false, address: null, balanceUsd: 0 })
      },

      debit: (amount) => {
        set((state) => ({ balanceUsd: Math.max(state.balanceUsd - amount, 0) }))
      },

      credit: (amount) => {
        set((state) => ({ balanceUsd: state.balanceUsd + amount }))
      },
    })),
    {
      name: "prism-wallet",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({
        connected: state.connected,
        address: state.address,
        balanceUsd: state.balanceUsd,
      }),
    }
  )
)
