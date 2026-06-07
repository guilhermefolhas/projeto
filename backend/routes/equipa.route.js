const express = require("express");
const router  = express.Router();

const equipaController          = require("../controllers/equipa.controller");
const { checkToken, checkAdmin } = require("../middleware/middleware");
const upload                    = require("../middleware/upload");

router.get("/",            checkToken, equipaController.getAllEquipas);
router.get("/nome/:nome",  checkToken, equipaController.getEquipaByNome);
router.get("/jogo/:id",    checkToken, equipaController.getJogosEnrolledByEquipa);
router.get("/:id",         checkToken, equipaController.getEquipaById);

// upload.single("logo") — processa o campo "logo" do FormData antes do controller
router.post("/",      checkAdmin, upload.single("logo"), equipaController.createEquipa);
router.put("/:id",    checkAdmin, upload.single("logo"), equipaController.updateEquipa);
router.delete("/:id", checkAdmin, equipaController.deleteEquipa);

module.exports = router;
