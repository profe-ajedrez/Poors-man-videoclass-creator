/**
 * config.js
 *
 * Expone configuración de la app
 */

'use strict'

const ENV_SOURCE = `${__dirname}/config.env`
const process = require('process')
const dotenv = require('dotenv')

dotenv.config({ path: ENV_SOURCE })

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.DATABASE,
  secret: process.env.SECRET
}

module.exports = config
