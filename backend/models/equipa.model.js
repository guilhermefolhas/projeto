const sequelize = require("sequelize");
const conexao   = require("../config/database");

const Equipa = conexao.define(
  "equipa",
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: sequelize.STRING,
      allowNull: false,
    },
    sigla: {
      type: sequelize.STRING(15),
      allowNull: true,
    },
    logo: {
      type: sequelize.STRING,   // caminho relativo: /uploads/equipa_123.png
      allowNull: true,
    },
    fundacao: {
      type: sequelize.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "equipa",
    timestamps: true,
    freezeTableName: true,
  }
);

// Associações definidas após o modelo para evitar dependências circulares
// Carregadas aqui em vez de num ficheiro separado para manter tudo junto
const defineAssociations = () => {
  const Jogo = require("./jogo.model");
  // Uma equipa pode ter muitos jogos como equipa da casa
  Equipa.hasMany(Jogo, { foreignKey: "id_equipa_casa", as: "jogos_casa" });
  // Uma equipa pode ter muitos jogos como equipa de fora
  Equipa.hasMany(Jogo, { foreignKey: "id_equipa_fora", as: "jogos_fora" });
};

module.exports = Equipa;
module.exports.defineAssociations = defineAssociations;
