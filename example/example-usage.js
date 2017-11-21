'use strict'

const vSpotWS = require('v-spot-ws')

async function tryExample () {
  const port = 8080
  const Spot = vSpotWS()

  const NewYork = vSpotWS.clinet()
  const Japan = vSpotWS.clinet()

  await Spot.listen(port)

  await NewYork.connect(`http://localhost:${port}`)
  await Japan.connect(`http://localhost:${port}`)

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
