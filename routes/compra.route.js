const express = require('express');
const router = express.Router();

const compraController = require("../controllers/compra.controller");

const middlewareAuth = require("../middleware");

//rotas da Api para a compra     
router.get("/", middlewareAuth, compraController.getAllCompras);
router.get("/:id", middlewareAuth, compraController.getCompraById);
router.post("/", middlewareAuth, compraController.createCompra);
router.put("/:id", middlewareAuth, compraController.updateCompra);
router.delete("/:id", middlewareAuth, compraController.deleteCompra); 

module.exports = router;    
