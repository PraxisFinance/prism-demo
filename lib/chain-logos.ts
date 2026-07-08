import chainLogos from "@/data/chain-logos.json"

/** Populated by `npm run logos:chains` (scripts/fetch-chain-logos.ts) — falls back to initials for any chain not yet in the manifest. Shared by VaultTable and the deposit modal's network row. */
export function chainLogoSrc(chainLabel: string): string | undefined {
  return (chainLogos as Record<string, string>)[chainLabel]
}
