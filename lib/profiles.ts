/**
 * Single source of truth for the three deposit types' identity + styling.
 *
 * Figma only designs a Stable/Elevated pair of toggles inside the
 * Deposit/Withdraw panel (Standard = both off / baseline) — see
 * plan/figma-mapping.md. Colors are centralized here so
 * ProfileToggle/ProfileBadge/charts never hardcode a value.
 *
 * `RiskProfile` itself is defined in types/index.ts (the canonical domain
 * model, plan/04-mock-data-and-state.md); re-exported here for convenience.
 * The actual settlement math lives in lib/prism.ts + lib/market.ts — this
 * file only defines identity + styling, never APY math.
 */
import type { RiskProfile } from "@/types"

export type { RiskProfile }

export interface RiskProfileMeta {
  id: RiskProfile
  label: string
  description: string
  /** CSS custom property (defined in app/globals.css) backing this profile's color. */
  cssVar: `--profile-${RiskProfile}`
}

export const RISK_PROFILES: readonly RiskProfileMeta[] = [
  {
    id: "stable",
    label: "Stable",
    description: "Downside protection — earns the target APY unless realized APY falls far below it.",
    cssVar: "--profile-stable",
  },
  {
    id: "standard",
    label: "Standard",
    description: "Plain deposit at the vault's spot APY — no Prism market exposure.",
    cssVar: "--profile-standard",
  },
  {
    id: "elevated",
    label: "Elevated",
    description: "Upside exposure — captures the gains when realized APY runs above target.",
    cssVar: "--profile-elevated",
  },
] as const

export const DEFAULT_RISK_PROFILE: RiskProfile = "standard"

export function getProfileMeta(id: RiskProfile): RiskProfileMeta {
  return RISK_PROFILES.find((profile) => profile.id === id) ?? RISK_PROFILES[1]
}

/** Tailwind utility classes generated from the `--color-profile-*` theme tokens. */
export const PROFILE_CLASSES: Record<
  RiskProfile,
  { bg: string; text: string; border: string; ring: string }
> = {
  stable: {
    bg: "bg-profile-stable",
    text: "text-profile-stable",
    border: "border-profile-stable",
    ring: "ring-profile-stable",
  },
  standard: {
    bg: "bg-profile-standard",
    text: "text-profile-standard",
    border: "border-profile-standard",
    ring: "ring-profile-standard",
  },
  elevated: {
    bg: "bg-profile-elevated",
    text: "text-profile-elevated",
    border: "border-profile-elevated",
    ring: "ring-profile-elevated",
  },
}
