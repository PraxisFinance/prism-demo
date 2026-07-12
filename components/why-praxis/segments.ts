/**
 * Content + config for the "Why Praxis" branching pitch page (plan/10). Single
 * source of truth for the hub choices and each segment's value cards. Pitch-tone
 * copy — editable. Structure agreed in the requirements Q&A: click-driven
 * hub-and-spoke, one full-screen segment per choice, "How we're different" as a
 * comparison segment, and a closing CTA.
 */
import {
  Activity,
  ArrowLeftRight,
  Boxes,
  Droplets,
  GitBranch,
  LineChart,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react"

/** Visual accent for a segment/card — maps to a semantic/profile color token. */
export type SegmentAccent = "primary" | "stable" | "elevated" | "positive"

/** Which purpose-built visual a card renders (see components/why-praxis/visuals). */
export type VisualId =
  | "forecast"
  | "payoff-stable"
  | "payoff-elevated"
  | "trade-flow"
  | "liquidity"
  | "activity"
  | "ux"
  | "none"

/** Tailwind classes per accent, used across hub cards, cells, and switcher. */
export const ACCENT_CLASSES: Record<
  SegmentAccent,
  {
    chip: string
    text: string
    ring: string
    hoverRing: string
    softBg: string
    glow: string
  }
> = {
  primary: {
    chip: "bg-primary/10 text-primary ring-primary/20",
    text: "text-primary",
    ring: "ring-primary/40",
    hoverRing: "hover:ring-primary/40",
    softBg: "bg-primary/5",
    glow: "var(--primary)",
  },
  stable: {
    chip: "bg-profile-stable/10 text-profile-stable ring-profile-stable/20",
    text: "text-profile-stable",
    ring: "ring-profile-stable/40",
    hoverRing: "hover:ring-profile-stable/40",
    softBg: "bg-profile-stable/5",
    glow: "var(--profile-stable)",
  },
  elevated: {
    chip: "bg-profile-elevated/10 text-profile-elevated ring-profile-elevated/20",
    text: "text-profile-elevated",
    ring: "ring-profile-elevated/40",
    hoverRing: "hover:ring-profile-elevated/40",
    softBg: "bg-profile-elevated/5",
    glow: "var(--profile-elevated)",
  },
  positive: {
    chip: "bg-positive/10 text-positive ring-positive/20",
    text: "text-positive",
    ring: "ring-positive/40",
    hoverRing: "hover:ring-positive/40",
    softBg: "bg-positive/5",
    glow: "var(--positive)",
  },
}

export type SegmentId = "users" | "vaults" | "chains" | "differ"

export interface ValueCard {
  id: string
  icon: LucideIcon
  title: string
  /** Compact body shown in the grid cell. */
  short: string
  /** Full body shown in the expanded dialog. */
  body: string
  /** Which visual to render (grid + dialog). */
  visual: VisualId
  /** When true, render the visual inline in the grid card (richer tile). */
  inline?: boolean
  /** Optional per-card accent override (defaults to the segment accent). */
  accent?: SegmentAccent
  /** Optional oversized stat callout (e.g. "40x"). */
  stat?: string
  statLabel?: string
  /** Optional "see it live" link into the app. */
  link?: { href: string; label: string }
}

export interface Segment {
  id: SegmentId
  /** Card label on the hub. */
  label: string
  /** One-liner shown on the hub card. */
  tagline: string
  icon: LucideIcon
  accent: SegmentAccent
  /** Headline shown at the top of the segment screen. */
  heading: string
  /** Supporting line under the segment heading. */
  intro: string
  /** "cards" → adaptive value grid; "comparison" → narrative + table. */
  kind: "cards" | "comparison"
  cards: ValueCard[]
}

export const HUB_COPY = {
  eyebrow: "Why Praxis",
  title: "One protocol. Value for everyone in the stack.",
  subtitle:
    "Praxis turns any vault's variable APY into a two-sided market — a live, tradable forecast of future yield. Pick who you are to see what that unlocks.",
} as const

export const CTA_COPY = {
  eyebrow: "Let's talk",
  title: "Interested?",
  subtitle:
    "Whether you're a user, a vault, or a chain, we'd love to show you what Praxis can do for you.",
  primary: { label: "Connect with us", href: "#" },
  secondary: [
    { label: "Explore vaults", href: "/vaults" },
    { label: "See how it works", href: "/how-it-works" },
  ],
} as const

export const SEGMENTS: Segment[] = [
  {
    id: "users",
    label: "For users",
    tagline: "Predict, protect, and profit from APY.",
    icon: TrendingUp,
    accent: "primary",
    heading: "For users",
    intro:
      "Read the market's own forecast for any vault, then take the side that matches your view — with your principal never at stake.",
    kind: "cards",
    cards: [
      {
        id: "forecasting",
        icon: LineChart,
        title: "APY forecasting",
        short:
          "Read the market's live forecast for any vault's future APY — before you commit a dollar.",
        body: "Stable and Elevated always price to one, so their split reads directly as the market's forecast for a vault's future APY. See where yield is expected to go — and find the best risk-adjusted opportunities — before you commit.",
        visual: "forecast",
        link: { href: "/vaults", label: "Browse vaults" },
      },
      {
        id: "hedging",
        icon: ShieldCheck,
        title: "Hedge your APY",
        short:
          "Hold Stable for downside protection: it earns the target APY unless realized rates fall far below it.",
        body: "Take the Stable side to lock in downside protection. It keeps paying the target APY unless realized rates fall far below expectations — so you can hold a yield position without fearing a rate collapse.",
        visual: "payoff-stable",
        accent: "stable",
        link: { href: "/how-it-works", label: "How Stable settles" },
      },
      {
        id: "leveraged",
        icon: TrendingUp,
        title: "Leveraged upside",
        short:
          "Hold Elevated for amplified upside whenever realized APY runs hotter than priced in — principal untouched.",
        body: "Take the Elevated side for leveraged exposure to rate moves. It captures the gains whenever realized APY runs hotter than the market priced in — amplified upside, with your principal never entering the APY market.",
        visual: "payoff-elevated",
        accent: "elevated",
      },
      {
        id: "trading",
        icon: ArrowLeftRight,
        title: "Trade the forecast",
        short:
          "Actively trade Stable ↔ Elevated as your view changes — take profit, rebalance, or flip sides before maturity.",
        body: "The forecast is live and tradable. Move between Stable and Elevated as your view changes: take profit when the market comes to you, rebalance your exposure, or flip sides entirely — all before maturity.",
        visual: "trade-flow",
      },
    ],
  },
  {
    id: "vaults",
    label: "For vaults",
    tagline: "APY-trading infrastructure at a fraction of the liquidity.",
    icon: Boxes,
    accent: "stable",
    heading: "For vaults",
    intro:
      "Turn your variable yield into a two-sided market — without building rate-derivative machinery yourself, and without the liquidity a Pendle-style market demands.",
    kind: "cards",
    cards: [
      {
        id: "infrastructure",
        icon: Boxes,
        title: "APY-trading infrastructure",
        short:
          "Drop-in infrastructure that turns a vault's variable yield into a tradable Stable/Elevated market.",
        body: "Praxis is drop-in infrastructure that turns your vault's variable yield into a tradable market of Stable and Elevated — no fixed-rate or rate-derivative stack for you to build, audit, or maintain.",
        visual: "none",
      },
      {
        id: "liquidity",
        icon: Droplets,
        title: "A fraction of the liquidity",
        short:
          "Because Praxis prices APY directly, a healthy market needs far less liquidity to run.",
        body: "Because Praxis prices APY directly instead of trading discounted principal, a healthy market needs far less liquidity to run — in some cases up to 40× lower than a comparable Pendle market (the exact figure varies with APY and duration).",
        visual: "liquidity",
        stat: "40×",
        statLabel: "less liquidity vs Pendle",
      },
      {
        id: "ux",
        icon: Sparkles,
        title: "UX for your users",
        short:
          "Give users readable APY forecasts, one-click downside protection, and upside plays.",
        body: "Give your users a reason to stay: readable APY forecasts, one-click downside protection, and upside plays — all native, on-chain, and easy to understand.",
        visual: "none",
      },
    ],
  },
  {
    id: "chains",
    label: "For chains",
    tagline: "Stickier users and more on-chain volume.",
    icon: Activity,
    accent: "positive",
    heading: "For chains",
    intro:
      "Every vault on your chain becomes a live market — a reason for users to stay and a continuous source of on-chain activity.",
    kind: "cards",
    cards: [
      {
        id: "ux",
        icon: Sparkles,
        title: "Better UX for your users",
        short:
          "Every vault gains readable APY forecasts, one-click hedges, and upside plays — a reason for users to stay on your chain.",
        body: "Every vault on your chain gains readable APY forecasts, one-click downside protection, and upside plays. That's a richer, stickier experience — a concrete reason for users to stay in your ecosystem.",
        visual: "ux",
        inline: true,
      },
      {
        id: "activity",
        icon: Activity,
        title: "Additional trading activity",
        short:
          "Every vault becomes a live, two-sided market — continuous, fee-generating on-chain volume.",
        body: "Every vault turns into a live, two-sided market. That's continuous, fee-generating trading volume and on-chain activity your ecosystem keeps — a new, native source of throughput.",
        visual: "activity",
        inline: true,
      },
    ],
  },
  {
    id: "differ",
    label: "How we're different",
    tagline: "Why this isn't just another Pendle.",
    icon: GitBranch,
    accent: "primary",
    heading: "How we're different",
    intro:
      "Praxis and Pendle both unlock yield markets, each with real strengths. Here's where each one shines.",
    kind: "comparison",
    cards: [],
  },
]

/** Lookup a segment by id. */
export function getSegment(id: SegmentId): Segment {
  return SEGMENTS.find((segment) => segment.id === id) ?? SEGMENTS[0]
}
