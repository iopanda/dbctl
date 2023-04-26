const Client = require('./driver/client')
const localConfig = require('../../config/localConfig')
const envConfig = require('../../config/envConfig')
const scripts = require('./script')
const schemas = require('./script/schemas')

const getDbInfo = async context_name => {
    const context = localConfig.getContext(context_name)
    if(!context.credentials) context.credentials = {}
    context.credentials.username = envConfig.getUsername() || context.credentials.username
    context.credentials.password = envConfig.getPassword() || context.credentials.password
    context.keyspace = envConfig.getDatabase() || context.keyspace
    const client = Client(context)

    try{
        // 1. Get Cassandra Version
        const versionResult = await client.execute(scripts.getVersionSql())
        const version = `v${versionResult.first().get('version')[0]}`

        // 2. Get Data
        const local = (await client.execute(scripts.getInfoSqls(version).local)).rows
        const catalogs = (await client.execute(scripts.getInfoSqls(version).catalogs)).rows
        const tables = (await client.execute(scripts.getInfoSqls(version).tables)).rows
        const columns = (await client.execute(scripts.getInfoSqls(version).columns)).rows

        // 3. Convert to a better structure for rebuild
        const converted = {
            local: local.map(schemas[version].local.handler)[0],
            catalogs: catalogs.map(schemas[version].catalog.handler),
            tables: tables.map(schemas[version].tables.handler),
            columns: columns.map(schemas[version].columns.handler)
        }

        // 4. Rebuild Structure
        const result = {}
        result.database = converted.local
        result.database.catalogs = converted.catalogs
        result.database.catalogs.map(cat => {
            cat.tables = converted.tables.filter(tab => tab.catalog == cat.name).map(tab => {
                tab.columns = converted.columns.filter(col => col.catalog == cat.name && col.table == tab.name).map(col => {
                    delete col.catalog
                    delete col.table
                    return col
                })
                delete tab.catalog
                return tab
            })
            return cat
        })

        return result
    }catch(err){
        throw err
    }finally{
        client.shutdown()
    }
}

module.exports = {
    init: (options) => {},
    getDbInfo: getDbInfo,
    executeSql: (sql) => {}
}