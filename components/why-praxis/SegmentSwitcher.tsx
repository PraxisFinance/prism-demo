"use client"

import {
  ACCENT_CLASSES,
  SEGMENTS,
  type SegmentId,
} from "@/components/why-praxis/segments"
import { cn } from "@/lib/utils"

interface SegmentSwitcherProps {
  active: SegmentId
  onSelect: (id: SegmentId) => void
}

/** Horizontal pill switcher between segments (scrolls on mobile). See plan/10. */
export function SegmentSwitcher({ active, onSelect }: SegmentSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Choose an audience"
      className="flex gap-2 overflow-x-auto py-1"
    >
      {SEGMENTS.map((segment) => {
        const isActive = segment.id === active
        const accent = ACCENT_CLASSES[segment.accent]
        const Icon = segment.icon
        return (
          <button
            key={segment.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(segment.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap ring-1 transition-colors",
              isActive
                ? cn(accent.chip)
                : "bg-transparent text-muted-foreground ring-border hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {segment.label}
          </button>
        )
      })}
    </div>
  )
}
