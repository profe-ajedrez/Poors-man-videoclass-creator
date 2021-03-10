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
  secret: 'B2BCE1045A7DCB96BB276BE7C41E9DD327F9462106C618796E17C0AE52ED9337'
}

module.exports = config
