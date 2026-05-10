import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

export default function JogoDetalhesScreen({ route }) {
  const { jogo } = route.params || {};

  if (!jogo) {
    return (
      <View style={styles.center}>
        <Text>Jogo não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalhes do Jogo</Text>
        <Text style={styles.subtitle}>Jornada {jogo.jornada}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.teams}>
          <View style={styles.team}>
            <Image source={jogo.logo_casa} style={styles.logo} />
            <Text style={styles.teamName}>{jogo.equipa_casa}</Text>
          </View>

          <Text style={styles.vs}>VS</Text>

          <View style={styles.team}>
            <Image source={jogo.logo_fora} style={styles.logo} />
            <Text style={styles.teamName}>{jogo.equipa_fora}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.info}>Data: {jogo.data}</Text>
        <Text style={styles.info}>Hora: {jogo.hora}</Text>
        <Text style={styles.info}>Estádio: {jogo.estadio}</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>COMPRAR BILHETE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 6,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 18,
    padding: 22,
    borderRadius: 14,
    elevation: 3,
  },
  teams: {
    flexDirection: "row",
    alignItems: "center",
  },
  team: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: "contain",
    marginBottom: 10,
  },
  teamName: {
    fontWeight: "800",
    textAlign: "center",
  },
  vs: {
    fontSize: 20,
    fontWeight: "900",
    marginHorizontal: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  button: {
    marginTop: 18,
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "900",
  },
});