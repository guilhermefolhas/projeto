import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Button,
  Grid, Card, CardActionArea, Skeleton,
} from "@mui/material";
import SportsSoccerIcon  from "@mui/icons-material/SportsSoccer";
import StadiumIcon       from "@mui/icons-material/Stadium";
import GroupsIcon        from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import heroImg from "../../assets/afc_image.jpg";

import jogoService    from "../../services/jogo.service";
import equipaService  from "../../services/equipa.service";
import estadioService from "../../services/estadio.service";

const API_URL = "http://localhost:5000";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const PAGE_BG     = "#132654";
const NAVY        = "#001E62";
const GOLD        = "#C8A850";
const GOLD2       = "#E0C068";
const WHITE       = "#FFFFFF";
const CARD_BG     = "#1a3266";
const CARD_BG2    = "#223070";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const CARD_TEXT   = "rgba(255,255,255,0.9)";
const CARD_MUTED  = "rgba(255,255,255,0.45)";
const BTN_BLUE    = "#1A6DFF";

const iniciais = (nome = "") =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "short", day: "numeric", month: "short",
  });

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
                {jogo.equipa_casa || `Equipa ${jogo.id_equipa_casa}`}
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
                {jogo.equipa_fora || `Equipa ${jogo.id_equipa_fora}`}
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

// ─── StatItem com animação ────────────────────────────────────────────────────
function useCountUp(target, trigger, duration = 1000) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!target || target === "—") return;
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(ease * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, trigger, duration]);
  return typeof target === "number" ? count : target;
}

function StatItem({ icon, valor, label }) {
  const [hoverKey, setHoverKey] = useState(0);
  const display = useCountUp(valor, hoverKey);
  return (
    <Box onMouseEnter={() => setHoverKey((k) => k + 1)} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, px: { xs: 2, md: 4 }, borderRight: { md: "1px solid rgba(255,255,255,0.12)" }, "&:last-child": { borderRight: "none" }, cursor: "default", transition: "transform 0.2s", "&:hover": { transform: "translateY(-3px)" } }}>
      <Box sx={{ color: GOLD, mb: 0.5 }}>{icon}</Box>
      <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, lineHeight: 1 }}>{display}</Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</Typography>
    </Box>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [jogos, setJogos]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        // Buscar jogos, equipas e estádios em paralelo
        const [resJogos, resEquipas, resEstadios] = await Promise.all([
          jogoService.getAll(),
          equipaService.getAll(),
          estadioService.getAll(),
        ]);

        const jogosDados   = resJogos.data   || [];
        const equipasDados = resEquipas.data || [];
        const estadiosDados = resEstadios.data || [];

        // Mapas de ID → nome para lookup rápido
        const mapaEquipas  = Object.fromEntries(equipasDados.map((e) => [e.id, { nome: e.nome, logo: e.logo }]));
        const mapaEstadios = Object.fromEntries(estadiosDados.map((e) => [e.id, e.nome]));

        // Enriquecer cada jogo com os nomes
        const jogosEnriquecidos = jogosDados.map((j) => ({
          ...j,
          equipa_casa:      mapaEquipas[j.id_equipa_casa]?.nome || `Equipa ${j.id_equipa_casa}`,
          logo_casa:        mapaEquipas[j.id_equipa_casa]?.logo || null,
          equipa_fora:      mapaEquipas[j.id_equipa_fora]?.nome || `Equipa ${j.id_equipa_fora}`,
          logo_fora:        mapaEquipas[j.id_equipa_fora]?.logo || null,
          estadio:          mapaEstadios[j.id_estadio]           || `Estádio ${j.id_estadio}`,
        }));

        // Mostrar apenas os 3 primeiros jogos na home
        setJogos(jogosEnriquecidos.slice(0, 3));

        setStats({
          jogos:    jogosDados.length,
          equipas:  equipasDados.length,
          estadios: estadiosDados.length,
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  return (
    <Box>
      {/* HERO */}
      <Box sx={{ minHeight: { xs: "62vh", md: "68vh" }, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "flex-start",
        "&::before": { content: '""', position: "absolute", inset: 0, backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center 30%", zIndex: 0 },
        "&::after": { content: '""', position: "absolute", inset: 0, background: `linear-gradient(100deg, ${NAVY}F5 0%, ${NAVY}CC 40%, ${NAVY}66 70%, transparent 100%)`, zIndex: 1 },
      }}>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: { xs: 8, md: 10 } }}>
          <Box sx={{ maxWidth: { xs: "100%", md: "56%" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "rgba(200,168,80,0.15)", border: `1px solid ${GOLD}55`, borderRadius: "3px", px: 1.5, py: 0.7, mb: 3 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: GOLD }} />
              <Typography sx={{ color: GOLD2, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Divisão de Elite · AFC Coimbra 2025/26
              </Typography>
            </Box>
            <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.4rem", sm: "3rem", md: "3.8rem" }, color: WHITE, lineHeight: 1.05, mb: 2.5, letterSpacing: "-0.02em" }}>
              Partilhamos Paixão.<br />
              <Box component="span" sx={{ color: GOLD }}>Garante o Teu Lugar.</Box>
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.7, mb: 4.5, maxWidth: 480 }}>
              Os jogos da Divisão de Elite numa única plataforma. Compra o teu bilhete em segundos.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/jogos")}
                sx={{ bgcolor: GOLD, color: NAVY, fontWeight: 800, px: 3.5, py: 1.4, borderRadius: "3px", fontSize: "0.9rem", letterSpacing: "0.04em", textTransform: "uppercase", "&:hover": { bgcolor: GOLD2 }, boxShadow: "none" }}>
                Ver Jogos
              </Button>
              <Button variant="outlined" size="large" onClick={() => navigate("/meus-bilhetes")}
                sx={{ borderColor: "rgba(255,255,255,0.4)", color: WHITE, fontWeight: 700, px: 3.5, py: 1.4, borderRadius: "3px", fontSize: "0.9rem", letterSpacing: "0.04em", textTransform: "uppercase", "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" } }}>
                Os Meus Bilhetes
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* STATS */}
      <Box sx={{ bgcolor: PAGE_BG, py: 3.5, borderBottom: `3px solid ${GOLD}` }}>
        <Container maxWidth="md">
          <Grid container justifyContent="center" alignItems="stretch">
            {[
              { icon: <SportsSoccerIcon sx={{ fontSize: 26 }} />, valor: stats?.jogos ?? "—", label: "Jogos" },
              { icon: <GroupsIcon sx={{ fontSize: 26 }} />,       valor: stats?.equipas ?? "—", label: "Equipas" },
              { icon: <StadiumIcon sx={{ fontSize: 26 }} />,      valor: stats?.estadios ?? "—", label: "Estádios" },
            ].map((s, i) => (
              <Grid key={i} size={{ xs: 4 }}>
                <StatItem {...s} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* PRÓXIMOS JOGOS */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: PAGE_BG }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.5, display: "flex", alignItems: "center", gap: 0.8 }}>
                <Box sx={{ width: 18, height: 2, bgcolor: GOLD, display: "inline-block" }} />
                Em Destaque
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: WHITE, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                Próximos Jogos
              </Typography>
            </Box>
            <Button variant="text" endIcon={<ArrowForwardIcon />} onClick={() => navigate("/jogos")}
              sx={{ color: WHITE, fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", "&:hover": { bgcolor: "transparent", color: "rgba(255,255,255,0.7)" } }}>
              Ver todos os jogos
            </Button>
          </Box>

          <Grid container spacing={3}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton variant="rounded" height={280} sx={{ borderRadius: "10px", bgcolor: CARD_BG }} />
                  </Grid>
                ))
              : jogos.length === 0
                ? (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <SportsSoccerIcon sx={{ fontSize: 48, color: CARD_MUTED, mb: 2 }} />
                      <Typography sx={{ color: WHITE, fontWeight: 700 }}>Sem jogos disponíveis</Typography>
                    </Box>
                  </Grid>
                )
                : jogos.map((jogo) => (
                    <Grid key={jogo.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <JogoCard jogo={jogo} onClick={() => navigate(`/jogos/${jogo.id}`)} />
                    </Grid>
                  ))
            }
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
