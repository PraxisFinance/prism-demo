/**
 * The vault catalog: real DeFiLlama data + the seeded Prism market for each
 * vault (lib/market.ts). Server-only (fetches live data) — consume from
 * Server Components, e.g. `app/vaults/page.tsx` (plan/05) behind
 * `<Suspense>`. See plan/04-mock-data-and-state.md §6.
 *
 * Architecture note: because this does real (server-side) I/O,
 * getVaults()/getVaultById() are async and only callable from server
 * contexts — never import this from a client Zustand store.
 */
import { getPoolData } from "@/lib/defillama"
import { buildVaultMarket } from "@/lib/market"
import { VAULT_SOURCES, type VaultSource } from "@/data/vault-sources"
import type { Vault } from "@/types"

/** Deterministic per-vault fallback so the UI never shows a bare 0 if a pool has no data yet (e.g. before `npm run snapshot:refresh` has populated real numbers). */
function seededFallbackApy(source: VaultSource): number {
  const base = source.category === "LST" || source.category === "Blue-chip" ? 3.5 : 5
  return Math.round((base + (hashDigit(source.id) % 5)) * 100) / 100
}

function seededFallbackTvl(source: VaultSource): number {
  const range = source.category === "RWA" || source.category === "Stablecoin" ? 60_000_000 : 12_000_000
  return Math.round(range * (0.3 + (hashDigit(source.id) % 7) / 10))
}

function hashDigit(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

async function buildVault(source: VaultSource): Promise<Vault> {
  const { current, history } = await getPoolData(source.poolId)
  const currentApy = current?.apy ?? seededFallbackApy(source)
  const tvlUsd = current?.tvlUsd ?? seededFallbackTvl(source)

  const market = buildVaultMarket({
    vaultId: source.id,
    history,
    currentApy,
    durationOverrideDays: source.marketDurationDays,
    forceMatured: source.forceMatured,
  })

  return {
    id: source.id,
    name: source.displayName,
    asset: source.asset,
    assetName: source.assetName,
    protocol: source.protocol,
    chainLabel: source.chainLabel,
    category: source.category,
    tvlUsd,
    currentApy,
    description: source.description,
    market,
    history,
    curator: source.curator,
    contractDeployedAt: source.contractDeployedAt,
    auditFirm: source.auditFirm,
    lastAuditAt: source.lastAuditAt,
  }
}

/** Fetches and derives the full vault catalog. Not memoized across calls — callers (list + detail) should fetch once and pass down. */
export async function getVaults(): Promise<Vault[]> {
  return Promise.all(VAULT_SOURCES.map(buildVault))
}

export async function getVaultById(id: string): Promise<Vault | undefined> {
  const source = VAULT_SOURCES.find((s) => s.id === id)
  if (!source) return undefined
  return buildVault(source)
}
