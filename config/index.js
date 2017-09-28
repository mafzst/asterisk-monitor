module.exports = {
  asterisk: {
    host: process.env.ASTERISK_HOST || '192.168.1.11',
    port: process.env.ASTERISK_PORT || 5038,
    username: process.env.ASTERISK_USERNAME || 'hello',
    password: process.env.ASTERISK_PASSWORD || 'world'
  },
  amiEndpoints: ['ping', 'sippeers', 'originate', 'queues']
}
