const locale = require('./locales');

class Keyboard {
  defaultKeyboard(lang) {
    locale.setLocale(lang);
    return {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [
          [`🌦️${locale.__('buttons.weather')}`],
          [`⚙️${locale.__('buttons.settings')}`],
        ],
        resize_keyboard: true,
      },
    };
  }
}

module.exports = new Keyboard();
