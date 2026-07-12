/**
 * Config-driven data for the "How we're different" segment (plan/10 §5.4).
 *
 * Framing: "where each shines" — each protocol is described by its own genuine
 * strengths and what it's best for, with no winner/loser judgment. To add a
 * competitor (e.g. IPOR, Voltz), append an object with its own strengths and
 * `bestFor`. Nothing else needs to change.
 */

export interface Competitor {
  id: string
  name: string
  /** Short mechanism tagline. */
  tagline: string
  /** One-line "best for …" summary. */
  bestFor: string
  /** Neutral strengths list (what this protocol is genuinely good at). */
  strengths: string[]
  /** When true, the panel is subtly emphasized (this is us). */
  highlight?: boolean
}

export const COMPETITORS: Competitor[] = [
  {
    id: "praxis",
    name: "Praxis",
    tagline: "Trade the yield itself — Stable vs Elevated.",
    bestFor: "Reading a live APY forecast and taking a principal-safe side.",
    strengths: [
      "Prices read directly as the market's APY forecast",
      "Up to ~40× less liquidity to bootstrap a market",
      "Principal stays out of the APY trade",
      "Downside protection with Stable, leveraged upside with Elevated",
    ],
    highlight: true,
  },
  {
    id: "pendle",
    name: "Pendle",
    tagline: "Trade discounted principal against yield.",
    bestFor: "Locking in a fixed yield on deep, established markets.",
    strengths: [
      "Deep liquidity and mature, battle-tested markets",
      "Fixed-rate lock-in via PT — a known yield to maturity",
      "Large ecosystem with broad integrations and incentives",
    ],
  },
  // TODO (user): add more, e.g.
  // { id: "ipor", name: "IPOR", tagline: "…", bestFor: "…", strengths: ["…"] },
  // { id: "voltz", name: "Voltz", tagline: "…", bestFor: "…", strengths: ["…"] },
]
