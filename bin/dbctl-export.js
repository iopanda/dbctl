const { Command } = require('commander')

const cmd = new Command().name('export').description('export all schemas from your database')
cmd.command('xxx').action(() => {})

module.exports = cmd