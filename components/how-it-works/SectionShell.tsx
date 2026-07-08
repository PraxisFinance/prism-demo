import type { ReactNode } from "react"

import { Reveal } from "@/components/how-it-works/Reveal"
import { TOTAL_STEPS } from "@/components/how-it-works/steps"
import { cn } from "@/lib/utils"

interface SectionShellProps {
  index: number
  title: string
  lead: string
  detail?: string
  /** Tailwind color class for the oversized ghost numeral. */
  ghostClassName?: string
  /** When true, copy sits on the right and the infographic on the left. */
  reverse?: boolean
  /** The step's infographic. */
  children: ReactNode
}

/**
 * One full-viewport step: oversized ghost numeral + copy on one side, the
 * infographic on the other, alternating per step. Scroll-snaps to the top.
 * See plan/09 §4.
 */
export function SectionShell({
  index,
  title,
  lead,
  detail,
  ghostClassName = "text-primary/[0.08]",
  reverse = false,
  children,
}: SectionShellProps) {
  const id = `step-${index}`
  const counter = `${String(index).padStart(2, "0")} / ${String(
    TOTAL_STEPS
  ).padStart(2, "0")}`

  return (
    <section
      id={id}
      data-step={index}
      aria-labelledby={`${id}-title`}
      className="flex min-h-full snap-start snap-always items-center py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Copy column */}
        <div
          className={cn(
            "relative order-2 flex flex-col justify-center",
            reverse ? "lg:order-2" : "lg:order-1"
          )}
        >
          <Reveal className="pointer-events-none select-none">
            <span
              aria-hidden
              className={cn(
                "font-heading text-[7rem] leading-none font-bold sm:text-[9rem] lg:text-[11rem]",
                ghostClassName
              )}
            >
              {String(index).padStart(2, "0")}
            </span>
          </Reveal>

          <div className="relative -mt-6 flex flex-col gap-4 sm:-mt-10 lg:-mt-16">
            <Reveal delay={80}>
              <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                {counter}
              </span>
            </Reveal>
            <Reveal delay={140}>
              <h2
                id={`${id}-title`}
                className="font-heading text-3xl font-medium text-balance text-foreground lg:text-4xl"
              >
                {title}
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="max-w-prose text-lg text-pretty text-muted-foreground">
                {lead}
              </p>
            </Reveal>
            {detail ? (
              <Reveal delay={260}>
                <p className="max-w-prose text-sm text-pretty text-muted-foreground/70">
                  {detail}
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>

        {/* Infographic column */}
        <div
          className={cn(
            "order-1 flex items-center justify-center",
            reverse ? "lg:order-1" : "lg:order-2"
          )}
        >
          <Reveal delay={120} className="w-full">
            {children}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
