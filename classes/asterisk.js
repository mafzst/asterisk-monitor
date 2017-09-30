const SIPPeerKeys = [
  'objectname',
  'ipaddress',
  'ipport',
  'status',
  'description'
]

const AsteriskAmi = require('asterisk-ami')

let ami
const requestsStack = {}

const preventTimeout = request => setTimeout(() => {
    request.callback({
      status: 'Timedout'
    }, 504)
  },
  3000)

const generateActionId = () => Math.floor(Math.random() * 100000000000000000)

const Asterisk = {
  // Used outside
  init(config) {
    ami = new AsteriskAmi(config)
    ami.on('data', this.amiCallback.bind(this))
    ami.connect()
  },
  sendRequest(action, callback) {
    const ActionId = generateActionId()
    requestsStack[ActionId] = {
      action,
      callback
    }
    ami.send({
      action,
      ActionId
    })
  },
  postRequest(action, params, callback) {
    const ActionId = generateActionId()
    requestsStack[ActionId] = {
      action,
      callback
    }
    let payload = {
      action,
      ActionId
    }

    Object.keys(params).forEach(param => {
      payload[param] = params[param]
    })

    ami.send(payload)
  },
  addSocketClient(client) {
    this.state.clients.push(client)
    client.emit('message', JSON.stringify({
      status: 'Welcome'
    }))
  },

  // State
  state: {
    loggedIn: false,
    peers: [],
    tempStatus: null,
    clients: []
  },

  // Used only internally
  amiCallback(data) {
    if (data.event) {
      this.state.clients.forEach(client => client.emit(data.event, data))
    }

    let request
    if (data.event && data.event === 'SuccessfulAuth') {
      this.state.loggedIn = true
      return
    }
    if (data.event && data.event == 'Shutdown') {
      this.state.loggedIn = false
      return
    }
    if (data.event === 'FullyBooted' || data.message === 'Authentication accepted')
      return
    if (data.actionid && (request = requestsStack[data.actionid]) !== undefined) {
      let response

      if (request.watchdog === undefined) {
        requestsStack[data.actionid].watchdog = preventTimeout(request)
      }

      switch (request.action) {
        case 'ping':
          response = {
            ping: data.ping
          }
          break
        case 'sippeers':
          if (!this.handlePeersList(data).isFinished)
            return
          response = this.state.peers
          break
        default:
          console.log('AMI DATA', data);
      }

      clearTimeout(request.watchdog)
      request.callback({
        status: data.response || 'Success',
        actionId: data.actionid,
        timestamp: parseFloat(data.timestamp || Date.now() / 1000),
        response
      })
      delete requestsStack[data.actionid]
    } else {
      console.log('AMI DATA', data)
    }
  },
  handlePeersList(response) {
    if (response.eventlist === 'start')
      this.state.peers = []

    if (response.event === 'PeerEntry')
      this.state.peers.push(Object.keys(response)
        .filter(key => SIPPeerKeys.includes(key))
        .reduce((peer, key) => {
          peer[key] = response[key]
          return peer
        }, {})
      )
    return {
      isFinished: response.eventlist === 'Complete',
    }
  }
}

module.exports = Asterisk
