const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
require('express-ws')(app)

const config = require('./config/index')
const Asterisk = require('./classes/asterisk')

Asterisk.init(config.asterisk)

const bodyParser = require('body-parser')
const AsteriskV1Router = require('./routers/asterisk/v1')

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.locals = {
    io,
    Asterisk
  }
  next()
})

/* Serve VueJs app (in public/dist) on the default route */
app.use(express.static(__dirname + '/public/dist'))

app.use('/api/asterisk', AsteriskV1Router)

io.on('connection', client => {
  console.log('[Socket] New client connected')
  Asterisk.addSocketClient(client)
})

var port = process.env.PORT || 5000
server.listen(port)

console.log('[Main] Server started on port ' + port)
