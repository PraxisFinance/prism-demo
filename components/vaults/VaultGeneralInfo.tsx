import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LabeledStat } from "@/components/common/LabeledStat"
import { getChainExplorer } from "@/lib/chain-explorers"
import { formatDate } from "@/lib/format"
import type { Vault } from "@/types"

interface VaultGeneralInfoProps {
  vault: Vault
}

/**
 * The Figma design's "General information" block (Curators, contract
 * deployed date, audits, explorer links). None of this exists in the
 * DeFiLlama data the rest of the app is built on — these are per-vault
 * mock fields on VaultSource (data/vault-sources.ts), invented for a
 * plausible-looking demo rather than derived data. See plan/06 redesign
 * Q&A.
 */
export function VaultGeneralInfo({ vault }: VaultGeneralInfoProps) {
  const explorer = getChainExplorer(vault.chainLabel)

  return (
    <Card>
      <CardHeader>
        <CardTitle>General information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <LabeledStat label="Curator" value={vault.curator} />
          <LabeledStat label="Contract deployed" value={formatDate(vault.contractDeployedAt)} />
          <LabeledStat label="Audited by" value={vault.auditFirm} />
          <LabeledStat label="Last audit" value={formatDate(vault.lastAuditAt)} />
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t pt-4 text-sm">
          <a
            href={explorer.url}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            View on {explorer.name} {"\u2192"}
          </a>
          <a
            href="https://debank.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            View on DeBank {"\u2192"}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
