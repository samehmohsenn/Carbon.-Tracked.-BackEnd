//const mongoose = require("mongoose");
const EmissionFactor = require("../models/EmissionFactor"); // Ensure correct path

//  load emission factors dynamically
const loadEmissionFactors = async () => {
    const factorMap = {}; // Create an empty object

    try {
        const emissionFactors = await EmissionFactor.find(); // Fetch all factors from DB

        emissionFactors.forEach((factor) => {
            factorMap[factor.name.toLowerCase()] = {
                unit: factor.unit,
                factor: factor.factor,
                threshold: factor.threshold,
                suggestions: factor.suggestions
            };
        });
        return factorMap;
    } catch (err) {
        console.error("Error fetching emission factors:", err);
        return {}; // Return empty object in case of failure
    }
};

//calculate carbon emissions dynamically
const calculateCarbonEmission = async (data) => {
    // Load emission factors dynamically (each factor  expected to have properties: factor, threshold, suggestions)
    const emissionFactors = await loadEmissionFactors();
    let emissions = {};      // will hold the calculated emissions for each category
    let totalEmissions = 0;  
  

Object.entries(data).forEach(([key, value], index) => {
  
  console.log(key, value);
  console.log(index);

  if (emissionFactors[key.toLowerCase()] &&
    !isNaN(value) &&
    !isNaN(emissionFactors[key.toLowerCase()].factor)
  ) {
    const emissionValue = value * emissionFactors[key.toLowerCase()].factor;

    emissions[key] = emissionValue;
    totalEmissions += emissionValue;

  }
});
    

    // Determine category with  highest emissions, if  exist
    let highestEmitter = null;
    if (Object.keys(emissions).length > 0) {
      highestEmitter = Object.keys(emissions).reduce((a, b) =>
        emissions[a] > emissions[b] ? a : b
      );
    }
    // Convert emissions object to a Map for the categoryEmissions field
    const categoryEmissions = emissions;
    // Collect suggestions if the calculated emission for a category exceeds its threshold
    let suggestions = [];
    Object.keys(emissions).forEach((key) => {

      if (emissionFactors[key.toLowerCase()] && emissions[key] > (emissionFactors[key.toLowerCase()].threshold || 0)) {
        suggestions.push(...(emissionFactors[key.toLowerCase()].suggestions || []));
      }
    });
  
    return { totalEmissions, highestEmitter, categoryEmissions, suggestions };
  };

module.exports = { calculateCarbonEmission };
