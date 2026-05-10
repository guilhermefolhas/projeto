import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { COLORS } from "../constants";

const logoAFC = require("../../assets/afc_logo_preto.png");

export default function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={logoAFC} style={styles.logo} />

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Bilheteira AFC</Text>

        <TextInput
          style={styles.input}
          placeholder="Email *"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>REGISTAR</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Já tem conta?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Entre aqui
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 28,
    alignItems: "center",
    elevation: 5,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 26,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  button: {
    width: "100%",
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text,
  },
  link: {
    color: COLORS.blue,
    fontWeight: "600",
  },
});