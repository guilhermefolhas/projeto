import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Avatar,
  Skeleton,
  Divider,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import StadiumIcon from "@mui/icons-material/Stadium";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import heroImg from "../../assets/afc_image.jpg";
import logoVigor from "../../assets/vigor.png";
import logoEsperanca from "../../assets/esperanca.jpeg";
import logoUniao from "../../assets/uniao.jpeg";
import logoTourizense from "../../assets/tourizense.png";
import logoAcademica from "../../assets/academica.png";
import logoNogueirense from "../../assets/nogueirense.png";

const MOCK_JOGOS = [
  {
    id: 1,
    equipa_casa: "GR Vigor M",
    logo_casa: logoVigor,
    equipa_fora: "Esperança AC",
    logo_fora: logoEsperanca,
    data: "2025-06-14",
    hora: "21:00",
    estadio: "Campo dos Sardões",
    jornada: 34,
  },
  {
    id: 2,
    equipa_casa: "União 1919",
    logo_casa: logoUniao,
    equipa_fora: "GD Tourizense",
    logo_fora: logoTourizense,
    data: "2025-06-14",
    hora: "17:00",
    estadio: "Estádio Municipal Sérgio Conceição",
    jornada: 34,
  },
  {
    id: 3,
    equipa_casa: "Académica SF",
    logo_casa: logoAcademica,
    equipa_fora: "AD Nogueirense",
    logo_fora: logoNogueirense,
    data: "2025-06-14",
    hora: "18:30",
    estadio: "Estádio Universitário",
    jornada: 34,
  },
];

const MOCK_STATS = { jogos: 240, equipas: 16, estadios: 16 };

const iniciaisEquipa = (nome) =>
  nome
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatarData = (dataStr) =>
  new Date(dataStr).toLocaleDateString("pt-PT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

function JogoCard({ jogo, onClick }) {
  return (
    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 3 }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%", p: 0 }}>
        <CardContent sx={{ p: 3, pb: "24px !important" }}>
          <Chip
            label={`Jornada ${jogo.jornada}`}
            size="small"
            color="secondary"
            sx={{ mb: 2.5, fontWeight: 700 }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box sx={{ textAlign: "center", flex: 1, minWidth: 0 }}>
              <Avatar
                src={jogo.logo_casa}
                sx={{
                  bgcolor: "primary.main",
                  mx: "auto",
                  mb: 1,
                  width: 52,
                  height: 52,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                {iniciaisEquipa(jogo.equipa_casa)}
              </Avatar>

              <Typography variant="body2" fontWeight={700} noWrap>
                {jogo.equipa_casa}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              fontWeight={900}
              color="text.secondary"
              sx={{ mx: 0.5 }}
            >
              VS
            </Typography>

            <Box sx={{ textAlign: "center", flex: 1, minWidth: 0 }}>
              <Avatar
                src={jogo.logo_fora}
                sx={{
                  bgcolor: "secondary.dark",
                  mx: "auto",
                  mb: 1,
                  width: 52,
                  height: 52,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                {iniciaisEquipa(jogo.equipa_fora)}
              </Avatar>

              <Typography variant="body2" fontWeight={700} noWrap>
                {jogo.equipa_fora}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarMonthIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {formatarData(jogo.data)}
              </Typography>

              <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary", ml: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {jogo.hora}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {jogo.estadio}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function StatCard({ icon, valor, label }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(255,255,255,0.14)",
          borderRadius: "50%",
          width: 56,
          height: 56,
          mb: 1,
        }}
      >
        {icon}
      </Box>

      <Typography variant="h4" fontWeight={800} lineHeight={1}
        sx={{ color: "#ffffff" }}
      >
        {valor}
      </Typography>

      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.6 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setJogos(MOCK_JOGOS);
      setStats(MOCK_STATS);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <Box>
      {/* HERO */}
      <Box
        sx={{
          minHeight: { xs: "56vh", md: "58vh" },
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
          py: { xs: 5, md: 6 },

          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(3px)",
            transform: "scale(1.04)",
            zIndex: 0,
          },

          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(rgba(5,15,20,0.55), rgba(5,15,20,0.7))",
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Chip
            label="Divisão de Elite – AFC Coimbra 2025/26"
            sx={{
              bgcolor: "secondary.main",
              color: "black",
              fontWeight: 700,
              mb: 3,
              fontSize: "0.85rem",
              px: 1.5,
            }}
          />

          <Typography
            variant="h2"
            component="h1"
            fontWeight={900}
            sx={{
              mb: 2,
              lineHeight: 1.1,
              fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem" },
              textShadow: "0 3px 12px rgba(0,0,0,0.65)",
              color: "#ffffff",
            }}
          >
            Partilhamos Paixão.
            <br />
            Garante o Teu Lugar.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              maxWidth: 650,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
              textShadow: "0 2px 8px rgba(0,0,0,0.65)",
              color: "#ffffff",
            }}
          >
            Os jogos da Divisão de Elite numa única plataforma. Compra o teu
            bilhete em segundos.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/jogos")}
              sx={{ px: 4.5, py: 1.4, borderRadius: 2, fontWeight: 700 }}
            >
              Ver Jogos
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4.5,
                py: 1.4,
                borderRadius: 2,
                color: "white",
                borderColor: "rgba(255,255,255,0.75)",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
              onClick={() => navigate("/meus-bilhetes")}
            >
              Os Meus Bilhetes
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ESTATÍSTICAS */}
      <Box sx={{ bgcolor: "#102027", py: { xs: 3, md: 3.5 } }}>
        <Container maxWidth="md">
          <Grid
            container
            spacing={{ xs: 2, md: 8 }}
            justifyContent="center"
            alignItems="center"
          >
            <Grid size={{ xs: 4 }}>
              <StatCard
                icon={<SportsSoccerIcon sx={{ color: "white", fontSize: 28 }} />}
                valor={stats?.jogos ?? "—"}
                label="Jogos"
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <StatCard
                icon={<GroupsIcon sx={{ color: "white", fontSize: 28 }} />}
                valor={stats?.equipas ?? "—"}
                label="Equipas"
              />
            </Grid>

            <Grid size={{ xs: 4 }}>
              <StatCard
                icon={<StadiumIcon sx={{ color: "white", fontSize: 28 }} />}
                valor={stats?.estadios ?? "—"}
                label="Estádios"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* PRÓXIMOS JOGOS */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 4,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box>
              <Typography variant="overline" color="secondary.dark" fontWeight={800}>
                Em destaque
              </Typography>

              <Typography variant="h4" fontWeight={800} color="primary.main">
                Próximos Jogos
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/jogos")}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Ver todos
            </Button>
          </Box>

          <Grid container spacing={3}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton
                      variant="rounded"
                      height={220}
                      sx={{ borderRadius: 3 }}
                    />
                  </Grid>
                ))
              : jogos.map((jogo) => (
                  <Grid key={jogo.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <JogoCard
                      jogo={jogo}
                      onClick={() => navigate(`/jogos/${jogo.id}`)}
                    />
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}