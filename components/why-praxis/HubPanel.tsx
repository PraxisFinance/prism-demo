"use client"

import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/how-it-works/Reveal"
import { HubCard } from "@/components/why-praxis/HubCard"
import {
  HUB_COPY,
  SEGMENTS,
  type SegmentId,
} from "@/components/why-praxis/segments"

interface HubPanelProps {
  onSelect: (id: SegmentId) => void
  onCta: () => void
}

/** The title screen: hero + 4 choice cards + a subtle CTA. See plan/10 §3. */
export function HubPanel({ onSelect, onCta }: HubPanelProps) {
  return (
    <section
      aria-labelledby="why-hub-title"
      className="flex h-full flex-col justify-center gap-5 py-6"
    >
      <div className="flex shrink-0 flex-col gap-3">
        <Reveal>
          <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {HUB_COPY.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h1
            id="why-hub-title"
            className="max-w-3xl font-heading text-3xl font-medium text-balance text-foreground sm:text-4xl"
          >
            {HUB_COPY.title}
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="max-w-2xl text-base text-pretty text-muted-foreground lg:text-lg">
            {HUB_COPY.subtitle}
          </p>
        </Reveal>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-0.5 [grid-auto-rows:minmax(0,1fr)] sm:grid-cols-2">
        {SEGMENTS.map((segment, i) => (
          <HubCard
            key={segment.id}
            segment={segment}
            onSelect={() => onSelect(segment.id)}
            delay={240 + i * 80}
          />
        ))}
      </div>

      <Reveal delay={560} className="shrink-0">
        <button
          type="button"
          onClick={onCta}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Interested? Let&apos;s talk
          <ArrowRight className="size-4" />
        </button>
      </Reveal>
    </section>
  )
}
