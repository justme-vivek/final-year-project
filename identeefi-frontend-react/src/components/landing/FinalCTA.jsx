import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Scan } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Magnetic } from "../ui/Magnetic";
export const FinalCTA = () => (
  <Box sx={{ py: 10, bgcolor: "#050507", textAlign: "center" }}>
    <Container maxWidth="md">
      <Reveal><Typography sx={{ color: "#6D4AFF", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", mb: 3 }}>05 / START</Typography></Reveal>
      <Reveal delay={0.05}><Typography sx={{ color: "#F2F0F8", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, lineHeight: 1.05, mb: 3 }}>TRUST THE RECORD.<br />VERIFY ANYTHING.</Typography></Reveal>
      <Typography sx={{ color: "#A5A1B2", fontSize: "clamp(1rem, 2vw, 1.125rem)", mb: 5 }}>Scan a product QR code and see its blockchain record in seconds.</Typography>
      <Magnetic>
        <Button component={Link} to="/scanner" sx={{ bgcolor: "#6D4AFF", color: "#fff", borderRadius: "0.625rem", px: 5, py: 1.8, fontSize: "1rem", fontWeight: 700, textTransform: "none", border: "1px solid #6D4AFF" }}><Scan size={20} style={{ marginRight: 10 }} />SCAN A PRODUCT</Button>
      </Magnetic>
    </Container>
  </Box>
);
export default FinalCTA;
