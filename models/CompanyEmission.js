const mongoose = require("mongoose");

const companyEmissionSchema = new mongoose.Schema({  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: Map,
    of: Number,
    default: new Map()
  },
  month:{
    type: "String"
  },
  additionDate: {
    type: Date,
    default: Date.now
  },
  calculatedEmissions: {
    totalEmissions: Number,
    highestEmitter: String,
    categoryEmissions: {
      type: Map,
      of: Number
    },
    suggestions: [String]
  }
});

const CompanyEmission = mongoose.model("CompanyEmission", companyEmissionSchema);
module.exports = CompanyEmission; // exports the model of the database that is based on the created schema