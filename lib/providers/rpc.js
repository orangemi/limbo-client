'use strict'
const axon = require('axon-tls')
const rpc = require('axon-rpc')
const EventEmitter = require('events').EventEmitter

function getRpcClient (conn, options) {
  var client, req
  if (options == null) {
    options = {}
  }
  req = axon.socket('req')
  client = new rpc.Client(req)
  if (options.tls) {
    req.set('tls', options.tls)
  }
  req.set('max retry', 10)
  req.connect(conn)
  return client
}

module.exports = Rpc
function Rpc (options) {
  EventEmitter.call(this)
  this._group = options.group
}

Rpc.prototype.connect = function (conn, callback) {
  if (typeof conn === 'string') this._client = getRpcClient(conn)
  else this._client = getRpcClient(conn.url, conn)
  let group = this._group
  let self = this

  this._client.sock.on('error', function (error) {
    return self.emit('error', error)
  })
  this._client.sock.on('close', function () {
    return self.emit('error', new Error('remote rpc closed'))
  })

  this.methods(function (err, methods) {
    if (err) return self.emit('error', err)
    if (methods == null) methods = {}
    for (let eventName in methods) {
      let tmp = eventName.split('.')

      let _group = tmp.shift()
      let modelName = tmp.shift()
      let methodName = tmp.shift()
      if (_group !== group) continue
      self[modelName] = self[modelName] || {}
      self[modelName][methodName] = function () {
        let args = Array.prototype.slice.call(arguments)
        args.unshift(eventName)
        self.call.apply(self, args)
      }
      self[modelName][methodName + 'Async'] = function () {
        let args = Array.prototype.slice.call(arguments)
        args.unshift(eventName)
        return new Promise(function (resolve, reject) {
          args.push(function (err, result) {
            if (err) return reject(err)
            return resolve(result)
          })
          return self._client.call.apply(self, args)
        })
      }
    }
    callback(err, methods)
    self.emit('connect')
  })
}

Rpc.prototype.methods = function (callback) {
  this._client.methods(callback)
}
