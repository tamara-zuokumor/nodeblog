// app.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Register User
app.post('/register', async (req, res) => {
  try {
    // Check if password and confirmPassword match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    // Save the user to the database
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
