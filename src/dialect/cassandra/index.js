const Client = require('./driver/client')
const localConfig = require('../../config/localConfig')
const envConfig = require('../../config/envConfig')
const scripts = require('./script')
const schemas = require('./script/schemas')
const loader = require('../../script/loader')
const uuid = require('uuid').v4
const { Base64 } = require('js-base64')
const { History, Event, Meta, Repo, Version, Namespace, createCatalog, dropCatalog } = require('./operations')
const path = require('path')
const constants = require('../../common/constants')

const getDbInfo = async contextName => {
    const context = localConfig.getContext(contextName)
    if (!context.credentials) context.credentials = {}
    context.credentials.username = envConfig.getUsername() || context.credentials.username
    context.credentials.password = envConfig.getPassword() || context.credentials.password
    context.keyspace = envConfig.getDatabase() || context.keyspace
    const client = Client(context)

    try {
        // 1. Get Cassandra Version
        const versionResult = await client.execute(scripts.getVersionSql())
        const version = `v${versionResult.first().get('version')[0]}`

        // 2. Get Data
        const local = (await client.execute(scripts.getInfoSqls(version).local)).rows
        const catalogs = (await client.execute(scripts.getInfoSqls(version).catalogs)).rows
        const tables = (await client.execute(scripts.getInfoSqls(version).tables)).rows
        const columns = (await client.execute(scripts.getInfoSqls(version).columns)).rows
        const EXCLUDED_KS = ['system', 'system_auth', 'system_distributed', 'system_schema', 'system_traces', 'system_views', 'system_virtual_schema', 'dbctl']
        // 3. Convert to a better structure for rebuild
        const converted = {
            local: local.map(schemas[version].local.handler)[0],
            catalogs: catalogs.map(schemas[version].catalogs.handler).filter(it => EXCLUDED_KS.indexOf(it.name) == -1),
            tables: tables.map(schemas[version].tables.handler).filter(it => EXCLUDED_KS.indexOf(it.name) == -1),
            columns: columns.map(schemas[version].columns.handler).filter(it => EXCLUDED_KS.indexOf(it.name) == -1)
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
    } catch (err) {
        throw err
    } finally {
        client.shutdown()
    }
}

const getDbInfoWithConfig = async config => {
    // const context = localConfig.getContext(contextName)
    // if (!context.credentials) context.credentials = {}
    // context.credentials.username = envConfig.getUsername() || context.credentials.username
    // context.credentials.password = envConfig.getPassword() || context.credentials.password
    // context.keyspace = envConfig.getDatabase() || context.keyspace
    const client = Client(config)

    try {
        // 1. Get Cassandra Version
        const versionResult = await client.execute(scripts.getVersionSql())
        const version = `v${versionResult.first().get('version')[0]}`

        // 2. Get Data
        const local = (await client.execute(scripts.getInfoSqls(version).local)).rows
        const catalogs = (await client.execute(scripts.getInfoSqls(version).catalogs)).rows
        const tables = (await client.execute(scripts.getInfoSqls(version).tables)).rows
        const columns = (await client.execute(scripts.getInfoSqls(version).columns)).rows
        const EXCLUDED_KS = ['system', 'system_auth', 'system_distributed', 'system_schema', 'system_traces', 'system_views', 'system_virtual_schema', 'dbctl']
        // 3. Convert to a better structure for rebuild
        const converted = {
            local: local.map(schemas[version].local.handler)[0],
            catalogs: catalogs.map(schemas[version].catalogs.handler).filter(it => EXCLUDED_KS.indexOf(it.name) == -1),
            tables: tables.map(schemas[version].tables.handler).filter(it => EXCLUDED_KS.indexOf(it.name) == -1),
            columns: columns.map(schemas[version].columns.handler).filter(it => EXCLUDED_KS.indexOf(it.name) == -1)
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
    } catch (err) {
        throw err
    } finally {
        client.shutdown()
    }
}

const executeSqls = async (contextName, sqls) => {
    const context = localConfig.getContext(contextName)
    const client = Client(context)
    const result = []
    try {
        const result = []
        for (let i in sqls) {
            result.push(await client.execute(sqls[i]))
        }
        client.shutdown()
        return result
    } catch (err) {
        throw err
    } finally {
        client.shutdown()
    }
}

const executeSqlsWithClient = async (client, sqls) => {
    const result = []
    for (let i in sqls) {
        result.push(await client.execute(sqls[i]))
    }
    return result
}

const executeSql = async (contextName, sql) => {
    const context = localConfig.getContext(contextName)
    const client = Client(context)
    try {
        const result = await client.execute(sql)
        client.shutdown()
        return result
    } catch (err) {
        throw err
    } finally {
        client.shutdown()
    }
}

const executeScript = async (contextName, parsedScriptArray, namespace = "default") => {
    const context = localConfig.getContext(contextName)
    const client = Client(context)
    const eventId = uuid()

    const currentVersion = await Namespace.find(client, {
        namespace: namespace
    }).version || ""

    const filteredScriptArray = parsedScriptArray.filter(it => it.name > currentVersion)

    // execution start
    const before = await getDbInfo(contextName)
    await new Event(client, {
        id: eventId,
        type: 'commit',
        info: JSON.stringify(filteredScriptArray.map(it => it.name))
    }).save()

    try {
        for (let i in filteredScriptArray) {
            const currentScript = filteredScriptArray[i]
            await new Repo(client, {
                namespace: namespace,
                id: currentScript.name,
                eventId: eventId,
                commitContent: currentScript.commit.raw,
                rollbackContent: currentScript.rollback.raw
            }).save()
            await executeSqlsWithClient(client, currentScript.commit.sqls)
            await new Namespace(client, {
                namespace: namespace,
                version: currentScript.name
            }).save()
        }
        const after = await getDbInfo(contextName)
        await new History(client, {
            id: eventId,
            before: Base64.encode(JSON.stringify(before)),
            after: Base64.encode(JSON.stringify(after))
        }).save()
        // execution end
    } catch (err) {
        console.error(`Failed. ${err.message}`)
        console.error(err)
    } finally {
        client.shutdown()
    }
}

const getReplication = async (contextName) => {
    const cql = `SELECT replication FROM system_schema.keyspaces WHERE keyspace_name = 'system_auth'`
    const ctx = localConfig.getContext(contextName)
    const client = Client(ctx)
    const rs = (await client.execute(cql)).first()
    client.shutdown()
    return JSON.stringify(rs.get('replication')).replaceAll('"', "'")
}

module.exports = {
    getDbInfo: getDbInfo,
    executeSqls: executeSqls,
    executeSql: executeSql,
    executeScript: executeScript,
    executeSqlsWithClient: executeSqlsWithClient,

    // ---------------------------------------------------
    getTables: async (context, catalog) => {
        const dbInfo = await getDbInfo(context)
        return dbInfo.database.catalogs.filter(it => it.name == catalog)
    },
    getTable: async (context, catalog, table) => {
        const dbInfo = await getDbInfo(context)
        return dbInfo.database.catalogs
            .filter(it => it.name == catalog)[0]
            .tables.filter(it => it.name == table)[0]
    },
    getViews: async (context, catalog) => {
        console.error(`Get view is not supported for Cassandra yet.`)
        return false
    },
    getView: async (context, catalog, view) => {
        console.error(`Get view is not supported for Cassandra yet.`)
        return false
    },
    install: async (context) => {
        const replication = await getReplication(context)
        const config = localConfig.getContext(context)
        const client = Client(config)
        await createCatalog(client, replication)
        await Event.create(client, replication)
        await History.create(client, replication)
        await Meta.create(client, replication)
        await Namespace.create(client, replication)
        await Repo.create(client, replication)
        await Version.create(client, replication)
        client.shutdown()
    },
    uninstall: async (context) => {
        const config = localConfig.getContext(context)
        const client = Client(config)
        await dropCatalog(client)
        client.shutdown()
    },
    apply: async (config, folderName, namespace, values) => {

        const baseDir = path.resolve(constants.PATH.CWD, folderName)
        const vo = loader.getYamlValuesByGivenName(baseDir, values)

        const client = Client(config)
        const nv = await Namespace.findOne(client, {
            namespace: namespace
        })

        const flist = loader.getSqlFilePathSortedList(folderName)

        const completedScriptDict = {}
        const uncompletedMessages = []
        // Check unavailable file name
        flist.forEach(it => {
            const clips = it.name.split('.')
            if (clips.length != 2) {
                uncompletedMessages.push({
                    name: it.name,
                    message: `Naming of file ${it.name} is not follow standard. Please follow the naming <NAME>.<commit|rollback>.sql `
                })
            } else if(!nv || clips[0] > nv.version){
                const scriptName = clips[0]
                const scriptMode = clips[1]
                const content = loader.loadFileContent(path.format(it), vo)
                if (!completedScriptDict[scriptName]) {
                    completedScriptDict[scriptName] = { name: scriptName }
                }
                completedScriptDict[scriptName][scriptMode] = content
            }
        })
        const scriptArray = loader.convertDictToArray(completedScriptDict).sort(loader.ascSort)
        scriptArray.forEach(it => {
            if(!it.commit){
                uncompletedMessages.push({
                    name: it.name,
                    message: `Script ${it.name} is not completed. Please add file named ${it.name}.commit>.sql`
                })
            }
            if(!it.rollback){
                uncompletedMessages.push({
                    name: it.name,
                    message: `Script ${it.name} is not completed. Please add file named ${it.name}.rollback.sql`
                })
            }
        })
        
        // execute start
        const before = await getDbInfoWithConfig(config)
        const eventId = uuid()
        await new Event(client, {
            id: eventId,
            type: 'commit',
            info: JSON.stringify(scriptArray.map(it => it.name))
        }).save()

        try {
            for (let i in scriptArray) {
                const currentScript = scriptArray[i]
                await new Repo(client, {
                    namespace: namespace,
                    id: currentScript.name,
                    eventId: eventId,
                    commitContent: currentScript.commit.raw,
                    rollbackContent: currentScript.rollback.raw
                }).save()
                await executeSqlsWithClient(client, currentScript.commit.sqls)
                await new Namespace(client, {
                    namespace: namespace,
                    version: currentScript.name
                }).save()
            }
            const after = await getDbInfoWithConfig(config)
            await new History(client, {
                id: eventId,
                before: Base64.encode(JSON.stringify(before)),
                after: Base64.encode(JSON.stringify(after))
            }).save()
            // execution end
        } catch (err) {
            console.error(`Failed. ${err.message}`)
            console.error(err)
        } finally {
            client.shutdown()
        }

    }
}