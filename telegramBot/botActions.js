/* eslint-disable no-console */
const bot = require('./telegramBotApi');
const weather = require('../apiWeather/apiWeather');
const UserController = require('../controllers/userController');
const CommandController = require('../controllers/commandController');
const CallbackQuery = require('../controllers/callbackQueryController');
const locale = require('../utils/locales');
const keyboard = require('../utils/keyboard');

class Bot {
  callbackQuery() {
    bot.on('callback_query', (query) => {
      const { data, from } = query;
      switch (data) {
        case 'change_lang': {
          CallbackQuery.changeLang(from);
          break;
        }
        case 'uk':
          CallbackQuery.switchLang(from, 'uk');
          break;
        case 'en':
          CallbackQuery.switchLang(from, 'en');
          break;
        default:
          bot.sendMessage(
            from.id,
            locale.__('search.err'),
            keyboard.defaultKeyboard(),
          );
      }
    });
  }

  onText() {
    bot.on('text', async (msg) => {
      const { text, from, chat } = msg;
      try {
        const user = await UserController.initUser(from);
        const localeUser = user.locale || user.language_code;

        locale.setLocale(localeUser);

        switch (text) {
          case '/start':
            CommandController.startCommand(chat, localeUser);
            break;
          case locale.__('buttons.weather'):
            CommandController.getWeather(user, chat);
            break;
          case locale.__('buttons.settings'):
            CommandController.settings(chat, localeUser);
            break;
          default:
            CommandController.initLocation(user, chat, text, from);
        }
      } catch (e) {
        console.error(`Error: ${e}`);
      }
    });
  }

  onLocation() {
    bot.on('location', async (location) => {
      const {
        chat,
        from,
        location: { latitude, longitude },
      } = location;
      try {
        const user = await UserController.initUser(from);
        const data = `${latitude},${longitude}`;
        const res = await weather.current(data);
        if (res.location) {
          CommandController.sendWeather(chat.id, res, user.language_code);
          await UserController.updateLocation(from.id, res.location);
          return;
        }
        return bot.sendMessage(chat.id, `${locale.__('search.err')}`);
      } catch (e) {
        console.error(`Error onLocation: ${e}`);
        bot.sendMessage(chat.id, `${locale.__('search.err')}`);
      }
    });
  }

  init() {
    this.callbackQuery();
    this.onText();
    this.onLocation();
  }
}

module.exports = new Bot();
