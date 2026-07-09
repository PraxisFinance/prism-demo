/**
 * Real block-explorer links per chain, for the Vault Details "General
 * information" block (plan/06 redesign to match the Figma design). We don't
 * model per-vault contract addresses, so these link to each explorer's
 * homepage rather than a specific (fake) contract page.
 */
export interface ChainExplorer {
  name: string;
  url: string;
}

const CHAIN_EXPLORERS: Record<string, ChainExplorer> = {
  BSC: { name: "BscScan", url: "https://bscscan.com" },
  Base: { name: "Basescan", url: "https://basescan.org" },
  Avalanche: { name: "Snowtrace", url: "https://snowtrace.io" },
  MegaETH: { name: "MegaETH Explorer", url: "https://mega.etherscan.io" },
  Mantle: { name: "Mantlescan", url: "https://mantlescan.xyz" },
  Katana: { name: "Katanascan", url: "https://katanascan.com" },
};

const FALLBACK_EXPLORER: ChainExplorer = { name: "Explorer", url: "#" };

export function getChainExplorer(chainLabel: string): ChainExplorer {
  return CHAIN_EXPLORERS[chainLabel] ?? FALLBACK_EXPLORER;
}
