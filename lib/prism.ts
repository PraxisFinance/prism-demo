/**
 * Praxis Prism settlement math — the real per-vault market engine.
 *
 * Direct, friendly-named translation of the whitepaper's settlement model
 * (papers/whitepaper/praxis_prism.tex, "Settlement Model" / "Market-Implied
 * APY and Payoff"). No Greek letters or Ds/De naming in the public API;
 * comments cite the paper's symbols for anyone cross-checking the math.
 *
 * Deliberately kept SEPARATE from lib/settlement.ts, which powers the
 * illustrative "How it works" explainer (plan/09) with its own hardcoded
 * curve. This module is driven by each vault's real, derived
 * (targetApy, protectionBuffer) from lib/market.ts (plan/04) — the two are
 * intentionally not shared/merged.
 *
 * All APY values are percentages (e.g. `5` means 5%), consistent with
 * `types/index.ts`'s `VaultMarket`.
 */

export interface MarketParams {
  /** t — neutral reference APY (%). */
  targetApy: number
  /** φ — protection buffer (%). Must satisfy 0 <= protectionBuffer <= targetApy / 2. */
  protectionBuffer: number
  /** a = t - φ (%). */
  boundaryApy: number
}

/** Build MarketParams from a target + buffer, computing the boundary for you. */
export function toMarketParams(targetApy: number, protectionBuffer: number): MarketParams {
  return { targetApy, protectionBuffer, boundaryApy: targetApy - protectionBuffer }
}

/**
 * Settlement APY paid to Stable given realized APY x (whitepaper eq.
 * "stable-apy"): floored at target for x >= boundary (a); on the deficit
 * region [0, a) it's a smooth quadratic down to 0 at x = 0.
 */
export function stableSettlementApy(x: number, m: MarketParams): number {
  const { targetApy: t, boundaryApy: a } = m
  if (x <= 0) return 0
  if (x >= a) return t
  const pa = t / (2 * a) // boundary share Ds(a)
  const share = 1 - (1 - pa) * (x / a) // Ds(x) on the deficit region
  return 2 * x * share
}

/** Conservation: stable + elevated settlement APY always sums to 2x. */
export function elevatedSettlementApy(x: number, m: MarketParams): number {
  return 2 * x - stableSettlementApy(x, m)
}

/** Stable's share of total distributed yield, Ds(x) = S(x) / 2x (Ds(0) = 1). */
export function stableShare(x: number, m: MarketParams): number {
  if (x <= 0) return 1
  return stableSettlementApy(x, m) / (2 * x)
}

/** Elevated's share, De(x) = 1 - Ds(x). */
export function elevatedShare(x: number, m: MarketParams): number {
  return 1 - stableShare(x, m)
}

/**
 * Price a hypothetical market would quote for Stable if it believed
 * realized APY would land exactly at `impliedApy`. Just stableShare()
 * evaluated at that APY — used to derive the mocked static price
 * (lib/market.ts).
 */
export function stablePriceForImpliedApy(impliedApy: number, m: MarketParams): number {
  return stableShare(impliedApy, m)
}

/**
 * Inverts a Stable price into the market-implied APY (whitepaper eqs.
 * "inv-lower"/"inv-upper"). This is what makes price the single predicted
 * APY number. `stablePrice` is clamped to (epsilon, 1) to avoid division
 * blow-ups at the extremes.
 */
export function impliedApyFromStablePrice(stablePrice: number, m: MarketParams): number {
  const { targetApy: t, boundaryApy: a } = m
  const pa = t / (2 * a)
  const epsilon = 1e-6
  const pS = Math.min(Math.max(stablePrice, epsilon), 1 - epsilon)

  if (pS >= pa) {
    // deficit region: x <= a
    const denom = 1 - pa
    if (denom <= epsilon) return a
    return a * ((1 - pS) / denom)
  }
  // protected / upside region: x > a
  return t / (2 * pS)
}

/**
 * A position's effective APY given its entry price and the realized APY
 * observed so far (whitepaper eq. "eff"): effectiveAPY = pFinal/pEntry * x.
 * `entryPrice` is the price of the token actually held (already flipped to
 * `1 - stablePrice` by the caller for an Elevated position).
 */
export function effectiveApy(
  kind: "stable" | "elevated",
  entryPrice: number,
  realizedApySoFar: number,
  m: MarketParams
): number {
  const epsilon = 1e-6
  const pFinal = kind === "stable" ? stableShare(realizedApySoFar, m) : elevatedShare(realizedApySoFar, m)
  const pEntry = Math.max(entryPrice, epsilon)
  return (pFinal / pEntry) * realizedApySoFar
}

export interface SettlementCurvePoint {
  x: number
  stableApy: number
  elevatedApy: number
}

/**
 * Pure function of (targetApy, protectionBuffer) only — NOT a time series.
 * Powers the Vault Details "settlement curve" chart (plan/06): Stable &
 * Elevated settlement APY vs. a swept range of hypothetical realized APY x.
 */
export function buildSettlementCurve(
  m: MarketParams,
  opts?: { points?: number; maxX?: number }
): SettlementCurvePoint[] {
  const points = opts?.points ?? 60
  const maxX = opts?.maxX ?? Math.max(m.targetApy * 2, 1)
  const step = maxX / points
  const round = (n: number) => Math.round(n * 100) / 100

  const curve: SettlementCurvePoint[] = []
  for (let i = 0; i <= points; i++) {
    const x = i * step
    curve.push({
      x: round(x),
      stableApy: round(stableSettlementApy(x, m)),
      elevatedApy: round(elevatedSettlementApy(x, m)),
    })
  }
  return curve
}
