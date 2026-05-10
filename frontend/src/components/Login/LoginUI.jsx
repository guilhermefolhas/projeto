import React from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import logoAFC from "../../assets/afc_logo_preto.png";

const LoginUI = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logoAFC}
          alt="Bilheteira AFC"
          sx={{
            width: 110,
            height: 110,
            objectFit: "contain",
            mb: 2,
            mx: "auto",
            display: "block",
          }}
        />

        {/* Título principal */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Bilheteira AFC
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Área de Cliente
        </Typography>

        {/* Formulário */}
        <Box component="form">
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            variant="outlined"
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.4,
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            ENTRAR
          </Button>

          <Typography variant="body2">
            Não tem conta?{" "}
            <Link component={RouterLink} to="/register">
              Clique aqui
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginUI;