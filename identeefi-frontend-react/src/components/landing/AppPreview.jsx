import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { LayoutDashboard, ShieldCheck, History, Store } from "lucide-react";
import { Reveal, FadeUp } from "../ui/Reveal";
import { Link } from "react-router-dom";
import { getSerialNumbers } from "../../api/liveChain";

export const AppPreview = () => {
  const [serials, setSerials] = useState([]);
  const [stats, setStats] = useState(null);

  // Real serial numbers from the backend; honest "—" / Offline fallbacks only.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await getSerialNumbers();
        if (alive) { setSerials(list.slice(0, 4)); setStats(list.length); }
      } catch (e) {
        // Backend unreachable — keep placeholders.
      }
    })();
    return () => { alive = false; };
  }, []);
  return (
    <Box className="below-fold" sx={{ py: 10, bgcolor: "#050507" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Reveal><Typography sx={{ color: "#6D4AFF", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "2px", mb: 2 }}>PLATFORM PREVIEW</Typography></Reveal>
          <Reveal delay={0.1}><Typography sx={{ color: "#F2F0F8", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 600, mb: 2 }}>EVERYTHING IN ONE PLACE</Typography></Reveal>
          <FadeUp delay={0.2}><Typography sx={{ color: "#A5A1B2", fontSize: "clamp(1rem, 2vw, 1.125rem)", maxWidth: "31.25rem", mx: "auto", lineHeight: 1.6 }}>Manage registrations, track transfers, and scan products — all in a single dashboard.</Typography></FadeUp>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: 4, alignItems: "start" }}>
          <FadeUp delay={0.1}>
            <Box sx={{ bgcolor: "#101016", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.25rem", p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, pb: 2, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
                <LayoutDashboard size={16} color="#6D4AFF" />
                <Typography sx={{ color: "#A5A1B2", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px" }}>RECENT PRODUCTS</Typography>
                <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                  <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#E9B949" }} />
                  <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#35C98A" }} />
                </Box>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: 2 }}>
                {serials.length > 0
                  ? serials.map((s, i) => (
                      <Box key={s} sx={{ bgcolor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "0.75rem", p: 2, opacity: 0.4 + 0.2 * i, "&:hover": { opacity: 1, borderColor: "rgba(109,74,255,0.5)" }, transition: "all 0.25s" }}>
                        <Typography sx={{ color: "#8B72FF", fontSize: "0.6875rem", mb: 0.5, fontFamily: "monospace" }}>Serial</Typography>
                        <Typography sx={{ color: "#F2F0F8", fontSize: "0.875rem", fontWeight: 600, fontFamily: "monospace" }}>{s}</Typography>
                      </Box>
                    ))
                  : (
                    <Box sx={{ gridColumn: "1 / -1", bgcolor: "#0A0A0F", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "0.75rem", p: 3, textAlign: "center" }}>
                      <Typography sx={{ color: "#706C7A", fontSize: "0.8125rem" }}>{stats === null ? "Backend offline — serial list unavailable" : "No products registered yet"}</Typography>
                    </Box>
                  )}
              </Box>
            </Box>
          </FadeUp>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: 2 }}>
            <FadeUp delay={0.2}>
              <Box className="record-card" sx={{ bgcolor: "#101016", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1rem", p: 2.5 }}>
                <ShieldCheck size={18} color="#35C98A" style={{ marginBottom: "0.5rem" }} />
                <Typography sx={{ color: "#F2F0F8", fontSize: "0.8125rem", fontWeight: 600 }}>Authentic</Typography>
                <Typography sx={{ color: "#706C7A", fontSize: "0.6875rem", fontFamily: "monospace" }}>{stats != null ? `${stats} serials` : "—"}</Typography>
              </Box>
            </FadeUp>
            <FadeUp delay={0.25}>
              <Box className="record-card" sx={{ bgcolor: "#101016", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1rem", p: 2.5 }}>
                <History size={18} color="#6D4AFF" style={{ marginBottom: "0.5rem" }} />
                <Typography sx={{ color: "#F2F0F8", fontSize: "0.8125rem", fontWeight: 600 }}>On-chain</Typography>
                <Typography sx={{ color: "#706C7A", fontSize: "0.6875rem", fontFamily: "monospace" }}>{stats != null ? `${stats} records` : "—"}</Typography>
              </Box>
            </FadeUp>
            <FadeUp delay={0.3}>
              <Box className="record-card" sx={{ bgcolor: "#101016", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1rem", p: 2.5 }}>
                <Store size={18} color="#E9B949" style={{ marginBottom: "0.5rem" }} />
                <Typography sx={{ color: "#F2F0F8", fontSize: "0.8125rem", fontWeight: 600 }}>Sellers</Typography>
                <Typography sx={{ color: "#706C7A", fontSize: "0.6875rem", fontFamily: "monospace" }}>Sepolia</Typography>
              </Box>
            </FadeUp>
            <FadeUp delay={0.35}>
              <Box sx={{ bgcolor: "#6D4AFF", borderRadius: "1rem", p: 2.5, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#fff", fontSize: "0.8125rem", fontWeight: 600 }}>Verify now</Typography>
                <Button component={Link} to="/scanner" sx={{ color: "#fff", fontSize: "0.6875rem", p: 0, justifyContent: "flex-start", textTransform: "none", textDecoration: "underline" }}>Open scanner →</Button>
              </Box>
            </FadeUp>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default AppPreview;



