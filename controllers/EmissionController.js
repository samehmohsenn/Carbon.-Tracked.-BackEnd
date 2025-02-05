const mongoose = require('mongoose');
const CompanyEmission = require("../models/CompanyEmission");
const { calculateCarbonEmission } = require("../utils/emissionCalculator");

exports.addEmissionData = async (req, res) => {
    try {
        // Use req.body.user instead of req.user
        //const userId = req.body.user || req.user;
        //console.log(userID + "aaa")


        const requestData = {
            ...req.body,
            user: new mongoose.Types.ObjectId(req.body.user)
        };

        // Calculate emissions
        const { totalEmissions, highestEmitter, categoryEmissions, suggestions } =
            await calculateCarbonEmission(requestData.data);

        // Prepare data for saving
        const emissionData = new CompanyEmission({
            ...requestData,
            calculatedEmissions: {
                totalEmissions,
                highestEmitter,
                categoryEmissions,
                suggestions
            }
        });
        const savedData = await emissionData.save();

        res.status(201).json({
            message: "Emission Data Saved Successfully",
            data: savedData
        });
    } catch (err) {
        console.error("Error saving emission data:", err);
        res.status(400).json({ error: err.message });
    }
};


exports.getEmissionData = async (req, res) => {
    try {
        // Changed to use req.params.userID to match route parameter
        const userID = req.params.userID;
        
        // Verify user is requesting their own data
        // if (userID !== req.user._id.toString()) {
        //     return res.status(403).json({ error: "Unauthorized access" });
        // }
        
        const emissions = await CompanyEmission.find({ user: new mongoose.Types.ObjectId('67a1e19b759369b213ba46b3') });
        res.status(200).json(emissions);
    } catch (err) {
        console.error("Error fetching emission data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getOneEmissionData = async (req, res) => {
    try {
        // Changed to use req.params.userID to match route parameter
        const emission = await CompanyEmission.findOne({ _id : req.params.id });
        if (!emission) {
            return res.status(404).json({ message: "Emission data not found" });
        }
        res.status(200).json(emission);
    } catch (err) {
        console.error("Error fetching emission data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

    ///////////////
    // try {
    //     const emission = await CompanyEmission.findOne({
    //         _id: req.params.id,
    //         user: req.user._id
    //     });
};

exports.deleteEmissionData = async (req, res) => {
    try {
        const deletedEmission = await CompanyEmission.findOneAndDelete({
            _id: req.params.id
        });
        
        if (!deletedEmission) {
            return res.status(404).json({ message: "Emission data not found" });
        }
        
        res.status(200).json({
            message: "Emission data deleted successfully",
            data: deletedEmission
        });
    } catch (err) {
        console.error("Error deleting emission data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getEmissionReport = async (req, res) => {
    try {
        let query;
        
        // Handle single report vs all reports for a user
        if (req.params.id) {
            query = { _id: req.params.id };
        } else {
            // Fixed the route parameter to match '/reports/userID'
            const userID = req.params.userID;
            
            // Verify user is requesting their own data
            // if (userID !== req.user._id.toString()) {
            //     return res.status(403).json({ error: "Unauthorized access" });
            // }
            
            query = { user: userID };
        }
        
        const emissions = await CompanyEmission.find(query);
        if (req.params.id && emissions.length === 0) {
            return res.status(404).json({ message: "Report not found" });
        }

        const reports = await Promise.all(emissions.map(async (emission) => {

            const { totalEmissions, highestEmitter, categoryEmissions, suggestions } =
                await calculateCarbonEmission(emission.data);       
                //console.log(totalEmissions, highestEmitter, categoryEmissions, suggestions);
    
            return {
                reportId: emission._id,
                userID: emission.user,
                month: emission.month,
                totalEmissions,
                highestEmitter,
                categoryEmissions,
                suggestions,
                additionDate: emission.additionDate
            };
        }));

        res.status(200).json(reports);
    } catch (err) {
        console.error("Error generating emission report:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};