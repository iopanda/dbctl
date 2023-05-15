const constants = require('../../../common/constants')

const getVersionByNamespace = async (client, namespace) => {
    const cql = `SELECT schema_version from ${constants.SYSDB_NAME}.namespaces WHERE namespace = '${namespace}'`
    const rs = await client.execute(cql)
    return rs.first().get('version')
}

const updateVersionByNamespace = async (client, namespace, newVersion) => {
    const cql = `UPDATE ${constants.SYSDB_NAME}.namespaces SET schema_version = '${newVersion}' WHERE namespace = '${namespace}'`
    const rs = await client.execute(cql)
}

module.exports = {
    getVersionByNamespace: getVersionByNamespace,
    updateVersionByNamespace: updateVersionByNamespace
}