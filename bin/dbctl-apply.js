const { Command } = require('commander')

const cmd = new Command().name('apply').description('apply change to database')
cmd.command('xxx').action(() => {})

module.exports = cmd