// src/components/Navbar/Navbar.jsx

import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import logoAFC from "../../assets/afc_png.png";

function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#102027",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 80,
          py: 1,
        }}
      >
        {/* Logo + Título */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 4,
            gap: 1.5,
          }}
        >
          <Box
            component="img"
            src={logoAFC}
            alt="Logo Associação de Futebol de Coimbra"
            sx={{
              width: 48,
              height: 48,
              objectFit: "contain",
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Bilheteira AFC
          </Typography>
        </Box>

        {/* Menu centrado */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <Button color="inherit" component={Link} to="/home">
            Início
          </Button>

          <Button color="inherit" component={Link} to="/jogos">
            Jogos
          </Button>

          <Button color="inherit" component={Link} to="/jogo-detalhes">
            Jogo Detalhes
          </Button>

          <Button color="inherit" component={Link} to="/meus-bilhetes">
            Meus Bilhetes
          </Button>

          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
        </Box>

        {/* Avatar */}
        <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>G</Avatar>

        {/* Botão Sair */}
        <Button
          variant="contained"
          color="error"
          size="small"
          component={Link}
          to="/"
        >
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;