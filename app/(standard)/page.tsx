"use client"

import { useState } from "react"

import { PercentDelta } from "@/components/common/PercentDelta"
import { StatCard } from "@/components/common/StatCard"
import { ProfileBadge } from "@/components/vaults/ProfileBadge"
import { ProfileToggle } from "@/components/vaults/ProfileToggle"
import { DEFAULT_RISK_PROFILE, type RiskProfile } from "@/lib/profiles"

/**
 * Temporary placeholder. plan/05-vault-list.md replaces this with the real
 * /vaults screen (and this route becomes a redirect per plan/01 §5).
 */
export default function Home() {
  const [profile, setProfile] = useState<RiskProfile>(DEFAULT_RISK_PROFILE)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-medium text-foreground">
          Design system preview
        </h1>
        <p className="text-sm text-muted-foreground">
          Vaults, Vault Details, and Portfolio screens land in plan/05&ndash;08.
          This page previews the shared tokens and primitives from
          plan/03-design-system-and-figma.md.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ProfileToggle value={profile} onValueChange={setProfile} />
        <ProfileBadge profile={profile} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Deposits" value="$326.54M" />
        <StatCard label="Liquidity" value="$161.42M" />
        <StatCard
          label="Current APY"
          value="4.45%"
          delta={<PercentDelta value={0.32} />}
        />
        <StatCard
          label="Predicted APY"
          value="5.31%"
          delta={<PercentDelta value={0.86} />}
        />
      </div>
    </div>
  )
}
