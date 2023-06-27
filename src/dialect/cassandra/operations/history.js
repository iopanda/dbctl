const constants = require('../../../common/constants')

class History {
    constructor(client, data){
        this.client = client
        this.id = data.id
        this.before = data.before
        this.after = data.after
    }

    async save(){
        const cql = `INSERT INTO ${constants.SYSDB_NAME}.history (id,before,after,created_at) VALUES ('${this.id}','${this.before}', '${this.after}', currentTimestamp())`
        return await this.client.execute(cql)
    }
}

History.find = async (client, data) => {
    const cql = `SELECT id,before,after,created_at FROM ${constants.SYSDB_NAME}.history WHERE id = '${data.id}'`
    const rs = (await client.execute(cql)).first()
    return new History(client, {
        id: rs['id'],
        before: rs['before'],
        after: rs['after'],
        createdAt: rs['created_at']
    })
}

History.create = async (client) => {
    const cql = `CREATE TABLE ${constants.SYSDB_NAME}.history (id TEXT,before TEXT,after TEXT,created_at TIMESTAMP,PRIMARY KEY (id) )`
    const rs = await client.execute(cql)
    return rs
}

History.drop = async (client) => {
    const cql = `DROP TABLE ${constants.SYSDB_NAME}.history`
    const rs = await client.execute(cql)
    return rs
}

module.exports = History