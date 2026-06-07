const sequelize = require("sequelize");
const conexao   = require("../config/database");

const Compra = conexao.define(
  "compra",
  {
    id:         { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    estado:     { type: sequelize.ENUM("pago", "por pagar", "cancelado"), allowNull: false, defaultValue: "por pagar" },
    dta_compra: { type: sequelize.DATE,    allowNull: false, defaultValue: sequelize.NOW },
    id_cliente: { type: sequelize.INTEGER, allowNull: false },
    id_bilhete: { type: sequelize.INTEGER, allowNull: false },
  },
  { tableName: "compra", timestamps: true, freezeTableName: true }
);

module.exports = Compra;