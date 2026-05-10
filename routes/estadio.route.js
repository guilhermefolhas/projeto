const express = require("express");
const router = express.Router();

const estadioController = require("../controllers/estadio.controller");
const middlewareAuth = require("../middleware");

//rotas da Api para a disciplina    
router.post("/", middlewareAuth, estadioController.createEstadio);
router.get("/", middlewareAuth, estadioController.getAllEstadios);
router.put("/:id", middlewareAuth, estadioController.updateEstadio);
router.delete("/:id", middlewareAuth, estadioController.deleteEstadio);
router.get("/:id", middlewareAuth, estadioController.getEstadioById);
router.get("/nome/:nome", middlewareAuth, estadioController.getEstadioByNome);
router.get("/jogo/:id", middlewareAuth, estadioController.getJogosEnrolledByEstadio);
   

module.exports = router;
