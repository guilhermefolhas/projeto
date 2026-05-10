function PageNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "6rem", fontWeight: 800, margin: 0, letterSpacing: "-4px" }}>
        4<span style={{ display: "inline-block", transform: "rotate(15deg)", margin: "0 4px" }}>⚽</span>4
      </h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "1rem 0 0.5rem" }}>
        Fora de jogo!
      </h2>
      <p style={{ color: "#6b7280", maxWidth: 360, margin: "0 auto 2rem", lineHeight: 1.7 }}>
        O árbitro assinalou falta — esta página saiu do campo.
        Volta ao início e retoma o jogo.
      </p>
      <a href="/home" style={{ display: "inline-block", padding: "10px 28px", background: "#102027", color: "white", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
        Voltar ao início
      </a>
    </div>
  );
}

export default PageNotFound;