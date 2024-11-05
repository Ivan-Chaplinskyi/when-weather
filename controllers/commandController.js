/* eslint-disable no-console */
const locale = require('../utils/locales');
const keyboard = require('../utils/keyboard');
const bot = require('../telegramBot/telegramBotApi');
const Message = require('../utils/message');
const weather = require('../apiWeather/apiWeather');
const translator = require('../deepl/deepl');
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
      const res = await weather.current(
        user.location.name,
        user.locale || user.language_code,
      );
      return this.sendWeather(chat.id, res, user.locale || user.language_code);
    }
    this.startCommand(chat, user.language_code);
  }

  async initLocation(user, chat, text, from) {
    const transed = await translator(text);
    const res = await weather.current(transed);
    const { location } = res;

    if (location) {
      await UserController.updateLocation(from.id, location);
      return this.sendWeather(chat.id, res, user.locale || user.language_code);
    }
    return bot.sendMessage(chat.id, `${locale.__('search.err')}🔍`);
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
