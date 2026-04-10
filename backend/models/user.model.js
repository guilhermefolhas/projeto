const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define(
  "user",
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user",
    timestamps: true,
    freezeTableName: true
  }
);

User.beforeCreate((user, options) => {    // Encriptar a senha antes de criar um novo usuário
  return bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
    })
    .catch((error) => {
      throw new Error("Erro ao gerar o hash: " + error.message);
    });
});

User.beforeUpdate((user, options) => {      // Encriptar a senha antes de atualizar um user, se a senha tiver sido alterada
  if (user.changed("password")) {
    return bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
      })
      .catch((error) => {
        throw new Error("Erro ao gerar o hash: " + error.message);
      });
  }
});

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
