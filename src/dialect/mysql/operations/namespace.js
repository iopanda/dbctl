const constants = require('../../../common/constants')

const getVersionByNamespace = async (client, namespace) => {
    const cql = `SELECT schema_version from ${constants.SYSDB_NAME}.namespaces WHERE namespace = '${namespace}'`
    const rs = await client.execute(cql)
    return (rs.first() && rs.first().get('schema_version')) || null
}

const updateVersionByNamespace = async (client, namespace, newVersion) => {
    const cql = `UPDATE ${constants.SYSDB_NAME}.namespaces SET schema_version = '${newVersion}', updated_at = currentTimestamp() WHERE namespace = '${namespace}'`
    const rs = await client.execute(cql)
}

const insertVersionByNamespace = async (client, namespace, newVersion) => {
    const cql = `UPDATE ${constants.SYSDB_NAME}.namespaces SET schema_version = '${newVersion}', created_at = currentTimestamp(), updated_at = currentTimestamp() WHERE namespace = '${namespace}'`
    const rs = await client.execute(cql)
}

module.exports = {
    getVersionByNamespace: getVersionByNamespace,
    updateVersionByNamespace: updateVersionByNamespace,
    insertVersionByNamespace: insertVersionByNamespace
}