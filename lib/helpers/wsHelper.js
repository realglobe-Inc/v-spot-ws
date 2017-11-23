/**
 * Helper for ws
 */
'use strict'

const callTypes = {
  RES: 'call:res',
  REQ: 'call:req'
}

module.exports = Object.assign(exports, {
  call (ws, id, method, params) {
    const isRes = (data) => data.type === callTypes.RES && String(data.id) === id
    return new Promise((resolve, reject) => {
      function onMessage (message) {
        const data = JSON.parse(message)
        if (isRes(data)) {
          ws.removeListener('message', onMessage)
          const {error, result} = data
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        }
      }

      ws.send(JSON.stringify({
        type: callTypes.REQ,
        method,
        params,
        id
      }))
      ws.addListener('message', onMessage)
    })
  },
  proxy (ws, target) {
    ws.on('message', async function onMessage (message) {
      const data = JSON.parse(message)
      if (data.type === callTypes.REQ) {
        const {method, params, id} = data
        const {result, error} = await target[method](...params)
          .then((result) => ({result}))
          .catch((error) => ({error: String(error)}))
        ws.send(JSON.stringify({
          type: callTypes.RES,
          id,
          result,
          error
        }))
      }
    })
  }
})