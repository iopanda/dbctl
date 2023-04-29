const constants = require('../../../common/constants')

const addMeta = async (client, meta) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.meta (key,val,cts,uts) 
    VALUES ('${meta.key}', '${meta.value}', currentTimestamp(), currentTimestamp())`
    await client.execute(cql)
}

const updateMeta = async (client, meta) => {
    const cql = `UPDATE ${constants.SYSDB_NAME}.meta 
    SET val = '${meta.value}', uts = currentTimestamp() WHERE key = '${meta.key}'`
    await client.execute(cql)
}

const getMeta = async (client, key) => {
    const cql = `SELECT key,val,cts,uts from ${constants.SYSDB_NAME}.meta WHERE key = '${key}'`
    const rs = (await client.execute(cql)).first()
    return {
        key: rs['key'],
        value: rs['val'],
        createdAt: rs['cts'],
        udpatedAt: rs['uts']
    }
}

module.exports = {
    addMeta: addMeta,
    getMeta: getMeta,
    updateMeta: updateMeta
}