require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const bodyParser = require("body-parser");
const path       = require("path");
const sequelize  = require("./config/database");

// ── Importar modelos ──────────────────────────────────────────────────────────
const User    = require("./models/user.model");
const Cliente = require("./models/cliente.model");
const Equipa  = require("./models/equipa.model");
const Estadio = require("./models/estadio.model");
const Jogo    = require("./models/jogo.model");
const Bilhete = require("./models/bilhete.model");
const Compra  = require("./models/compra.model");

// ── Associações (define a ordem de sync e as relações) ────────────────────────
User.hasOne(Cliente,      { foreignKey: "id_user",         onDelete: "CASCADE" });
Cliente.belongsTo(User,   { foreignKey: "id_user" });

Equipa.hasMany(Estadio,   { foreignKey: "id_equipa",       onDelete: "SET NULL" });
Estadio.belongsTo(Equipa, { foreignKey: "id_equipa" });

Equipa.hasMany(Jogo,      { foreignKey: "id_equipa_casa",  as: "jogos_casa",    onDelete: "CASCADE" });
Equipa.hasMany(Jogo,      { foreignKey: "id_equipa_fora",  as: "jogos_fora",    onDelete: "CASCADE" });
Jogo.belongsTo(Equipa,    { foreignKey: "id_equipa_casa",  as: "equipa_casa" });
Jogo.belongsTo(Equipa,    { foreignKey: "id_equipa_fora",  as: "equipa_fora" });

Estadio.hasMany(Jogo,     { foreignKey: "id_estadio",      onDelete: "CASCADE" });
Jogo.belongsTo(Estadio,   { foreignKey: "id_estadio" });

Jogo.hasMany(Bilhete,     { foreignKey: "id_jogo",         onDelete: "CASCADE" });
Bilhete.belongsTo(Jogo,   { foreignKey: "id_jogo" });

Cliente.hasMany(Compra,   { foreignKey: "id_cliente",      onDelete: "CASCADE" });
Compra.belongsTo(Cliente, { foreignKey: "id_cliente" });

Bilhete.hasOne(Compra,    { foreignKey: "id_bilhete",      onDelete: "CASCADE" });
Compra.belongsTo(Bilhete, { foreignKey: "id_bilhete" });

// ── Express ───────────────────────────────────────────────────────────────────
const app  = express();
const port = 5000;

app.set("port", process.env.PORT || port);
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1",         require("./routes/auth.route"));
app.use("/api/v1/client",  require("./routes/cliente.route"));
app.use("/api/v1/equipa",  require("./routes/equipa.route"));
app.use("/api/v1/estadio", require("./routes/estadio.route"));
app.use("/api/v1/jogo",    require("./routes/jogo.route"));
app.use("/api/v1/bilhete", require("./routes/bilhete.route"));
app.use("/api/v1/compra",  require("./routes/compra.route"));

// ── Sync e arranque ──────────────────────────────────────────────────────────
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de dados ligada e tabelas sincronizadas.");
    app.listen(app.get("port"), () => {
      console.log("Servidor a correr na porta " + app.get("port"));
    });
  })
  .catch((err) => {
    console.error("Erro ao ligar à base de dados:", err.message);
  });