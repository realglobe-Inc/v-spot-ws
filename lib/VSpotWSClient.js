/**
 * Client instance
 * @augments VSpotClient
 * @class VSpotWSClient
 */
'use strict'

const {VSpotClient} = require('v-spot')
const WebSocket = require('ws')
const {format: formatUrl} = require('url')
const uuid = require('uuid')
const {wsCall, wsProxy} = require('shiba-ws-util')
const debug = require('debug')('v:spot:ws:client')

/** @lends VSpotWSClient */
class VSpotWSClient extends VSpotClient {
  constructor () {
    super(...arguments)
    const s = this
    s.keepAliveInterval = 3 * 1000
  }

  async connect (url) {
    const s = this
    if (typeof url === 'object') {
      url = formatUrl(Object.assign({
        protocol: 'http',
        hostname: 'localhost'
      }, url))
    }
    const ws = new WebSocket(url)

    function setAlive (isAlive) {
      ws.isAlive = isAlive
    }

    const connector = await new Promise((resolve, reject) => {
      ws.on('open', async function onOpen () {
        s.emit('open')
        wsProxy(ws, {
          async execute (config) {
            return s.execute(config)
          }
        })
        ws.on('close', async function onClose () {
          s.cleanupWS()
          s.emit('close')
        })

        setAlive(true)
        ws.on('pong', () => {
          setAlive(true)
        })

        await wsCall(ws, uuid.v4(), 'setSubjects', [Object.keys(s.loaded)])
        resolve({
          async call (config) {
            return await wsCall(ws, uuid.v4(), 'call', [config])
          },
          async disconnect () {
            ws.close()
            s.ws = null
          }
        })

      })
      ws.on('error', (e) => {
        s.emit('error', e)
        reject(new Error(e))
      })
    })
    s.ws = ws
    s.startKeepAliveTimer()
    return super.connect(connector)
  }

  async disconnect () {
    const s = this
    s.cleanupWS()
    await super.disconnect()
  }

  startKeepAliveTimer () {
    const s = this
    s.keepAliveTimer = setInterval(() => {
      const {ws} = s
      if (!ws) {
        return
      }
      if (!ws.isAlive) {
        debug('terminate')
        ws.terminate()
        s.cleanupWS()
        s.emit('gone')
        return s.disconnect()
      }
      ws.isAlive = false
      ws.ping('', false, true)
    }, s.keepAliveInterval)
  }

  stopKeepAliveTimer () {
    const s = this
    clearInterval(s.keepAliveTimer)
    s.keepAliveTimer = null
  }

  cleanupWS () {
    const s = this
    if (s.keepAliveTimer) {
      s.stopKeepAliveTimer()
    }
    if (s.ws) {
      s.ws.close()
      s.ws = null
    }
  }
}

module.exports = VSpotWSClient
