const emissionFactors = {
    electricity: 0.5,
    naturalGas: 2.0,
    fuel: { diesel: 2.68, petrol: 2.31, none: 0 },
    waste: { general: 0.8, food: 0.5, recyclables: 0.2, production: 1.5, packaging: 1.0 }
};

const emissionReductionSuggestions = {
    electricity: ["Switch to renewables", "Use LED lighting", "Implement smart meters"],
    fuel: ["Switch to electric vehicles", "Optimize transport routes", "Carpooling"],
    naturalGas: ["Improve insulation", "Use electric heating", "Use energy-efficient gas appliances"],
    waste: ["Improve recycling", "Waste-to-energy program", "Optimize raw material usage"]
};

const emissionThreshold = 5000;

const calculateCarbonEmission = (data) => {
    let emissions = {
        electricity: data.electricityConsumption * emissionFactors.electricity,
        naturalGas: data.naturalGasConsumption * emissionFactors.naturalGas,
        fuel: data.fuelType && emissionFactors.fuel[data.fuelType.toLowerCase()]
            ? data.fuelConsumption * emissionFactors.fuel[data.fuelType.toLowerCase()]
            : 0,
        waste: 0
    };

    if (data.waste && Array.isArray(data.waste)) {
        data.waste.forEach(wasteItem => {
            if (emissionFactors.waste[wasteItem.name.toLowerCase()]) {
                emissions.waste += wasteItem.wasteValue * emissionFactors.waste[wasteItem.name.toLowerCase()];
            }
        });
    }

    let totalEmissions = Object.values(emissions).reduce((sum, value) => sum + value, 0);
    let highestEmitter = Object.keys(emissions).reduce((a, b) => emissions[a] > emissions[b] ? a : b);
    let suggestions = totalEmissions > emissionThreshold ? emissionReductionSuggestions[highestEmitter] : [];

    return { totalEmissions, highestEmitter, suggestions };
};

module.exports = { calculateCarbonEmission };
