/* eslint-disable no-console */
const User = require('../models/userModel');

class UserController {
  async getUser(id) {
    try {
      return await User.findOne({ id });
    } catch (e) {
      console.log(`Error getUser: ${e}`);
    }
  }

  async addUser(user) {
    try {
      return await User.create(user);
    } catch (e) {
      console.log(`Error addUser: ${e}`);
    }
  }

  async updateLocation(id, location) {
    try {
      return await User.findOneAndUpdate({ id }, { location });
    } catch (e) {
      console.log(`Error updateLocation: ${e}`);
    }
  }

  async updateLocale(id, locale) {
    try {
      return await User.findOneAndUpdate(
        { id },
        { locale },
        { upsert: true, new: true },
      );
    } catch (e) {
      console.log(`Error updateLocale: ${e}`);
    }
  }

  async initUser(from) {
    try {
      let user = await this.getUser(from.id);
      if (!user) {
        user = await this.addUser(from);
      }
      return user;
    } catch (e) {
      console.log(`Error initUser: ${e}`);
    }
  }
}

module.exports = new UserController();
