const constants = require('../../../common/constants')

class Event {
    constructor(client, data){
        this.client = client
        this.id = data.id
        this.type = data.type
        this.info = data.info
    }

    async save(){
        const cql = `INSERT INTO ${constants.SYSDB_NAME}.event (event_id,type,info,created_at) VALUES ('${this.id}','${this.type}', '${this.info}', currentTimestamp())`
        const rs = await this.client.execute(cql)
        return rs
    }
}

Event.find = async (client, data) => {
    const cql = `SELECT event_id,type,info,created_at FROM ${constants.SYSDB_NAME}.event WHERE event_id = '${data.id}'`
    const rs = (await client.execute(cql)).first()
    return new Event(client, {
        id: rs['event_id'],
        type: rs['type'],
        info: rs['info'],
        createdAt: rs['created_at']
    })
}

Event.create = async (client) => {
    const cql = `CREATE TABLE ${constants.SYSDB_NAME}.event ( event_id TEXT, type TEXT, info TEXT, created_at TIMESTAMP, PRIMARY KEY (event_id) )`
    const rs = await client.execute(cql)
    return rs
}

Event.drop = async (client) => {
    const cql = `DROP TABLE ${constants.SYSDB_NAME}.event`
    const rs = await client.execute(cql)
    return rs
}

module.exports = Event