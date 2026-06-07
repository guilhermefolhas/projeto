const express = require("express");
const router  = express.Router();

const compraController           = require("../controllers/compra.controller");
const { checkToken, checkAdmin } = require("../middleware/middleware");

router.post("/",                              checkToken, compraController.createCompra);
router.get("/cliente/:id_cliente",            checkToken, compraController.getComprasByCliente);
router.get("/disponibilidade/jogo/:id_jogo",  checkToken, compraController.getDisponibilidadeJogo); // ✅ acessível a todos
router.get("/",                               checkAdmin, compraController.getAllCompras);
router.get("/:id",                            checkAdmin, compraController.getCompraById);
router.put("/:id",                            checkAdmin, compraController.updateCompra);
router.delete("/:id",                         checkAdmin, compraController.deleteCompra);

module.exports = router;