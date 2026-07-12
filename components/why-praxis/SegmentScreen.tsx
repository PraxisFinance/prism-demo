"use client"

import { ArrowLeft, MessageCircle } from "lucide-react"

import { Reveal } from "@/components/how-it-works/Reveal"
import { ComparisonSegment } from "@/components/why-praxis/ComparisonSegment"
import { type Segment, type SegmentId } from "@/components/why-praxis/segments"
import { SegmentSwitcher } from "@/components/why-praxis/SegmentSwitcher"
import { ValueGrid } from "@/components/why-praxis/ValueGrid"

interface SegmentScreenProps {
  segment: Segment
  onSelectSegment: (id: SegmentId) => void
  onBack: () => void
  onCta: () => void
}

/**
 * A single segment view: top bar (back-to-hub + switcher + CTA), heading, and
 * either an adaptive value grid or the comparison layout. Fills the viewport
 * with no scrolling. See plan/10 §3.
 */
export function SegmentScreen({
  segment,
  onSelectSegment,
  onBack,
  onCta,
}: SegmentScreenProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 pt-6 pb-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Hub
        </button>
        <SegmentSwitcher active={segment.id} onSelect={onSelectSegment} />
        <button
          type="button"
          onClick={onCta}
          className="ml-auto hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <MessageCircle className="size-4" />
          Let&apos;s talk
        </button>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col gap-5 py-5">
        <div className="flex shrink-0 flex-col gap-2">
          <Reveal>
            <h2
              id={`why-${segment.id}-title`}
              className="font-heading text-2xl font-medium text-balance text-foreground lg:text-3xl"
            >
              {segment.heading}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-2xl text-base text-pretty text-muted-foreground">
              {segment.intro}
            </p>
          </Reveal>
        </div>

        {segment.kind === "comparison" ? (
          <ComparisonSegment />
        ) : (
          <ValueGrid cards={segment.cards} segmentAccent={segment.accent} />
        )}
      </div>
    </div>
  )
}
