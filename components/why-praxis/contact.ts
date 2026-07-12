/**
 * Content for the "Let's talk" contact view (plan/10). Editable placeholders —
 * swap in the real booking URL, social links, founder names/bios, and photos.
 */
import type { ComponentType, SVGProps } from "react";

import {
  DiscordBrand,
  GithubBrand,
  TelegramBrand,
  XBrand,
} from "@/components/why-praxis/BrandIcons";

type Glyph = ComponentType<SVGProps<SVGSVGElement>>;

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  Icon: Glyph;
}

/** Company community channels. TODO: real URLs. */
export const CHANNELS: SocialLink[] = [
  { id: "x", label: "X", href: "https://x.com/Praxis_Prism", Icon: XBrand },
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.gg/exK6YmJRBC",
    Icon: DiscordBrand,
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/praxisprotocol",
    Icon: TelegramBrand,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/PraxisFinance",
    Icon: GithubBrand,
  },
];

export interface Founder {
  name: string;
  role: string;
  bio: string;
  /** Initials shown in the placeholder avatar until a photo is added. */
  initials: string;
  links: SocialLink[];
}

export const FOUNDERS: Founder[] = [
  {
    name: "Alex Ivlev",
    role: "Co-founder & CEO/CTO",
    bio: "Sets the product vision and drives strategy and partnerships. Builds the product and the team.",
    initials: "AI",
    links: [
      { id: "x", label: "X", href: "https://x.com/ivlevspace", Icon: XBrand },
      {
        id: "telegram",
        label: "Telegram",
        href: "https://t.me/spacebanan",
        Icon: TelegramBrand,
      },
    ],
  },
  {
    name: "Mizori",
    role: "Co-founder & CPO/CMO",
    bio: "Leads product and the end-to-end user experience. Manages the community and the brand.",
    initials: "MZ",
    links: [
      { id: "x", label: "X", href: "https://x.com/Shirouki_PM", Icon: XBrand },
      {
        id: "telegram",
        label: "Telegram",
        href: "https://t.me/Mizori_k",
        Icon: TelegramBrand,
      },
    ],
  },
];
