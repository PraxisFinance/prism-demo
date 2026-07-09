"use client"

/**
 * Ephemeral cross-component UI state: the selected deposit-type context
 * (kept in sync between Vault Details and the Deposit modal) and which
 * modal, if any, is open. See plan/04-mock-data-and-state.md §9.3.
 */

import { create } from "zustand"

import type { RiskProfile } from "@/types"
import { DEFAULT_RISK_PROFILE } from "@/lib/profiles"

export type ModalState =
  | { type: "none" }
  | { type: "deposit"; vaultId: string }
  | { type: "withdraw"; positionId: string }

export interface UiState {
  selectedProfile: RiskProfile
  modal: ModalState
  /**
   * Draft deposit amount, shared between the vault details sidebar
   * (`VaultActionPanel`) and the Deposit modal (`DepositPanel`) — mirrors
   * `selectedProfile`'s existing cross-component sync so typing an amount
   * in the sidebar carries it straight into the popup when it opens.
   */
  depositAmount: string
}

export interface UiActions {
  setProfile: (profile: RiskProfile) => void
  setDepositAmount: (amount: string) => void
  openDeposit: (vaultId: string) => void
  openWithdraw: (positionId: string) => void
  closeModal: () => void
}

export type UiStore = UiState & UiActions

export const useUiStore = create<UiStore>()((set) => ({
  selectedProfile: DEFAULT_RISK_PROFILE,
  modal: { type: "none" },
  depositAmount: "",

  setProfile: (profile) => set({ selectedProfile: profile }),
  setDepositAmount: (amount) => set({ depositAmount: amount }),
  openDeposit: (vaultId) => set({ modal: { type: "deposit", vaultId } }),
  openWithdraw: (positionId) => set({ modal: { type: "withdraw", positionId } }),
  closeModal: () => set({ modal: { type: "none" } }),
}))
