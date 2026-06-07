import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";
import jogoService    from "../services/jogo.service";
import equipaService  from "../services/equipa.service";
import estadioService from "../services/estadio.service";
import JogoCard from "../components/JogoCard";
import Header from "../components/Header";

export default function JogosPage({ navigation }) {
  const [jogos, setJogos]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const [rj, re, res] = await Promise.all([jogoService.getAll(), equipaService.getAll(), estadioService.getAll()]);
        const mapaEq = Object.fromEntries((re.data?.data||[]).map(e => [e.id, { nome: e.nome, logo: e.logo }]));
        const mapaEs = Object.fromEntries((res.data?.data||[]).map(e => [e.id, e.nome]));
        setJogos((rj.data?.data||[]).map(j => ({
          ...j,
          equipa_casa: mapaEq[j.id_equipa_casa]?.nome || `Equipa ${j.id_equipa_casa}`,
          logo_casa:   mapaEq[j.id_equipa_casa]?.logo || null,
          equipa_fora: mapaEq[j.id_equipa_fora]?.nome || `Equipa ${j.id_equipa_fora}`,
          logo_fora:   mapaEq[j.id_equipa_fora]?.logo || null,
          estadio:     mapaEs[j.id_estadio] || `Estádio ${j.id_estadio}`,
        })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    carregar();
  }, []);

  const filtrados = jogos.filter(j => {
    const q = pesquisa.toLowerCase();
    return (j.equipa_casa||"").toLowerCase().includes(q) || (j.equipa_fora||"").toLowerCase().includes(q);
  });

  return (
    <View style={styles.page}>
      <Header navigation={navigation} />
      <View style={styles.titleBar}>
        <Text style={styles.overline}>Divisão de Elite · AFC Coimbra</Text>
        <Text style={styles.title}>Todos os Jogos</Text>
      </View>
      <View style={styles.searchBox}>
        <TextInput style={styles.search} placeholder="Pesquisar equipa…" placeholderTextColor={COLORS.muted} value={pesquisa} onChangeText={setPesquisa} />
      </View>
      {loading
        ? <ActivityIndicator color={COLORS.gold} size="large" style={{ marginTop: 40 }} />
        : <ScrollView contentContainerStyle={styles.list}>
            <Text style={styles.count}>{filtrados.length} jogo(s) encontrado(s)</Text>
            {filtrados.map(j => <JogoCard key={j.id} jogo={j} onPress={() => navigation.navigate("JogoDetalhes", { jogoId: j.id })} />)}
          </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.background },
  titleBar: { backgroundColor: COLORS.navy, paddingVertical: 16, paddingHorizontal: 20 },
  overline: { color: COLORS.gold, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900" },
  searchBox: { padding: 16 },
  search: { backgroundColor: COLORS.cardBg, borderRadius: 10, padding: 13, color: COLORS.white, fontSize: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  count: { color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 12 },
});