const mongoose = require('mongoose');

let isConnected = false; 

const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  const dbUri = process.env.MONGODB_URI; 

  if (!dbUri) {
    throw new Error('MISSING MONGODB_URI in Environment Variables');
  }

  try {
    await mongoose.connect(dbUri);
    isConnected = true;
    console.log('=> MongoDB connected successfully');
  } catch (error) {
    console.error('=> Error connecting to database:', error);
    throw error;
  }
};

module.exports = { connectToDatabase };