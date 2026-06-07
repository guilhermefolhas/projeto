import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { COLORS } from "../constants";
import { useAuth } from "../context/AuthContext";
import jogoService    from "../services/jogo.service";
import equipaService  from "../services/equipa.service";
import estadioService from "../services/estadio.service";
import JogoCard from "../components/JogoCard";
import Header from "../components/Header";

const heroImg = require("../../assets/afc_image.jpeg");

export default function HomePage({ navigation }) {
  const { logout }        = useAuth();
  const [jogos, setJogos] = useState([]);
  const [stats, setStats] = useState({ jogos: 0, equipas: 0, estadios: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [rj, re, res] = await Promise.all([jogoService.getAll(), equipaService.getAll(), estadioService.getAll()]);
        const jogosDados    = rj.data?.data    || [];
        const equipasDados  = re.data?.data    || [];
        const estadiosDados = res.data?.data   || [];

        const mapaEq = Object.fromEntries(equipasDados.map(e => [e.id, { nome: e.nome, logo: e.logo }]));
        const mapaEs = Object.fromEntries(estadiosDados.map(e => [e.id, e.nome]));

        setJogos(jogosDados.slice(0, 3).map(j => ({
          ...j,
          equipa_casa: mapaEq[j.id_equipa_casa]?.nome || `Equipa ${j.id_equipa_casa}`,
          logo_casa:   mapaEq[j.id_equipa_casa]?.logo || null,
          equipa_fora: mapaEq[j.id_equipa_fora]?.nome || `Equipa ${j.id_equipa_fora}`,
          logo_fora:   mapaEq[j.id_equipa_fora]?.logo || null,
        })));
        setStats({ jogos: jogosDados.length, equipas: equipasDados.length, estadios: estadiosDados.length });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    carregar();
  }, []);

  return (
    <ScrollView style={styles.page}>
      <ImageBackground source={heroImg} style={styles.hero} blurRadius={2}>
        <View style={styles.overlay}>
          <Text style={styles.chip}>Divisão de Elite – AFC Coimbra 2025/26</Text>
          <Text style={styles.title}>Partilhamos Paixão.{"\n"}<Text style={{ color: COLORS.gold }}>Garante o Teu Lugar.</Text></Text>
          <Text style={styles.subtitle}>Os jogos da Divisão de Elite numa única plataforma.</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate("Jogos")}>
              <Text style={styles.primaryBtnText}>VER JOGOS →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate("MeusBilhetes")}>
              <Text style={styles.outlineBtnText}>OS MEUS BILHETES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.stats}>
        {[{ v: stats.jogos, l: "Jogos" }, { v: stats.equipas, l: "Equipas" }, { v: stats.estadios, l: "Estádios" }].map(s => (
          <View key={s.l} style={styles.statBox}>
            <Text style={styles.statNum}>{s.v}</Text>
            <Text style={styles.statLabel}>{s.l}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.overline}>— Em destaque</Text>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Jogos</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Jogos")}>
            <Text style={styles.verTodos}>Ver todos →</Text>
          </TouchableOpacity>
        </View>
        {loading
          ? <ActivityIndicator color={COLORS.gold} size="large" style={{ marginTop: 24 }} />
          : jogos.map(j => <JogoCard key={j.id} jogo={j} onPress={() => navigation.navigate("JogoDetalhes", { jogoId: j.id })} />)
        }
      </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flex: 1 },
  hero: { minHeight: 420 },
  overlay: { flex: 1, minHeight: 420, paddingHorizontal: 24, paddingTop: 60, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(10,20,50,0.72)" },
  chip: { color: COLORS.gold, fontWeight: "700", fontSize: 12, letterSpacing: 1, backgroundColor: "rgba(200,168,80,0.15)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 20, textTransform: "uppercase" },
  title: { color: COLORS.white, fontSize: 32, fontWeight: "900", textAlign: "center", lineHeight: 40, marginBottom: 14 },
  subtitle: { color: "rgba(255,255,255,0.7)", fontSize: 15, textAlign: "center", marginBottom: 28 },
  buttons: { width: "100%", gap: 12 },
  primaryBtn: { backgroundColor: COLORS.gold, padding: 15, borderRadius: 8, alignItems: "center" },
  primaryBtnText: { color: COLORS.navy, fontWeight: "800", fontSize: 14, letterSpacing: 1 },
  outlineBtn: { borderWidth: 1, borderColor: "rgba(255,255,255,0.4)", padding: 15, borderRadius: 8, alignItems: "center" },
  outlineBtnText: { color: COLORS.white, fontWeight: "700", fontSize: 14 },
  stats: { flexDirection: "row", justifyContent: "space-around", backgroundColor: COLORS.navy, paddingVertical: 28, borderBottomWidth: 3, borderBottomColor: COLORS.gold },
  statBox: { alignItems: "center" },
  statNum: { color: COLORS.white, fontSize: 30, fontWeight: "900" },
  statLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },
  section: { padding: 20 },
  overline: { color: COLORS.gold, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 },
  sectionTitle: { color: COLORS.white, fontSize: 24, fontWeight: "900" },
  verTodos: { color: COLORS.white, fontSize: 13, fontWeight: "700" },
  logoutBtn: { marginHorizontal: 20, marginBottom: 40, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", padding: 14, borderRadius: 8, alignItems: "center" },
  logoutText: { color: "rgba(255,255,255,0.6)", fontWeight: "600" },
});