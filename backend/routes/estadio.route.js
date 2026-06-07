const express = require("express");
const router  = express.Router();

const estadioController          = require("../controllers/estadio.controller");
const { checkToken, checkAdmin } = require("../middleware/middleware");

router.get("/",checkToken, estadioController.getAllEstadios);
router.get("/nome/:nome",checkToken, estadioController.getEstadioByNome);
router.get("/jogo/:id",checkToken, estadioController.getJogosEnrolledByEstadio);
router.get("/:id",checkToken, estadioController.getEstadioById);
router.post("/",checkAdmin, estadioController.createEstadio);
router.put("/:id",checkAdmin, estadioController.updateEstadio);
router.delete("/:id",checkAdmin, estadioController.deleteEstadio);

module.exports = router;
