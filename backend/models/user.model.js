const bcrypt    = require("bcrypt");
const sequelize = require("sequelize");
const db        = require("../config/database");

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
      validate: { isEmail: true },
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: sequelize.ENUM("admin", "user"),  // ✅ novo campo
      allowNull: false,
      defaultValue: "user",                   // por defeito é utilizador normal
    },
  },
  {
    tableName: "user",
    timestamps: true,
    freezeTableName: true,
  }
);

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
