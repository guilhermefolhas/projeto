const express = require('express');
const router = express.Router();

const clienteController = require("../controllers/cliente.controller");

const middlewareAuth = require("../middleware");

//rotas da Api para o cliente     
router.get("/", middlewareAuth, clienteController.getAllClientes);
router.get("/:id", middlewareAuth, clienteController.getClienteById);
router.post("/", middlewareAuth, clienteController.createCliente);
router.put("/:id", middlewareAuth, clienteController.updateCliente);
router.delete("/:id", middlewareAuth, clienteController.deleteCliente); 

module.exports = router;    
