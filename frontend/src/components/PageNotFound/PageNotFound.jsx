function PageNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "8rem",
          fontWeight: 800,
          margin: 0,
          letterSpacing: "-4px",
          color: "white",
          lineHeight: 1,
        }}
      >
        4
        <span
          style={{
            display: "inline-block",
            transform: "rotate(15deg)",
            margin: "0 8px",
          }}
        >
          ⚽
        </span>
        4
      </h1>

      <h2
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          margin: "1rem 0",
          color: "white",
        }}
      >
        Fora de jogo!
      </h2>

      <p
        style={{
          color: "white",
          maxWidth: "500px",
          margin: "0 auto 2rem",
          lineHeight: 1.8,
          fontSize: "1.2rem",
        }}
      >
        O árbitro assinalou falta — esta página saiu do campo.
        <br />
        Volta ao início e retoma o jogo.
      </p>

      <a
        href="/home"
        style={{
          display: "inline-block",
          padding: "12px 32px",
          background: "#102027",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "1rem",
          transition: "0.3s",
        }}
      >
        Voltar ao início
      </a>
    </div>
  );
}

export default PageNotFound;