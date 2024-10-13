const deepl = require('deepl-node');

const authKey = process.env.DEEPL_KEY;

async function translator(text, lang = 'en-US') {
  try {
    const result = await new deepl.Translator(authKey).translateText(
      text,
      null,
      lang,
    );

    return result.text;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Error: ${e}`);
  }
}

module.exports = translator;
