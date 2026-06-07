import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, UPLOADS_URL } from "../constants";

const iniciais = (nome = "") =>
  nome.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

export default function JogoCard({ jogo, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>⚽</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Futebol</Text>
            <Text style={styles.headerSub}>Divisão de Elite · Jornada {jogo.jornada}</Text>
          </View>
        </View>
      </View>

      {/* Equipas */}
      <View style={styles.teams}>
        {/* Casa */}
        <View style={styles.team}>
          {jogo.logo_casa
            ? <Image source={{ uri: `${UPLOADS_URL}${jogo.logo_casa}` }} style={styles.logo} />
            : <View style={styles.iniciais}><Text style={styles.iniciaisText}>{iniciais(jogo.equipa_casa)}</Text></View>
          }
          <Text style={styles.teamName} numberOfLines={2}>{jogo.equipa_casa}</Text>
        </View>

        {/* Hora */}
        <View style={styles.horaBox}>
          <Text style={styles.hora}>{jogo.hora}</Text>
        </View>

        {/* Fora */}
        <View style={styles.team}>
          {jogo.logo_fora
            ? <Image source={{ uri: `${UPLOADS_URL}${jogo.logo_fora}` }} style={styles.logo} />
            : <View style={styles.iniciais}><Text style={styles.iniciaisText}>{iniciais(jogo.equipa_fora)}</Text></View>
          }
          <Text style={styles.teamName} numberOfLines={2}>{jogo.equipa_fora}</Text>
        </View>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnDetalhes} onPress={onPress}>
          <Text style={styles.btnDetalhesText}>Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnComprar} onPress={onPress}>
          <Text style={styles.btnComprarText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 28, height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  iconText: { fontSize: 14 },
  headerTitle: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
    fontSize: 13,
  },
  headerSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
  },
  teams: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  team: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 52, height: 52,
    resizeMode: "contain",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 2,
  },
  iniciais: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  iniciaisText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 14,
  },
  teamName: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },
  horaBox: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  hora: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.07)",
  },
  btnDetalhes: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.07)",
  },
  btnDetalhesText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
    fontSize: 13,
  },
  btnComprar: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#1A6DFF",
  },
  btnComprarText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },
});
