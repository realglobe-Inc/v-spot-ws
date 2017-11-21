/**
 * @class VSpotWS
 */
'use strict'

const VSpotWSServer = require('./VSpotWSServer')
const VSpotWSClient = require('./VSpotWSClient')

/** @lends VSpotWS */
class VSpotWS extends VSpotWSServer {
}

Object.assign(VSpotWS, {
  Server: VSpotWSServer,
  Client: VSpotWSClient
})

module.exports = VSpotWS
