import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, CircularProgress, Container, Checkbox, FormControlLabel } from "@mui/material";
import { CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from "framer-motion";

const LOGIN_URL = '/auth';

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${LOGIN_URL}/${user}/${pwd}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res?.data.length === 0) {
        setErrMsg('Login Failed. Please try again later.');
      } else {
        const role = res?.data[0].role;
        setAuth({ user, pwd, role });
        setUser('');
        setPwd('');
        navigate(`/${role}`, { replace: true });
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('Server is down. Please try again later.');
      } else if (err.response?.status === 400) {
        setErrMsg('Invalid username or password.');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized access.');
      } else {
        setErrMsg('Login Failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      color: "#F2F0F8",
      backgroundColor: "#15151D",
      borderRadius: "10px",
      "& fieldset": { borderColor: "rgba(255,255,255,0.10)" },
      "&:hover fieldset": { borderColor: "rgba(109,74,255,0.45)" },
      "&.Mui-focused fieldset": {
        borderColor: "#6D4AFF",
        boxShadow: "0 0 12px rgba(109,74,255,0.2)",
      },
    },
    "& .MuiInputLabel-root": { color: "#706C7A" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#6D4AFF" },
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#050507", fontFamily: "'Manrope', sans-serif" }}>
      <Grid container sx={{ minHeight: "100vh" }}>
        
        {/* Left Side: Product Story */}
        <Grid item xs={12} md={5} lg={6} sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          p: 8,
          bgcolor: "#0A0A0F",
          borderRight: "1px solid rgba(255,255,255,0.10)",
        }}>
          <Typography sx={{ color: "#6D4AFF", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", mb: 2, textTransform: "uppercase" }}>
            AuthentiScan
          </Typography>
          <Typography variant="h3" sx={{ color: "#F2F0F8", fontWeight: 700, mb: 2 }}>
            Blockchain-powered product authentication.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 6 }}>
            {["Immutable product records", "QR-based verification", "Supply-chain traceability", "Smart-contract verification"].map((item, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircle size={20} color="#6D4AFF" />
                <Typography sx={{ color: "#A5A1B2", fontSize: "18px" }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right Side: Login Form */}
        <Grid item xs={12} md={7} lg={6} sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 4, sm: 8, lg: 12 },
        }}>
          
          <Button component={Link} to="/" sx={{ color: "#A5A1B2", alignSelf: "flex-start", mb: 4, textTransform: "none", "&:hover": { color: "#F2F0F8" } }}>
            <ArrowLeft size={18} style={{ marginRight: 8 }} /> Back to home
          </Button>

          <Typography variant="h4" sx={{ color: "#F2F0F8", fontWeight: 700, mb: 1 }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: "#A5A1B2", mb: 6 }}>
            Access your AuthentiScan workspace.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            
            {errMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2, mb: 4, bgcolor: "rgba(224, 90, 109, 0.1)", border: "1px solid #E05A6D", borderRadius: "10px" }}>
                  <AlertTriangle size={20} color="#E05A6D" />
                  <Typography ref={errRef} sx={{ color: "#E05A6D", fontSize: "14px", fontWeight: 600 }}>{errMsg}</Typography>
                </Box>
              </motion.div>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={user}
              onChange={(e) => setUser(e.target.value)}
              variant="outlined"
              sx={textFieldStyles}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              variant="outlined"
              sx={{ ...textFieldStyles, mt: 3 }}
            />

            <FormControlLabel
              control={<Checkbox color="primary" sx={{ color: "rgba(255,255,255,0.3)", "&.Mui-checked": { color: "#6D4AFF" } }} />}
              label={<Typography sx={{ color: "#A5A1B2", fontSize: "14px" }}>Remember me</Typography>}
              sx={{ mt: 2, mb: 4 }}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: "#6D4AFF",
                color: "#F2F0F8",
                py: 1.5,
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "16px",
                textTransform: "none",
                display: "flex",
                gap: 1.5,
                "&:hover": { bgcolor: "#4F23F8" },
                "&:disabled": { bgcolor: "#3A2A85", color: "rgba(255,255,255,0.5)" }
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "#F2F0F8" }} />
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}