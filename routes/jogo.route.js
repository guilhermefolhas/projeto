const express = require('express');
const router = express.Router();

const jogoController = require("../controllers/jogo.controller");

const middlewareAuth = require("../middleware");

//rotas da Api para o jogo     
router.get("/", middlewareAuth, jogoController.getAllJogos);
router.get("/:id", middlewareAuth, jogoController.getJogoById);
router.post("/", middlewareAuth, jogoController.createJogo);
router.put("/:id", middlewareAuth, jogoController.updateJogo);
router.delete("/:id", middlewareAuth, jogoController.deleteJogo); 

module.exports = router;    
