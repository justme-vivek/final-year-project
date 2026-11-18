import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export const Preloader = ({ onDone }) => {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    try { sessionStorage.setItem("as-preloaded", "1"); } catch (e) {}
    setExiting(true);
    setTimeout(() => onDone && onDone(), 450);
  }, [onDone]);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min(100, Math.floor(((Date.now() - start) / 1100) * 100));
      setCount(p);
      if (p >= 100) {
        clearInterval(t);
        setTimeout(finish, 350);
      }
    }, 30);
    return () => clearInterval(t);
  }, [finish]);

  // Safety timeout: force-hide preloader after 6 seconds max so it never
  // leaves the screen black even if something goes wrong.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!exiting) {
        setExiting(true);
        setTimeout(() => onDone && onDone(), 450);
      }
    }, 6000);
    return () => clearTimeout(t);
  }, [exiting]);

  return (
    <motion.div
      initial={false}
      animate={exiting ? { y: "-100%", opacity: 0, filter: "blur(6px)" } : { y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#050507", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}
    >
      <Typography sx={{ color: "#F2F0F8", fontSize: "13px", fontWeight: 700, letterSpacing: "4px" }}>AUTHENTISCAN</Typography>
      <Typography sx={{ color: "#6D4AFF", fontSize: "56px", fontWeight: 700, fontFamily: "monospace" }}>{String(count).padStart(3, "0")}</Typography>
      <Box sx={{ width: "90%", maxWidth: 200, height: 2, bgcolor: "rgba(255,255,255,0.10)", borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ width: `${count}%`, height: "100%", bgcolor: "#6D4AFF" }} />
      </Box>
    </motion.div>
  );
};

export default Preloader;

