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
const wsHelper = require('./helpers/wsHelper')

/** @lends VSpotWSClient */
class VSpotWSClient extends VSpotClient {
  async connect (url) {
    const s = this
    if (typeof url === 'object') {
      url = formatUrl(Object.assign({
        protocol: 'http',
        hostname: 'localhost'
      }, url))
    }
    const ws = new WebSocket(url)
    const connector = await new Promise((resolve, reject) => {
      ws.on('open', async function onOpen () {
        wsHelper.proxy(ws, {
          async execute (config) {
            return s.execute(config)
          }
        })
        ws.on('close', async function onClose () {
          s.ws = null
        })
        await wsHelper.call(ws, uuid.v4(), 'setSubjects', [Object.keys(s.loaded)])
        resolve({
          async call (config) {
            return await wsHelper.call(ws, uuid.v4(), 'call', [config])
          },
          async disconnect () {
            ws.close()
            s.ws = null
          }
        })
      })
      ws.on('error', (e) => reject(new Error(e)))
    })
    s.ws = ws
    return super.connect(connector)
  }

  async disconnect () {
    const s = this
    if (s.ws) {
      s.ws.close()
      s.ws = null
    }
    await super.disconnect()
  }
}

module.exports = VSpotWSClient
