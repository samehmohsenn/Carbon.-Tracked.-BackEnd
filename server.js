const express = require("express");
const mongoose = require("./config/db"); // automatically connects to the database by importing
const emissionRoutes = require("./routes/EmissionRoutes"); 
const emissionFactorRoutes = require("./routes/EmissionFactorRoutes");
const userRoutes = require("./routes/UserRoutes");

const app = express();  
const port = 3000;

app.use(express.json());
app.use("/EmissionData", emissionRoutes); // use these routes on this path

app.use("/EmissionFactors", emissionFactorRoutes);
app.use("/users", userRoutes);


app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
