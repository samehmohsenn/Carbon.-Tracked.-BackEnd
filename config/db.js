const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/emissionDataDB";

mongoose.connect(mongoURI)
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Error connecting to DB:", err));

module.exports = mongoose;
