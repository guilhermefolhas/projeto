import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Chip, Button, TextField, Divider, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Skeleton, Paper,
} from "@mui/material";
import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon      from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon         from "@mui/icons-material/AccessTime";
import LocationOnIcon         from "@mui/icons-material/LocationOn";
import PeopleIcon             from "@mui/icons-material/People";
import EuroIcon               from "@mui/icons-material/Euro";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SportsSoccerIcon       from "@mui/icons-material/SportsSoccer";

import { useAuth }    from "../../contexts/AuthContext";
import jogoService    from "../../services/jogo.service";
import equipaService  from "../../services/equipa.service";
import estadioService from "../../services/estadio.service";
import bilheteService from "../../services/bilhete.service";
import compraService  from "../../services/compra.service";

const API_URL     = "http://localhost:5000";
const PAGE_BG     = "#132654";
const HERO_BG     = "#0a1535";
const GOLD        = "#C8A850";
const GOLD2       = "#E0C068";
const WHITE       = "#FFFFFF";
const CARD_BG     = "#1a3266";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const CARD_TEXT   = "rgba(255,255,255,0.9)";
const CARD_MUTED  = "rgba(255,255,255,0.45)";
const BTN_BLUE    = "#1A6DFF";
const NAVY        = "#001E62";

const iniciais = (nome = "") =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

// ─── Logo ou iniciais ─────────────────────────────────────────────────────────
function EquipaLogo({ logo, nome, size = 110 }) {
  return logo
    ? <Box component="img" src={`${API_URL}${logo}`} alt={nome}
        sx={{ width: size, height: size, objectFit: "contain", display: "block", mx: "auto",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))" }}/>
    : <Box sx={{ width: size, height: size, borderRadius: "50%", mx: "auto",
                 background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.15)",
                 backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: WHITE, fontWeight: 900, fontSize: size * 0.28 }}>
          {iniciais(nome)}
        </Typography>
      </Box>;
}

