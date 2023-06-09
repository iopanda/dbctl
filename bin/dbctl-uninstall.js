const { Command } = require('commander')
const localConfig = require('../src/config/localConfig')

const cmd = new Command()
.name('uninstall')
.description('Uninstall dbctl in your managed database')
.action(async () => {
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
    const database = require('../src/dialect/cassandra')
    const rawScript = require('../src/dialect/cassandra/script')
    const scripts = await rawScript.getUninstallSqls(contextName)
    await database.executeSqls(contextName, scripts.sqls)
})

module.exports = cmd