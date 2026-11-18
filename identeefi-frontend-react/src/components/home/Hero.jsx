import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Container, Stack } from "@mui/material";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Magnetic } from "../ui/Magnetic";
import { Reveal, FadeUp } from "../ui/Reveal";
import Marquee from "../landing/Marquee";
import { getLatestBlock, shortHash, EXPLORER_URL } from "../../api/liveChain";
import "../landing/Landing.css";

const words = ["PRODUCT", "AUTHENTICATION", "BUILT ON", "BLOCKCHAIN"];
const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: fine)").matches;

export const Hero = () => {
  const cardRef = useRef(null);
  const sectionRef = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rX = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 180, damping: 22 });
  const rY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 180, damping: 22 });
  const [block, setBlock] = useState(null);
  const [blockHash, setBlockHash] = useState("");
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  // Scroll parallax: copy drifts up and fades, the card moves faster and shrinks slightly.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Real live Sepolia block data (replaces the old fake ticking counter).
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const latest = await getLatestBlock();
        if (!alive) return;
        setBlock(latest.number);
        setBlockHash(latest.hash);
      } catch (e) {
        // Offline: keep "—" placeholders instead of fabricated data.
      }
    };
    load();
    const t = setInterval(load, 12000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const onCardMove = (e) => {
    if (!finePointer() || reduced) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const copyHash = async () => {
    if (!blockHash) return;
    try { await navigator.clipboard.writeText(blockHash); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Box ref={sectionRef} sx={{ backgroundColor: "#050507", minHeight: "100vh", display: "flex", flexDirection: "column", pt: 10 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 4, justifyContent: 'center', py: 4 }}>
          <motion.div style={reduced ? { flex: '1 1 18rem', maxWidth: '40rem' } : { y: contentY, opacity: contentOpacity, flex: '1 1 18rem', maxWidth: '40rem' }}>
            <FadeUp><Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography sx={{ color: "#6D4AFF", fontSize: "0.8125rem", fontWeight: 700 }}>AUTHENTISCAN</Typography>
              <Box sx={{ width: "3rem", height: "0.0625rem", bgcolor: "rgba(109,74,255,0.45)" }} />
            </Box></FadeUp>
            <Box component="h1" sx={{ color: "#F2F0F8", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700, lineHeight: 1.0, mb: 3, m: 0, fontFamily: "inherit" }}>
              {words.map((w, i) => (<Reveal key={w} delay={0.08 * i}>{w}</Reveal>))}
            </Box>
            <FadeUp delay={0.35}><Typography sx={{ color: "#A5A1B2", fontSize: "clamp(1rem, 2vw, 1.125rem)", mb: 4, maxWidth: "30rem", lineHeight: 1.6 }}>Verify products. Trace their journey. Trust the record. Blockchain-powered product verification for a more transparent supply chain.</Typography></FadeUp>
            <FadeUp delay={0.45}>
              <Stack direction="column" spacing={2}>
                <Magnetic><Button component={Link} to="/scanner" sx={{ bgcolor: "#6D4AFF", color: "#fff", px: 4, py: 1.6, borderRadius: "0.625rem", fontWeight: 700, textTransform: "none" }}>SCAN A PRODUCT</Button></Magnetic>
                <Magnetic><Button component={Link} to="/#verify" sx={{ color: "#F2F0F8", px: 4, py: 1.6, borderRadius: "0.625rem", fontWeight: 600, textTransform: "none", border: "1px solid rgba(255,255,255,0.10)" }}>EXPLORE PLATFORM</Button></Magnetic>
              </Stack>
            </FadeUp>
          </motion.div>
          <motion.div style={reduced ? { flex: '1 1 18rem', maxWidth: '25rem' } : { rotateX: rX, rotateY: rY, y: cardY, scale: cardScale, opacity: cardOpacity, flex: '1 1 18rem', maxWidth: '25rem' }}>
            <Box ref={cardRef} onMouseMove={onCardMove} onMouseLeave={() => { mx.set(0.5); my.set(0.5); }} sx={{ bgcolor: "#101016", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.25rem", p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ color: "#706C7A", fontSize: "0.75rem", fontWeight: 700 }}>AUTHENTISCAN</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box className="scan-pulse-dot" sx={{ width: "0.4375rem", height: "0.4375rem", borderRadius: "50%", bgcolor: block != null ? "#35C98A" : "#6D4AFF" }} />
                  <Typography sx={{ color: "#706C7A", fontSize: "0.6875rem", fontWeight: 700 }}>{block != null ? "LIVE · SEPOLIA" : "CONNECTING"}</Typography>
                </Box>
              </Box>
              <Typography sx={{ color: "#F2F0F8", fontSize: "1.25rem", fontWeight: 600, mb: 3 }}>LATEST CHAIN RECORD</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <ShieldCheck size={24} color="#35C98A" />
                <Typography sx={{ color: "#35C98A", fontSize: "1.0625rem", fontWeight: 700 }}>NETWORK CONFIRMED</Typography>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: 2, mb: 3 }}>
                <Box sx={{ bgcolor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "0.625rem", p: 2 }}>
                  <Typography sx={{ color: "#706C7A", fontSize: "0.75rem" }}>Latest block</Typography>
                  <Typography sx={{ color: "#F2F0F8", fontSize: "0.875rem", fontFamily: "monospace" }}>{block != null ? `#${block}` : "—"}</Typography>
                </Box>
                <Box sx={{ bgcolor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "0.625rem", p: 2 }}>
                  <Typography sx={{ color: "#706C7A", fontSize: "0.75rem" }}>Block hash</Typography>
                  <Typography sx={{ color: "#F2F0F8", fontSize: "0.875rem", fontFamily: "monospace" }}>{shortHash(blockHash)}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ color: "#706C7A", fontSize: "0.75rem" }}>Network</Typography>
                  <Typography sx={{ color: "#8B72FF", fontSize: "0.875rem", fontFamily: "monospace" }}>Sepolia Ethereum</Typography>
                </Box>
                <Button onClick={copyHash} disabled={!blockHash} sx={{ border: "1px solid rgba(255,255,255,0.10)", color: "#A5A1B2", borderRadius: "0.5rem", fontSize: "0.75rem", textTransform: "none", opacity: blockHash ? 1 : 0.5 }}>{copied ? "Copied" : "Copy hash"}</Button>
              </Box>
              {block != null && (
                <Button component="a" href={`${EXPLORER_URL}/block/${block}`} target="_blank" rel="noreferrer" sx={{ mt: 2, p: 0, minWidth: 0, color: "#706C7A", fontSize: "0.75rem", textTransform: "none", textDecoration: "underline" }}>
                  View block on Etherscan
                </Button>
              )}
            </Box>
          </motion.div>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 3 }}>
          <Box className="scroll-cue-line" />
          <Typography sx={{ color: "#706C7A", fontSize: "0.6875rem" }}>SCROLL</Typography>
        </Box>
      </Container>
      <Marquee />
    </Box>
  );
};
export default Hero;


