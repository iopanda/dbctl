const Client = require('./driver/client')
const localConfig = require('../../config/localConfig')
const envConfig = require('../../config/envConfig')
const scripts = require('./script')
const schemas = require('./script/schemas')
const loader = require('../../script/loader')
const uuid = require('uuid').v4
const { Base64 } = require('js-base64')
const {Audit, Event, Meta, Repo, Version} = require('./operations')


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
        client.shutdown()
        return result
    }catch(err){
        throw err
    }finally{
        client.shutdown()
    }
}

const executeSqls = async (contextName, sqls) => {
    const context = localConfig.getContext(contextName)
    const client = Client(context)
    const result = []
    try{
        const result = []
        for(let i in sqls){
            result.push(await client.execute(sqls[i]))
        }
        client.shutdown()
        return result
    }catch(err){
        throw err
    }finally{
        client.shutdown()
    }
}

const executeSqlsWithClient = async (client, sqls) => {
    const result = []
    for(let i in sqls){
        result.push(await client.execute(sqls[i]))
    }
    return result
}

const executeSql = async (contextName, sql) => {
    const context = localConfig.getContext(contextName)
    const client = Client(context)
    try{
        const result = await client.execute(sql)
        client.shutdown()
        return result
    }catch(err){
        throw err
    }finally{
        client.shutdown()
    }
}

const executeScript = async (contextName, parsedScriptArray, values = process.env) => {
    const context = localConfig.getContext(contextName)
    const client = Client(context)
    const eventId = uuid()
    
    const before = await getDbInfo(contextName)
    await Event.addEvnet(client, {
        id: eventId,
        type: 'commit',
        info: JSON.stringify(parsedScriptArray.map(it => it.name))
    })

    for(let i in parsedScriptArray){
        const currentScript = parsedScriptArray[i]
        await Repo.addRepo(client, {
            id: currentScript.name,
            eventId: eventId,
            commitContent: currentScript.commit.raw,
            rollbackContent: currentScript.rollback.raw
        })
        await executeSqlsWithClient(client, currentScript.commit.sqls)
    }

    const after = await getDbInfo(contextName)
    await Audit.addAudit(client, {
        id: eventId,
        before: Base64.encode(JSON.stringify(before)),
        after: Base64.encode(JSON.stringify(after))
    })
    await Version.updateLastScriptName(client, parsedScriptArray[parsedScriptArray.length-1].name)
    client.shutdown()
}

module.exports = {
    getDbInfo: getDbInfo,
    executeSqls: executeSqls,
    executeSql: executeSql,
    executeScript: executeScript,
    executeSqlsWithClient: executeSqlsWithClient
}