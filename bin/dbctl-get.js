const { Command } = require('commander')

const cmd = new Command().name('get').description('get resources')
cmd.command('tables').action(() => {})
cmd.command('table').action(() => {})
cmd.command('views').action(() => {})
cmd.command('view').action(() => {})

module.exports = cmd