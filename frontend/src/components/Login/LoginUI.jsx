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

const LoginUI = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Entrar na Área de Cliente
        </Typography>

        <Box component="form" sx={{ mt: 2 }}>
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
            sx={{ mt: 2, mb: 2 }}
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