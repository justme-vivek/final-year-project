import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Span-only reveal safe inside h1/p. The OUTER span is the in-view observer —
// a clipped inner element (overflow:hidden parent + y:110%) never intersects,
// so observing it directly would never fire. Variants propagate down instead.
export const Reveal = ({ children, delay = 0 }) => {
  const reduced = useReducedMotion();
  if (reduced) return <span style={{ display: "block" }}>{children}</span>;
  return (
    <motion.span
      style={{ display: "block", overflow: "hidden" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { delayChildren: delay } } }}
    >
      <motion.span
        style={{ display: "block", willChange: "transform" }}
        variants={{
          hidden: { y: "110%" },
          show: { y: "0%", transition: { duration: 0.6, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

export const FadeUp = ({ children, delay = 0, y = 28, x = 0, blur = true }) => {
  const reduced = useReducedMotion();
  if (reduced) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, x, y, filter: blur ? "blur(10px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
