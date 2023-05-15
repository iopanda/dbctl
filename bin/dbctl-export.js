const { Command, Option } = require('commander')
const localConfig = require('../src/config/localConfig')
const printer = require('../src/common/printer')

const cmd = new Command().name('export').description('export all schemas from your database')

cmd
.addOption(new Option('-o --output <format>', 'output format').choices(['json', 'yaml']).default('json'))
.action(async (options) => {
    const contextName = localConfig.getCurrentContextName()
    if(!contextName){
        console.error(`You didn't select any context, please use "dbctl config use-context <name>" to select a context.`)
        process.exit(3)
    }
    const context = localConfig.getContext(contextName)
    const dialect = context.dialect
    if(!dialect){
        console.error(`The dialect of your database is missing in context "${contextName}", please use "dbctl config set context.${contextName}.dialect <cassandra|mysql> to setup."`)
        process.exit(3)
    }
    const database = require('../src/dialect')
    const rs = await database[dialect].getDbInfo(contextName)
    printer[options.output](rs)
})

module.exports = cmd