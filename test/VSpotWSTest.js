/**
 * Test for VSpotWS.
 * Runs with mocha.
 */
'use strict'

const VSpotWS = require('../lib/VSpotWS')
const {ok, equal} = require('assert')
const aport = require('aport')
describe('v-spot-w-s', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const port = await aport()
    const server = new VSpotWS.Server()
    const client01 = new VSpotWS.Client()
    const client02 = new VSpotWS.Client()
    try {
      {
        class Person {
          async hi (msg) {
            return `hi, ${msg}`
          }
        }

        // Create a instance to a spot
        const john = client01.load(Person, 'jp.realglobe.new-york.john')
        await john.hi('I am in NewYork!')
      }

      await server.listen(port)

      await client01.connect(`http://localhost:${port}`)
      await client02.connect(`http://localhost:${port}`)

      {
        // Use remote instance
        const john = await client02.use('jp.realglobe.new-york.john')
        equal(
          await john.hi('Calling from Japan!'),
          'hi, Calling from Japan!'
        )
      }
    } finally {

      await client01.disconnect()
      await client02.disconnect()

      await server.close()
    }
  })
})

/* global describe, before, after, it */
