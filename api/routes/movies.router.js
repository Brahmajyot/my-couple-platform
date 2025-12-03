const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String, // Stores the YouTube/Drive link
    required: true,
  },
  uploaderId: {
    type: String, // Clerk User ID
    required: true,
  },
  uploaderName: {
    type: String, // Username (so we know who picked the movie)
    default: 'Anonymous',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if model exists before creating to avoid Hot Reload errors
module.exports = mongoose.models.Movie || mongoose.model('Movie', movieSchema);