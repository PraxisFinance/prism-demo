import { cn } from "@/lib/utils"

export type TokenVariant = "asset" | "pt" | "yt" | "stable" | "elevated"

/** CSS color for each token role (for SVG strokes/fills in the diagrams). */
export const TOKEN_COLOR: Record<TokenVariant, string> = {
  asset: "var(--foreground)",
  pt: "var(--muted-foreground)",
  yt: "var(--primary)",
  stable: "var(--profile-stable)",
  elevated: "var(--profile-elevated)",
}

const CHIP_CLASS: Record<TokenVariant, string> = {
  asset: "bg-card text-foreground ring-border",
  pt: "bg-muted text-muted-foreground ring-border",
  yt: "bg-primary/10 text-primary ring-primary/30",
  stable: "bg-profile-stable/10 text-profile-stable ring-profile-stable/30",
  elevated:
    "bg-profile-elevated/10 text-profile-elevated ring-profile-elevated/30",
}

interface TokenChipProps {
  variant: TokenVariant
  label: string
  sublabel?: string
  className?: string
}

/**
 * A labeled token pill (asset / PT / YT / Stable / Elevated) colored by role.
 * No external logos — pure brand/profile tokens. See plan/09 §5.
 */
export function TokenChip({
  variant,
  label,
  sublabel,
  className,
}: TokenChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset",
        CHIP_CLASS[variant],
        className
      )}
    >
      <span
        aria-hidden
        className="size-2 rounded-full bg-current opacity-70"
      />
      {label}
      {sublabel ? (
        <span className="text-xs font-normal opacity-70">{sublabel}</span>
      ) : null}
    </span>
  )
}
