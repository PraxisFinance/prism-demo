import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface DiagramFrameProps {
  children: ReactNode
  caption?: ReactNode
  className?: string
}

/** Shared surface for step infographics — a soft card with an optional caption. */
export function DiagramFrame({
  children,
  caption,
  className,
}: DiagramFrameProps) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8",
        className
      )}
    >
      <div className="flex flex-1 items-center justify-center">{children}</div>
      {caption ? (
        <figcaption className="text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
