/**
 * Copy for the six "How Prism works" steps. Plain-language, drawn faithfully
 * from the whitepaper (papers/whitepaper/praxis_prism.tex). Editable — this is
 * the single source of truth for step text. See plan/09 §6.
 */

export interface StepCopy {
  /** 1-based step number. */
  index: number
  title: string
  lead: string
  /** Optional muted mechanism detail line. */
  detail?: string
}

export const TOTAL_STEPS = 6

export const STEPS: StepCopy[] = [
  {
    index: 1,
    title: "It starts with a deposit",
    lead: "You deposit an asset into a yield-bearing vault, exactly like any DeFi position. That position earns a single, blended stream of variable yield.",
  },
  {
    index: 2,
    title: "Principal and yield, separated",
    lead: "Prism splits the position into a Principal Token (PT) and a Yield Token (YT). PT keeps your claim on the principal; YT carries the variable yield. From here, Prism works only on the YT — your principal never enters the APY market.",
    detail:
      "Prism uses an accumulated-yield YT, so the market stays meaningful all the way to maturity.",
  },
  {
    index: 3,
    title: "Yield refracts into two sides",
    lead: "The YT splits once more into two complementary tokens: Stable and Elevated. One YT becomes one Stable plus one Elevated. Stable gains when APY ends up lower than expected; Elevated gains when it ends up higher.",
  },
  {
    index: 4,
    title: "The market prices the forecast",
    lead: "Stable and Elevated trade against each other in a pool. Their prices always add up to one — so the split between them reads directly as the market's forecast for future APY.",
  },
  {
    index: 5,
    title: "Choose your view",
    lead: "Take the side that matches your view: Stable for protection if you expect APY to cool off, Elevated for upside if you expect it to run hot. You break even at the APY the market was pricing in the moment you entered.",
  },
  {
    index: 6,
    title: "Settled against reality",
    lead: "At maturity, Prism reads the realized APY from the underlying lending market and settles the two sides along a continuous curve. The further realized APY lands from expectations, the larger the winning side's payoff — and total yield is always conserved.",
  },
]
