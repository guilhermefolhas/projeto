import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { COLORS, UPLOADS_URL } from "../constants";
import { useAuth } from "../context/AuthContext";
import jogoService    from "../services/jogo.service";
import equipaService  from "../services/equipa.service";
import estadioService from "../services/estadio.service";
import compraService  from "../services/compra.service";

const iniciais = (nome = "") => nome.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

export default function JogoDetalhesPage({ route, navigation }) {
  const { jogoId }    = route.params || {};
  const { user }      = useAuth();
  const [jogo, setJogo]         = useState(null);
  const [bilhete, setBilhete]   = useState(null);
  const [disponiveis, setDisp]  = useState(0);
  const [esgotado, setEsgotado] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [comprando, setComprando] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const rj = await jogoService.getById(jogoId);
        const d  = rj.data;

        const [rCasa, rFora, rEst, rDisp] = await Promise.all([
          equipaService.getById(d.id_equipa_casa),
          equipaService.getById(d.id_equipa_fora),
          estadioService.getById(d.id_estadio),
          compraService.getDisponibilidade(d.id),
        ]);

        setJogo({
          ...d,
          equipa_casa: rCasa.data?.nome || `Equipa ${d.id_equipa_casa}`,
          sigla_casa:  rCasa.data?.sigla || null,
          logo_casa:   rCasa.data?.logo  || null,
          equipa_fora: rFora.data?.nome || `Equipa ${d.id_equipa_fora}`,
          sigla_fora:  rFora.data?.sigla || null,
          logo_fora:   rFora.data?.logo  || null,
          estadio:     rEst.data?.nome   || `Estádio ${d.id_estadio}`,
          morada:      rEst.data?.morada || "—",
          lotacao:     rEst.data?.lotacao || 0,
        });

        const disp = rDisp.data || {};
        setDisp(disp.disponiveis || 0);
        setEsgotado(disp.disponiveis === 0 && disp.total > 0);
        setBilhete(disp.bilhete || null);
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar o jogo.");
      } finally {
        setLoading(false);
      }
    };
    if (jogoId) carregar();
  }, [jogoId]);

  const handleComprar = async () => {
    if (!bilhete) return;
    Alert.alert(
      "Confirmar Compra",
      `Comprar bilhete para ${jogo?.sigla_casa || jogo?.equipa_casa} vs ${jogo?.sigla_fora || jogo?.equipa_fora} por ${Number(bilhete.custo).toFixed(2)}€?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setComprando(true);
            try {
              await compraService.create({
                id_cliente: user.id_cliente,
                id_bilhete: bilhete.id,
                estado: "por pagar",
              });
              Alert.alert("✅ Sucesso", "Bilhete comprado com sucesso!");
            } catch (e) {
              Alert.alert("Erro", "Não foi possível processar a compra.");
            } finally {
              setComprando(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  if (!jogo) return null;

  return (
    <ScrollView style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Jogos</Text>
        </TouchableOpacity>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Jornada {jogo.jornada} · Divisão de Elite</Text>
        </View>

        {/* Equipas */}
        <View style={styles.teams}>
          <View style={styles.team}>
            {jogo.logo_casa
              ? <Image source={{ uri: `${UPLOADS_URL}${jogo.logo_casa}` }} style={styles.logo} />
              : <View style={styles.iniciais}><Text style={styles.iniciaisText}>{iniciais(jogo.equipa_casa)}</Text></View>
            }
            <Text style={styles.teamName}>{jogo.sigla_casa || jogo.equipa_casa}</Text>
            <Text style={styles.teamLabel}>CASA</Text>
          </View>

          <View style={styles.horaBox}>
            <Text style={styles.hora}>{jogo.hora}</Text>
            <Text style={styles.vs}>VS</Text>
          </View>

          <View style={styles.team}>
            {jogo.logo_fora
              ? <Image source={{ uri: `${UPLOADS_URL}${jogo.logo_fora}` }} style={styles.logo} />
              : <View style={styles.iniciais}><Text style={styles.iniciaisText}>{iniciais(jogo.equipa_fora)}</Text></View>
            }
            <Text style={styles.teamName}>{jogo.sigla_fora || jogo.equipa_fora}</Text>
            <Text style={styles.teamLabel}>FORA</Text>
          </View>
        </View>

        {/* Info chips */}
        <View style={styles.chips}>
          <Text style={styles.chip}>📅 {jogo.data}</Text>
          <Text style={styles.chip}>🕐 {jogo.hora}</Text>
          <Text style={styles.chip}>📍 {jogo.estadio}</Text>
        </View>
      </View>

      {/* Info estádio */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Informações do Estádio</Text>
        {[
          { label: "Nome",    value: jogo.estadio },
          { label: "Morada",  value: jogo.morada },
          { label: "Lotação", value: `${Number(jogo.lotacao).toLocaleString()} lugares` },
          { label: "Preço",   value: bilhete ? `${Number(bilhete.custo).toFixed(2)}€` : "—" },
        ].map(item => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Compra */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎟️ Comprar Bilhete</Text>
        {esgotado ? (
          <View style={styles.esgotado}>
            <Text style={styles.esgotadoText}>🚫 Esgotado</Text>
            <Text style={styles.esgotadoSub}>Todos os bilhetes foram vendidos.</Text>
          </View>
        ) : !bilhete ? (
          <Text style={{ color: COLORS.muted, textAlign: "center", marginTop: 8 }}>
            Sem bilhetes disponíveis.
          </Text>
        ) : (
          <>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{Number(bilhete.custo).toFixed(2)}€</Text>
            </View>
            <Text style={styles.dispText}>
              <Text style={{ color: COLORS.green }}>{disponiveis.toLocaleString()}</Text> bilhetes disponíveis
            </Text>
            <TouchableOpacity
              style={[styles.buyBtn, comprando && { opacity: 0.6 }]}
              onPress={handleComprar}
              disabled={comprando}
            >
              {comprando
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.buyBtnText}>COMPRAR AGORA</Text>
              }
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  header: {
    backgroundColor: "#0a1535",
    paddingTop: 60, paddingBottom: 28, paddingHorizontal: 20,
    alignItems: "center",
  },
  back: { alignSelf: "flex-start", marginBottom: 16 },
  backText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  badge: {
    backgroundColor: "rgba(200,168,80,0.2)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 24,
  },
  badgeText: { color: COLORS.gold, fontWeight: "700", fontSize: 12 },
  teams: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  team: { flex: 1, alignItems: "center" },
  logo: {
    width: 80, height: 80, resizeMode: "contain",
    marginBottom: 10, backgroundColor: "#fff", borderRadius: 8, padding: 4,
  },
  iniciais: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  iniciaisText: { color: COLORS.white, fontWeight: "900", fontSize: 20 },
  teamName: { color: COLORS.white, fontWeight: "800", fontSize: 14, textAlign: "center" },
  teamLabel: { color: COLORS.muted, fontSize: 11, marginTop: 2, textTransform: "uppercase" },
  horaBox: { alignItems: "center", marginHorizontal: 16 },
  hora: { color: COLORS.white, fontWeight: "800", fontSize: 20, marginBottom: 4 },
  vs: { color: COLORS.gold, fontWeight: "900", fontSize: 14, letterSpacing: 2 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  chip: {
    color: "rgba(255,255,255,0.8)", fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    margin: 16, borderRadius: 12, padding: 20,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
  },
  cardTitle: { color: COLORS.white, fontWeight: "700", fontSize: 16, marginBottom: 16 },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)",
  },
  infoLabel: { color: COLORS.muted, fontSize: 13 },
  infoValue: { color: "rgba(255,255,255,0.85)", fontWeight: "600", fontSize: 13 },
  esgotado: {
    backgroundColor: "rgba(248,113,113,0.1)",
    borderRadius: 10, padding: 20, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(248,113,113,0.3)",
  },
  esgotadoText: { color: COLORS.red, fontWeight: "800", fontSize: 18 },
  esgotadoSub: { color: COLORS.muted, marginTop: 6, fontSize: 13 },
  totalBox: {
    flexDirection: "row", justifyContent: "space-between",
    backgroundColor: COLORS.background, borderRadius: 10, padding: 16, marginBottom: 12,
  },
  totalLabel: { color: COLORS.white, fontWeight: "700" },
  totalValue: { color: COLORS.gold, fontWeight: "900", fontSize: 20 },
  dispText: { color: COLORS.muted, fontSize: 13, textAlign: "center", marginBottom: 16 },
  buyBtn: {
    backgroundColor: "#1A6DFF", padding: 16,
    borderRadius: 10, alignItems: "center",
  },
  buyBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 15, letterSpacing: 1 },
});
