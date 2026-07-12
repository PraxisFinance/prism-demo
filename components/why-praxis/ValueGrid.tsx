import type { SegmentAccent, ValueCard } from "@/components/why-praxis/segments"
import { ValueCell } from "@/components/why-praxis/ValueCell"
import { cn } from "@/lib/utils"

interface ValueGridProps {
  cards: ValueCard[]
  segmentAccent: SegmentAccent
}

/**
 * Adaptive "split" grid (plan/10): 4→2×2, 3→2 + 1-wide, 2→side-by-side halves.
 * Collapses to a single stacked column below `lg`.
 */
export function ValueGrid({ cards, segmentAccent }: ValueGridProps) {
  const count = cards.length
  // 3+ cards fill the viewport height; 1–2 sit at a natural height, centered,
  // so they don't stretch into oversized panels.
  const fill = count >= 3

  return (
    <div
      className={cn(
        "grid min-h-0 w-full flex-1 grid-cols-1 gap-4 p-0.5 lg:grid-cols-2",
        fill ? "[grid-auto-rows:minmax(0,1fr)]" : "content-center"
      )}
    >
      {cards.map((card, i) => {
        // With 3 cards, the last one spans both columns for a "2 + 1-wide" row.
        const wide = count === 3 && i === 2
        return (
          <ValueCell
            key={card.id}
            card={card}
            segmentAccent={segmentAccent}
            delay={i * 80}
            className={cn(wide && "lg:col-span-2")}
          />
        )
      })}
    </div>
  )
}
