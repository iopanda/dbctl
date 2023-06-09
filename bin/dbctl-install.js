const { Command, Option } = require('commander')
const localConfig = require('../src/config/localConfig')

const cmd = new Command()
.name('install')
.description('Install dbctl in your managed database')
.addOption(new Option('-f --force', 'Force Install'))
.action(async opts => {
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

    if(opts.force){
        const uninstallScript = await rawScript.getUninstallSqls(contextName)
        await database.executeSqls(contextName, uninstallScript.sqls)
    }

    const installScript = await rawScript.getInstallSqls(contextName)
    await database.executeSqls(contextName, installScript.sqls)
})

module.exports = cmd