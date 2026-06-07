import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sessão ao arrancar
    AsyncStorage.getItem("user").then((val) => {
      if (val) setUser(JSON.parse(val));
      setLoading(false);
    });
  }, []);

  const login = async (dados) => {
    await AsyncStorage.setItem("token", dados.token);
    await AsyncStorage.setItem("user", JSON.stringify(dados));
    setUser(dados);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
