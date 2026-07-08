"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { PROFILE_CLASSES, RISK_PROFILES, type RiskProfile } from "@/lib/profiles"

interface ProfileCardSelectorProps {
  value: RiskProfile
  onValueChange: (profile: RiskProfile) => void
  className?: string
  disabled?: boolean
}

/**
 * Standard/Stable/Elevated deposit-type picker as 3 square cards, each with
 * a small illustrative curve icon (same shape every time per category —
 * purely decorative, not derived from real settlement math, per user
 * decision; see CURVE_PATHS below for the per-profile amplitude). Sibling
 * to `ProfileToggle` (the compact pill), not a replacement of it — both
 * read/write the same `uiStore.selectedProfile`.
 *
 * The curve "draws" left-to-right (stroke-dasharray/-offset, same
 * technique as the How-it-works page's `.prism-beam-flow`) exactly once
 * per actual selection change — clicking the already-selected card again
 * does not replay it — and respects `prefers-reduced-motion` (shows the
 * final drawn state instantly).
 */
export function ProfileCardSelector({
  value,
  onValueChange,
  className,
  disabled,
}: ProfileCardSelectorProps) {
  const [animateGeneration, setAnimateGeneration] = useState<Record<RiskProfile, number>>({
    stable: 0,
    standard: 0,
    elevated: 0,
  })
  const previousValue = useRef(value)

  useEffect(() => {
    if (previousValue.current !== value) {
      setAnimateGeneration((prev) => ({ ...prev, [value]: prev[value] + 1 }))
      previousValue.current = value
    }
  }, [value])

  return (
    <div
      role="radiogroup"
      aria-label="Deposit type"
      className={cn("grid w-full max-w-md grid-cols-3 gap-2", className)}
    >
      {RISK_PROFILES.map((profile) => {
        const selected = value === profile.id
        return (
          <button
            key={profile.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={profile.label}
            disabled={disabled}
            onClick={() => onValueChange(profile.id)}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border bg-card p-2 transition-colors disabled:pointer-events-none disabled:opacity-50",
              selected ? SELECTED_CLASSES[profile.id] : "border-border hover:bg-muted/50"
            )}
          >
            <ProfileCurveIcon
              profile={profile.id}
              selected={selected}
              animationKey={animateGeneration[profile.id]}
            />
            <span
              className={cn(
                "text-sm font-medium",
                selected ? PROFILE_CLASSES[profile.id].text : "text-muted-foreground"
              )}
            >
              {profile.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Literal per-profile strings so Tailwind's static scanner picks up the opacity-modified utilities. */
const SELECTED_CLASSES: Record<RiskProfile, string> = {
  stable: "border-profile-stable bg-profile-stable/5",
  standard: "border-profile-standard bg-profile-standard/5",
  elevated: "border-profile-elevated bg-profile-elevated/5",
}

/**
 * Illustrative curve per deposit type, same "hill and trough" bezier
 * rhythm (same period/phase) for all three so they read as one visual
 * family — only the amplitude changes, symmetric peak/trough per profile:
 *  - stable:   smallest amplitude, near-flat.
 *  - standard: medium amplitude, a plain sine wave.
 *  - elevated: largest amplitude — the highest highs AND the lowest lows
 *    (more volatile in both directions than standard, matching the real
 *    mechanism: Elevated absorbs the downside deficit but captures all
 *    the upside, so it swings harder both ways, not just up).
 */
const CURVE_PATHS: Record<RiskProfile, string> = {
  stable: "M0,28 C10,24 20,24 30,28 C40,32 50,32 60,28 C70,24 80,24 90,28 C100,32 110,32 120,28",
  standard: "M0,28 C10,14 20,14 30,28 C40,42 50,42 60,28 C70,14 80,14 90,28 C100,42 110,42 120,28",
  elevated: "M0,28 C10,5 20,5 30,28 C40,51 50,51 60,28 C70,5 80,5 90,28 C100,51 110,51 120,28",
}

function ProfileCurveIcon({
  profile,
  selected,
  animationKey,
}: {
  profile: RiskProfile
  selected: boolean
  animationKey: number
}) {
  return (
    <svg viewBox="0 0 120 56" className="h-auto w-full max-w-16" aria-hidden="true">
      <path
        key={animationKey}
        d={CURVE_PATHS[profile]}
        fill="none"
        pathLength={100}
        strokeWidth={4}
        strokeLinecap="round"
        className={cn(
          "profile-curve stroke-current",
          PROFILE_CLASSES[profile].text,
          selected ? "opacity-100" : "opacity-35",
          animationKey > 0 && "profile-curve-draw"
        )}
      />
    </svg>
  )
}
