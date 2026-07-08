import type { Metadata } from "next"

import { HowItWorksExperience } from "@/components/how-it-works/HowItWorksExperience"

export const metadata: Metadata = {
  title: "How it works — Praxis Prism",
  description:
    "How Praxis Prism turns a vault's variable APY into two tradable sides — from deposit to settlement, in six steps.",
}

export default function HowItWorksPage() {
  return <HowItWorksExperience />
}
