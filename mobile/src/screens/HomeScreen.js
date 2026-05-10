import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants";

const heroImg = require("../../assets/afc_image.jpeg");

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.page}>
      <ImageBackground source={heroImg} style={styles.hero} blurRadius={3}>
        <View style={styles.overlay}>
          <Text style={styles.chip}>Divisão de Elite – AFC Coimbra 2025/26</Text>

          <Text style={styles.title}>
            Partilhamos Paixão.{"\n"}Garante o Teu Lugar.
          </Text>

          <Text style={styles.subtitle}>
            Os jogos da Divisão de Elite numa única plataforma. Compra o teu
            bilhete em segundos.
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Jogos")}
            >
              <Text style={styles.buttonText}>VER JOGOS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.buttonText}>OS MEUS BILHETES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>240</Text>
          <Text style={styles.statLabel}>Jogos</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>16</Text>
          <Text style={styles.statLabel}>Equipas</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>16</Text>
          <Text style={styles.statLabel}>Estádios</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.overline}>Em destaque</Text>
        <Text style={styles.sectionTitle}>Próximos Jogos</Text>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate("Jogos")}
        >
          <Text style={styles.smallButtonText}>Ver todos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    minHeight: 430,
  },
  overlay: {
    flex: 1,
    minHeight: 430,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(5,15,20,0.62)",
  },
  chip: {
    backgroundColor: COLORS.secondary,
    color: COLORS.black,
    fontWeight: "800",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  title: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 18,
  },
  subtitle: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  buttons: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
  stats: {
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 30,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "900",
  },
  statLabel: {
    color: COLORS.white,
    marginTop: 6,
  },
  section: {
    padding: 24,
  },
  overline: {
    color: COLORS.secondary,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 16,
  },
  smallButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  smallButtonText: {
    color: COLORS.primary,
    fontWeight: "800",
  },
});