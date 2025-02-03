const mongoose = require("mongoose");


const emissionFactorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    unit: { type: String, required: true },
    factor: { type: Number, default: 0 , required: true },
    threshold:  { type: Number, default: 0 , required: true },
    suggestions: { type: [String], default: [], required: true }
});


const EmissionFactor = mongoose.model("EmissionFactor", emissionFactorSchema);
module.exports = EmissionFactor;