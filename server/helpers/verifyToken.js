
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const language = require('./language').language;

module.exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  const lang = req.body.lang;
  const t = language[lang];

  if (!token) {
    return res.status(403).send({
      auth: false, 
      message: t['no token provided']
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: t('failed to authenticate')
      });
    }
    req.user = decoded;
    next();
  });
};
