"use client"

import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/how-it-works/Reveal"
import {
  ACCENT_CLASSES,
  type Segment,
} from "@/components/why-praxis/segments"
import { cn } from "@/lib/utils"

interface HubCardProps {
  segment: Segment
  onSelect: () => void
  delay?: number
}

/** One of the four hub choices. Opens its segment on click. See plan/10 §3. */
export function HubCard({ segment, onSelect, delay = 0 }: HubCardProps) {
  const accent = ACCENT_CLASSES[segment.accent]
  const Icon = segment.icon

  return (
    <Reveal delay={delay} className="h-full min-h-0">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "group relative flex h-full w-full flex-col items-start gap-3 overflow-hidden rounded-2xl bg-card p-5 text-left ring-1 ring-border transition-all sm:p-6",
          "hover:-translate-y-1 hover:ring-2 motion-reduce:hover:translate-y-0",
          accent.hoverRing
        )}
      >
        {/* Accent glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
          style={{ background: accent.glow }}
        />

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
              accent.chip
            )}
          >
            <Icon className="size-5" />
          </span>
          <h3 className="font-heading text-lg font-medium text-foreground">
            {segment.label}
          </h3>
        </div>

        <p className="line-clamp-2 text-sm text-pretty text-muted-foreground">
          {segment.tagline}
        </p>

        <span
          className={cn(
            "mt-auto inline-flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-0.5",
            accent.text
          )}
        >
          Explore
          <ArrowRight className="size-4" />
        </span>
      </button>
    </Reveal>
  )
}
