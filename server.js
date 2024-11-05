// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./index');
const botActions = require('./telegramBot/botActions');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// eslint-disable-next-line no-console
mongoose.connect(db).then(() => console.log('DB connection successfull!'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  botActions.init();
  // eslint-disable-next-line no-console
  console.log('Bot started');
});
