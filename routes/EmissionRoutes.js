const express = require("express");
const router = express.Router(); //using the express router

const EmissionController = require("../controllers/EmissionController");

router.get("/", EmissionController.getAllEmissionData);
router.get("/:id", EmissionController.getOneEmissionData);

router.post("/", EmissionController.addEmissionData);
router.delete("/:id", EmissionController.deleteEmissionData);
router.patch("/:id", EmissionController.updateEmissionData);

router.get("/report", EmissionController.getEmissionReports);

module.exports = router;
