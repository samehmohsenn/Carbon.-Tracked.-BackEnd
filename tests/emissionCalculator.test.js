// utils/testEmissionCalculator.js
const { calculateCarbonEmission } = require('../utils/emissionCalculator');

const testCalculator = async () => {
    const testData = new Map([
        ['Electricity', 1000],
        ['Petrol Usage', 1500],
        ['General Waste', 11200]
    ]);

    try {
        const result = await calculateCarbonEmission(testData);
        console.log('Test Calculation Result:', result);
        return result.totalEmissions > 0;
    } catch (err) {
        console.error('Calculation Test Error:', err);
        return false;
    }
};

module.exports = {testCalculator};