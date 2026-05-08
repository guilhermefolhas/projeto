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
    <AppBar position="static" sx={{ backgroundColor: "#102027" }}>
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

        {/* Menu centrado com mais espaço entre os botões */}
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

          <Button color="inherit" component={Link} to="/meus-bilhetes">
            Meus Bilhetes
          </Button>

          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
        </Box>

        {/* Utilizador e botão sair */}
        <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>G</Avatar>

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