import type { VaultCategory } from "@/types"

/**
 * Vault -> DeFiLlama pool configuration. This is the ONLY file to edit to
 * add/remove a vault — everything else (lib/defillama.ts, lib/market.ts,
 * data/vaults.ts) derives from this list. See plan/04-mock-data-and-state.md
 * §4.1.
 *
 * `poolId`s were resolved from https://yields.llama.fi/pools (no API key
 * required) and verified against https://yields.llama.fi/chart/{poolId}.
 */
export interface VaultSource {
  /** our slug, e.g. "base-steakusdc" */
  id: string
  /** DeFiLlama pool UUID (from /pools) */
  poolId: string
  /** display chain — should match the pool's real `chain` */
  chainLabel: string
  /** display protocol name, e.g. "Morpho Blue" */
  protocol: string
  /** vault name shown in the UI */
  displayName: string
  asset: string
  assetName: string
  category: VaultCategory
  description: string
  /** override the seeded default (30/60/90) */
  marketDurationDays?: number
  /** pin this vault's market to already-settled, for demoing that state */
  forceMatured?: boolean
}

export const VAULT_SOURCES: VaultSource[] = [
  {
    id: "bsc-usyc",
    poolId: "7c0a89c7-70cf-460c-b62e-cb278bf97e8f",
    chainLabel: "BSC",
    protocol: "Circle",
    displayName: "Circle USYC",
    asset: "USYC",
    assetName: "US Yield Coin",
    category: "RWA",
    description: "Tokenized short-term US Treasury fund.",
  },
  {
    id: "bsc-slisbnb",
    poolId: "50bb5f69-85ea-4f70-81da-3661a1633fc4",
    chainLabel: "BSC",
    protocol: "Lista",
    displayName: "Lista Staked BNB",
    asset: "SLISBNB",
    assetName: "Lista Staked BNB",
    category: "LST",
    description: "Liquid-staked BNB via Lista.",
  },
  {
    id: "base-steakusdc",
    poolId: "ba68527f-8ec2-4c55-827a-8f4673ae047c",
    chainLabel: "Base",
    protocol: "Morpho Blue",
    displayName: "Steakhouse USDC",
    asset: "USDC",
    assetName: "USD Coin",
    category: "Stablecoin",
    description: "Curated USDC lending vault on Morpho Blue.",
  },
  {
    id: "base-rwausdi",
    poolId: "503c47d7-33e4-4527-8326-5fafb25fc65b",
    chainLabel: "Base",
    protocol: "Multipli",
    displayName: "Multipli RWA USDi",
    asset: "RWAUSDI",
    assetName: "RWA USD Index",
    category: "RWA",
    description: "Real-world-asset-backed USD yield strategy.",
  },
  {
    id: "avax-savax",
    poolId: "3790c3e5-8644-4f6b-8feb-12434d8b99f9",
    chainLabel: "Avalanche",
    protocol: "BENQI",
    displayName: "BENQI Staked AVAX",
    asset: "SAVAX",
    assetName: "Staked AVAX",
    category: "LST",
    description: "Liquid-staked AVAX via BENQI.",
  },
  {
    id: "avax-savusd",
    poolId: "c74227a1-e738-4021-bbe1-13363815aecb",
    chainLabel: "Avalanche",
    protocol: "Avant",
    displayName: "Avant Staked avUSD",
    asset: "SAVUSD",
    assetName: "Staked avUSD",
    category: "Stablecoin",
    description: "Yield-bearing stablecoin strategy on Avalanche.",
  },
  {
    id: "megaeth-usdm",
    poolId: "5c994437-94bf-4c96-a4c1-5b8ae446dfd0",
    chainLabel: "MegaETH",
    protocol: "Aave v3",
    displayName: "Aave USDM",
    asset: "USDM",
    assetName: "Mountain Protocol USD",
    category: "Stablecoin",
    description: "USDM lending market on Aave v3.",
  },
  {
    id: "mantle-susde",
    poolId: "a4e37545-203b-4412-9acd-3e8b1aa4d744",
    chainLabel: "Mantle",
    protocol: "Aave v3",
    displayName: "Aave sUSDe",
    asset: "SUSDE",
    assetName: "Staked USDe",
    category: "Stablecoin",
    description: "Ethena's staked USDe lending market on Aave v3.",
  },
  {
    id: "mantle-usdy",
    poolId: "b5d7a190-38d2-4fdd-8c14-1fd00c11bce1",
    chainLabel: "Mantle",
    protocol: "Ondo Finance",
    displayName: "Ondo USDY",
    asset: "USDY",
    assetName: "US Dollar Yield",
    category: "RWA",
    description: "Tokenized short-term Treasuries yield token.",
  },
  {
    id: "katana-steakusdc",
    poolId: "d56ab93e-d48d-44f2-8139-9bb020afc980",
    chainLabel: "Katana",
    protocol: "Morpho Blue",
    displayName: "Steakhouse USDC",
    asset: "USDC",
    assetName: "USD Coin",
    category: "Stablecoin",
    description: "Curated USDC lending vault on Morpho Blue.",
    forceMatured: true,
  },
  {
    id: "katana-vbeth",
    poolId: "e75af6fd-5d2d-4faf-96ee-14dc90395ed7",
    chainLabel: "Katana",
    protocol: "Yearn",
    displayName: "Yearn vbETH",
    asset: "VBETH",
    assetName: "Yearn Vault ETH",
    category: "Blue-chip",
    description: "Automated ETH yield vault by Yearn.",
  },
]
