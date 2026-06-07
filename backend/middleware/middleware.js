const jwt    = require("jsonwebtoken");
const config = require("../config/config.js");
const User   = require("../models/user.model");

// ── Roles como constantes (evita strings hardcoded) ──────────────────────────
const ROLES = {
  ADMIN: "admin",
  USER:  "user",
};

// ── Verifica se o token é válido ─────────────────────────────────────────────
const checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token != undefined && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Token em falta." });
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ success: false, message: "O token é inválido." });
    }
    req.decoded = decoded;
    next();
  });
};


const checkAdmin = (req, res, next) => {
  checkToken(req, res, async () => {
    try {
      const user = await User.findByPk(req.decoded.id);
      if (!user || user.role !== ROLES.ADMIN) {
        return res.status(403).json({
          success: false,
          message: "Acesso negado. É necessário ser administrador.",
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({ success: false, message: "Erro ao verificar permissões." });
    }
  });
};

module.exports = { checkToken, checkAdmin, ROLES };