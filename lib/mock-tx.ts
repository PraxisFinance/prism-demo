/**
 * Fake transaction simulator for the deposit/withdraw mock flow. No real
 * wallet/extension/RPC call — a pure `setTimeout` promise that resolves
 * after a randomized delay with a fake, non-clickable tx hash. Single
 * place to tune timing across both modals. See
 * plan/07-deposit-withdraw-modals.md §3 step 2 and §6.
 */

const MIN_DELAY_MS = 1200
const MAX_DELAY_MS = 1800
const HASH_BYTES = 32

export interface MockTxResult {
  hash: string
}

function randomHash(bytes: number): string {
  const chars = "0123456789abcdef"
  let hash = "0x"
  for (let i = 0; i < bytes * 2; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

/** Resolves after ~1.2-1.8s with a fake tx hash. Never rejects — this is a demo, not a real chain call. */
export function simulateTx(): Promise<MockTxResult> {
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
  return new Promise((resolve) => {
    setTimeout(() => resolve({ hash: randomHash(HASH_BYTES) }), delay)
  })
}
