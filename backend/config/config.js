require("dotenv").config();

module.exports = {
  secret: process.env.JWT_SECRET || "chave_secreta_provisoria_muda_no_env",
  timer: "30m", // jsonwebtoken aceita strings: "30m", "1h", etc.
                // o valor anterior (1800000) era interpretado como segundos (~20 dias)
};
