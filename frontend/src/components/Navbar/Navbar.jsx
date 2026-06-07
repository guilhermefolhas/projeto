import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Avatar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import logoAFC from "../../assets/afc_png.png";

const NAVY   = "#132654";
const GOLD   = "#C8A850";
const WHITE  = "#FFFFFF";
const MUTED  = "rgba(255,255,255,0.5)";
const BORDER = "rgba(255,255,255,0.1)";
const CARD   = "#1a3266";

const LINKS_LEFT = [
  { label: "Início", to: "/home" },
  { label: "Jogos",  to: "/jogos" },
];
const LINKS_RIGHT_USER  = [{ label: "Meus Bilhetes", to: "/meus-bilhetes" }];
const LINKS_RIGHT_ADMIN = [{ label: "Meus Bilhetes", to: "/meus-bilhetes" }, { label: "Admin", to: "/admin" }];

function NavLink({ label, to, location }) {
  const active = location.pathname === to;
  return (
    <Button component={Link} to={to} disableRipple sx={{
      color: active ? WHITE : MUTED,
      fontWeight: active ? 700 : 500,
      fontSize: "0.875rem",
      textTransform: "none",
      px: 1.8, py: 0.8,
      borderRadius: "6px",
      position: "relative",
      bgcolor: active ? "rgba(255,255,255,0.08)" : "transparent",
      "&:hover": { bgcolor: "rgba(255,255,255,0.07)", color: WHITE },
      "&::after": active ? {
        content: '""', position: "absolute",
        bottom: -1, left: "20%", right: "20%",
        height: "2px", bgcolor: GOLD, borderRadius: "2px",
      } : {},
    }}>
      {label}
    </Button>
  );
}

export default function Navbar() {
  const location         = useLocation();
  const { user, logout } = useAuth();
  const [dialogo, setDialogo] = useState(false);

  const linksRight = user?.role === "admin" ? LINKS_RIGHT_ADMIN : LINKS_RIGHT_USER;
  const iniciais   = user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <>
      <AppBar position="fixed" elevation={0}
        sx={{ backgroundColor: NAVY, borderBottom: `1px solid ${BORDER}`, zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 4 }, display: "flex", alignItems: "center" }}>

          {/* Coluna esquerda */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
            {LINKS_LEFT.map((l) => <NavLink key={l.to} {...l} location={location} />)}
          </Box>

          {/* Logo ao centro */}
          <Box component={Link} to="/home"
            sx={{ mx: 3, display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <Box component="img" src={logoAFC} alt="Logo AFC"
              sx={{ width: 48, height: 48, objectFit: "contain", transition: "transform 0.2s", "&:hover": { transform: "scale(1.08)" } }} />
          </Box>

          {/* Coluna direita */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 0.5 }}>
            {linksRight.map((l) => <NavLink key={l.to} {...l} location={location} />)}
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: GOLD, fontSize: "0.8rem", fontWeight: 800, color: NAVY }}>
                {iniciais}
              </Avatar>
              <Button onClick={() => setDialogo(true)} size="small"
                sx={{ color: MUTED, fontWeight: 600, fontSize: "0.82rem", textTransform: "none",
                  border: `1px solid ${BORDER}`, borderRadius: "6px", px: 2, py: 0.7,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.4)", color: WHITE } }}>
                Sair
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dialog de confirmação */}
      <Dialog open={dialogo} onClose={() => setDialogo(false)}
        PaperProps={{ sx: { bgcolor: CARD, backgroundImage: "none", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden", p: 0 } }}>
        <Box sx={{ bgcolor: CARD }}>
          <DialogTitle sx={{ color: WHITE, fontWeight: 700, pb: 1 }}>Terminar sessão</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: MUTED }}>
              Tem a certeza que pretende terminar a sessão?
            </DialogContentText>
          </DialogContent>
          <Box sx={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <Button onClick={() => setDialogo(false)} fullWidth
              sx={{ color: WHITE, fontWeight: 700, py: 1.5, borderRadius: 0,
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
              Cancelar
            </Button>
            <Button onClick={() => { setDialogo(false); logout(); }} fullWidth
              sx={{ color: WHITE, fontWeight: 700, py: 1.5, borderRadius: 0,
                bgcolor: "#1A6DFF", "&:hover": { bgcolor: "#1558cc" } }}>
              Sair
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}