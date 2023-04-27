const { Command, Option } = require('commander')
const localConfig = require('../src/config/localConfig')
const printer = require('../src/common/printer')
const cmd = new Command().name('config').description('change configuration')

cmd.command('init').action(() => {
    localConfig.createConfigFile()
    localConfig.writeConfigFile({})
})

cmd.command('set').argument('<name>', 'Property name')
.argument('[value]', 'Property value')
.addOption(new Option('-t --type <type>', 'Value Type').choices(['string', 'object']).default('string'))
.action((name, value, options) => {
    localConfig.setPropertyValue(name, value, options.type == 'object')
})

cmd.command('current-context')
.action(() => {
    const name = localConfig.getCurrentContextName()
    console.log(name)
})

cmd.command('get-context')
.argument('<name>', 'Context Name')
.addOption(new Option('-o --output <format>', 'Output Format').choices(['json', 'yaml']).default('json'))
.action((name, options) => {
    if(!localConfig.configExisted()){
        console.error(`Config is not found.`)
        process.exit(1)
    }else if(!localConfig.getConfigObject()[name]){
        console.error(`Context ${name} is not exist.`)
        process.exit(2)
    }
    const context = localConfig.getContext(name)
    printer[options.output](context)
})

cmd.command('use-context')
.argument('<name>', 'Context Name')
.action((name) => {
    if(!localConfig.getConfigObject()[name]){
        console.error(`Context ${name} is not exist.`)
        process.exit(2)
    }
    localConfig.setCurrentContext(name)
})

module.exports = cmd