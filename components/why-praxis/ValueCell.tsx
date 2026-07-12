"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Reveal } from "@/components/how-it-works/Reveal"
import {
  ACCENT_CLASSES,
  type SegmentAccent,
  type ValueCard,
} from "@/components/why-praxis/segments"
import {
  hasVisual,
  SegmentVisual,
} from "@/components/why-praxis/visuals/SegmentVisual"
import { cn } from "@/lib/utils"

interface ValueCellProps {
  card: ValueCard
  /** Segment accent, used when the card has no override. */
  segmentAccent: SegmentAccent
  /** Stagger delay for the entrance reveal (ms). */
  delay?: number
  /** Extra classes for layout (e.g. col-span in the adaptive grid). */
  className?: string
}

/**
 * One value point in a segment's adaptive grid. Uniform template: icon+title
 * header, a body (text, stat, or inline motif), and an "Explore" affordance
 * that opens a dialog with the full copy + visual. See plan/10.
 */
export function ValueCell({
  card,
  segmentAccent,
  delay = 0,
  className,
}: ValueCellProps) {
  const [open, setOpen] = useState(false)
  const accent = ACCENT_CLASSES[card.accent ?? segmentAccent]
  const Icon = card.icon
  const showVisual = hasVisual(card.visual)
  const showInline = Boolean(card.inline) && showVisual && !card.stat

  return (
    <Reveal delay={delay} className={cn("h-full min-h-0", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={cn(
          "group flex h-full w-full flex-col items-start gap-3 overflow-hidden rounded-2xl bg-card p-5 text-left ring-1 ring-border transition-all sm:p-6",
          "hover:-translate-y-0.5 hover:ring-2 motion-reduce:hover:translate-y-0",
          accent.hoverRing
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
              accent.chip
            )}
          >
            <Icon className="size-5" />
          </span>
          <h3 className="font-heading text-lg font-medium text-foreground">
            {card.title}
          </h3>
        </div>

        {card.stat ? (
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-heading text-5xl font-bold tabular-nums",
                accent.text
              )}
            >
              {card.stat}
            </span>
            {card.statLabel ? (
              <span className="text-sm text-muted-foreground">
                {card.statLabel}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="line-clamp-3 text-sm text-pretty text-muted-foreground">
            {card.short}
          </p>
        )}

        {showInline ? (
          <div className="w-full pt-1">
            <SegmentVisual visual={card.visual} bare />
          </div>
        ) : null}

        <span
          className={cn(
            "mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium",
            accent.text
          )}
        >
          <Plus className="size-4" />
          Explore
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl ring-1 ring-inset",
                  accent.chip
                )}
              >
                <Icon className="size-5" />
              </span>
              <DialogTitle className="text-lg">{card.title}</DialogTitle>
            </div>
            <DialogDescription className="text-base text-pretty">
              {card.body}
            </DialogDescription>
          </DialogHeader>

          {showVisual ? (
            <div className="mt-1">
              <SegmentVisual visual={card.visual} interactive />
            </div>
          ) : null}

          {card.link ? (
            <div className="mt-1">
              <Link
                href={card.link.href}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                {card.link.label}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Reveal>
  )
}
