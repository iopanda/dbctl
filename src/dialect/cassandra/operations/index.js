const constants = require('../../../common/constants')



const createCatalog = async (client, replication) => {
    const cql = `CREATE KEYSPACE IF NOT EXISTS ${constants.SYSDB_NAME} WITH REPLICATION = ${replication}`
    const rs = await client.execute(cql)
    return rs
}

const dropCatalog = async (client) => {
    const cql = `DROP KEYSPACE ${constants.SYSDB_NAME}`
    const rs = await client.execute(cql)
    return rs
}

module.exports = {
    History: require('./history'),
    Event: require('./event'),
    Meta: require('./meta'),
    Repo: require('./repo'),
    Version: require('./version'),
    Namespace: require('./namespace'),
    createCatalog: createCatalog,
    dropCatalog: dropCatalog
}