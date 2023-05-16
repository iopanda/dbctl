const constants = require('../../../common/constants')

const getLastScriptName = async (client) => {
    const cql = `SELECT version from ${constants.SYSDB_NAME}.version WHERE id = 0`
    const rs = await client.execute(cql)
    return rs.first().get('version')
}

const updateLastScriptName = async (client, sn) => {
    const cql = `UPDATE ${constants.SYSDB_NAME}.version SET version = '${sn}' WHERE id = 0`
    const rs = await client.execute(cql)
}

module.exports = {
    getLastScriptName: getLastScriptName,
    updateLastScriptName: updateLastScriptName
}