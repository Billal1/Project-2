const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport  = require("passport")

const User = require("../models/User")

// Signup controller
const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


router.post('/signup', signupController);


module.exports = router;