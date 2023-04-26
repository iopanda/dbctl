const {Client} = require('cassandra-driver')
module.exports = options => new Client(options)