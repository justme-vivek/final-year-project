import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export const Privacy = () => (
  <Box sx={{ bgcolor: "#050507", minHeight: "100vh", py: 12 }}>
    <Container maxWidth="md">
      <Button component={Link} to="/" sx={{ color: "#A5A1B2", mb: 4, textTransform: "none" }}><ArrowLeft size={16} style={{ marginRight: 8 }} />Back</Button>
      <Typography sx={{ color: "#F2F0F8", fontSize: "40px", fontWeight: 600, mb: 2 }}>Privacy Policy</Typography>
      <Typography sx={{ color: "#706C7A", fontSize: "14px", mb: 6 }}>Last updated October 2026</Typography>
      <Typography sx={{ color: "#A5A1B2", fontSize: "16px", lineHeight: 1.8, mb: 3 }}>AuthentiScan stores account data required for role-based access and product records required for verification. Wallet addresses are processed to sign and confirm blockchain transactions.</Typography>
      <Typography sx={{ color: "#A5A1B2", fontSize: "16px", lineHeight: 1.8, mb: 3 }}>Blockchain records are public by design. Do not register sensitive personal data as product metadata. Camera access for QR scanning stays on-device and is never uploaded.</Typography>
      <Typography sx={{ color: "#A5A1B2", fontSize: "16px", lineHeight: 1.8 }}>Contact the administrator to request account data review or removal where applicable.</Typography>
    </Container>
  </Box>
);
export default Privacy;
