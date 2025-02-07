const mongoose = require('mongoose');
const CompanyEmission = require("../models/CompanyEmission");
const { calculateCarbonEmission } = require("../utils/emissionCalculator");
const User = require('../models/User');
const authenticateJWT = require('../middleware/authMiddleware'); // Import the auth middleware

exports.addEmissionData = async (req, res) => {
    try {
        // Use req.body.user instead of req.user
        //const userId = req.body.user || req.user;
        //console.log(userID + "aaa")
        const { username, data, month } = req.body;

        const user = await User.findOne({ "username" : username});
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const requestData = {
            ...req.body,
            user: new mongoose.Types.ObjectId(user._id)
        };
        // console.log("poopsie", requestData.user);
        const returnedEmission = await CompanyEmission.findOne({ "user" : requestData.user, "month" : month}).lean();
        // console.log(returnedEmission.month);
        // const testing = (month === returnedEmission.month) ;
        // console.log("testing" );
        // console.log(month + "end of month");
        // console.log(returnedEmission?.month+ " end of returnedEmission.month");

        
        if (month === returnedEmission?.month) {
            return res.status(404).json({ message: "Data for this month already exists" });
        }
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
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        let query;
        
        // Handle single report vs all reports for a user
        if (req.params.id) {
            let id = new mongoose.Types.ObjectId(req.params.id)
            query = { "_id": id };  

        } else {
            // Fixed the route parameter to match '/reports/userID'
            const userID = req.params.userID;
            // Verify user is requesting their own data
            // console.log("text"+userID);
            // console.log("Request Params:", JSON.stringify(req.params, null, 2));
            // console.log("Request User:", JSON.stringify(req.user, null, 2));
            // console.log("poopsie", JSON.stringify(req.user, null, 2));
            // console.log("poopsie", req.user.userId )

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
            // console.log(emission+ " that was emission") 
            // console.log(JSON.stringify(emission.data, null, 2) + " that was emission.data");
            // console.log("testing "+Object.fromEntries(emission.data))

            // console.log("emission "+emission)
            // console.log("emission data "+emission.data)

            const { totalEmissions, highestEmitter, categoryEmissions, suggestions } =
                await calculateCarbonEmission(emission.data);       
                // console.log(totalEmissions, highestEmitter, categoryEmissions, suggestions);
    
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