const Client = require('./driver/client')
const localConfig = require('../../config/localConfig')
const envConfig = require('../../config/envConfig')
const scripts = require('./script')
const schemas = require('./script/schemas')
const loader = require('../../script/loader')

const getDbInfo = async contextName => {
    const context = localConfig.getContext(contextName)
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
        result.database.replication = catalogs.filter(it => it.name = 'system_auth')[0].replication
        result.database.catalogs = converted.catalogs
        result.database.catalogs.map(cat => {
            cat.tables = converted.tables.filter(tab => tab.catalog == cat.name).map(tab => {
                tab.columns = converted.columns.filter(
                    col => col.catalog == cat.name && col.table == tab.name
                ).map(col => {
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

const executeSql = async (contextName, rawSql, values = process.env) => {
    // TODO: not so easy
    const context = localConfig.getContext(contextName)
    const sql = loader.replaceVariables(rawSql, values)
    const client = Client(context)
    const rs = await client.execute(sql)
    client.shutdown()
    return rs
}

const executeScript = async (contextName, scriptObj, values = process.env) => {
    //TODO: Execute SQL and manage the version
}

module.exports = {
    getDbInfo: getDbInfo,
    executeSql: executeSql,
    executeScript: executeScript
}