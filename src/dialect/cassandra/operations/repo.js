const constants = require('../../../common/constants')

const addRepo = async (client, repo) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.repo (rid,eid,cmt,rbk,cts) 
    VALUES ('${repo.id}', '${repo.eventId}', '${repo.commitContent}', '${repo.rollbackContent}', currentTimestamp())`
    await client.execute(cql)
}

const getRepo = async (client, id) => {
    const cql = `SELECT rid,eid,cmt,rbk,cts from ${constants.SYSDB_NAME}.repo WHERE rid = '${id}'`
    const rs = (await client.execute(cql)).first()
    return {
        id: rs['rid'],
        eventId: rs['eid'],
        commitContent: rs['cmt'],
        rollbackContent: rs['rbk'],
        createdAt: rs['cts']
    }
}


module.exports = {
    addRepo: addRepo,
    getRepo: getRepo
}