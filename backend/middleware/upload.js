const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

// Garantir que a pasta uploads existe
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // equipa_<timestamp>.<ext> — evita colisões de nomes
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `equipa_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens JPG, PNG, WEBP ou SVG são permitidas."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // máx 2MB
});

module.exports = upload;
