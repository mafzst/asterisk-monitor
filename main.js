const express = require('express')
const app = express()

/* Serve VueJs app (in public/dist) on the default route */
app.use(express.static(__dirname + '/public/dist'))

var port = process.env.PORT || 5000;
app.listen(port);

console.log('Server started on port ' + port)
