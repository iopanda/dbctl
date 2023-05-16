const constants = require('../../../common/constants')

const addEvnet = async (client, event) => {
    const cql = `INSERT INTO ${constants.SYSDB_NAME}.event (event_id,type,info,created_at) VALUES ('${event.id}','${event.type}', '${event.info}', currentTimestamp())`
    await client.execute(cql)
}

const getEvent = async (client, eventId) => {
    const cql = `SELECT event_id,type,info,created_at FROM ${constants.SYSDB_NAME}.event WHERE event_id = '${eventId}'`
    const rs = (await client.execute(cql)).first()
    return {
        id: rs['event_id'],
        type: rs['type'],
        info: rs['info'],
        createdAt: rs['created_at']
    }
}

module.exports = {
    addEvnet: addEvnet,
    getEvent: getEvent
}