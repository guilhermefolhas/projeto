const express = require("express");
const router  = express.Router();

const bilheteController          = require("../controllers/bilhete.controller");
const { checkToken, checkAdmin } = require("../middleware/middleware");

router.get("/",     checkToken, bilheteController.getAllBilhetes);
router.get("/:id",  checkToken, bilheteController.getBilheteById);
router.post("/",    checkAdmin, bilheteController.createBilhete);
router.put("/:id",  checkAdmin, bilheteController.updateBilhete);
router.delete("/:id", checkAdmin, bilheteController.deleteBilhete);

module.exports = router;
