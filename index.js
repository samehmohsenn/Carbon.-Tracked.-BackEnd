const express = require('express');
const mongoose = require("./config/db"); // automatically connects to the database by importing
const CompanyEmission = require('./models/CompanyEmission'); // Adjust the path as needed
const emissionRoutes = require('./routes/EmissionRoutes');
const userRoutes = require('./routes/UserRoutes');
const { testCalculator } = require('./tests/emissionCalculator.test');
const { testRoutes } = require('./tests/routes.test');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/emissions', emissionRoutes);
app.use('/api/users', userRoutes); // Adding user routes since they exist in your structure

// Test function
const runAllTests = async () => {
    try {
        console.log('Running emission calculator tests...');
        await testCalculator();
        
        console.log('Running route tests...');
        await testRoutes();
        
        console.log('All tests completed successfully');
    } catch (error) {
        console.error('Test execution failed:', error);
        process.exit(1); // Exit with error code if tests fail
    }
};

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