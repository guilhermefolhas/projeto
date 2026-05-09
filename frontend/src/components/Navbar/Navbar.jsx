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
        {/* Logo */}
        <Typography variant="h6" sx={{ mr: 4, fontWeight: "bold" }}>
          Bilheteira
        </Typography>

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