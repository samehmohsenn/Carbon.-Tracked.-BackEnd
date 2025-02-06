const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Library to hash passwords

// Define the User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // Ensure each username is unique
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

// hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next(); // if password not modified, no need to hash
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

//compare password during login
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
//   console.log(candidatePassword,this.password)
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
