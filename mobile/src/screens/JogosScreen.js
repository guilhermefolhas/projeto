import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import JogoCard from "../components/JogoCard";
import { COLORS } from "../constants";

const MOCK_JOGOS = [
  {
    id: 1,
    equipa_casa: "GR Vigor M",
    logo_casa: require("../../assets/vigor.png"),
    equipa_fora: "Esperança AC",
    logo_fora: require("../../assets/esperanca.jpeg"),
    data: "2025-06-14",
    hora: "21:00",
    estadio: "Campo dos Sardões",
    jornada: 34,
  },
  {
    id: 2,
    equipa_casa: "União 1919",
    logo_casa: require("../../assets/uniao.jpeg"),
    equipa_fora: "GD Tourizense",
    logo_fora: require("../../assets/tourizense.png"),
    data: "2025-06-14",
    hora: "17:00",
    estadio: "Estádio Municipal Sérgio Conceição",
    jornada: 34,
  },
  {
    id: 3,
    equipa_casa: "Académica SF",
    logo_casa: require("../../assets/academica.png"),
    equipa_fora: "AD Nogueirense",
    logo_fora: require("../../assets/nogueirense.png"),
    data: "2025-06-14",
    hora: "18:30",
    estadio: "Estádio Universitário",
    jornada: 34,
  },
];

export default function JogosScreen({ navigation }) {
  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Jogos</Text>
        <Text style={styles.subtitle}>Divisão de Elite AFC Coimbra</Text>
      </View>

      <View style={styles.list}>
        {MOCK_JOGOS.map((jogo) => (
          <JogoCard
            key={jogo.id}
            jogo={jogo}
            onPress={() =>
              navigation.navigate("JogoDetalhes", {
                jogo,
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 6,
  },
  list: {
    padding: 18,
  },
});