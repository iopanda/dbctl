const { Command, Option } = require('commander')
const localConfig = require('../src/config/localConfig')
const app = require('../src/app')

const cmd = new Command().name('apply').description('apply change to database')

cmd
.addOption(new Option('-f --folder <folder>', 'script folder location'))
.addOption(new Option('-v --value <value>', 'name of values'))
.addOption(new Option('-n --namespace <namespace>', 'namesapce').default('default'))
.action((options) => {
    if(!options.folder){
        console.log(`Please use "-f <file>" to specify the folder of script(s).`)
        process.exit(3)
    }
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

    app.apply(options.folder, options.value, options.namespace)
})

module.exports = cmd