const dialect = require('./dialect')
const localConfig = require('../src/config/localConfig')


module.exports = {
    apply: async (scriptFolder, valueName, namespace) => {
        const context = localConfig.getCurrentContextName()
        const config = localConfig.getConfigObject()[context]
        
        await dialect[config.dialect].apply(config, scriptFolder, namespace, valueName)
    },
    config: {
        init: () => {},
        set: (name, value, type) => {
            return localConfig.setPropertyValue(name, value, type)
        },
        currentContext: () => {
            return localConfig.getCurrentContextName()
        },
        getContext: (name) => {
            if(!localConfig.configExisted()){
                console.error(`Config is not found.`)
                process.exit(1)
            }else if(!localConfig.getConfigObject()[name]){
                console.error(`Context ${name} is not exist.`)
                process.exit(2)
            }
            return localConfig.getContext(name)
        },
        useContext: (name) => {
            if(!localConfig.getConfigObject()[name]){
                console.error(`Context ${name} is not exist.`)
                process.exit(2)
            }
            return localConfig.setCurrentContext(name)
        }
    },
    diff: () => {},
    export: async () => {
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
        return await database[dialect].getDbInfo(contextName)
    },
    get: {
        tables: async (catalog) => {
            const context = localConfig.getCurrentContextName()
            const config = localConfig.getConfigObject()[context]
            const result = await dialect[config.dialect].getTables(context, catalog)
            console.log(JSON.stringify(result, null, 4))
            return result
        },
        table: async (catalog, table) => {
            const context = localConfig.getCurrentContextName()
            const config = localConfig.getConfigObject()[context]
            const result = await dialect[config.dialect].getTable(context, catalog, table)
            console.log(JSON.stringify(result, null, 4))
            return result
        },
        views: async (catalog) => {
            const context = localConfig.getCurrentContextName()
            const config = localConfig.getConfigObject()[context]
            const result = await dialect[config.dialect].getViews(context, catalog)
            return result
        },
        view: async (catalog, view) => {
            const context = localConfig.getCurrentContextName()
            const config = localConfig.getConfigObject()[context]
            const result = await dialect[config.dialect].getView(context, catalog, view)
            console.log(JSON.stringify(result, null, 4))
            return result
        }
    },
    install: async () => {
        const context = localConfig.getCurrentContextName()
        const config = localConfig.getConfigObject()[context]
        await dialect[config.dialect].install(context)
    },
    uninstall: async () => {
        const context = localConfig.getCurrentContextName()
        const config = localConfig.getConfigObject()[context]
        await dialect[config.dialect].uninstall(context)
    }
}