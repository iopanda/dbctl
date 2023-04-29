const constants = require('../../../common/constants')

const addAudit = async (client, audit) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.audit (aid,bfs,afs,cts) VALUES ('${audit.id}','${audit.before}', '${audit.after}', currentTimestamp())`
    await client.execute(cql)
}

const getAudit = async (client, id) => {
    const cql = `SELECT aid,bfs,afs,cts FROM ${constants.SYSDB_NAME}.audit WHERE aid = '${id}'`
    const rs = (await client.execute(cql)).first()
    return {
        id: rs['aid'],
        before: rs['bfs'],
        after: rs['afs'],
        createdAt: rs['cts']
    }
}

module.exports = {
    addAudit: addAudit,
    getAudit: getAudit
}