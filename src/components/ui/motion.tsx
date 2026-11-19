"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

/**
 * Reveal block on scroll or mount — works reliably on mobile & desktop
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered headline word-by-word reveal
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
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
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
 * Animated number counter when scrolled into view (mobile & desktop)
 */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.5,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

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
  }, [inView, to, decimals, duration]);

  return (
    <span ref={ref} className="tabular">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/**
 * Smooth horizontal infinite ticker (works on mobile & desktop)
 */
export function MarqueeTicker({ items }: { items: string[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line bg-surface/60 py-3.5 select-none">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 26,
          ease: "linear",
          repeat: Infinity,
        }}
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
