import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActionArea,
  Chip, Avatar, TextField, Select, MenuItem, FormControl, InputLabel,
  InputAdornment, Skeleton, Alert, Divider, Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import logoVigor from "../../assets/vigor.png";
import logoEsperanca from "../../assets/esperanca.jpeg";
import logoUniao from "../../assets/uniao.jpeg";
import logoTourizense from "../../assets/tourizense.png";
import logoAcademica from "../../assets/academica.png";
import logoNogueirense from "../../assets/nogueirense.png";

const MOCK_JOGOS = [
  {
    id: 1,
    equipa_casa: "GR Vigor M",    logo_casa: logoVigor,
    equipa_fora: "Esperança AC",  logo_fora: logoEsperanca,
    data: "2025-06-14", hora: "21:00",
    estadio: "Campo dos Sardões", jornada: 34,
  },
  {
    id: 2,
    equipa_casa: "União 1919",    logo_casa: logoUniao,
    equipa_fora: "GD Tourizense", logo_fora: logoTourizense,
    data: "2025-06-14", hora: "17:00",
    estadio: "Estádio Municipal Sérgio Conceição", jornada: 34,
  },
  {
    id: 3,
    equipa_casa: "Académica SF",   logo_casa: logoAcademica,
    equipa_fora: "AD Nogueirense", logo_fora: logoNogueirense,
    data: "2025-06-14", hora: "18:30",
    estadio: "Estádio Universitário", jornada: 34,
  },
  {
    id: 4,
    equipa_casa: "GD Tourizense", logo_casa: logoTourizense,
    equipa_fora: "GR Vigor M",    logo_fora: logoVigor,
    data: "2025-06-07", hora: "21:00",
    estadio: "Parque Desportivo Visconde Vinhal", jornada: 33,
  },
];

const iniciaisEquipa = (nome) =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" });

function JogoCard({ jogo, onClick }) {
  return (
    <Card sx={{ height: "100%", transition: "transform 0.15s, box-shadow 0.15s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.14)" } }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent>
          <Chip label={`Jornada ${jogo.jornada}`} size="small" color="secondary" sx={{ mb: 2, fontWeight: 600 }} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Avatar src={jogo.logo_casa} sx={{ bgcolor: "primary.main", mx: "auto", mb: 0.5, width: 48, height: 48, fontSize: "0.85rem", fontWeight: 700 }}>
                {iniciaisEquipa(jogo.equipa_casa)}
              </Avatar>
              <Typography variant="body2" fontWeight={600} noWrap>{jogo.equipa_casa}</Typography>
            </Box>
            <Typography variant="h6" fontWeight={800} color="text.secondary" sx={{ mx: 1 }}>VS</Typography>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Avatar src={jogo.logo_fora} sx={{ bgcolor: "secondary.dark", mx: "auto", mb: 0.5, width: 48, height: 48, fontSize: "0.85rem", fontWeight: 700 }}>
                {iniciaisEquipa(jogo.equipa_fora)}
              </Avatar>
              <Typography variant="body2" fontWeight={600} noWrap>{jogo.equipa_fora}</Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 1.5 }} />
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
  const [jornadaFilter, setJornadaFilter] = useState(0);

  useEffect(() => {
    setTimeout(() => { setJogos(MOCK_JOGOS); setLoading(false); }, 700);
  }, []);

  const jornadasDisponiveis = [...new Set(jogos.map((j) => j.jornada))].sort((a, b) => a - b);

  const jogosFiltrados = jogos.filter((j) => {
    const matchPesquisa =
      j.equipa_casa.toLowerCase().includes(pesquisa.toLowerCase()) ||
      j.equipa_fora.toLowerCase().includes(pesquisa.toLowerCase()) ||
      j.estadio.toLowerCase().includes(pesquisa.toLowerCase());
    const matchJornada = jornadaFilter === 0 || j.jornada === jornadaFilter;
    return matchPesquisa && matchJornada;
  });

  return (
    <Box sx={{ py: 6, bgcolor: "background.default", minHeight: "calc(100vh - 80px)" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" color="secondary.dark" fontWeight={700}>Divisão de Elite – AFC Coimbra 2025/26</Typography>
          <Typography variant="h4" fontWeight={700} color="primary.main">Todos os Jogos</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <TextField
            placeholder="Pesquisar equipa ou estádio…"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 220, bgcolor: "white", borderRadius: 2 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>) }}
          />
          <FormControl size="small" sx={{ minWidth: 190, bgcolor: "white", borderRadius: 2 }}>
            <InputLabel>Jornada</InputLabel>
            <Select value={jornadaFilter} label="Jornada" onChange={(e) => setJornadaFilter(e.target.value)}>
              <MenuItem value={0}>Todas as Jornadas</MenuItem>
              {jornadasDisponiveis.map((j) => (<MenuItem key={j} value={j}>Jornada {j}</MenuItem>))}
            </Select>
          </FormControl>
        </Box>

        {jornadaFilter !== 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="primary.main">Jornada {jornadaFilter}</Typography>
            <Chip label={`${jogosFiltrados.length} ${jogosFiltrados.length === 1 ? "jogo" : "jogos"}`} size="small" color="secondary" />
          </Box>
        )}

        {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

        {!loading && !erro && jornadaFilter === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {jogosFiltrados.length} {jogosFiltrados.length === 1 ? "jogo encontrado" : "jogos encontrados"}
          </Typography>
        )}

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (<Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}><Skeleton variant="rounded" height={230} sx={{ borderRadius: 3 }} /></Grid>))
            : jogosFiltrados.length === 0
              ? (<Grid size={{ xs: 12 }}><Box sx={{ textAlign: "center", py: 10 }}><SportsSoccerIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} /><Typography variant="h6" color="text.secondary">Nenhum jogo encontrado</Typography><Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>Tenta mudar os filtros</Typography><Button variant="outlined" onClick={() => { setPesquisa(""); setJornadaFilter(0); }}>Limpar filtros</Button></Box></Grid>)
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