"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PieChart, Sparkles } from "lucide-react";

import { VaultIcon } from "@/components/icons/vault-icon";
import { ConnectWalletButton } from "@/components/layout/ConnectWalletButton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/vaults", label: "Vaults", icon: VaultIcon },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/how-it-works", label: "How it works", icon: BookOpen },
  { href: "/why-praxis", label: "Why Praxis", icon: Sparkles },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/vaults" className="flex items-center gap-2">
          <Image src="/praxis-logo.svg" alt="" width={28} height={28} />
          <span className="font-heading text-lg font-bold text-foreground">
            Praxis Prism
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <ConnectWalletButton />
      </div>
    </header>
  );
}
