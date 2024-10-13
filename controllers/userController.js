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

  async updateUserCity(id, location) {
    try {
      await User.findOneAndUpdate({ id }, location, { new: true });
    } catch (e) {
      console.log(`Error updateUserCity: ${e}`);
    }
  }
}

module.exports = new UserController();
