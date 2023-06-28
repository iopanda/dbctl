const { Command, Option } = require('commander')
const localConfig = require('../src/config/localConfig')
const printer = require('../src/common/printer')
const cmd = new Command().name('config').description('change configuration')
const app = require('../src/app')

cmd.command('init')
.action(() => {
    localConfig.createConfigFile()
    localConfig.writeConfigFile({})
})

cmd.command('set').argument('<name>', 'Property name')
.argument('[value]', 'Property value')
.addOption(new Option('-t --type <type>', 'Value Type').choices(['string', 'object']).default('string'))
.action((name, value, options) => {
    app.config.set(name, value, options.type == 'object')
})

cmd.command('current-context')
.action(() => {
    const rs = app.config.currentContext()
    console.log(rs)
})

cmd.command('get-context')
.argument('<name>', 'Context Name')
.addOption(new Option('-o --output <format>', 'Output Format').choices(['json', 'yaml']).default('json'))
.action((name, options) => {
    const context = app.config.getContext(name)
    printer[options.output](context)
})

cmd.command('use-context')
.argument('<name>', 'Context Name')
.action((name) => {
    app.config.useContext(name)
})

module.exports = cmd