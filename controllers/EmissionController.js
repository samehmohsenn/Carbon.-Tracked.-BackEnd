const CompanyEmission = require("../models/CompanyEmission");
const { calculateCarbonEmission } = require("../utils/emissionCalculator");

exports.getAllEmissionData = async (req, res) => { // is the same as doing module.exports at the end of the file
    try {
        const data = await CompanyEmission.find();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.addEmissionData = async (req, res) => {
    try {
        let requestData = req.body;
        let { totalEmissions, highestEmitter, suggestions } = calculateCarbonEmission(requestData);
        requestData.productionCarbonEmitted = totalEmissions;

        const newData = new CompanyEmission(requestData);
        await newData.save();

        res.status(201).json({ 
            message: "Emission Data Saved", 
            data: newData,
            totalEmissions,
            highestEmitter,
            suggestions
        });
    } catch (err) {
        console.error("Error saving data:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getOneEmissionData = async (req, res) => {
    try {
        const { id } = req.params;
        const requestedData = await CompanyEmission.findById(id);

        if (!requestedData) {
            return res.status(404).json({ message: "Emission data not found" });
        }

        res.status(200).json({ message: "Found!", data: requestedData });
    } catch (err) {
        console.error("Error finding data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.deleteEmissionData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await CompanyEmission.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({ message: "Emission data not found" });
        }

        res.status(200).json({ message: "Emission data deleted successfully", data: deletedData });
    } catch (err) {
        console.error("Error deleting data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateEmissionData = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedData = await CompanyEmission.findByIdAndUpdate(id, updates, {new: true, runValidators: true});

        if (!updatedData) {
            return res.status(404).json({ message: "Emission data not found" });
        }
        let { totalEmissions, highestEmitter, suggestions } = calculateCarbonEmission(updatedData);
        updatedData.productionCarbonEmitted = totalEmissions;

        const newData = new CompanyEmission(updatedData);
        await newData.save();

        res.status(200).json({ message: "Emission data updated successfully", data: newData, totalEmissions, highestEmitter, suggestions });
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getEmissionReports = async (req, res) => {
    try {
        const data = await CompanyEmission.find();
        const reports = data.map(entry => {
            let { totalEmissions, highestEmitter, suggestions } = calculateCarbonEmission(entry);
            return {
                name: entry.name,
                industry: entry.industry,
                totalEmissions,
                highestEmitter,
                suggestions
            };
        });

        res.status(200).json(reports);
    } catch (err) {
        console.error("Error fetching emission reports:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
