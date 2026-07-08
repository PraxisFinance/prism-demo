import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/how-it-works/Reveal"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Closing panel: recap headline + primary CTA into the app. */
export function OutroPanel() {
  return (
    <section
      aria-labelledby="hiw-outro-title"
      className="flex min-h-full snap-start snap-always items-center"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <Reveal>
          <h2
            id="hiw-outro-title"
            className="font-heading text-3xl font-medium text-balance text-foreground lg:text-4xl"
          >
            See it live
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            Explore vaults and watch a live, market-based APY forecast in
            action.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <Link
            href="/vaults"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Explore Vaults
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
