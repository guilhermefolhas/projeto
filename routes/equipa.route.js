const express = require("express");
const router = express.Router();

const equipaController = require("../controllers/equipa.controller");
const middlewareAuth = require("../middleware");

//rotas da Api para a disciplina    
router.post("/", middlewareAuth, equipaController.createEquipa);
router.get("/", middlewareAuth, equipaController.getAllEquipas);
router.put("/:id", middlewareAuth, equipaController.updateEquipa);
router.delete("/:id", middlewareAuth, equipaController.deleteEquipa);
router.get("/:id", middlewareAuth, equipaController.getEquipaById);
router.get("/nome/:nome", middlewareAuth, equipaController.getEquipaByNome);
router.get("/jogo/:id", middlewareAuth, equipaController.getJogosEnrolledByEquipa);
   

module.exports = router;
