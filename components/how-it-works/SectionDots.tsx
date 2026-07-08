"use client"

import { STEPS } from "@/components/how-it-works/steps"
import { cn } from "@/lib/utils"

interface SectionDotsProps {
  active: number
  onSelect: (index: number) => void
}

/**
 * Fixed vertical dot rail tracking the six numbered steps. Highlights the
 * active step and click-jumps to it. See plan/09 §3.
 */
export function SectionDots({ active, onSelect }: SectionDotsProps) {
  return (
    <nav
      aria-label="Steps"
      className="pointer-events-none absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {STEPS.map((step) => {
        const isActive = step.index === active
        return (
          <button
            key={step.index}
            type="button"
            onClick={() => onSelect(step.index)}
            aria-label={`Go to step ${step.index}: ${step.title}`}
            aria-current={isActive ? "step" : undefined}
            className="group pointer-events-auto flex items-center justify-end gap-2"
          >
            <span
              className={cn(
                "text-xs font-medium tabular-nums opacity-0 transition-opacity group-hover:opacity-100",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {String(step.index).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all",
                isActive
                  ? "size-3 bg-primary"
                  : "size-2 bg-border group-hover:bg-muted-foreground"
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
