"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatUsd } from "@/lib/format"

interface AmountReadoutProps {
  label: string
  value: string
  onChange: (value: string) => void
  max: number
  balanceLabel: string
  disabled?: boolean
  error?: string
}

/**
 * Big "$0.00" amount readout + MAX pill button — matches the Figma
 * `Vaults_Stake_Poap` amount control exactly (no slider, per the
 * plan-vs-Figma reconciliation). A native numeric text input styled as a
 * large heading rather than a boxed `Input`, since Figma has no border/box
 * around it. Shared by the Deposit and Withdraw panels.
 */
export function AmountReadout({
  label,
  value,
  onChange,
  max,
  balanceLabel,
  disabled,
  error,
}: AmountReadoutProps) {
  function handleChange(raw: string) {
    // Allow only digits + a single decimal point; block negative/NaN input at the source.
    const cleaned = raw.replace(/[^0-9.]/g, "")
    const firstDot = cleaned.indexOf(".")
    const sanitized =
      firstDot === -1
        ? cleaned
        : cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "")
    onChange(sanitized)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-foreground">{label}</span>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-baseline gap-1">
          <span
            className={cn(
              "font-heading text-3xl font-medium text-muted-foreground",
              value && "text-foreground"
            )}
          >
            $
          </span>
          <input
            inputMode="decimal"
            placeholder="0.00"
            value={value}
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
            aria-label={label}
            aria-invalid={!!error}
            className={cn(
              "w-full min-w-0 bg-transparent font-heading text-3xl font-medium text-foreground tabular-nums outline-none placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="xs"
          disabled={disabled || max <= 0}
          onClick={() => onChange(String(max))}
        >
          MAX
        </Button>
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{balanceLabel}</p>
      )}
    </div>
  )
}

export function formatBalanceLabel(label: string, amountUsd: number): string {
  return `${label}: ${formatUsd(amountUsd)}`
}
