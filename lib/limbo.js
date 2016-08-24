'use strict'
function Limbo () {
  this._providers = {}
}

Limbo.prototype.use = function (group, options) {
  if (options == null) {
    options = {}
  }

  if (!this._providers[group]) {
    let provider = options.provider || 'rpc'
    let Provider = require('./providers/' + provider)
    options.group = group
    this._providers[group] = new Provider(options)
  }
  return this._providers[group]
}

const limbo = module.exports = new Limbo()
limbo.Limbo = Limbo
