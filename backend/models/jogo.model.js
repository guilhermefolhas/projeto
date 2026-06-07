const sequelize = require("sequelize");
const conexao   = require("../config/database");

const Jogo = conexao.define(
  "jogo",
  {
    id:             { type: sequelize.INTEGER,  primaryKey: true, autoIncrement: true },
    data:           { type: sequelize.DATEONLY, allowNull: false },
    hora:           { type: sequelize.STRING,   allowNull: false },
    jornada:        { type: sequelize.INTEGER,  allowNull: false },
    id_estadio:     { type: sequelize.INTEGER,  allowNull: false },
    id_equipa_casa: { type: sequelize.INTEGER,  allowNull: false },
    id_equipa_fora: { type: sequelize.INTEGER,  allowNull: false },
  },
  { tableName: "jogo", timestamps: true, freezeTableName: true }
);

module.exports = Jogo;