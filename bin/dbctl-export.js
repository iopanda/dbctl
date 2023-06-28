const { Command, Option } = require('commander')
const localConfig = require('../src/config/localConfig')
const printer = require('../src/common/printer')
const app = require('../src/app')

const cmd = new Command().name('export').description('export all schemas from your database')

cmd
.addOption(new Option('-o --output <format>', 'output format').choices(['json', 'yaml']).default('json'))
.action(async (options) => {
    const rs = await app.export(options.output)
    printer[options.output](rs)
})

module.exports = cmd