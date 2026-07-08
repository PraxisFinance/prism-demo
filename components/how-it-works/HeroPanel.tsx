"use client"

import { ChevronDown } from "lucide-react"

import { Reveal } from "@/components/how-it-works/Reveal"

interface HeroPanelProps {
  onStart: () => void
}

/** Intro panel before the six steps: title, one-liner, scroll hint. */
export function HeroPanel({ onStart }: HeroPanelProps) {
  return (
    <section
      aria-labelledby="hiw-hero-title"
      className="relative flex min-h-full snap-start snap-always items-center overflow-hidden"
    >
      {/* Soft prism-tinted backdrop accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 15% 20%, color-mix(in oklch, var(--profile-stable) 18%, transparent), transparent), radial-gradient(55% 55% at 85% 80%, color-mix(in oklch, var(--profile-elevated) 16%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6">
        <Reveal>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            How Praxis Prism works
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h1
            id="hiw-hero-title"
            className="max-w-3xl font-heading text-4xl font-medium text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            Turn a vault&apos;s variable APY into two tradable sides.
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
            And read the market&apos;s forecast straight off the price. Six
            steps, from deposit to settlement.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <button
            type="button"
            onClick={onStart}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Scroll to begin</span>
            <ChevronDown className="size-4 motion-safe:animate-bounce" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}
