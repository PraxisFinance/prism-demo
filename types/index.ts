/**
 * Shared domain types for the Prism demo. See plan/04-mock-data-and-state.md.
 *
 * `RiskProfile` names the three deposit types: `standard` is a plain deposit
 * (no market exposure); `stable`/`elevated` are the two Prism prediction-
 * market tokens. There is deliberately no forecast-curve/band/confidence
 * type anywhere here — the market's forecast is a single number
 * (`VaultMarket.impliedApy`), per the whitepaper
 * (papers/whitepaper/praxis_prism.tex).
 */

export type RiskProfile = "stable" | "standard" | "elevated"

export type VaultCategory = "Stablecoin" | "ETH" | "LST" | "RWA" | "Blue-chip"

/**
 * A vault's fixed-period Stable/Elevated market. `targetApy`/`protectionBuffer`
 * are protocol parameters (anchored once from real trailing data at market
 * start); `marketStartAt`/`marketEndAt` are the market's lifecycle bounds;
 * `stablePrice`/`impliedApy` are the mocked, static (per-session) market
 * price and the single predicted APY it implies; `realizedApySoFar` is the
 * one field that legitimately drifts as real DeFiLlama data updates.
 */
export interface VaultMarket {
  /** Neutral reference APY (%), set at market start from real trailing data. */
  targetApy: number
  /** (%) How far below target Stable is still fully protected. */
  protectionBuffer: number
  /** targetApy - protectionBuffer (%). */
  boundaryApy: number
  /** epoch ms — market start (T0). */
  marketStartAt: number
  /** epoch ms — market end (T1). */
  marketEndAt: number
  /** now >= marketEndAt. */
  matured: boolean
  /** (%) Trailing realized APY from real data, T0..now (or final value once matured). */
  realizedApySoFar: number
  /** (%) THE headline predicted APY implied by the current Stable/Elevated price. */
  impliedApy: number
  /** 0..1 — current market price of 1 Stable token. */
  stablePrice: number
  /** 0..1 — = 1 - stablePrice. */
  elevatedPrice: number
}

export interface Vault {
  /** slug, e.g. "base-steakusdc". */
  id: string
  /** display name, e.g. "Steakhouse USDC". */
  name: string
  /** "USDC". */
  asset: string
  /** "USD Coin". */
  assetName: string
  /** "Morpho Blue". */
  protocol: string
  /** "BSC" | "Base" | "Avalanche" | "MegaETH" | "Mantle" | "Katana" | ... */
  chainLabel: string
  category: VaultCategory
  /** From live/fallback DeFiLlama data. */
  tvlUsd: number
  /** (%) Current spot APY — what a Standard deposit earns. */
  currentApy: number
  /** 1-2 sentences. */
  description: string
  market: VaultMarket
}

/**
 * A user's holding. `profile` selects which of the 3 deposit types this is.
 * `entryPrice` only applies to stable/elevated (the Stable-token price paid
 * at deposit time; Elevated's entry price is `1 - entryPrice`).
 *
 * currentValue & earnings are DERIVED (see lib/portfolio.ts), not stored raw.
 */
export interface Position {
  /** uuid */
  id: string
  vaultId: string
  profile: RiskProfile
  /** Amount deposited, in USD. */
  principalUsd: number
  /** epoch ms */
  depositedAt: number
  /** Stable-token price at entry; required iff profile !== 'standard'. */
  entryPrice?: number
}