// ─── Info card ────────────────────────────────────────────────────────────────
function InfoCard({ icon, label, value, cor = GOLD }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2,
               bgcolor: "rgba(255,255,255,0.04)", borderRadius: "10px",
               border: `1px solid ${CARD_BORDER}`,
               transition: "background 0.15s",
               "&:hover": { bgcolor: "rgba(255,255,255,0.07)" } }}>
      <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: `${cor}18`,
                 border: `1px solid ${cor}33`, display: "flex", alignItems: "center",
                 justifyContent: "center", color: cor, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ color: CARD_MUTED, fontSize: "0.72rem", fontWeight: 600,
                          textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</Typography>
        <Typography sx={{ color: CARD_TEXT, fontWeight: 600, fontSize: "0.9rem", mt: 0.2 }}>{value}</Typography>
      </Box>
    </Box>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function JogoDetalhes() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jogo, setJogo]                 = useState(null);
  const [bilhete, setBilhete]           = useState(null);
  const [disponiveis, setDisponiveis]   = useState(0);
  const [esgotado, setEsgotado]         = useState(false);
  const [loading, setLoading]           = useState(true);
  const [quantidade, setQuantidade]     = useState(1);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [comprando, setComprando]       = useState(false);
  const [snackbar, setSnackbar]         = useState({ aberto: false, msg: "", tipo: "success" });

  useEffect(() => {
    const carregar = async () => {
      try {
        const resJogo = await jogoService.getById(id);
        const d       = resJogo.data;

        const [rCasa, rFora, rEstadio, rDisp] = await Promise.all([
          equipaService.getById(d.id_equipa_casa),
          equipaService.getById(d.id_equipa_fora),
          estadioService.getById(d.id_estadio),
          compraService.getDisponibilidade(d.id),  // endpoint acessível a todos
        ]);

        setJogo({
          ...d,
          equipa_casa: rCasa.data?.nome    || `Equipa ${d.id_equipa_casa}`,
          sigla_casa:  rCasa.data?.sigla   || null,
          logo_casa:   rCasa.data?.logo    || null,
          equipa_fora: rFora.data?.nome    || `Equipa ${d.id_equipa_fora}`,
          sigla_fora:  rFora.data?.sigla   || null,
          logo_fora:   rFora.data?.logo    || null,
          estadio:     rEstadio.data?.nome       || `Estádio ${d.id_estadio}`,
          morada:      rEstadio.data?.morada     || "—",
          lotacao:     rEstadio.data?.lotacao    || 0,
          preco_base:  rEstadio.data?.preco_base || 0,
        });

        const disp = rDisp.data || {};
        setDisponiveis(disp.disponiveis || 0);
        setEsgotado(disp.disponiveis === 0 && disp.total > 0);
        setBilhete(disp.bilhete || null);
      } catch {
        setSnackbar({ aberto: true, msg: "Erro ao carregar detalhes do jogo.", tipo: "error" });
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  const totalPreco = jogo && bilhete
    ? (Number(bilhete.custo) * quantidade).toFixed(2)
    : jogo ? (Number(jogo.preco_base) * quantidade).toFixed(2) : null;

  const handleConfirmarCompra = async () => {
    setDialogAberto(false);
    setComprando(true);
    try {
      await compraService.create({ id_cliente: user.id_cliente, id_bilhete: bilhete.id, estado: "por pagar" });
      setSnackbar({ aberto: true, msg: "Bilhete comprado com sucesso!", tipo: "success" });
      setQuantidade(1);
    } catch {
      setSnackbar({ aberto: true, msg: "Erro ao processar a compra.", tipo: "error" });
    } finally {
      setComprando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: PAGE_BG, minHeight: "calc(100vh - 80px)", py: 6 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rounded" height={360} sx={{ mb: 4, borderRadius: 3, bgcolor: CARD_BG }} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}><Skeleton variant="rounded" height={260} sx={{ borderRadius: 3, bgcolor: CARD_BG }} /></Grid>
            <Grid size={{ xs: 12, md: 5 }}><Skeleton variant="rounded" height={260} sx={{ borderRadius: 3, bgcolor: CARD_BG }} /></Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!jogo) return null;

  return (
    <Box sx={{ bgcolor: PAGE_BG, minHeight: "calc(100vh - 80px)", pb: 8 }}>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <Box sx={{
        position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg, ${HERO_BG} 0%, #0f1f4e 50%, ${HERO_BG} 100%)`,
        pt: 4, pb: 6,
        "&::before": {
          content: '""', position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(200,168,80,0.06) 0%, transparent 60%),
                            radial-gradient(circle at 80% 50%, rgba(26,109,255,0.06) 0%, transparent 60%)`,
          zIndex: 0,
        },
      }}>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>

          {/* Voltar */}
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/jogos")}
            sx={{ color: CARD_MUTED, mb: 3, "&:hover": { color: WHITE } }}>
            Voltar aos Jogos
          </Button>

          {/* Badge jornada */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Chip label={`Jornada ${jogo.jornada} · Divisão de Elite`}
              sx={{ bgcolor: `${GOLD}22`, color: GOLD, fontWeight: 700, border: `1px solid ${GOLD}44`,
                    fontSize: "0.78rem", letterSpacing: "0.04em" }} />
          </Box>

          {/* Equipas + VS */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center",
                     gap: { xs: 2, md: 8 }, mb: 5 }}>
            {/* Casa */}
            <Box sx={{ textAlign: "center", flex: 1, maxWidth: 200 }}>
              <EquipaLogo logo={jogo.logo_casa} nome={jogo.equipa_casa} size={100} />
              <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: { xs: "1rem", md: "1.2rem" },
                                mt: 2, lineHeight: 1.2 }}>
                {jogo.sigla_casa || jogo.equipa_casa}
              </Typography>
              <Typography sx={{ color: CARD_MUTED, fontSize: "0.75rem", mt: 0.5,
                                textTransform: "uppercase", letterSpacing: "0.08em" }}>Casa</Typography>
            </Box>

            {/* Centro — hora + VS */}
            <Box sx={{ textAlign: "center", flexShrink: 0 }}>
              {/* Hora em pill */}
              <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center",
                         justifyContent: "center", mb: 1 }}>
                {/* Linhas decorativas */}
                <Box sx={{ position: "absolute", top: "-20px", bottom: "-20px",
                           left: "calc(50% - 10px)", width: "1px",
                           bgcolor: "rgba(255,255,255,0.1)", transform: "rotate(-12deg)" }}/>
                <Box sx={{ position: "absolute", top: "-20px", bottom: "-20px",
                           left: "calc(50% + 10px)", width: "1px",
                           bgcolor: "rgba(255,255,255,0.1)", transform: "rotate(-12deg)" }}/>
                <Box sx={{ position: "relative", zIndex: 1,
                           bgcolor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                           borderRadius: "100px", px: 3, py: 1.2, backdropFilter: "blur(8px)" }}>
                  <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: "1.6rem",
                                    letterSpacing: "0.06em", lineHeight: 1 }}>
                    {jogo.hora}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ color: GOLD, fontWeight: 900, fontSize: "0.85rem",
                                letterSpacing: "0.15em", mt: 1.5 }}>VS</Typography>
            </Box>

            {/* Fora */}
            <Box sx={{ textAlign: "center", flex: 1, maxWidth: 200 }}>
              <EquipaLogo logo={jogo.logo_fora} nome={jogo.equipa_fora} size={100} />
              <Typography sx={{ color: WHITE, fontWeight: 800, fontSize: { xs: "1rem", md: "1.2rem" },
                                mt: 2, lineHeight: 1.2 }}>
                {jogo.sigla_fora || jogo.equipa_fora}
              </Typography>
              <Typography sx={{ color: CARD_MUTED, fontSize: "0.75rem", mt: 0.5,
                                textTransform: "uppercase", letterSpacing: "0.08em" }}>Fora</Typography>
            </Box>
          </Box>

          {/* Info bar */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap" }}>
            {[
              { icon: <CalendarMonthIcon sx={{ fontSize: 15 }}/>, label: formatarData(jogo.data) },
              { icon: <AccessTimeIcon sx={{ fontSize: 15 }}/>,    label: jogo.hora },
              { icon: <LocationOnIcon sx={{ fontSize: 15 }}/>,    label: jogo.estadio },
            ].map((item, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.8,
                                 bgcolor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                                 borderRadius: "100px", px: 2, py: 0.8 }}>
                <Box sx={{ color: GOLD }}>{item.icon}</Box>
                <Typography sx={{ color: CARD_TEXT, fontSize: "0.8rem", fontWeight: 500 }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── CONTEÚDO ──────────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <Grid container spacing={3}>

          {/* Info do estádio */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card elevation={0} sx={{ borderRadius: "12px", bgcolor: CARD_BG, border: `1px solid ${CARD_BORDER}`, overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${CARD_BORDER}`,
                         display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: `${GOLD}18`,
                           display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LocationOnIcon sx={{ fontSize: 17, color: GOLD }}/>
                </Box>
                <Typography fontWeight={700} color={WHITE}>Informações do Estádio</Typography>
              </Box>
              <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { icon: <LocationOnIcon sx={{ fontSize: 18 }}/>, label: "Nome",    value: jogo.estadio },
                  { icon: <LocationOnIcon sx={{ fontSize: 18 }}/>, label: "Morada",  value: jogo.morada },
                  { icon: <PeopleIcon sx={{ fontSize: 18 }}/>,     label: "Lotação", value: `${Number(jogo.lotacao).toLocaleString("pt-PT")} lugares` },
                  { icon: <EuroIcon sx={{ fontSize: 18 }}/>,       label: "Preço",   value: `${Number(bilhete?.custo || jogo.preco_base).toFixed(2)}€`, cor: "#34d399" },
                ].map((item, i) => (
                  <InfoCard key={i} {...item} />
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Compra */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card elevation={0} sx={{ borderRadius: "12px", bgcolor: CARD_BG,
                                      border: `1px solid ${CARD_BORDER}`, position: "sticky", top: 100, overflow: "hidden" }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${CARD_BORDER}`,
                         display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: `${GOLD}18`,
                           display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ConfirmationNumberIcon sx={{ fontSize: 17, color: GOLD }}/>
                </Box>
                <Typography fontWeight={700} color={WHITE}>Comprar Bilhetes</Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                {esgotado ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Box sx={{ bgcolor: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)",
                               borderRadius: "10px", p: 3 }}>
                      <Typography sx={{ color: "#f87171", fontWeight: 800, fontSize: "1.1rem", mb: 0.5 }}>
                        🎟️ Esgotado
                      </Typography>
                      <Typography sx={{ color: CARD_MUTED, fontSize: "0.85rem" }}>
                        Todos os bilhetes para este jogo já foram vendidos.
                      </Typography>
                    </Box>
                  </Box>
                ) : !bilhete ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <SportsSoccerIcon sx={{ fontSize: 40, color: CARD_MUTED, mb: 1.5 }}/>
                    <Typography sx={{ color: CARD_MUTED, fontSize: "0.9rem" }}>
                      Sem bilhetes disponíveis para este jogo.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <TextField fullWidth label="Quantidade" type="number"
                      value={quantidade}
                      onChange={(e) => setQuantidade(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                      inputProps={{ min: 1, max: 10 }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": { bgcolor: PAGE_BG, color: WHITE,
                          "& fieldset": { borderColor: CARD_BORDER },
                          "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                          "&.Mui-focused fieldset": { borderColor: GOLD } },
                        "& .MuiInputLabel-root": { color: CARD_MUTED, "&.Mui-focused": { color: GOLD } },
                      }}
                    />

                    {/* Resumo preço */}
                    <Box sx={{ bgcolor: PAGE_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: "10px", p: 2.5, mb: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography sx={{ color: CARD_MUTED, fontSize: "0.85rem" }}>
                          {quantidade}× bilhete{quantidade > 1 ? "s" : ""}
                        </Typography>
                        <Typography sx={{ color: CARD_MUTED, fontSize: "0.85rem" }}>
                          {Number(bilhete.custo).toFixed(2)}€ cada
                        </Typography>
                      </Box>
                      <Divider sx={{ borderColor: CARD_BORDER, my: 1.5 }}/>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ color: WHITE, fontWeight: 700 }}>Total</Typography>
                        <Typography sx={{ color: GOLD, fontWeight: 900, fontSize: "1.4rem" }}>{totalPreco}€</Typography>
                      </Box>
                    </Box>

                    {/* Bilhetes disponíveis */}
                    <Typography sx={{ color: CARD_MUTED, fontSize: "0.78rem", textAlign: "center", mb: 2 }}>
                      <Box component="span" sx={{ color: "#34d399", fontWeight: 700 }}>{disponiveis.toLocaleString("pt-PT")}</Box> bilhetes disponíveis
                    </Typography>

                    <Button fullWidth variant="contained" size="large"
                      onClick={() => setDialogAberto(true)} disabled={comprando}
                      sx={{ py: 1.5, bgcolor: BTN_BLUE, fontWeight: 800, fontSize: "0.95rem",
                            letterSpacing: "0.04em", borderRadius: "8px",
                            "&:hover": { bgcolor: "#0F5CE0" }, boxShadow: "0 4px 20px rgba(26,109,255,0.35)" }}>
                      {comprando ? "A processar…" : "Comprar Agora"}
                    </Button>
                  </>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* DIALOG */}
      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="xs" fullWidth
        sx={{ "& .MuiDialog-paper": { backgroundColor: `${CARD_BG} !important`, backgroundImage: "none", border: `1px solid ${CARD_BORDER}`, borderRadius: "12px" } }}>
        <DialogTitle sx={{ color: WHITE, fontWeight: 700 }}>Confirmar Compra</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: CARD_MUTED }}>
            Vais comprar <strong style={{ color: WHITE }}>{quantidade} bilhete(s)</strong> para{" "}
            <strong style={{ color: WHITE }}>{jogo.sigla_casa || jogo.equipa_casa} vs {jogo.sigla_fora || jogo.equipa_fora}</strong> no valor total de{" "}
            <strong style={{ color: GOLD }}>{totalPreco}€</strong>. Confirmas?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogAberto(false)} sx={{ color: CARD_MUTED }}>Cancelar</Button>
          <Button onClick={handleConfirmarCompra} variant="contained"
            sx={{ bgcolor: BTN_BLUE, fontWeight: 700, "&:hover": { bgcolor: "#0F5CE0" } }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snackbar.aberto} autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, aberto: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.tipo} variant="filled" sx={{ width: "100%" }}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}