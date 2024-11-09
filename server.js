// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const botActions = require('./telegramBot/botActions');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// eslint-disable-next-line no-console
mongoose
  .connect(db)
  .then(() => console.log('DB connection successfull!'))
  .then(() => botActions.init());
