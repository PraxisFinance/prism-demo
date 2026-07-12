import type { Metadata } from "next"

import { WhyPraxisExperience } from "@/components/why-praxis/WhyPraxisExperience"

export const metadata: Metadata = {
  title: "Why Praxis — Praxis Prism",
  description:
    "What Praxis unlocks for users, vaults, and chains — and how its APY market is different from Pendle.",
}

export default function WhyPraxisPage() {
  return <WhyPraxisExperience />
}
