const config = require('../../config/index')
const Asterisk = require('../../classes/asterisk')

Asterisk.init(config.asterisk)

const basicCommand = (req, res) => {
  const command = req.params.command
  // res.json({
  //   status: 'ok'
  // })
  Asterisk.sendRequest(command, (response, status) => res.status(status || 200).json(response))
}

const router = require('express').Router()
const TAG = 'Asterisk V1'


const filterEndpoints = (req, res, next) => {
  if (req.params.command && config.amiEndpoints.indexOf(req.params.command) < 0) {
    res.status(404).json({
      status: 'not found',
      msg: '/' + req.params.command + ': command not found'
    })
  } else {
    next()
  }
}

router.use((req, res, next) => {
  console.log('[' + TAG + '] ' + req.originalUrl)
  next()
})
router.get('/:command', filterEndpoints, basicCommand)

module.exports = router
