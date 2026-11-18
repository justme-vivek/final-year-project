import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Scan } from "lucide-react";
const cols = [
  { h: "Products", links: [["Product Verification", "/#verify"], ["Supply Chain", "/#journey"], ["Blockchain Records", "/#records"]] },
  { h: "Documentation", links: [["How It Works", "/#how"], ["User Guide", "/#how"], ["Smart Contracts", "/#records"]] },
  { h: "Company", links: [["About", "/"], ["Contact", "/login"]] },
  { h: "Legal", links: [["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"]] },
];
export const Footer = () => (
  <Box sx={{ bgcolor: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,0.10)", pt: 10, pb: 4 }}>
    <Container maxWidth="lg">
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: 4, mb: 8 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Scan size={18} color="#8B72FF" />
            <Typography sx={{ color: "#F2F0F8", fontWeight: 800, letterSpacing: "3px", fontSize: "0.875rem" }}>AUTHENTISCAN</Typography>
          </Box>
          <Typography sx={{ color: "#706C7A", fontSize: "0.875rem", maxWidth: 240 }}>Blockchain-powered product verification for a more transparent supply chain.</Typography>
        </Box>
        {cols.map((c) => (
          <Box key={c.h}>
            <Typography sx={{ color: "#F2F0F8", fontSize: "0.875rem", fontWeight: 700, mb: 2 }}>{c.h}</Typography>
            {c.links.map((l) => (
              <Box key={l[0]} component={Link} to={l[1]} sx={{ display: "block", color: "#A5A1B2", fontSize: "0.875rem", mb: 1.2, textDecoration: "none" }}>{l[0]}</Box>
            ))}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", pt: 3, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <Typography sx={{ color: "#706C7A", fontSize: "0.8125rem" }}>2026 AuthentiScan. All rights reserved.</Typography>
        <Typography sx={{ color: "#706C7A", fontSize: "0.8125rem" }}>Built on Sepolia Ethereum</Typography>
      </Box>
    </Container>
  </Box>
);
export default Footer;
