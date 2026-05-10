import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar, Chip,
  Button, FormControl, InputLabel, Select, MenuItem, TextField, Divider,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Skeleton, Paper, List, ListItem, ListItemIcon, ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import EuroIcon from "@mui/icons-material/Euro";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import axios from "axios";
import logoVigor from "../../assets/vigor.png";
import logoEsperanca from "../../assets/esperanca.jpeg";
import logoUniao from "../../assets/uniao.jpeg";
import logoTourizense from "../../assets/tourizense.png";
import logoAcademica from "../../assets/academica.png";
import logoNogueirense from "../../assets/nogueirense.png";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA – edita aqui os detalhes do jogo (será substituído pela API)
// morada   = morada do estádio (campo do API: estadio.morada)
// lotacao  = lotação máxima    (campo do API: estadio.lotacao)
// preco_base = preço do bilhete (campo do API: estadio.preco_base)
// Logo: coloca os ficheiros PNG em frontend/public/logos/
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_JOGOS = [
  {
    id: 1,
    equipa_casa: "GR Vigor M",    logo_casa: logoVigor,
    equipa_fora: "Esperança AC",  logo_fora: logoEsperanca,
    data: "2025-06-14", hora: "21:00", jornada: 34,
    estadio: "Campo dos Sardões",
    morada: "Rua B, Fala, Coimbra",
    lotacao: 2000, preco_base: 4.50,
  },
  {
    id: 2,
    equipa_casa: "União 1919",    logo_casa: logoUniao,
    equipa_fora: "GD Tourizense", logo_fora: logoTourizense,
    data: "2025-06-14", hora: "17:00", jornada: 34,
    estadio: "Estádio Municipal Sérgio Conceição",
    morada: "Av. do Estádio, Coimbra",
    lotacao: 1500, preco_base: 3.50,
  },
  {
    id: 3,
    equipa_casa: "Académica SF",   logo_casa: logoAcademica,
    equipa_fora: "AD Nogueirense", logo_fora: logoNogueirense,
    data: "2025-06-14", hora: "18:30", jornada: 34,
    estadio: "Estádio Universitário",
    morada: "Rua do Estádio Universitário, Coimbra",
    lotacao: 3000, preco_base: 5.00,
  },
  {
    id: 4,
    equipa_casa: "GD Tourizense", logo_casa: logoTourizense,
    equipa_fora: "GR Vigor M",    logo_fora: logoVigor,
    data: "2025-06-07", hora: "21:00", jornada: 33,
    estadio: "Parque Desportivo Visconde Vinhal",
    morada: "Rua do Parque, Tomar",
    lotacao: 800, preco_base: 3.00,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const iniciaisEquipa = (nome) =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

export default function JogoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jogo, setJogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [snackbar, setSnackbar] = useState({ aberto: false, msg: "", tipo: "success" });

  useEffect(() => {
    // TODO: substituir por chamada real
    // axios.get(`http://localhost:5000/api/v3/jogo/${id}`)
    //   .then(res => setJogo(res.data))
    //   .finally(() => setLoading(false));
    setTimeout(() => {
      const encontrado = MOCK_JOGOS.find((j) => j.id === Number(id)) || MOCK_JOGOS[0];
      setJogo(encontrado);
      setLoading(false);
    }, 600);
  }, [id]);

  const totalPreco = jogo ? (jogo.preco_base * quantidade).toFixed(2) : null;

  const handleComprar = () => setDialogAberto(true);

  const handleConfirmarCompra = async () => {
    setDialogAberto(false);
    try {
      // TODO: substituir por chamada real
      // await axios.post("http://localhost:5000/api/v3/compra", {
      //   id_jogo: id,
      //   quantidade,
      // });
      await new Promise((r) => setTimeout(r, 600));
      setSnackbar({ aberto: true, msg: `${quantidade} bilhete(s) comprado(s) com sucesso!`, tipo: "success" });
      setQuantidade(1);
    } catch {
      setSnackbar({ aberto: true, msg: "Erro ao processar a compra. Tenta novamente.", tipo: "error" });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton variant="rounded" height={240} sx={{ mb: 3, borderRadius: 3 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}><Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} /></Grid>
          <Grid size={{ xs: 12, md: 5 }}><Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} /></Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "calc(100vh - 80px)", pb: 8 }}>

      {/* HERO DO JOGO */}
      <Box sx={{ bgcolor: "primary.main", py: { xs: 5, md: 7 }, px: 2 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/jogos")}
              sx={{ color: "rgba(255,255,255,0.8)", mb: 4, "&:hover": { color: "white" } }}
            >
              Voltar aos Jogos
            </Button>
          </Box>

          <Chip
            label={`Jornada ${jogo.jornada}`}
            sx={{ bgcolor: "secondary.main", color: "black", fontWeight: 700, mb: 4, mx: "auto", width: "fit-content" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 3, md: 8 }, flexWrap: "wrap", mb: 4 }}>
            {/* Equipa Casa */}
            <Box sx={{ textAlign: "center", minWidth: 180 }}>
              <Avatar
                src={jogo.logo_casa}
                sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 96, height: 96, mx: "auto", mb: 1.5, fontSize: "1.6rem", fontWeight: 700, color: "white", border: "2px solid rgba(255,255,255,0.35)" }}
              >
                {iniciaisEquipa(jogo.equipa_casa)}
              </Avatar>
              <Typography variant="h5" color="white" fontWeight={700}>{jogo.equipa_casa}</Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">Casa</Typography>
            </Box>

            <Typography variant="h2" sx={{ color: "white", fontWeight: 900, lineHeight: 1 }}>VS</Typography>

            {/* Equipa Fora */}
            <Box sx={{ textAlign: "center", minWidth: 180 }}>
              <Avatar
                src={jogo.logo_fora}
                sx={{ bgcolor: "rgba(200,169,81,0.2)", width: 96, height: 96, mx: "auto", mb: 1.5, fontSize: "1.6rem", fontWeight: 700, color: "secondary.main", border: "2px solid rgba(200,169,81,0.45)" }}
              >
                {iniciaisEquipa(jogo.equipa_fora)}
              </Avatar>
              <Typography variant="h5" color="white" fontWeight={700}>{jogo.equipa_fora}</Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">Fora</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
            <Chip icon={<CalendarMonthIcon />} label={formatarData(jogo.data)} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", px: 1, "& .MuiChip-icon": { color: "secondary.main" } }} />
            <Chip icon={<AccessTimeIcon />} label={jogo.hora} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", px: 1, "& .MuiChip-icon": { color: "secondary.main" } }} />
            <Chip icon={<LocationOnIcon />} label={jogo.estadio} sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", px: 1, "& .MuiChip-icon": { color: "secondary.main" } }} />
          </Box>
        </Container>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Container maxWidth="lg" sx={{ pt: 5, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={4}>

          {/* Info do estádio */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Informações do Estádio</Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}><LocationOnIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Nome" secondary={jogo.estadio}
                      primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                      secondaryTypographyProps={{ variant: "body2", fontWeight: 600, color: "text.primary" }}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}><LocationOnIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Morada" secondary={jogo.morada}
                      primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                      secondaryTypographyProps={{ variant: "body2", fontWeight: 600, color: "text.primary" }}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}><PeopleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Lotação" secondary={`${Number(jogo.lotacao).toLocaleString("pt-PT")} lugares`}
                      primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                      secondaryTypographyProps={{ variant: "body2", fontWeight: 600, color: "text.primary" }}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}><EuroIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Preço do bilhete" secondary={`${Number(jogo.preco_base).toFixed(2)}€`}
                      primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                      secondaryTypographyProps={{ variant: "body2", fontWeight: 600, color: "text.primary" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Compra de bilhetes */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, position: "sticky", top: 100 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <ConfirmationNumberIcon color="secondary" />
                  <Typography variant="h6" fontWeight={700}>Comprar Bilhetes</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <TextField
                  fullWidth
                  label="Quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ mb: 3 }}
                />

                <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "primary.main", borderColor: "primary.main" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Bilhete × {quantidade}</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">{totalPreco}€</Typography>
                  </Box>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1" color="white" fontWeight={700}>Total</Typography>
                    <Typography variant="h6" color="secondary.main" fontWeight={700}>{totalPreco}€</Typography>
                  </Box>
                </Paper>

                <Button fullWidth variant="contained" color="secondary" size="large" onClick={handleComprar} sx={{ py: 1.4 }}>
                  Comprar Agora
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* DIALOG DE CONFIRMAÇÃO */}
      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Confirmar Compra</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vais comprar <strong>{quantidade} bilhete(s)</strong> para{" "}
            <strong>{jogo?.equipa_casa} vs {jogo?.equipa_fora}</strong> no valor total de{" "}
            <strong>{totalPreco}€</strong>. Confirmas?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogAberto(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmarCompra} variant="contained" color="secondary">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.aberto}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, aberto: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.tipo} variant="filled" sx={{ width: "100%" }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}