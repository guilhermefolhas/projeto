import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

function RegisterUI() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ username, email, password });
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 12, p: 4, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Criar Conta de Cliente
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Username"
            placeholder="Escolha um nome de utilizador"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            placeholder="nome@exemplo.com"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            placeholder="Sua password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            color="success"
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Registar
          </Button>

          <Typography variant="body2">
            Já tem conta? <Link to="/">Entre aqui</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterUI;