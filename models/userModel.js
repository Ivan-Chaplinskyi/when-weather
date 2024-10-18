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
    },
    region: String,
    country: String,
    lat: Number,
    lon: Number,
    tz_id: String,
    localtime_epoch: Number,
    localtime: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
