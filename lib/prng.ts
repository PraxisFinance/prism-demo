/**
 * Tiny deterministic PRNG utilities. Used wherever the app needs
 * reproducible "randomness" that isn't sourced from real data — market
 * lifecycle jitter and the implied-APY skew in lib/market.ts.
 *
 * Deliberately separate from lib/settlement.ts's world (the "How it works"
 * explainer, plan/09) — this file only serves the real-vault market
 * derivation in lib/market.ts (plan/04).
 */

/** mulberry32: fast, deterministic PRNG. Returns a function yielding floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let s = seed
  return function random() {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable string -> numeric seed (FNV-1a). */
export function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Convenience: a seeded RNG directly from a string key. */
export function rngFromString(key: string): () => number {
  return mulberry32(hashSeed(key))
}

/** Deterministic float in [min, max) from a seeded RNG. */
export function randomInRange(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}

/** Deterministic pick from an array using a seeded RNG. */
export function pickFrom<T>(rng: () => number, items: readonly T[]): T {
  const index = Math.floor(rng() * items.length)
  return items[Math.min(index, items.length - 1)]
}
