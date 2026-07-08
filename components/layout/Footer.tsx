import Link from "next/link";

import {
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/icons/social-icons";

const SOCIAL_LINKS = [
  { href: "https://x.com/Praxis_Prism", label: "X", icon: TwitterIcon },
  {
    href: "https://t.me/praxisprotocol",
    label: "Telegram",
    icon: TelegramIcon,
  },
  {
    href: "https://discord.gg/exK6YmJRBC",
    label: "Discord",
    icon: DiscordIcon,
  },
  { href: "https://praxis.cc", label: "Website", icon: WebsiteIcon },
] as const;

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-16 gap-y-3 px-6 py-2">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-end gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="size-3.5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
