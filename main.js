const express = require('express')
const app = express()

const AsteriskV1Router = require('./routers/asterisk/v1')

/* Serve VueJs app (in public/dist) on the default route */
app.use(express.static(__dirname + '/public/dist'))

app.use('/api/asterisk', AsteriskV1Router)

var port = process.env.PORT || 5000
app.listen(port)

console.log('Server started on port ' + port)
