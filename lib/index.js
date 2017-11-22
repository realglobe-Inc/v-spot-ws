/**
 * Web socket implemantion of v-spot
 * @module v-spot-ws
 */
'use strict'

const VSpotWs = require('./VSpotWs')
const create = require('./create')

const lib = create.bind(this)

Object.assign(lib, create, {
  VSpotWs,
  create
})

module.exports = lib
