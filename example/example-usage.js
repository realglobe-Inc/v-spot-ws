'use strict'

const vSpotWS = require('v-spot-ws')

async function tryExample () {
  const Spot = vSpotWS()

  const NewYork = vSpotWS.clinet()
  const Japan = vSpotWS.clinet()

  await Spot.listen()
  await NewYork.connect(Spot)
  await Japan.connect(Spot)

  {
    class Person {
      async hi (msg) {
        return `hi, ${msg}`
      }
    }

    // Create a instance to a spot
    const john = NewYork.load(Person, 'jp.realglobe.new-york.john')
    await john.hi('I am in NewYork!')
  }

  {
    // Use remote instance
    const john = await Japan.use('jp.realglobe.new-york.john')
    await john.hi('Calling from Japan!')
  }
}

tryExample().catch((err) => console.error(err))
