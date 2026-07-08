import tokenLogos from "@/data/token-logos.json"

/** Populated by `npm run logos:tokens` (scripts/fetch-token-logos.ts) — falls back to initials for any asset not yet in the manifest. Shared by the vault details header and (later) any other asset icon. */
export function tokenLogoSrc(asset: string): string | undefined {
  return (tokenLogos as Record<string, string>)[asset]
}
