const dotenv = require('dotenv');
const TelegramBotApi = require('node-telegram-bot-api');

dotenv.config({ path: './config.env' });

const bot = new TelegramBotApi(process.env.TOKEN_BOT, { polling: true });

module.exports = bot;
