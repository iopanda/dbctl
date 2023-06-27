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
        set: (name, value, type) => {},
        currentContext: () => {},
        getContext: (contextName) => {},
        useContext: () => {}
    },
    diff: () => {},
    export: () => {},
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
    install: () => {
        
    },
    uninstall: () => {}
}