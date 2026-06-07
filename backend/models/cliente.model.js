const sequelize = require("sequelize");
const conexao   = require("../config/database");

const Cliente = conexao.define(
  "cliente",
  {
    id:             { type: sequelize.INTEGER,  primaryKey: true, autoIncrement: true },
    nome:           { type: sequelize.STRING,   allowNull: false },
    email:          { type: sequelize.STRING,   allowNull: false, unique: true, validate: { isEmail: true } },
    nif:            { type: sequelize.STRING,   allowNull: false, unique: true },
    telemovel:      { type: sequelize.STRING,   allowNull: true  },
    dta_nascimento: { type: sequelize.DATEONLY, allowNull: true  },
    id_user:        { type: sequelize.INTEGER,  allowNull: true  },
  },
  { tableName: "cliente", timestamps: true, freezeTableName: true }
);

module.exports = Cliente;