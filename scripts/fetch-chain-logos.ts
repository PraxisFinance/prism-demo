/**
 * Downloads a logo for every unique `chainLabel` in data/vault-sources.ts
 * from DeFiLlama's public icon CDN and writes:
 *   - public/logos/chains/{slug}.{ext}   (the image itself)
 *   - data/chain-logos.json              (chainLabel -> public path manifest)
 *
 * Run manually whenever a vault on a new chain is added:
 *   npm run logos:chains
 *
 * This is the ONLY place that's allowed to write data/chain-logos.json or
 * public/logos/chains/* — don't hand-edit them, re-run the script instead.
 * Mirrors the scripts/refresh-fallback-snapshot.ts pattern.
 *
 * DeFiLlama doesn't expose an official "chain -> icon slug" API, so we try a
 * short list of likely slugs per chain (lowercase display name first, plus
 * known aliases) against https://icons.llamao.fi/icons/chains/rsz_{slug}.{ext}
 * and keep whichever combination resolves first.
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { VAULT_SOURCES } from "../data/vault-sources"

const ICON_BASE = "https://icons.llamao.fi/icons/chains/rsz_"
const EXTENSIONS = ["jpg", "png", "webp"]

/** Known DeFiLlama icon-slug aliases where it isn't just `chainLabel.toLowerCase()`. */
const SLUG_ALIASES: Record<string, string[]> = {
  BSC: ["binance", "bsc", "bnb-smart-chain"],
}

function slugify(chainLabel: string): string {
  return chainLabel.toLowerCase().replace(/\s+/g, "-")
}

function candidateSlugs(chainLabel: string): string[] {
  const fallback = slugify(chainLabel)
  const aliases = SLUG_ALIASES[chainLabel] ?? []
  return [...new Set([...aliases, fallback])]
}

async function findIconUrl(chainLabel: string): Promise<{ url: string; ext: string } | null> {
  for (const slug of candidateSlugs(chainLabel)) {
    for (const ext of EXTENSIONS) {
      const url = `${ICON_BASE}${slug}.${ext}`
      try {
        const res = await fetch(url, { method: "GET" })
        if (res.ok) return { url, ext }
      } catch {
        // try next candidate
      }
    }
  }
  return null
}

async function main() {
  const chainLabels = [...new Set(VAULT_SOURCES.map((s) => s.chainLabel))].sort()

  const outDir = path.join(__dirname, "../public/logos/chains")
  await mkdir(outDir, { recursive: true })

  const manifest: Record<string, string> = {}

  for (const chainLabel of chainLabels) {
    console.log(`Fetching icon for ${chainLabel}…`)
    const found = await findIconUrl(chainLabel)
    if (!found) {
      console.warn(`  WARNING: no icon found for chain "${chainLabel}" — UI will fall back to initials.`)
      continue
    }

    const res = await fetch(found.url)
    const buffer = Buffer.from(await res.arrayBuffer())
    const filename = `${slugify(chainLabel)}.${found.ext}`
    await writeFile(path.join(outDir, filename), buffer)

    manifest[chainLabel] = `/logos/chains/${filename}`
    console.log(`  OK: ${found.url} -> public/logos/chains/${filename}`)
  }

  const manifestPath = path.join(__dirname, "../data/chain-logos.json")
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  console.log(
    `\nWrote ${manifestPath} (${Object.keys(manifest).length}/${chainLabels.length} chains resolved).`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
