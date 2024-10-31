// i18nConfig.js
// eslint-disable-next-line import/no-extraneous-dependencies
const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'uk'],
  directory: path.join('locales'),
  defaultLocale: 'uk',
  objectNotation: true,
});

module.exports = i18n;
