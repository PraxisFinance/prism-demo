import { redirect } from "next/navigation"

/** Root route just forwards to the real landing screen. See plan/05 §1. */
export default function RootPage() {
  redirect("/vaults")
}
