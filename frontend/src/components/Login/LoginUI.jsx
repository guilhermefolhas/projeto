import { useState } from "react";
import { Box, Typography, TextField, Button, Link, Alert, CircularProgress } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logoAFC from "../../assets/afc_png.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const NAVY   = "#0d1540";
const NAVY2  = "#132654";
const GOLD   = "#C8A850";
const GOLD2  = "#E0C068";
const WHITE  = "#FFFFFF";
const MUTED  = "rgba(255,255,255,0.5)";
const BORDER = "rgba(255,255,255,0.1)";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: WHITE,
    bgcolor: "rgba(255,255,255,0.06)",
    borderRadius: "10px",
    "& fieldset":           { borderColor: BORDER },
    "&:hover fieldset":     { borderColor: "rgba(255,255,255,0.3)" },
    "&.Mui-focused fieldset":{ borderColor: GOLD },
  },
  "& .MuiInputLabel-root":  { color: MUTED },
  "& .MuiInputLabel-root.Mui-focused": { color: GOLD },
};

export default function LoginUI() {
  const { login } = useAuth();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro]       = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.message || "Credenciais inválidas."); return; }
      login({ token: data.AccessToken, role: data.role, email, id: data.id, id_cliente: data.id_cliente });
    } catch {
      setErro("Não foi possível ligar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: NAVY,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      // Padrão geométrico subtil
      "&::before": {
        content: '""', position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(200,168,80,0.025) 60px, rgba(200,168,80,0.025) 61px)`,
        zIndex: 0,
      },
      // Glow dourado no centro
      "&::after": {
        content: '""', position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "600px",
        background: `radial-gradient(circle, rgba(200,168,80,0.06) 0%, transparent 70%)`,
        zIndex: 0,
      },
    }}>
      <Box sx={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 420,
        mx: 2,
      }}>
        {/* Card */}
        <Box sx={{
          bgcolor: "rgba(255,255,255,0.04)",
          border: `1px solid ${BORDER}`,
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          p: { xs: 3.5, sm: 5 },
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Logo + Título */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box component="img" src={logoAFC} alt="AFC Coimbra"
              sx={{ width: 72, height: 72, objectFit: "contain", mb: 2, display: "block", mx: "auto",
                    filter: "drop-shadow(0 4px 16px rgba(200,168,80,0.3))" }}/>
            <Typography sx={{ color: WHITE, fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Bilheteira AFC
            </Typography>
            <Typography sx={{ color: MUTED, fontSize: "0.85rem", mt: 0.5 }}>
              Divisão de Elite · Coimbra
            </Typography>
          </Box>

          {/* Separador dourado */}
          <Box sx={{ height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)`, mb: 4 }}/>

          {erro && <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px", bgcolor: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", "& .MuiAlert-icon": { color: "#f87171" } }}>{erro}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField fullWidth label="Email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                sx={inputSx} inputProps={{ autoComplete: "email" }}/>
              <TextField fullWidth label="Password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                sx={inputSx} inputProps={{ autoComplete: "current-password" }}/>
            </Box>

            <Button fullWidth type="submit" disabled={loading} variant="contained"
              sx={{
                mt: 3.5, py: 1.5, borderRadius: "10px",
                fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.06em",
                background: loading ? "rgba(200,168,80,0.4)" : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
                color: NAVY2,
                boxShadow: `0 4px 20px rgba(200,168,80,0.35)`,
                "&:hover": { background: `linear-gradient(135deg, ${GOLD2} 0%, ${GOLD} 100%)`, boxShadow: `0 6px 28px rgba(200,168,80,0.5)` },
                "&:disabled": { background: "rgba(200,168,80,0.3)", color: "rgba(0,0,0,0.4)" },
                transition: "all 0.2s",
              }}>
              {loading ? <CircularProgress size={22} sx={{ color: NAVY2 }} /> : "ENTRAR"}
            </Button>
          </Box>

          {/* Separador */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }}/>
            <Typography sx={{ color: MUTED, fontSize: "0.75rem" }}>ou</Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }}/>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", color: MUTED }}>
            Ainda não tem conta?{" "}
            <Link component={RouterLink} to="/register"
              sx={{ color: GOLD, fontWeight: 700, textDecoration: "none", "&:hover": { color: GOLD2 } }}>
              Criar conta
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}