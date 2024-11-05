/* eslint-disable no-console */
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const keyWeather = process.env.API_KEY_WEATHER;

class WeatherController {
  constructor(key) {
    this.key = key;
    this.baseUrl = 'http://api.weatherapi.com/v1';
  }

  async findCoordinates(location) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_CLOUD_API}`,
      );
      const data = await res.json();
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lon: lng };
    } catch (e) {
      console.log(`Error Weather: ${e}`);
    }
  }

  async current(location, locale) {
    try {
      const res = await fetch(
        `${this.baseUrl}/current.json?key=${this.key}&q=${location}&lang=${locale}`,
      );
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(`Error Weather: ${e}`);
    }
  }
}

module.exports = new WeatherController(keyWeather);
