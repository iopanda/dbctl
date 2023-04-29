const constants = require('../../../common/constants')

const getLastScriptName = async (client) => {
    const cql = `SELECT lsn from ${constants.SYSDB_NAME}.version WHERE id = 0`
    const rs = await client.execute(cql)
    return rs.first().get('lsn')
}

const updateLastScriptName = async (client, sn) => {
    const cql = `UPDATE ${constants.SYSDB_NAME}.version SET lsn = '${sn}' WHERE id = 0`
    const rs = await client.execute(cql)
}

module.exports = {
    getLastScriptName: getLastScriptName,
    updateLastScriptName: updateLastScriptName
}