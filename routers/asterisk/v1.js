const config = require('../../config/index')

const basicCommand = (req, res) => {
  const command = req.params.command
  res.locals.Asterisk.sendRequest(command, (response, status) => res.set({'Access-Control-Allow-Origin': '*'}).status(status || 200).json(response))
}

const postCommand = (req, res) => {
  const command = req.params.command
  const params = req.body
  res.locals.Asterisk.postRequest(command, params, (response, status) => res.set({'Access-Control-Allow-Origin': '*'}).status(status || 200).json(response))
}

const options = (req, res) => res.set({'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Origin': '*'}).status(200).end()

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
router.post('/:command', filterEndpoints, postCommand)
router.options('/:command', filterEndpoints, options)

module.exports = router
