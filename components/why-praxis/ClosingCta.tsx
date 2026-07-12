"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Reveal } from "@/components/how-it-works/Reveal"
import {
  CHANNELS,
  FOUNDERS,
  type Founder,
  type SocialLink,
} from "@/components/why-praxis/contact"
import { CTA_COPY } from "@/components/why-praxis/segments"
import { cn } from "@/lib/utils"

interface ClosingCtaProps {
  onBack: () => void
}

function SocialButton({ link, size = "md" }: { link: SocialLink; size?: "sm" | "md" }) {
  const { Icon } = link
  return (
    <Link
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      className={cn(
        "flex items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground hover:ring-primary/40",
        size === "md" ? "size-10" : "size-8"
      )}
    >
      <Icon className={size === "md" ? "size-[18px]" : "size-4"} />
    </Link>
  )
}

function FounderCard({ founder }: { founder: Founder }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-card p-4 ring-1 ring-border sm:p-5">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-semibold text-primary">
        {founder.initials}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-heading text-base font-medium text-foreground">
          {founder.name}
        </span>
        <span className="text-sm font-medium text-primary">{founder.role}</span>
        <span className="text-sm text-pretty text-muted-foreground">
          {founder.bio}
        </span>
        <div className="mt-1 flex gap-2">
          {founder.links.map((link) => (
            <SocialButton key={link.id} link={link} size="sm" />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Closing "Let's talk" view: contact CTA + community + founders. See plan/10. */
export function ClosingCta({ onBack }: ClosingCtaProps) {
  return (
    <section
      aria-labelledby="why-cta-title"
      className="flex h-full flex-col justify-center gap-6 py-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Hub
      </button>

      <div className="grid flex-1 items-center gap-8 lg:grid-cols-2">
        {/* Left: pitch + primary CTA + community */}
        <div className="flex flex-col items-start gap-5">
          <Reveal>
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {CTA_COPY.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2
              id="why-cta-title"
              className="font-heading text-4xl font-medium text-balance text-foreground sm:text-5xl"
            >
              {CTA_COPY.title}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-lg text-pretty text-muted-foreground">
              {CTA_COPY.subtitle}
            </p>
          </Reveal>

          <Reveal delay={200} className="w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Join the community
              </span>
              <div className="flex gap-2">
                {CHANNELS.map((link) => (
                  <SocialButton key={link.id} link={link} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: founders */}
        <Reveal delay={160} className="w-full">
          <div className="flex flex-col gap-3">
            {FOUNDERS.map((founder) => (
              <FounderCard key={founder.name} founder={founder} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
