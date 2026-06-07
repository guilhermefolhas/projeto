import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator, Alert, ScrollView,
} from "react-native";
import { COLORS } from "../constants";
import authService from "../services/auth.service";

const logoAFC = require("../../assets/afc_png.png");

export default function RegisterPage({ navigation }) {
  const [form, setForm] = useState({
    nome: "", email: "", password: "", nif: "", telemovel: "", dta_nascimento: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (campo) => (val) => setForm((f) => ({ ...f, [campo]: val }));

  const handleRegister = async () => {
    if (!form.nome || !form.email || !form.password || !form.nif) {
      Alert.alert("Erro", "Nome, email, password e NIF são obrigatórios.");
      return;
    }
    if (form.nif.length !== 9 || !/^\d+$/.test(form.nif)) {
      Alert.alert("Erro", "O NIF deve ter exactamente 9 dígitos.");
      return;
    }
    setLoading(true);
    try {
      await authService.register(form);
      Alert.alert("Sucesso", "Conta criada! Faz login.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      Alert.alert("Erro", err?.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const Campo = ({ label, campo, ...props }) => (
    <TextInput
      style={styles.input}
      placeholder={label}
      placeholderTextColor={COLORS.muted}
      value={form[campo]}
      onChangeText={set(campo)}
      {...props}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Image source={logoAFC} style={styles.logo} />
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Divisão de Elite · AFC Coimbra</Text>

        <View style={styles.divider} />

        <Campo label="Nome completo *"   campo="nome" autoCapitalize="words" />
        <Campo label="Email *"           campo="email" keyboardType="email-address" autoCapitalize="none" />
        <Campo label="Password *"        campo="password" secureTextEntry />
        <Campo label="NIF * (9 dígitos)" campo="nif" keyboardType="numeric" maxLength={9} />
        <Campo label="Telemóvel"         campo="telemovel" keyboardType="phone-pad" />
        <Campo label="Data Nasc. (AAAA-MM-DD)" campo="dta_nascimento" />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color={COLORS.navy} />
            : <Text style={styles.buttonText}>CRIAR CONTA</Text>
          }
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Já tem conta?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Entrar
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
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logo: {
    width: 60, height: 60,
    resizeMode: "contain",
    marginBottom: 12,
  },
  title: {
    fontSize: 22, fontWeight: "900",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 13, color: COLORS.muted,
    marginTop: 4, marginBottom: 20,
  },
  divider: {
    width: "100%", height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    marginBottom: 12,
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
