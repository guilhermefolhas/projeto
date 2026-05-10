import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

export default function JogoCard({ jogo, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.chip}>Jornada {jogo.jornada}</Text>

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

      <Text style={styles.info}>
        {jogo.data} · {jogo.hora}
      </Text>

      <Text style={styles.info}>{jogo.estadio}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    fontWeight: "700",
    marginBottom: 18,
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
    width: 58,
    height: 58,
    resizeMode: "contain",
    marginBottom: 8,
  },
  teamName: {
    fontWeight: "700",
    textAlign: "center",
  },
  vs: {
    fontWeight: "900",
    color: COLORS.textSecondary,
    marginHorizontal: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  info: {
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});