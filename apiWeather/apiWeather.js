const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const keyWeather = process.env.API_KEY_WEATHER;

class Weather {
  constructor(key) {
    this.key = key;
    this.baseUrl = 'http://api.weatherapi.com/v1';
  }

  async current(location, locale) {
    try {
      const res = await fetch(
        `${this.baseUrl}/current.json?key=${this.key}&q=${location}&lang=${locale}`,
      );
      const data = await res.json();
      return data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Error Weather: ${e}`);
    }
  }
}

module.exports = new Weather(keyWeather);
