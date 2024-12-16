const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, 
    required: true, 
    maxlength: [14, 'Menos de 14 caracteres'], 
    trim: true 
  },
  password: {
    type: String,
    required: true 
  },
  total_games: { 
    type: Number, 
    default: 0 
  },
  history: {
    type: Array, 
    default: [] 
  },
  winPercentage: {
    type: Number, 
    default: 0 
  },
  wins: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('User', userSchema);

