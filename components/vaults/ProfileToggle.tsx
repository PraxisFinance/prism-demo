"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { PROFILE_CLASSES, RISK_PROFILES, type RiskProfile } from "@/lib/profiles"

interface ProfileToggleProps {
  value: RiskProfile
  onValueChange: (profile: RiskProfile) => void
  className?: string
  disabled?: boolean
}

/**
 * Single-select Stable/Standard/Elevated switch. Reused on Vault Details
 * (06) and inside the Deposit/Withdraw modal (07); both read/write the same
 * `uiStore.selectedProfile` once that store exists (04).
 */
export function ProfileToggle({
  value,
  onValueChange,
  className,
  disabled,
}: ProfileToggleProps) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        const nextProfile = next[0] as RiskProfile | undefined
        if (nextProfile) onValueChange(nextProfile)
      }}
      disabled={disabled}
      className={cn("rounded-xl bg-muted p-1", className)}
    >
      {RISK_PROFILES.map((profile) => (
        <ToggleGroupItem
          key={profile.id}
          value={profile.id}
          aria-label={profile.label}
          className={cn(
            "rounded-lg px-4 font-medium text-muted-foreground data-pressed:bg-card data-pressed:shadow-sm",
            value === profile.id && PROFILE_CLASSES[profile.id].text
          )}
        >
          {profile.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
