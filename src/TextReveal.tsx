import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.35 } as const;

type RevealOptions = {
  delay?: number;
  immediate?: boolean;
  className?: string;
};

export function RevealHeading({
  as = "h2",
  lines,
  id,
  mutedLine = 1,
  delay = 0,
  immediate = false,
  duration = 0.85,
  className = "",
}: RevealOptions & {
  as?: "h1" | "h2";
  lines: string[];
  id?: string;
  mutedLine?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const Heading = as === "h1" ? motion.h1 : motion.h2;

  return (
    <Heading
      id={id}
      className={`text-reveal ${className}`}
      aria-label={lines.join(" ")}
      initial={reduced ? false : "hidden"}
      animate={immediate || reduced ? "visible" : undefined}
      whileInView={immediate || reduced ? undefined : "visible"}
      viewport={viewport}
    >
      {lines.map((line, index) => (
        <span
          key={`${index}-${line}`}
          className={`reveal-line${index === mutedLine ? " is-muted" : ""}`}
          aria-hidden="true"
        >
          <motion.span
            className="reveal-line-content"
            custom={index}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: (lineIndex: number) => ({
                y: "0%",
                opacity: 1,
                transition: {
                  duration: reduced ? 0 : duration,
                  delay: reduced ? 0 : delay + lineIndex * 0.11,
                  ease,
                },
              }),
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Heading>
  );
}

export function RevealText({
  as = "p",
  children,
  delay = 0,
  immediate = false,
  className,
}: RevealOptions & {
  as?: "p" | "span";
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const Text = as === "p" ? motion.p : motion.span;

  return (
    <Text
      className={className}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={immediate || reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={immediate || reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease }}
    >
      {children}
    </Text>
  );
}
