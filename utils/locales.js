// eslint-disable-next-line import/no-extraneous-dependencies
const i18n = require('i18n');
const path = require('path');

module.exports = i18n.configure({
  locales: ['en', 'uk'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'uk',
  objectNotation: true,
});
