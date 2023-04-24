const { Command } = require('commander')

const cmd = new Command().name('diff').description('compare schema between database and your scripts')
cmd.command('xxx').action(() => {})

module.exports = cmd