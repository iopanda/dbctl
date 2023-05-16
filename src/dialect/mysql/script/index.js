const fs = require('fs-extra')
const loader = require('../../../script/loader')
const constants = require('../../../common/constants')
const config = require('../../../config/localConfig')
const Client = require('../../../dialect/mysql/driver/client')

const schemas = require('./schemas')
const getVersionSql = () => `SELECT version AS version`

const getInfoSqls = version => {
    return {
        local: `SELECT ${schemas[version].local.fields.join(',')} FROM mysql.db`,
        catalogs: `SELECT ${schemas[version].catalog.fields.join(',')} FROM information_schema.SCHEMATA`,
        tables: `SELECT ${schemas[version].tables.fields.join(',')} FROM information_schema.TABLES`,
        columns: `SELECT ${schemas[version].columns.fields.join(',')} FROM information_schema.COLUMNS`
    }
}

// TODO: enhance the db access to use only one in below 2 functions
const getInstallSqls = async contextName => {
    const values = {
        SYSKS: constants.SYSDB_NAME,
        TABLE_OPTS: '',
        VERSION: constants.VERSION
    }   
    return loader.loadFileContent(`${constants.PATH.PROOT}/src/dialect/mysql/script/install.sql`, values)
}

const getUninstallSqls = async contextName => {
    const values = {
        SYSKS: constants.SYSDB_NAME,
        TABLE_OPTS: '',
        VERSION: constants.VERSION
    }   
    return loader.loadFileContent(`${constants.PATH.PROOT}/src/dialect/mysql/script/uninstall.sql`, values)
}

module.exports = {
    getVersionSql: getVersionSql,
    getInfoSqls: getInfoSqls,
    getInstallSqls: getInstallSqls,
    getUninstallSqls: getUninstallSqls
}