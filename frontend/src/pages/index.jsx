import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import ScrollTop from "../components/ScrollTop/ScrollTop";

function Layout() {
  return (
    <>
      {/* Volta ao topo sempre que muda de página */}
      <ScrollTop />

      {/* Navbar fixa no topo */}
      <Navbar />

      {/* Espaço para compensar a altura da Navbar */}
      <Toolbar
        sx={{
          minHeight: 80,
          py: 1,
        }}
      />

      {/* Conteúdo das páginas */}
      <Box
        sx={{
          minHeight: "calc(100vh - 80px)",
          bgcolor: "#f5f5f5",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}

export default Layout;