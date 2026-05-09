import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Skeleton,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import axios from "axios";

// ─── Mock data – substituir por chamada à API ─────────────────────────────────
const MOCK_JOGOS = [
  { id: 1, equipa_casa: "Sporting CP", equipa_fora: "FC Porto",  data: "2025-06-14", hora: "21:00", estadio: "Estádio de Alvalade", fase: "Final" },
  { id: 2, equipa_casa: "SL Benfica",  equipa_fora: "SC Braga",  data: "2025-06-07", hora: "18:30", estadio: "Estádio da Luz",     fase: "Meia-Final" },
  { id: 3, equipa_casa: "FC Porto",    equipa_fora: "Vitória SC", data: "2025-05-31", hora: "20:45", estadio: "Estádio do Dragão", fase: "Quartos" },
  { id: 4, equipa_casa: "Boavista FC", equipa_fora: "Rio Ave FC", data: "2025-05-24", hora: "16:00", estadio: "Estádio do Bessa",  fase: "Quartos" },
  { id: 5, equipa_casa: "Paços Ferreira", equipa_fora: "Gil Vicente", data: "2025-05-17", hora: "19:00", estadio: "Estádio Capital do Móvel", fase: "Oitavos" },
  { id: 6, equipa_casa: "Estoril Praia", equipa_fora: "Santa Clara", data: "2025-05-10", hora: "20:00", estadio: "Estádio António Coimbra da Mota", fase: "Oitavos" },
];
// ─────────────────────────────────────────────────────────────────────────────

const FASES = ["Todas", "Final", "Meia-Final", "Quartos", "Oitavos"];

const iniciaisEquipa = (nome) =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "short", day: "numeric", month: "short",
  });

function JogoCard({ jogo, onClick }) {
  return (
    <Card sx={{ height: "100%", transition: "transform 0.15s, box-shadow 0.15s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.14)" } }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent>
          <Chip label={jogo.fase} size="small" color="secondary" sx={{ mb: 2, fontWeight: 600 }} />

          {/* Equipas */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 0.5, width: 48, height: 48, fontSize: "0.85rem", fontWeight: 700 }}>
                {iniciaisEquipa(jogo.equipa_casa)}
              </Avatar>
              <Typography variant="body2" fontWeight={600} noWrap>{jogo.equipa_casa}</Typography>
            </Box>

            <Typography variant="h6" fontWeight={800} color="text.secondary" sx={{ mx: 1 }}>VS</Typography>

            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Avatar sx={{ bgcolor: "secondary.dark", mx: "auto", mb: 0.5, width: 48, height: 48, fontSize: "0.85rem", fontWeight: 700 }}>
                {iniciaisEquipa(jogo.equipa_fora)}
              </Avatar>
              <Typography variant="body2" fontWeight={600} noWrap>{jogo.equipa_fora}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          {/* Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarMonthIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">{formatarData(jogo.data)}</Typography>
              <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary", ml: 1 }} />
              <Typography variant="caption" color="text.secondary">{jogo.hora}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" noWrap>{jogo.estadio}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Jogos() {
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [faseFilter, setFaseFilter] = useState("Todas");

  useEffect(() => {
    // TODO: substituir por chamada real
    // axios.get("http://localhost:5000/api/v1/jogos")
    //   .then(res => setJogos(res.data))
    //   .catch(() => setErro("Erro ao carregar os jogos."))
    //   .finally(() => setLoading(false));
    setTimeout(() => {
      setJogos(MOCK_JOGOS);
      setLoading(false);
    }, 700);
  }, []);

  const jogosFiltrados = jogos.filter((j) => {
    const matchPesquisa =
      j.equipa_casa.toLowerCase().includes(pesquisa.toLowerCase()) ||
      j.equipa_fora.toLowerCase().includes(pesquisa.toLowerCase()) ||
      j.estadio.toLowerCase().includes(pesquisa.toLowerCase());
    const matchFase = faseFilter === "Todas" || j.fase === faseFilter;
    return matchPesquisa && matchFase;
  });

  return (
    <Box sx={{ py: 6, bgcolor: "background.default", minHeight: "calc(100vh - 80px)" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" color="secondary.dark" fontWeight={700}>
            Campeonato Nacional 2025/26
          </Typography>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Todos os Jogos
          </Typography>
        </Box>

        {/* Filtros */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <TextField
            placeholder="Pesquisar equipa ou estádio…"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 220, bgcolor: "white", borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160, bgcolor: "white", borderRadius: 2 }}>
            <InputLabel>Fase</InputLabel>
            <Select
              value={faseFilter}
              label="Fase"
              onChange={(e) => setFaseFilter(e.target.value)}
            >
              {FASES.map((f) => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Erro */}
        {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

        {/* Contagem de resultados */}
        {!loading && !erro && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {jogosFiltrados.length} {jogosFiltrados.length === 1 ? "jogo encontrado" : "jogos encontrados"}
          </Typography>
        )}

        {/* Grid de jogos */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant="rounded" height={230} sx={{ borderRadius: 3 }} />
                </Grid>
              ))
            : jogosFiltrados.length === 0
              ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center", py: 10 }}>
                    <SportsSoccerIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Nenhum jogo encontrado
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                      Tenta mudar os filtros de pesquisa
                    </Typography>
                    <Button variant="outlined" onClick={() => { setPesquisa(""); setFaseFilter("Todas"); }}>
                      Limpar filtros
                    </Button>
                  </Box>
                </Grid>
              )
              : jogosFiltrados.map((jogo) => (
                <Grid key={jogo.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <JogoCard jogo={jogo} onClick={() => navigate(`/jogos/${jogo.id}`)} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}