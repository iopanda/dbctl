const constants = require('../../../common/constants')

const addEvnet = async (client, event) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.event (eid,typ,info,cts) VALUES ('${event.id}','${event.type}', '${event.info}', currentTimestamp())`
    await client.execute(cql)
}

const getEvent = async (client, eventId) => {
    const cql = `SELECT eid,typ,info,cts FROM ${constants.SYSDB_NAME}.event WHERE eid = '${eventId}'`
    const rs = (await client.execute(cql)).first()
    return {
        id: rs['eid'],
        type: rs['typ'],
        info: rs['info'],
        createdAt: rs['cts']
    }
}

module.exports = {
    addEvnet: addEvnet,
    getEvent: getEvent
}