const locale = require('./locales');

class Keyboard {
  defaultKeyboard(lang) {
    locale.setLocale(lang);
    return {
      parse_mode: 'HTML',
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [locale.__('buttons.weather')],
          [locale.__('buttons.settings')],
        ],
      },
    };
  }

  settingsKeyboad(lang) {
    locale.setLocale(lang);
    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            {
              text: locale.__('settingsKeyboad.change_lang'),
              callback_data: 'change_lang',
            },
          ],
        ],
      },
    };
  }

  changeLang(lang) {
    locale.setLocale(lang);

    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            {
              text: locale.__('locales.uk'),
              callback_data: 'uk',
            },
          ],
          [
            {
              text: locale.__('locales.en'),
              callback_data: 'en',
            },
          ],
        ],
      },
    };
  }
}

module.exports = new Keyboard();
