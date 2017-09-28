const prod = require('./prod.js')
const dev = require('./dev.js')

module.exports = Object.assign({}, prod, dev)
