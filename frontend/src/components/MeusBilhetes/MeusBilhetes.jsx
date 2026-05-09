import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Divider,
  Skeleton,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import axios from "axios";

// ─── Mock data – substituir por chamada à API ─────────────────────────────────
const MOCK_BILHETES = [
  {
    id: 101,
    jogo_id: 1,
    equipa_casa: "Sporting CP",
    equipa_fora: "FC Porto",
    data: "2025-06-14",
    hora: "21:00",
    estadio: "Estádio de Alvalade",
    categoria: "Tribuna Central",
    quantidade: 2,
    preco_unit: 55,
    fase: "Final",
  },
  {
    id: 102,
    jogo_id: 2,
    equipa_casa: "SL Benfica",
    equipa_fora: "SC Braga",
    data: "2025-06-07",
    hora: "18:30",
    estadio: "Estádio da Luz",
    categoria: "Geral",
    quantidade: 1,
    preco_unit: 15,
    fase: "Meia-Final",
  },
  {
    id: 103,
    jogo_id: 3,
    equipa_casa: "FC Porto",
    equipa_fora: "Vitória SC",
    data: "2025-03-10", // jogo passado
    hora: "20:45",
    estadio: "Estádio do Dragão",
    categoria: "Bancada Norte",
    quantidade: 3,
    preco_unit: 25,
    fase: "Quartos",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const iniciaisEquipa = (nome) =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });

const jogoPassou = (dataStr) => new Date(dataStr) < new Date();

function BilheteCard({ bilhete }) {
  const passado = jogoPassou(bilhete.data);
  const total = (bilhete.preco_unit * bilhete.quantidade).toFixed(2);

  return (
    <Card
      sx={{
        opacity: passado ? 0.75 : 1,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.12)" },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Cabeçalho do bilhete */}
        <Box
          sx={{
            bgcolor: passado ? "grey.700" : "primary.main",
            px: 2.5,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 40, height: 40, fontSize: "0.75rem", fontWeight: 700, color: "white" }}
            >
              {iniciaisEquipa(bilhete.equipa_casa)}
            </Avatar>
            <Typography variant="body2" color="white" fontWeight={700}>vs</Typography>
            <Avatar
              sx={{ bgcolor: "rgba(200,169,81,0.3)", width: 40, height: 40, fontSize: "0.75rem", fontWeight: 700, color: "secondary.light" }}
            >
              {iniciaisEquipa(bilhete.equipa_fora)}
            </Avatar>
            <Box sx={{ ml: 0.5 }}>
              <Typography variant="body2" color="white" fontWeight={700} noWrap>
                {bilhete.equipa_casa} vs {bilhete.equipa_fora}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.65)">{bilhete.fase}</Typography>
            </Box>
          </Box>
          <Chip
            label={passado ? "Realizado" : "Próximo"}
            size="small"
            color={passado ? "default" : "success"}
            sx={{ fontWeight: 600, fontSize: "0.7rem" }}
          />
        </Box>

        {/* Linha tracejada estilo bilhete */}
        <Divider
          sx={{
            borderStyle: "dashed",
            borderColor: "grey.300",
            mx: 2,
          }}
        />

        {/* Corpo do bilhete */}
        <Box sx={{ px: 2.5, py: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <CalendarMonthIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {formatarData(bilhete.data)} · {bilhete.hora}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">{bilhete.estadio}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <ConfirmationNumberIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {bilhete.categoria} · {bilhete.quantidade}× bilhete(s)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Lado direito: preço + QR */}
          <Box sx={{ textAlign: "center", pl: 2, borderLeft: "1px dashed", borderColor: "grey.300" }}>
            <QrCode2Icon sx={{ fontSize: 44, color: "grey.400" }} />
            <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 0.5 }}>
              #BIL{bilhete.id}
            </Typography>
            <Typography variant="body1" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
              {total}€
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function MeusBilhetes() {
  const navigate = useNavigate();
  const [bilhetes, setBilhetes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: substituir por chamada real (autenticado)
    // axios.get("http://localhost:5000/api/v1/meus-bilhetes", { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => setBilhetes(res.data))
    //   .finally(() => setLoading(false));
    setTimeout(() => {
      setBilhetes(MOCK_BILHETES);
      setLoading(false);
    }, 700);
  }, []);

  const proximos = bilhetes.filter((b) => !jogoPassou(b.data));
  const passados = bilhetes.filter((b) => jogoPassou(b.data));

  return (
    <Box sx={{ py: 6, bgcolor: "background.default", minHeight: "calc(100vh - 80px)" }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" color="secondary.dark" fontWeight={700}>
            A minha conta
          </Typography>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Os Meus Bilhetes
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Grid container spacing={3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12 }}>
                <Skeleton variant="rounded" height={150} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Estado vazio */}
        {!loading && bilhetes.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <SportsSoccerIcon sx={{ fontSize: 72, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Ainda não tens bilhetes
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
              Compra o teu primeiro bilhete e aparece aqui.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/jogos")}
            >
              Ver Jogos Disponíveis
            </Button>
          </Box>
        )}

        {/* Próximos jogos */}
        {!loading && proximos.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" fontWeight={600} color="success.dark" sx={{ mb: 2 }}>
              Próximos Jogos ({proximos.length})
            </Typography>
            <Grid container spacing={2}>
              {proximos.map((b) => (
                <Grid key={b.id} size={{ xs: 12 }}>
                  <BilheteCard bilhete={b} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Histórico */}
        {!loading && passados.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
              Histórico ({passados.length})
            </Typography>
            <Grid container spacing={2}>
              {passados.map((b) => (
                <Grid key={b.id} size={{ xs: 12 }}>
                  <BilheteCard bilhete={b} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}