const sequelize = require("../config/database");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");

const endpoints = {};

endpoints.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dados = await User.create({ email, password });

    res.status(200).json({
      success: true,
      message: "Utilizador criado com sucesso.",
      data: dados,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro durante o processo de autenticação.",
    });
  }
};

endpoints.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Email ou senha inválidos.",
      });
    }

    // Compara a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Email ou senha inválidos.",
      });
    }

    // Gera o token JWT
    const token = jwt.sign({ email: user.email }, config.secret, {
      expiresIn: config.timer,   // Tempo de expiração do token  
    });

    res.status(200).json({
      success: true,
      message: "Autenticação realizada com sucesso.", 
      AccessToken: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro durante o processo de autenticação.",
    });
  }
};

endpoints.refreshToken = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido.",
      });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Token inválido ou expirado.",
        });
      }

      const newToken = jwt.sign({ email: decoded.email }, config.secret, {
        expiresIn: config.timer,
      });

      res.status(200).json({
        success: true,
        message: "Token renovado com sucesso.",
        AccessToken: newToken,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro durante o processo de renovação do token.",
    });
  }
};

endpoints.logout = async (req, res) => {
  try {
    // Invalida o token no lado do cliente (não há como invalidar um JWT no lado do servidor)
    res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Ocorreu um erro durante o processo de logout.",
    });
  }
};

module.exports = endpoints;
