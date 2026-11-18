import React, { useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Reveal, FadeUp } from "../ui/Reveal";
import { CONTRACT_ADDRESS, EXPLORER_URL } from "../../api/liveChain";

// The journey hops — no fabricated tx hashes or dates. Methods are the real
// Identeefi contract calls each hop performs.
const steps = [
  { title: "MANUFACTURER", desc: "A unique product record is minted on the blockchain at the source.", color: "#6D4AFF", method: "registerProduct()" },
  { title: "DISTRIBUTOR", desc: "Custody is transferred with a signed, timestamped on-chain entry.", color: "#8B72FF", method: "addProductHistory()" },
  { title: "RETAILER", desc: "The retailer receives a verified, tamper-proof product history.", color: "#35C98A", method: "addProductHistory()" },
  { title: "CONSUMER", desc: "Anyone scans the QR to independently verify the product record.", color: "#F2F0F8", method: "getProduct()" },
];

// Dot springs to filled the moment the scroll-linked line reaches it.
const JourneyDot = ({ color }) => {
  const reduced = useReducedMotion();
  return (
    <Box sx={{ position: "absolute", left: "0.75rem", transform: "translateX(-50%)", width: "1.125rem", height: "1.125rem", borderRadius: "50%", bgcolor: "#0A0A0F", border: `2px solid ${color}`, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.span
        initial={reduced ? { scale: 1 } : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0 0 -42% 0" }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 18 }}
        style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", bgcolor: color, display: "block" }}
      />
    </Box>
  );
};

export const SupplyChain = () => {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  // Line fills as the user scrolls through the section.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.8", "end 0.6"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  return (
    <Box id="journey" ref={sectionRef} className="below-fold" sx={{ bgcolor: "#0A0A0F", py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Reveal><Typography sx={{ color: "#6D4AFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", mb: 2 }}>03 / JOURNEY</Typography></Reveal>
          <Reveal delay={0.05}><Typography sx={{ color: "#F2F0F8", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 600, mb: 2 }}>SUPPLY CHAIN FLOW</Typography></Reveal>
          <FadeUp delay={0.1}><Typography sx={{ color: "#A5A1B2", fontSize: "clamp(1rem, 2vw, 1.125rem)", maxWidth: "35rem", mx: "auto", lineHeight: 1.6 }}>Four handoffs, one immutable record. Every hop below is a real call on the Sepolia contract.</Typography></FadeUp>
        </Box>
        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", left: "1.25rem", top: 0, bottom: 0, width: "0.125rem", bgcolor: "rgba(255,255,255,0.08)" }}>
            <motion.div style={reduced ? { height: "100%", width: "100%", bgcolor: "#6D4AFF" } : { scaleY: lineScale, transformOrigin: "top", height: "100%", width: "100%", bgcolor: "#6D4AFF" }} />
          </Box>
          {steps.map((s, i) => (
            <Box key={s.title} sx={{
              position: "relative",
              pl: 0,
              mb: 6,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}>
              <Box sx={{ flex: 1, textAlign: "left" }}>
                <FadeUp delay={i * 0.06} x={i % 2 === 0 ? -18 : 18}>
                  <Typography sx={{ color: s.color, fontSize: "1.125rem", fontWeight: 600, mb: 1 }}>{s.title}</Typography>
                  <Typography sx={{ color: "#A5A1B2", fontSize: "0.9375rem", lineHeight: 1.6, mb: 1.5 }}>{s.desc}</Typography>
                  <Box component="span" sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#8B72FF", border: "1px solid rgba(109,74,255,0.45)", borderRadius: "0.5rem", px: 1.25, py: 0.5, bgcolor: "#050507", display: "inline-block" }}>{s.method}</Box>
                </FadeUp>
              </Box>
              <JourneyDot color={s.color} />
            </Box>
          ))}
        </Box>
        <FadeUp>
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography sx={{ color: "#A5A1B2", fontSize: "0.9375rem", mb: 1 }}>Every hop writes to one Sepolia contract.</Typography>
            <Typography component="a" href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" sx={{ color: "#8B72FF", fontSize: "0.875rem", fontFamily: "monospace", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              {CONTRACT_ADDRESS.slice(0, 10)}�{CONTRACT_ADDRESS.slice(-6)} ?
            </Typography>
          </Box>
        </FadeUp>
      </Container>
    </Box>
  );
};
export default SupplyChain;

