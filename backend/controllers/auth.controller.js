const User   = require("../models/user.model");
const jwt    = require("jsonwebtoken");
const config = require("../config/config");

const endpoints = {};

endpoints.register = async (req, res) => {
  const { email, password, role, nome, nif, telemovel, dta_nascimento } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email e password são obrigatórios." });
  }

  if (!nome || !nif) {
    return res.status(400).json({ success: false, message: "Nome e NIF são obrigatórios." });
  }

  const nifStr = String(nif);
  if (!/^[0-9]{9}$/.test(nifStr)) {
    return res.status(400).json({ success: false, message: "O NIF deve ter exatamente 9 dígitos." });
  }

  try {
    const utilizadorExistente = await User.findOne({ where: { email } });
    if (utilizadorExistente) {
      return res.status(409).json({ success: false, message: "Email já registado." });
    }

    // Criar user (autenticação)
    const user = await User.create({ email, password, role: role || "user" });

    // Criar cliente (dados pessoais) ligado pelo email
    const Cliente = require("../models/cliente.model");
    const cliente = await Cliente.create({
      nome,
      email,
      nif,
      telemovel:      telemovel      || null,
      dta_nascimento: dta_nascimento || null,
    });

    const { password: _, ...userSemPassword } = user.toJSON();

    res.status(201).json({
      success: true,
      message: "Utilizador criado com sucesso.",
      data: { ...userSemPassword, id_cliente: cliente.id },
    });
  } catch (error) {
    console.error("ERRO register:", error.message);
    res.status(500).json({ success: false, message: "Ocorreu um erro durante o registo." });
  }
};

endpoints.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email e password são obrigatórios." });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Email ou senha inválidos." });
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.secret,
      { expiresIn: config.timer }
    );

    // Buscar o cliente associado a este email
    const Cliente = require("../models/cliente.model");
    const cliente = await Cliente.findOne({ where: { email: user.email } });

    res.status(200).json({
      success: true,
      message: "Autenticação realizada com sucesso.",
      AccessToken: token,
      role: user.role,
      id: user.id,
      id_cliente: cliente ? cliente.id : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Ocorreu um erro durante a autenticação." });
  }
};

endpoints.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "Token não fornecido." });
  }

  try {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Token inválido ou expirado." });
      }

      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        config.secret,
        { expiresIn: config.timer }
      );

      res.status(200).json({
        success: true,
        message: "Token renovado com sucesso.",
        AccessToken: newToken,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Ocorreu um erro durante a renovação do token." });
  }
};

endpoints.logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logout realizado com sucesso." });
};

module.exports = endpoints;