import protocolLogos from "@/data/protocol-logos.json"

/** Populated by `npm run logos:protocols` (scripts/fetch-protocol-logos.ts) — falls back to initials for any protocol not yet in the manifest. Shared by VaultTable and the deposit/withdraw modal header. */
export function protocolLogoSrc(protocol: string): string | undefined {
  return (protocolLogos as Record<string, string>)[protocol]
}
