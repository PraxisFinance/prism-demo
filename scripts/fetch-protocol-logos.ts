/**
 * Downloads a logo for every unique `protocol` in data/vault-sources.ts from
 * DeFiLlama's public icon CDN and writes:
 *   - public/logos/protocols/{slug}.{ext}   (the image itself)
 *   - data/protocol-logos.json              (protocol -> public path manifest)
 *
 * Run manually whenever a vault on a new protocol is added:
 *   npm run logos:protocols
 *
 * This is the ONLY place that's allowed to write data/protocol-logos.json —
 * don't hand-edit it, re-run the script instead. Mirrors the
 * scripts/fetch-chain-logos.ts pattern (see that file for why: same CDN
 * vendor, same "try a few likely slugs" approach).
 *
 * Unlike the chain icon endpoint, DeFiLlama's protocol icon endpoint
 * (https://icons.llamao.fi/icons/protocols/{slug}) takes no file extension —
 * it's an on-demand image server (see github.com/DefiLlama/icons), so we read
 * the response's Content-Type to pick a local file extension.
 *
 * Note: this is independent of the hand-placed generic icons already in
 * public/logos/protocols/ (aave.webp, morpho.webp, yearn-finance.webp) used
 * by the how-it-works diagram — those are untouched; this script's files are
 * keyed by the exact `protocol` display strings from vault-sources.ts.
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

/** Known DeFiLlama icon-slug aliases where it isn't just a kebab-case of the display name. */
const SLUG_ALIASES: Record<string, string[]> = {
  Lista: ["lista-dao", "lista"],
  "Aave v3": ["aave-v3", "aave"],
  "Morpho Blue": ["morpho-blue", "morpho"],
  "Ondo Finance": ["ondo-finance", "ondo"],
  Yearn: ["yearn-finance", "yearn"],
  Avant: ["avant-protocol", "avant"],
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function candidateSlugs(protocol: string): string[] {
  const fallback = slugify(protocol)
  const aliases = SLUG_ALIASES[protocol] ?? []
  return [...new Set([...aliases, fallback])]
}

async function findIcon(protocol: string): Promise<{ url: string; ext: string; buffer: Buffer } | null> {
  for (const slug of candidateSlugs(protocol)) {
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
  const protocols = [...new Set(VAULT_SOURCES.map((s) => s.protocol))].sort()

  const outDir = path.join(__dirname, "../public/logos/protocols")
  await mkdir(outDir, { recursive: true })

  const manifest: Record<string, string> = {}

  for (const protocol of protocols) {
    console.log(`Fetching icon for ${protocol}…`)
    const found = await findIcon(protocol)
    if (!found) {
      console.warn(`  WARNING: no icon found for protocol "${protocol}" — UI will fall back to initials.`)
      continue
    }

    const filename = `${slugify(protocol)}.${found.ext}`
    await writeFile(path.join(outDir, filename), found.buffer)

    manifest[protocol] = `/logos/protocols/${filename}`
    console.log(`  OK: ${found.url} -> public/logos/protocols/${filename}`)
  }

  const manifestPath = path.join(__dirname, "../data/protocol-logos.json")
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  console.log(
    `\nWrote ${manifestPath} (${Object.keys(manifest).length}/${protocols.length} protocols resolved).`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
