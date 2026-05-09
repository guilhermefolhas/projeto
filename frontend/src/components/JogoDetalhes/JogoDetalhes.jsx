import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import axios from "axios";

const MOCK_JOGO = {
  id: 1,
  equipa_casa: "Sporting CP",
  equipa_fora: "FC Porto",
  data: "2025-06-14",
  hora: "21:00",
  estadio: "Estádio de Alvalade",
  cidade: "Lisboa",
  capacidade: 50000,
  fase: "Final",
};

const CATEGORIAS_BILHETE = [
  { id: 1, nome: "Geral", preco: 15 },
  { id: 2, nome: "Bancada Norte", preco: 25 },
  { id: 3, nome: "Bancada Sul", preco: 25 },
  { id: 4, nome: "Tribuna Central", preco: 55 },
  { id: 5, nome: "Camarote VIP", preco: 120 },
];

const iniciaisEquipa = (nome) =>
  nome
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function JogoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jogo, setJogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriaId, setCategoriaId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [snackbar, setSnackbar] = useState({
    aberto: false,
    msg: "",
    tipo: "success",
  });

  useEffect(() => {
    // TODO: substituir por chamada real
    // axios.get(`http://localhost:5000/api/v1/jogos/${id}`)
    //   .then(res => setJogo(res.data))
    //   .finally(() => setLoading(false));

    setTimeout(() => {
      setJogo(MOCK_JOGO);
      setLoading(false);
    }, 600);
  }, [id]);

  const categoriaEscolhida = CATEGORIAS_BILHETE.find(
    (c) => c.id === categoriaId
  );

  const totalPreco = categoriaEscolhida
    ? (categoriaEscolhida.preco * quantidade).toFixed(2)
    : null;

  const handleComprar = () => {
    if (!categoriaId) {
      setSnackbar({
        aberto: true,
        msg: "Escolhe uma categoria de bilhete.",
        tipo: "warning",
      });
      return;
    }

    setDialogAberto(true);
  };

  const handleConfirmarCompra = async () => {
    setDialogAberto(false);

    try {
      // TODO: substituir por chamada real
      // await axios.post("http://localhost:5000/api/v1/compras", {
      //   jogo_id: id,
      //   bilhete_id: categoriaId,
      //   quantidade,
      // });

      await new Promise((r) => setTimeout(r, 600));

      setSnackbar({
        aberto: true,
        msg: `${quantidade} bilhete(s) comprado(s) com sucesso!`,
        tipo: "success",
      });

      setCategoriaId("");
      setQuantidade(1);
    } catch {
      setSnackbar({
        aberto: true,
        msg: "Erro ao processar a compra. Tenta novamente.",
        tipo: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton
          variant="rounded"
          height={240}
          sx={{ mb: 3, borderRadius: 3 }}
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "calc(100vh - 80px)",
        pb: 8,
      }}
    >
      {/* HERO DO JOGO */}
      <Box sx={{ bgcolor: "primary.main", py: { xs: 5, md: 7 }, px: 2 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/jogos")}
              sx={{
                color: "rgba(255,255,255,0.8)",
                mb: 4,
                "&:hover": { color: "white" },
              }}
            >
              Voltar aos Jogos
            </Button>
          </Box>

          <Chip
            label={jogo.fase}
            sx={{
              bgcolor: "secondary.main",
              color: "black",
              fontWeight: 700,
              mb: 4,
              mx: "auto",
              width: "fit-content",
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 3, md: 8 },
              flexWrap: "wrap",
              mb: 4,
            }}
          >
            <Box sx={{ textAlign: "center", minWidth: 180 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  width: 96,
                  height: 96,
                  mx: "auto",
                  mb: 1.5,
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "white",
                  border: "2px solid rgba(255,255,255,0.35)",
                }}
              >
                {iniciaisEquipa(jogo.equipa_casa)}
              </Avatar>

              <Typography variant="h5" color="white" fontWeight={700}>
                {jogo.equipa_casa}
              </Typography>

              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                Casa
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              VS
            </Typography>

            <Box sx={{ textAlign: "center", minWidth: 180 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(200,169,81,0.2)",
                  width: 96,
                  height: 96,
                  mx: "auto",
                  mb: 1.5,
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "secondary.main",
                  border: "2px solid rgba(200,169,81,0.45)",
                }}
              >
                {iniciaisEquipa(jogo.equipa_fora)}
              </Avatar>

              <Typography variant="h5" color="white" fontWeight={700}>
                {jogo.equipa_fora}
              </Typography>

              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                Fora
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={<CalendarMonthIcon />}
              label={formatarData(jogo.data)}
              sx={{
                bgcolor: "rgba(255,255,255,0.14)",
                color: "white",
                px: 1,
                "& .MuiChip-icon": { color: "secondary.main" },
              }}
            />

            <Chip
              icon={<AccessTimeIcon />}
              label={jogo.hora}
              sx={{
                bgcolor: "rgba(255,255,255,0.14)",
                color: "white",
                px: 1,
                "& .MuiChip-icon": { color: "secondary.main" },
              }}
            />

            <Chip
              icon={<LocationOnIcon />}
              label={jogo.estadio}
              sx={{
                bgcolor: "rgba(255,255,255,0.14)",
                color: "white",
                px: 1,
                "& .MuiChip-icon": { color: "secondary.main" },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Container maxWidth="lg" sx={{ pt: 5, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Informações do Estádio
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LocationOnIcon color="primary" fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                      primary="Nome"
                      secondary={jogo.estadio}
                      primaryTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    />
                  </ListItem>

                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LocationOnIcon color="primary" fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                      primary="Cidade"
                      secondary={jogo.cidade}
                      primaryTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    />
                  </ListItem>

                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PeopleIcon color="primary" fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                      primary="Capacidade"
                      secondary={`${jogo.capacidade.toLocaleString(
                        "pt-PT"
                      )} lugares`}
                      primaryTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ position: "sticky", top: 100, borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <ConfirmationNumberIcon color="secondary" />

                  <Typography variant="h6" fontWeight={700}>
                    Comprar Bilhetes
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Categoria</InputLabel>

                  <Select
                    value={categoriaId}
                    label="Categoria"
                    onChange={(e) => setCategoriaId(e.target.value)}
                  >
                    {CATEGORIAS_BILHETE.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span>{c.nome}</span>

                          <Typography
                            variant="body2"
                            color="secondary.dark"
                            fontWeight={600}
                          >
                            {c.preco}€
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) =>
                    setQuantidade(
                      Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                    )
                  }
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ mb: 3 }}
                />

                {categoriaEscolhida && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 3,
                      bgcolor: "primary.main",
                      borderColor: "primary.main",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        {categoriaEscolhida.nome} × {quantidade}
                      </Typography>

                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        {(categoriaEscolhida.preco * quantidade).toFixed(2)}€
                      </Typography>
                    </Box>

                    <Divider
                      sx={{
                        borderColor: "rgba(255,255,255,0.15)",
                        my: 1,
                      }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" color="white" fontWeight={700}>
                        Total
                      </Typography>

                      <Typography
                        variant="h6"
                        color="secondary.main"
                        fontWeight={700}
                      >
                        {totalPreco}€
                      </Typography>
                    </Box>
                  </Paper>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleComprar}
                  sx={{ py: 1.4, borderRadius: 2, fontWeight: 700 }}
                >
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={dialogAberto}
        onClose={() => setDialogAberto(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Confirmar Compra</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Vais comprar <strong>{quantidade} bilhete(s)</strong> para a
            categoria <strong>{categoriaEscolhida?.nome}</strong> no valor total
            de <strong>{totalPreco}€</strong>. Confirmas?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogAberto(false)} color="inherit">
            Cancelar
          </Button>

          <Button
            onClick={handleConfirmarCompra}
            variant="contained"
            color="secondary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.aberto}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, aberto: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.tipo} variant="filled" sx={{ width: "100%" }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}