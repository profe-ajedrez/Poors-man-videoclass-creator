const language = require('./language').language;

const getMsgFromKeyAndValue = (error, t) => {
  const errorElement = error.keyValue;
  const arrayOfKeys = Object.keys(errorElement);
  const keyErrorElement = arrayOfKeys[0];
  const errorValue = errorElement[keyErrorElement];
  return t['duplicate value'].replace('%KEY%', keyErrorElement).replace('%VALUE%', errorValue);
};

module.exports.getErrorMsg = (error, lang, defaultValue) => {
  const t = language[ lang ];
  if (error.hasOwnProperty('name') && error.name == 'MongoError') {
    if (error.code === 11000) {
      return getMsgFromKeyAndValue(error, t);
    }
  }

  return defaultValue;
};