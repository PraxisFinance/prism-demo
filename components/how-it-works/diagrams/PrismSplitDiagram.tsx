import { TOKEN_COLOR, type TokenVariant } from "@/components/how-it-works/TokenChip"
import { DiagramFrame } from "@/components/how-it-works/diagrams/DiagramFrame"

interface PrismToken {
  label: string
  variant: TokenVariant
}

interface PrismSplitDiagramProps {
  input: PrismToken
  outputs: [PrismToken, PrismToken]
  caption?: React.ReactNode
}

/** Split a label into at most two balanced lines so it never overflows a chip. */
function splitLabel(label: string): string[] {
  if (label.length <= 9 || !label.includes(" ")) return [label]
  const words = label.split(" ")
  const target = Math.ceil(label.length / 2)
  let first = ""
  let i = 0
  for (; i < words.length; i++) {
    if (first && first.length + 1 + words[i].length > target) break
    first = first ? `${first} ${words[i]}` : words[i]
  }
  const second = words.slice(i).join(" ")
  return second ? [first, second] : [first]
}

function chipWidth(lines: string[]): number {
  const longest = Math.max(...lines.map((line) => line.length))
  return Math.min(140, Math.max(64, Math.round(longest * 7.8 + 28)))
}

function Chip({
  cx,
  cy,
  token,
}: {
  cx: number
  cy: number
  token: PrismToken
}) {
  const color = TOKEN_COLOR[token.variant]
  const lines = splitLabel(token.label)
  const multiline = lines.length > 1
  const w = chipWidth(lines)
  const h = multiline ? 42 : 34

  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill={color}
        fillOpacity={0.1}
        stroke={color}
        strokeOpacity={0.35}
      />
      {!multiline ? (
        <circle
          cx={cx - w / 2 + 15}
          cy={cy}
          r={4}
          fill={color}
          fillOpacity={0.7}
        />
      ) : null}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight={600}
        fill={color}
        fontSize={multiline ? 12.5 : 14}
      >
        {multiline ? (
          <>
            <tspan x={cx} y={cy - 7}>
              {lines[0]}
            </tspan>
            <tspan x={cx} y={cy + 8}>
              {lines[1]}
            </tspan>
          </>
        ) : (
          <tspan x={cx + 6} y={cy}>
            {lines[0]}
          </tspan>
        )}
      </text>
    </g>
  )
}

/**
 * Steps 2 & 3: one incoming beam hits a prism and refracts into two
 * complementary tokens. Reused for PT/YT and Stable/Elevated. Chips size to
 * their label (wrapping long ones) so nothing overflows. See plan/09 §5.
 */
export function PrismSplitDiagram({
  input,
  outputs,
  caption,
}: PrismSplitDiagramProps) {
  const [upper, lower] = outputs

  // Geometry: input anchored to the left, outputs to the right, prism centered.
  const inputW = chipWidth(splitLabel(input.label))
  const inputCx = 14 + inputW / 2
  const inBeamStart = inputCx + inputW / 2 + 6

  const upperW = chipWidth(splitLabel(upper.label))
  const lowerW = chipWidth(splitLabel(lower.label))
  const upperCx = 386 - upperW / 2
  const lowerCx = 386 - lowerW / 2

  const apexX = 208
  const apexY = 110

  return (
    <DiagramFrame caption={caption}>
      <svg
        viewBox="0 0 400 220"
        className="h-auto w-full max-w-md"
        fill="none"
        role="img"
        aria-label={`${input.label} splits into ${upper.label} and ${lower.label}`}
      >
        <defs>
          <linearGradient id="prism-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.5} />
          </linearGradient>
        </defs>

        {/* Incoming beam */}
        <line
          x1={inBeamStart}
          y1={apexY}
          x2={168}
          y2={apexY}
          stroke={TOKEN_COLOR[input.variant]}
          strokeWidth={3}
          strokeLinecap="round"
          className="prism-beam prism-beam-flow"
          opacity={0.55}
        />

        {/* Prism */}
        <polygon
          points={`168,82 168,138 ${apexX},${apexY}`}
          fill="url(#prism-fill)"
          stroke="var(--primary)"
          strokeOpacity={0.5}
          strokeLinejoin="round"
        />

        {/* Refracted beams */}
        <line
          x1={apexX}
          y1={apexY}
          x2={upperCx - upperW / 2 - 4}
          y2={64}
          stroke={TOKEN_COLOR[upper.variant]}
          strokeWidth={3}
          strokeLinecap="round"
          className="prism-beam prism-beam-flow"
          opacity={0.85}
        />
        <line
          x1={apexX}
          y1={apexY}
          x2={lowerCx - lowerW / 2 - 4}
          y2={156}
          stroke={TOKEN_COLOR[lower.variant]}
          strokeWidth={3}
          strokeLinecap="round"
          className="prism-beam prism-beam-flow"
          opacity={0.85}
        />

        {/* Tokens */}
        <Chip cx={inputCx} cy={apexY} token={input} />
        <Chip cx={upperCx} cy={64} token={upper} />
        <Chip cx={lowerCx} cy={156} token={lower} />
      </svg>
    </DiagramFrame>
  )
}
