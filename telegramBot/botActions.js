/* eslint-disable no-console */
const bot = require('./telegramBotApi');
const weather = require('../apiWeather/apiWeather');
const translator = require('../deepl/deepl');
const Message = require('../utils/message');
const UserController = require('../controllers/userController');
const locale = require('../utils/locales');
const keyboard = require('../utils/keyboard');

class Bot {
  constructor(botTelegram) {
    this.bot = botTelegram;
  }

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

  onText() {
    this.bot.on('text', async (msg) => {
      const { text, from, chat } = msg;
      try {
        let user = await UserController.getUser(from.id);
        if (!user) user = await UserController.addUser(from);

        locale.setLocale(user.language_code);

        switch (text) {
          case '/start': {
            this.startCommand(chat, user.language_code);
            break;
          }
          case `🌦️${locale.__('buttons.weather')}`: {
            if (user.location.name) {
              const res = await weather.current(
                user.location.name,
                user.language_code,
              );
              return this.sendWeather(chat.id, res, user.language_code);
            }
            this.startCommand(chat, user.language_code);
            break;
          }
          case `⚙️${locale.__('buttons.settings')}`: {
            this.bot.sendMessage(
              chat.id,
              '⚙️Цей розділ у розробці!',
              keyboard.defaultKeyboard(user.language_code),
            );
            break;
          }
          default: {
            const transed = await translator(text);
            const res = await weather.current(transed);
            const { location } = res;

            if (location) {
              await UserController.updateLocation(from.id, location);
              return this.sendWeather(chat.id, res, user.language_code);
            }
            return this.bot.sendMessage(
              chat.id,
              `${locale.__('search.err')}🔍`,
            );
          }
        }
      } catch (e) {
        console.error(`Error: ${e}`);
      }
    });
  }

  onLocation() {
    this.bot.on('location', async (location) => {
      const {
        chat,
        from,
        location: { latitude, longitude },
      } = location;
      try {
        let user = await UserController.getUser(from.id);
        if (!user) user = await UserController.addUser(from);
        const data = `${latitude},${longitude}`;
        const res = await weather.current(data);
        if (res.location) {
          await UserController.updateLocation(from.id, res.location);
          return this.sendWeather(chat.id, res);
        }
        return this.bot.sendMessage(chat.id, `${locale.__('search.err')}🔍`);
      } catch (e) {
        console.error(`Error onLocation: ${e}`);
        this.bot.sendMessage(chat.id, `${locale.__('search.err')}🔍`);
      }
    });
  }

  init() {
    this.onText();
    this.onLocation();
  }
}

module.exports = new Bot(bot);
