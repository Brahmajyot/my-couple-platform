const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  username: { 
    type: String 
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
}, 
{
  
  collection: 'coupledata' 
});



module.exports = mongoose.models.User || mongoose.model('User', UserSchema);