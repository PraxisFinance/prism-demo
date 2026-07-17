"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PieChart, Wallet } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModalRoot } from "@/components/modals/ModalRoot";
import { AllocationChart } from "@/components/portfolio/AllocationChart";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import {
  PositionsTable,
  PositionsTotalsBar,
} from "@/components/portfolio/PositionsTable";
import { usePersistedStoresHydrated } from "@/components/providers/StoreHydration";
import { computeAllocation, computePortfolioTotals } from "@/lib/portfolio";
import { requireWalletConnected } from "@/lib/stake-gating";
import { usePortfolioStore } from "@/stores/portfolio-store";
import { useUiStore } from "@/stores/ui-store";
import { useWalletStore } from "@/stores/wallet-store";
import type { Vault } from "@/types";

interface PortfolioViewProps {
  vaults: readonly Vault[];
}

/**
 * Client shell for /portfolio — plan/08. `now` is captured once on mount
 * (no live-ticking interval, per explicit decision — totals still update
 * immediately on every deposit/withdraw since `positions` itself changes),
 * matching the "compute client-side, not during SSR render" rule (plan/08
 * §10 pre-deploy checklist) since positions only ever exist client-side
 * anyway (client Zustand state, never present during prerendering).
 */
export function PortfolioView({ vaults }: PortfolioViewProps) {
  const hydrated = usePersistedStoresHydrated();
  const connected = useWalletStore((state) => state.connected);
  const connecting = useWalletStore((state) => state.connecting);
  const balanceUsd = useWalletStore((state) => state.balanceUsd);
  const connect = useWalletStore((state) => state.connect);

  const positions = usePortfolioStore((state) => state.positions);
  const openDeposit = useUiStore((state) => state.openDeposit);
  const openWithdraw = useUiStore((state) => state.openWithdraw);

  const [now] = useState(() => Date.now());

  const totals = useMemo(
    () => computePortfolioTotals(positions, vaults, now),
    [positions, vaults, now],
  );
  const allocation = useMemo(
    () => computeAllocation(positions, vaults, now),
    [positions, vaults, now],
  );

  function handleDepositMore(vaultId: string) {
    if (requireWalletConnected(connected, "deposit")) openDeposit(vaultId);
  }
  function handleWithdraw(positionId: string) {
    if (requireWalletConnected(connected, "withdraw")) openWithdraw(positionId);
  }

  if (!hydrated) {
    return null;
  }

  if (!connected) {
    return (
      <Empty className="min-h-[60vh]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wallet />
          </EmptyMedia>
          <EmptyTitle>Connect your wallet to view your portfolio</EmptyTitle>
          <EmptyDescription>
            Your positions, earnings, and allocation will show up here once you
            {"\u2019"}re connected.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => connect()} disabled={connecting}>
            <Wallet />
            {connecting ? "Connecting\u2026" : "Connect Wallet"}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (positions.length === 0) {
    return (
      <>
        <Empty className="min-h-[60vh]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PieChart />
            </EmptyMedia>
            <EmptyTitle>No positions yet</EmptyTitle>
            <EmptyDescription>
              Deposit into a vault to start building your portfolio.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/vaults"
              className={buttonVariants({ variant: "outline" })}
            >
              Browse vaults
            </Link>
          </EmptyContent>
        </Empty>
        <ModalRoot vaults={vaults} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-medium text-foreground">
          Portfolio
        </h1>
        <p className="text-sm text-muted-foreground">
          {positions.length} position{positions.length === 1 ? "" : "s"} across{" "}
          {allocation.length} vault
          {allocation.length === 1 ? "" : "s"}
        </p>
      </div>

      <PortfolioSummary
        totals={totals}
        walletBalanceUsd={balanceUsd}
        chart={
          <Card className="h-full">
            <CardContent className="flex h-full flex-col gap-2">
              <h2 className="shrink-0 text-sm font-medium text-foreground text-center">
                Allocation
              </h2>
              <AllocationChart
                allocation={allocation}
                totalValue={totals.totalValue}
              />
            </CardContent>
          </Card>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-xl border bg-card">
          <PositionsTable
            positions={positions}
            vaults={vaults}
            now={now}
            totals={totals}
            onDepositMore={handleDepositMore}
            onWithdraw={handleWithdraw}
          />
        </div>

        <div className="rounded-xl border bg-card">
          <PositionsTotalsBar totals={totals} />
        </div>
      </div>

      <ModalRoot vaults={vaults} />
    </div>
  );
}
