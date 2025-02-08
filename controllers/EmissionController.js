const mongoose = require('mongoose');
const CompanyEmission = require("../models/CompanyEmission");
const { calculateCarbonEmission } = require("../utils/emissionCalculator");
const User = require('../models/User');
const authenticateJWT = require('../middleware/authMiddleware'); // import auth middleware

exports.addEmissionData = async (req, res) => {
    try {

        const { username, data, month } = req.body;

        const user = await User.findOne({ "username" : username});
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const requestData = {
            ...req.body,
            user: new mongoose.Types.ObjectId(user._id)
        };
        const returnedEmission = await CompanyEmission.findOne({ "user" : requestData.user, "month" : month}).lean();


        
        if (month === returnedEmission?.month) {
            return res.status(404).json({ message: "Data for this month already exists" });
        }
        // calculate emissions
        const { totalEmissions, highestEmitter, categoryEmissions, suggestions } =
            await calculateCarbonEmission(requestData.data);

        // prepare data for saving
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
        const userID = req.params.userID;
        const emissions = await CompanyEmission.find({ user: new mongoose.Types.ObjectId('67a1e19b759369b213ba46b3') });
        res.status(200).json(emissions);
    } catch (err) {
        console.error("Error fetching emission data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getOneEmissionData = async (req, res) => {
    try {
        const emission = await CompanyEmission.findOne({ _id : req.params.id });
        if (!emission) {
            return res.status(404).json({ message: "Emission data not found" });
        }
        res.status(200).json(emission);
    } catch (err) {
        console.error("Error fetching emission data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }


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
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        let query;
        
        // handle single report vs all reports for a user
        if (req.params.id) {
            let id = new mongoose.Types.ObjectId(req.params.id)
            query = { "_id": id };  

        } else {
            const userID = req.params.userID;


            if (userID !== req.user.userId) {
                return res.status(403).json({ error: "Unauthorized access" });
            }
            
            query = { user: userID };
        }

        
        const emissions = await CompanyEmission.find(query).lean();
        if (req.params.id && emissions.length === 0) {
            return res.status(404).json({ message: "Report not found" });
        }

        const reports = await Promise.all(emissions.map(async (emission) => {


            const { totalEmissions, highestEmitter, categoryEmissions, suggestions } =
                await calculateCarbonEmission(emission.data);       
    
                    const testing = {
                        reportId: emission._id,
                        userID: emission.user,
                        month: emission.month,
                        totalEmissions,
                        highestEmitter,
                        categoryEmissions,
                        suggestions,
                        additionDate: emission.additionDate
                    }
                    console.log(testing)


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