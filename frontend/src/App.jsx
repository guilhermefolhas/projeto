import { Routes, Route } from "react-router-dom";

import LoginUI from "./components/Login/LoginUI";
import RegisterUI from "./components/Register/RegisterUI";
import Home from "./components/Home/Home";
import Jogos from "./components/Jogos/Jogos";
import JogoDetalhes from "./components/JogoDetalhes/JogoDetalhes";
import MeusBilhetes from "./components/MeusBilhetes/MeusBilhetes";
import Admin from "./components/Admin/Admin";
import PageNotFound from "./components/PageNotFound/PageNotFound";

import Layout from "./pages/index";

function App() {
  return (
    <Routes>
      {/* Sem Navbar */}
      <Route path="/" element={<LoginUI />} />
      <Route path="/register" element={<RegisterUI />} />

      {/* Com Navbar */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />

        <Route path="/jogos" element={<Jogos />} />
        <Route path="/jogos/:id" element={<JogoDetalhes />} />

        {/* Rota direta para aparecer na Navbar */}
        <Route path="/jogo-detalhes" element={<JogoDetalhes />} />

        <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

      {/* Página não encontrada */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;