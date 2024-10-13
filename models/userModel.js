const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
    unique: true,
  },
  is_bot: Boolean,
  username: String,
  language_code: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  location: {
    name: {
      type: String,
      default: '',
      require: true,
    },
    lat: {
      type: Number,
      default: 0,
    },
    lon: {
      type: Number,
      default: 0,
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
