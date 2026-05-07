import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/home">Home</Link> |{" "}
      <Link to="/jogos">Jogos</Link> |{" "}
      <Link to="/meus-bilhetes">Meus Bilhetes</Link> |{" "}
      <Link to="/admin">Admin</Link> |{" "}
      <Link to="/">Logout</Link>
    </nav>
  );
}

export default Navbar;