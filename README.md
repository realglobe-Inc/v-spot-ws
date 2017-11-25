v-spot-ws
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/realglobe-Inc/v-spot-ws
[bd_travis_url]: http://travis-ci.org/realglobe-Inc/v-spot-ws
[bd_travis_shield_url]: http://img.shields.io/travis/realglobe-Inc/v-spot-ws.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/realglobe-Inc/v-spot-ws
[bd_travis_com_shield_url]: https://api.travis-ci.com/realglobe-Inc/v-spot-ws.svg?token=
[bd_license_url]: https://github.com/realglobe-Inc/v-spot-ws/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/realglobe-Inc/v-spot-ws
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/realglobe-Inc/v-spot-ws.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/realglobe-Inc/v-spot-ws.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/realglobe-Inc/v-spot-ws
[bd_gemnasium_shield_url]: https://gemnasium.com/realglobe-Inc/v-spot-ws.svg
[bd_npm_url]: http://www.npmjs.org/package/v-spot-ws
[bd_npm_shield_url]: http://img.shields.io/npm/v/v-spot-ws.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Web socket impl of v-spot

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>

Installation
-----

```bash
$ npm install v-spot-ws --save
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>

Usage
---------

```javascript
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

```


<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/10.API Guide.md.hbs" Start -->

<a name="section-doc-guides-10-a-p-i-guide-md"></a>

API Guide
-----

+ [v-spot-ws@1.0.12](./doc/api/api.md)
  + [create(args)](./doc/api/api.md#v-spot-ws-function-create)
  + [VSpotWS](./doc/api/api.md#v-spot-w-s-class)


<!-- Section from "doc/guides/10.API Guide.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/realglobe-Inc/v-spot-ws/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [v][v_url]
+ [Realglobe, Inc.][realglobe,_inc__url]

[v_url]: https://github.com/realglobe-Inc/v
[realglobe,_inc__url]: http://realglobe.jp

<!-- Links End -->
