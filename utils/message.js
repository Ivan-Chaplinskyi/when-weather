/* eslint-disable camelcase */
const locales = require('./locales');

class Message {
  sendWeather(res, locale) {
    locales.setLocale(locale);
    const {
      location: { name, country },
      current: {
        temp_c,
        last_updated,
        wind_kph,
        condition: { text },
      },
    } = res;

    return `
    🏙️ <b>${name}, ${country}</b>
    \n☁️${text}
    \n🌡️${locales.__('sendWeather.temp')}: ${temp_c} °C
    \n🍃${locales.__('sendWeather.wind_speed')}: ${wind_kph} ${locales.__('sendWeather.type_speed')}
    \n<b>${locales.__('sendWeather.last_update')}:</b> <code>${last_updated}</code>`
      .replace(/\n\s+/g, '\n')
      .trim();
  }
}

module.exports = new Message();
