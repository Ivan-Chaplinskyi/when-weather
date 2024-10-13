/* eslint-disable camelcase */
class Message {
  sendWeather(res) {
    const {
      location: { name, country },
      current: {
        temp_c,
        last_updated,
        wind_kph,
        condition: { text },
      },
    } = res;

    return `🏙️ <b>${name}, ${country}</b>\n☁️${text}\n🌡️Температура: ${temp_c} °C\n🍃Швидкість вітру: ${wind_kph} км/год\n<b>Останнє оновлення:</b> <code>${last_updated}</code>`;
  }
}

module.exports = new Message();
