const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fetchUser=require('../middleware/fetchUser')

const JWT_SECRET = "Harshisagoodboy"
// ROUTE - 1 : Create a user using POST "/api/auth/createuser", doesn't require authentication
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, it returns Bad Request and displays the error
  let success=false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Creating User
  try {
    let user=await User.findOne({email:req.body.email})
    if(user){
      return res.status(400).json({success,error:"Sorry a user with email already exists"})
    }
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass
    });

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    success=true
    res.json({ success,authToken });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ROUTE - 2 : Authenticate a user using POST "/api/auth/login", doesn't require authentication
router.post('/login', [
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Enter a Password').exists(),
], async (req, res) => {
  let success=false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Incorrect Id/Password" })
    }

    const passwordCompare = await  bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      success=false
      return res.status(400).json({ success,error: "Incorrect Id/Password" })
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    success=true
    res.json({ success,authToken });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

})

// ROUTE - 3 : Get logged in user Details POST "/api/auth/getuser",  require authentication

router.post('/getuser',fetchUser, async (req, res) => {
try {
  const userid=req.user.id
  const user=await User.findById(userid).select("-password")
  res.send(user)

  
} catch (error) {
  if (error.code === 11000) {
    // Duplicate key error
    return res.status(400).json({ error: 'Email already exists' });
  }
  console.error(error);
  res.status(500).json({ error: 'Server error' });
}
})

module.exports = router;