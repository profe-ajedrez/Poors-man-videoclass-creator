const config = require('../config/config')
const winston = require('winston')

const logger = new winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs.log' })
  ]
})

if (config.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

module.exports.logRequest = (req, res, next) => {
  logger.info(req.url)
  next()
}

module.exports.logError = (err, req, res, next) => {
  logger.error(err)
  next()
}

module.exports.logConsoleOnDev = msg => {
  if (config.env == 'development') {
    console.log(msg)
  }
}

module.exports.logger = logger
