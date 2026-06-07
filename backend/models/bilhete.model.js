const sequelize = require("sequelize");
const conexao   = require("../config/database");

const Bilhete = conexao.define(
  "bilhete",
  {
    id:      { type: sequelize.INTEGER,         primaryKey: true, autoIncrement: true },
    custo:   { type: sequelize.DECIMAL(10, 2),  allowNull: false },
    id_jogo: { type: sequelize.INTEGER,         allowNull: false },
  },
  { tableName: "bilhete", timestamps: true, freezeTableName: true }
);

module.exports = Bilhete;