import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator, Alert, ScrollView,
} from "react-native";
import { COLORS } from "../constants";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.service";

const logoAFC = require("../../assets/afc_png.png");

export default function LoginPage({ navigation }) {
  const { login }            = useAuth();
  const [email, setEmail]    = useState("");
  const [password, setPass]  = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preenche o email e a password.");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      await login({
        token:      data.AccessToken,
        role:       data.role,
        id:         data.id,
        id_cliente: data.id_cliente,
        email,
      });
    } catch (err) {
      Alert.alert("Erro", err?.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Image source={logoAFC} style={styles.logo} />
        <Text style={styles.title}>Bilheteira AFC</Text>
        <Text style={styles.subtitle}>Divisão de Elite · Coimbra</Text>

        <View style={styles.divider} />

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={COLORS.muted}
          keyboardType="email-address" autoCapitalize="none"
          value={email} onChangeText={setEmail} />

        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={COLORS.muted}
          secureTextEntry value={password} onChangeText={setPass} />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color={COLORS.navy} />
            : <Text style={styles.buttonText}>ENTRAR</Text>
          }
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Não tem conta?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
            Criar conta
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: COLORS.navyDark,
    padding: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logo: {
    width: 72, height: 72,
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontSize: 24, fontWeight: "900",
    color: COLORS.white, letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13, color: COLORS.muted,
    marginTop: 4, marginBottom: 24,
  },
  divider: {
    width: "100%", height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
    color: COLORS.white,
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.gold,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.navy,
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1,
  },
  footerText: {
    fontSize: 14, color: COLORS.muted,
  },
  link: {
    color: COLORS.gold, fontWeight: "700",
  },
});
