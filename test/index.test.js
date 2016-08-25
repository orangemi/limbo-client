'use strict'
const assert = require('assert')
const Limbo = require('limbo').Limbo
const mongoose = require('mongoose')
const tman = require('tman')

var dbName = 'testdb'
var db = require('../lib/limbo').use(dbName, {provider: 'rpc'})
var port = 21018
var originDb

tman.suite('limbo test', function () {
  tman.before(function (callback) {
    mongoose.connect('mongodb://localhost:27017/' + dbName)
    originDb = (new Limbo()).use(dbName, {
      provider: 'mongo',
      conn: mongoose.connection,
      rpcPort: port
    })

    originDb.loadSchemas({
      demo: new mongoose.Schema({
        string: { type: String, default: '' },
        number: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
      })
    })

    originDb.listen({}, callback)
  })

  tman.it('connect', function (callback) {
    db.connect({
      url: 'tcp://localhost:' + port
    }, callback)
  })

  tman.it('methods', function () {
    assert(db.demo)
    assert(db.demo.model)
    assert(db.demo.modelAsync)
    assert(db.demo.discriminator)
    assert(db.demo.discriminatorAsync)
    assert(db.demo.setMaxListeners)
    assert(db.demo.setMaxListenersAsync)
    assert(db.demo.getMaxListeners)
    assert(db.demo.getMaxListenersAsync)
    assert(db.demo.emit)
    assert(db.demo.emitAsync)
    assert(db.demo.addListener)
    assert(db.demo.addListenerAsync)
    assert(db.demo.on)
    assert(db.demo.onAsync)
    assert(db.demo.prependListener)
    assert(db.demo.prependListenerAsync)
    assert(db.demo.once)
    assert(db.demo.onceAsync)
    assert(db.demo.prependOnceListener)
    assert(db.demo.prependOnceListenerAsync)
    assert(db.demo.removeListener)
    assert(db.demo.removeListenerAsync)
    assert(db.demo.removeAllListeners)
    assert(db.demo.removeAllListenersAsync)
    assert(db.demo.listeners)
    assert(db.demo.listenersAsync)
    assert(db.demo.listenerCount)
    assert(db.demo.listenerCountAsync)
    assert(db.demo.eventNames)
    assert(db.demo.eventNamesAsync)
    assert(db.demo.init)
    assert(db.demo.initAsync)
    assert(db.demo.ensureIndexes)
    assert(db.demo.ensureIndexesAsync)
    assert(db.demo.remove)
    assert(db.demo.removeAsync)
    assert(db.demo.find)
    assert(db.demo.findAsync)
    assert(db.demo.findById)
    assert(db.demo.findByIdAsync)
    assert(db.demo.findOne)
    assert(db.demo.findOneAsync)
    assert(db.demo.count)
    assert(db.demo.countAsync)
    assert(db.demo.distinct)
    assert(db.demo.distinctAsync)
    assert(db.demo.where)
    assert(db.demo.whereAsync)
    assert(db.demo['$where'])
    assert(db.demo['$whereAsync'])
    assert(db.demo.findOneAndUpdate)
    assert(db.demo.findOneAndUpdateAsync)
    assert(db.demo.findByIdAndUpdate)
    assert(db.demo.findByIdAndUpdateAsync)
    assert(db.demo.findOneAndRemove)
    assert(db.demo.findOneAndRemoveAsync)
    assert(db.demo.findByIdAndRemove)
    assert(db.demo.findByIdAndRemoveAsync)
    assert(db.demo.create)
    assert(db.demo.createAsync)
    assert(db.demo.insertMany)
    assert(db.demo.insertManyAsync)
    assert(db.demo.hydrate)
    assert(db.demo.hydrateAsync)
    assert(db.demo.update)
    assert(db.demo.updateAsync)
    assert(db.demo.mapReduce)
    assert(db.demo.mapReduceAsync)
    assert(db.demo.geoNear)
    assert(db.demo.geoNearAsync)
    assert(db.demo.aggregate)
    assert(db.demo.aggregateAsync)
    assert(db.demo.geoSearch)
    assert(db.demo.geoSearchAsync)
    assert(db.demo.populate)
    assert(db.demo.populateAsync)
    assert(db.demo.compile)
    assert(db.demo.compileAsync)
  })

  let instance
  tman.it('db.demo.create', function (callback) {
    db.demo.create({}, function (err, one) {
      assert.ifError(err)
      instance = one
      callback()
    })
  })

  tman.it('db.demo.createAsync', function (callback) {
    db.demo.createAsync({}).then(function (one) {
      callback()
    }, function () {
      assert(new Error('should not run'))
    })
  })

  tman.it('db.demo.find', function (callback) {
    db.demo.find({_id: instance._id}, function (err, list) {
      assert.ifError(err)
      let one = list[0]
      assert.equal(one._id, instance._id)
      assert.equal(one.string, instance.string)
      assert.equal(one.date, instance.date)
      callback()
    })
  })

  tman.it('db.demo.findAsync', function (callback) {
    db.demo.findAsync({_id: null}).then(function (one) {
      callback()
    }, function () {
      assert(new Error('should not run'))
    })
  })
})
