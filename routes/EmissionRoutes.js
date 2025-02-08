
const express = require("express");
const router = express.Router();
const CompanyEmission = require('../models/CompanyEmission'); 
const EmissionController = require("../controllers/EmissionController");
const authenticateJWT = require('../middleware/authMiddleware'); // Import auth middleware

// Get all emissions for authenticated user
router.get("/:userID", EmissionController.getEmissionData);

// Get single emission by ID
router.get("/entry/:id", EmissionController.getOneEmissionData);

// Add new emission data
router.post("/", EmissionController.addEmissionData);

// Delete emission data
router.delete("/:id", EmissionController.deleteEmissionData);

// Get specific report by ID
router.get("/report/:id", EmissionController.getEmissionReport);

// Get all reports for this user 
router.get("/reports/:userID", authenticateJWT.verifyToken, EmissionController.getEmissionReport);


module.exports = router;
