import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getProfileMeta, PROFILE_CLASSES, type RiskProfile } from "@/lib/profiles"

interface ProfileBadgeProps {
  profile: RiskProfile
  className?: string
}

export function ProfileBadge({ profile, className }: ProfileBadgeProps) {
  const meta = getProfileMeta(profile)
  const classes = PROFILE_CLASSES[profile]

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 bg-transparent", classes.border, classes.text, className)}
    >
      <span className={cn("size-1.5 rounded-full", classes.bg)} aria-hidden="true" />
      {meta.label}
    </Badge>
  )
}
