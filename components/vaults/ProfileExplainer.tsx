"use client"

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { PROFILE_CLASSES, RISK_PROFILES, type RiskProfile } from "@/lib/profiles"
import type { Vault } from "@/types"

/**
 * Newcomer-first hover/tap explainer body for the Standard/Stable/Elevated
 * picker. Combines two things (per the B+C design decision):
 *
 *  1. A tiny *comparative* settlement sketch — all three schematic curves
 *     drawn at once, with the hovered profile highlighted and drawn-in once
 *     on open, so the difference reads at a glance (Stable rises then flat,
 *     Standard flat, Elevated stays low then shoots up).
 *  2. Two plain-English "if yields fall / if yields rise" outcome chips,
 *     backed by the *real* per-vault numbers (target/boundary/spot APY) when
 *     a `vault` is provided — no PT/YT jargon.
 *
 * The curves are deliberately illustrative (schematic shapes), not derived
 * from lib/prism settlement math; only the copy's numbers are live.
 */

/**
 * Schematic (not-to-scale) settlement shapes over rising realized APY (x),
 * honoring the whitepaper relations with t = target (at the horizontal
 * middle, svg x=60) and buffer boundary a = t - b (svg x=46):
 *  - all three share the origin (x=0 -> everyone earns 0) and cross again at
 *    the target point (t, t) = svg (60,30);
 *  - Standard(x) = x, the plain y=x diagonal;
 *  - Stable(x) > Standard for x < t, then flat at the target height for
 *    x >= a (protected/capped), touching the diagonal at x=t;
 *  - Elevated(x) < Standard for x < t and > Standard for x > t (convex),
 *    the conservation mirror of Stable.
 */
const EXPLAINER_CURVES: Record<RiskProfile, string> = {
  // above the diagonal, then flat at the target floor from the buffer boundary on
  stable: "M6,50 C22,44 34,30 46,30 L114,30",
  // a plain deposit earns the realized APY itself — straight y = x line
  standard: "M6,50 L114,10",
  // below the diagonal for x<t (gentle convex sag), then a straight, steeper
  // slope-2 line above the target — diverging above Standard, never flattening
  elevated: "M6,50 C34,49 52,34 60,30 L114,2",
}

const pct = (value: number) => `${value.toFixed(1)}%`

interface Scenario {
  label: string
  outcome: string
}

interface Explainer {
  tagline: string
  down: Scenario
  up: Scenario
}

function getExplainer(profile: RiskProfile, vault?: Vault): Explainer {
  const target = vault ? `~${pct(vault.market.targetApy)}` : "the target APY"
  const boundary = vault ? pct(vault.market.boundaryApy) : "the buffer"
  const spot = vault ? `~${pct(vault.currentApy)}` : "the vault's APY"

  switch (profile) {
    case "stable":
      return {
        tagline: `Plays it safe — trades away extra upside for a protected floor.`,
        down: { label: "If yields fall", outcome: `Still earns ${target} (protected down to ${boundary})` },
        up: { label: "If yields rise", outcome: `Stays near ${target} — the gains are capped` },
      }
    case "standard":
      return {
        tagline: `A plain deposit at ${spot} — no market bet, no protection, no cap.`,
        down: { label: "If yields fall", outcome: "You simply follow the vault down" },
        up: { label: "If yields rise", outcome: "You simply follow the vault up" },
      }
    case "elevated":
      return {
        tagline: `Goes for the upside — bigger gains when yields beat the target.`,
        down: { label: "If yields fall", outcome: "You earn less — as low as 0%" },
        up: { label: "If yields rise", outcome: `You earn more with no cap — everything above ${target}` },
      }
  }
}

function ComparativeCurve({ profile }: { profile: RiskProfile }) {
  // Render the two non-active curves first so the highlighted one sits on top.
  const ordered = [
    ...RISK_PROFILES.filter((meta) => meta.id !== profile),
    ...RISK_PROFILES.filter((meta) => meta.id === profile),
  ]

  return (
    <svg viewBox="0 0 120 56" className="h-12 w-full" aria-hidden="true">
      {ordered.map((meta) => {
        const active = meta.id === profile
        return (
          <path
            key={meta.id}
            d={EXPLAINER_CURVES[meta.id]}
            fill="none"
            strokeWidth={active ? 3 : 2}
            strokeLinecap="round"
            pathLength={active ? 100 : undefined}
            className={cn(
              "stroke-current",
              active
                ? cn("profile-curve profile-curve-draw", PROFILE_CLASSES[meta.id].text)
                : "text-foreground/20"
            )}
          />
        )
      })}
    </svg>
  )
}

function ScenarioRow({ scenario, direction }: { scenario: Scenario; direction: "up" | "down" }) {
  const Icon = direction === "up" ? TrendingUpIcon : TrendingDownIcon
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-foreground/70" aria-hidden="true" />
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-wide text-foreground/50">
          {scenario.label}
        </span>
        <span className="text-xs text-foreground">{scenario.outcome}</span>
      </div>
    </div>
  )
}

/**
 * Inner body for a tooltip explaining a single deposit type. Meant to be
 * dropped inside `TooltipContent` (which supplies the light surface + arrow).
 */
export function ProfileExplainerContent({
  profile,
  vault,
}: {
  profile: RiskProfile
  vault?: Vault
}) {
  const explainer = getExplainer(profile, vault)

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs text-foreground/80">{explainer.tagline}</p>
      <ComparativeCurve profile={profile} />
      <div className="flex items-center justify-between text-[9px] font-medium uppercase tracking-wide text-foreground/40">
        <span>Lower APY</span>
        <span>Higher APY</span>
      </div>
      <div className="flex flex-col gap-2 border-t border-foreground/15 pt-2.5">
        <ScenarioRow scenario={explainer.down} direction="down" />
        <ScenarioRow scenario={explainer.up} direction="up" />
      </div>
    </div>
  )
}
