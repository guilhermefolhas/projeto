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

const RegisterUI = () => {
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
          Criar Conta de Cliente
        </Typography>

        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
          />

          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2, mb: 2 }}
          >
            REGISTAR
          </Button>

          <Typography variant="body2">
            Já tem conta?{" "}
            <Link component={RouterLink} to="/">
              Entre aqui
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterUI;