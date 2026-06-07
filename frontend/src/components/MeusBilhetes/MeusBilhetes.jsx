import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, Button, Divider, Skeleton,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CalendarMonthIcon      from "@mui/icons-material/CalendarMonth";
import LocationOnIcon         from "@mui/icons-material/LocationOn";
import QrCode2Icon            from "@mui/icons-material/QrCode2";
import SportsSoccerIcon       from "@mui/icons-material/SportsSoccer";

import { useAuth }    from "../../contexts/AuthContext";
import compraService  from "../../services/compra.service";
import bilheteService from "../../services/bilhete.service";
import jogoService    from "../../services/jogo.service";
import equipaService  from "../../services/equipa.service";
import estadioService from "../../services/estadio.service";

const API_URL = "http://localhost:5000";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const PAGE_BG     = "#132654";
const NAVY        = "#001E62";
const GOLD        = "#C8A850";
const WHITE       = "#FFFFFF";
const CARD_BG     = "#1a3266";
const CARD_BG_OLD = "#0f1f45";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const CARD_TEXT   = "rgba(255,255,255,0.9)";
const CARD_MUTED  = "rgba(255,255,255,0.45)";

const iniciais = (nome = "") =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });

const jogoPassou = (dataStr) => new Date(dataStr) < new Date();

// ─── BilheteCard ──────────────────────────────────────────────────────────────
function BilheteCard({ compra }) {
  const passado  = jogoPassou(compra.data);
  const cardBg   = passado ? CARD_BG_OLD : CARD_BG;
  const headerBg = passado ? "#0a1535" : NAVY;

  return (
    <Card elevation={0} sx={{
      opacity: passado ? 0.8 : 1,
      bgcolor: cardBg,
      border: `1px solid ${CARD_BORDER}`,
      borderRadius: "10px",
      overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
      "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.4)", transform: "translateY(-2px)" },
    }}>
      <CardContent sx={{ p: 0 }}>
        {/* Cabeçalho */}
        <Box sx={{ bgcolor: headerBg, px: 2.5, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            {/* Logo ou iniciais equipa casa */}
            {compra.logo_casa
              ? <Box component="img" src={`${API_URL}${compra.logo_casa}`} alt={compra.equipa_casa}
                  sx={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0, bgcolor: "#fff", borderRadius: "6px", p: "3px" }}/>
              : <Box sx={{ width: 38, height: 38, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: "0.7rem" }}>{iniciais(compra.equipa_casa)}</Typography>
                </Box>
            }
            <Typography variant="body2" color="rgba(255,255,255,0.6)" fontWeight={700}>vs</Typography>
            {/* Logo ou iniciais equipa fora */}
            {compra.logo_fora
              ? <Box component="img" src={`${API_URL}${compra.logo_fora}`} alt={compra.equipa_fora}
                  sx={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0, bgcolor: "#fff", borderRadius: "6px", p: "3px" }}/>
              : <Box sx={{ width: 38, height: 38, borderRadius: "50%", bgcolor: "rgba(200,168,80,0.15)", border: `1px solid ${GOLD}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: "0.7rem" }}>{iniciais(compra.equipa_fora)}</Typography>
                </Box>
            }
            <Box sx={{ ml: 0.5, minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: WHITE }} fontWeight={700} noWrap>
                {compra.equipa_casa} vs {compra.equipa_fora}
              </Typography>
              <Typography variant="caption" sx={{ color: CARD_MUTED }}>Jornada {compra.jornada}</Typography>
            </Box>
          </Box>
          <Chip
            label={passado ? "Realizado" : "Próximo"}
            size="small"
            sx={{
              fontWeight: 700, fontSize: "0.7rem", flexShrink: 0,
              bgcolor: passado ? "rgba(255,255,255,0.08)" : "rgba(34,197,94,0.15)",
              color: passado ? CARD_MUTED : "#4ade80",
              border: `1px solid ${passado ? "rgba(255,255,255,0.1)" : "rgba(74,222,128,0.3)"}`,
            }}
          />
        </Box>

        {/* Linha tracejada estilo bilhete */}
        <Divider sx={{ borderStyle: "dashed", borderColor: CARD_BORDER, mx: 2 }} />

        {/* Corpo */}
        <Box sx={{ px: 2.5, py: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <CalendarMonthIcon sx={{ fontSize: 14, color: GOLD }} />
                <Typography variant="caption" sx={{ color: CARD_MUTED }}>
                  {formatarData(compra.data)} · {compra.hora}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <LocationOnIcon sx={{ fontSize: 14, color: GOLD }} />
                <Typography variant="caption" sx={{ color: CARD_MUTED }}>{compra.estadio}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <ConfirmationNumberIcon sx={{ fontSize: 14, color: GOLD }} />
                <Typography variant="caption" sx={{ color: CARD_MUTED }}>
                  Estado: <strong style={{ color: CARD_TEXT }}>{compra.estado}</strong>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* QR + preço */}
          <Box sx={{ textAlign: "center", pl: 2, borderLeft: `1px dashed ${CARD_BORDER}` }}>
            <QrCode2Icon sx={{ fontSize: 44, color: CARD_MUTED }} />
            <Typography variant="caption" display="block" sx={{ color: CARD_MUTED, mt: 0.5 }}>
              #BIL{compra.id_bilhete}
            </Typography>
            <Typography variant="body1" fontWeight={700} sx={{ color: GOLD, mt: 1 }}>
              {Number(compra.custo).toFixed(2)}€
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function MeusBilhetes() {
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const [compras, setCompras]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [erro, setErro]         = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        // Buscar compras do utilizador autenticado
        const resCompras = await compraService.getByCliente(user.id_cliente);
        const comprasDados = resCompras.data || [];

        if (comprasDados.length === 0) {
          setCompras([]);
          return;
        }

        // Para cada compra, enriquecer com dados do bilhete, jogo, equipas e estádio
        const comprasEnriquecidas = await Promise.all(
          comprasDados.map(async (compra) => {
            try {
              const resBilhete = await bilheteService.getById(compra.id_bilhete);
              const bilhete    = resBilhete.data;

              const resJogo = await jogoService.getById(bilhete.id_jogo);
              const jogo    = resJogo.data;

              const [resEquipaCasa, resEquipaFora, resEstadio] = await Promise.all([
                equipaService.getById(jogo.id_equipa_casa),
                equipaService.getById(jogo.id_equipa_fora),
                estadioService.getById(jogo.id_estadio),
              ]);

              return {
                ...compra,
                custo:       bilhete.custo,
                data:        jogo.data,
                hora:        jogo.hora,
                jornada:     jogo.jornada,
                equipa_casa: resEquipaCasa.data?.nome  || `Equipa ${jogo.id_equipa_casa}`,
                logo_casa:   resEquipaCasa.data?.logo  || null,
                equipa_fora: resEquipaFora.data?.nome  || `Equipa ${jogo.id_equipa_fora}`,
                logo_fora:   resEquipaFora.data?.logo  || null,
                estadio:     resEstadio.data?.nome     || `Estádio ${jogo.id_estadio}`,
              };
            } catch {
              return compra; // se falhar, devolve a compra sem enriquecer
            }
          })
        );

        setCompras(comprasEnriquecidas);
      } catch (err) {
        setErro("Erro ao carregar os teus bilhetes.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [user]);

  const proximos = compras.filter((c) => !jogoPassou(c.data));
  const passados = compras.filter((c) =>  jogoPassou(c.data));

  return (
    <Box sx={{ py: 6, bgcolor: PAGE_BG, minHeight: "calc(100vh - 80px)" }}>
      <Container maxWidth="md">

        {/* Cabeçalho */}
        <Box sx={{ mb: 5 }}>
          <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.5, display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 18, height: 2, bgcolor: GOLD, display: "inline-block" }} />
            A minha conta
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, color: WHITE, letterSpacing: "-0.02em" }}>
            Os Meus Bilhetes
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12 }}>
                <Skeleton variant="rounded" height={150} sx={{ borderRadius: "10px", bgcolor: CARD_BG }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Erro */}
        {erro && (
          <Typography sx={{ color: "#f87171", textAlign: "center", py: 4 }}>{erro}</Typography>
        )}

        {/* Estado vazio */}
        {!loading && !erro && compras.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Box sx={{
              display: "inline-block", mb: 2,
              "@keyframes spinOnce": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
              "&:hover": { animation: "spinOnce 0.6s ease-out forwards" },
              cursor: "default",
            }}>
              <SportsSoccerIcon sx={{ fontSize: 72, color: GOLD }} />
            </Box>
            <Typography variant="h6" sx={{ color: WHITE, mb: 1 }}>Ainda não tens bilhetes</Typography>
            <Typography variant="body2" sx={{ color: CARD_MUTED, mb: 4 }}>
              Compra o teu primeiro bilhete e aparece aqui.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate("/jogos")}
              sx={{ bgcolor: GOLD, color: NAVY, fontWeight: 700, "&:hover": { bgcolor: "#E0C068" } }}>
              Ver Jogos Disponíveis
            </Button>
          </Box>
        )}

        {/* Próximos */}
        {!loading && proximos.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#4ade80", mb: 2 }}>
              Próximos Jogos ({proximos.length})
            </Typography>
            <Grid container spacing={2}>
              {proximos.map((c) => (
                <Grid key={c.id} size={{ xs: 12 }}>
                  <BilheteCard compra={c} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Histórico */}
        {!loading && passados.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: CARD_MUTED, mb: 2 }}>
              Histórico ({passados.length})
            </Typography>
            <Grid container spacing={2}>
              {passados.map((c) => (
                <Grid key={c.id} size={{ xs: 12 }}>
                  <BilheteCard compra={c} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

      </Container>
    </Box>
  );
}