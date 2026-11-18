import * as React from "react";
import { Box, Button, Container, Drawer, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Scan } from "lucide-react";
import { Magnetic } from "../ui/Magnetic";
import { motion, useScroll, useSpring } from "framer-motion";
const links = [
  { label: "Verify", href: "/#verify" },
  { label: "How it works", href: "/#how" },
  { label: "Records", href: "/#records" },
  { label: "Journey", href: "/#journey" },
];
export const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const loc = useLocation();
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 25, restDelta: 0.001 });
  React.useEffect(() => { setOpen(false); }, [loc.pathname]);
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, transition: "all 0.3s ease", bgcolor: scrolled ? "rgba(5,5,7,0.82)" : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.10)" : "1px solid transparent" }}>
      <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2 }}>
        <Box component={Link} to="/" sx={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: "1.875rem", height: "1.875rem", borderRadius: "0.5rem", border: "1px solid rgba(109,74,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#101016" }}>
            <Scan size={16} color="#8B72FF" />
          </Box>
          <Typography sx={{ color: "#F2F0F8", fontWeight: 800, letterSpacing: "3px", fontSize: "0.875rem" }}>AUTHENTISCAN</Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3.5 }}>
          {links.map((l) => (
            <Box key={l.label} component="a" href={l.href} sx={{ color: "#A5A1B2", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", "&:hover": { color: "#F2F0F8" } }}>{l.label}</Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Button component={Link} to="/login" sx={{ color: "#A5A1B2", fontSize: "0.875rem", fontWeight: 600, textTransform: "none" }}>Login</Button>
          </Box>
          <Magnetic>
            <Button component={Link} to="/scanner" sx={{ bgcolor: "#6D4AFF", color: "#F2F0F8", borderRadius: "0.625rem", px: 2.5, py: 1, fontSize: "0.8125rem", fontWeight: 700, textTransform: "none", border: "1px solid #6D4AFF" }}>SCAN A PRODUCT</Button>
          </Magnetic>
          <Button onClick={() => setOpen(true)} sx={{ display: { xs: "flex", md: "none" }, minWidth: 0, color: "#F2F0F8", p: 1 }}><Menu size={20} /></Button>
        </Box>
      </Container>
      <motion.div style={{ scaleX: progress, transformOrigin: "0% 50%", height: 2, width: "100%", bgcolor: "#6D4AFF" }} />
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: "#0A0A0F", width: "82vw", maxWidth: 360 } }}>
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1, height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ color: "#F2F0F8", fontWeight: 800, letterSpacing: "3px", fontSize: "0.8125rem" }}>AUTHENTISCAN</Typography>
          <Button onClick={() => setOpen(false)} sx={{ minWidth: 0, color: "#A5A1B2" }}><X size={20} /></Button>
          </Box>
          {links.map((l) => (
            <Box key={l.label} component="a" href={l.href} sx={{ color: "#F2F0F8", fontSize: "1.75rem", fontWeight: 700, py: 1.2, textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>{l.label}</Box>
          ))}
          <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button component={Link} to="/scanner" fullWidth sx={{ bgcolor: "#6D4AFF", color: "#fff", borderRadius: "0.625rem", py: 1.4, fontWeight: 700, textTransform: "none" }}>SCAN A PRODUCT</Button>
            <Button component={Link} to="/login" fullWidth variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.10)", color: "#F2F0F8", borderRadius: "0.625rem", py: 1.4, textTransform: "none" }}>Login</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
export default Navbar;

