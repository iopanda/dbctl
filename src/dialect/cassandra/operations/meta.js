const constants = require('../../../common/constants')

class Meta {
    constructor(client, data) {
        this.client = client
        this.key = data.key
        this.value = data.value
    }

    async save(){
        const cql = `INSERT INTO ${constants.SYSDB_NAME}.meta (key,value,created_at,updated_at) VALUES ('${this.key}', '${this.value}', currentTimestamp(), currentTimestamp())`
        await this.client.execute(cql)
    }
}

Meta.find = async (client, data) => {
    const cql = `SELECT key,value,created_at,updated_at from ${constants.SYSDB_NAME}.meta WHERE key = '${data.key}'`
    const rs = (await client.execute(cql)).first()
    return new Meta(client, {
        key: rs['key'],
        value: rs['value'],
        createdAt: rs['created_at'],
        udpatedAt: rs['updated_at']
    })
}

Meta.create = async (client) => {
    const cql = `CREATE TABLE ${constants.SYSDB_NAME}.meta ( key TEXT, value TEXT, created_at TIMESTAMP, updated_at TIMESTAMP, PRIMARY KEY (key))`
    const rs = await client.execute(cql)
    return rs
}

Meta.drop = async (client) => {
    const cql = `DROP TABLE ${constants.SYSDB_NAME}.meta`
    const rs = await client.execute(cql)
    return rs
}

module.exports = Meta