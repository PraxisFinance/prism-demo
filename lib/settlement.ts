/**
 * Pure, deterministic model of the Prism settlement curve, mirroring the
 * whitepaper (papers/whitepaper/praxis_prism.tex, §"Settlement Model").
 *
 * A market is defined by a target APY `t` and a protection buffer `phi`,
 * with lower boundary `a = t - phi`. Stable is floored at `t` for realized
 * APY `x >= a` (downside protection); Elevated absorbs the deficit below `a`
 * and captures all upside above `t`. Conservation holds: S(x) + E(x) = 2x.
 *
 * Used by the step-6 settlement chart on the "How it works" page
 * (plan/09-how-it-works.md §5). No side effects, no dependencies.
 */

export interface SettlementParams {
  /** Target APY (neutral reference), in percent. */
  t: number
  /** Protection buffer, in percent. Must satisfy 0 <= phi <= t/2. */
  phi: number
}

/** Illustrative defaults matching the whitepaper's worked example (a = 4%). */
export const DEFAULT_SETTLEMENT: SettlementParams = { t: 5, phi: 1 }

/** Lower boundary of the protection zone, `a = t - phi`. */
export function boundary({ t, phi }: SettlementParams): number {
  return t - phi
}

/** Stable settlement APY S(x) for realized APY `x` (percent). */
export function stableApy(x: number, params: SettlementParams): number {
  const a = boundary(params)
  if (x <= 0) return 0
  if (x >= a) return params.t
  const pa = params.t / (2 * a) // boundary share Ds(a)
  const share = 1 - (1 - pa) * (x / a) // Ds(x) on the deficit region
  return 2 * x * share
}

/** Elevated settlement APY E(x) = 2x - S(x). */
export function elevatedApy(x: number, params: SettlementParams): number {
  return 2 * x - stableApy(x, params)
}

export interface SettlementPoint {
  x: number
  stable: number
  elevated: number
}

/** Sampled S(x)/E(x) curve over [0, xMax] for charting. */
export function settlementSeries(
  params: SettlementParams,
  xMax = 10,
  step = 0.25
): SettlementPoint[] {
  const points: SettlementPoint[] = []
  const round = (n: number) => Math.round(n * 100) / 100
  for (let x = 0; x <= xMax + 1e-9; x += step) {
    points.push({
      x: round(x),
      stable: round(stableApy(x, params)),
      elevated: round(elevatedApy(x, params)),
    })
  }
  return points
}

/**
 * Market-implied APY read off the Stable price `pS` (with pS + pE = 1),
 * i.e. the closed-form inverse of the Stable distribution share.
 * See whitepaper §"Market-Implied APY and Payoff".
 */
export function impliedApyFromStablePrice(
  pS: number,
  params: SettlementParams
): number {
  const a = boundary(params)
  const pa = params.t / (2 * a)
  if (pS >= pa) {
    // deficit region: x <= a
    return a * ((1 - pS) / (1 - pa))
  }
  // protected / upside region: x > a
  return params.t / (2 * pS)
}
