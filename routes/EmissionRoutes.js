
const express = require("express");
const router = express.Router();
const CompanyEmission = require('../models/CompanyEmission'); // Adjust the path if needed
const EmissionController = require("../controllers/EmissionController");
//const auth = require("../middleware/auth"); // Assuming you have authentication middleware

// Apply authentication middleware to all routes
//router.use(auth);

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
router.get("/reports/:userID", EmissionController.getEmissionReport);
//for test
// router.get('/', async (req, res) => {
//     try {
//         const emissions = await CompanyEmission.find({});
//         res.status(200).json(emissions);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// router.post('/', async (req, res) => {
//     try {
//         // Assume that your addEmissionData controller is used here or inline logic
//         // For example:
//         const emissionData = req.body;
//         const newEmission = await CompanyEmission.create(emissionData);
//         res.status(201).json(newEmission);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

module.exports = router;
