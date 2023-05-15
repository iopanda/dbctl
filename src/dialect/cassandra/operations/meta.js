const constants = require('../../../common/constants')

const addMeta = async (client, meta) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.meta (key,value,created_at,updated_at) 
    VALUES ('${meta.key}', '${meta.value}', currentTimestamp(), currentTimestamp())`
    await client.execute(cql)
}

const updateMeta = async (client, meta) => {
    const cql = `UPDATE ${constants.SYSDB_NAME}.meta 
    SET value = '${meta.value}', updated_at = currentTimestamp() WHERE key = '${meta.key}'`
    await client.execute(cql)
}

const getMeta = async (client, key) => {
    const cql = `SELECT key,value,created_at,updated_at from ${constants.SYSDB_NAME}.meta WHERE key = '${key}'`
    const rs = (await client.execute(cql)).first()
    return {
        key: rs['key'],
        value: rs['value'],
        createdAt: rs['created_at'],
        udpatedAt: rs['updated_at']
    }
}

module.exports = {
    addMeta: addMeta,
    getMeta: getMeta,
    updateMeta: updateMeta
}