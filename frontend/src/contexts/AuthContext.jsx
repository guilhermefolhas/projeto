import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Recupera sessão guardada se existir
    const guardado = localStorage.getItem("user");
    return guardado ? JSON.parse(guardado) : null;
  });

  const navigate = useNavigate();

  const login = (dados) => {
    // dados = { token, role, email }
    localStorage.setItem("user", JSON.stringify(dados));
    setUser(dados);

    if (dados.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
