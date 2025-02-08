const express = require('express');
const mongoose = require("./config/db"); // automatically connects to the database by importing
const CompanyEmission = require('./models/CompanyEmission'); 
const emissionRoutes = require('./routes/EmissionRoutes');
const userRoutes = require('./routes/UserRoutes');


const app = express();

app.use(express.json());

// Routes
app.use('/api/emissions', emissionRoutes);
app.use('/api/users', userRoutes); 


const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
   
    // Run tests if argument provided
    if (process.argv.includes('--test')) {
        await runAllTests();
    }
});

// Export for testing purposes
module.exports = { app, server };