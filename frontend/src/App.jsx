import { Routes, Route } from "react-router-dom";

import LoginUI from "./components/Login/LoginUI";
import Home from "./components/Home/Home";
import Layout from "./pages/index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginUI />} />

      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;