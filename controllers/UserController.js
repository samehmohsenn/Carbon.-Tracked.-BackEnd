const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register user
exports.register = async (req, res) => {
  const { username, password, industry, companyName } = req.body;
  
  try {
    // check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log("Original Password:", password);
    // console.log("Hashed Password:", hashedPassword);

    // create new user with hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
      industry,
      companyName
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// login user
exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // check if JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is missing');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      // generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET
        //,        { expiresIn: '1h' } // optional
      );
  
      res.status(200).json({ token });
  
    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
