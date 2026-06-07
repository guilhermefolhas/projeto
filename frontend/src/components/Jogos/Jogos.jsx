import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardActionArea,
  TextField, Select, MenuItem, FormControl, InputLabel,
  InputAdornment, Skeleton, Button, Alert,
} from "@mui/material";
import SearchIcon        from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SportsSoccerIcon  from "@mui/icons-material/SportsSoccer";

import jogoService    from "../../services/jogo.service";
import equipaService  from "../../services/equipa.service";
import estadioService from "../../services/estadio.service";

const API_URL = "http://localhost:5000";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const PAGE_BG     = "#132654";  // estava "#ffffff" — corrigido
const CARD_BG     = "#1a3266";
const CARD_BG2    = "#223070";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const CARD_TEXT   = "rgba(255,255,255,0.9)";
const CARD_MUTED  = "rgba(255,255,255,0.45)";
const GOLD        = "#C8A850";
const WHITE       = "#FFFFFF";
const BTN_BLUE    = "#1A6DFF";
const NAVY        = "#001E62";

const iniciais = (nome = "") =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" });

// ─── JogoCard ─────────────────────────────────────────────────────────────────
function JogoCard({ jogo, onClick }) {
  return (
    <Card elevation={0} sx={{
      height: "100%", borderRadius: "10px", overflow: "hidden",
      bgcolor: CARD_BG, border: `1px solid ${CARD_BORDER}`,
      transition: "transform 0.18s, box-shadow 0.18s",
      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.45)" },
    }}>
      {/* Cabeçalho */}
      <Box sx={{ px: 2, py: 1.4, borderBottom: `1px solid ${CARD_BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: "6px", bgcolor: NAVY, border: `1px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SportsSoccerIcon sx={{ fontSize: 15, color: GOLD }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: CARD_TEXT, fontWeight: 700, fontSize: "0.82rem", lineHeight: 1.2 }} noWrap>Futebol</Typography>
            <Typography sx={{ color: CARD_MUTED, fontSize: "0.7rem", lineHeight: 1.2 }} noWrap>
              Divisão de Elite · Jornada {jogo.jornada}
            </Typography>
          </Box>
        </Box>
        <CalendarMonthIcon sx={{ fontSize: 17, color: CARD_MUTED, flexShrink: 0 }} />
      </Box>

      {/* Corpo */}
      <CardActionArea onClick={onClick}>
        <Box sx={{ px: 2.5, py: 3, bgcolor: CARD_BG }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Equipa Casa */}
            <Box sx={{ textAlign: "center", flex: 1, minWidth: 0 }}>
              {jogo.logo_casa
                ? <Box component="img" src={`${API_URL}${jogo.logo_casa}`} alt={jogo.equipa_casa}
                    sx={{ width: 56, height: 56, objectFit: "contain", mx: "auto", mb: 1.5, display: "block", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}/>
                : <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.08)", border: `1px solid ${CARD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
                    <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: "0.9rem" }}>{iniciais(jogo.equipa_casa)}</Typography>
                  </Box>
              }
              <Typography sx={{ color: CARD_TEXT, fontWeight: 700, fontSize: "0.82rem" }} noWrap>
                {jogo.equipa_casa}
              </Typography>
            </Box>

            {/* Hora com linhas diagonais */}
            <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", mx: 1, flexShrink: 0, width: 90, height: 90 }}>
              <Box sx={{ position: "absolute", top: 0, bottom: 0, left: "calc(50% - 7px)", width: "1px", bgcolor: "rgba(255,255,255,0.13)", transform: "rotate(-15deg)", transformOrigin: "center", zIndex: 0 }} />
              <Box sx={{ position: "absolute", top: 0, bottom: 0, left: "calc(50% + 7px)", width: "1px", bgcolor: "rgba(255,255,255,0.13)", transform: "rotate(-15deg)", transformOrigin: "center", zIndex: 0 }} />
              <Box sx={{ position: "relative", zIndex: 1, bgcolor: CARD_BG, border: "1px solid rgba(255,255,255,0.14)", borderRadius: "100px", px: 1.8, py: 0.9, textAlign: "center" }}>
                <Typography sx={{ color: WHITE, fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.03em", lineHeight: 1 }}>
                  {jogo.hora}
                </Typography>
              </Box>
            </Box>

            {/* Equipa Fora */}
            <Box sx={{ textAlign: "center", flex: 1, minWidth: 0 }}>
              {jogo.logo_fora
                ? <Box component="img" src={`${API_URL}${jogo.logo_fora}`} alt={jogo.equipa_fora}
                    sx={{ width: 56, height: 56, objectFit: "contain", mx: "auto", mb: 1.5, display: "block", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}/>
                : <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.08)", border: `1px solid ${CARD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
                    <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: "0.9rem" }}>{iniciais(jogo.equipa_fora)}</Typography>
                  </Box>
              }
              <Typography sx={{ color: CARD_TEXT, fontWeight: 700, fontSize: "0.82rem" }} noWrap>
                {jogo.equipa_fora}
              </Typography>
            </Box>

          </Box>
        </Box>
      </CardActionArea>

      {/* Rodapé */}
      <Box sx={{ display: "flex", borderTop: `1px solid ${CARD_BORDER}` }}>
        <Box onClick={onClick} sx={{ flex: 1, py: 1.4, textAlign: "center", color: CARD_TEXT, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", borderRight: `1px solid ${CARD_BORDER}`, "&:hover": { bgcolor: CARD_BG2 }, transition: "background 0.15s", userSelect: "none" }}>
          Detalhes
        </Box>
        <Box onClick={onClick} sx={{ flex: 1, py: 1.4, textAlign: "center", color: WHITE, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", bgcolor: BTN_BLUE, "&:hover": { bgcolor: "#0F5CE0" }, transition: "background 0.15s", userSelect: "none" }}>
          Comprar
        </Box>
      </Box>
    </Card>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Jogos() {
  const navigate = useNavigate();
  const [jogos, setJogos]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [erro, setErro]                   = useState(null);
  const [pesquisa, setPesquisa]           = useState("");
  const [jornadaFilter, setJornadaFilter] = useState(0);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resJogos, resEquipas, resEstadios] = await Promise.all([
          jogoService.getAll(),
          equipaService.getAll(),
          estadioService.getAll(),
        ]);

        const jogosDados    = resJogos.data    || [];
        const equipasDados  = resEquipas.data  || [];
        const estadiosDados = resEstadios.data || [];

        const mapaEquipas  = Object.fromEntries(equipasDados.map((e) => [e.id, { nome: e.nome, logo: e.logo }]));
        const mapaEstadios = Object.fromEntries(estadiosDados.map((e) => [e.id, e.nome]));

        const jogosEnriquecidos = jogosDados.map((j) => ({
          ...j,
          equipa_casa: mapaEquipas[j.id_equipa_casa]?.nome  || `Equipa ${j.id_equipa_casa}`,
          logo_casa:   mapaEquipas[j.id_equipa_casa]?.logo  || null,
          equipa_fora: mapaEquipas[j.id_equipa_fora]?.nome  || `Equipa ${j.id_equipa_fora}`,
          logo_fora:   mapaEquipas[j.id_equipa_fora]?.logo  || null,
          estadio:     mapaEstadios[j.id_estadio]      || `Estádio ${j.id_estadio}`,
        }));

        setJogos(jogosEnriquecidos);
      } catch (err) {
        setErro("Erro ao carregar jogos. Tenta novamente.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  const jornadasDisponiveis = [...new Set(jogos.map((j) => j.jornada))].sort((a, b) => a - b);

  const jogosFiltrados = jogos.filter((j) => {
    const q           = pesquisa.toLowerCase();
    const matchPesquisa = (j.equipa_casa || "").toLowerCase().includes(q)
                       || (j.equipa_fora || "").toLowerCase().includes(q)
                       || (j.estadio     || "").toLowerCase().includes(q);
    const matchJornada  = jornadaFilter === 0 || j.jornada === jornadaFilter;
    return matchPesquisa && matchJornada;
  });

  return (
    <Box sx={{ minHeight: "calc(100vh - 80px)", bgcolor: PAGE_BG, py: 6 }}>
      <Container maxWidth="lg">

        {/* Cabeçalho */}
        <Box sx={{ mb: 5 }}>
          <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.5, display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 18, height: 2, bgcolor: GOLD, display: "inline-block" }} />
            Divisão de Elite · AFC Coimbra 2025/26
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, color: WHITE, letterSpacing: "-0.02em" }}>
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
            sx={{
              flex: 1, minWidth: 220,
              "& .MuiOutlinedInput-root": {
                bgcolor: CARD_BG, borderRadius: "8px", color: WHITE,
                "& fieldset": { borderColor: CARD_BORDER },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                "&.Mui-focused fieldset": { borderColor: GOLD },
              },
              "& input::placeholder": { color: CARD_MUTED },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: CARD_MUTED }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel sx={{ color: CARD_MUTED, "&.Mui-focused": { color: GOLD } }}>Jornada</InputLabel>
            <Select
              value={jornadaFilter}
              label="Jornada"
              onChange={(e) => setJornadaFilter(e.target.value)}
              sx={{
                bgcolor: CARD_BG, borderRadius: "8px", color: WHITE,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: CARD_BORDER },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.25)" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD },
                "& .MuiSvgIcon-root": { color: CARD_MUTED },
              }}
              MenuProps={{ PaperProps: { sx: { bgcolor: CARD_BG, color: WHITE, border: `1px solid ${CARD_BORDER}` } } }}
            >
              <MenuItem value={0}>Todas as Jornadas</MenuItem>
              {jornadasDisponiveis.map((j) => <MenuItem key={j} value={j}>Jornada {j}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Contador */}
        {!loading && !erro && (
          <Typography sx={{ color: CARD_MUTED, fontSize: "0.82rem", mb: 3 }}>
            {jogosFiltrados.length} {jogosFiltrados.length === 1 ? "jogo encontrado" : "jogos encontrados"}
          </Typography>
        )}

        {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

        {/* Grid */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant="rounded" height={260} sx={{ borderRadius: "10px", bgcolor: CARD_BG }} />
                </Grid>
              ))
            : jogosFiltrados.length === 0
              ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center", py: 12 }}>
                    <SportsSoccerIcon sx={{ fontSize: 64, color: CARD_MUTED, mb: 2 }} />
                    <Typography sx={{ color: WHITE, fontWeight: 700, fontSize: "1.1rem", mb: 1 }}>
                      Nenhum jogo encontrado
                    </Typography>
                    <Typography sx={{ color: CARD_MUTED, mb: 4, fontSize: "0.9rem" }}>
                      Tenta mudar os filtros
                    </Typography>
                    <Button variant="outlined"
                      onClick={() => { setPesquisa(""); setJornadaFilter(0); }}
                      sx={{ color: WHITE, borderColor: "rgba(255,255,255,0.3)", "&:hover": { borderColor: WHITE, bgcolor: "rgba(255,255,255,0.06)" } }}
                    >
                      Limpar filtros
                    </Button>
                  </Box>
                </Grid>
              )
              : jogosFiltrados.map((jogo) => (
                  <Grid key={jogo.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <JogoCard jogo={jogo} onClick={() => navigate(`/jogos/${jogo.id}`)} />
                  </Grid>
                ))
          }
        </Grid>
      </Container>
    </Box>
  );
}