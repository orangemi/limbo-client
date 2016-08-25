limbo-client
============

RPC Client for [limbo](https://github.com/teambition/limbo)

## Usage

serveice/limbo.js
```
// run the script only once
var limbo = require('limbo-client')
var db = limbo.use('databaseName')
db.connect({
  url: 'tcp://localhost:5700'
}, function (err) {
  if (err) throw new Error(err)
})
```

some/api.js
```
var db = limbo.use('databaseName')
  db.user.findOne({}, function (err, one) {
  ...
})

```

## API
### use(dbName)
return a database provider instance. once the provider connected, it can be used anywhere.

### provider.connect(options, callback)
connect a remote RPC limbo server and fetch model and methods from server.

*NOTICE*: since the connect would only be done once, models and methods would only be fetched once. That means if the server changed schemas and restart, client would not fetch again.

*NOTICE2*: tls Options only for [limbo#dev](https://github.com/teambition/limbo/tree/dev) and it's recommended.

 - options:
   - url(String): `(tcp|tls)://[host]:[port]`, e.g. `tcp://localhost:5700`
   - tls(Object): if url protocal is tls, options should has tls. also see [tls Options](https://nodejs.org/api/tls.html#tls_tls_connect_port_host_options_callback)
 - callback(Function): callback when connected or fail

### provider[model]
return the remote rpc model of limbo. It is more like [mongoose model](http://mongoosejs.com/docs/api.html#model-js).

*Notice1*: since it is a remote model, `model.find` is a simulated method to fetch the document. and the document IS NOT a real `document`, it is `toJSON`ed.

So you CAN NOT use document as a mongoose document to call something like `save` method. Use `db.model.update()` instead. To be honest, it is safer to call `update` than `save` for knowing what you have done to the document.

# Licence
MIT
