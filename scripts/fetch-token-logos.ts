/**
 * Downloads a logo for every unique `asset` in data/vault-sources.ts from
 * DeFiLlama's public icon CDN and writes:
 *   - public/logos/tokens/{slug}.{ext}   (the image itself)
 *   - data/token-logos.json              (asset -> public path manifest)
 *
 * Run manually whenever a vault on a new asset is added:
 *   npm run logos:tokens
 *
 * This is the ONLY place that's allowed to write data/token-logos.json —
 * don't hand-edit it, re-run the script instead. Mirrors the
 * scripts/fetch-protocol-logos.ts pattern (same CDN vendor, same
 * "try a few likely slugs" approach, same on-demand-server/read-Content-Type
 * quirk as protocol icons — see that file for details).
 *
 * Unlike protocols/chains, DeFiLlama has no clean "asset -> icon slug"
 * mapping (tokens are indexed under the same /icons/protocols/ endpoint,
 * but under each token's own DeFiLlama project slug, e.g. USDC is
 * "usd-coin", sUSDe is "ethena-usde" — not derivable from the symbol
 * alone). SLUG_ALIASES below were resolved by hand, one at a time, against
 * https://icons.llamao.fi/icons/protocols/{slug} — verify the same way
 * before adding a new asset. Assets with no known slug fall back to
 * initials in the UI (see lib/token-logos.ts) — that's expected, not a bug.
 *
 * Note: this is independent of the hand-placed public/logos/tokens/usdc.svg
 * used elsewhere — this script's own USDC icon lands at
 * public/logos/tokens/usdc.{ext} (from the fetched file's extension), so it
 * will NOT overwrite that hand-placed .svg.
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { VAULT_SOURCES } from "../data/vault-sources"

const ICON_BASE = "https://icons.llamao.fi/icons/protocols/"
const ICON_QUERY = "?w=128&h=128"

const CONTENT_TYPE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
}

/** Hand-resolved DeFiLlama icon slugs per asset symbol (see file header). */
const SLUG_ALIASES: Record<string, string[]> = {
  USYC: ["circle-usyc"],
  SLISBNB: ["slisbnb", "lista-dao"],
  USDC: ["usd-coin", "circle-usdc"],
  SAVAX: ["benqi-staked-avax"],
  SAVUSD: ["avant-protocol"],
  USDM: ["mountain-protocol"],
  SUSDE: ["ethena-usde"],
  USDY: ["ondo-finance"],
  VBETH: ["yearn-finance"],
  // RWAUSDI has no known DeFiLlama icon slug — falls back to initials.
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function candidateSlugs(asset: string): string[] {
  const fallback = slugify(asset)
  const aliases = SLUG_ALIASES[asset] ?? []
  return [...new Set([...aliases, fallback])]
}

async function findIcon(asset: string): Promise<{ url: string; ext: string; buffer: Buffer } | null> {
  for (const slug of candidateSlugs(asset)) {
    const url = `${ICON_BASE}${slug}${ICON_QUERY}`
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const contentType = res.headers.get("content-type")?.split(";")[0].trim()
      const ext = (contentType && CONTENT_TYPE_EXT[contentType]) || "png"
      const buffer = Buffer.from(await res.arrayBuffer())
      return { url, ext, buffer }
    } catch {
      // try next candidate
    }
  }
  return null
}

async function main() {
  const assets = [...new Set(VAULT_SOURCES.map((s) => s.asset))].sort()

  const outDir = path.join(__dirname, "../public/logos/tokens")
  await mkdir(outDir, { recursive: true })

  const manifest: Record<string, string> = {}

  for (const asset of assets) {
    console.log(`Fetching icon for ${asset}…`)
    const found = await findIcon(asset)
    if (!found) {
      console.warn(`  WARNING: no icon found for asset "${asset}" — UI will fall back to initials.`)
      continue
    }

    const filename = `${slugify(asset)}.${found.ext}`
    await writeFile(path.join(outDir, filename), found.buffer)

    manifest[asset] = `/logos/tokens/${filename}`
    console.log(`  OK: ${found.url} -> public/logos/tokens/${filename}`)
  }

  const manifestPath = path.join(__dirname, "../data/token-logos.json")
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  console.log(
    `\nWrote ${manifestPath} (${Object.keys(manifest).length}/${assets.length} assets resolved).`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
