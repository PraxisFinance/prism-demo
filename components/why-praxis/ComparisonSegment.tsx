import type { CSSProperties } from "react"

import { Reveal } from "@/components/how-it-works/Reveal"
import { COMPETITORS, type Competitor } from "@/components/why-praxis/comparison"
import { cn } from "@/lib/utils"

function CompetitorPanel({
  competitor,
  delay,
}: {
  competitor: Competitor
  delay: number
}) {
  const highlight = Boolean(competitor.highlight)
  return (
    <Reveal delay={delay} className="h-full min-h-0">
      <div
        className={cn(
          "flex h-full flex-col gap-3 rounded-2xl p-5 ring-1",
          highlight ? "bg-primary/[0.04] ring-primary/30" : "bg-card ring-border"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-heading text-xl font-semibold",
              highlight ? "text-primary" : "text-foreground"
            )}
          >
            {competitor.name}
          </span>
          {highlight ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              us
            </span>
          ) : null}
        </div>

        <span className="text-sm text-pretty text-muted-foreground">
          {competitor.tagline}
        </span>

        <ul className="mt-1 flex flex-col gap-2">
          {competitor.strengths.map((strength) => (
            <li key={strength} className="flex items-start gap-2.5 text-sm text-foreground">
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  highlight ? "bg-primary" : "bg-muted-foreground/60"
                )}
              />
              <span className="text-pretty">{strength}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-0.5 border-t border-border pt-3">
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Best for
          </span>
          <span className="text-sm text-pretty text-foreground">
            {competitor.bestFor}
          </span>
        </div>
      </div>
    </Reveal>
  )
}

/**
 * "How we're different": balanced "where each shines" panels built from the
 * config-driven competitor data. Each protocol is described by its own genuine
 * strengths — no winner/loser framing. Fits the viewport with no scrolling.
 * See plan/10 §5.4.
 */
export function ComparisonSegment() {
  return (
    <div
      className="grid min-h-0 flex-1 grid-cols-1 items-center gap-4 p-0.5 lg:[grid-template-columns:repeat(var(--cmp-cols),minmax(0,1fr))]"
      style={{ "--cmp-cols": COMPETITORS.length } as CSSProperties}
    >
      {COMPETITORS.map((competitor, i) => (
        <CompetitorPanel
          key={competitor.id}
          competitor={competitor}
          delay={i * 100}
        />
      ))}
    </div>
  )
}
