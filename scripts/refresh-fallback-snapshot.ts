/**
 * Refreshes data/fallback-snapshot.json from live DeFiLlama data.
 *
 * Run manually before a demo/deploy:
 *   npm run snapshot:refresh
 *
 * This is the ONLY place that's allowed to write data/fallback-snapshot.json
 * — don't hand-edit it. See plan/04-mock-data-and-state.md §4.3.
 */
import { writeFile } from "node:fs/promises"
import path from "node:path"
import { VAULT_SOURCES } from "../data/vault-sources"

const POOLS_URL = "https://yields.llama.fi/pools"
const chartUrl = (poolId: string) => `https://yields.llama.fi/chart/${poolId}`
const HISTORY_DAYS = 120

interface LlamaPool {
  pool: string
  apy: number
  tvlUsd: number
  chain: string
  project: string
  symbol: string
}

interface PoolHistoryPoint {
  timestamp: string
  apy: number
  tvlUsd: number
}

async function main() {
  console.log(`Fetching /pools index…`)
  const poolsRes = await fetch(POOLS_URL)
  if (!poolsRes.ok) throw new Error(`/pools failed: ${poolsRes.status}`)
  const { data: pools } = (await poolsRes.json()) as { data: LlamaPool[] }
  const poolIndex = new Map(pools.map((p) => [p.pool, p]))

  const snapshot: Record<string, { current: LlamaPool | null; history: PoolHistoryPoint[] }> = {}

  for (const source of VAULT_SOURCES) {
    console.log(`Fetching history for ${source.id} (${source.poolId})…`)
    const current = poolIndex.get(source.poolId) ?? null
    if (!current) {
      console.warn(`  WARNING: pool ${source.poolId} not found in live /pools index`)
    }

    let history: PoolHistoryPoint[] = []
    try {
      const res = await fetch(chartUrl(source.poolId))
      if (!res.ok) throw new Error(`/chart/${source.poolId} failed: ${res.status}`)
      const { data } = (await res.json()) as { data: PoolHistoryPoint[] }
      history = data.slice(-HISTORY_DAYS)
    } catch (err) {
      console.warn(`  WARNING: history fetch failed for ${source.id}:`, err)
    }

    snapshot[source.poolId] = { current, history }
  }

  const outPath = path.join(__dirname, "../data/fallback-snapshot.json")
  await writeFile(outPath, JSON.stringify(snapshot, null, 2) + "\n")
  console.log(`\nWrote ${outPath} (${Object.keys(snapshot).length} pools).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
