const express = require('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());

// app.use('/api/v1/', tourRouter);

app.get('/', (req, res) => res.json({ title: 'Telegram Bot' }));

module.exports = app;
