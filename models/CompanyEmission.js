const mongoose = require("mongoose");

const companyEmissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    electricityConsumption: { type: Number, default: 0 },
    naturalGasConsumption: { type: Number, default: 0 },
    fuelType: { type: String, default: "none" },
    fuelConsumption: { type: Number, default: 0 },
    waste: [{ name: String, wasteValue: Number }],
    productionCarbonEmitted: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("CompanyEmission", companyEmissionSchema); // exports the model of the database that is based on the created schema
