/**
 * Web socket implemantion of v-spot
 * @module v-spot-ws
 */
'use strict'

const VSpotWS = require('./VSpotWS')
const create = require('./create')

const lib = create.bind(this)

Object.assign(lib, create, {
  VSpotWS,
  create
})

module.exports = lib
