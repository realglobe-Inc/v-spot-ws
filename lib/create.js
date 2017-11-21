/**
 * Create a VSpotWS instance
 * @function create
 * @param {...*} args
 * @returns {VSpotWS}
 */
'use strict'

const VSpotWS = require('./VSpotWS')
const VSpotWSServer = require('./VSpotWSServer')
const VSpotWSClient = require('./VSpotWSClient')

/** @lends create */
function create (...args) {
  return new VSpotWS(...args)
}

Object.assign(create, {
  server (...args) {
    return new VSpotWSServer(...args)
  },
  client (...args) {
    return new VSpotWSClient(...args)
  }
})

module.exports = create
