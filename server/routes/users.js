const express = require('express')
const usersRouter = express.Router()
// const User = require('../models/User);
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const language = require('../helpers/language')
const config = require('../config/config');
const { logger } = require('../helpers/logger')
const { getErrorMsg } = require('../helpers/errorMessages');

const { verifyToken } = require('../helpers/verifyToken');
const { Router } = require('express')

usersRouter.get(
  '/testAuth', 
  verifyToken, 
  (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.status(500).json({success: false, message: "there was a problem finding the user"});
    }
    if (!user) {
      if (!user) return res.status(404).json({success: false, message: "No user found."});
    }
    const responseUser = user.toJSON();
    responseUser.password = '0';
    return res.status(200).send(responseUser);
  });
});


usersRouter.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

usersRouter.route('/register').post((req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  const lang = req.body.lang;
  const t = language.language[lang];

  User.addUser(newUser, (err, user) => {
    if (err) {
      logger.error(err)
      res.status(400).json({ success: false, msg: getErrorMsg(err, lang, t['failed to register user'])});
    } else {
      res.status(200).json({ success: true, msg: t['user registered']});
    }
  }); 
});


usersRouter.route('/authenticate').post((req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const lang = req.body.lang
  const t = language.language[lang]

  User.getUserByUsername(username, (err, user) => {
    if (err) {
      logger.error(err)
      throw err
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: t['user not found']
      })
    }

    User.comparePassword(password, user.password, (err, arePasswordMatched) => {
      if (err) {
        logger.error(err)
        throw err
      }

      if (arePasswordMatched) {
        const responseUser = { 
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        };
        const token = jwt.sign(responseUser, config.secret, {
          expiresIn: 86400
        })

        return res.json({
          success: true,
          token: `JWT ${token}`,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      }

      return res.status(401).json({ success: false, msg: t['wrong password'] })
    })
  })
})

module.exports = usersRouter;
