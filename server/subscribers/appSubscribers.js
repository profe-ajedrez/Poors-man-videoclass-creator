'use strict'

const { logger, logConsoleOnDev } = require('../helpers/logger')

/**
 * registerSuscribers
 *
 * Encapsula los listeners de eventos emitidos por app
 *
 * @param {Express} app
 */
module.exports.register = app => {
  if (!app) {
    logger.warn(
      'No se ha definido el objeto app. Por lo que no se subscribiran eventos'
    )
    return
  }
  /* PUT HERE ALL LISTENERS TO app EVENTS */

  app.on('serverRunning', event => {
    logConsoleOnDev('Running...')
  })

  app.on('dbConnected', event => {
    logConsoleOnDev('connected to DB...')
  })

  app.on('dbConnectionError', error => {
    logConsoleOnDev(error)
  })
}
