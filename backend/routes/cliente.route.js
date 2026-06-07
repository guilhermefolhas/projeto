const express = require("express");
const router  = express.Router();

const clienteController          = require("../controllers/cliente.controller");
const { checkAdmin } = require("../middleware/middleware");

// Gestão de clientes é toda admin
router.get("/",      checkAdmin, clienteController.getAllClients);
router.get("/:id",   checkAdmin, clienteController.getClientById);
router.post("/",     checkAdmin, clienteController.createClient);
router.put("/:id",   checkAdmin, clienteController.updateClient);
router.delete("/:id",checkAdmin, clienteController.deleteClient);

module.exports = router;
