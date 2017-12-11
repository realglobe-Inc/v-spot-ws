/**
 * Test for VSpotWS.
 * Runs with mocha.
 */
'use strict'

const VSpotWS = require('../lib/VSpotWS')
const {ok, equal} = require('assert')
const aport = require('aport')
const asleep = require('asleep')

describe('v-spot-w-s', function () {
  this.timeout(8000)

  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const port = await aport()
    const server = new VSpotWS.Server()
    server.keepAliveInterval = 300
    const client01 = new VSpotWS.Client()
    const client02 = new VSpotWS.Client()
    const client03 = new VSpotWS.Client()
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

      try {
        await client03.connect(`http://localhost:${port}`)
        {
          // Use remote instance
          const john = await client03.use('jp.realglobe.new-york.john')
          equal(
            await john.hi('Calling from Japan!'),
            'hi, Calling from Japan!'
          )

          await client01.disconnect()

          await john.hi('Calling from Japan!') // Try after disconnect
        }
        await client03.disconnect()
      } catch (e) {
        console.error(e)
      }

      await asleep(800)
      console.log('hoge')
      await server.close()
    }
  })
})

/* global describe, before, after, it */
