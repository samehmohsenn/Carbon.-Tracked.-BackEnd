const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // library to hash passwords

//  user schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // make sure each username is unique
  },
  password: { 
    type: String, 
    required: true 
  },
  industry: { 
    type: String, 
    required: true 
  },
  companyName: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
