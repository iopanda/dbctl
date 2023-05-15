const constants = require('../../../common/constants')

const addAudit = async (client, audit) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.history (id,before,after,created_at) VALUES ('${audit.id}','${audit.before}', '${audit.after}', currentTimestamp())`
    await client.execute(cql)
}

const getAudit = async (client, id) => {
    const cql = `SELECT id,before,after,created_at FROM ${constants.SYSDB_NAME}.history WHERE id = '${id}'`
    const rs = (await client.execute(cql)).first()
    return {
        id: rs['id'],
        before: rs['before'],
        after: rs['after'],
        createdAt: rs['created_at']
    }
}

module.exports = {
    addAudit: addAudit,
    getAudit: getAudit
}