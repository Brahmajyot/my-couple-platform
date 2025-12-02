const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { clerkMiddleware, requireAuth } = require('@clerk/express');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(express.json());
app.use(bodyParser.json());


app.use(clerkMiddleware());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));


app.get('/', (req, res) => {
  res.send('Server is running and healthy!');
});


app.get('/protected', requireAuth(), (req, res) => {
  res.json({ 
    message: "You are authorized!", 
    userId: req.auth.userId 
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;