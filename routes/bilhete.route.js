const express = require("express");
const router = express.Router();

const bilheteController = require("../controllers/bilhete.controller");
const middlewareAuth = require("../middleware");

//rotas da Api para a disciplina    
router.post("/", middlewareAuth, bilheteController.createBilhete);
router.get("/", middlewareAuth, bilheteController.getAllBilhetes);
router.get("/:id", middlewareAuth, bilheteController.getBilheteById);
router.put("/:id", middlewareAuth, bilheteController.updateBilhete);
router.delete("/:id", middlewareAuth, bilheteController.deleteBilhete);   

module.exports = router;
