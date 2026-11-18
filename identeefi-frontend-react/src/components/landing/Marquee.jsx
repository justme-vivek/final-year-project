import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import "./Landing.css";

const items = ["VERIFY", "TRACE", "TRUST", "BLOCKCHAIN RECORD", "SUPPLY CHAIN", "AUTHENTIC"];
const BASE_SPEED = 55; // px/s

// Track position is driven by rAF so scroll velocity can change speed and skew.
const Track = ({ velocity, skew, reduced }) => {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  useAnimationFrame((_, delta) => {
    if (reduced || delta > 100) return; // skip long frames (tab switch, etc.)
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    const boost = Math.min(Math.abs(velocity.get()) * 0.35, 320);
    let next = x.get() - ((BASE_SPEED + boost) * delta) / 1000;
    if (half > 0 && next <= -half) next += half; // seamless loop
    x.set(next);
  });
  return (
    <motion.div ref={trackRef} className="marquee-track" style={{ x, skewX: skew }}>
      {[0, 1].map((dup) => (
        <Box key={dup} sx={{ display: "inline-flex", alignItems: "center" }}>
          {items.map((t) => (
            <Box key={t + dup} sx={{ display: "inline-flex", alignItems: "center", gap: 3, px: 3 }}>
              <Typography sx={{ color: "#F2F0F8", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "3px" }}>{t}</Typography>
              <Box sx={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", bgcolor: "#6D4AFF" }} />
            </Box>
          ))}
        </Box>
      ))}
    </motion.div>
  );
};

export const Marquee = () => {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skew = useSpring(useTransform(velocity, [-1600, 1600], [-7, 7], { clamp: true }), { stiffness: 220, damping: 28 });
  return (
    <Box className="marquee" sx={{ bgcolor: "#050507", py: 2.2 }}>
      <Track velocity={velocity} skew={skew} reduced={!!reduced} />
    </Box>
  );
};
export default Marquee;
