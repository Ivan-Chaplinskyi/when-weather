// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./index');
const botActions = require('./telegramBot/botActions');

botActions.init();

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// eslint-disable-next-line no-console
mongoose.connect(db).then(() => console.log('DB connection successfull!'));

// eslint-disable-next-line no-console
setInterval(() => console.log('Server working...'), 30000);

const port = process.env.PORT || 8000;

app.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(`Server started: https://127.0.0.1:${port}`),
);
