"use client";

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
}

/**
 * Fade + slide-up on scroll into view. The actual animation lives in
 * globals.css ([data-reveal]) and is disabled under prefers-reduced-motion,
 * where content is shown in its final state. See plan/09 §7.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2, true);

  return (
    <div
      ref={ref}
      data-reveal
      data-visible={inView ? "true" : undefined}
      style={
        delay ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined
      }
      className={className}
    >
      {children}
    </div>
  );
}

/** Convenience wrapper for a full-width reveal region. */
export function RevealBlock({ children, delay, className }: RevealProps) {
  return (
    <Reveal delay={delay} className={cn("w-full", className)}>
      {children}
    </Reveal>
  );
}
