import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants";

import LoginPage          from "../pages/LoginPage";
import RegisterPage       from "../pages/RegisterPage";
import HomePage           from "../pages/HomePage";
import JogosPage          from "../pages/JogosPage";
import JogoDetalhesPage   from "../pages/JogoDetalhesPage";
import MeusBilhetesPage   from "../pages/MeusBilhetesPage";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.navy }}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Utilizador não autenticado
          <>
            <Stack.Screen name="Login"    component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
          </>
        ) : (
          // Utilizador autenticado
          <>
            <Stack.Screen name="Home"          component={HomePage} />
            <Stack.Screen name="Jogos"         component={JogosPage} />
            <Stack.Screen name="JogoDetalhes"  component={JogoDetalhesPage} />
            <Stack.Screen name="MeusBilhetes"  component={MeusBilhetesPage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
