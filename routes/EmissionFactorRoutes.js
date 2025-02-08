const express = require("express");
const router = express.Router();
const EmissionFactor = require("../models/EmissionFactor");

// get all emission factors
router.get("/", async (req, res) => {
    try {
        const factors = await EmissionFactor.find();
        console.log(factors);
        res.status(200).json(factors);
    } catch (err) {
        console.error("Error fetching emission factors:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;