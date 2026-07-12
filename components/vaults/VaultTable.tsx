"use client";

import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatApy, formatUsd } from "@/lib/format";
import { chainLogoSrc } from "@/lib/chain-logos";
import { protocolLogoSrc } from "@/lib/protocol-logos";
import { requireWalletConnected } from "@/lib/stake-gating";
import { cn } from "@/lib/utils";
import { MaturityBadge } from "@/components/vaults/MaturityBadge";
import { useUiStore } from "@/stores/ui-store";
import { useWalletStore } from "@/stores/wallet-store";
import { SORT_OPTIONS, type SortDirection, type SortKey } from "@/lib/vault-filters";
import type { Vault } from "@/types";

interface VaultTableProps {
  vaults: readonly Vault[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

interface SortableHeadProps {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
}

/** A right-aligned TableHead that doubles as a sort control — replaces the old toolbar Sort dropdown. */
function SortableHead({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSortChange,
}: SortableHeadProps) {
  const isActive = sortKey === activeSortKey;
  return (
    <TableHead className="text-right">
      <button
        type="button"
        onClick={() => onSortChange(sortKey)}
        className={cn(
          "inline-flex w-full items-center justify-end gap-1 outline-none",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label={`Sort by ${label}`}
      >
        {label}
        {isActive ? (
          sortDirection === "asc" ? (
            <ArrowUp className="size-3.5" />
          ) : (
            <ArrowDown className="size-3.5" />
          )
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}

/** Dense row-per-vault list view. See plan/05 §6 (adapted as the primary view per user decision). */
export function VaultTable({ vaults, sortKey, sortDirection, onSortChange }: VaultTableProps) {
  const router = useRouter();
  const connected = useWalletStore((state) => state.connected);
  const openDeposit = useUiStore((state) => state.openDeposit);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chain</TableHead>
          <TableHead>Vault</TableHead>
          <TableHead>Category</TableHead>
          {SORT_OPTIONS.map((option) => (
            <SortableHead
              key={option.id}
              label={option.label}
              sortKey={option.id}
              activeSortKey={sortKey}
              sortDirection={sortDirection}
              onSortChange={onSortChange}
            />
          ))}
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault) => (
          <TableRow
            key={vault.id}
            className="cursor-pointer"
            tabIndex={0}
            onClick={() => router.push(`/vaults/${vault.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/vaults/${vault.id}`);
            }}
          >
            <TableCell>
              <Avatar size="sm" title={vault.chainLabel}>
                {chainLogoSrc(vault.chainLabel) && (
                  <AvatarImage
                    src={chainLogoSrc(vault.chainLabel)}
                    alt={vault.chainLabel}
                  />
                )}
                <AvatarFallback>{initials(vault.chainLabel)}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar size="sm" title={vault.protocol}>
                  {protocolLogoSrc(vault.protocol) && (
                    <AvatarImage
                      src={protocolLogoSrc(vault.protocol)}
                      alt={vault.protocol}
                    />
                  )}
                  <AvatarFallback>{initials(vault.protocol)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {vault.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {vault.protocol}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {vault.category}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatUsd(vault.tvlUsd)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatApy(vault.currentApy)}
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums text-foreground">
              {vault.market.matured ? (
                <span className="text-muted-foreground">{"\u2014"}</span>
              ) : (
                formatApy(vault.market.impliedApy)
              )}
            </TableCell>
            <TableCell className="text-right">
              <MaturityBadge vault={vault} />
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                disabled={vault.market.matured}
                onClick={(e) => {
                  e.stopPropagation();
                  if (requireWalletConnected(connected, "deposit")) openDeposit(vault.id);
                }}
                aria-label={`Deposit into ${vault.name}`}
              >
                Deposit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
