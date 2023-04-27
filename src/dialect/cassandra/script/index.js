const fs = require('fs-extra')
const loader = require('../../../script/loader')
const constants = require('../../../common/constants')
const config = require('../../../config/localConfig')
const Client = require('../../../dialect/cassandra/driver/client')

const schemas = require('./schemas')
const getVersionSql = () => `SELECT release_version AS version FROM system.local`

const getInfoSqls = version => {
    return {
        local: `SELECT ${schemas[version].local.fields.join(',')} FROM system.local`,
        catalogs: `SELECT ${schemas[version].catalog.fields.join(',')} FROM system_schema.keyspaces`,
        tables: `SELECT ${schemas[version].tables.fields.join(',')} FROM system_schema.tables`,
        columns: `SELECT ${schemas[version].columns.fields.join(',')} FROM system_schema.columns`
    }
}

// TODO: enhance the db access to use only one in below 2 functions
const getInstallSqls = async contextName => {
    const cql = `SELECT replication FROM system_schema.keyspaces WHERE keyspace_name = 'system_auth'`
    const ctx = config.getContext(contextName)
    const client = Client(ctx)
    const rs = (await client.execute(cql)).first()
    client.shutdown()

    const values = {
        SYSKS: constants.SYSDB_NAME,
        REPLICATION: JSON.stringify(rs.get('replication')).replaceAll('"', "'"),
        TABLE_OPTS: ''
    }   
    return loader.loadFileContent(`${constants.PATH.PROOT}/src/dialect/cassandra/script/install.sql`, values).sqls
}

const getUninstallSqls = async contextName => {
    const cql = `SELECT replication FROM system_schema.keyspaces WHERE keyspace_name = 'system_auth'`
    const ctx = config.getContext(contextName)
    const client = Client(ctx)
    const rs = (await client.execute(cql)).first()
    client.shutdown()

    const values = {
        SYSKS: constants.SYSDB_NAME,
        REPLICATION: JSON.stringify(rs.get('replication')).replaceAll('"', "'"),
        TABLE_OPTS: ''
    }   
    return loader.loadFileContent(`${constants.PATH.PROOT}/src/dialect/cassandra/script/uninstall.sql`, values).sqls
}

module.exports = {
    getVersionSql: getVersionSql,
    getInfoSqls: getInfoSqls,
    getInstallSqls: getInstallSqls,
    getUninstallSqls: getUninstallSqls
}