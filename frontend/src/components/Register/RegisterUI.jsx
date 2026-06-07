import { useState } from "react";
import { Box, Typography, TextField, Button, Link, Alert, CircularProgress, Grid, InputAdornment } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
    "& fieldset":            { borderColor: BORDER },
    "&:hover fieldset":      { borderColor: "rgba(255,255,255,0.3)" },
    "&.Mui-focused fieldset":{ borderColor: GOLD },
  },
  "& .MuiInputLabel-root":             { color: MUTED },
  "& .MuiInputLabel-root.Mui-focused": { color: GOLD },
  "& .MuiFormHelperText-root":         { color: MUTED },
};

export default function RegisterUI() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ nome: "", email: "", password: "", nif: "", telemovel: "", dta_nascimento: "" });
  const [erro, setErro]       = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (campo) => (e) => setForm(f => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.message || "Erro ao criar conta."); return; }
      navigate("/");
    } catch {
      setErro("Não foi possível ligar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: NAVY,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""', position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(200,168,80,0.025) 60px, rgba(200,168,80,0.025) 61px)`,
      },
      "&::after": {
        content: '""', position: "absolute",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "700px", height: "700px",
        background: `radial-gradient(circle, rgba(200,168,80,0.05) 0%, transparent 70%)`,
      },
    }}>
      <Box sx={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 780, mx: 3 }}>
        <Box sx={{
          bgcolor: "rgba(255,255,255,0.04)",
          border: `1px solid ${BORDER}`,
          borderRadius: "20px",
          backdropFilter: "blur(20px)",
          p: { xs: 3, sm: 4 },
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3.5 }}>
            <Box component="img" src={logoAFC} alt="AFC Coimbra"
              sx={{ width: 60, height: 60, objectFit: "contain", mb: 1.5, display: "block", mx: "auto",
                filter: "drop-shadow(0 4px 16px rgba(200,168,80,0.3))" }}/>
            <Typography sx={{ color: WHITE, fontWeight: 900, fontSize: "1.5rem" }}>Criar Conta</Typography>
            <Typography sx={{ color: MUTED, fontSize: "0.82rem", mt: 0.5 }}>Divisão de Elite · AFC Coimbra</Typography>
          </Box>

          <Box sx={{ height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)`, mb: 3.5 }}/>

          {erro && <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px", bgcolor: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", "& .MuiAlert-icon": { color: "#f87171" } }}>{erro}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Todos os campos num único Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Nome completo" required value={form.nome}
                  onChange={handleChange("nome")} sx={inputSx} inputProps={{ autoComplete: "name" }}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Email" type="email" required value={form.email}
                  onChange={handleChange("email")} sx={inputSx} inputProps={{ autoComplete: "email" }}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Password" type="password" required value={form.password}
                  onChange={handleChange("password")} sx={inputSx} inputProps={{ autoComplete: "new-password" }}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ display: "block", mb: 0.5, visibility: "hidden" }}>_</Typography>
                <TextField fullWidth label="NIF" required value={form.nif}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 9) setForm(f => ({ ...f, nif: val }));
                  }}
                  error={form.nif.length > 0 && form.nif.length !== 9}
                  helperText={form.nif.length > 0 && form.nif.length !== 9 ? "Deve ter 9 dígitos" : `${form.nif.length}/9`}
                  sx={inputSx} inputProps={{ maxLength: 9, inputMode: "numeric" }}/>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                <Typography variant="caption" sx={{ display: "block", mb: 0.5, visibility: "hidden" }}>_</Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Box sx={{
                    display: "flex", alignItems: "center", px: 1.5, height: "56px",
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRight: "none", borderRadius: "10px 0 0 10px", flexShrink: 0,
                  }}>
                    <Typography sx={{ color: MUTED, fontSize: "0.9rem", fontWeight: 600 }}>+351</Typography>
                  </Box>
                  <TextField fullWidth label="Telemóvel" value={form.telemovel}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 9) setForm(f => ({ ...f, telemovel: val }));
                    }}
                    helperText={`${form.telemovel.length}/9`}
                    inputProps={{ maxLength: 9, inputMode: "numeric" }}
                    sx={{ ...inputSx, "& .MuiOutlinedInput-root": { ...inputSx["& .MuiOutlinedInput-root"], borderRadius: "0 10px 10px 0" } }}/>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" sx={{ color: MUTED, ml: 0.5, display: "block", mb: 0.5 }}>Data de Nascimento</Typography>
                <TextField fullWidth type="date" value={form.dta_nascimento}
                  onChange={handleChange("dta_nascimento")}
                  helperText={`\u00A0`}
                  sx={{ ...inputSx, "& .MuiOutlinedInput-input": { colorScheme: "dark" } }}/>
              </Grid>
            </Grid>

            <Button fullWidth type="submit" disabled={loading}
              sx={{
                mt: 3.5, py: 1.5, borderRadius: "10px",
                fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.06em",
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
                color: NAVY2,
                boxShadow: `0 4px 20px rgba(200,168,80,0.35)`,
                "&:hover": { background: `linear-gradient(135deg, ${GOLD2} 0%, ${GOLD} 100%)` },
              }}>
              {loading ? <CircularProgress size={22} sx={{ color: NAVY2 }} /> : "CRIAR CONTA"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }}/>
            <Typography sx={{ color: MUTED, fontSize: "0.75rem" }}>ou</Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER }}/>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", color: MUTED }}>
            Já tem conta?{" "}
            <Link component={RouterLink} to="/"
              sx={{ color: GOLD, fontWeight: 700, textDecoration: "none", "&:hover": { color: GOLD2 } }}>
              Entrar
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}