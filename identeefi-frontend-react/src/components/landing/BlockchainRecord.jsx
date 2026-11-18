import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Copy, Check, ExternalLink, Link as LinkIcon } from "lucide-react";
import { Reveal, FadeUp } from "../ui/Reveal";
import { getLatestBlock, shortHash, EXPLORER_URL } from "../../api/liveChain";

const formatTs = (ts) => {
  if (!ts) return "—";
  try {
    return new Date(ts * 1000).toUTCString().replace(" GMT", " UTC");
  } catch (e) {
    return "—";
  }
};

export const BlockchainRecord = () => {
  const [copied, setCopied] = useState(false);
  const [block, setBlock] = useState(null);
  const cardRef = useRef(null);
  const reduced = useReducedMotion();

  // Card drifts against the scroll for depth.
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [48, -48]);

  // Real latest Sepolia block — number, hash, and timestamp are live chain data.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const latest = await getLatestBlock();
        if (alive) setBlock(latest);
      } catch (e) {
        // Offline: values stay "—".
      }
    })();
    return () => { alive = false; };
  }, []);

  const rows = [
    { k: "Network", v: "Sepolia Ethereum" },
    { k: "Block", v: block ? `#${block.number}` : "—", mono: true },
    { k: "Block hash", v: shortHash(block?.hash), mono: true },
    { k: "Timestamp", v: formatTs(block?.timestamp) },
    { k: "Source", v: "Public RPC · read-only" },
  ];
  const copy = async () => {
    if (!block?.hash) return;
    try { await navigator.clipboard.writeText(block.hash); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Box id="records" sx={{ py: 10, bgcolor: "#0A0A0F", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
      <Container maxWidth="lg">
        <Reveal><Typography sx={{ color: "#6D4AFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", mb: 5, textAlign: "center" }}>02 / PROOF</Typography></Reveal>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: 4, alignItems: "center" }}>
          <Box>
            <Reveal delay={0.05}><Typography sx={{ color: "#F2F0F8", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 600, mb: 2 }}>BLOCKCHAIN PRODUCT RECORD</Typography></Reveal>
            <FadeUp delay={0.1}><Typography sx={{ color: "#A5A1B2", fontSize: "clamp(1rem, 2vw, 1.125rem)", mb: 4, maxWidth: "27.5rem", lineHeight: 1.6 }}>Every product carries an on-chain record anyone can inspect. This panel reads the Sepolia chain live — latest block, real hash, real timestamp.</Typography></FadeUp>
            <FadeUp delay={0.2}>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button onClick={copy} disabled={!block?.hash} sx={{ border: "1px solid rgba(255,255,255,0.10)", color: "#F2F0F8", borderRadius: "0.625rem", px: 3, py: 1.3, fontWeight: 600, textTransform: "none", opacity: block?.hash ? 1 : 0.5 }}>{copied ? <Check size={16} style={{ marginRight: 8 }} /> : <Copy size={16} style={{ marginRight: 8 }} />}{copied ? "Copied" : "COPY HASH"}</Button>
                <Button component="a" href={block ? `${EXPLORER_URL}/block/${block.number}` : EXPLORER_URL} target="_blank" rel="noreferrer" sx={{ bgcolor: "#6D4AFF", color: "#fff", borderRadius: "0.625rem", px: 3, py: 1.3, fontWeight: 600, textTransform: "none" }}><ExternalLink size={16} style={{ marginRight: 8 }} />VIEW ON EXPLORER</Button>
              </Box>
            </FadeUp>
            <Typography sx={{ color: "#706C7A", fontSize: "0.75rem", mt: 3 }}>{block ? "Live data from Sepolia public RPC." : "Connecting to Sepolia…"}</Typography>
          </Box>
          <motion.div ref={cardRef} style={reduced ? undefined : { y: cardY }}>
            <Box className="spotlight-card" sx={{ bgcolor: "#101016", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.25rem", overflow: "hidden" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
                <LinkIcon size={16} color="#8B72FF" />
                <Typography sx={{ color: "#A5A1B2", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px" }}>ON-CHAIN RECORD</Typography>
                <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box className={block ? "scan-pulse-dot" : undefined} sx={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", bgcolor: block ? "#35C98A" : "#706C7A" }} />
                  <Typography sx={{ color: block ? "#35C98A" : "#706C7A", fontSize: "0.75rem", fontWeight: 700 }}>{block ? "CONFIRMED" : "SYNCING"}</Typography>
                </Box>
              </Box>
              {rows.map((r) => (
                <Box key={r.k} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, px: 3, py: 2.2, borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.2s", "&:hover": { bgcolor: "rgba(109,74,255,0.04)" } }}>
                  <Typography sx={{ color: "#706C7A", fontSize: "0.8125rem" }}>{r.k}</Typography>
                  <Typography sx={{ color: r.k === "Block hash" ? "#8B72FF" : "#F2F0F8", fontSize: "0.875rem", fontFamily: r.mono ? "monospace" : "inherit", textAlign: "right", wordBreak: "break-all" }}>{r.v}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};
export default BlockchainRecord;
