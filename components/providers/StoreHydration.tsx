"use client"

import { useEffect, useState } from "react"

import { usePortfolioStore } from "@/stores/portfolio-store"
import { useWalletStore } from "@/stores/wallet-store"

/**
 * Manually rehydrate persisted Zustand stores after mount.
 * Required because both stores use `skipHydration: true` to avoid SSR mismatches.
 */
export function StoreHydration() {
  useEffect(() => {
    void useWalletStore.persist.rehydrate()
    void usePortfolioStore.persist.rehydrate()
  }, [])

  return null
}

/** True once wallet + portfolio have finished reading from localStorage. */
export function usePersistedStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const check = () => {
      if (
        useWalletStore.persist.hasHydrated() &&
        usePortfolioStore.persist.hasHydrated()
      ) {
        setHydrated(true)
      }
    }

    const unsubWallet = useWalletStore.persist.onFinishHydration(check)
    const unsubPortfolio = usePortfolioStore.persist.onFinishHydration(check)
    check()

    return () => {
      unsubWallet()
      unsubPortfolio()
    }
  }, [])

  return hydrated
}
