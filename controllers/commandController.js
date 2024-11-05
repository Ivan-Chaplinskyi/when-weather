/* eslint-disable no-console */
const locale = require('../utils/locales');
const keyboard = require('../utils/keyboard');
const bot = require('../telegramBot/telegramBotApi');
const Message = require('../utils/message');
const WeatherController = require('./weatherController');
const UserController = require('./userController');

class CommandController {
  async startCommand(chat, lang) {
    try {
      locale.setLocale(lang);
      bot.sendMessage(
        chat.id,
        locale.__('add_location'),
        keyboard.defaultKeyboard(lang),
      );
    } catch (e) {
      console.error(`Error startCommand: ${e}`);
    }
  }

  sendWeather(id, res, lang) {
    try {
      bot.sendMessage(
        id,
        Message.sendWeather(res, lang),
        keyboard.defaultKeyboard(lang),
      );
    } catch (e) {
      console.error(`Error sendWeather: ${e}`);
    }
  }

  async getWeather(user, chat) {
    if (user.location.name) {
      const res = await WeatherController.current(
        user.location.name,
        user.locale || user.language_code,
      );
      return this.sendWeather(chat.id, res, user.locale || user.language_code);
    }
    this.startCommand(chat, user.language_code);
  }

  async initLocation(user, chat, text, from) {
    try {
      const location = await WeatherController.findCoordinates(text);
      if (!location) {
        return bot.sendMessage(chat.id, locale.__('search.err'));
      }

      const res = await WeatherController.current(
        `${location.lat}, ${location.lon}`,
      );
      this.sendWeather(chat.id, res, user.locale || user.language_code);
      return await UserController.updateLocation(from.id, res.location);
    } catch (e) {
      console.log(`Error initLocation: ${e}`);
    }
  }

  settings(chat, lang) {
    locale.setLocale(lang);
    bot.sendMessage(
      chat.id,
      locale.__('buttons.settings'),
      keyboard.settingsKeyboad(lang),
    );
  }
}

module.exports = new CommandController();
