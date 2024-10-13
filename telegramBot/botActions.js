const bot = require('./telegramBotApi');
const weather = require('../apiWeather/apiWeather');
const translator = require('../deepl/deepl');
const Message = require('../utils/message');
const UserController = require('../controllers/userController');

class Bot {
  constructor(botTelegram) {
    this.bot = botTelegram;
  }

  sendWeather(id, res) {
    bot.sendMessage(id, Message.sendWeather(res), {
      parse_mode: 'HTML',
    });
  }

  botOn() {
    this.bot.on('message', async (msg) => {
      const { text, location, from, chat } = msg;
      try {
        let user = await UserController.getUser(from.id);
        const cityNameRegex = /^[a-zA-Z\u0400-\u04FF\s'-]+$/;
        const englishWordsRegex = /^[a-zA-Z\s'-]+$/;

        const transed = englishWordsRegex.test(text)
          ? text
          : await translator(text);

        if (!user) {
          bot.sendMessage(chat.id, 'Введіть назву міста або надішліть локацію');
          user = await UserController.addUser(from);
        }

        if (location) {
          const res = await weather.current(
            `${location.latitude},${location.longitude}`,
          );
          this.sendWeather(chat.id, res);
          const {
            location: { name, lat, lon },
          } = res;
          await UserController.updateUserCity(from.id, {
            location: { name, lat, lon },
          });
        }

        if (cityNameRegex.test(text)) {
          const res = await weather.current(transed);
          this.sendWeather(chat.id, res);
          const {
            location: { name, lat, lon },
          } = res;
          await UserController.updateUserCity(from.id, {
            location: { name, lat, lon },
          });
        }

        if (text === '/weather') {
          const res = await weather.current(user.location.name);
          this.sendWeather(chat.id, res);
        }
      } catch (e) {
        bot.sendMessage(chat.id, 'Введете неправильне значення');
      }
    });
  }

  init() {
    this.botOn();
  }
}

module.exports = new Bot(bot);
