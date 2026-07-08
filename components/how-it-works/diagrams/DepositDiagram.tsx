/* eslint-disable @next/next/no-img-element */
import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"

const TOKENS = [
  { src: "/logos/tokens/usdc.svg", alt: "USDC" },
  { src: "/logos/tokens/usdt.svg", alt: "USDT" },
  { src: "/logos/tokens/dai.svg", alt: "DAI" },
  { src: "/logos/tokens/eth.svg", alt: "ETH" },
]

const VAULTS = [
  { src: "/logos/protocols/aave.webp", alt: "Aave" },
  { src: "/logos/protocols/morpho.webp", alt: "Morpho" },
  { src: "/logos/protocols/yearn-finance.webp", alt: "Yearn" },
]

/** Step 1: any token, into any supported vault — one stream of variable yield. */
export function DepositDiagram() {
  return (
    <DiagramFrame caption="Any token, into any supported vault — one stream of variable yield.">
      <div className="flex w-full flex-col items-center gap-5 py-4 sm:flex-row sm:justify-center sm:gap-6">
        {/* Tokens */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex -space-x-3">
            {TOKENS.map((token) => (
              <img
                key={token.alt}
                src={token.src}
                alt={token.alt}
                width={40}
                height={40}
                className="size-10 rounded-full bg-card ring-2 ring-card"
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-foreground">Tokens</span>
            <span className="text-xs text-muted-foreground">any asset</span>
          </div>
        </div>

        {/* Flow connector */}
        <svg
          viewBox="0 0 120 24"
          className="h-6 w-24 rotate-90 text-primary sm:rotate-0"
          fill="none"
          aria-hidden
        >
          <line
            x1="4"
            y1="12"
            x2="104"
            y2="12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="prism-beam prism-beam-flow opacity-60"
          />
          <path
            d="M104 6 L116 12 L104 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Vaults */}
        <div className="flex flex-col items-center gap-3 rounded-xl bg-primary/5 px-5 py-4 ring-1 ring-primary/20">
          <div className="flex -space-x-2">
            {VAULTS.map((vault) => (
              <img
                key={vault.alt}
                src={vault.src}
                alt={vault.alt}
                width={36}
                height={36}
                className="size-9 rounded-full bg-card object-contain p-0.5 ring-2 ring-card"
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-foreground">Vaults</span>
            <span className="text-xs text-muted-foreground">
              Aave &middot; Morpho &middot; Yearn &amp; more
            </span>
          </div>
        </div>
      </div>
    </DiagramFrame>
  )
}
