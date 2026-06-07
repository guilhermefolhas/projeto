import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LoginUI      from "./components/Login/LoginUI";
import RegisterUI   from "./components/Register/RegisterUI";
import Home         from "./components/Home/Home";
import Jogos        from "./components/Jogos/Jogos";
import JogoDetalhes from "./components/JogoDetalhes/JogoDetalhes";
import MeusBilhetes from "./components/MeusBilhetes/MeusBilhetes";
import Admin        from "./components/Admin/Admin";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Layout       from "./pages/index";

// Rota protegida — redireciona para / se não estiver autenticado
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return children;
}

// Rota de admin — redireciona para /home se não for admin
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <Navigate to="/home" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Sem Navbar */}
      <Route path="/"         element={<LoginUI />} />
      <Route path="/register" element={<RegisterUI />} />

      {/* Com Navbar — autenticado */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/home" element={<Home />} />

        <Route path="/jogos"     element={<Jogos />} />
        <Route path="/jogos/:id" element={<JogoDetalhes />} />

        <Route path="/meus-bilhetes" element={<MeusBilhetes />} />

        {/* Só admin */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
