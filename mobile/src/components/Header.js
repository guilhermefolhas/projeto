import React, { useState } from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  Modal, SafeAreaView, Animated,
} from "react-native";
import { COLORS } from "../constants";
import { useAuth } from "../context/AuthContext";

const logoAFC = require("../../assets/afc_png.png");

const MENU_ITEMS = [
  { label: "Início",         screen: "Home",          icon: "🏠" },
  { label: "Jogos",          screen: "Jogos",          icon: "⚽" },
  { label: "Meus Bilhetes",  screen: "MeusBilhetes",   icon: "🎟️" },
];

export default function Header({ navigation, title }) {
  const { user, logout }    = useAuth();
  const [menuAberto, setMenu] = useState(false);
  const iniciais = user?.email?.charAt(0).toUpperCase() || "?";

  const navegar = (screen) => {
    setMenu(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {/* Hambúrguer */}
          <TouchableOpacity style={styles.iconBtn} onPress={() => setMenu(true)}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>

          {/* Logo AFC ao centro */}
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image source={logoAFC} style={styles.logo} />
          </TouchableOpacity>

          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Menu drawer */}
      <Modal visible={menuAberto} transparent animationType="fade" onRequestClose={() => setMenu(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenu(false)}>
          <View style={styles.drawer}>
            {/* Header do drawer */}
            <View style={styles.drawerHeader}>
              <Image source={logoAFC} style={styles.drawerLogo} />
              <Text style={styles.drawerTitle}>Bilheteira AFC</Text>
              <Text style={styles.drawerSub}>Divisão de Elite</Text>
            </View>

            <View style={styles.divider} />

            {/* Links */}
            {MENU_ITEMS.map(item => (
              <TouchableOpacity key={item.screen} style={styles.menuItem} onPress={() => navegar(item.screen)}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            {/* Logout */}
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenu(false); logout(); }}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuLabel, { color: COLORS.red }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.navy,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: COLORS.navy,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  iconBtn: {
    width: 36, height: 36,
    justifyContent: "center",
    gap: 5,
  },
  hamburgerLine: {
    height: 2,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    width: 22,
  },
  logo: {
    width: 40, height: 40,
    resizeMode: "contain",
  },
  avatar: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.navy,
    fontWeight: "800",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
  },
  drawer: {
    width: "75%",
    backgroundColor: COLORS.navyDark,
    paddingTop: 60,
    paddingHorizontal: 0,
  },
  drawerHeader: {
    alignItems: "center",
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  drawerLogo: {
    width: 64, height: 64,
    resizeMode: "contain",
    marginBottom: 12,
  },
  drawerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },
  drawerSub: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 8,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});