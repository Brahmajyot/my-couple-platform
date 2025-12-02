const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  uploaderId: { 
    type: String, 
    required: true 
  }, 
  
  cfUid: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  
  title: { 
    type: String, 
    required: true 
  },
  
  status: { 
    type: String, 
    default: 'processing' 
  }, 
  
  uploadDate: { 
    type: Date, 
    default: Date.now 
  },
}, 
{
  
  collection: 'coupledata' 
});

module.exports = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);