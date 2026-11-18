import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export const Terms = () => (
  <Box sx={{ bgcolor: "#050507", minHeight: "100vh", py: 12 }}>
    <Container maxWidth="md">
      <Button component={Link} to="/" sx={{ color: "#A5A1B2", mb: 4, textTransform: "none" }}><ArrowLeft size={16} style={{ marginRight: 8 }} />Back</Button>
      <Typography sx={{ color: "#F2F0F8", fontSize: "40px", fontWeight: 600, mb: 2 }}>Terms of Service</Typography>
      <Typography sx={{ color: "#706C7A", fontSize: "14px", mb: 6 }}>Last updated October 2026</Typography>
      <Typography sx={{ color: "#A5A1B2", fontSize: "16px", lineHeight: 1.8, mb: 3 }}>AuthentiScan provides blockchain-powered product verification. Product records are anchored on Sepolia Ethereum. Registration requires an authorized manufacturer, supplier, or retailer account.</Typography>
      <Typography sx={{ color: "#A5A1B2", fontSize: "16px", lineHeight: 1.8, mb: 3 }}>Verification results reflect on-chain data at time of query. Demo data on the landing page is labeled and does not represent live records. Users are responsible for wallet security and transaction confirmation.</Typography>
      <Typography sx={{ color: "#A5A1B2", fontSize: "16px", lineHeight: 1.8 }}>Contact the administrator for account issues or record disputes.</Typography>
    </Container>
  </Box>
);
export default Terms;
