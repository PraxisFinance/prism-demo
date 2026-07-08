import type { ReactNode } from "react"

import { Footer } from "@/components/layout/Footer"

/**
 * Content frame for the "normal" app pages (vaults, portfolio, etc.):
 * a padded, centered main plus the site Footer. The always-on chrome
 * (Header + Toaster) lives in the root layout, so full-bleed routes like
 * /how-it-works can opt out of this frame by living outside the group.
 * See plan/09-how-it-works.md §2.
 */
export default function StandardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
