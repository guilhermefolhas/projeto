import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  Image, ActivityIndicator, TouchableOpacity,
} from "react-native";
import { COLORS, UPLOADS_URL } from "../constants";
import { useAuth } from "../context/AuthContext";
import compraService  from "../services/compra.service";
import bilheteService from "../services/bilhete.service";
import jogoService    from "../services/jogo.service";
import equipaService  from "../services/equipa.service";
import estadioService from "../services/estadio.service";

const iniciais = (nome = "") => nome.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

const formatarData = (d) =>
  new Date(d).toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

const jogoPassou = (d) => new Date(d) < new Date();

function BilheteCard({ compra }) {
  const passado = jogoPassou(compra.data);
  return (
    <View style={[styles.card, passado && { opacity: 0.75 }]}>
      {/* Header */}
      <View style={[styles.cardHeader, { backgroundColor: passado ? "#0a1535" : COLORS.navy }]}>
        <View style={styles.headerLeft}>
          {compra.logo_casa
            ? <Image source={{ uri: `${UPLOADS_URL}${compra.logo_casa}` }} style={styles.logo} />
            : <View style={styles.iniciais}><Text style={styles.iniciaisText}>{iniciais(compra.equipa_casa)}</Text></View>
          }
          <Text style={styles.vsText}>vs</Text>
          {compra.logo_fora
            ? <Image source={{ uri: `${UPLOADS_URL}${compra.logo_fora}` }} style={styles.logo} />
            : <View style={[styles.iniciais, { backgroundColor: "rgba(200,168,80,0.15)" }]}>
                <Text style={[styles.iniciaisText, { color: COLORS.gold }]}>{iniciais(compra.equipa_fora)}</Text>
              </View>
          }
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text style={styles.equipasText} numberOfLines={1}>
              {compra.equipa_casa} vs {compra.equipa_fora}
            </Text>
            <Text style={styles.jornada}>Jornada {compra.jornada}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: passado ? "rgba(255,255,255,0.08)" : "rgba(74,222,128,0.15)" }]}>
          <Text style={[styles.badgeText, { color: passado ? COLORS.muted : COLORS.green }]}>
            {passado ? "Realizado" : "Próximo"}
          </Text>
        </View>
      </View>

      {/* Corpo */}
      <View style={styles.cardBody}>
        <View style={{ flex: 1 }}>
          <Text style={styles.info}>📅 {formatarData(compra.data)} · {compra.hora}</Text>
          <Text style={styles.info}>📍 {compra.estadio}</Text>
          <Text style={styles.info}>Estado: <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: "700" }}>{compra.estado}</Text></Text>
        </View>
        <View style={styles.qrBox}>
          <Text style={styles.bilheteId}>#BIL{compra.id_bilhete}</Text>
          <Text style={styles.preco}>{Number(compra.custo).toFixed(2)}€</Text>
        </View>
      </View>
    </View>
  );
}

export default function MeusBilhetesPage({ navigation }) {
  const { user }                = useAuth();
  const [compras, setCompras]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [erro, setErro]         = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const rc = await compraService.getByCliente(user.id_cliente);
        const lista = rc.data || [];
        if (!lista.length) { setCompras([]); return; }

        const enriquecidas = await Promise.all(lista.map(async (compra) => {
          try {
            const rb = await bilheteService.getById(compra.id_bilhete);
            const rj = await jogoService.getById(rb.data.id_jogo);
            const j  = rj.data;
            const [rCasa, rFora, rEst] = await Promise.all([
              equipaService.getById(j.id_equipa_casa),
              equipaService.getById(j.id_equipa_fora),
              estadioService.getById(j.id_estadio),
            ]);
            return {
              ...compra,
              custo:       rb.data.custo,
              data:        j.data,
              hora:        j.hora,
              jornada:     j.jornada,
              equipa_casa: rCasa.data?.nome || `Equipa ${j.id_equipa_casa}`,
              logo_casa:   rCasa.data?.logo || null,
              equipa_fora: rFora.data?.nome || `Equipa ${j.id_equipa_fora}`,
              logo_fora:   rFora.data?.logo || null,
              estadio:     rEst.data?.nome  || `Estádio ${j.id_estadio}`,
            };
          } catch { return compra; }
        }));
        setCompras(enriquecidas);
      } catch { setErro("Erro ao carregar bilhetes."); }
      finally { setLoading(false); }
    };
    carregar();
  }, [user]);

  const proximos = compras.filter(c => !jogoPassou(c.data));
  const passados = compras.filter(c =>  jogoPassou(c.data));

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Início</Text>
        </TouchableOpacity>
        <Text style={styles.overline}>— A minha conta</Text>
        <Text style={styles.title}>Os Meus Bilhetes</Text>
      </View>

      <View style={styles.content}>
        {loading && <ActivityIndicator color={COLORS.gold} size="large" style={{ marginTop: 40 }} />}
        {erro    && <Text style={{ color: COLORS.red, textAlign: "center", marginTop: 20 }}>{erro}</Text>}

        {!loading && !erro && compras.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⚽</Text>
            <Text style={styles.emptyTitle}>Ainda não tens bilhetes</Text>
            <Text style={styles.emptySub}>Compra o teu primeiro bilhete e aparece aqui.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate("Jogos")}>
              <Text style={styles.emptyBtnText}>VER JOGOS DISPONÍVEIS</Text>
            </TouchableOpacity>
          </View>
        )}

        {proximos.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Próximos Jogos ({proximos.length})</Text>
            {proximos.map(c => <BilheteCard key={c.id} compra={c} />)}
          </View>
        )}

        {passados.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionTitle, { color: COLORS.muted }]}>Histórico ({passados.length})</Text>
            {passados.map(c => <BilheteCard key={c.id} compra={c} />)}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20,
  },
  back: { marginBottom: 12 },
  backText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  overline: { color: COLORS.gold, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900" },
  content: { padding: 16 },
  sectionTitle: { color: COLORS.green, fontSize: 16, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 10, marginBottom: 16,
    overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", padding: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 8 },
  logo: { width: 36, height: 36, resizeMode: "contain", backgroundColor: "#fff", borderRadius: 6, padding: 2 },
  iniciais: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  iniciaisText: { color: COLORS.white, fontWeight: "800", fontSize: 11 },
  vsText: { color: "rgba(255,255,255,0.5)", fontWeight: "700", fontSize: 12 },
  equipasText: { color: COLORS.white, fontWeight: "700", fontSize: 13 },
  jornada: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  cardBody: {
    flexDirection: "row", padding: 14,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.07)",
  },
  info: { color: COLORS.muted, fontSize: 13, marginBottom: 6 },
  qrBox: { alignItems: "flex-end", paddingLeft: 14, borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.07)" },
  bilheteId: { color: COLORS.muted, fontSize: 11, marginBottom: 8 },
  preco: { color: COLORS.gold, fontWeight: "900", fontSize: 18 },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: COLORS.white, fontSize: 18, fontWeight: "700", marginBottom: 8 },
  emptySub: { color: COLORS.muted, fontSize: 14, textAlign: "center", marginBottom: 24 },
  emptyBtn: {
    backgroundColor: COLORS.gold, paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 8,
  },
  emptyBtnText: { color: COLORS.navy, fontWeight: "800", fontSize: 13, letterSpacing: 1 },
});
