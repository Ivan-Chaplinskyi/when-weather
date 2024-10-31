/* eslint-disable no-console */
const bot = require('./telegramBotApi');
const weather = require('../apiWeather/apiWeather');
const translator = require('../deepl/deepl');
const Message = require('../utils/message');
const UserController = require('../controllers/userController');

class Bot {
  constructor(botTelegram) {
    this.bot = botTelegram;
  }

  async startCommand(chat) {
    try {
      bot.sendMessage(
        chat.id,
        'Будь ласка, додайте свою локацію.\nНаприклад: 🏙️<b>Київ, Україна</b>\nАбо просто надішліть ваше місце розташування📍',
        {
          parse_mode: 'HTML',
          reply_markup: {
            keyboard: [['🌦️Погода'] /*['⚙️Налаштування']*/],
            resize_keyboard: true,
          },
        },
      );
    } catch (e) {
      console.error(`Error startCommand: ${e}`);
    }
  }

  sendWeather(id, res, locale) {
    try {
      bot.sendMessage(id, Message.sendWeather(res, locale), {
        parse_mode: 'HTML',
      });
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

        switch (text) {
          case '/start': {
            this.startCommand(chat);
            break;
          }
          case '🌦️Погода': {
            if (user.location.name) {
              const res = await weather.current(user.location.name);
              return this.sendWeather(chat.id, res, user.locale);
            }
            this.startCommand(chat);
            break;
          }
          case '⚙️Налаштування': {
            this.bot.sendMessage(chat.id, '⚙️Цей розділ у розробці!', {});
            break;
          }
          default: {
            const transed = await translator(text);
            const res = await weather.current(transed);
            const { location } = res;

            if (location) {
              await UserController.updateLocation(from.id, location);
              return this.sendWeather(chat.id, res);
            }
            return this.bot.sendMessage(chat.id, 'Спробуйте ще раз🔍');
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
        return this.bot.sendMessage(chat.id, 'Спробуйте ще раз🔍');
      } catch (e) {
        console.error(`Error onLocation: ${e}`);
        this.bot.sendMessage(chat.id, 'Виникла помилка❤️‍🩹');
      }
    });
  }

  init() {
    this.onText();
    this.onLocation();
  }
}

module.exports = new Bot(bot);
