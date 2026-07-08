/**
 * Formatting helpers shared across the app. Kept dependency-free (no date
 * lib) per plan/02-project-setup-and-tooling.md §4.
 */

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}\u2026${address.slice(-chars)}`
}

export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
    ...options,
  }).format(value)
}

export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, fractionDigits = 2): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(fractionDigits)}%`
}

/** USD amount, switching to compact notation ("$128.4M") above the threshold. */
export function formatUsd(value: number, compactThreshold = 1_000_000): string {
  return Math.abs(value) >= compactThreshold ? formatCompactCurrency(value) : formatCurrency(value)
}

/** An APY value with its unit, e.g. "8.4% APY". No +/- sign (unlike formatPercent). */
export function formatApy(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}% APY`
}

/** A Stable/Elevated token price (0..1), e.g. "$0.62". */
export function formatPrice(value: number, fractionDigits = 2): string {
  return `$${value.toFixed(fractionDigits)}`
}

/** Compact plain number (no currency symbol), e.g. "128.4M". */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}
