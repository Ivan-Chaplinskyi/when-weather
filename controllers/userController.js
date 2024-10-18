/* eslint-disable no-console */
const User = require('../models/userModel');

class UserController {
  async getUser(id) {
    try {
      const user = await User.findOne({ id });
      return user;
    } catch (e) {
      console.log(`Error getUser: ${e}`);
    }
  }

  async addUser(user) {
    try {
      await User.create(user);
    } catch (e) {
      console.log(`Error addUser: ${e}`);
    }
  }

  async updateLocation(id, location) {
    try {
      await User.findOneAndUpdate({ id }, { location });
    } catch (e) {
      console.log(`Error updateLocation: ${e}`);
    }
  }
}

module.exports = new UserController();
