"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProfileExplainerContent } from "@/components/vaults/ProfileExplainer"
import { cn } from "@/lib/utils"
import { PROFILE_CLASSES, RISK_PROFILES, type RiskProfile } from "@/lib/profiles"
import type { Vault } from "@/types"

interface ProfileToggleProps {
  value: RiskProfile
  onValueChange: (profile: RiskProfile) => void
  className?: string
  disabled?: boolean
  /** When provided, the hover/tap explainer shows this vault's live APY numbers. */
  vault?: Vault
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
  vault,
}: ProfileToggleProps) {
  return (
    <TooltipProvider delay={250} closeDelay={0}>
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
          <Tooltip key={profile.id}>
            <TooltipTrigger
              render={
                <ToggleGroupItem
                  value={profile.id}
                  aria-label={profile.label}
                  className={cn(
                    "rounded-lg px-4 font-medium text-muted-foreground data-pressed:bg-card data-pressed:shadow-sm",
                    value === profile.id && PROFILE_CLASSES[profile.id].text
                  )}
                >
                  {profile.label}
                </ToggleGroupItem>
              }
            />
            <TooltipContent
              side="top"
              className="flex w-60 max-w-none flex-col items-stretch gap-0 p-3 text-left"
            >
              <ProfileExplainerContent profile={profile.id} vault={vault} />
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  )
}
