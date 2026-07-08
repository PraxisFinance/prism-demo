"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  boundary,
  DEFAULT_SETTLEMENT,
  settlementSeries,
} from "@/lib/settlement"

const chartConfig = {
  stable: { label: "Stable", color: "var(--profile-stable)" },
  elevated: { label: "Elevated", color: "var(--profile-elevated)" },
} satisfies ChartConfig

const data = settlementSeries(DEFAULT_SETTLEMENT, 10, 0.25)
const a = boundary(DEFAULT_SETTLEMENT)
const t = DEFAULT_SETTLEMENT.t

/**
 * Step 6: the settlement curve. Stable is floored at the target for realized
 * APY >= a; Elevated captures the upside. Hover for the payoff readout at any
 * realized APY. See plan/09 §5.
 */
export function SettlementDiagram() {
  return (
    <DiagramFrame caption="At maturity, realized APY is read on-chain and the two sides settle along this curve.">
      <ChartContainer
        config={chartConfig}
        className="aspect-[4/3] w-full"
      >
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 8, left: 4 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 10]}
            tickCount={6}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            width={40}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}%`}
          />
          <ReferenceLine
            x={a}
            stroke="var(--border)"
            strokeDasharray="4 4"
            label={{
              value: "a",
              position: "insideTopLeft",
              fill: "var(--muted-foreground)",
              fontSize: 11,
            }}
          />
          <ReferenceLine
            x={t}
            stroke="var(--border)"
            strokeDasharray="4 4"
            label={{
              value: "target t",
              position: "insideTopRight",
              fill: "var(--muted-foreground)",
              fontSize: 11,
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(value) => `Realized APY ${value}%`}
              />
            }
          />
          <Line
            dataKey="stable"
            type="monotone"
            stroke="var(--color-stable)"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            dataKey="elevated"
            type="monotone"
            stroke="var(--color-elevated)"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </DiagramFrame>
  )
}
