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

module.exports = {
    getVersionSql: getVersionSql,
    getInfoSqls: getInfoSqls
}