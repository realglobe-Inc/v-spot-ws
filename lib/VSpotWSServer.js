/**
 * Server instance
 * @augments VSpotServer
 * @class VSpotWSServer
 */
'use strict'

const {VSpotServer} = require('v-spot')
const WebSocket = require('ws')
const uuid = require('uuid')
const {wsCall, wsProxy, wsAlive} = require('shiba-ws-util')
const debug = require('debug')('v:spot:ws:server')

/** @lends VSpotWSServer */
class VSpotWSServer extends VSpotServer {
  constructor () {
    super(...arguments)
    const s = this
    s.keepAliveInterval = 3 * 1000
  }

  async listen (port) {
    debug('listen', port)
    const s = this
    if (s.wss) {
      throw new Error(`Already open!`)
    }
    s.wss = new WebSocket.Server({port})
    s.wss.on('connection', async function onConnection (ws) {
      ws.invalidate = wsAlive(ws)

      const clientId = uuid.v4()
      const connector = await s.asConnector(clientId, {
        async execute (config) {
          debug('execute', config)
          const id = uuid.v4()
          return await wsCall(ws, id, 'execute', [config])
        },
        subjects: []
      })
      wsProxy(ws, {
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

    s.keepAliveTimer = setInterval(() => {
      const {wss} = s
      if (!wss) {
        return
      }
      for (const ws of wss.clients) {
        ws.invalidate()
      }
    }, s.keepAliveInterval)

  }

  async close () {
    const s = this
    s.wss.close()
    s.wss = null
    clearInterval(s.keepAliveTimer)
    s.keepAliveTimer = null
  }
}

module.exports = VSpotWSServer
