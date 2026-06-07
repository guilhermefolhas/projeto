const express = require("express");
const router  = express.Router();

const jogoController             = require("../controllers/jogo.controller");
const { checkToken, checkAdmin } = require("../middleware/middleware");

router.get("/",     checkToken, jogoController.getAllJogos);
router.get("/:id",  checkToken, jogoController.getJogoById);
router.post("/",    checkAdmin, jogoController.createJogo);
router.put("/:id",  checkAdmin, jogoController.updateJogo);
router.delete("/:id", checkAdmin, jogoController.deleteJogo);

module.exports = router;
