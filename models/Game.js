const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
  },
  gameType: { 
    type: String, 
    enum: ['three', 'five', 'seven'],
    default: 'three' 
  },
  result: {
     type: String, 
     enum: ['win', 'loss'] 
    },
  game_date: { 
    type: Date, 
    default: Date.now }
});
module.exports = mongoose.model('Game', gameSchema);
