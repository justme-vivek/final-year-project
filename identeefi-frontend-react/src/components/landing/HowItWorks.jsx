import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PackagePlus, Fingerprint, QrCode, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import "./Landing.css";

const EASE = [0.22, 1, 0.36, 1];

// Real Identeefi contract methods; CTAs point at real app routes.
const steps = [
  { n: "01", t: "REGISTER PRODUCT", d: "The manufacturer records product details and mints a single source-of-truth entry on Sepolia.", icon: PackagePlus, method: "registerProduct()", cta: { label: "Register a product", to: "/add-product" } },
  { n: "02", t: "CREATE DIGITAL IDENTITY", d: "The serial number becomes the identity key — one immutable on-chain record anyone can read back.", icon: Fingerprint, method: "getProduct(serial)", cta: { label: "Inspect a live record", to: "/#records" } },
  { n: "03", t: "ATTACH QR CODE", d: "A QR code encodes the serial, so the physical product and its on-chain identity stay linked.", icon: QrCode, method: "QR → serial", cta: { label: "Open the scanner", to: "/#verify" } },
  { n: "04", t: "VERIFY", d: "Anyone scans the code; the app reads the chain directly and compares it with the backend record.", icon: ShieldCheck, method: "getProduct()", cta: { label: "Open the scanner", to: "/scanner" } },
];

export const HowItWorks = () => {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver((e) => setInView(e[0]?.isIntersecting === true), { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-advance only while in view; the first interaction stops it for good.
  useEffect(() => {
    if (!inView || interacted || reduced) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 4500);
    return () => clearInterval(t);
  }, [inView, interacted, reduced]);

  const pick = (i) => { setActive(i); setInteracted(true); };
  const activeStep = steps[active];
  const ActiveIcon = activeStep.icon;
  return (
    <Box id="how" ref={sectionRef} sx={{ py: 10, bgcolor: "#050507", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
      <Container maxWidth="lg">
        <Reveal><Typography sx={{ color: "#6D4AFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", mb: 2, textAlign: "center" }}>01 / PROCESS</Typography></Reveal>
        <Reveal delay={0.05}><Typography sx={{ color: "#F2F0F8", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 600, mb: 2 }}>HOW AUTHENTISCAN WORKS</Typography></Reveal>
        <Typography sx={{ color: "#A5A1B2", fontSize: "clamp(1rem, 2vw, 1.125rem)", mb: 7, maxWidth: 600, lineHeight: 1.6 }}>Four steps from factory floor to consumer trust. Each step writes to the same record.</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: 4 }}>
          <Box role="tablist" aria-label="Process steps" sx={{ position: "relative", pl: 6 }}>
            <Box className="step-line">
              <motion.div className="step-progress" animate={{ height: `${((active + 1) / steps.length) * 100}%` }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 20 }} />
            </Box>
            {steps.map((s, i) => (
              <Box
                key={s.n}
                role="tab"
                aria-selected={i === active}
                tabIndex={0}
                className="step-item"
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(i); } }}
                sx={{ position: "relative", pb: 4, cursor: "pointer", outline: "none" }}
              >
                <motion.span
                  animate={{ scale: i === active ? 1 : 0.94, backgroundColor: i === active ? "#6D4AFF" : "#101016" }}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
                  style={{ position: "absolute", left: -48, top: 2, width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}
                  sx={{ border: "1px solid", borderColor: i <= active ? "rgba(109,74,255,0.45)" : "rgba(255,255,255,0.10)" }}
                >
                  <s.icon size={17} color={i === active ? "#fff" : i < active ? "#8B72FF" : "#706C7A"} />
                </motion.span>
                <Typography sx={{ color: i === active ? "#F2F0F8" : "#706C7A", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "1px", transition: "color 0.3s" }}>{s.n}</Typography>
                <Typography sx={{ color: i === active ? "#F2F0F8" : "#A5A1B2", fontSize: "1.125rem", fontWeight: 600, transition: "color 0.3s" }}>{s.t}</Typography>
              </Box>
            ))}
          </Box>
          <Box role="tabpanel" aria-live="polite" sx={{ bgcolor: "#101016", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.25rem", p: 3, minHeight: "20rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.n}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box sx={{ width: "3.25rem", height: "3.25rem", borderRadius: "0.875rem", bgcolor: "#0A0A0F", border: "1px solid rgba(109,74,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}><ActiveIcon size={24} color="#8B72FF" /></Box>
                  <Typography sx={{ color: "#6D4AFF", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "2px" }}>STEP {activeStep.n}</Typography>
                </Box>
                <Typography sx={{ color: "#F2F0F8", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 600, mb: 2 }}>{activeStep.t}</Typography>
                <Typography sx={{ color: "#A5A1B2", fontSize: "clamp(0.9375rem, 2vw, 1.125rem)", lineHeight: 1.7, maxWidth: 480, mb: 3 }}>{activeStep.d}</Typography>
                <Box component="span" sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#8B72FF", border: "1px solid rgba(109,74,255,0.45)", borderRadius: "0.5rem", px: 1.25, py: 0.5, bgcolor: "#0A0A0F", display: "inline-block", mb: 3 }}>{activeStep.method}</Box>
                <Box>
                  <Button component={Link} to={activeStep.cta.to} className="step-cta" endIcon={<ArrowRight size={15} className="arrow" />} sx={{ color: "#F2F0F8", px: 0, textTransform: "none", fontWeight: 600, fontSize: "0.875rem" }}>{activeStep.cta.label}</Button>
                </Box>
              </motion.div>
            </AnimatePresence>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};
export default HowItWorks;
