/* eslint-disable no-console */
const bot = require('../telegramBot/telegramBotApi');
const locale = require('../utils/locales');
const keyboard = require('../utils/keyboard');
const userController = require('./userController');

class CallbackQuery {
  changeLang(from) {
    const localeUser = from.locale || from.language_code;
    locale.setLocale(localeUser);
    bot.sendMessage(
      from.id,
      locale.__('settingsKeyboad.change_lang'),
      keyboard.changeLang(localeUser),
    );
  }

  async switchLang(from, lang) {
    try {
      const res = await userController.updateLocale(from.id, lang);
      locale.setLocale(res.locale);
      bot.sendMessage(
        from.id,
        locale.__('settingsKeyboad.lang_changed'),
        keyboard.defaultKeyboard(res.locale),
      );
    } catch (e) {
      console.log(`Error switchUK: ${e}`);
    }
  }
}

module.exports = new CallbackQuery();
