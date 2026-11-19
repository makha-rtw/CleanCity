"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";

export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

/**
 * Reveal block on scroll with smooth upward glide (Jawoo-style section entrance)
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered headline word-by-word or line-by-line reveal
 */
export function AnimatedHeadline({
  text,
  highlight,
  className = "",
}: {
  text: string;
  highlight?: string;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1 className={className}>
      {words.map((word, i) => {
        const isHighlighted =
          highlight &&
          highlight
            .toLowerCase()
            .split(" ")
            .some((h) => word.toLowerCase().replace(/[.,]/g, "") === h);

        return (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom mr-[0.26em] pb-1 -mb-1"
          >
            <motion.span
              initial={
                prefersReduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: "100%" }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: i * 0.045,
                ease: EASE_OUT_EXPO,
              }}
              className={`inline-block ${
                isHighlighted ? "text-accent" : ""
              }`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
}

/**
 * Animated number counter when scrolled into view
 */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.6,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    prefersReduced
      ? to.toLocaleString("fr-FR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : "0"
  );

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(
        to.toLocaleString("fr-FR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      );
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate(value) {
        setDisplay(
          value.toLocaleString("fr-FR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        );
      },
    });

    return () => controls.stop();
  }, [inView, to, decimals, duration, prefersReduced]);

  return (
    <span ref={ref} className="tabular">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/**
 * Smooth horizontal infinite ticker (pauses on hover & respects prefers-reduced-motion)
 */
export function MarqueeTicker({ items }: { items: string[] }) {
  const prefersReduced = useReducedMotion();
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line bg-surface/60 py-3.5 select-none">
      <motion.div
        animate={prefersReduced ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={
          prefersReduced
            ? undefined
            : {
                duration: 28,
                ease: "linear",
                repeat: Infinity,
              }
        }
        className="flex items-center gap-8 whitespace-nowrap w-max"
      >
        {doubled.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="inline-flex items-center gap-3 text-xs sm:text-sm font-medium text-muted"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-ink font-semibold">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
