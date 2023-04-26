const fs = require('fs-extra')
const loader = require('../../../script/loader')
const constants = require('../../../common/constants')
const schemas = require('./schemas')
const getVersionSql = () => `SELECT release_version AS version FROM system.local`

const getInfoSqls = version => {
    return {
        local: `SELECT ${schemas.v4.local.fields.join(',')} FROM system.local`,
        catalogs: `SELECT ${schemas.v4.catalog.fields.join(',')} FROM system_schema.keyspaces`,
        tables: `SELECT ${schemas.v4.tables.fields.join(',')} FROM system_schema.tables`,
        columns: `SELECT ${schemas.v4.columns.fields.join(',')} FROM system_schema.columns`
    }
}

const getInstallSqls = context => {
    const values = {
        SYSKS: constants.SYSDB_NAME,
        REPLICATION: '',
        TABLE_OPTS: ''
    }
    const sqls = loader.loadFileContent('src/dialect/cassandra/script/install.sql')
}

module.exports = {
    getVersionSql: getVersionSql,
    getInstallSqls: '',
    getUninstallSqls: '',
    getInfoSqls: getInfoSqls
}