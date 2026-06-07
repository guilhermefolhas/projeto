const sequelize = require("sequelize");
const conexao   = require("../config/database");

const Estadio = conexao.define(
  "estadio",
  {
    id:         { type: sequelize.INTEGER,         primaryKey: true, autoIncrement: true },
    nome:       { type: sequelize.STRING,          allowNull: false },
    morada:     { type: sequelize.STRING,          allowNull: false },
    lotacao:    { type: sequelize.INTEGER,         allowNull: false },
    preco_base: { type: sequelize.DECIMAL(10, 2),  allowNull: false },
    id_equipa:  { type: sequelize.INTEGER,         allowNull: true  },
  },
  { tableName: "estadio", timestamps: true, freezeTableName: true }
);

module.exports = Estadio;