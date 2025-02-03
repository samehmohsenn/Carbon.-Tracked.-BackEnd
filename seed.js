const mongoose = require("mongoose");
const EmissionFactor = require("./models/EmissionFactor");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/emissionDataDB")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// Hardcoded Emission Factors
const emissionFactors = [

    {
        name: "Electricity",
        unit: "KWh",
        factor: 0.5,
        suggestions: ["Switch to renewables", "Use LED lighting", "Implement smart meters"]
    },
    {
        name: "Natural Gas",
        unit: "m³",
        factor: 2.0,
        suggestions: ["Improve insulation", "Use high-efficiency appliances", "Reduce heating demand"]
    },
    {
        name: "Petrol Usage",
        unit: "Liters",
        factor: 2.31,
        suggestions: ["Switch to electric vehicles", "Optimize logistics", "Use biofuels"]
    },
    {
        name: "Diesel Usage",
        unit: "Liters",
        factor: 2.7,
        suggestions: ["Switch to electric vehicles", "Optimize logistics", "Use biofuels"]
    },

        {
            name: "General Waste",
            unit: "kg",
            factor: 1.1,
            suggestions: ["Reduce waste generation", "Improve waste sorting", "Implement waste-to-energy solutions"]
        },
        {
            name: "Food Waste",
            unit: "kg",
            factor: 1.2,
            suggestions: ["Implement composting", "Reduce food waste at source", "Use anaerobic digestion"]
        },
        {
            name: "Recyclables - Plastic",
            unit: "kg",
            factor: 7,
            suggestions: ["Increase plastic recycling", "Use biodegradable alternatives", "Reduce single-use plastics"]
        },
        {
            name: "Recyclables - Paper",
            unit: "kg",
            factor: 1.8,
            suggestions: ["Increase paper recycling", "Go paperless where possible", "Use sustainable paper sources"]
        },
        {
            name: "Recyclables - Glass",
            unit: "kg",
            factor: 0.25,
            suggestions: ["Improve glass recycling rates", "Reuse glass packaging", "Use lightweight glass products"]
        },
        {
            name: "Recyclables - Metals",
            unit: "kg",
            factor: 7,
            suggestions: ["Recycle scrap metals", "Use aluminum alternatives", "Optimize metal usage in production"]
        },
        {
            name: "Production Waste",
            unit: "kg",
            factor: 2.5,
            suggestions: ["Optimize production processes", "Use sustainable raw materials", "Improve waste management"]
        },
        {
            name: "Packaging Waste",
            unit: "kg",
            factor: 3.2,
            suggestions: ["Reduce excessive packaging", "Switch to recyclable materials", "Encourage circular economy practices"]
        }
    ];

// Insert into DB
const seedDB = async () => {
    try {
        await EmissionFactor.deleteMany(); // Clear existing data
        await EmissionFactor.insertMany(emissionFactors);
        console.log("✅ Emission Factors Seeded!");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
    }
};

seedDB();