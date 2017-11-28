/**
 * Server instance
 * @augments VSpotServer
 * @class VSpotWSServer
 */
'use strict'

const {VSpotServer} = require('v-spot')
const WebSocket = require('ws')
const uuid = require('uuid')
const wsHelper = require('./helpers/wsHelper')
const debug = require('debug')('v:spot:ws')

/** @lends VSpotWSServer */
class VSpotWSServer extends VSpotServer {
  async listen (port) {
    debug('listen', port)
    const s = this
    if (s.wss) {
      throw new Error(`Already open!`)
    }
    s.wss = new WebSocket.Server({port})
    s.wss.on('connection', async function onConnection (ws) {
      const clientId = uuid.v4()
      const connector = await s.asConnector(clientId, {
        async execute (config) {
          debug('execute', config)
          const id = uuid.v4()
          return await wsHelper.call(ws, id, 'execute', [config])
        },
        subjects: []
      })
      wsHelper.proxy(ws, {
        async call (config) {
          debug('call', config)
          return connector.call(config)
        },
        async setSubjects (subjects) {
          debug('setSubjects', subjects)
          const client = s.$$getClient(clientId)
          if (client) {
            client.subjects = subjects
          }
        }
      })
      ws.on('close', async function onClose () {
        debug('close')
        connector.disconnect()
      })
    })
  }

  async close () {
    const s = this
    s.wss.close()
    s.wss = null
  }
}

module.exports = VSpotWSServer
